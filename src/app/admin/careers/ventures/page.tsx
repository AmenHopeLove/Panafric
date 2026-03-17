"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import {
    Scale,
    Plus,
    Trash2,
    Settings,
    Loader2,
    CheckCircle2,
    XCircle,
    Edit3,
    Clock,
    Users,
    MapPin
} from "lucide-react";

export default function VentureManagement() {
    const [ventures, setVentures] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        location: "",
        category: "Strategic",
        is_active: true
    });

    useEffect(() => {
        fetchVentures();
    }, []);

    async function fetchVentures() {
        setLoading(true);
        setFetchError(null);
        const { data, error } = await supabase
            .from('networking_ventures')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error loading ventures:", error.message || error);
            setFetchError(error.message);
        }
        else setVentures(data || []);
        setLoading(false);
    }

    const resetForm = () => {
        setFormData({
            title: "",
            location: "",
            category: "Strategic",
            is_active: true
        });
    };

    const handleEdit = (item: any) => {
        setSelectedItem(item);
        setFormData({
            title: item.title,
            location: item.location || "",
            category: item.category || "Strategic",
            is_active: item.is_active
        });
        setIsEditing(true);
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setActionLoading(true);

        const payload = {
            ...formData,
            updated_at: new Date().toISOString()
        };

        let result;
        if (isEditing && selectedItem) {
            result = await supabase
                .from('networking_ventures')
                .update(payload)
                .eq('id', selectedItem.id);
        } else {
            result = await supabase
                .from('networking_ventures')
                .insert([payload]);
        }

        if (result.error) {
            alert("Error saving venture: " + result.error.message);
        } else {
            fetchVentures();
            resetForm();
            setIsEditing(false);
            setSelectedItem(null);
        }
        setActionLoading(false);
    }

    async function toggleStatus(item: any) {
        setActionLoading(true);
        const { error } = await supabase
            .from('networking_ventures')
            .update({ is_active: !item.is_active })
            .eq('id', item.id);

        if (error) alert("Error updating status: " + error.message);
        else fetchVentures();
        setActionLoading(false);
    }

    async function deleteVenture(id: string) {
        if (!confirm("Are you sure you want to delete this venture?")) return;

        setActionLoading(true);
        const { error } = await supabase
            .from('networking_ventures')
            .delete()
            .eq('id', id);

        if (error) alert("Error deleting: " + error.message);
        else {
            fetchVentures();
            if (selectedItem?.id === id) setSelectedItem(null);
        }
        setActionLoading(false);
    }

    async function handleAiGenerate() {
        if (!confirm("Trigger AI to generate a fresh venture?")) return;
        setActionLoading(true);
        try {
            const res = await fetch('/api/admin/auto-generate', { 
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer palf_content_engine_secret_2026'
                }
            });
            if (!res.ok) throw new Error("Generation failed");
            alert("AI has generated new content across the platform!");
            fetchVentures();
        } catch (err: any) {
            alert("AI Error: " + err.message);
        } finally {
            setActionLoading(false);
        }
    }

    return (
        <div className="flex h-[calc(100vh-12rem)] bg-white border border-border rounded-sm overflow-hidden shadow-sm font-sans">
            {/* List Side */}
            <div className="w-1/3 border-r border-border flex flex-col bg-[#fcfcfc]">
                <div className="p-6 border-b border-border bg-white flex justify-between items-center">
                    <h2 className="font-serif text-xl font-black italic text-brand">Lounge Ventures</h2>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleAiGenerate}
                            disabled={actionLoading}
                            title="AI Auto-Generate"
                            className="p-2 border border-secondary text-secondary rounded-sm hover:bg-secondary hover:text-white transition-all disabled:opacity-50"
                        >
                            <Settings size={16} className={actionLoading ? "animate-spin" : ""} />
                        </button>
                        <button
                            onClick={() => { setIsEditing(true); setSelectedItem(null); resetForm(); }}
                            className="p-2 bg-secondary text-white rounded-sm hover:bg-black transition-all"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto">
                    {loading ? (
                        <div className="p-10 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted" /></div>
                    ) : fetchError ? (
                        <div className="p-10 text-center space-y-4">
                            <XCircle className="h-8 w-8 text-red-500 mx-auto" />
                            <p className="text-xs text-red-500 font-bold uppercase tracking-widest leading-relaxed">
                                Database Table Missing
                            </p>
                            <p className="text-[10px] text-muted italic">
                                Please run the SQL setup in <code className="bg-gray-100 p-1">database_setup.md</code>
                            </p>
                        </div>
                    ) : ventures.length === 0 ? (
                        <div className="p-10 text-center text-muted italic text-xs">No ventures found.</div>
                    ) : ventures.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { setSelectedItem(item); setIsEditing(false); }}
                            className={`w-full text-left p-6 border-b border-border transition-all hover:bg-white group ${selectedItem?.id === item.id && !isEditing ? "bg-white border-l-4 border-l-secondary shadow-sm" : ""}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <p className="font-bold text-sm text-black group-hover:text-secondary transition-colors line-clamp-1">{item.title}</p>
                                <span className={`text-[8px] uppercase tracking-widest font-black px-2 py-0.5 rounded-full ${item.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {item.is_active ? 'Active' : 'Draft'}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-[8px] uppercase tracking-widest font-black bg-secondary/10 text-secondary px-2 py-0.5 rounded-sm">{item.category}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Side */}
            <div className="flex-grow flex flex-col bg-white overflow-y-auto">
                {isEditing ? (
                    <div className="p-10 max-w-2xl mx-auto w-full space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="font-serif text-3xl font-black italic">{selectedItem ? "Edit Venture" : "New Venture"}</h2>
                            <button onClick={() => setIsEditing(false)} className="text-xs font-bold uppercase tracking-widest text-muted hover:text-black">Cancel</button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted">Venture Title</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full p-3 border border-border outline-none focus:border-secondary transition-all text-sm"
                                    placeholder="Pan-African Tech Fund"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted">Location / Regions</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full p-3 border border-border outline-none focus:border-secondary transition-all text-sm"
                                        placeholder="Nigeria / Kenya"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted">Category</label>
                                    <select
                                        className="w-full p-3 border border-border outline-none focus:border-secondary transition-all text-sm bg-white"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="Strategic">Strategic</option>
                                        <option value="Corporate">Corporate</option>
                                        <option value="Governmental">Governmental</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted">Status</label>
                                <select
                                    className="w-full p-3 border border-border outline-none focus:border-secondary transition-all text-sm bg-white"
                                    value={formData.is_active ? "active" : "draft"}
                                    onChange={e => setFormData({ ...formData, is_active: e.target.value === "active" })}
                                >
                                    <option value="active">Active</option>
                                    <option value="draft">Draft / Hidden</option>
                                </select>
                            </div>

                            <button
                                disabled={actionLoading}
                                className="w-full bg-black text-white p-4 font-bold uppercase tracking-widest text-xs hover:bg-secondary transition-all shadow-xl disabled:opacity-50"
                            >
                                {actionLoading ? <Loader2 className="animate-spin mx-auto" size={16} /> : (selectedItem ? "Save Changes" : "Post Venture")}
                            </button>
                        </form>
                    </div>
                ) : selectedItem ? (
                    <div className="p-16 space-y-12">
                        <div className="flex justify-between items-start">
                            <div className="space-y-4">
                                <div className="inline-flex items-center space-x-2 px-2 py-1 bg-secondary/10 border border-secondary/20 rounded-full">
                                    <Users size={10} className="text-secondary" />
                                    <span className="text-secondary font-black text-[8px] uppercase tracking-widest leading-none">{selectedItem.category}</span>
                                </div>
                                <h2 className="font-serif text-5xl font-black italic">{selectedItem.title}</h2>
                                <p className="text-xl text-muted font-light">{selectedItem.location}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => handleEdit(selectedItem)}
                                    className="p-3 border border-border rounded-sm hover:bg-gray-50 transition-all text-muted hover:text-black"
                                >
                                    <Edit3 size={18} />
                                </button>
                                <button
                                    onClick={() => toggleStatus(selectedItem)}
                                    className={`p-3 border rounded-sm transition-all ${selectedItem.is_active ? 'border-amber-200 text-amber-600 hover:bg-amber-50' : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'}`}
                                >
                                    {selectedItem.is_active ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
                                </button>
                                <button
                                    onClick={() => deleteVenture(selectedItem.id)}
                                    className="p-3 border border-red-100 text-red-500 rounded-sm hover:bg-red-50 transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-12">
                            <div className="bg-gray-50 p-6 space-y-6 rounded-sm border border-border/50">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted italic border-b border-border pb-4">Venture Details</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center text-xs text-black">
                                        <MapPin size={14} className="mr-3 text-secondary" /> {selectedItem.location}
                                    </div>
                                    <div className="flex items-center text-xs text-black">
                                        <Clock size={14} className="mr-3 text-secondary" /> Posted: {new Date(selectedItem.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center space-y-6 opacity-30">
                        <Scale size={80} className="text-muted" />
                        <p className="font-serif text-2xl italic">Select or post a lounge venture</p>
                    </div>
                )}
            </div>
        </div>
    );
}
