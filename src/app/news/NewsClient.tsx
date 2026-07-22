"use client";

import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { Newspaper, Calendar, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";

const CATEGORIES = [
    "All",
    "Firm News",
    "Legal Alerts",
    "Press Releases"
];

const MOCK_NEWS = [
    {
        id: "1",
        title: "Pan Afric Law Firm Expands to Nairobi",
        excerpt: "We are proud to announce the opening of our new associate office in Nairobi, Kenya...",
        category: "Firm News",
        date: "Feb 15, 2026",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000"
    }
];

export default function NewsClient() {
    const { t, config } = useLanguage();
    
    const bannerUrl = config?.news_hero_banner?.image_url || "";
    const overlayOpacity = parseFloat(config?.news_hero_banner?.overlay_opacity || "0.6");
    const [activeCategory, setActiveCategory] = useState("All");
    const [news, setNews] = useState(MOCK_NEWS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchNews() {
            try {
                const { data, error } = await supabase
                    .from('news')
                    .select('*')
                    .order('published_at', { ascending: false });

                if (error) {
                    console.error("Error fetching news:", error);
                } else if (data && data.length > 0) {
                    setNews(data.map(item => ({
                        id: item.id.toString(),
                        title: item.title,
                        excerpt: item.excerpt,
                        category: item.category,
                        date: new Date(item.published_at).toLocaleDateString(),
                        image: item.image_url || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"
                    })));
                }
            } catch (err) {
                console.error("Failed to load news:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchNews();
    }, []);

    const filteredNews = activeCategory === "All"
        ? news
        : news.filter(item => item.category === activeCategory);

    return (
        <div className="flex flex-col bg-white">
            <section className="relative py-32 lg:py-48 bg-black overflow-hidden">
                {bannerUrl ? (
                    <div 
                        className="absolute inset-0 bg-cover bg-center transition-all duration-1000" 
                        style={{ backgroundImage: `url(${bannerUrl})` }}
                    />
                ) : (
                    <div className="absolute inset-0 opacity-40">
                        <img
                            src="https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=2000"
                            alt="News and Media"
                            className="w-full h-full object-cover grayscale"
                        />
                    </div>
                )}
                {/* Dynamic dark overlay */}
                <div 
                    className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-black transition-all" 
                    style={{ opacity: bannerUrl ? overlayOpacity : 0.6 }} 
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-4xl">
                        <h2 className="font-sans text-secondary font-bold uppercase tracking-[0.3em] text-xs mb-6">
                            {t("newsSubtitle")}
                        </h2>
                        <h1 className="font-serif text-5xl md:text-8xl font-black text-white leading-tight">
                            {t("newsTitle")}
                        </h1>
                    </div>
                </div>
            </section>

            <section className="py-24 lg:py-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap gap-8 justify-between items-end mb-20 border-b border-border pb-12">
                        <div className="flex flex-wrap gap-12">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`font-sans text-sm font-bold uppercase tracking-widest transition-all pb-2 border-b-2 ${activeCategory === cat ? "text-secondary border-secondary" : "text-muted border-transparent hover:text-black"}`}
                                >
                                    {cat === "Firm News" ? t("firmNews") : cat === "Legal Alerts" ? t("legalAlerts") : cat === "Press Releases" ? t("pressReleases") : cat}
                                </button>
                            ))}
                        </div>
                        <div className="hidden lg:flex items-center space-x-2 text-muted text-xs uppercase tracking-widest font-bold">
                            <Newspaper size={14} className="text-secondary" />
                            <span>Showing {filteredNews.length} articles</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
                        {filteredNews.map((item) => (
                            <div key={item.id} className="bg-white p-10 space-y-8 hover:bg-black group transition-all duration-500 flex flex-col justify-between border-b border-border md:border-b-0">
                                <div className="space-y-6">
                                    <div className="relative h-64 w-full overflow-hidden mb-8">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-80 group-hover:opacity-100"
                                        />
                                        <div className="absolute top-0 right-0 p-4">
                                            <span className="bg-secondary text-white px-3 py-1 text-[10px] uppercase font-bold tracking-widest">
                                                {item.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 text-[10px] font-sans uppercase tracking-[0.2em] text-muted group-hover:text-secondary transition-colors">
                                        <Calendar size={12} />
                                        <span>{item.date}</span>
                                    </div>
                                    <h4 className="font-serif text-2xl font-bold text-black group-hover:text-white transition-colors leading-tight">
                                        {item.title}
                                    </h4>
                                    <p className="text-muted font-sans font-light leading-relaxed group-hover:text-white/70 transition-colors line-clamp-3">
                                        {item.excerpt}
                                    </p>
                                </div>
                                <Link
                                    href={`/news/${item.id}`}
                                    className="inline-flex items-center text-black font-sans font-bold uppercase tracking-widest text-xs hover:text-secondary group-hover:text-white transition-all pt-8 space-x-2"
                                >
                                    <span>{t("readMore")}</span>
                                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
