"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import { useRouter, usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Newspaper,
    MessageSquare,
    Settings,
    Users,
    LogOut,
    Scale,
    ChevronLeft,
    Menu,
    Briefcase,
    GraduationCap,
    BookOpen,
    Zap
} from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkUser = async () => {
            // Safety timeout: don't let the loading screen hang forever
            const timeout = setTimeout(() => {
                console.warn("Session check timed out. Showing content anyway.");
                setLoading(false);
            }, 3000);

            try {
                const { data: { session } } = await supabase.auth.getSession();
                clearTimeout(timeout);

                if (!session) {
                    console.log("No session found in AdminLayout, redirecting to login...");
                    router.push("/login");
                } else {
                    console.log("Session verified in AdminLayout.");
                    setLoading(false);
                }
            } catch (error) {
                clearTimeout(timeout);
                console.error("Session check error:", error);
                router.push("/login");
            }
        };
        checkUser();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    const navItems = [
        { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={20} /> },
        { name: "Legal Cases", href: "/admin/cases", icon: <Briefcase size={20} /> },
        { name: "News CMS", href: "/admin/news", icon: <Newspaper size={20} /> },
        { name: "Insights CMS", href: "/admin/insights", icon: <Scale size={20} /> },
        { name: "Inquiries", href: "/admin/consultations", icon: <MessageSquare size={20} /> },
        { name: "Law Network", href: "/admin/network", icon: <Users size={20} /> },
        { name: "Leadership", href: "/admin/about/leadership", icon: <Users size={20} /> },
        { name: "Internships", href: "/admin/careers/internships", icon: <Briefcase size={20} /> },
        { name: "Mentors", href: "/admin/careers/mentors", icon: <GraduationCap size={20} /> },
        { name: "Events", href: "/admin/careers/events", icon: <MessageSquare size={20} /> },
        { name: "Ventures", href: "/admin/careers/ventures", icon: <Scale size={20} /> },
        { name: "Training", href: "/admin/careers/resources", icon: <BookOpen size={20} /> },
        { name: "AI Engine", href: "/admin/ai-engine", icon: <Zap size={20} /> },
        { name: "Site Config", href: "/admin/settings", icon: <Settings size={20} /> },
        { name: "Users", href: "/admin/users", icon: <Users size={20} /> },
    ];

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="animate-pulse flex flex-col items-center space-y-4">
                <Scale className="h-12 w-12 text-primary animate-bounce" />
                <p className="font-sans text-xs uppercase tracking-widest text-muted font-bold">Initializing Portal...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fcfcfc] flex">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? "w-64" : "w-20"
                    } bg-black text-white transition-all duration-300 flex flex-col z-50 fixed h-full`}
            >
                <div className="p-6 flex items-center justify-between border-b border-white/10 h-20">
                    <Link href="/admin" className={`flex items-center space-x-3 ${!isSidebarOpen && "hidden"}`}>
                        <Scale className="h-8 w-8 text-secondary" />
                        <span className="font-serif font-black text-lg tracking-tight">PORTAL</span>
                    </Link>
                    {!isSidebarOpen && <Scale className="h-8 w-8 text-secondary mx-auto" />}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-white/50 hover:text-white transition-colors"
                    >
                        {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-grow py-6 px-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center space-x-4 px-4 py-3 rounded-sm transition-all group ${pathname === item.href
                                ? "bg-secondary text-white shadow-lg"
                                : "text-white/60 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <span className={`${pathname === item.href ? "text-white" : "text-secondary group-hover:text-white"}`}>
                                {item.icon}
                            </span>
                            <span className={`font-sans text-sm font-bold uppercase tracking-widest ${!isSidebarOpen && "hidden"}`}>
                                {item.name}
                            </span>
                        </Link>
                    ))}
                </nav>

                <div className="p-6 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-4 w-full px-4 py-3 text-white/60 hover:text-white transition-colors group"
                    >
                        <LogOut size={20} className="text-secondary group-hover:text-red-500 transition-colors" />
                        <span className={`font-sans text-sm font-bold uppercase tracking-widest ${!isSidebarOpen && "hidden"}`}>
                            Logout
                        </span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-grow transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
                <header className="h-20 bg-white border-b border-border flex items-center justify-between px-10 sticky top-0 z-40">
                    <h1 className="font-serif text-2xl font-black text-black">
                        {navItems.find(i => i.href === pathname)?.name || "Management"}
                    </h1>
                    <div className="flex items-center space-x-4 italic text-muted text-sm border-l border-border pl-6">
                        Pan Afric Law Firm & Network
                    </div>
                </header>
                <div className="p-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
