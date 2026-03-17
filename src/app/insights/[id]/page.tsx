import { createClient } from "@/lib/supabase-server";
import { Metadata } from "next";
import InsightsDetailClient from "./InsightsDetailClient";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ id: string }>;
}

const MOCK_INSIGHTS: Record<string, any> = {
    "1": {
        title: "The Growing Manufacturing Sector in Ethiopia: Legal Implications",
        excerpt: "The manufacturing sector in Ethiopia has been undergoing a rapid transformation, driven by strategic government initiatives...",
        category: "Ethiopian Legal",
        date: "Feb 12, 2026",
        image: "/images/ethiopian-trade.png",
        author: "Pan Afric Legal Team"
    },
    "2": {
        title: "Pan-African Trade Protocols: 2026 Regulatory Outlook",
        excerpt: "As we enter 2026, the implementation of the African Continental Free Trade Area (AfCFTA) is entering a critical new phase.",
        category: "Regulatory",
        date: "Feb 10, 2026",
        image: "/images/ethiopian-collaboration.png",
        author: "Regional Trade Experts"
    }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const supabase = await createClient();

    // Try to fetch from Supabase
    const { data: article } = await supabase
        .from('insights')
        .select('*')
        .eq('id', id)
        .single();

    if (!article) {
        // Fallback or Handle Mock (Simplified for metadata)
        if (MOCK_INSIGHTS[id]) {
            return {
                title: `${MOCK_INSIGHTS[id].title} | Pan Afric Insights`,
                description: MOCK_INSIGHTS[id].excerpt,
            };
        }
        return { title: "Legal Insights | Pan Afric Law Firm" };
    }

    const title = `${article.title} | Pan Afric Insights`;
    const image = article.image_url || "/images/ethiopian-trade.png";

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

export default async function InsightDetailPage({ params }: Props) {
    const { id } = await params;
    const supabase = await createClient();
    let article: any = null;

    try {
        const { data, error } = await supabase
            .from('insights')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            // Check Mocks
            if (MOCK_INSIGHTS[id]) {
                article = MOCK_INSIGHTS[id];
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
        "@type": "Article",
        "headline": article.title,
        "image": [article.image_url || article.image],
        "datePublished": article.published_at || new Date().toISOString(),
        "author": [{
            "@type": "Person",
            "name": article.author || "Pan Afric Legal Team",
        }]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <InsightsDetailClient article={article} />
        </>
    );
}
