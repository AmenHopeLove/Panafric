"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { ShieldAlert, CheckCircle, Lock, BookOpen, Users } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function MemberDashboard() {
    const { t } = useLanguage();
    const [application, setApplication] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.id) {
                // Fetch latest network application for this user id
                const { data } = await supabase
                    .from('network_applications')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();
                    
                setApplication(data);
            }
            setLoading(false);
        };

        fetchStatus();
    }, []);

    if (loading) {
        return <div className="h-64 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-2 border-secondary border-t-transparent"></div></div>;
    }

    if (!application || application.status === 'pending') {
        return (
            <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in py-20">
                <div className="bg-white border-2 border-yellow-400/20 p-16 text-center space-y-8 rounded-sm shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>
                    <ShieldAlert className="mx-auto text-yellow-500" size={64} />
                    <div className="space-y-4">
                        <h1 className="font-serif text-5xl font-black italic">{t('applicationUnderReview')}</h1>
                        <p className="font-sans text-muted text-lg max-w-xl mx-auto leading-relaxed">
                            Thank you for applying to the Pan-Afric Law Network. The executive committee is currently verifying your credentials. 
                            You will receive an email once your Chartered Membership is approved.
                        </p>
                    </div>
                    <div className="inline-flex items-center space-x-3 bg-gray-50 px-6 py-3 rounded-full border border-border">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                        <span className="font-sans text-[10px] font-black uppercase tracking-widest">Status: {t('paymentPending')}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-8">
                <div className="space-y-4">
                    <div className="inline-flex items-center space-x-2 text-secondary bg-secondary/10 px-3 py-1 rounded-sm">
                        <CheckCircle size={14} />
                        <span className="font-sans text-[10px] font-black uppercase tracking-[0.2em]">{t('verifiedMember')}</span>
                    </div>
                    <h1 className="font-serif text-5xl font-black italic">{t('memberDashboard')}, {application.full_name}</h1>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="luxury-card bg-black text-white p-12 rounded-3xl space-y-8 group hover:-translate-y-2 transition-transform duration-500 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 -translate-y-1/2 translate-x-1/2 rounded-full blur-3xl"></div>
                    <Users className="text-secondary" size={40} />
                    <div className="space-y-4 relative z-10">
                        <h2 className="font-serif text-3xl font-bold italic">Private Directory</h2>
                        <p className="text-white/60 font-sans font-light leading-relaxed">Access the encrypted contact information of other verified Chartered Members across the continent to build localized partnerships.</p>
                    </div>
                    <Link href="/network" className="inline-block mt-4 text-xs font-sans font-black uppercase tracking-widest border-b border-secondary pb-1 hover:text-secondary transition-colors relative z-10">View Network</Link>
                </div>

                <div className="luxury-card bg-white border border-border p-12 rounded-3xl space-y-8 group hover:-translate-y-2 transition-transform duration-500 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 -translate-y-1/2 translate-x-1/2 rounded-full blur-3xl"></div>
                    <BookOpen className="text-primary" size={40} />
                    <div className="space-y-4 relative z-10">
                        <h2 className="font-serif text-3xl font-bold italic">The Vault</h2>
                        <p className="text-muted font-sans font-light leading-relaxed">Unlock proprietary legal playbooks, cross-border trade templates, and recordings of past closed-door executive strategy sessions.</p>
                    </div>
                    <Link href="/careers#training" className="inline-flex space-x-2 items-center mt-4 text-xs font-sans font-black uppercase tracking-widest text-primary border-b border-primary pb-1 group-hover:text-secondary group-hover:border-secondary transition-colors relative z-10">
                        <Lock size={12} className="mr-2" /> Access Vault
                    </Link>
                </div>
            </div>
            
            <div className="bg-white border border-border p-10 rounded-sm">
                 <h3 className="font-serif text-2xl font-bold italic mb-6">Profile Management</h3>
                 <div className="flex items-center justify-between border-t border-border pt-6 mt-6">
                     <div>
                         <p className="font-sans font-bold text-sm">Public Directory Listing</p>
                         <p className="font-sans text-xs text-muted mt-1">Update your professional bio, practice areas, and display photo.</p>
                     </div>
                     <button className="bg-black text-white px-6 py-3 font-sans text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-colors shadow-xl">
                         Edit Profile
                     </button>
                 </div>
            </div>
        </div>
    );
}
