"use client";

import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, Tag, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";

const CATEGORIES = [
    "All",
    "Ethiopian Legal",
    "Regulatory",
    "Investment",
    "Commentary"
];

const MOCK_INSIGHTS = [
    {
        id: "1",
        title: "The Growing Manufacturing Sector in Ethiopia: Legal Implications",
        excerpt: "An in-depth analysis of recent regulatory changes affecting foreign investment...",
        category: "Ethiopian Legal",
        date: "Feb 12, 2026",
        image: "/images/ethiopian-trade.png"
    }
];

export default function InsightsClient() {
    const { t } = useLanguage();
    const [activeCategory, setActiveCategory] = useState("All");
    const [insights, setInsights] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchInsights() {
            try {
                const { data, error } = await supabase
                    .from('insights')
                    .select('*')
                    .order('published_at', { ascending: false });

                if (error || !data || data.length === 0) {
                    setInsights(MOCK_INSIGHTS);
                } else {
                    setInsights(data.map(item => ({
                        ...item,
                        date: new Date(item.published_at).toLocaleDateString(),
                        image: item.image_url || "/images/ethiopian-trade.png"
                    })));
                }
            } catch (err) {
                setInsights(MOCK_INSIGHTS);
            } finally {
                setLoading(false);
            }
        }
        fetchInsights();
    }, []);

    const filteredInsights = activeCategory === "All"
        ? insights
        : insights.filter(item => item.category === activeCategory);

    return (
        <div className="flex flex-col bg-white">
            {/* Header Section - Editorial Style */}
            <section className="py-48 relative overflow-hidden bg-primary">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(194,65,12,0.1),_transparent_50%)]" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-4xl space-y-8">
                        <div className="w-24 h-1 brand-gradient rounded-full" />
                        <h2 className="font-sans text-secondary font-black uppercase tracking-[0.5em] text-[10px]">
                            {t("insightsSubtitle")}
                        </h2>
                        <h1 className="font-serif text-7xl md:text-9xl font-black text-white leading-[0.9] tracking-tighter">
                            {t("insightsTitle")}
                        </h1>
                    </div>
                </div>
            </section>

            {/* Featured Insight Section - High End Presentation */}
            <section className="py-40 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-32 items-center luxury-card bg-white rounded-[80px] overflow-hidden group">
                        <div className="relative h-[750px] w-full overflow-hidden">
                            <img
                                src={insights[0]?.image || "/images/ethiopian-collaboration.png"}
                                alt="Featured Insight"
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[3000ms]"
                            />
                             <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-1000"></div>
                        </div>
                        <div className="p-24 space-y-12">
                            <div className="flex items-center space-x-4">
                                <div className="brand-gradient p-4 rounded-2xl shadow-brand">
                                    <BookOpen className="h-6 w-6 text-white" />
                                </div>
                                <span className="font-sans text-[10px] text-secondary font-black uppercase tracking-[0.4em]">
                                    {t("featuredInsight")}
                                </span>
                            </div>
                            <h3 className="font-serif text-6xl font-black text-black leading-tight tracking-tighter">
                                {insights[0]?.title || "Insights Intelligence"}
                            </h3>
                            <p className="text-2xl text-muted font-sans font-light leading-relaxed first-letter:text-5xl first-letter:font-serif first-letter:mr-2">
                                {insights[0]?.excerpt}
                            </p>
                            <Link
                                href={`/insights/${insights[0]?.id || "1"}`}
                                className="group/link inline-flex items-center text-black font-sans font-black uppercase tracking-[0.3em] text-[10px] border-b-2 border-secondary pb-4"
                            >
                                {t("readMore")}
                                <ArrowRight className="ml-4 h-4 w-4 group-hover/link:translate-x-2 transition-transform text-secondary" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section - Filtered Grid */}
            <section className="py-40 bg-[#fcfcfc]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-32 gap-12">
                        <div className="flex flex-wrap gap-8 justify-center">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`font-sans text-[10px] font-black uppercase tracking-[0.4em] px-10 py-5 rounded-full border-2 transition-all shadow-sm ${activeCategory === cat ? "bg-primary text-white border-primary shadow-lg" : "bg-white text-muted border-accent hover:border-secondary hover:text-secondary"}`}
                                >
                                    {cat === "Ethiopian Legal" ? t("categoryEthiopian") : cat === "Regulatory" ? t("categoryRegulatory") : cat === "Investment" ? t("categoryInvestment") : cat === "Commentary" ? t("categoryCommentary") : cat}
                                </button>
                            ))}
                        </div>
                        <div className="hidden lg:block w-32 h-px bg-secondary/30" />
                    </div>

                    {loading ? (
                        <div className="py-48 text-center space-y-6">
                            <Loader2 className="h-12 w-12 animate-spin mx-auto text-secondary" />
                             <p className="font-sans text-[10px] text-secondary font-black uppercase tracking-[0.5em]">Synchronizing Insights...</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {filteredInsights.map((item) => (
                                <div key={item.id} className="luxury-card bg-white group rounded-[60px] p-12 space-y-10 hover:bg-primary transition-all duration-700 flex flex-col justify-between">
                                    <div className="space-y-8">
                                        <div className="flex items-center space-x-4 text-[10px] font-sans font-black uppercase tracking-[0.3em] text-secondary">
                                            <Tag size={12} />
                                            <span>{item.category}</span>
                                            <span className="opacity-20">•</span>
                                            <Calendar size={12} />
                                            <span className="text-muted group-hover:text-white/40 transition-colors">{item.date}</span>
                                        </div>
                                        <h4 className="font-serif text-3xl font-black text-black group-hover:text-white transition-colors leading-tight tracking-tight">
                                            {item.title}
                                        </h4>
                                        <p className="text-muted font-sans font-light leading-relaxed group-hover:text-white/60 transition-colors line-clamp-3">
                                            {item.excerpt}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/insights/${item.id}`}
                                        className="group/btn inline-flex items-center text-black group-hover:text-white font-sans font-black uppercase tracking-[0.3em] text-[10px] border-b border-secondary/30 group-hover:border-secondary pb-3 mt-12 w-fit transition-all"
                                    >
                                        {t("readMore")}
                                        <ArrowRight className="ml-4 h-3 w-3 group-hover/btn:translate-x-2 transition-transform text-secondary" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
