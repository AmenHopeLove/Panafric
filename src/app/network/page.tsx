"use client";

import { Search, MapPin, Briefcase, Filter, ArrowRight, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

const COUNTRIES = ["All Countries", "Ethiopia", "Nigeria", "Ghana", "Kenya", "South Africa"];
const EXPERTISE = ["All Expertise", "Corporate", "Trade", "Litigation", "Real Estate", "IP"];

export default function NetworkPage() {
    const { t, config } = useLanguage();
    
    const networkBanner = config?.NETWORK_HERO_BANNER || config?.network_hero_banner;
    const bannerUrl = networkBanner?.image_url || "";
    const overlayOpacity = parseFloat(networkBanner?.overlay_opacity || "0.6");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("All Countries");
    const [selectedExpertise, setSelectedExpertise] = useState("All Expertise");
    const [isCountryOpen, setIsCountryOpen] = useState(false);
    const [isExpertiseOpen, setIsExpertiseOpen] = useState(false);
    const [dbMembers, setDbMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApprovedMembers();
    }, []);

    const fetchApprovedMembers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('network_applications')
                .select('*')
                .eq('status', 'approved')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Map DB structure to UI structure
            const formattedMembers = (data || []).map(m => ({
                id: m.id,
                name: m.full_name,
                firm: m.firm_name || "Legal Professional",
                location: m.location,
                expertise: m.practice_areas?.join(", ") || "General Practice",
                image: m.profile_image_url || "https://images.unsplash.com/photo-1589216532372-1c2a367900d9?auto=format&fit=crop&q=80&w=2000"
            }));

            setDbMembers(formattedMembers);
        } catch (err) {
            console.error("Error fetching members:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredMembers = dbMembers.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.firm.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCountry = selectedCountry === "All Countries" || member.location.includes(selectedCountry);
        const matchesExpertise = selectedExpertise === "All Expertise" || member.expertise.includes(selectedExpertise);

        return matchesSearch && matchesCountry && matchesExpertise;
    });

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
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12">
                        <div className="max-w-4xl space-y-8">
                             <div className="w-24 h-1 brand-gradient rounded-full" />
                            <h2 className="font-sans text-secondary font-black uppercase tracking-[0.5em] text-[10px]">
                                {t("networkSubtitle")}
                            </h2>
                            <h1 className="font-serif text-7xl md:text-9xl font-black text-white leading-[0.9] tracking-tighter">
                                {t("networkTitle")}
                            </h1>
                        </div>
                        <div className="flex flex-wrap gap-6 mb-2">
                            <Link
                                href="/join-network"
                                className="brand-gradient text-white px-12 py-6 rounded-full font-sans font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 active:scale-95 transition-all shadow-brand flex items-center justify-center text-center"
                            >
                                Apply for Membership
                            </Link>
                            <Link
                                href="/network/benefits"
                                className="luxury-glass border border-white/20 text-white px-12 py-6 rounded-full font-sans font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:text-black transition-all text-center"
                            >
                                Benefits Overview
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search & Filter Bar - Floating Glass */}
            <section className="sticky top-16 z-30 bg-white/40 backdrop-blur-xl border-b border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="grid lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-2 relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-secondary transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder={t("searchPlaceholder")}
                                className="w-full bg-accent/50 border border-border px-14 py-5 rounded-full h-16 font-sans text-black focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all placeholder:italic"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        {/* Custom Country Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => { setIsCountryOpen(!isCountryOpen); setIsExpertiseOpen(false); }}
                                className="w-full bg-accent/30 border border-border px-8 py-5 rounded-full h-16 font-sans text-black focus:outline-none focus:border-secondary flex items-center justify-between group transition-all hover:bg-white hover:shadow-lg"
                            >
                                <span className={selectedCountry === "All Countries" ? "text-muted italic" : "font-bold"}>
                                    {selectedCountry}
                                </span>
                                <Filter className={`transition-transform duration-500 ${isCountryOpen ? 'rotate-180 text-secondary' : 'text-muted'}`} size={16} />
                            </button>
                            
                            {isCountryOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsCountryOpen(false)} />
                                    <div className="absolute top-full left-0 w-full mt-4 bg-white/90 backdrop-blur-xl border border-accent/50 rounded-[30px] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
                                        <div className="p-4 max-h-[300px] overflow-y-auto luxury-scrollbar">
                                            {COUNTRIES.map(c => (
                                                <button
                                                    key={c}
                                                    onClick={() => { setSelectedCountry(c); setIsCountryOpen(false); }}
                                                    className={`w-full text-left px-8 py-4 rounded-2xl font-sans text-sm transition-all flex items-center justify-between group/item ${selectedCountry === c ? 'bg-primary text-white shadow-brand' : 'text-black hover:bg-accent hover:pl-10'}`}
                                                >
                                                    <span>{c}</span>
                                                    {selectedCountry === c && <div className="w-2 h-2 rounded-full bg-secondary shadow-brand animate-pulse" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Custom Expertise Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => { setIsExpertiseOpen(!isExpertiseOpen); setIsCountryOpen(false); }}
                                className="w-full bg-accent/30 border border-border px-8 py-5 rounded-full h-16 font-sans text-black focus:outline-none focus:border-secondary flex items-center justify-between group transition-all hover:bg-white hover:shadow-lg"
                            >
                                <span className={selectedExpertise === "All Expertise" ? "text-muted italic" : "font-bold"}>
                                    {selectedExpertise}
                                </span>
                                <Filter className={`transition-transform duration-500 ${isExpertiseOpen ? 'rotate-180 text-secondary' : 'text-muted'}`} size={16} />
                            </button>
                            
                            {isExpertiseOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsExpertiseOpen(false)} />
                                    <div className="absolute top-full left-0 w-full mt-4 bg-white/90 backdrop-blur-xl border border-accent/50 rounded-[30px] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
                                        <div className="p-4 max-h-[300px] overflow-y-auto luxury-scrollbar">
                                            {EXPERTISE.map(e => (
                                                <button
                                                    key={e}
                                                    onClick={() => { setSelectedExpertise(e); setIsExpertiseOpen(false); }}
                                                    className={`w-full text-left px-8 py-4 rounded-2xl font-sans text-sm transition-all flex items-center justify-between group/item ${selectedExpertise === e ? 'bg-primary text-white shadow-brand' : 'text-black hover:bg-accent hover:pl-10'}`}
                                                >
                                                    <span>{e}</span>
                                                    {selectedExpertise === e && <div className="w-2 h-2 rounded-full bg-secondary shadow-brand animate-pulse" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Member Directory Grid - Luxury Cards */}
            <section className="py-32 bg-[#fcfcfc]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {loading ? (
                            <div className="col-span-full py-40 text-center space-y-6">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-secondary border-t-transparent mx-auto"></div>
                                <p className="font-sans text-[10px] text-secondary font-black uppercase tracking-[0.5em]">Authenticating Directory...</p>
                            </div>
                        ) : filteredMembers.map((member) => (
                            <div key={member.id} className="luxury-card bg-white group rounded-[60px] overflow-hidden flex flex-col h-full hover:bg-primary transition-all duration-700">
                                <div className="h-[450px] overflow-hidden relative">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[2000ms]"
                                    />
                                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-1000"></div>
                                    <div className="absolute bottom-10 right-10 z-10">
                                        <div className="brand-gradient p-4 rounded-2xl shadow-brand translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                            <Globe size={20} className="text-white" />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-14 space-y-10 flex-1 flex flex-col justify-between">
                                    <div className="space-y-6">
                                        <div className="flex items-center space-x-3 text-secondary">
                                            <div className="w-8 h-px bg-secondary/30" />
                                            <span className="font-sans text-[10px] font-black uppercase tracking-[0.3em]">Chartered Member</span>
                                        </div>
                                        <h3 className="font-serif text-4xl font-black text-black group-hover:text-white transition-colors tracking-tight leading-none group-hover:pl-4 border-l-0 group-hover:border-l-4 border-secondary transition-all">
                                            {member.name}
                                        </h3>
                                        <p className="font-sans text-xs font-black text-secondary uppercase tracking-[0.2em]">{member.firm}</p>
                                        <div className="pt-8 space-y-4">
                                            <div className="flex items-center space-x-4 text-muted group-hover:text-white/40 transition-colors">
                                                <MapPin size={18} className="text-secondary shrink-0" />
                                                <span className="font-light text-sm italic">{member.location}</span>
                                            </div>
                                            <div className="flex items-center space-x-4 text-muted group-hover:text-white/40 transition-colors">
                                                <Briefcase size={18} className="text-secondary shrink-0" />
                                                <span className="font-light text-sm italic">{member.expertise}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/network/profile/${member.id}`}
                                        className="group/btn inline-flex items-center text-black group-hover:text-white font-sans font-black uppercase tracking-[0.3em] text-[10px] pt-12 mt-auto w-fit"
                                    >
                                        <span className="border-b-2 border-secondary pb-2">{t("viewProfile")}</span>
                                        <ArrowRight size={14} className="ml-4 group-hover/btn:translate-x-2 transition-transform text-secondary" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredMembers.length === 0 && !loading && (
                        <div className="text-center py-48 space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                             <Search size={48} className="mx-auto text-secondary/30" />
                            <p className="font-serif text-4xl text-muted italic font-light">No constituents meet your criteria.</p>
                            <button onClick={() => {setSearchQuery(""); setSelectedCountry("All Countries"); setSelectedExpertise("All Expertise");}} className="text-secondary font-sans font-black uppercase tracking-widest text-xs border-b border-secondary pb-1 hover:text-black transition-colors">Reset Filters</button>
                        </div>
                    )}
                </div>
            </section>

            {/* Membership CTA Section - Prestige Banner */}
            <section className="bg-primary py-48 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,_rgba(194,65,12,0.1),_transparent_60%)]" />
                 <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/5 -skew-x-12 translate-x-1/4"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center lg:text-left">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-24">
                        <div className="max-w-3xl space-y-12">
                            <div className="w-20 h-1 brand-gradient rounded-full mx-auto lg:mx-0" />
                            <h2 className="font-serif text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
                                {t("joinNetworkTitle")}
                            </h2>
                            <p className="text-2xl text-white/50 font-sans font-light leading-relaxed italic">
                                "{t("joinNetworkDesc")}"
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-8 min-w-fit">
                            <Link
                                href="/join-network"
                                className="brand-gradient text-white px-16 py-6 rounded-full font-sans font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 transition-all shadow-brand flex items-center justify-center text-center"
                            >
                                Apply for Membership
                            </Link>
                            <Link
                                href="/network/benefits"
                                className="luxury-glass border border-white/20 text-white px-16 py-6 rounded-full font-sans font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:text-black transition-all text-center"
                            >
                                Benefits Overview
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
