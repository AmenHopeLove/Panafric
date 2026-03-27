"use client";

import { useState } from "react";
import { Lock, FileText, Download, PlayCircle, Eye, ShieldCheck, Video } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase-client";

// MOCK DATA for the Vault (In a real app, you'd fetch from a secure Supabase bucket URL)
const VAULT_RESOURCES = [
    {
        id: 1,
        title: "Cross-Border Trade Agreement Template 2024",
        type: "pdf",
        category: "Contracts",
        size: "2.4 MB",
        date: "Last week",
        icon: <FileText size={20} />
    },
    {
        id: 2,
        title: "Q1 Pan-African IP Strategy Roundtable",
        type: "video",
        category: "Webinars",
        size: "450 MB",
        date: "Mar 10, 2026",
        icon: <Video size={20} />
    },
    {
        id: 3,
        title: "Standard NDA (English/French)",
        type: "docx",
        category: "Templates",
        size: "0.8 MB",
        date: "Jan 14, 2026",
        icon: <FileText size={20} />
    },
    {
        id: 4,
        title: "Regulatory Arbitrage in AfCFTA Masterclass",
        type: "video",
        category: "Masterclasses",
        size: "1.2 GB",
        date: "Nov 05, 2025",
        icon: <Video size={20} />
    }
];

export default function MemberVault() {
    const [downloading, setDownloading] = useState<number | null>(null);

    const handleDownload = async (id: number, type: string) => {
        setDownloading(id);
        
        // Mock download latency
        await new Promise(r => setTimeout(r, 1500));
        
        // Real implementation: Fetch restricted Signed URL from Supabase Storage
        /*
        const { data, error } = await supabase.storage
            .from('member-vault')
            .createSignedUrl(`path/to/resource_${id}.${type}`, 60);

        if (data?.signedUrl) {
            window.open(data.signedUrl, '_blank');
        }
        */
        
        alert("Downloading encrypted file...");
        setDownloading(null);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-8">
                <div className="space-y-4">
                    <div className="inline-flex items-center space-x-2 text-primary bg-primary/10 px-3 py-1 rounded-sm">
                        <Lock size={14} />
                        <span className="font-sans text-[10px] font-black uppercase tracking-[0.2em]">Encrypted Vault</span>
                    </div>
                    <h1 className="font-serif text-5xl font-black italic">The Vault</h1>
                    <p className="font-sans text-muted text-lg tracking-wide font-light max-w-2xl">
                        Access proprietary legal frameworks, contract templates, and recordings of private executive briefings.
                    </p>
                </div>
            </div>

            <div className="bg-black text-white p-8 lg:p-12 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 group">
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-3xl"></div>
                <div className="relative z-10 space-y-4">
                    <div className="flex items-center space-x-3 text-secondary">
                        <ShieldCheck size={24} />
                        <h2 className="font-serif text-2xl font-bold italic">Confidentiality Notice</h2>
                    </div>
                    <p className="text-white/70 font-sans max-w-2xl leading-relaxed text-sm">
                        All materials in the Vault are watermarked and strictly confidential. Distribution outside of your firm without written consent from the PALF Executive Committee violates the non-disclosure agreement.
                    </p>
                </div>
                <div className="relative z-10 shrink-0">
                    <Link href="/member" className="font-sans text-xs font-black uppercase tracking-widest border-b border-white/30 hover:border-secondary hover:text-secondary pb-1 transition-all">
                        Review NDA
                    </Link>
                </div>
            </div>

            <div className="space-y-6">
                {VAULT_RESOURCES.map((resource) => (
                    <div key={resource.id} className="bg-white border border-border p-6 hover:shadow-xl transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-6 rounded-xl group relative overflow-hidden">
                        <div className="flex items-center space-x-6">
                            <div className={`p-4 rounded-xl mt-1 ${resource.type === 'video' ? 'bg-black text-white' : 'bg-primary/5 text-primary group-hover:bg-secondary/10 group-hover:text-secondary'} transition-colors`}>
                                {resource.icon}
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-serif text-xl font-bold italic group-hover:text-primary transition-colors">{resource.title}</h3>
                                <div className="flex flex-wrap items-center text-xs text-muted font-sans font-bold uppercase tracking-widest gap-4">
                                    <span className="bg-gray-100 px-2 py-0.5 rounded-sm">{resource.category}</span>
                                    <span>{resource.size}</span>
                                    <span>{resource.date}</span>
                                </div>
                            </div>
                        </div>

                        <div className="shrink-0 flex items-center space-x-4">
                            {resource.type === 'video' ? (
                                <button 
                                    onClick={() => handleDownload(resource.id, resource.type)}
                                    className="text-black hover:text-secondary p-3 bg-gray-50 border border-border rounded-lg transition-all shadow-sm"
                                    title="Watch Masterclass"
                                >
                                    <PlayCircle size={20} />
                                </button>
                            ) : (
                                <button 
                                    onClick={() => handleDownload(resource.id, resource.type)}
                                    className="text-black hover:text-primary p-3 bg-gray-50 border border-border rounded-lg transition-all shadow-sm"
                                    title="Preview Document"
                                >
                                    <Eye size={20} />
                                </button>
                            )}

                            <button 
                                onClick={() => handleDownload(resource.id, resource.type)}
                                disabled={downloading === resource.id}
                                className="bg-black text-white px-6 py-3 font-sans text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-colors shadow-lg flex items-center justify-center min-w-[140px] rounded-lg disabled:opacity-50"
                            >
                                {downloading === resource.id ? (
                                    <span className="animate-pulse">Decrypting...</span>
                                ) : (
                                    <>
                                        <Download size={14} className="mr-2" /> Download
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
