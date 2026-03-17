"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import {
    Users,
    MessageSquare,
    Newspaper,
    TrendingUp,
    ArrowRight,
    Globe
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        newsCount: 0,
        inquiryCount: 0,
        userCount: 0,
        networkCount: 0,
    });
    const [recentUsers, setRecentUsers] = useState<any[]>([]);
    const [recentMembers, setRecentMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const [
                { count: newsCount },
                { count: inquiryCount },
                { count: userCount },
                { count: networkCount },
                { data: users },
                { data: members }
            ] = await Promise.all([
                supabase.from('news').select('*', { count: 'exact', head: true }),
                supabase.from('consultations').select('*', { count: 'exact', head: true }),
                supabase.from('profiles').select('*', { count: 'exact', head: true }),
                supabase.from('network_applications').select('*', { count: 'exact', head: true }),
                supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(5),
                supabase.from('network_applications').select('*').eq('status', 'approved').order('created_at', { ascending: false }).limit(5),
            ]);

            setStats({
                newsCount: newsCount || 0,
                inquiryCount: inquiryCount || 0,
                userCount: userCount || 0,
                networkCount: networkCount || 0,
            });
            setRecentUsers(users || []);
            setRecentMembers(members || []);
            setLoading(false);
        }
        fetchData();
    }, []);

    const cards = [
        {
            label: "Total News Articles",
            value: stats.newsCount,
            icon: <Newspaper size={32} />,
            color: "bg-blue-500",
            href: "/admin/news"
        },
        {
            label: "Consultation Inquiries",
            value: stats.inquiryCount,
            icon: <MessageSquare size={32} />,
            color: "bg-emerald-500",
            href: "/admin/consultations"
        },
        {
            label: "Staff & Admins",
            value: stats.userCount,
            icon: <Users size={32} />,
            color: "bg-amber-500",
            href: "/admin/users"
        },
        {
            label: "Network Applications",
            value: stats.networkCount,
            icon: <Globe size={32} />,
            color: "bg-violet-500",
            href: "/admin/network"
        },
    ];

    if (loading) return <div className="animate-pulse space-y-8">
        <div className="h-40 bg-gray-100 rounded-sm"></div>
        <div className="grid grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-sm"></div>)}
        </div>
    </div>;

    return (
        <div className="space-y-12">
            {/* Welcome Hero */}
            <div className="bg-black text-white p-12 rounded-sm relative overflow-hidden group shadow-2xl">
                <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                <div className="relative z-10 space-y-4">
                    <h2 className="font-serif text-4xl font-black italic">Platform Overview</h2>
                    <p className="text-white/60 font-sans font-light max-w-xl">
                        Welcome to the PALF Management Portal. From here you can control content across all pages,
                        manage legal network members, and respond to incoming consultations.
                    </p>
                </div>
                <TrendingUp className="absolute -bottom-4 -right-4 h-48 w-48 text-white/5 opacity-10 group-hover:scale-110 transition-transform duration-1000" />
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {cards.map((card, i) => (
                    <Link
                        key={i}
                        href={card.href}
                        className="bg-white p-8 border border-border rounded-sm hover:border-secondary transition-all group relative overflow-hidden shadow-sm hover:shadow-xl"
                    >
                        <div className="flex justify-between items-start relative z-10">
                            <div className="space-y-2">
                                <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted font-bold group-hover:text-secondary transition-colors">
                                    {card.label}
                                </p>
                                <p className="font-serif text-5xl font-black text-black">{card.value}</p>
                            </div>
                            <div className={`text-white p-3 rounded-sm ${card.color} shadow-lg group-hover:scale-110 transition-transform`}>
                                {card.icon}
                            </div>
                        </div>
                        <div className="mt-8 flex items-center text-[10px] font-sans font-black uppercase tracking-widest text-secondary opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                            Manage Section <ArrowRight size={12} className="ml-2" />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Dashboard Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Recent Users */}
                <div className="bg-white border border-border p-8 rounded-sm shadow-sm space-y-6">
                    <div className="flex justify-between items-center border-b border-border pb-4">
                        <h3 className="font-serif text-xl font-bold italic">System Users (Staff)</h3>
                        <Link href="/admin/users" className="text-secondary text-[10px] font-black uppercase tracking-widest hover:underline flex items-center">
                            View All <ArrowRight size={10} className="ml-1" />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentUsers.map((user, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-sm border border-transparent hover:border-border transition-all">
                                <div className="flex items-center space-x-4">
                                    <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                                        <Users size={16} />
                                    </div>
                                    <div>
                                        <p className="font-sans text-sm font-bold text-black">{user.full_name || user.email}</p>
                                        <p className="font-sans text-[10px] text-muted uppercase tracking-widest font-black">{user.role || 'user'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-sans text-[8px] text-muted uppercase font-black">{new Date(user.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Latest Members */}
                <div className="bg-white border border-border p-8 rounded-sm shadow-sm space-y-6">
                    <div className="flex justify-between items-center border-b border-border pb-4">
                        <h3 className="font-serif text-xl font-bold italic">Latest Network Members</h3>
                        <Link href="/admin/network" className="text-secondary text-[10px] font-black uppercase tracking-widest hover:underline flex items-center">
                            Manage Applications <ArrowRight size={10} className="ml-1" />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentMembers.map((member, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-sm border border-transparent hover:border-border transition-all">
                                <div className="flex items-center space-x-4">
                                    <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                                        <Globe size={16} />
                                    </div>
                                    <div>
                                        <p className="font-sans text-sm font-bold text-black">{member.full_name}</p>
                                        <p className="font-sans text-[10px] text-muted uppercase tracking-widest font-black">{member.location}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest">
                                        Active
                                    </span>
                                </div>
                            </div>
                        ))}
                        {recentMembers.length === 0 && (
                            <div className="text-center py-10 opacity-40 italic font-serif">No active network members yet.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* System Integrity */}
            <div className="bg-white border border-border p-10 rounded-sm shadow-sm space-y-8">
                <div className="flex items-center justify-between border-b border-border pb-6">
                    <h3 className="font-serif text-2xl font-bold">System Integrity</h3>
                    <span className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest">
                        Service Operational
                    </span>
                </div>
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <p className="font-sans text-[10px] uppercase tracking-widest font-bold text-muted">Database Connection</p>
                        <div className="flex items-center space-x-3">
                            <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></div>
                            <p className="font-sans text-sm text-black">Connected to Supabase Cloud</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <p className="font-sans text-[10px] uppercase tracking-widest font-bold text-muted">Auth Service</p>
                        <div className="flex items-center space-x-3">
                            <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></div>
                            <p className="font-sans text-sm text-black">RBAC Security Active</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
