"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    ExternalLink,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Settings
} from "lucide-react";
import Link from "next/link";

export default function InsightsManagement() {
    const [insights, setInsights] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchInsights();
    }, []);

    async function fetchInsights() {
        setLoading(true);
        const { data, error } = await supabase
            .from('insights')
            .select('*')
            .order('published_at', { ascending: false });

        if (error) {
            setMessage({ type: 'error', text: "Failed to load insights" });
        } else {
            setInsights(data || []);
        }
        setLoading(false);
    }

    async function handleDelete() {
        if (!deleteId) return;
        setActionLoading(true);
        const { error } = await supabase.from('insights').delete().eq('id', deleteId);

        if (error) {
            setMessage({ type: 'error', text: "Failed to delete insight" });
        } else {
            setInsights(insights.filter(n => n.id !== deleteId));
            setMessage({ type: 'success', text: "Insight deleted successfully" });
            setDeleteId(null);
        }
        setActionLoading(false);
    }

    async function handleAiGenerate() {
        if (!confirm("Trigger AI to generate a fresh legal insight?")) return;
        setActionLoading(true);
        try {
            const res = await fetch('/api/admin/auto-generate', { 
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer palf_content_engine_secret_2026'
                }
            });
            if (!res.ok) throw new Error("Generation failed");
            setMessage({ type: 'success', text: "AI has generated new content!" });
            fetchInsights();
        } catch (err: any) {
            setMessage({ type: 'error', text: "AI Error: " + err.message });
        } finally {
            setActionLoading(false);
        }
    }

    const filteredInsights = insights.filter(n =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-grow max-w-md group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted h-4 w-4 group-focus-within:text-secondary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search insights by title or category..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-sm outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all font-sans text-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleAiGenerate}
                        disabled={actionLoading}
                        title="AI Auto-Generate"
                        className="bg-white text-secondary border border-secondary px-4 py-3 rounded-sm font-sans font-bold uppercase tracking-widest text-xs hover:bg-secondary hover:text-white transition-all flex items-center space-x-2 shadow-sm disabled:opacity-50"
                    >
                        <Settings size={16} className={actionLoading ? "animate-spin" : ""} />
                        <span>AI Generate</span>
                    </button>
                    <Link
                        href="/admin/insights/new"
                        className="bg-primary text-primary-foreground px-6 py-3 rounded-sm font-sans font-bold uppercase tracking-widest text-xs hover:bg-secondary transition-all flex items-center justify-center space-x-2 shadow-lg"
                    >
                        <Plus size={16} />
                        <span>New Insight</span>
                    </Link>
                </div>
            </div>

            {/* Notifications */}
            {message && (
                <div className={`p-4 rounded-sm border-l-4 flex items-center space-x-3 animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-red-50 border-red-500 text-red-800'
                    }`}>
                    {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <p className="text-sm font-medium">{message.text}</p>
                    <button onClick={() => setMessage(null)} className="ml-auto text-xs font-bold uppercase tracking-widest opacity-50 hover:opacity-100">Dismiss</button>
                </div>
            )}

            {/* Insights Table */}
            <div className="bg-white border border-border rounded-sm overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border bg-[#fcfcfc]">
                            <th className="px-6 py-4 font-sans text-[10px] uppercase tracking-[0.2em] text-muted font-bold text-center w-16">#</th>
                            <th className="px-6 py-4 font-sans text-[10px] uppercase tracking-[0.2em] text-muted font-bold">Insight</th>
                            <th className="px-6 py-4 font-sans text-[10px] uppercase tracking-[0.2em] text-muted font-bold">Category</th>
                            <th className="px-6 py-4 font-sans text-[10px] uppercase tracking-[0.2em] text-muted font-bold">Published</th>
                            <th className="px-6 py-4 font-sans text-[10px] uppercase tracking-[0.2em] text-muted font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center text-muted italic font-sans">
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                                    Loading insights database...
                                </td>
                            </tr>
                        ) : filteredInsights.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center text-muted italic font-sans">
                                    No insights found matching your criteria.
                                </td>
                            </tr>
                        ) : filteredInsights.map((item, index) => (
                            <tr key={item.id} className="border-b border-border hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-6 text-center text-xs font-bold text-muted">{index + 1}</td>
                                <td className="px-6 py-6">
                                    <div className="flex items-center space-x-4">
                                        {item.image_url && (
                                            <img src={item.image_url} alt="" className="h-12 w-16 object-cover rounded-sm grayscale group-hover:grayscale-0 transition-all opacity-80 group-hover:opacity-100 shadow-sm" />
                                        )}
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-black line-clamp-1 group-hover:text-secondary transition-colors">{item.title}</p>
                                            <p className="text-xs text-muted font-sans font-light">Author: {item.author}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-6">
                                    <span className="bg-gray-100 text-muted px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full">
                                        {item.category}
                                    </span>
                                </td>
                                <td className="px-6 py-6 text-xs text-muted font-sans font-light">
                                    {new Date(item.published_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-6 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <Link
                                            href={`/insights/${item.id}`}
                                            target="_blank"
                                            className="p-2 text-muted hover:text-black transition-colors"
                                            title="View Live"
                                        >
                                            <ExternalLink size={16} />
                                        </Link>
                                        <Link
                                            href={`/admin/insights/edit/${item.id}`}
                                            className="p-2 text-muted hover:text-secondary transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </Link>
                                        <button
                                            onClick={() => setDeleteId(item.id)}
                                            className="p-2 text-muted hover:text-red-500 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md p-8 rounded-sm shadow-2xl space-y-8 animate-in zoom-in-95">
                        <div className="space-y-4 text-center">
                            <div className="bg-red-50 text-red-500 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Trash2 size={32} />
                            </div>
                            <h3 className="font-serif text-2xl font-black italic">Delete Insight?</h3>
                            <p className="text-muted text-sm font-sans font-light">
                                This action is permanent and cannot be undone. The insight will be removed from the public website immediately.
                            </p>
                        </div>
                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={handleDelete}
                                disabled={actionLoading}
                                className="w-full bg-red-600 text-white py-3 rounded-sm font-sans font-bold uppercase tracking-widest text-xs hover:bg-red-700 transition-all flex items-center justify-center"
                            >
                                {actionLoading ? <Loader2 size={16} className="animate-spin" /> : "Confirm Deletion"}
                            </button>
                            <button
                                onClick={() => setDeleteId(null)}
                                className="w-full bg-white text-black border border-border py-3 rounded-sm font-sans font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
