"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import {
    Briefcase,
    Plus,
    Search,
    MapPin,
    Clock,
    Link as LinkIcon,
    Trash2,
    Settings,
    Loader2,
    CheckCircle2,
    XCircle,
    ChevronRight,
    Edit3,
    ExternalLink
} from "lucide-react";

export default function InternshipManagement() {
    const [internships, setInternships] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        company: "Pan-Afric Law Firm",
        location: "",
        type: "Internship",
        description: "",
        apply_link: "",
        is_active: true
    });

    useEffect(() => {
        fetchInternships();
    }, []);

    async function fetchInternships() {
        setLoading(true);
        const { data, error } = await supabase
            .from('career_internships')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error loading internships:", error);
            alert("Error loading internships: " + error.message);
        }
        else setInternships(data || []);
        setLoading(false);
    }

    const resetForm = () => {
        setFormData({
            title: "",
            company: "Pan-Afric Law Firm",
            location: "",
            type: "Internship",
            description: "",
            apply_link: "",
            is_active: true
        });
    };

    const handleEdit = (item: any) => {
        setSelectedItem(item);
        setFormData({
            title: item.title,
            company: item.company,
            location: item.location,
            type: item.type,
            description: item.description || "",
            apply_link: item.apply_link || "",
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

        let error;
        if (isEditing && selectedItem) {
            const { error: err } = await supabase
                .from('career_internships')
                .update(payload)
                .eq('id', selectedItem.id);
            error = err;
        } else {
            const { error: err } = await supabase
                .from('career_internships')
                .insert([payload]);
            error = err;
        }

        if (error) {
            alert("Error saving internship: " + error.message);
        } else {
            fetchInternships();
            resetForm();
            if (!isEditing) setIsEditing(false);
        }
        setActionLoading(false);
    }

    async function toggleStatus(item: any) {
        setActionLoading(true);
        const { error } = await supabase
            .from('career_internships')
            .update({ is_active: !item.is_active })
            .eq('id', item.id);

        if (error) alert("Error updating status: " + error.message);
        else fetchInternships();
        setActionLoading(false);
    }

    async function deleteInternship(id: string) {
        if (!confirm("Are you sure you want to delete this internship posting?")) return;

        setActionLoading(true);
        const { error } = await supabase
            .from('career_internships')
            .delete()
            .eq('id', id);

        if (error) alert("Error deleting: " + error.message);
        else {
            fetchInternships();
            if (selectedItem?.id === id) setSelectedItem(null);
        }
        setActionLoading(false);
    }

    return (
        <div className="flex h-[calc(100vh-12rem)] bg-white border border-border rounded-sm overflow-hidden shadow-sm font-sans">
            {/* List Side */}
            <div className="w-1/3 border-r border-border flex flex-col bg-[#fcfcfc]">
                <div className="p-6 border-b border-border bg-white flex justify-between items-center">
                    <h2 className="font-serif text-xl font-black italic">Internships</h2>
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
                    ) : internships.length === 0 ? (
                        <div className="p-10 text-center text-muted italic text-xs">No internships found.</div>
                    ) : internships.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { setSelectedItem(item); setIsEditing(false); }}
                            className={`w-full text-left p-6 border-b border-border transition-all hover:bg-white group ${selectedItem?.id === item.id && !isEditing ? "bg-white border-l-4 border-l-secondary shadow-sm" : ""}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <p className="font-bold text-sm text-black group-hover:text-secondary transition-colors">{item.title}</p>
                                <span className={`text-[8px] uppercase tracking-widest font-black px-2 py-0.5 rounded-full ${item.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {item.is_active ? 'Active' : 'Closed'}
                                </span>
                            </div>
                            <p className="text-[10px] text-muted font-bold uppercase tracking-widest mb-2">{item.company}</p>
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
                            <h2 className="font-serif text-3xl font-black italic">{selectedItem ? "Edit Internship" : "New Internship"}</h2>
                            <button onClick={() => setIsEditing(false)} className="text-xs font-bold uppercase tracking-widest text-muted hover:text-black">Cancel</button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted">Title</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full p-3 border border-border outline-none focus:border-secondary transition-all text-sm"
                                        placeholder="Law Intern"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted">Company</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full p-3 border border-border outline-none focus:border-secondary transition-all text-sm"
                                        value={formData.company}
                                        onChange={e => setFormData({ ...formData, company: e.target.value })}
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
                                        placeholder="Remote or City, Country"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted">Type</label>
                                    <select
                                        className="w-full p-3 border border-border outline-none focus:border-secondary transition-all text-sm bg-white"
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option>Internship</option>
                                        <option>Fellowship</option>
                                        <option>Associate Program</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted">Apply Link / Email</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-border outline-none focus:border-secondary transition-all text-sm"
                                    placeholder="https://... or mailto:..."
                                    value={formData.apply_link}
                                    onChange={e => setFormData({ ...formData, apply_link: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted">Description</label>
                                <textarea
                                    className="w-full p-3 border border-border outline-none focus:border-secondary transition-all text-sm h-32"
                                    placeholder="Describe the opportunity and requirements..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <button
                                disabled={actionLoading}
                                className="w-full bg-black text-white p-4 font-bold uppercase tracking-widest text-xs hover:bg-secondary transition-all shadow-xl disabled:opacity-50"
                            >
                                {actionLoading ? <Loader2 className="animate-spin mx-auto" size={16} /> : (selectedItem ? "Save Changes" : "Post Internship")}
                            </button>
                        </form>
                    </div>
                ) : selectedItem ? (
                    <div className="p-16 space-y-12">
                        <div className="flex justify-between items-start">
                            <div className="space-y-4">
                                <div className="inline-flex items-center space-x-2 px-2 py-1 bg-secondary/10 border border-secondary/20 rounded-full">
                                    <span className="text-secondary font-black text-[8px] uppercase tracking-widest leading-none">{selectedItem.type}</span>
                                </div>
                                <h2 className="font-serif text-5xl font-black italic">{selectedItem.title}</h2>
                                <p className="text-xl text-muted font-light">{selectedItem.company}</p>
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
                                    onClick={() => deleteInternship(selectedItem.id)}
                                    className="p-3 border border-red-100 text-red-500 rounded-sm hover:bg-red-50 transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-12">
                            <div className="col-span-2 space-y-8">
                                <div className="prose prose-sm max-w-none">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted mb-4 italic">Description</h3>
                                    <p className="text-black leading-relaxed whitespace-pre-wrap">{selectedItem.description || "No description provided."}</p>
                                </div>
                            </div>
                            <div className="space-y-8">
                                <div className="bg-gray-50 p-6 space-y-6 rounded-sm border border-border/50">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted italic">Details</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center text-xs text-black">
                                            <MapPin size={14} className="mr-3 text-secondary" /> {selectedItem.location}
                                        </div>
                                        <div className="flex items-center text-xs text-black">
                                            <Clock size={14} className="mr-3 text-secondary" /> {new Date(selectedItem.created_at).toLocaleDateString()}
                                        </div>
                                        {selectedItem.apply_link && (
                                            <div className="pt-4 border-t border-border mt-4">
                                                <a
                                                    href={selectedItem.apply_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center text-secondary font-bold text-[10px] uppercase tracking-widest hover:text-black transition-colors"
                                                >
                                                    <ExternalLink size={14} className="mr-3" /> Application Link
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center space-y-6 opacity-30">
                        <Briefcase size={80} className="text-muted" />
                        <p className="font-serif text-2xl italic">Select or create an internship</p>
                    </div>
                )}
            </div>
        </div>
    );
}
