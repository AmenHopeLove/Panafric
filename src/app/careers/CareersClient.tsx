"use client";

import { useLanguage } from "@/context/LanguageContext";
import { GraduationCap, Users, BookOpen, ArrowRight, Briefcase, Award, MapPin, Clock, ExternalLink, Loader2, X, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase-client";

export default function CareersClient() {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [internships, setInternships] = useState<any[]>([]);
    const [mentors, setMentors] = useState<any[]>([]);
    const [resources, setResources] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [ventures, setVentures] = useState<any[]>([]);

    // Application Modal State
    const [isAppModalOpen, setIsAppModalOpen] = useState(false);
    const [selectedInternship, setSelectedInternship] = useState<any | null>(null);
    const [appLoading, setAppLoading] = useState(false);
    const [appSuccess, setAppSuccess] = useState(false);
    const [appFormData, setAppFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        university: "",
        major: "",
        linkedin_url: "",
        resume_url: "",
        cover_letter: ""
    });

    useEffect(() => {
        fetchCareerData();
    }, []);

    async function fetchCareerData() {
        setLoading(true);
        try {
            const [intRes, mentRes, trainRes, eventRes, ventureRes] = await Promise.all([
                supabase.from('career_internships').select('*').eq('is_active', true).order('created_at', { ascending: false }),
                supabase.from('mentorship_programs').select('*').eq('is_available', true).order('created_at', { ascending: false }),
                supabase.from('training_resources').select('*').order('created_at', { ascending: false }),
                supabase.from('career_events').select('*').eq('is_active', true).order('created_at', { ascending: false }),
                supabase.from('networking_ventures').select('*').eq('is_active', true).order('created_at', { ascending: false })
            ]);

            setInternships(intRes.data || []);
            setMentors(mentRes.data || []);
            setResources(trainRes.data || []);
            setEvents(eventRes.data || []);
            setVentures(ventureRes.data || []);
        } catch (err) {
            console.error("Error fetching career data:", err);
        } finally {
            setLoading(false);
        }
    }

    const openApplication = (job: any) => {
        setSelectedInternship(job);
        setIsAppModalOpen(true);
        setAppSuccess(false);
    };

    const handleAppSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAppLoading(true);

        try {
            const response = await fetch('/api/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'internship',
                    payload: {
                        ...appFormData,
                        internship_id: selectedInternship.id
                    }
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to submit application');
            }
            setAppSuccess(true);
            setTimeout(() => {
                setIsAppModalOpen(false);
                setAppFormData({
                    full_name: "",
                    email: "",
                    phone: "",
                    university: "",
                    major: "",
                    linkedin_url: "",
                    resume_url: "",
                    cover_letter: ""
                });
            }, 3000);
        } catch (err: any) {
            alert("Error submitting application: " + err.message);
        } finally {
            setAppLoading(false);
        }
    };

    // Training Access Flow
    const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState<any | null>(null);

    const openTrainingAccess = (res: any) => {
        setAppSuccess(false);
        setSelectedResource(res);
        setIsTrainingModalOpen(true);
    };

    const handleTrainingAccessRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setAppLoading(true);
        try {
            // Log as a generic inquiry via the contact API
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: appFormData.full_name,
                    email: appFormData.email,
                    subject: `Training Access Request: ${selectedResource?.title}`,
                    message: `User is requesting access to training resource: ${selectedResource?.title}. LinkedIn: ${appFormData.linkedin_url}`
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to submit request');
            }
            setAppSuccess(true);
            setTimeout(() => {
                setIsTrainingModalOpen(false);
            }, 3000);
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setAppLoading(false);
        }
    };

    return (
        <div className="flex flex-col bg-white">
            {/* Hero Section */}
            <section className="relative py-32 lg:py-48 bg-black overflow-hidden">
                <div className="absolute inset-0 opacity-40">
                    <img
                        src="/images/careers/careers-hero.jpg"
                        alt="Students Collaborating"
                        className="w-full h-full object-cover grayscale"
                    />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-secondary/20 border border-secondary/30 rounded-full mb-6">
                        <span className="text-secondary font-sans text-[10px] font-bold uppercase tracking-widest">{t("careersSubtitle")}</span>
                    </div>
                    <h1 className="font-serif text-5xl md:text-8xl font-black text-white leading-tight max-w-5xl mx-auto italic">
                        {t("careersTitle")}
                    </h1>
                    <p className="mt-8 text-xl text-white/70 font-sans font-light max-w-2xl mx-auto leading-relaxed">
                        {t("careerDesc")}
                    </p>
                </div>
            </section>

            {/* Dynamic Content Sections */}
            <div className="py-24 lg:py-40 space-y-32 lg:space-y-48">

                {/* 1. Legal Internships */}
                <section id="internships" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div className="space-y-4 max-w-2xl">
                            <h2 className="font-serif text-5xl md:text-6xl font-black text-black italic leading-none">Legal Internships</h2>
                            <p className="text-muted font-sans text-lg leading-relaxed font-light">
                                Discover high-impact opportunities with Pan-Afric Law Firm and our elite network partners.
                            </p>
                        </div>
                        <div className="h-px bg-border flex-grow hidden md:block mb-6 mx-8"></div>
                        <div className="flex items-center space-x-4">
                            <Briefcase className="text-secondary" size={32} />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-secondary" size={40} /></div>
                    ) : internships.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {internships.map((job) => (
                                <div key={job.id} className="bg-gray-50 p-10 border border-border group hover:bg-black transition-all duration-500 rounded-sm flex flex-col justify-between h-full">
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-start">
                                            <span className="text-[10px] font-black uppercase tracking-widest bg-secondary/10 text-secondary px-2 py-0.5 rounded-sm">{job.type}</span>
                                            <span className="text-[10px] text-muted font-bold uppercase tracking-widest group-hover:text-gray-400">{new Date(job.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <h3 className="font-serif text-2xl font-bold text-black group-hover:text-white transition-colors italic">{job.title}</h3>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted group-hover:text-secondary italic">{job.company}</p>
                                        <div className="flex items-center text-xs text-muted group-hover:text-gray-400">
                                            <MapPin size={12} className="mr-2 text-secondary" /> {job.location}
                                        </div>
                                        <p className="text-sm text-black/70 group-hover:text-gray-300 font-sans leading-relaxed line-clamp-3">
                                            {job.description}
                                        </p>
                                    </div>
                                    <div className="pt-8 mt-8 border-t border-border group-hover:border-white/10">
                                        <button
                                            onClick={() => openApplication(job)}
                                            className="inline-flex items-center text-black font-sans font-black uppercase tracking-widest text-[10px] group-hover:text-secondary group-hover:translate-x-2 transition-all"
                                        >
                                            Apply Now <ArrowRight size={14} className="ml-2" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-20 text-center border border-dashed border-border rounded-sm">
                            <p className="font-serif text-2xl italic text-muted">No active openings at the moment. Keep checking back.</p>
                        </div>
                    )}
                </section>

                {/* 2. Mentorship Matching */}
                <section id="mentorship" className="bg-black py-24 lg:py-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                            <div className="space-y-4 max-w-2xl">
                                <h2 className="font-serif text-5xl md:text-6xl font-black text-white italic leading-none">Mentorship Matching</h2>
                                <p className="text-gray-400 font-sans text-lg leading-relaxed font-light">
                                    Connect with Pan-Africa's most distinguished legal minds for guidance and professional growth.
                                </p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Users className="text-secondary" size={32} />
                            </div>
                        </div>

                        {mentors.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                                {mentors.map((mentor) => (
                                    <div key={mentor.id} className="space-y-6 group">
                                        <div className="aspect-[4/5] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 bg-gray-900 border border-white/10 relative">
                                            {mentor.image_url ? (
                                                <img src={mentor.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={mentor.mentor_name} />
                                            ) : (
                                                <img
                                                    src="/images/careers/mentor-placeholder-2.png"
                                                    className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-all duration-700 brightness-50 group-hover:brightness-100"
                                                    alt="Mentor Placeholder"
                                                />
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="font-serif text-2xl font-bold text-white italic leading-tight">{mentor.mentor_name}</h3>
                                            <p className="text-secondary font-sans font-black uppercase tracking-widest text-[10px]">{mentor.expertise}</p>
                                            <p className="text-xs text-gray-500 font-sans">{mentor.location}</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-12 space-y-6 hover:bg-white/5 transition-all text-center">
                                    <h4 className="font-serif text-xl text-white italic">Become a Mentor?</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed font-sans">Share your wisdom and shape the future of African law.</p>
                                    <Link href="/contact" className="text-secondary font-black uppercase tracking-widest text-[10px] border-b border-secondary pb-1">Join the Faculty</Link>
                                </div>
                            </div>
                        ) : (
                            <div className="p-20 text-center border border-dashed border-white/10 rounded-sm">
                                <p className="font-serif text-2xl italic text-gray-500 text-muted">The mentorship faculty is currently under review.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* 3. Training Resources */}
                <section id="training" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                        <div className="space-y-4 max-w-2xl">
                            <h2 className="font-serif text-5xl md:text-6xl font-black text-black italic leading-none text-right md:text-left">Legal Training Resources</h2>
                            <p className="text-muted font-sans text-lg leading-relaxed font-light text-right md:text-left">
                                Exclusive webinars, whitepapers, and guides tailored for the modern Pan-African practitioner.
                            </p>
                        </div>
                        <div className="h-px bg-border flex-grow hidden md:block mb-6 mx-8"></div>
                        <div className="flex items-center space-x-4">
                            <BookOpen className="text-secondary" size={32} />
                        </div>
                    </div>

                    {resources.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
                            {resources.map((res) => (
                                <div key={res.id} className="space-y-8 group">
                                    <div className="aspect-[16/10] overflow-hidden bg-gray-100 border border-border relative">
                                        {res.image_url ? (
                                            <img src={res.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={res.title} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-black text-white p-8 overflow-hidden">
                                                <h4 className="font-serif text-3xl font-black italic opacity-20 text-center">{res.title}</h4>
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-black text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">{res.resource_type}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="font-serif text-2xl font-bold text-black italic group-hover:text-secondary transition-colors">{res.title}</h3>
                                        <p className="text-sm text-muted font-sans leading-relaxed line-clamp-2">
                                            {res.description}
                                        </p>
                                        <div className="pt-4 flex justify-end">
                                            <button
                                                onClick={() => openTrainingAccess(res)}
                                                className="bg-black text-white p-4 hover:bg-secondary transition-all shadow-xl"
                                            >
                                                <ExternalLink size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-20 text-center border border-dashed border-border rounded-sm">
                            <p className="font-serif text-2xl italic text-muted">New resources are currently being curated for the portal.</p>
                        </div>
                    )}
                </section>

                {/* 4. Private Events & Webinars (Members Only) */}
                <section id="private-events" className="bg-black py-32 lg:py-48 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-[radial-gradient(circle_at_70%_30%,_rgba(194,65,12,0.1),_transparent_70%)]" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="max-w-3xl mb-24 space-y-6">
                            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full">
                                <Award className="text-secondary" size={14} />
                                <span className="text-secondary font-sans text-[10px] font-black uppercase tracking-[0.3em]">Exclusive Benefits</span>
                            </div>
                            <h2 className="font-serif text-6xl md:text-7xl font-black text-white leading-tight italic">
                                Private Events <br />
                                <span className="text-brand">& Webinars</span>
                            </h2>
                            <p className="text-gray-400 font-sans text-xl font-light leading-relaxed">
                                Join high-level legal briefings and virtual roundtables hosted by Pan-Africa's most distinguished legal minds.
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-12">
                            {events.length > 0 ? (
                                events.map((event, idx) => (
                                    <div key={event.id} className="luxury-card border-white/10 bg-white/5 p-12 space-y-8 group hover:bg-white/10 transition-all duration-700">
                                        <div className={`h-16 w-16 ${event.event_type === 'webinar' ? 'brand-gradient text-white' : 'border border-secondary/50 text-secondary'} rounded-2xl flex items-center justify-center shadow-brand transition-transform duration-500 group-hover:scale-110`}>
                                            {event.event_type === 'webinar' ? <Clock size={32} /> : <Users size={32} />}
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="font-serif text-3xl font-bold text-white italic group-hover:text-brand transition-colors">
                                                {event.title}
                                            </h3>
                                            <p className="text-gray-400 font-sans leading-relaxed font-light">
                                                {event.description}
                                            </p>
                                            {event.highlights && Array.isArray(event.highlights) && event.highlights.length > 0 && (
                                                <ul className="space-y-4 pt-4">
                                                    {event.highlights.map((item: any, hIdx: number) => {
                                                        let parsedItem = null;
                                                        try {
                                                            if (typeof item === 'string' && item.startsWith('{')) {
                                                                parsedItem = JSON.parse(item);
                                                            } else if (typeof item === 'object' && item !== null) {
                                                                parsedItem = item;
                                                            }
                                                        } catch (e) {
                                                            // Ignore if not valid JSON
                                                        }

                                                        if (parsedItem) {
                                                            const speaker = parsedItem.SPEAKER || parsedItem.speaker;
                                                            const topic = parsedItem.TOPIC || parsedItem.topic;
                                                            const time = parsedItem.TIME || parsedItem.time;

                                                            if (speaker && topic && time) {
                                                                return (
                                                                    <li key={hIdx} className="bg-black/20 border border-white/10 rounded-xl p-6 hover:bg-white/5 transition-all duration-500 group/speaker">
                                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                                            <div className="space-y-2">
                                                                                <h4 className="font-serif text-xl italic text-white group-hover/speaker:text-brand transition-colors">{String(speaker)}</h4>
                                                                                <p className="font-sans text-sm text-gray-400 font-light">{String(topic)}</p>
                                                                            </div>
                                                                            <div className="inline-flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 shrink-0">
                                                                                <Clock size={14} className="text-secondary" />
                                                                                <span className="text-xs font-black uppercase tracking-widest text-secondary">{String(time)}</span>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                );
                                                            }

                                                            return (
                                                                <li key={hIdx} className="flex flex-col space-y-2 bg-black/20 border border-white/10 rounded-xl p-6">
                                                                    {Object.entries(parsedItem).map(([key, value]) => (
                                                                        <div key={key} className="flex flex-wrap items-baseline gap-2">
                                                                            <span className="text-xs font-black uppercase tracking-widest text-secondary/80">{key}</span>
                                                                            <span className="text-sm font-sans text-gray-300">{String(value)}</span>
                                                                        </div>
                                                                    ))}
                                                                </li>
                                                            );
                                                        }

                                                        return (
                                                            <li key={hIdx} className="flex items-center text-xs text-gray-500 font-sans uppercase tracking-widest group-hover:text-gray-300">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-secondary mr-3 shrink-0" />
                                                                <span>{String(item)}</span>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            )}
                                            {event.event_type === 'roundtable' && (
                                                <p className="text-[10px] text-secondary font-black uppercase tracking-[0.2em] italic flex items-center pt-4">
                                                    Active Networking Required <ArrowRight size={12} className="ml-2" />
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className="luxury-card border-white/10 bg-white/5 p-12 space-y-8 group hover:bg-white/10 transition-all duration-700">
                                        <div className="h-16 w-16 brand-gradient rounded-2xl flex items-center justify-center text-white shadow-brand transition-transform duration-500 group-hover:scale-110">
                                            <Clock size={32} />
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="font-serif text-3xl font-bold text-white italic group-hover:text-brand transition-colors">Exclusive Webinars</h3>
                                            <p className="text-gray-400 font-sans leading-relaxed font-light">
                                                Access high-impact briefings on cross-border trade, regulatory changes, and continental legal trends.
                                            </p>
                                            <ul className="space-y-3 pt-4">
                                                {[
                                                    "Strategic Commercial Litigation",
                                                    "AfCFTA Implementation Insights",
                                                    "Sustainable Investment Frameworks"
                                                ].map((item, idx) => (
                                                    <li key={idx} className="flex items-center text-xs text-gray-500 font-sans uppercase tracking-widest group-hover:text-gray-300">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-secondary mr-3" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="luxury-card border-white/10 bg-white/5 p-12 space-y-8 group hover:bg-white/10 transition-all duration-700">
                                        <div className="h-16 w-16 border border-secondary/50 rounded-2xl flex items-center justify-center text-secondary shadow-brand/20 transition-transform duration-500 group-hover:scale-110">
                                            <Users size={32} />
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="font-serif text-3xl font-bold text-white italic group-hover:text-brand transition-colors">Virtual Roundtables</h3>
                                            <p className="text-gray-400 font-sans leading-relaxed font-light">
                                                Engage in intimate, off-the-record strategy sessions with elite legal practitioners and policymakers.
                                            </p>
                                            <p className="text-[10px] text-secondary font-black uppercase tracking-[0.2em] italic flex items-center pt-4">
                                                Active Networking Required <ArrowRight size={12} className="ml-2" />
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* 5. Networking Lounge */}
                <section id="networking-lounge" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="luxury-card-gold overflow-hidden rounded-[50px] relative">
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-3xl" />
                        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center p-16 lg:p-24">
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <h3 className="font-sans text-sm font-black text-secondary uppercase tracking-[0.4em]">Strategic Synergy</h3>
                                    <h2 className="font-serif text-5xl lg:text-7xl font-black text-black leading-[1.1] tracking-tighter italic">
                                        The Networking <br />
                                        <span className="text-brand">Lounge</span>
                                    </h2>
                                </div>
                                <p className="text-muted font-sans text-xl font-light leading-relaxed italic">
                                    "A private sanctuary for chartered members to architect cross-border joint ventures and continental growth."
                                </p>
                                <div className="flex flex-wrap gap-8">
                                    <div className="space-y-1">
                                        <p className="text-3xl font-serif font-black text-black">500+</p>
                                        <p className="text-[10px] font-black text-muted uppercase tracking-widest">Active Members</p>
                                    </div>
                                    <div className="w-px h-12 bg-border hidden sm:block" />
                                    <div className="space-y-1">
                                        <p className="text-3xl font-serif font-black text-black">AfCFTA</p>
                                        <p className="text-[10px] font-black text-muted uppercase tracking-widest">Focused Alliances</p>
                                    </div>
                                </div>
                                <div className="pt-6">
                                    <Link 
                                        href="/network" 
                                        className="group inline-flex items-center space-x-6 bg-primary text-white px-10 py-6 rounded-full font-sans font-black uppercase tracking-[0.2em] text-[10px] hover:bg-black transition-all shadow-brand"
                                    >
                                        <span>Access Directory</span>
                                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
                                    </Link>
                                </div>
                            </div>

                            <div className="relative group">
                                <div className="absolute -inset-4 brand-gradient rounded-[40px] opacity-10 group-hover:opacity-20 transition-opacity blur-2xl" />
                                <div className="relative luxury-card border-accent/30 bg-white/50 backdrop-blur-xl rotate-2 group-hover:rotate-0 transition-all duration-700 p-8 shadow-2xl">
                                    <div className="flex justify-between items-center mb-8 border-b border-accent/50 pb-6">
                                        <p className="font-serif text-xl font-black italic">Recent Ventures</p>
                                        <Users className="text-secondary" size={20} />
                                    </div>
                                    <div className="space-y-6">
                                        {ventures.length > 0 ? (
                                            ventures.map((venture, i) => (
                                                <div key={venture.id} className="flex justify-between items-center group/item hover:bg-accent/30 p-4 rounded-2xl transition-all cursor-pointer">
                                                    <div>
                                                        <p className="font-sans font-bold text-sm text-black">{venture.title}</p>
                                                        <p className="text-[10px] text-muted uppercase tracking-widest">{venture.location}</p>
                                                    </div>
                                                    <span className="text-[8px] font-black bg-secondary/10 text-secondary px-2 py-0.5 rounded-sm">{venture.category}</span>
                                                </div>
                                            ))
                                        ) : (
                                            [
                                                { title: "Pan-African Tech Fund", location: "Nigeria / Kenya", size: "Strategic" },
                                                { title: "Renewable Energy JV", location: "South Africa / Ghana", size: "Corporate" },
                                                { title: "Mining Infrastructure", location: "Ethiopia / DRC", size: "Governmental" }
                                            ].map((venture, i) => (
                                                <div key={i} className="flex justify-between items-center group/item hover:bg-accent/30 p-4 rounded-2xl transition-all cursor-pointer">
                                                    <div>
                                                        <p className="font-sans font-bold text-sm text-black">{venture.title}</p>
                                                        <p className="text-[10px] text-muted uppercase tracking-widest">{venture.location}</p>
                                                    </div>
                                                    <span className="text-[8px] font-black bg-secondary/10 text-secondary px-2 py-0.5 rounded-sm">{venture.size}</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* CTA Section */}
            <section className="bg-secondary py-32 text-center overflow-hidden relative">
                <div className="absolute inset-0 opacity-10 flex items-center justify-center font-serif text-[20vw] font-black italic select-none pointer-events-none text-white whitespace-nowrap">
                    CAREER HUB
                </div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
                    <h2 className="font-serif text-5xl md:text-7xl font-black text-white italic leading-tight">
                        Launch Your <br />
                        <span className="text-black">Continental Journey.</span>
                    </h2>
                    <p className="text-xl text-white font-sans font-light max-w-2xl mx-auto">
                        Don't see the right fit? Contact our talent development team to discuss curated career pathing opportunities.
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <Link href="/contact" className="w-full md:w-auto bg-black text-white px-12 py-6 font-sans font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all shadow-2xl">
                            Inquire Now
                        </Link>
                        <Link href="/network" className="w-full md:w-auto border border-black text-black px-12 py-6 font-sans font-bold uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all">
                            Explore Network
                        </Link>
                    </div>
                </div>
            </section>
            {/* Internship Application Modal */}
            {isAppModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => !appLoading && setIsAppModalOpen(false)}
                    ></div>

                    <div className="relative w-full max-w-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-8 border-b border-border bg-white sticky top-0 z-10">
                            <div>
                                <h2 className="font-serif text-2xl font-black italic">Internship Application</h2>
                                <p className="text-[10px] text-secondary font-black uppercase tracking-widest mt-1">{selectedInternship?.title} @ {selectedInternship?.company}</p>
                            </div>
                            <button
                                onClick={() => setIsAppModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 lg:p-12 overflow-y-auto">
                            {appSuccess ? (
                                <div className="py-12 text-center space-y-6">
                                    <div className="flex justify-center">
                                        <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                            <CheckCircle size={40} />
                                        </div>
                                    </div>
                                    <h3 className="font-serif text-3xl font-black italic">Application Received</h3>
                                    <p className="text-muted font-sans max-w-sm mx-auto">Thank you for your interest! Our talent team will review your profile and get back to you shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleAppSubmit} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted">Full Name</label>
                                            <input
                                                required
                                                type="text"
                                                className="w-full p-3 border border-border outline-none focus:border-secondary transition-all text-sm"
                                                value={appFormData.full_name}
                                                onChange={e => setAppFormData({ ...appFormData, full_name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted">Email Address</label>
                                            <input
                                                required
                                                type="email"
                                                className="w-full p-3 border border-border outline-none focus:border-secondary transition-all text-sm"
                                                value={appFormData.email}
                                                onChange={e => setAppFormData({ ...appFormData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted">University</label>
                                            <input
                                                required
                                                type="text"
                                                className="w-full p-3 border border-border outline-none focus:border-secondary transition-all text-sm"
                                                value={appFormData.university}
                                                onChange={e => setAppFormData({ ...appFormData, university: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted">Major / Field of Study</label>
                                            <input
                                                required
                                                type="text"
                                                className="w-full p-3 border border-border outline-none focus:border-secondary transition-all text-sm"
                                                value={appFormData.major}
                                                onChange={e => setAppFormData({ ...appFormData, major: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted">LinkedIn Profile URL</label>
                                        <input
                                            type="url"
                                            className="w-full p-3 border border-border outline-none focus:border-secondary transition-all text-sm"
                                            value={appFormData.linkedin_url}
                                            onChange={e => setAppFormData({ ...appFormData, linkedin_url: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted">Resume / Portfolio Link</label>
                                        <input
                                            required
                                            type="url"
                                            className="w-full p-3 border border-border outline-none focus:border-secondary transition-all text-sm"
                                            placeholder="Link to your Google Drive, Dropbox, or Portfolio"
                                            value={appFormData.resume_url}
                                            onChange={e => setAppFormData({ ...appFormData, resume_url: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted">Brief Pitch (Cover Letter)</label>
                                        <textarea
                                            className="w-full p-4 border border-border outline-none focus:border-secondary transition-all text-sm h-32"
                                            placeholder="Tell us why you're a perfect fit for this role..."
                                            value={appFormData.cover_letter}
                                            onChange={e => setAppFormData({ ...appFormData, cover_letter: e.target.value })}
                                        />
                                    </div>

                                    <button
                                        disabled={appLoading}
                                        className="w-full bg-black text-white p-5 font-bold uppercase tracking-widest text-xs hover:bg-secondary transition-all shadow-xl disabled:opacity-50"
                                    >
                                        {appLoading ? <Loader2 className="animate-spin mx-auto text-white" size={20} /> : "Submit Application"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Training Access Request Modal */}
            {isTrainingModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => !appLoading && setIsTrainingModalOpen(false)}
                    ></div>

                    <div className="relative w-full max-w-xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-8 border-b border-border bg-white sticky top-0 z-10">
                            <div>
                                <h2 className="font-serif text-2xl font-black italic">Request Access</h2>
                                <p className="text-[10px] text-secondary font-black uppercase tracking-widest mt-1">Resource: {selectedResource?.title}</p>
                            </div>
                            <button
                                onClick={() => setIsTrainingModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 lg:p-12 overflow-y-auto">
                            {appSuccess ? (
                                <div className="py-12 text-center space-y-6">
                                    <div className="flex justify-center">
                                        <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                            <CheckCircle size={40} />
                                        </div>
                                    </div>
                                    <h3 className="font-serif text-3xl font-black italic">Request Submitted</h3>
                                    <p className="text-muted font-sans max-w-sm mx-auto">Our team will verify your credentials and grant you access to the "{selectedResource?.title}" resource via email.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleTrainingAccessRequest} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted">Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full p-3 border border-border outline-none focus:border-secondary transition-all text-sm"
                                            value={appFormData.full_name}
                                            onChange={e => setAppFormData({ ...appFormData, full_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted">Professional Email</label>
                                        <input
                                            required
                                            type="email"
                                            className="w-full p-3 border border-border outline-none focus:border-secondary transition-all text-sm"
                                            value={appFormData.email}
                                            onChange={e => setAppFormData({ ...appFormData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted">LinkedIn Profile</label>
                                        <input
                                            required
                                            type="url"
                                            className="w-full p-3 border border-border outline-none focus:border-secondary transition-all text-sm"
                                            placeholder="Verification of professional status"
                                            value={appFormData.linkedin_url}
                                            onChange={e => setAppFormData({ ...appFormData, linkedin_url: e.target.value })}
                                        />
                                    </div>

                                    <div className="bg-gray-50 p-6 space-y-3">
                                        <div className="flex items-center text-secondary">
                                            <Award size={16} className="mr-2" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Premium Content</span>
                                        </div>
                                        <p className="text-[10px] text-muted leading-relaxed uppercase tracking-widest font-bold">
                                            Access to the PALF Training Repository is restricted to verified network members and students.
                                        </p>
                                    </div>

                                    <button
                                        disabled={appLoading}
                                        className="w-full bg-black text-white p-5 font-bold uppercase tracking-widest text-xs hover:bg-secondary transition-all shadow-xl disabled:opacity-50"
                                    >
                                        {appLoading ? <Loader2 className="animate-spin mx-auto text-white" size={20} /> : "Request Secure Link"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
