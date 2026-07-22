"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import { useLanguage } from "@/context/LanguageContext";
import { Scale, Target, Users, Linkedin, User as UserIcon, History, Award } from "lucide-react";

export default function About() {
    const { t, config } = useLanguage();
    const [leadership, setLeadership] = useState<any[]>([]);
    
    const bannerUrl = config?.about_hero_banner?.image_url || "";
    const overlayOpacity = parseFloat(config?.about_hero_banner?.overlay_opacity || "0.6");
    const [loading, setLoading] = useState(true);

    // MOCK LEADERSHIP for fallback
    const MOCK_LEADERSHIP = [
        {
            id: 'mock-1',
            name: "Dr. Amare Gebru",
            role: "Managing Partner",
            bio_summary: "Expert in Pan-African corporate law and multi-jurisdictional dispute resolution with over 25 years of experience.",
            image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
            linkedin_url: "#"
        },
        {
            id: 'mock-2',
            name: "Sarah Mendela",
            role: "Head of International Trade",
            bio_summary: "Specialist in AfCFTA regulations and cross-border investment strategies for global stakeholders.",
            image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80",
            linkedin_url: "#"
        },
        {
            id: 'mock-3',
            name: "Jean-Pierre Bakari",
            role: "Chief of Legal Intelligence",
            bio_summary: "Leading the firm's insights division, focusing on regulatory arbitrage and emerging technology law.",
            image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80",
            linkedin_url: "#"
        }
    ];

    useEffect(() => {
        async function fetchLeadership() {
            const { data, error } = await supabase
                .from('site_leadership')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (error) {
                console.error("Error loading leadership:", error.message || error);
            } else {
                setLeadership(data && data.length > 0 ? data : MOCK_LEADERSHIP);
            }
            setLoading(false);
        }
        fetchLeadership();
    }, []);

    return (
        <div className="flex flex-col bg-white">
            {/* Header Section - Editorial Style */}
            <section className="pt-32 pb-24 relative overflow-hidden bg-primary min-h-[50vh] flex items-center">
                {bannerUrl ? (
                    <div 
                        className="absolute inset-0 bg-cover bg-center transition-all duration-1000" 
                        style={{ backgroundImage: `url(${bannerUrl})` }}
                    />
                ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(194,65,12,0.1),_transparent_50%)]" />
                )}
                {/* Dynamic dark overlay */}
                <div 
                    className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-black transition-all" 
                    style={{ opacity: bannerUrl ? overlayOpacity : 0.8 }} 
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-left duration-1000">
                        <div className="w-24 h-1 brand-gradient rounded-full" />
                        <h1 className="font-serif text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
                            {t("aboutTitle")}
                        </h1>
                        <p className="text-xl md:text-2xl text-white/50 font-sans font-light leading-relaxed max-w-2xl italic">
                            "{t("advancingExcellence")}"
                        </p>
                    </div>
                </div>
            </section>

            {/* Vision & Mission Sections - Luxury Glass Cards */}
            <section className="py-24 bg-accent/30 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                        <div className="luxury-card bg-white p-12 lg:p-16 rounded-[40px] space-y-8 group hover:bg-black transition-all duration-700 shadow-xl border border-border/50">
                             <div className="brand-gradient p-4 rounded-2xl w-fit shadow-brand group-hover:scale-110 transition-transform">
                                 <Target className="h-8 w-8 text-white" />
                             </div>
                             <div className="space-y-4">
                                 <h2 className="font-serif text-4xl font-black text-black group-hover:text-white transition-colors tracking-tight">{t("visionTitle")}</h2>
                                 <p className="text-lg text-muted font-sans font-light leading-relaxed group-hover:text-white/70 transition-colors">
                                     {t("visionDesc")}
                                 </p>
                             </div>
                         </div>
                         <div className="luxury-card bg-white p-12 lg:p-16 rounded-[40px] space-y-8 group hover:bg-black transition-all duration-700 shadow-xl border border-border/50">
                            <div className="brand-gradient p-4 rounded-2xl w-fit shadow-brand group-hover:scale-110 transition-transform">
                                <Scale className="h-8 w-8 text-white" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="font-serif text-4xl font-black text-black group-hover:text-white transition-colors tracking-tight">{t("missionTitle")}</h2>
                                <p className="text-lg text-muted font-sans font-light leading-relaxed group-hover:text-white/70 transition-colors">
                                    {t("missionDesc")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story / History Section - Prestige Presentation */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-10 order-2 lg:order-1">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3 text-secondary font-sans font-black uppercase tracking-[0.4em] text-[10px]">
                                    <History size={14} />
                                    <span>{t("ourStoryTitle")}</span>
                                </div>
                                <h3 className="font-serif text-5xl md:text-6xl font-black text-black leading-tight tracking-tighter">
                                    {t("historyTitle")}
                                </h3>
                            </div>
                            <div className="w-16 h-0.5 bg-secondary opacity-30" />
                            <p className="text-xl text-muted font-sans font-light leading-relaxed first-letter:text-6xl first-letter:font-serif first-letter:mr-3 first-letter:float-left first-letter:text-primary">
                                {t("aboutHistory")}
                            </p>
                        </div>
                        <div className="relative order-1 lg:order-2">
                             <div className="absolute -inset-10 border-2 border-secondary/10 translate-x-8 translate-y-8 rounded-[80px] opacity-10"></div>
                            <div className="relative h-[500px] lg:h-[600px] w-full rounded-[80px] overflow-hidden shadow-2xl border-4 border-white">
                                <img
                                    src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80"
                                    alt="Law Firm History"
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-[2000ms] scale-110 hover:scale-100"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Logo Section - Iconic Symbolism */}
            <section className="py-24 bg-primary text-white relative">
                <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-8 mb-20 animate-in fade-in duration-1000">
                        <div className="inline-flex items-center space-x-3 text-secondary font-sans font-black uppercase tracking-[0.4em] text-[10px] bg-white/5 px-4 py-2 rounded-full">
                            <Award size={14} />
                            <span>{t("logoTitle")}</span>
                        </div>
                        <p className="font-serif text-3xl md:text-4xl font-light max-w-4xl mx-auto leading-tight italic opacity-90">
                            "{t("logoDesc")}"
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                        <div className="bg-white/5 border border-white/10 p-12 lg:p-16 rounded-[40px] hover:border-secondary transition-all duration-500 backdrop-blur-sm group hover:bg-white/10">
                            <div className="brand-gradient p-5 rounded-2xl w-fit mb-8 shadow-brand group-hover:scale-110 transition-transform">
                                <Scale className="h-10 w-10 text-white" />
                            </div>
                            <h4 className="font-serif text-3xl font-black text-white mb-4 tracking-tight">{t("flameTitle")}</h4>
                            <p className="text-lg text-white/40 font-sans font-light leading-relaxed group-hover:text-white/80 transition-colors">
                                {t("flameDesc")}
                            </p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-12 lg:p-16 rounded-[40px] hover:border-secondary transition-all duration-500 backdrop-blur-sm group hover:bg-white/10">
                            <div className="brand-gradient p-5 rounded-2xl w-fit mb-8 shadow-brand group-hover:scale-110 transition-transform">
                                <Users className="h-10 w-10 text-white" />
                            </div>
                            <h4 className="font-serif text-3xl font-black text-white mb-4 tracking-tight">{t("handTitle")}</h4>
                            <p className="text-lg text-white/40 font-sans font-light leading-relaxed group-hover:text-white/80 transition-colors">
                                {t("handDesc")}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Leadership Section - Prestige Directory */}
            <section className="py-24 bg-[#fcfcfc]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-8 text-center md:text-left">
                        <div className="space-y-4">
                            <h2 className="font-sans text-secondary font-black uppercase tracking-[0.4em] text-[10px]">{t("leadershipTitle")}</h2>
                            <h3 className="font-serif text-5xl md:text-6xl font-black text-black tracking-tighter leading-none">{t("leadershipDesc")}</h3>
                        </div>
                        <div className="w-32 h-1 brand-gradient rounded-full hidden md:block" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
                        {loading ? (
                            [1, 2, 3].map((i) => (
                                <div key={i} className="aspect-[3/4] bg-accent rounded-[40px] animate-pulse"></div>
                            ))
                        ) : leadership.map((member) => (
                            <div key={member.id} className="space-y-8 group cursor-default">
                                <div className="aspect-[3/4] relative rounded-[50px] overflow-hidden bg-accent shadow-2xl border-2 border-white">
                                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-700 z-10" />
                                    {member.image_url ? (
                                        <img
                                            src={member.image_url}
                                            alt={member.name}
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                            <UserIcon size={64} className="text-muted opacity-10" />
                                        </div>
                                    )}
                                    {member.linkedin_url && (
                                        <a
                                            href={member.linkedin_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="absolute bottom-8 right-8 z-20 brand-gradient p-3 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-brand translate-y-4 group-hover:translate-y-0"
                                        >
                                            <Linkedin size={20} />
                                        </a>
                                    )}
                                </div>
                                <div className="space-y-3 px-2 text-center">
                                    <h4 className="font-serif text-3xl font-black text-black group-hover:text-secondary transition-colors tracking-tight leading-none">{member.name}</h4>
                                    <div className="flex flex-col items-center space-y-3">
                                        <p className="font-sans text-[10px] text-secondary uppercase tracking-[0.3em] font-black">{member.role}</p>
                                        <p className="font-sans text-sm leading-relaxed text-muted line-clamp-3 italic opacity-60 group-hover:opacity-100 transition-opacity duration-700">
                                            {member.bio_summary}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
