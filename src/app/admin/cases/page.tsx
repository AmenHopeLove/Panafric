'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { 
    Briefcase, Search, User, Mail, Calendar, Clock, Download, 
    CheckCircle2, AlertCircle, FileText, ChevronRight, Loader2,
    ShieldCheck, Building, Phone, MoreVertical, ExternalLink
} from 'lucide-react';

export default function AdminCaseManagement() {
    const [cases, setCases] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCase, setSelectedCase] = useState<any | null>(null);
    const [caseFiles, setCaseFiles] = useState<any[]>([]);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchCases();
    }, []);

    useEffect(() => {
        if (selectedCase) {
            fetchCaseFiles(selectedCase.id);
        }
    }, [selectedCase]);

    async function fetchCases() {
        setLoading(true);
        const { data, error } = await supabase
            .from('cases')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error loading cases:", error);
        } else {
            setCases(data || []);
        }
        setLoading(false);
    }

    async function fetchCaseFiles(caseId: string) {
        const { data, error } = await supabase
            .from('case_files')
            .select('*')
            .eq('case_id', caseId);

        if (error) {
            console.error("Error loading case files:", error);
        } else {
            setCaseFiles(data || []);
        }
    }

    async function updateStatus(id: string, newStatus: string) {
        setActionLoading(true);
        const { error } = await supabase
            .from('cases')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) {
            setCases(cases.map(c => c.id === id ? { ...c, status: newStatus } : c));
            if (selectedCase?.id === id) {
                setSelectedCase({ ...selectedCase, status: newStatus });
            }
        }
        setActionLoading(false);
    }

    return (
        <div className="flex h-[calc(100vh-12rem)] bg-white border border-border rounded-sm overflow-hidden shadow-sm">
            {/* Sidebar List */}
            <div className="w-1/3 border-r border-border flex flex-col bg-[#fcfcfc]">
                <div className="p-6 border-b border-border bg-white space-y-4">
                    <h2 className="font-serif text-xl font-black italic">Matter Ledger</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted h-3.5 w-3.5" />
                        <input
                            type="text"
                            placeholder="Filter by client or subject..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-border rounded-sm outline-none focus:ring-1 focus:ring-secondary transition-all font-sans text-xs"
                        />
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto">
                    {loading ? (
                        <div className="p-10 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted" /></div>
                    ) : cases.length === 0 ? (
                        <div className="p-10 text-center text-muted italic text-xs font-sans">No legal cases submitted.</div>
                    ) : cases.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setSelectedCase(item)}
                            className={`w-full text-left p-6 border-b border-border transition-all hover:bg-white group ${selectedCase?.id === item.id ? "bg-white border-l-4 border-l-secondary shadow-md" : ""}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <p className="font-bold text-sm text-black group-hover:text-secondary transition-colors truncate pr-2 max-w-[180px]">
                                    {item.full_name}
                                </p>
                                <span className={`text-[8px] uppercase tracking-widest font-black px-2 py-0.5 rounded-full ${
                                    item.urgency === 'Urgent' ? 'bg-red-100 text-red-700' : 
                                    item.urgency === 'High' ? 'bg-orange-100 text-orange-700' : 
                                    'bg-slate-100 text-slate-600'
                                }`}>
                                    {item.urgency}
                                </span>
                            </div>
                            <p className="text-[10px] text-muted font-sans font-bold uppercase tracking-widest line-clamp-1 mb-1 italic">{item.case_type}</p>
                            <p className="text-xs text-black/70 font-sans line-clamp-1 mb-3">{item.subject}</p>
                            <div className="flex items-center justify-between text-[10px] text-muted">
                                <span className="flex items-center"><Clock size={10} className="mr-1" /> {new Date(item.created_at).toLocaleDateString()}</span>
                                <span className="capitalize font-bold text-secondary">{item.status}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content View */}
            <div className="flex-grow flex flex-col bg-white">
                {selectedCase ? (
                    <>
                        {/* Detail Header */}
                        <div className="p-10 border-b border-border bg-white flex justify-between items-start">
                            <div className="space-y-4 max-w-2xl">
                                <div className="flex items-center gap-3">
                                    <span className="bg-black text-white text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-full">Official Legal Matter</span>
                                    <span className={`text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-full border ${
                                        selectedCase.status === 'new' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                                        selectedCase.status === 'reviewing' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                                        'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    }`}>
                                        Status: {selectedCase.status}
                                    </span>
                                </div>
                                <h2 className="font-serif text-4xl font-black italic tracking-tight">{selectedCase.subject}</h2>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
                                    <div className="space-y-1">
                                        <p className="text-[9px] uppercase tracking-widest text-muted font-bold italic">Client Name</p>
                                        <div className="flex items-center text-xs font-sans font-bold text-black">
                                            <User size={12} className="mr-2 text-secondary" /> {selectedCase.full_name}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] uppercase tracking-widest text-muted font-bold italic">Email Protocol</p>
                                        <div className="flex items-center text-xs font-sans font-bold text-black truncate">
                                            <Mail size={12} className="mr-2 text-secondary" /> {selectedCase.email}
                                        </div>
                                    </div>
                                    {selectedCase.phone && (
                                        <div className="space-y-1">
                                            <p className="text-[9px] uppercase tracking-widest text-muted font-bold italic">Contact Number</p>
                                            <div className="flex items-center text-xs font-sans font-bold text-black">
                                                <Phone size={12} className="mr-2 text-secondary" /> {selectedCase.phone}
                                            </div>
                                        </div>
                                    )}
                                    {selectedCase.company && (
                                        <div className="space-y-1">
                                            <p className="text-[9px] uppercase tracking-widest text-muted font-bold italic">Organization</p>
                                            <div className="flex items-center text-xs font-sans font-bold text-black">
                                                <Building size={12} className="mr-2 text-secondary" /> {selectedCase.company}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                {selectedCase.status === 'new' && (
                                    <button 
                                        onClick={() => updateStatus(selectedCase.id, 'reviewing')}
                                        className="bg-black text-white px-6 py-2.5 rounded-sm font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-secondary transition-all"
                                    >
                                        Initiate Review
                                    </button>
                                )}
                                {['new', 'reviewing'].includes(selectedCase.status) && (
                                    <button 
                                        onClick={() => updateStatus(selectedCase.id, 'accepted')}
                                        className="bg-emerald-600 text-white px-6 py-2.5 rounded-sm font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center"
                                    >
                                        <ShieldCheck size={14} className="mr-2" /> Accept Case
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Narrative & Files */}
                        <div className="flex-grow overflow-y-auto bg-gray-50/50 p-10">
                            <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-10">
                                {/* Left: Matter Statement */}
                                <div className="lg:col-span-2 space-y-10">
                                    <div className="bg-white p-12 border border-border shadow-sm rounded-sm">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-6 italic border-b border-gray-100 pb-4">Matter Narrative</p>
                                        <div className="text-black font-sans leading-relaxed whitespace-pre-wrap text-sm">
                                            {selectedCase.description}
                                        </div>
                                    </div>

                                    {/* Conflict Data */}
                                    <div className="bg-white p-12 border border-border shadow-sm rounded-sm">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-6 italic border-b border-gray-100 pb-4">Conflict Intelligence</p>
                                        <div className="flex items-start gap-6">
                                            <div className="h-14 w-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                <AlertCircle size={28} />
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-[9px] uppercase tracking-widest text-muted font-bold italic mb-1">Identified Opposing Party</p>
                                                    <p className="text-lg font-serif font-black italic">{selectedCase.opposing_party || "No Opposing Party Listed"}</p>
                                                </div>
                                                <p className="text-xs text-muted font-sans leading-relaxed">
                                                    Conflict check against active ledger required before accepting matter. 
                                                    Proceed with caution if organization has previous dealings with the party above.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Documentation Vault */}
                                <div className="space-y-10">
                                    <div className="bg-white p-8 border border-border shadow-sm rounded-sm">
                                        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted italic">Evidence Vault</p>
                                            <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-bold">{caseFiles.length}</span>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            {caseFiles.length === 0 ? (
                                                <div className="py-12 text-center space-y-3 opacity-30">
                                                    <FileText size={32} className="mx-auto" />
                                                    <p className="text-[10px] uppercase font-bold tracking-widest">No Attachments</p>
                                                </div>
                                            ) : caseFiles.map((file, idx) => (
                                                <button 
                                                    key={idx}
                                                    onClick={async () => {
                                                        const { data, error } = await supabase.storage
                                                            .from('case_attachments')
                                                            .createSignedUrl(file.file_path || file.file_url.split('/public/')[1], 60);
                                                        
                                                        if (data?.signedUrl) {
                                                            window.open(data.signedUrl, '_blank');
                                                        } else {
                                                            alert("Error generating download link. Please ensure the 'storage' permissions are set correctly.");
                                                        }
                                                    }}
                                                    className="w-full flex items-center justify-between p-4 bg-gray-50 border border-border hover:border-secondary transition-all group text-left"
                                                >
                                                    <div className="flex items-center space-x-3 overflow-hidden">
                                                        <FileText size={16} className="text-secondary" />
                                                        <div className="overflow-hidden">
                                                            <p className="text-xs font-bold text-black truncate group-hover:text-secondary transition-colors">{file.file_name}</p>
                                                            <p className="text-[8px] text-muted uppercase tracking-widest">{(file.file_size / 1024 / 1024).toFixed(2)} MB</p>
                                                        </div>
                                                    </div>
                                                    <Download size={14} className="text-muted group-hover:text-black" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action History */}
                                    <div className="bg-black text-white p-8 border border-white/10 shadow-xl rounded-sm space-y-6">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary italic">Matter Footprint</p>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-4">
                                                <div className="h-6 w-6 border-l-2 border-secondary ml-3 relative">
                                                    <div className="absolute -top-1 -left-[9px] h-4 w-4 rounded-full bg-secondary" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold italic">Client Submitted Intake</p>
                                                    <p className="text-[8px] uppercase tracking-widest text-white/40">{new Date(selectedCase.created_at).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <div className="h-4 w-6 border-l-2 border-white/20 ml-3 relative">
                                                    <div className="absolute -top-1 -left-[9px] h-4 w-4 rounded-full bg-white/20" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold italic">Awaiting Partner Review</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center space-y-6 opacity-20">
                        <Briefcase size={100} className="text-muted" />
                        <div className="text-center">
                            <p className="font-serif text-3xl font-black italic text-black">Legal Matter Repository</p>
                            <p className="font-sans text-[10px] uppercase tracking-[0.4em] font-black text-secondary mt-2">Authenticated Access Required</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
