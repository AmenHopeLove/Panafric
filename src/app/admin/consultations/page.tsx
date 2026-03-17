"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import {
    MessageSquare,
    Search,
    Mail,
    User,
    Calendar,
    Clock,
    ExternalLink,
    ChevronRight,
    Loader2,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

export default function ConsultationManagement() {
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchInquiries();
    }, []);

    async function fetchInquiries() {
        setLoading(true);
        const { data, error } = await supabase
            .from('consultations')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error loading inquiries:", error);
        } else {
            setInquiries(data || []);
        }
        setLoading(false);
    }

    async function updateStatus(id: number, newStatus: string) {
        setActionLoading(true);
        const { error } = await supabase
            .from('consultations')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) {
            setInquiries(inquiries.map(i => i.id === id ? { ...i, status: newStatus } : i));
            if (selectedInquiry?.id === id) {
                setSelectedInquiry({ ...selectedInquiry, status: newStatus });
            }
        }
        setActionLoading(false);
    }

    return (
        <div className="flex h-[calc(100vh-12rem)] bg-white border border-border rounded-sm overflow-hidden shadow-sm">
            {/* Inquiry List */}
            <div className="w-1/3 border-r border-border flex flex-col bg-[#fcfcfc]">
                <div className="p-6 border-b border-border bg-white">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted h-3.5 w-3.5" />
                        <input
                            type="text"
                            placeholder="Search inquiries..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-border rounded-sm outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all font-sans text-xs"
                        />
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto">
                    {loading ? (
                        <div className="p-10 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted" /></div>
                    ) : inquiries.length === 0 ? (
                        <div className="p-10 text-center text-muted italic text-xs font-sans">No inquiries found.</div>
                    ) : inquiries.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setSelectedInquiry(item)}
                            className={`w-full text-left p-6 border-b border-border transition-all hover:bg-white group ${selectedInquiry?.id === item.id ? "bg-white border-l-4 border-l-secondary shadow-sm" : ""}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <p className="font-bold text-sm text-black group-hover:text-secondary transition-colors">{item.full_name}</p>
                                <span className={`text-[8px] uppercase tracking-widest font-black px-2 py-0.5 rounded-full ${item.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                        item.status === 'reviewed' ? 'bg-blue-100 text-blue-700' :
                                            'bg-emerald-100 text-emerald-700'
                                    }`}>
                                    {item.status}
                                </span>
                            </div>
                            <p className="text-xs text-muted font-sans font-medium line-clamp-1 mb-3">{item.subject || "No Subject"}</p>
                            <div className="flex items-center text-[10px] text-muted space-x-4">
                                <span className="flex items-center"><Clock size={10} className="mr-1" /> {new Date(item.created_at).toLocaleDateString()}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Detail View */}
            <div className="flex-grow flex flex-col bg-white">
                {selectedInquiry ? (
                    <>
                        <div className="p-10 border-b border-border space-y-8">
                            <div className="flex justify-between items-start">
                                <div className="space-y-4">
                                    <h2 className="font-serif text-3xl font-black italic">{selectedInquiry.subject || "Legal Inquiry"}</h2>
                                    <div className="flex flex-wrap gap-6">
                                        <div className="flex items-center text-xs font-sans font-bold uppercase tracking-widest text-muted">
                                            <User size={14} className="mr-2 text-secondary" /> {selectedInquiry.full_name}
                                        </div>
                                        <div className="flex items-center text-xs font-sans font-bold uppercase tracking-widest text-muted">
                                            <Mail size={14} className="mr-2 text-secondary" /> {selectedInquiry.email}
                                        </div>
                                        <div className="flex items-center text-xs font-sans font-bold uppercase tracking-widest text-muted">
                                            <Calendar size={14} className="mr-2 text-secondary" /> {new Date(selectedInquiry.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => updateStatus(selectedInquiry.id, 'reviewed')}
                                        disabled={actionLoading}
                                        className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-sm font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-blue-100 transition-all flex items-center"
                                    >
                                        Mark Reviewed
                                    </button>
                                    <button
                                        onClick={() => updateStatus(selectedInquiry.id, 'contacted')}
                                        disabled={actionLoading}
                                        className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-sm font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-100 transition-all flex items-center"
                                    >
                                        <CheckCircle2 size={12} className="mr-2" /> Mark Completed
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="p-10 flex-grow overflow-y-auto bg-gray-50/50">
                            <div className="max-w-3xl bg-white p-12 border border-border shadow-sm rounded-sm space-y-8">
                                <div className="pb-6 border-b border-border">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-4 italic">Inquiry Message</p>
                                    <p className="text-black font-sans leading-relaxed whitespace-pre-wrap">
                                        {selectedInquiry.message}
                                    </p>
                                </div>
                                <div className="pt-6">
                                    <a
                                        href={`mailto:${selectedInquiry.email}?subject=RE: ${selectedInquiry.subject}`}
                                        className="bg-black text-white px-10 py-4 rounded-sm font-sans font-bold uppercase tracking-widest text-xs hover:bg-secondary hover:text-white transition-all inline-flex items-center space-x-3 shadow-xl"
                                    >
                                        <Mail size={14} />
                                        <span>Reply via Email</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center space-y-6 opacity-30">
                        <MessageSquare size={80} className="text-muted" />
                        <p className="font-serif text-2xl italic">Select an inquiry to review details</p>
                    </div>
                )}
            </div>
        </div>
    );
}
