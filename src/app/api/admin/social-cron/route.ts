import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { supabase } from '@/lib/supabase-client';

export const maxDuration = 60;

// This endpoint should be secured via Vercel Cron or a Secret Key
export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');
        const cronSecret = process.env.CRON_SECRET;
        
        // Basic security check
        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
             return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        console.log("SOCIAL CRON: Starting daily auto-pilot...");

        /**
         * 1. FIND THE NEXT ARTICLE TO POST
         * We look for the most recent article that hasn't been logged in 'social_posts'
         */
        const { data: article, error: articleError } = await supabase
            .from('news')
            .select('id, title, excerpt, category')
            .order('published_at', { ascending: false })
            .limit(1)
            .single();

        if (articleError || !article) {
            return new Response(JSON.stringify({ message: "No news found to post." }), { status: 200 });
        }

        // Check if already posted
        const { data: existingPost } = await supabase
            .from('social_posts')
            .select('id')
            .eq('news_id', article.id)
            .single();

        if (existingPost) {
            return new Response(JSON.stringify({ message: "Latest article already posted to social." }), { status: 200 });
        }

        /**
         * 2. GENERATE AI CONTENT
         */
        const model = groq('llama-3.1-8b-instant');
        const prompt = `
            You are a social media manager for Pan Afric Law Firm (PALF).
            Generate a single high-impact social media post for LinkedIn and X based on this news:
            TITLE: ${article.title}
            EXCERPT: ${article.excerpt}
            
            Return ONLY a JSON object:
            {
                "post": "...", 
                "shortText": "..."
            }
        `;

        const { text: aiText } = await generateText({ model, prompt });
        const cleanJson = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
        const drafts = JSON.parse(cleanJson);

        /**
         * 3. BROADCAST TO SOCIAL MEDIA (Via Ayrshare)
         */
        const AYRSHARE_API_KEY = process.env.AYRSHARE_API_KEY;

        if (!AYRSHARE_API_KEY) {
            console.error("SOCIAL CRON: AYRSHARE_API_KEY is missing. Logging to DB only.");
        } else {
            const ayrshareRes = await fetch('https://api.ayrshare.com/api/post', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${AYRSHARE_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    post: drafts.post,
                    platforms: ["linkedin", "twitter", "facebook"],
                    title: article.title
                })
            });
            const ayrData = await ayrshareRes.json();
            console.log("SOCIAL CRON: Ayrshare response:", ayrData);
        }

        /**
         * 4. LOG THE SUCCESS
         */
        await supabase.from('social_posts').insert([{
            news_id: article.id,
            platforms: ["linkedin", "twitter", "facebook"],
            status: AYRSHARE_API_KEY ? 'posted' : 'draft_only',
            generated_content: drafts
        }]);

        return new Response(JSON.stringify({ 
            success: true, 
            message: `Posted: ${article.title}` 
        }), { status: 200 });

    } catch (error: any) {
        console.error("SOCIAL CRON ERROR:", error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
