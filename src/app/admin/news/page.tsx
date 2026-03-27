"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    ExternalLink,
    Filter,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Settings,
    Share2,
    Copy,
    X as CloseIcon
} from "lucide-react";
import Link from "next/link";

export default function NewsManagement() {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Social Post State
    const [showSocialModal, setShowSocialModal] = useState(false);
    const [generatingSocial, setGeneratingSocial] = useState(false);
    const [socialPosts, setSocialPosts] = useState<{ linkedin: string, twitter: string, facebook: string } | null>(null);

    useEffect(() => {
        fetchNews();
    }, []);

    async function handleGenerateSocial(id: number) {
        setGeneratingSocial(true);
        setShowSocialModal(true);
        setSocialPosts(null);
        try {
            const res = await fetch('/api/admin/generate-social-post', {
                method: 'POST',
                body: JSON.stringify({ articleId: id })
            });
            const data = await res.json();
            if (res.ok) {
                setSocialPosts(data);
            } else {
                setMessage({ type: 'error', text: "Social AI Error: " + data.error });
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: "Network Error" });
        } finally {
            setGeneratingSocial(false);
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    const openShareIntent = (platform: 'linkedin' | 'twitter' | 'facebook', text: string) => {
        const url = encodeURIComponent(window.location.origin); // Fallback to homepage or specific article link if available
        let intentUrl = "";
        
        switch(platform) {
            case 'linkedin':
                intentUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&text=${encodeURIComponent(text)}`;
                break;
            case 'twitter':
                intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
                break;
            case 'facebook':
                intentUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodeURIComponent(text)}`;
                break;
        }
        window.open(intentUrl, '_blank');
    };

    async function fetchNews() {
        setLoading(true);
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .order('published_at', { ascending: false });

        if (error) {
            setMessage({ type: 'error', text: "Failed to load news" });
        } else {
            setNews(data || []);
        }
        setLoading(false);
    }

    async function handleDelete() {
        if (!deleteId) return;
        setActionLoading(true);
        const { error } = await supabase.from('news').delete().eq('id', deleteId);

        if (error) {
            setMessage({ type: 'error', text: "Failed to delete article" });
        } else {
            setNews(news.filter(n => n.id !== deleteId));
            setMessage({ type: 'success', text: "Article deleted successfully" });
            setDeleteId(null);
        }
        setActionLoading(false);
    }

    async function handleAiGenerate() {
        if (!confirm("Trigger AI to generate a fresh news article?")) return;
        setActionLoading(true);
        try {
            const res = await fetch('/api/admin/generate-news', { 
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer palf_content_engine_secret_2026'
                }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || data.message || "Generation failed");
            setMessage({ type: 'success', text: "AI has generated new content!" });
            fetchNews();
        } catch (err: any) {
            setMessage({ type: 'error', text: "AI Error: " + err.message });
        } finally {
            setActionLoading(false);
        }
    }

    const filteredNews = news.filter(n =>
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
                        placeholder="Search articles by title or category..."
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
                        href="/admin/news/new"
                        className="bg-primary text-primary-foreground px-6 py-3 rounded-sm font-sans font-bold uppercase tracking-widest text-xs hover:bg-secondary transition-all flex items-center justify-center space-x-2 shadow-lg"
                    >
                        <Plus size={16} />
                        <span>New Article</span>
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

            {/* News Table */}
            <div className="bg-white border border-border rounded-sm overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border bg-[#fcfcfc]">
                            <th className="px-6 py-4 font-sans text-[10px] uppercase tracking-[0.2em] text-muted font-bold text-center w-16">#</th>
                            <th className="px-6 py-4 font-sans text-[10px] uppercase tracking-[0.2em] text-muted font-bold">Article</th>
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
                                    Loading news database...
                                </td>
                            </tr>
                        ) : filteredNews.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center text-muted italic font-sans">
                                    No articles found matching your criteria.
                                </td>
                            </tr>
                        ) : filteredNews.map((item, index) => (
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
                                            href={`/news/${item.id}`}
                                            target="_blank"
                                            className="p-2 text-muted hover:text-black transition-colors"
                                            title="View Live"
                                        >
                                            <ExternalLink size={16} />
                                        </Link>
                                        <button
                                            onClick={() => handleGenerateSocial(item.id)}
                                            className="p-2 text-muted hover:text-primary transition-colors"
                                            title="AI Social Post"
                                        >
                                            <Share2 size={16} />
                                        </button>
                                        <Link
                                            href={`/admin/news/edit/${item.id}`}
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
                            <h3 className="font-serif text-2xl font-black italic">Delete Article?</h3>
                            <p className="text-muted text-sm font-sans font-light">
                                This action is permanent and cannot be undone. The article will be removed from the public website immediately.
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

            {/* AI Social Modal */}
            {showSocialModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto p-12 rounded-sm shadow-2xl relative animate-in zoom-in-95">
                        <button
                            onClick={() => setShowSocialModal(false)}
                            className="absolute top-8 right-8 text-muted hover:text-black transition-colors"
                        >
                            <CloseIcon size={24} />
                        </button>

                        <div className="space-y-12">
                            <div className="space-y-4">
                                <h3 className="font-serif text-4xl font-black italic">Social Media Drafts</h3>
                                <p className="text-muted font-sans font-light">AI generated posts for your Pan Afric network.</p>
                            </div>

                            {generatingSocial ? (
                                <div className="py-20 text-center space-y-4">
                                    <Loader2 className="h-12 w-12 animate-spin mx-auto text-secondary" />
                                    <p className="font-serif italic text-2xl">Writing your viral story...</p>
                                </div>
                            ) : socialPosts && (
                                <div className="grid gap-10">
                                    <div className="space-y-6 bg-slate-50 p-10 border border-slate-100 rounded-sm group relative text-black">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-sans text-xs font-black uppercase tracking-[0.3em] text-secondary">LinkedIn Professional</h4>
                                            <div className="flex items-center space-x-4">
                                                <button
                                                    onClick={() => openShareIntent('linkedin', socialPosts.linkedin)}
                                                    className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-secondary transition-all"
                                                >
                                                    <ExternalLink size={14} /> <span>Open Post</span>
                                                </button>
                                                <button
                                                    onClick={() => copyToClipboard(socialPosts.linkedin)}
                                                    className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest hover:text-secondary transition-all"
                                                >
                                                    <Copy size={14} /> <span>Copy</span>
                                                </button>
                                            </div>
                                        </div>
                                        <p className="font-sans text-base leading-relaxed whitespace-pre-wrap">{socialPosts.linkedin}</p>
                                    </div>

                                    <div className="space-y-6 bg-slate-50 p-10 border border-slate-100 rounded-sm group relative text-black">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-sans text-xs font-black uppercase tracking-[0.3em] text-secondary">Twitter / X</h4>
                                            <div className="flex items-center space-x-4">
                                                <button
                                                    onClick={() => openShareIntent('twitter', socialPosts.twitter)}
                                                    className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-secondary transition-all"
                                                >
                                                    <ExternalLink size={14} /> <span>Open & Post</span>
                                                </button>
                                                <button
                                                    onClick={() => copyToClipboard(socialPosts.twitter)}
                                                    className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest hover:text-secondary transition-all"
                                                >
                                                    <Copy size={14} /> <span>Copy</span>
                                                </button>
                                            </div>
                                        </div>
                                        <p className="font-sans text-base leading-relaxed whitespace-pre-wrap">{socialPosts.twitter}</p>
                                    </div>

                                    <div className="space-y-6 bg-slate-50 p-10 border border-slate-100 rounded-sm group relative text-black">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-sans text-xs font-black uppercase tracking-[0.3em] text-secondary">Facebook / Instagram</h4>
                                            <div className="flex items-center space-x-4">
                                                <button
                                                    onClick={() => openShareIntent('facebook', socialPosts.facebook)}
                                                    className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-secondary transition-all"
                                                >
                                                    <ExternalLink size={14} /> <span>Open Post</span>
                                                </button>
                                                <button
                                                    onClick={() => copyToClipboard(socialPosts.facebook)}
                                                    className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest hover:text-secondary transition-all"
                                                >
                                                    <Copy size={14} /> <span>Copy</span>
                                                </button>
                                            </div>
                                        </div>
                                        <p className="font-sans text-base leading-relaxed whitespace-pre-wrap">{socialPosts.facebook}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
