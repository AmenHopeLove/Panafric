"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import {
    BookOpen,
    Plus,
    Trash2,
    Loader2,
    Edit3,
    ExternalLink,
    FileText,
    Video,
    Globe,
    Search,
    ChevronRight,
    Camera,
    Upload
} from "lucide-react";
import { useRef } from "react";

export default function TrainingManagement() {
    const [resources, setResources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        resource_type: "Guide",
        description: "",
        image_url: "",
        link_url: ""
    });

    useEffect(() => {
        fetchResources();
    }, []);

    async function fetchResources() {
        setLoading(true);
        const { data, error } = await supabase
            .from('training_resources')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error loading resources:", error);
            alert("Error loading resources: " + error.message);
        }
        else setResources(data || []);
        setLoading(false);
    }

    const resetForm = () => {
        setFormData({
            title: "",
            resource_type: "Guide",
            description: "",
            image_url: "",
            link_url: ""
        });
    };

    const handleEdit = (item: any) => {
        setSelectedItem(item);
        setFormData({
            title: item.title,
            resource_type: item.resource_type,
            description: item.description || "",
            image_url: item.image_url || "",
            link_url: item.link_url || ""
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
            const filePath = `resources/${fileName}`;

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
                .from('training_resources')
                .update(payload)
                .eq('id', selectedItem.id);
            error = err;
        } else {
            const { error: err } = await supabase
                .from('training_resources')
                .insert([payload]);
            error = err;
        }

        if (error) {
            alert("Error saving resource: " + error.message);
        } else {
            fetchResources();
            resetForm();
            if (!isEditing) setIsEditing(false);
        }
        setActionLoading(false);
    }

    async function deleteResource(id: string) {
        if (!confirm("Are you sure you want to delete this resource?")) return;

        setActionLoading(true);
        const { error } = await supabase
            .from('training_resources')
            .delete()
            .eq('id', id);

        if (error) alert("Error deleting: " + error.message);
        else {
            fetchResources();
            if (selectedItem?.id === id) setSelectedItem(null);
        }
        setActionLoading(false);
    }

    return (
        <div className="flex h-[calc(100vh-12rem)] bg-white border border-border rounded-sm overflow-hidden shadow-sm font-sans">
            {/* List Side */}
            <div className="w-1/3 border-r border-border flex flex-col bg-[#fcfcfc]">
                <div className="p-6 border-b border-border bg-white flex justify-between items-center">
                    <h2 className="font-serif text-xl font-black italic">Training</h2>
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
                    ) : resources.length === 0 ? (
                        <div className="p-10 text-center text-muted italic text-xs">No resources found.</div>
                    ) : resources.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { setSelectedItem(item); setIsEditing(false); }}
                            className={`w-full text-left p-6 border-b border-border transition-all hover:bg-white group ${selectedItem?.id === item.id && !isEditing ? "bg-white border-l-4 border-l-secondary shadow-sm" : ""}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center space-x-3">
                                    <div className="h-8 w-8 rounded-sm bg-secondary/10 flex items-center justify-center text-secondary">
                                        {item.resource_type === 'Webinar' ? <Video size={14} /> : <FileText size={14} />}
                                    </div>
                                    <p className="font-bold text-sm text-black group-hover:text-secondary transition-colors">{item.title}</p>
                                </div>
                            </div>
                            <p className="text-[10px] text-muted font-bold uppercase tracking-widest leading-none ml-11">{item.resource_type}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Side */}
            <div className="flex-grow flex flex-col bg-white overflow-y-auto">
                {isEditing ? (
                    <div className="p-10 max-w-2xl mx-auto w-full space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="font-serif text-3xl font-black italic">{selectedItem ? "Edit Resource" : "Add Resource"}</h2>
                            <button onClick={() => setIsEditing(false)} className="text-xs font-bold uppercase tracking-widest text-muted hover:text-black">Cancel</button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted">Resource Title</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full p-3 border border-border outline-none focus:border-secondary transition-all text-sm"
                                    placeholder="Africa Trade Law Guide"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted">Type</label>
                                    <select
                                        className="w-full p-3 border border-border outline-none focus:border-secondary transition-all text-sm bg-white"
                                        value={formData.resource_type}
                                        onChange={e => setFormData({ ...formData, resource_type: e.target.value })}
                                    >
                                        <option>Guide</option>
                                        <option>Webinar</option>
                                        <option>Course</option>
                                        <option>E-Book</option>
                                        <option>Toolkit</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted">Resource Link</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-border outline-none focus:border-secondary transition-all text-sm"
                                        placeholder="https://..."
                                        value={formData.link_url}
                                        onChange={e => setFormData({ ...formData, link_url: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted block mb-2">Resource Cover / Thumbnail</label>
                                <div className="flex items-center space-x-6">
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-24 h-32 rounded-sm bg-gray-50 border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-secondary transition-all overflow-hidden group relative"
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
                                                <span className="text-[8px] font-bold text-muted mt-2 uppercase tracking-widest">Select Cover</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="text-[10px] font-black uppercase tracking-widest text-secondary hover:text-black transition-colors"
                                        >
                                            {formData.image_url ? "Change Image" : "Upload Image"}
                                        </button>
                                        <p className="text-[8px] text-muted max-w-[150px]">Book cover or webinar thumbnail. Recommended ratio 3:4. Max 2MB.</p>
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

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted">Summary / Description</label>
                                <textarea
                                    className="w-full p-3 border border-border outline-none focus:border-secondary transition-all text-sm h-32"
                                    placeholder="Short summary of what this resource covers..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <button
                                disabled={actionLoading}
                                className="w-full bg-black text-white p-4 font-bold uppercase tracking-widest text-xs hover:bg-secondary transition-all shadow-xl disabled:opacity-50"
                            >
                                {actionLoading ? <Loader2 className="animate-spin mx-auto" size={16} /> : (selectedItem ? "Save Changes" : "Publish Resource")}
                            </button>
                        </form>
                    </div>
                ) : selectedItem ? (
                    <div className="p-16 space-y-12">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-12">
                                {selectedItem.image_url ? (
                                    <div className="w-48 h-64 overflow-hidden rounded-sm border border-border shadow-xl transform -rotate-2">
                                        <img src={selectedItem.image_url} className="w-full h-full object-cover" alt="" />
                                    </div>
                                ) : (
                                    <div className="w-48 h-64 bg-gray-50 flex flex-col items-center justify-center border-2 border-dashed border-border text-muted rounded-sm">
                                        <BookOpen size={48} />
                                        <p className="text-[10px] mt-4 font-black uppercase tracking-widest">No Cover</p>
                                    </div>
                                )}
                                <div className="space-y-6 max-w-xl">
                                    <div className="inline-flex items-center space-x-2 px-2 py-1 bg-secondary/10 border border-secondary/20 rounded-full">
                                        <span className="text-secondary font-black text-[8px] uppercase tracking-widest leading-none">{selectedItem.resource_type}</span>
                                    </div>
                                    <h2 className="font-serif text-5xl font-black italic text-black leading-tight tracking-tight">{selectedItem.title}</h2>
                                    <p className="text-lg text-muted font-sans font-light leading-relaxed">{selectedItem.description || "No description provided."}</p>
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
                                    onClick={() => deleteResource(selectedItem.id)}
                                    className="p-3 border border-red-100 text-red-500 rounded-sm hover:bg-red-50 transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="pt-12 border-t border-border">
                            {selectedItem.link_url && (
                                <a
                                    href={selectedItem.link_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center space-x-4 bg-black text-white px-10 py-5 rounded-sm font-sans font-bold uppercase tracking-widest text-xs hover:bg-secondary transition-all shadow-2xl"
                                >
                                    <ExternalLink size={16} />
                                    <span>Access Resource</span>
                                </a>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center space-y-6 opacity-30">
                        <BookOpen size={80} className="text-muted" />
                        <p className="font-serif text-2xl italic">Select or publish a resource</p>
                    </div>
                )}
            </div>
        </div>
    );
}
