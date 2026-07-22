"use client";

import { useLanguage } from "@/context/LanguageContext";
import {
    Building2,
    Briefcase,
    Gavel,
    ShieldCheck,
    UserSquare,
    Landmark,
    Scale,
    Lock,
    Globe
} from "lucide-react";

export default function PracticeAreas() {
    const { t, config } = useLanguage();
    
    const paBanner = config?.PRACTICE_AREAS_HERO_BANNER || config?.practice_areas_hero_banner;
    const bannerUrl = paBanner?.image_url || "";
    const overlayOpacity = parseFloat(paBanner?.overlay_opacity || "0.6");

    const practices = [
        { icon: <Building2 />, title: t("practice1Title"), desc: t("practice1Desc") },
        { icon: <Globe />, title: t("practice2Title"), desc: t("practice2Desc") },
        { icon: <Gavel />, title: t("practice3Title"), desc: t("practice3Desc") },
        { icon: <Lock />, title: t("practice4Title"), desc: t("practice4Desc") },
        { icon: <UserSquare />, title: t("practice5Title"), desc: t("practice5Desc") },
        { icon: <Landmark />, title: t("practice6Title"), desc: t("practice6Desc") },
        { icon: <ShieldCheck />, title: t("practice7Title"), desc: t("practice7Desc") },
        { icon: <Briefcase />, title: t("practice8Title"), desc: t("practice8Desc") },
    ];

    return (
        <div className="flex flex-col bg-white">
            {/* Header Section - Editorial Style */}
            <section className="py-48 relative overflow-hidden bg-primary">
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-4xl space-y-8">
                        <div className="w-24 h-1 brand-gradient rounded-full" />
                        <h2 className="font-sans text-secondary font-black uppercase tracking-[0.5em] text-[10px]">
                            {t("practiceAreasSubtitle")}
                        </h2>
                        <h1 className="font-serif text-7xl md:text-9xl font-black text-white leading-[0.9] tracking-tighter">
                            {t("practiceAreasTitle")}
                        </h1>
                    </div>
                </div>
            </section>

            {/* Grid Section - Luxury Card Presentation */}
            <section className="py-40 bg-[#fcfcfc]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {practices.map((item, i) => (
                            <div key={i} className="group luxury-card bg-white rounded-[50px] p-12 h-full flex flex-col justify-between hover:bg-primary transition-all duration-700">
                                <div className="space-y-10">
                                    <div className="brand-gradient p-5 rounded-3xl w-fit shadow-brand group-hover:scale-110 transition-transform duration-500">
                                        <div className="text-white h-8 w-8">{item.icon}</div>
                                    </div>
                                    <div className="space-y-6">
                                        <h4 className="font-serif text-3xl font-black text-black group-hover:text-white transition-colors tracking-tight">
                                            {item.title}
                                        </h4>
                                        <p className="text-muted text-base leading-relaxed group-hover:text-white/60 transition-colors font-light font-sans">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Visual Section 1 - High Contrast Diptych */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12">
                        <div className="h-[600px] overflow-hidden rounded-[60px] shadow-2xl border-4 border-accent relative group">
                            <img
                                src="/images/ethiopian-collaboration.png"
                                alt="Professional Legal Collaboration"
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2000ms]"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
                        </div>
                        <div className="h-[600px] overflow-hidden rounded-[60px] shadow-2xl border-4 border-accent relative group">
                            <img
                                src="/images/ethiopian-legal-team.png"
                                alt="Ethical Legal Standards"
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2000ms]"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Visual Section 2 - Strategic Growth (Luxury Layout) */}
            <section className="py-48 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="luxury-card bg-white rounded-[80px] overflow-hidden flex flex-col lg:flex-row shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] group">
                        <div className="lg:w-1/2 p-24 space-y-10 flex flex-col justify-center bg-white">
                            <div className="w-16 h-1 brand-gradient rounded-full" />
                            <h3 className="font-serif text-6xl font-black text-black leading-tight tracking-tighter">
                                Supporting <br />
                                <span className="text-brand italic">Ethiopia's Strategic Growth.</span>
                            </h3>
                            <p className="text-2xl text-muted font-sans font-light leading-relaxed">
                                From the evolving manufacturing sector to international trade via the Djibouti corridor, we provide the legal backbone for the operations shaping Ethiopia's future.
                            </p>
                        </div>
                        <div className="lg:w-1/2 h-[750px] overflow-hidden">
                            <img
                                src="/images/ethiopian-trade.png"
                                alt="Ethiopian Trade & Logistics"
                                className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[3000ms]"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section - Prestige Call to Action */}
            <section className="bg-primary py-40 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(180,148,94,0.1),_transparent_70%)]" />
                <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-12">
                     <Scale className="h-12 w-12 text-secondary/40 mx-auto mb-12" />
                    <h2 className="font-serif text-5xl md:text-7xl font-black text-white mb-12 tracking-tighter leading-tight">
                        Need Expert Legal Guidance <br /> Across Africa?
                    </h2>
                    <button className="brand-gradient text-white px-20 py-6 rounded-full font-sans font-black uppercase tracking-[0.3em] text-xs hover:scale-105 active:scale-95 transition-all shadow-brand">
                        {t("bookConsultation")}
                    </button>
                    <div className="pt-12 flex justify-center space-x-4 opacity-30">
                        <div className="w-2 h-2 rounded-full bg-secondary" />
                        <div className="w-2 h-2 rounded-full bg-secondary" />
                        <div className="w-2 h-2 rounded-full bg-secondary" />
                    </div>
                </div>
            </section>
        </div>
    );
}
