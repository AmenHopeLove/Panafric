"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import {
    Users,
    Plus,
    Search,
    MapPin,
    Trash2,
    Loader2,
    CheckCircle2,
    XCircle,
    Edit3,
    User,
    Camera,
    Image as ImageIcon,
    Upload
} from "lucide-react";
import { useRef } from "react";

export default function MentorshipManagement() {
    const [mentors, setMentors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        mentor_name: "",
        expertise: "",
        location: "",
        bio: "",
        image_url: "",
        is_available: true
    });

    useEffect(() => {
        fetchMentors();
    }, []);

    async function fetchMentors() {
        setLoading(true);
        const { data, error } = await supabase
            .from('mentorship_programs')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error loading mentors:", error);
            alert("Error loading mentors: " + error.message);
        }
        else setMentors(data || []);
        setLoading(false);
    }

    const resetForm = () => {
        setFormData({
            mentor_name: "",
            expertise: "",
            location: "",
            bio: "",
            image_url: "",
            is_available: true
        });
    };

    const handleEdit = (item: any) => {
        setSelectedItem(item);
        setFormData({
            mentor_name: item.mentor_name,
            expertise: item.expertise,
            location: item.location,
            bio: item.bio || "",
            image_url: item.image_url || "",
            is_available: item.is_available
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
            const filePath = `mentors/${fileName}`;

            const { error: uploadError, data } = await supabase.storage
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
            updated_at: new Date().toISOString()
        };

        let error;
        if (isEditing && selectedItem) {
            const { error: err } = await supabase
                .from('mentorship_programs')
                .update(payload)
                .eq('id', selectedItem.id);
            error = err;
        } else {
            const { error: err } = await supabase
                .from('mentorship_programs')
                .insert([payload]);
            error = err;
        }

        if (error) {
            alert("Error saving mentor: " + error.message);
        } else {
            fetchMentors();
            resetForm();
            if (!isEditing) setIsEditing(false);
        }
        setActionLoading(false);
    }

    async function toggleAvailability(item: any) {
        setActionLoading(true);
        const { error } = await supabase
            .from('mentorship_programs')
            .update({ is_available: !item.is_available })
            .eq('id', item.id);

        if (error) alert("Error updating status: " + error.message);
        else fetchMentors();
        setActionLoading(false);
    }

    async function deleteMentor(id: string) {
        if (!confirm("Are you sure you want to remove this mentor?")) return;

        setActionLoading(true);
        const { error } = await supabase
            .from('mentorship_programs')
            .delete()
            .eq('id', id);

        if (error) alert("Error deleting: " + error.message);
        else {
            fetchMentors();
            if (selectedItem?.id === id) setSelectedItem(null);
        }
        setActionLoading(false);
    }

    return (
        <div className="flex h-[calc(100vh-12rem)] bg-white border border-border rounded-sm overflow-hidden shadow-sm font-sans">
            {/* List Side */}
            <div className="w-1/3 border-r border-border flex flex-col bg-[#fcfcfc]">
                <div className="p-6 border-b border-border bg-white flex justify-between items-center">
                    <h2 className="font-serif text-xl font-black italic">Mentors</h2>
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
                    ) : mentors.length === 0 ? (
                        <div className="p-10 text-center text-muted italic text-xs">No mentors found.</div>
                    ) : mentors.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { setSelectedItem(item); setIsEditing(false); }}
                            className={`w-full text-left p-6 border-b border-border transition-all hover:bg-white group ${selectedItem?.id === item.id && !isEditing ? "bg-white border-l-4 border-l-secondary shadow-sm" : ""}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center space-x-3">
                                    {item.image_url ? (
                                        <img src={item.image_url} className="h-8 w-8 rounded-full object-cover" alt="" />
                                    ) : (
                                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                            <User size={12} className="text-muted" />
                                        </div>
                                    )}
                                    <p className="font-bold text-sm text-black group-hover:text-secondary transition-colors">{item.mentor_name}</p>
                                </div>
                                <span className={`text-[8px] uppercase tracking-widest font-black px-2 py-0.5 rounded-full ${item.is_available ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {item.is_available ? 'Available' : 'Busy'}
                                </span>
                            </div>
                            <p className="text-[10px] text-muted font-bold uppercase tracking-widest mb-2">{item.expertise}</p>
                            <div className="flex items-center text-[10px] text-muted space-x-4">
                                <span className="flex items-center"><MapPin size={10} className="mr-1" /> {item.location}</span>
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
                            <h2 className="font-serif text-3xl font-black italic">{selectedItem ? "Edit Mentor" : "Add Mentor"}</h2>
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
                                        value={formData.mentor_name}
                                        onChange={e => setFormData({ ...formData, mentor_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted">Expertise</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full p-3 border border-border outline-none focus:border-secondary transition-all text-sm"
                                        placeholder="Human Rights Law"
                                        value={formData.expertise}
                                        onChange={e => setFormData({ ...formData, expertise: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted">Location</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full p-3 border border-border outline-none focus:border-secondary transition-all text-sm"
                                        placeholder="Nairobi, Kenya"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted block mb-2">Mentor Portrait</label>
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
                                            <p className="text-[8px] text-muted max-w-[150px]">Professional portrait recommended. Max 2MB.</p>
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    {/* Keep manual input for flexibility */}
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-border outline-none focus:border-secondary transition-all text-[10px] mt-2"
                                        placeholder="Or paste direct image URL..."
                                        value={formData.image_url}
                                        onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted">Professional Bio</label>
                                <textarea
                                    className="w-full p-3 border border-border outline-none focus:border-secondary transition-all text-sm h-32"
                                    placeholder="Describe their background and mentorship style..."
                                    value={formData.bio}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                />
                            </div>

                            <button
                                disabled={actionLoading}
                                className="w-full bg-black text-white p-4 font-bold uppercase tracking-widest text-xs hover:bg-secondary transition-all shadow-xl disabled:opacity-50"
                            >
                                {actionLoading ? <Loader2 className="animate-spin mx-auto" size={16} /> : (selectedItem ? "Save Changes" : "Register Mentor")}
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
                                        <span className="text-emerald-700 font-black text-[8px] uppercase tracking-widest leading-none">{selectedItem.is_available ? 'Active Mentor' : 'Inactive'}</span>
                                    </div>
                                    <h2 className="font-serif text-5xl font-black italic">{selectedItem.mentor_name}</h2>
                                    <p className="text-xl text-secondary font-black font-sans uppercase tracking-[0.2em] italic">{selectedItem.expertise}</p>
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
                                    onClick={() => toggleAvailability(selectedItem)}
                                    className={`p-3 border rounded-sm transition-all ${selectedItem.is_available ? 'border-amber-200 text-amber-600 hover:bg-amber-50' : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'}`}
                                >
                                    {selectedItem.is_available ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
                                </button>
                                <button
                                    onClick={() => deleteMentor(selectedItem.id)}
                                    className="p-3 border border-red-100 text-red-500 rounded-sm hover:bg-red-50 transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-12 border-t border-border pt-12">
                            <div className="col-span-2 space-y-8">
                                <div className="prose prose-sm max-w-none">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted mb-4 italic">Professional Biography</h3>
                                    <p className="text-black leading-relaxed whitespace-pre-wrap font-sans">{selectedItem.bio || "No biography provided."}</p>
                                </div>
                            </div>
                            <div className="space-y-8">
                                <div className="bg-gray-50 p-6 space-y-6 rounded-sm border border-border/50">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted italic">Location</h3>
                                    <div className="flex items-center text-xs text-black">
                                        <MapPin size={14} className="mr-3 text-secondary" /> {selectedItem.location}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center space-y-6 opacity-30">
                        <Users size={80} className="text-muted" />
                        <p className="font-serif text-2xl italic">Select or register a mentor</p>
                    </div>
                )}
            </div>
        </div>
    );
}
