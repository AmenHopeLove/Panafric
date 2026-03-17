"use client";

import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase-client";
import { ArrowLeft, Briefcase, Globe, Mail, MapPin, User, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const HARDCODED_MEMBERS = [
    {
        id: "1",
        name: "Dr. Biruk Haile",
        firm: "Pan Afric Law Firm & Network",
        location: "Addis Ababa, Ethiopia",
        expertise: "Corporate & Investment Law",
        image: "https://images.unsplash.com/photo-1507679799987-c7377f323b51?auto=format&fit=crop&q=80&w=2000",
        bio: "Dr. Biruk Haile is a distinguished legal professional with over 20 years of experience in corporate and investment law across Africa. He specializes in cross-border acquisitions and regulatory compliance."
    },
    {
        id: "2",
        name: "Sarah Oluchi",
        firm: "Continental Legal Hub",
        location: "Lagos, Nigeria",
        expertise: "International Trade & Compliance",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=2000",
        bio: "Sarah Oluchi is a leading expert in international trade law and compliance. She has advised numerous multinational corporations on navigating the complexities of African trade protocols."
    },
    {
        id: "3",
        name: "Kofi Mensah",
        firm: "Heritage Solicitors",
        location: "Accra, Ghana",
        expertise: "Real Estate & Intellectual Property",
        image: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=2000",
        bio: "Kofi Mensah specializes in real estate and intellectual property law. He has a proven track record of protecting creative assets and securing property rights in West Africa."
    },
    {
        id: "4",
        name: "Amanuel Tesfaye",
        firm: "Addis Corporate Advisory",
        location: "Addis Ababa, Ethiopia",
        expertise: "Litigation & Dispute Resolution",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=2000",
        bio: "Amanuel Tesfaye is a formidable litigator with extensive experience in dispute resolution and civil litigation. He is known for his strategic approach and dedication to justice."
    }
];

export default function ProfilePage() {
    const { id } = useParams();
    const { t } = useLanguage();
    const [member, setMember] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMember = async () => {
            setLoading(true);
            if (typeof id === 'string') {
                if (id.startsWith('db-')) {
                    const dbId = id.replace('db-', '');
                    const { data, error } = await supabase
                        .from('network_applications')
                        .select('*')
                        .eq('id', dbId)
                        .single();

                    if (!error && data) {
                        setMember({
                            id: id,
                            name: data.full_name,
                            firm: data.firm_name || "Legal Professional",
                            location: data.location,
                            expertise: data.practice_areas?.join(", ") || "General Practice",
                            image: data.profile_image_url || "https://images.unsplash.com/photo-1589216532372-1c2a367900d9?auto=format&fit=crop&q=80&w=2000",
                            bio: data.message || "Professional member of the Pan Afric Law Network."
                        });
                    }
                } else {
                    const staticMember = HARDCODED_MEMBERS.find(m => m.id === id);
                    if (staticMember) {
                        setMember(staticMember);
                    }
                }
            }
            setLoading(false);
        };

        fetchMember();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-secondary border-t-transparent"></div>
            </div>
        );
    }

    if (!member) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-6">
                <p className="font-serif text-3xl italic text-muted">Member profile not found.</p>
                <Link href="/network" className="text-secondary font-sans font-bold uppercase tracking-widest text-xs flex items-center">
                    <ArrowLeft size={16} className="mr-2" /> Back to Directory
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen flex flex-col">
            {/* Hero Section */}
            <section className="relative h-[60vh] overflow-hidden">
                <div className="absolute inset-0">
                    <img src={member.image} className="w-full h-full object-cover grayscale brightness-50" alt={member.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 w-full p-20 lg:p-32 z-10">
                    <div className="max-w-7xl mx-auto">
                        <Link href="/network" className="inline-flex items-center text-white/50 hover:text-white font-sans font-bold uppercase tracking-widest text-xs mb-12 transition-colors">
                            <ArrowLeft size={16} className="mr-2" /> Back to Directory
                        </Link>
                        <div className="max-w-4xl space-y-6">
                            <div className="flex items-center space-x-3 text-secondary">
                                <ShieldCheck size={20} />
                                <span className="font-sans text-xs font-black uppercase tracking-[0.3em]">Verified Network Member</span>
                            </div>
                            <h1 className="font-serif text-6xl md:text-8xl font-black text-white italic leading-none">{member.name}</h1>
                            <p className="font-sans text-xl text-white/70 uppercase tracking-widest">{member.firm}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="flex-grow py-32 bg-[#fcfcfc]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-20">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-20">
                            <div className="space-y-8">
                                <h3 className="font-serif text-4xl font-bold italic text-black border-l-8 border-secondary pl-8">Professional Bio</h3>
                                <p className="font-sans text-xl text-black/70 leading-relaxed whitespace-pre-wrap">
                                    {member.bio}
                                </p>
                            </div>

                            <div className="space-y-8">
                                <h3 className="font-serif text-3xl font-bold italic text-black">Expertise & Specializations</h3>
                                <div className="flex flex-wrap gap-4">
                                    {member.expertise.split(',').map((area: string) => (
                                        <span key={area} className="bg-white border border-border px-8 py-4 font-sans text-sm font-bold uppercase tracking-widest text-black shadow-sm">
                                            {area.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-12">
                            <div className="bg-white p-12 border border-border shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 -translate-y-1/2 translate-x-1/2 rounded-full"></div>
                                <h4 className="font-sans text-center text-xs font-black uppercase tracking-[0.2em] text-muted mb-10 border-b border-border pb-6">Contact & Location</h4>
                                <div className="space-y-8">
                                    <div className="flex items-start space-x-6">
                                        <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                                            <MapPin size={18} className="text-secondary" />
                                        </div>
                                        <div>
                                            <p className="font-sans text-[10px] font-black uppercase tracking-widest text-muted mb-1">Location</p>
                                            <p className="font-serif text-lg font-bold italic">{member.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-6">
                                        <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                                            <Briefcase size={18} className="text-secondary" />
                                        </div>
                                        <div>
                                            <p className="font-sans text-[10px] font-black uppercase tracking-widest text-muted mb-1">Primary Firm</p>
                                            <p className="font-serif text-lg font-bold italic">{member.firm}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-12">
                                    <button className="w-full bg-black text-white py-5 font-sans font-bold uppercase tracking-widest text-xs hover:bg-secondary transition-all shadow-xl">
                                        Request Consultation
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
