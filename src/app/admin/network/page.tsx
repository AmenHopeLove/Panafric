"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import {
    Users,
    Search,
    Mail,
    User,
    Calendar,
    Clock,
    Briefcase,
    MapPin,
    Globe,
    ChevronRight,
    Loader2,
    CheckCircle2,
    XCircle,
    AlertCircle
} from "lucide-react";

export default function NetworkManagement() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState<any | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchApplications();
    }, []);

    async function fetchApplications() {
        setLoading(true);
        const { data, error } = await supabase
            .from('network_applications')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error loading applications:", error);
        } else {
            setApplications(data || []);
        }
        setLoading(false);
    }

    async function updateStatus(id: number, newStatus: string) {
        setActionLoading(true);
        const { error } = await supabase
            .from('network_applications')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status: " + error.message);
        } else {
            setApplications(applications.map(a => a.id === id ? { ...a, status: newStatus } : a));
            if (selectedApp?.id === id) {
                setSelectedApp({ ...selectedApp, status: newStatus });
            }
        }
        setActionLoading(false);
    }

    return (
        <div className="flex h-[calc(100vh-12rem)] bg-white border border-border rounded-sm overflow-hidden shadow-sm">
            {/* Application List */}
            <div className="w-1/3 border-r border-border flex flex-col bg-[#fcfcfc]">
                <div className="p-6 border-b border-border bg-white">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted h-3.5 w-3.5" />
                        <input
                            type="text"
                            placeholder="Search applications..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-border rounded-sm outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all font-sans text-xs"
                        />
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto">
                    {loading ? (
                        <div className="p-10 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted" /></div>
                    ) : applications.length === 0 ? (
                        <div className="p-10 text-center text-muted italic text-xs font-sans">No applications found.</div>
                    ) : applications.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setSelectedApp(item)}
                            className={`w-full text-left p-6 border-b border-border transition-all hover:bg-white group ${selectedApp?.id === item.id ? "bg-white border-l-4 border-l-secondary shadow-sm" : ""}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center space-x-3">
                                    {item.profile_image_url ? (
                                        <img src={item.profile_image_url} className="h-8 w-8 rounded-full object-cover" alt="" />
                                    ) : (
                                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                            <User size={12} className="text-muted" />
                                        </div>
                                    )}
                                    <p className="font-bold text-sm text-black group-hover:text-secondary transition-colors">{item.full_name}</p>
                                </div>
                                <span className={`text-[8px] uppercase tracking-widest font-black px-2 py-0.5 rounded-full ${item.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                    item.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                    {item.status}
                                </span>
                            </div>
                            <p className="text-xs text-muted font-sans font-medium line-clamp-1 mb-3">{item.firm_name || "Independent Professional"}</p>
                            <div className="flex items-center text-[10px] text-muted space-x-4">
                                <span className="flex items-center"><MapPin size={10} className="mr-1" /> {item.location}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Detail View */}
            <div className="flex-grow flex flex-col bg-white">
                {selectedApp ? (
                    <>
                        <div className="p-10 border-b border-border space-y-8">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center space-x-6">
                                    {selectedApp.profile_image_url ? (
                                        <img src={selectedApp.profile_image_url} className="h-20 w-20 rounded-full object-cover border-2 border-secondary/20 shadow-md" alt="" />
                                    ) : (
                                        <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-border text-muted">
                                            <User size={32} />
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <h2 className="font-serif text-3xl font-black italic">{selectedApp.full_name}</h2>
                                        <div className="flex flex-wrap gap-6">
                                            <div className="flex items-center text-xs font-sans font-bold uppercase tracking-widest text-muted">
                                                <Mail size={14} className="mr-2 text-secondary" /> {selectedApp.email}
                                            </div>
                                            <div className="flex items-center text-xs font-sans font-bold uppercase tracking-widest text-muted">
                                                <Briefcase size={14} className="mr-2 text-secondary" /> {selectedApp.firm_name || "N/A"}
                                            </div>
                                            <div className="flex items-center text-xs font-sans font-bold uppercase tracking-widest text-muted">
                                                <Calendar size={14} className="mr-2 text-secondary" /> {new Date(selectedApp.created_at).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => updateStatus(selectedApp.id, 'rejected')}
                                        disabled={actionLoading}
                                        className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-sm font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-red-100 transition-all flex items-center"
                                    >
                                        <XCircle size={12} className="mr-2" /> Reject
                                    </button>
                                    <button
                                        onClick={() => updateStatus(selectedApp.id, 'approved')}
                                        disabled={actionLoading}
                                        className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-sm font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-100 transition-all flex items-center shadow-md"
                                    >
                                        <CheckCircle2 size={12} className="mr-2" /> Approve
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="p-10 flex-grow overflow-y-auto bg-gray-50/50">
                            <div className="grid lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="bg-white p-12 border border-border shadow-sm rounded-sm space-y-8">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-4 italic">Professional Statement</p>
                                            <p className="text-black font-sans leading-relaxed whitespace-pre-wrap">
                                                {selectedApp.message || "No statement provided."}
                                            </p>
                                        </div>
                                        <div className="pt-8 border-t border-border">
                                            <a
                                                href={`mailto:${selectedApp.email}?subject=Pan Afric Law Network Application Update`}
                                                className="bg-black text-white px-10 py-4 rounded-sm font-sans font-bold uppercase tracking-widest text-xs hover:bg-secondary hover:text-white transition-all inline-flex items-center space-x-3 shadow-xl"
                                            >
                                                <Mail size={14} />
                                                <span>Send Official Update</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="bg-white p-8 border border-border shadow-sm rounded-sm space-y-6">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted italic">Professional Profile</p>

                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Experience</p>
                                                <p className="text-sm font-serif font-bold italic">{selectedApp.experience_years} Years</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Location</p>
                                                <p className="text-sm font-sans flex items-center"><MapPin size={12} className="mr-2 text-secondary" /> {selectedApp.location}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Practice Areas</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedApp.practice_areas?.map((area: string) => (
                                                        <span key={area} className="bg-secondary/10 text-secondary px-2 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-widest">
                                                            {area}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center space-y-6 opacity-30">
                        <Users size={80} className="text-muted" />
                        <p className="font-serif text-2xl italic">Select an application to review details</p>
                    </div>
                )}
            </div>
        </div>
    );
}
