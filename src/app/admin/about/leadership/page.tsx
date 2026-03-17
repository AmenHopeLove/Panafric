"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase-client";
import {
    Users,
    Plus,
    Trash2,
    Loader2,
    CheckCircle2,
    XCircle,
    Edit3,
    User,
    Camera,
    Linkedin,
    MoveUp,
    MoveDown
} from "lucide-react";

export default function LeadershipManagement() {
    const [team, setTeam] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        bio_summary: "",
        bio_full: "",
        image_url: "",
        linkedin_url: "",
        display_order: 0,
        is_active: true
    });

    useEffect(() => {
        fetchTeam();
    }, []);

    async function fetchTeam() {
        setLoading(true);
        const { data, error } = await supabase
            .from('site_leadership')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) {
            console.error("Error loading leadership:", error);
            alert("Error loading leadership: " + error.message);
        }
        else setTeam(data || []);
        setLoading(false);
    }

    const resetForm = () => {
        setFormData({
            name: "",
            role: "",
            bio_summary: "",
            bio_full: "",
            image_url: "",
            linkedin_url: "",
            display_order: team.length,
            is_active: true
        });
    };

    const handleEdit = (item: any) => {
        setSelectedItem(item);
        setFormData({
            name: item.name,
            role: item.role,
            bio_summary: item.bio_summary || "",
            bio_full: item.bio_full || "",
            image_url: item.image_url || "",
            linkedin_url: item.linkedin_url || "",
            display_order: item.display_order,
            is_active: item.is_active
        });
        setIsEditing(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const filePath = `leadership/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('career-media')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('career-media')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image_url: publicUrl }));
        } catch (error: any) {
            console.error('Error uploading image:', error);
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setActionLoading(true);

        const payload = {
            ...formData,
        };

        let error;
        if (isEditing && selectedItem) {
            const { error: err } = await supabase
                .from('site_leadership')
                .update(payload)
                .eq('id', selectedItem.id);
            error = err;
        } else {
            const { error: err } = await supabase
                .from('site_leadership')
                .insert([payload]);
            error = err;
        }

        if (error) {
            alert("Error saving leadership member: " + error.message);
        } else {
            fetchTeam();
            resetForm();
            setIsEditing(false);
        }
        setActionLoading(false);
    }

    async function toggleStatus(item: any) {
        setActionLoading(true);
        const { error } = await supabase
            .from('site_leadership')
            .update({ is_active: !item.is_active })
            .eq('id', item.id);

        if (error) alert("Error updating status: " + error.message);
        else fetchTeam();
        setActionLoading(false);
    }

    async function deleteMember(id: string) {
        if (!confirm("Are you sure you want to remove this member from the leadership team?")) return;

        setActionLoading(true);
        const { error } = await supabase
            .from('site_leadership')
            .delete()
            .eq('id', id);

        if (error) alert("Error deleting: " + error.message);
        else {
            fetchTeam();
            if (selectedItem?.id === id) setSelectedItem(null);
        }
        setActionLoading(false);
    }

    async function moveOrder(item: any, direction: 'up' | 'down') {
        const currentIndex = team.findIndex(m => m.id === item.id);
        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

        if (newIndex < 0 || newIndex >= team.length) return;

        setActionLoading(true);
        const otherItem = team[newIndex];

        const { error: err1 } = await supabase
            .from('site_leadership')
            .update({ display_order: otherItem.display_order })
            .eq('id', item.id);

        const { error: err2 } = await supabase
            .from('site_leadership')
            .update({ display_order: item.display_order })
            .eq('id', otherItem.id);

        if (err1 || err2) alert("Error updating order");
        else fetchTeam();
        setActionLoading(false);
    }

    return (
        <div className="flex h-[calc(100vh-12rem)] bg-white border border-border rounded-sm overflow-hidden shadow-sm font-sans">
            {/* List Side */}
            <div className="w-1/3 border-r border-border flex flex-col bg-[#fcfcfc]">
                <div className="p-6 border-b border-border bg-white flex justify-between items-center">
                    <h2 className="font-serif text-xl font-black italic">Leadership</h2>
                    <button
                        onClick={() => { setIsEditing(true); setSelectedItem(null); resetForm(); }}
                        className="p-2 bg-secondary text-white rounded-sm hover:bg-black transition-all"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto">
                    {loading ? (
                        <div className="p-10 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted" /></div>
                    ) : team.length === 0 ? (
                        <div className="p-10 text-center text-muted italic text-xs">No leadership members found.</div>
                    ) : team.map((item, index) => (
                        <div key={item.id} className="relative group">
                            <button
                                onClick={() => { setSelectedItem(item); setIsEditing(false); }}
                                className={`w-full text-left p-6 border-b border-border transition-all hover:bg-white flex items-start space-x-4 ${selectedItem?.id === item.id && !isEditing ? "bg-white border-l-4 border-l-secondary shadow-sm" : ""}`}
                            >
                                {item.image_url ? (
                                    <img src={item.image_url} className="h-10 w-10 rounded-full object-cover" alt="" />
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                        <User size={16} className="text-muted" />
                                    </div>
                                )}
                                <div className="flex-grow">
                                    <div className="flex justify-between">
                                        <p className="font-bold text-sm text-black">{item.name}</p>
                                        <span className={`text-[8px] uppercase tracking-widest font-black px-2 py-0.5 rounded-full ${item.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {item.is_active ? 'Visible' : 'Hidden'}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1">{item.role}</p>
                                </div>
                            </button>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => moveOrder(item, 'up')} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30" disabled={index === 0}><MoveUp size={12} /></button>
                                <button onClick={() => moveOrder(item, 'down')} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30" disabled={index === team.length - 1}><MoveDown size={12} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Side */}
            <div className="flex-grow flex flex-col bg-white overflow-y-auto">
                {isEditing ? (
                    <div className="p-10 max-w-2xl mx-auto w-full space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="font-serif text-3xl font-black italic">{selectedItem ? "Edit Member" : "Add Leader"}</h2>
                            <button onClick={() => setIsEditing(false)} className="text-xs font-bold uppercase tracking-widest text-muted hover:text-black">Cancel</button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full p-3 border border-border outline-none focus:border-secondary transition-all text-sm"
                                        placeholder="Jane Doe"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted">Role / Title</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full p-3 border border-border outline-none focus:border-secondary transition-all text-sm"
                                        placeholder="Managing Partner"
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted">LinkedIn URL</label>
                                    <input
                                        type="url"
                                        className="w-full p-3 border border-border outline-none focus:border-secondary transition-all text-sm"
                                        placeholder="https://linkedin.com/in/..."
                                        value={formData.linkedin_url}
                                        onChange={e => setFormData({ ...formData, linkedin_url: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted block mb-2">Portrait</label>
                                    <div className="flex items-center space-x-6">
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="h-20 w-20 rounded-full bg-gray-50 border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-secondary transition-all overflow-hidden group relative"
                                        >
                                            {formData.image_url ? (
                                                <>
                                                    <img src={formData.image_url} className="w-full h-full object-cover" alt="" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                        <Camera size={20} className="text-white" />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    {uploading ? <Loader2 className="animate-spin text-muted" size={20} /> : <Camera size={20} className="text-muted group-hover:text-secondary" />}
                                                    <span className="text-[8px] font-bold text-muted mt-1 uppercase tracking-widest">Click</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="text-[10px] font-black uppercase tracking-widest text-secondary hover:text-black transition-colors"
                                            >
                                                {formData.image_url ? "Change Photo" : "Upload Photo"}
                                            </button>
                                            <p className="text-[8px] text-muted max-w-[150px]">Professional portrait. Max 2MB.</p>
                                        </div>
                                    </div>
                                    <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted">Short Bio (Summary)</label>
                                <textarea
                                    className="w-full p-3 border border-border outline-none focus:border-secondary transition-all text-sm h-20"
                                    placeholder="Brief introduction for the main card..."
                                    value={formData.bio_summary}
                                    onChange={e => setFormData({ ...formData, bio_summary: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted">Full Bio (Detailed)</label>
                                <textarea
                                    className="w-full p-3 border border-border outline-none focus:border-secondary transition-all text-sm h-32"
                                    placeholder="Detailed professional background..."
                                    value={formData.bio_full}
                                    onChange={e => setFormData({ ...formData, bio_full: e.target.value })}
                                />
                            </div>

                            <button
                                disabled={actionLoading}
                                className="w-full bg-black text-white p-4 font-bold uppercase tracking-widest text-xs hover:bg-secondary transition-all shadow-xl disabled:opacity-50"
                            >
                                {actionLoading ? <Loader2 className="animate-spin mx-auto" size={16} /> : (selectedItem ? "Save Changes" : "Add to Team")}
                            </button>
                        </form>
                    </div>
                ) : selectedItem ? (
                    <div className="p-16 space-y-12">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-8">
                                {selectedItem.image_url ? (
                                    <img src={selectedItem.image_url} className="h-32 w-32 rounded-full object-cover border-4 border-secondary/10 shadow-lg" alt="" />
                                ) : (
                                    <div className="h-32 w-32 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-border text-muted">
                                        <User size={48} />
                                    </div>
                                )}
                                <div className="space-y-4">
                                    <div className="inline-flex items-center space-x-2 px-2 py-1 bg-emerald-100 border border-emerald-200 rounded-full">
                                        <span className="text-emerald-700 font-black text-[8px] uppercase tracking-widest leading-none">{selectedItem.is_active ? 'Public Profile' : 'Hidden'}</span>
                                    </div>
                                    <h2 className="font-serif text-5xl font-black italic">{selectedItem.name}</h2>
                                    <p className="text-xl text-secondary font-black font-sans uppercase tracking-[0.2em] italic">{selectedItem.role}</p>
                                </div>
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
                                    onClick={() => deleteMember(selectedItem.id)}
                                    className="p-3 border border-red-100 text-red-500 rounded-sm hover:bg-red-50 transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-12 border-t border-border pt-12">
                            <div className="col-span-2 space-y-8">
                                <div className="prose prose-sm max-w-none">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted mb-4 italic">Short Bio</h3>
                                    <p className="text-black italic leading-relaxed whitespace-pre-wrap font-sans mb-8">{selectedItem.bio_summary || "No summary provided."}</p>

                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted mb-4 italic">Full Bio</h3>
                                    <p className="text-muted leading-relaxed whitespace-pre-wrap font-sans">{selectedItem.bio_full || "No detailed bio provided."}</p>
                                </div>
                            </div>
                            <div className="space-y-8">
                                <div className="bg-gray-50 p-6 space-y-6 rounded-sm border border-border/50">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted italic">Professional Links</h3>
                                    {selectedItem.linkedin_url ? (
                                        <a href={selectedItem.linkedin_url} target="_blank" className="flex items-center text-xs text-secondary font-bold hover:text-black transition-colors">
                                            <Linkedin size={14} className="mr-3" /> LinkedIn Profile
                                        </a>
                                    ) : (
                                        <p className="text-[10px] text-muted italic">No links added.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center space-y-8 opacity-40">
                        <div className="p-8 rounded-full bg-gray-50 border-2 border-dashed border-border animate-pulse">
                            <Users size={100} className="text-muted" />
                        </div>
                        <div className="text-center space-y-2">
                            <p className="font-serif text-3xl italic text-black">No Team Members Yet</p>
                            <p className="text-sm text-muted font-sans font-light">Start building your leadership team by adding your first profile.</p>
                        </div>
                        <button
                            onClick={() => { setIsEditing(true); setSelectedItem(null); resetForm(); }}
                            className="flex items-center space-x-3 bg-secondary text-white px-8 py-4 rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl"
                        >
                            <Plus size={20} />
                            <span>Add Your First Leader</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
