"use client";

import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Save,
    Image as ImageIcon,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Calendar,
    User,
    Tag
} from "lucide-react";
import Link from "next/link";

export default function NewsEditor({ params }: { params: Promise<{ id?: string }> }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const isEdit = !!id;

    const router = useRouter();
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        excerpt: "",
        content: "",
        category: "Firm News",
        image_url: "",
        published_at: new Date().toISOString().split('T')[0],
        author: "Pan Afric Law Firm"
    });

    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (isEdit) {
            fetchArticle();
        }
    }, [id]);

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setMessage(null);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const filePath = `news/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('cms-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('cms-images')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image_url: publicUrl }));
            setMessage({ type: 'success', text: "Image uploaded successfully" });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || "Failed to upload image" });
        } finally {
            setUploading(false);
        }
    }

    async function fetchArticle() {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            setMessage({ type: 'error', text: "Failed to load article" });
        } else {
            setFormData({
                title: data.title,
                excerpt: data.excerpt,
                content: data.content,
                category: data.category,
                image_url: data.image_url || "",
                published_at: new Date(data.published_at).toISOString().split('T')[0],
                author: data.author
            });
        }
        setLoading(false);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        const dataToSave = {
            ...formData,
            published_at: new Date(formData.published_at).toISOString()
        };

        try {
            let error;
            if (isEdit) {
                ({ error } = await supabase.from('news').update(dataToSave).eq('id', id));
            } else {
                ({ error } = await supabase.from('news').insert([dataToSave]));
            }

            if (error) throw error;

            setMessage({ type: 'success', text: isEdit ? "Article updated successfully" : "Article created successfully" });

            if (!isEdit) {
                setTimeout(() => router.push("/admin/news"), 1500);
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || "Failed to save article" });
        } finally {
            setSaving(false);
        }
    }

    if (loading) return (
        <div className="min-h-[400px] flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-secondary" />
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link
                    href="/admin/news"
                    className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted hover:text-black transition-colors"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Back to List
                </Link>
                <button
                    onClick={handleSubmit}
                    disabled={saving || uploading}
                    className="bg-secondary text-white px-8 py-3 rounded-sm font-sans font-bold uppercase tracking-widest text-xs hover:bg-black transition-all flex items-center space-x-2 shadow-lg disabled:opacity-50"
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    <span>{isEdit ? "Update Article" : "Publish Article"}</span>
                </button>
            </div>

            {/* Notification */}
            {message && (
                <div className={`p-6 rounded-sm border-l-4 flex items-center space-x-4 animate-in fade-in slide-in-from-top-4 ${message.type === 'success' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-red-50 border-red-500 text-red-800'
                    }`}>
                    {message.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                    <div>
                        <p className="font-bold text-sm uppercase tracking-widest">{message.type.toUpperCase()}</p>
                        <p className="text-sm font-medium">{message.text}</p>
                    </div>
                </div>
            )}

            {/* Form Card */}
            <div className="bg-white border border-border p-12 rounded-sm shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Title & Author */}
                        <div className="space-y-8 md:col-span-2">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted flex items-center">
                                    Article Title <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., Ethiopian Investment Law Update 2026"
                                    className="w-full text-3xl font-serif font-black border-b border-border py-4 outline-none focus:border-secondary transition-colors"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted flex items-center">
                                        <Tag size={12} className="mr-2" /> Category
                                    </label>
                                    <select
                                        className="w-full border border-border p-4 rounded-sm outline-none focus:border-secondary transition-colors font-sans text-sm appearance-none bg-white"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option>Firm News</option>
                                        <option>Legal Alerts</option>
                                        <option>Press Releases</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted flex items-center">
                                        <User size={12} className="mr-2" /> Author
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full border border-border p-4 rounded-sm outline-none focus:border-secondary transition-colors font-sans text-sm"
                                        value={formData.author}
                                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Excerpt */}
                        <div className="space-y-3 md:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">
                                Excerpt / Summary
                            </label>
                            <textarea
                                rows={2}
                                placeholder="Short summary for the listing preview..."
                                className="w-full border border-border p-4 rounded-sm outline-none focus:border-secondary transition-colors font-sans text-sm leading-relaxed"
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            />
                        </div>

                        {/* Image Selection & Date */}
                        <div className="space-y-3 md:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted flex items-center">
                                <ImageIcon size={12} className="mr-2" /> Feature Image
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <label className="flex-1 cursor-pointer">
                                            <div className={`border-2 border-dashed border-border rounded-sm p-8 text-center hover:border-secondary transition-all ${uploading && 'opacity-50 pointer-events-none'}`}>
                                                {uploading ? (
                                                    <Loader2 size={24} className="animate-spin mx-auto text-secondary" />
                                                ) : (
                                                    <div className="space-y-2">
                                                        <ImageIcon size={24} className="mx-auto text-muted" />
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Select Local File</p>
                                                    </div>
                                                )}
                                                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                                            </div>
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">URL</span>
                                        </div>
                                        <input
                                            type="url"
                                            placeholder="Or enter image URL manualy..."
                                            className="w-full border border-border pl-12 pr-4 py-4 rounded-sm outline-none focus:border-secondary transition-colors font-sans text-sm"
                                            value={formData.image_url}
                                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Preview */}
                                <div className="border border-border rounded-sm bg-gray-50 flex items-center justify-center overflow-hidden relative group h-[160px]">
                                    {formData.image_url ? (
                                        <>
                                            <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, image_url: "" }))}
                                                    className="bg-white text-black px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center space-y-2">
                                            <ImageIcon size={32} className="mx-auto text-gray-300" />
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Preview</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted flex items-center">
                                <Calendar size={12} className="mr-2" /> Publication Date
                            </label>
                            <input
                                type="date"
                                required
                                className="w-full border border-border p-4 rounded-sm outline-none focus:border-secondary transition-colors font-sans text-sm"
                                value={formData.published_at}
                                onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                            />
                        </div>

                        {/* Content */}
                        <div className="space-y-3 md:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">
                                Article Content
                            </label>
                            <textarea
                                rows={15}
                                required
                                placeholder="Write the full article content here..."
                                className="w-full border border-border p-6 rounded-sm outline-none focus:border-secondary transition-colors font-sans text-sm leading-relaxed"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
