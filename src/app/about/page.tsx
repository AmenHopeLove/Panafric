"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import { useLanguage } from "@/context/LanguageContext";
import { Scale, Target, Users, Linkedin, User as UserIcon } from "lucide-react";

export default function About() {
    const { t } = useLanguage();
    const [leadership, setLeadership] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
                setLeadership(data || []);
            }
            setLoading(false);
        }
        fetchLeadership();
    }, []);

    return (
        <div className="flex flex-col bg-white">
            {/* Header Section - Editorial Style */}
            <section className="py-48 relative overflow-hidden bg-primary">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(194,65,12,0.1),_transparent_50%)]" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-4xl space-y-8">
                        <div className="w-24 h-1 brand-gradient rounded-full" />
                        <h1 className="font-serif text-7xl md:text-9xl font-black text-white leading-[0.9] tracking-tighter">
                            {t("aboutTitle")}
                        </h1>
                        <p className="text-2xl text-white/50 font-sans font-light leading-relaxed max-w-2xl italic">
                            "{t("advancingExcellence")}"
                        </p>
                    </div>
                </div>
            </section>

            {/* Vision & Mission Sections - Luxury Glass Cards */}
            <section className="py-40 bg-[#fcfcfc] relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="luxury-card bg-white p-20 rounded-[60px] space-y-10 group hover:bg-primary transition-all duration-700">
                             <div className="brand-gradient p-5 rounded-3xl w-fit shadow-brand group-hover:scale-110 transition-transform">
                                 <Target className="h-10 w-10 text-white" />
                             </div>
                             <div className="space-y-6">
                                 <h2 className="font-serif text-5xl font-black text-black group-hover:text-white transition-colors tracking-tight">{t("visionTitle")}</h2>
                                 <p className="text-xl text-muted font-sans font-light leading-relaxed group-hover:text-white/60 transition-colors">
                                     {t("visionDesc")}
                                 </p>
                             </div>
                         </div>
                         <div className="luxury-card bg-white p-20 rounded-[60px] space-y-10 group hover:bg-primary transition-all duration-700">
                            <div className="brand-gradient p-5 rounded-3xl w-fit shadow-brand group-hover:scale-110 transition-transform">
                                <Scale className="h-10 w-10 text-white" />
                            </div>
                            <div className="space-y-6">
                                <h2 className="font-serif text-5xl font-black text-black group-hover:text-white transition-colors tracking-tight">{t("missionTitle")}</h2>
                                <p className="text-xl text-muted font-sans font-light leading-relaxed group-hover:text-white/60 transition-colors">
                                    {t("missionDesc")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story / History Section - Prestige Presentation */}
            <section className="py-48 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-32 items-center">
                        <div className="space-y-12 order-2 lg:order-1">
                            <div className="space-y-6">
                                <h2 className="font-sans text-secondary font-black uppercase tracking-[0.5em] text-[10px]">
                                    {t("ourStoryTitle")}
                                </h2>
                                <h3 className="font-serif text-6xl md:text-7xl font-black text-black leading-tight tracking-tighter">
                                    {t("historyTitle")}
                                </h3>
                            </div>
                            <div className="w-20 h-0.5 bg-secondary opacity-30" />
                            <p className="text-2xl text-muted font-sans font-light leading-relaxed first-letter:text-6xl first-letter:font-serif first-letter:mr-3 first-letter:float-left first-letter:text-primary">
                                {t("aboutHistory")}
                            </p>
                        </div>
                        <div className="relative order-1 lg:order-2">
                             <div className="absolute -inset-10 border-2 border-secondary/10 translate-x-12 translate-y-12 rounded-[100px] opacity-20"></div>
                            <div className="relative h-[750px] w-full rounded-[100px] overflow-hidden shadow-2xl border-8 border-accent">
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
            <section className="py-48 bg-primary text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-10 mb-32">
                        <h2 className="font-sans text-secondary font-black uppercase tracking-[0.5em] text-[10px]">{t("logoTitle")}</h2>
                        <p className="font-serif text-4xl md:text-5xl font-light max-w-4xl mx-auto leading-tight italic opacity-80">
                            "{t("logoDesc")}"
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-16">
                        <div className="bg-white/5 border border-white/10 p-16 rounded-[50px] hover:border-secondary transition-all duration-500 backdrop-blur-sm group">
                            <div className="brand-gradient p-6 rounded-3xl w-fit mb-10 shadow-brand group-hover:scale-110 transition-transform">
                                <Scale className="h-12 w-12 text-white" />
                            </div>
                            <h4 className="font-serif text-4xl font-black text-white mb-6 tracking-tight">{t("flameTitle")}</h4>
                            <p className="text-xl text-white/40 font-sans font-light leading-relaxed group-hover:text-white/70 transition-colors">
                                {t("flameDesc")}
                            </p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-16 rounded-[50px] hover:border-secondary transition-all duration-500 backdrop-blur-sm group">
                            <div className="brand-gradient p-6 rounded-3xl w-fit mb-10 shadow-brand group-hover:scale-110 transition-transform">
                                <Users className="h-12 w-12 text-white" />
                            </div>
                            <h4 className="font-serif text-4xl font-black text-white mb-6 tracking-tight">{t("handTitle")}</h4>
                            <p className="text-xl text-white/40 font-sans font-light leading-relaxed group-hover:text-white/70 transition-colors">
                                {t("handDesc")}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Leadership Section - Prestige Directory */}
            <section className="py-48 bg-[#fcfcfc]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-12">
                        <div className="space-y-6">
                            <h2 className="font-sans text-secondary font-black uppercase tracking-[0.5em] text-[10px]">{t("leadershipTitle")}</h2>
                            <h3 className="font-serif text-6xl md:text-7xl font-black text-black tracking-tighter">{t("leadershipDesc")}</h3>
                        </div>
                        <div className="w-32 h-1 brand-gradient rounded-full hidden md:block" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-16">
                        {loading ? (
                            [1, 2, 3].map((i) => (
                                <div key={i} className="aspect-[3/4] bg-accent rounded-[40px] animate-pulse"></div>
                            ))
                        ) : leadership.length === 0 ? (
                            <div className="col-span-3 text-center text-muted italic font-serif py-32 text-3xl opacity-30 uppercase tracking-[0.2em]">
                                Team directory coming soon.
                            </div>
                        ) : leadership.map((member) => (
                            <div key={member.id} className="space-y-10 group cursor-default">
                                <div className="aspect-[3/4] relative rounded-[60px] overflow-hidden bg-accent shadow-2xl border-4 border-white">
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
                                            className="absolute bottom-10 right-10 z-20 brand-gradient p-4 rounded-2xl text-white opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-brand translate-y-4 group-hover:translate-y-0"
                                        >
                                            <Linkedin size={24} />
                                        </a>
                                    )}
                                </div>
                                <div className="space-y-4 px-4 text-center">
                                    <h4 className="font-serif text-4xl font-black text-black group-hover:text-secondary transition-colors tracking-tight">{member.name}</h4>
                                    <div className="flex flex-col items-center space-y-4">
                                        <p className="font-sans text-[10px] text-secondary uppercase tracking-[0.4em] font-black">{member.role}</p>
                                        <p className="font-sans text-base leading-relaxed text-muted line-clamp-3 italic opacity-60 group-hover:opacity-100 transition-opacity duration-700">
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
