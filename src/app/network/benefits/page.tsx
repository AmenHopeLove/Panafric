"use client";

import { ShieldCheck, Globe, Users, Briefcase, Zap, ArrowRight, CheckCircle, Award } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const BENEFITS = [
    {
        icon: <Globe className="text-secondary" size={32} />,
        title: "Pan-African Exposure",
        description: "Join an elite network of legal professionals across the continent. Gain visibility in new markets and position your firm as a Pan-African leader."
    },
    {
        icon: <ShieldCheck className="text-secondary" size={32} />,
        title: "Verified Prestige",
        description: "Membership in the PALF Network is a seal of quality. Benefit from our rigorous vetting process that highlights your expertise and reliability."
    },
    {
        icon: <Users className="text-secondary" size={32} />,
        title: "Exclusive Networking",
        description: "Access high-level networking events, roundtable discussions, and strategic forums with industry leaders and policy makers."
    },
    {
        icon: <Briefcase className="text-secondary" size={32} />,
        title: "Strategic Referrals",
        description: "Receive vetted case referrals from across the network. Our internal platform facilitates seamless collaboration on cross-border legal matters."
    },
    {
        icon: <Zap className="text-secondary" size={32} />,
        title: "Premium Resources",
        description: "Stay ahead with exclusive access to PALF's industry insights, legal tech tools, and comprehensive continental legal databases."
    },
    {
        icon: <Award className="text-secondary" size={32} />,
        title: "Thought Leadership",
        description: "Contribute to PALF publications and speak at international summits. Amplify your voice in the shaping of Africa's legal landscape."
    }
];

export default function BenefitsPage() {
    const { t } = useLanguage();

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative py-32 lg:py-48 bg-black overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-40">
                    <img src="/images/network-hero.jpg" className="w-full h-full object-cover grayscale" alt="Network Backdrop" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl space-y-8">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-secondary/20 border border-secondary/30 rounded-full">
                            <span className="text-secondary font-sans text-xs font-bold uppercase tracking-widest leading-none py-1">Exclusive Membership</span>
                        </div>
                        <h1 className="font-serif text-6xl md:text-8xl font-black italic text-white leading-tight">
                            Elevate Your <br />
                            <span className="text-secondary">Legal Practice</span>
                        </h1>
                        <p className="text-2xl text-gray-400 font-sans font-light leading-relaxed max-w-2xl">
                            The Pan Afric Law Firm network is more than a directory. It's a strategic alliance designed to empower top-tier legal professionals in the continent's evolving economy.
                        </p>
                        <div className="flex flex-wrap gap-6 pt-4">
                            <Link
                                href="/join-network"
                                className="bg-secondary text-white px-10 py-5 font-sans font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all shadow-2xl"
                            >
                                Apply for Membership
                            </Link>
                            <Link
                                href="/network"
                                className="border border-white/20 text-white px-10 py-5 font-sans font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all"
                            >
                                Back to Directory
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Benefits Grid */}
            <section className="py-24 lg:py-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
                        <h2 className="font-serif text-5xl font-bold text-black italic">Strategic Advantages</h2>
                        <div className="h-1 w-24 bg-secondary mx-auto"></div>
                        <p className="text-muted font-sans text-lg leading-relaxed">
                            We provide the platform, authority, and connections you need to scale your practice across borders and lead in the African legal space.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
                        {BENEFITS.map((benefit, index) => (
                            <div key={index} className="bg-white p-12 space-y-8 group hover:bg-black transition-all duration-500">
                                <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary transition-all duration-500">
                                    <div className="group-hover:text-white transition-colors duration-500">
                                        {benefit.icon}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-serif text-2xl font-bold text-black group-hover:text-white transition-colors duration-500 italic">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-muted font-sans text-sm leading-relaxed group-hover:text-gray-400 transition-colors duration-500">
                                        {benefit.description}
                                    </p>
                                </div>
                                <div className="pt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                                    <div className="flex items-center space-x-2 text-secondary font-sans text-xs font-bold uppercase tracking-widest">
                                        <span>Learn More</span>
                                        <ArrowRight size={14} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Join Section */}
            <section className="bg-gray-50 py-24 lg:py-40 overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <h2 className="font-serif text-5xl md:text-6xl font-black text-black leading-tight italic">
                                    Why Leading <br />
                                    Firms Choose <span className="text-secondary">PALF</span>
                                </h2>
                                <p className="text-xl text-muted font-sans font-light leading-relaxed">
                                    Our mission is to integrate Africa's fragmented legal markets. By joining, you contribute to a more connected and efficient continental legal ecosystem.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {[
                                    "Continental reach with local expertise",
                                    "Rigorous professional standards",
                                    "Platform for high-value case referrals",
                                    "Direct link to multinational clients",
                                    "Collaborative knowledge sharing environment"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start space-x-4">
                                        <CheckCircle className="text-secondary shrink-0 mt-1" size={20} />
                                        <span className="font-sans text-lg text-black font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="aspect-square bg-black p-4 relative z-10">
                                <img src="/images/network-hero.jpg" className="w-full h-full object-cover grayscale opacity-70" alt="Professional Networking" />
                                <div className="absolute -bottom-10 -left-10 bg-secondary p-12 hidden md:block">
                                    <div className="space-y-2 text-white">
                                        <p className="text-6xl font-serif font-black">250+</p>
                                        <p className="font-sans text-xs font-bold uppercase tracking-widest">Premium Members</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="bg-black py-24 lg:py-32 text-center overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
                    <h2 className="font-serif text-5xl md:text-7xl font-black text-white italic leading-tight">
                        Ready to Lead the <br />
                        <span className="text-secondary text-5xl md:text-6xl">African Legal Revolution?</span>
                    </h2>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                        <Link
                            href="/join-network"
                            className="w-full md:w-auto bg-secondary text-white px-12 py-6 font-sans font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all shadow-2xl text-center"
                        >
                            Apply for Membership
                        </Link>
                        <Link
                            href="/contact"
                            className="w-full md:w-auto border border-white/20 text-white px-12 py-6 font-sans font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all text-center"
                        >
                            Schedule a Consultation
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
