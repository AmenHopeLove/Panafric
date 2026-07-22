import { google } from '@ai-sdk/google';
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

        const model = google('gemini-2.5-flash');

        const generateSafe = async (prompt: string) => {
            const { text } = await generateText({ 
                model, 
                temperature: 0.7, 
                prompt: prompt + " Respond with ONLY a valid JSON object. No markdown." 
            });
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanText);
        };

        console.log("AI ENGINE: Attempting dedicated News generation...");
        let newsData;
        try {
            const isLegalNews = Math.random() < 0.4;
            const topicFocus = isLegalNews 
                ? "The news topic MUST be strictly about Legal and Law (e.g., African jurisprudence, legal frameworks, new legislation, courts)." 
                : "The news topic MUST be about general African affairs (e.g., business, technology, finance, health, environment, infrastructure) and NOT about law.";

            newsData = await generateSafe(`Generate PALF news JSON with title, excerpt, content, category, author, image_url. 
${topicFocus}
For image_url, you MUST output ONLY ONE WORD from this exact list representing the topic: health, science, nature, technology, finance, law, education, africa, startup, industry, city, team, corporate, meeting, infrastructure.`);
            
            // Assign a mathematically random image from the newly scraped 300-URL pool based on category
            if (newsData.image_url) {
                newsData.image_url = getRandomUnsplashImage(newsData.image_url);
            }
            
            // Enforce default author
            newsData.author = "Amen Kingdom";
        } catch (aiError: any) {
            console.error("AI ENGINE: News AI failed. Error:", aiError.message);
            return new Response(JSON.stringify({ error: "News Generation Failed: " + aiError.message }), { status: 500 });
        }

        console.log("AI ENGINE: Database insertion for News...");
        const result = await supabase.from('news').insert([{ ...newsData, published_at: new Date().toISOString() }]);

        if (result.error) {
            return new Response(JSON.stringify({ 
                error: "Database storage failed", 
                details: result.error.message
            }), { status: 500 });
        }

        return new Response(JSON.stringify({ 
            message: "Success", 
            added: newsData.title 
        }), { status: 200 });

    } catch (error: any) {
        console.error("AI ENGINE: Fatal Error:", error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
