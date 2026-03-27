"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { LayoutDashboard, FileText, Users, Settings, LogOut, Loader2, ShieldCheck, Scale } from "lucide-react";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
    const { t } = useLanguage();
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (!session) {
                router.push("/contact"); // Redirect to login
                return;
            }

            setUser(session.user);

            // Fetch profile
            const { data: prof } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            setProfile(prof || { role: 'client', full_name: session.user.email });

            setLoading(false);
        };

        checkAuth();
    }, [router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/contact");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fcfcfc] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-secondary" size={40} />
                <p className="font-sans text-xs uppercase tracking-widest text-muted">Authenticating Secure Session...</p>
            </div>
        );
    }

    const isMember = profile?.role === 'member';

    return (
        <div className="min-h-screen bg-[#fcfcfc] flex">
            {/* Sidebar */}
            <aside className="w-72 bg-black text-white flex flex-col border-r border-white/10 sticky top-0 h-screen overflow-y-auto">
                <div className="p-10 border-b border-white/10">
                    <Link href="/" className="flex items-center space-x-3 group">
                        <Scale className="text-secondary group-hover:scale-110 transition-transform duration-500" size={28} />
                        <div>
                            <span className="font-serif font-black text-xl italic tracking-tight leading-none block">PALF</span>
                            <span className="font-sans text-[8px] uppercase tracking-[0.3em] text-secondary">Secure Portal</span>
                        </div>
                    </Link>
                </div>

                <div className="flex-1 py-10 px-6 space-y-2">
                    <p className="px-4 font-sans text-[10px] uppercase tracking-widest text-white/40 mb-4">{isMember ? t('verifiedMember') : t('consultation')}</p>
                    
                    <Link href={isMember ? "/member" : "/client"} className={`flex items-center space-x-4 px-4 py-4 rounded-xl transition-all ${pathname === (isMember ? '/member' : '/client') ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                        <LayoutDashboard size={18} />
                        <span className="font-sans text-xs tracking-widest uppercase font-bold">{t('portalDashboard')}</span>
                    </Link>

                    {isMember && (
                        <>
                            <Link href="/member/directory" className={`flex items-center space-x-4 px-4 py-4 rounded-xl transition-all ${pathname === '/member/directory' ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                                <Users size={18} />
                                <span className="font-sans text-xs tracking-widest uppercase font-bold">{t('portalDirectory')}</span>
                            </Link>
                            <Link href="/member/resources" className={`flex items-center space-x-4 px-4 py-4 rounded-xl transition-all ${pathname === '/member/resources' ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                                <FileText size={18} />
                                <span className="font-sans text-xs tracking-widest uppercase font-bold">{t('portalVault')}</span>
                            </Link>
                        </>
                    )}

                    {!isMember && (
                        <Link href="/client/cases" className={`flex items-center space-x-4 px-4 py-4 rounded-xl transition-all ${pathname === '/client/cases' ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                            <FileText size={18} />
                            <span className="font-sans text-xs tracking-widest uppercase font-bold">{t('activeCases')}</span>
                        </Link>
                    )}
                </div>

                <div className="p-6 border-t border-white/10 space-y-4">
                    <div className="px-4 pb-4 border-b border-white/5">
                        <p className="font-sans text-[10px] font-black tracking-widest text-white uppercase truncate">{profile?.full_name}</p>
                        <p className="font-sans text-[10px] text-white/40 truncate">{user?.email}</p>
                    </div>
                    <button onClick={handleSignOut} className="w-full flex items-center space-x-4 px-4 py-4 rounded-xl transition-all text-white/60 hover:bg-red-500/10 hover:text-red-500">
                        <LogOut size={18} />
                        <span className="font-sans text-xs tracking-widest uppercase font-bold">{t('portalSignOut')}</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
                <header className="bg-white border-b border-border p-6 flex justify-end items-center sticky top-0 z-20">
                    <div className="flex items-center space-x-4 text-xs font-sans font-bold uppercase tracking-widest text-muted">
                        <ShieldCheck size={16} className="text-secondary" />
                        <span>{t('portalSecureSession')}</span>
                    </div>
                </header>
                <div className="p-8 lg:p-16">
                    {children}
                </div>
            </main>
        </div>
    );
}
