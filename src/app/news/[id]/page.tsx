import { createClient } from "@/lib/supabase-server";
import { Metadata } from "next";
import NewsDetailClient from "./NewsDetailClient";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const supabase = await createClient();

    // Try to fetch from Supabase
    const { data: article } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

    if (!article) {
        // Fallback or Handle Mock (Simplified for metadata)
        if (id === "1") {
            return {
                title: "Pan Afric Law Firm Expands to Nairobi | Pan Afric News",
                description: "We are proud to announce the opening of our new associate office in Nairobi, Kenya, strengthening our East African presence.",
            };
        }
        return { title: "News | Pan Afric Law Firm" };
    }

    const title = `${article.title} | Pan Afric News`;
    const image = article.image_url || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000";

    return {
        title,
        description: article.excerpt,
        openGraph: {
            title,
            description: article.excerpt,
            images: [{ url: image }],
            type: 'article',
            publishedTime: article.published_at,
            authors: [article.author || 'Pan Afric Law Firm'],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: article.excerpt,
            images: [image],
        }
    };
}

export default async function NewsDetailPage({ params }: Props) {
    const { id } = await params;
    const supabase = await createClient();
    let article: any = null;

    try {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            // Handle Mock
            if (id === "1") {
                article = {
                    title: "Pan Afric Law Firm Expands to Nairobi",
                    content: "Pan Afric Law Firm is excited to announce the formalization of our partnership with a leading Nairobi-based legal practice...",
                    category: "Firm News",
                    date: "Feb 15, 2026",
                    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000",
                    author: "Pan Afric Law Firm"
                };
            } else {
                notFound();
            }
        } else {
            article = {
                ...data,
                date: new Date(data.published_at).toLocaleDateString()
            };
        }
    } catch (err) {
        notFound();
    }

    // Structured Data (JSON-LD)
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": article.title,
        "image": [article.image_url || article.image],
        "datePublished": article.published_at || new Date().toISOString(),
        "author": [{
            "@type": "Organization",
            "name": article.author || "Pan Afric Law Firm",
            "url": "https://panafriclawfirm.com"
        }]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <NewsDetailClient article={article} />
        </>
    );
}
