import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { supabase } from '@/lib/supabase-client';

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const { articleId } = await req.json();

        if (!articleId) {
            return new Response(JSON.stringify({ error: "Article ID is required" }), { status: 400 });
        }

        // Fetch article content
        const { data: article, error: fetchError } = await supabase
            .from('news')
            .select('*')
            .eq('id', articleId)
            .single();

        if (fetchError || !article) {
            return new Response(JSON.stringify({ error: "Article not found" }), { status: 404 });
        }

        const model = google('gemini-2.5-flash');

        const prompt = `
            You are a social media manager for Pan Afric Law Firm (PALF).
            Based on the following news article, generate 3 types of social media posts.
            
            ARTICLE TITLE: ${article.title}
            ARTICLE EXCERPT: ${article.excerpt}
            ARTICLE CATEGORY: ${article.category}
            
            Generate:
            1. LinkedIn (Professional, results-oriented, includes 3-5 hashtags)
            2. Twitter/X (Concise, punchy, curiosity gap, includes 2 hashtags)
            3. Facebook/Instagram (Conversational, community-focused, includes emojis)
            
            Respond with ONLY a valid JSON object in this format:
            {
                "linkedin": "...",
                "twitter": "...",
                "facebook": "..."
            }
        `;

        const { text } = await generateText({
            model,
            temperature: 0.8,
            prompt
        });

        // Clean JSON response from AI
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const socialPosts = JSON.parse(cleanJson);

        return new Response(JSON.stringify(socialPosts), { status: 200 });

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
