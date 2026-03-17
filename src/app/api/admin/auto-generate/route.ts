import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { supabase } from '@/lib/supabase-client';

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
        const model = google('gemini-1.5-flash');

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
            eventData = await generateSafe("Generate PALF webinar event JSON with title, description, event_type (webinar/roundtable), highlights (array).");
            ventureData = await generateSafe("Generate PALF venture JSON with title, location, category (Strategic/Corporate/Governmental).");
            newsData = await generateSafe("Generate PALF news JSON with title, excerpt, content, category, author, image_url.");
            insightData = await generateSafe("Generate PALF insight JSON with title, excerpt, content, category, author, image_url.");
            aiUsed = true;
        } catch (aiError: any) {
            console.warn("AI ENGINE: AI failed, using high-quality local templates. Error:", aiError.message);
            // High quality fallbacks
            eventData = {
                title: "Emerging Regulatory Frameworks in Africa 2026",
                description: "A comprehensive briefing on the shifting legal landscapes for multinational corporations.",
                event_type: "webinar",
                highlights: ["Compliance Evolution", "Regional Integration", "Digital Governance"]
            };
            ventureData = {
                title: "West African Energy Infrastructure JV",
                location: "Ghana / Nigeria / Ivory Coast",
                category: "Strategic"
            };
            newsData = {
                title: "PALF Expands Regional Reach with New Strategic Alliances",
                excerpt: "The firm continues its mission to provide seamless cross-border legal solutions.",
                content: "The Pan Afric Law Firm is proud to announce the expansion of its network across key East African markets. This strategic move strengthens our ability to support clients navigating complex regulatory environments and massive infrastructure projects...",
                category: "Firm News",
                author: "Pan Afric Law Firm Content Engine",
                image_url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop"
            };
            insightData = {
                title: "Navigating the New Ethiopian Investment Proclamation",
                excerpt: "An in-depth analysis of what the 2026 changes mean for international investors.",
                content: "With the latest updates to the Investment Proclamation, Ethiopia has signaled a significant shift towards market liberalization. Our analysis covers the key changes in sector-specific restrictions, administrative streamlined processes, and the جدید dispute resolution mechanisms...",
                category: "Ethiopian Legal",
                author: "Pan Afric Editorial Team",
                image_url: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop"
            };
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
