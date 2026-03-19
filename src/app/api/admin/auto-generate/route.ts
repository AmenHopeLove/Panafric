import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { supabase } from '@/lib/supabase-client';
import { getRandomUnsplashImage } from '@/lib/unsplash-pool';

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');
        const cronSecret = process.env.CRON_SECRET;
        const host = req.headers.get('host');

        // Internal Auth
        const isAuthorized = (cronSecret && authHeader === `Bearer ${cronSecret}`) || 
                           (host?.includes('localhost') || host?.includes('127.0.0.1'));

        if (!isAuthorized) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        // Potential model names to try
        const model = groq('llama-3.1-8b-instant');

        let eventData, ventureData, newsData, insightData;
        let aiUsed = false;

        try {
            const generateSafe = async (prompt: string) => {
                const { text } = await generateText({ 
                    model, 
                    temperature: 0.7, 
                    prompt: prompt + " Respond with ONLY a valid JSON object. No markdown." 
                });
                const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
                return JSON.parse(cleanText);
            };

            console.log("AI ENGINE: Attempting AI generation...");
            const unsplashList = `For image_url, you MUST output ONLY ONE WORD from this exact list representing the topic: health, science, nature, technology, finance, law, education, africa, startup, industry, city, team, corporate, meeting, infrastructure`;

            const isLegalNews = Math.random() < 0.4;
            const newsTopicFocus = isLegalNews 
                ? "The news topic MUST be strictly about Legal and Law (e.g., African jurisprudence, legal frameworks, new legislation, courts)." 
                : "The news topic MUST be about general African affairs (e.g., business, technology, finance, health, environment, infrastructure) and NOT about law.";

            eventData = await generateSafe("Generate PALF webinar event JSON with title, description, event_type (webinar/roundtable), highlights (array).");
            ventureData = await generateSafe("Generate PALF venture JSON with title, location, category (Strategic/Corporate/Governmental).");
            newsData = await generateSafe(`Generate PALF news JSON with title, excerpt, content, category, author, image_url. ${newsTopicFocus} ${unsplashList}`);
            insightData = await generateSafe("Generate PALF insight JSON with title, excerpt, content, category, author, image_url. " + unsplashList);
            
            // Assign mathematically random image from scraped pool
            if (newsData.image_url) newsData.image_url = getRandomUnsplashImage(newsData.image_url);
            if (insightData.image_url) insightData.image_url = getRandomUnsplashImage(insightData.image_url);
            
            // Enforce default author
            newsData.author = "Amen Kingdom";
            insightData.author = "Amen Kingdom";
            
            aiUsed = true;
        } catch (aiError: any) {
            console.error("AI ENGINE: AI failed. Error:", aiError.message);
            return new Response(JSON.stringify({ error: "AI Generation Failed: " + aiError.message }), { status: 500 });
        }

        console.log("AI ENGINE: Database insertion...");
        // Ensuring ID is not manually provided to let Supabase generate UUIDs
        const results = await Promise.all([
            supabase.from('career_events').insert([{ ...eventData, is_active: true }]),
            supabase.from('networking_ventures').insert([{ ...ventureData, is_active: true }]),
            supabase.from('news').insert([{ ...newsData, published_at: new Date().toISOString() }]),
            supabase.from('insights').insert([{ ...insightData, published_at: new Date().toISOString() }])
        ]);

        const errors = results.filter(r => r.error);
        if (errors.length > 0) {
            return new Response(JSON.stringify({ 
                error: "Database storage failed", 
                details: errors[0].error?.message,
                hint: "Ensure RLS policies allow INSERT for the 'anon' key." 
            }), { status: 500 });
        }

        return new Response(JSON.stringify({ 
            message: "Success", 
            aiUsed,
            added: newsData.title 
        }), { status: 200 });

    } catch (error: any) {
        console.error("AI ENGINE: Fatal Error:", error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
