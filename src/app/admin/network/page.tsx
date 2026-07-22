"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase-client";
import {
    Users,
    Search,
    Mail,
    User,
    Calendar,
    Clock,
    Briefcase,
    MapPin,
    Globe,
    ChevronRight,
    Loader2,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Camera,
    Trash2,
    Edit,
    Plus,
    X,
    Save
} from "lucide-react";

const STANDARD_PRACTICE_AREAS = ["Corporate", "Trade", "Litigation", "Real Estate", "IP"];

export default function NetworkManagement() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState<any | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    // Filter states
    const [searchTerm, setSearchTerm] = useState("");

    // Edit states
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        full_name: "",
        email: "",
        firm_name: "",
        location: "",
        experience_years: 1,
        practice_areas: [] as string[],
        message: ""
    });

    // Create states
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [createForm, setCreateForm] = useState({
        full_name: "",
        email: "",
        firm_name: "",
        location: "",
        experience_years: 1,
        practice_areas: [] as string[],
        message: "",
        status: "approved"
    });

    useEffect(() => {
        fetchApplications();
    }, []);

    async function fetchApplications() {
        setLoading(true);
        const { data, error } = await supabase
            .from('network_applications')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error loading applications:", error);
        } else {
            setApplications(data || []);
        }
        setLoading(false);
    }

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file || !selectedApp) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `profile_${selectedApp.id}_${Date.now()}.${fileExt}`;
            const filePath = `network/${fileName}`;

            // Upload image to public cms-images bucket
            const { error: uploadError } = await supabase.storage
                .from('cms-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('cms-images')
                .getPublicUrl(filePath);

            // Update database
            const { error: dbError } = await supabase
                .from('network_applications')
                .update({ profile_image_url: publicUrl })
                .eq('id', selectedApp.id);

            if (dbError) throw dbError;

            // Update local state
            setApplications(applications.map(a => a.id === selectedApp.id ? { ...a, profile_image_url: publicUrl } : a));
            setSelectedApp({ ...selectedApp, profile_image_url: publicUrl });

        } catch (error: any) {
            console.error('Error uploading image:', error);
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
        }
    }

    async function updateStatus(id: number, newStatus: string) {
        setActionLoading(true);
        const { error } = await supabase
            .from('network_applications')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status: " + error.message);
        } else {
            setApplications(applications.map(a => a.id === id ? { ...a, status: newStatus } : a));
            if (selectedApp?.id === id) {
                setSelectedApp({ ...selectedApp, status: newStatus });
            }
        }
        setActionLoading(false);
    }

    async function deleteApplication(id: number) {
        if (!confirm("Are you sure you want to permanently delete this member profile? This action cannot be undone.")) return;

        setActionLoading(true);
        const { error } = await supabase
            .from('network_applications')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Error deleting member:", error);
            alert("Failed to delete member: " + error.message);
        } else {
            setApplications(applications.filter(a => a.id !== id));
            setSelectedApp(null);
            setIsEditing(false);
            alert("Member profile deleted successfully.");
        }
        setActionLoading(false);
    }

    const startEditing = () => {
        setEditForm({
            full_name: selectedApp.full_name || "",
            email: selectedApp.email || "",
            firm_name: selectedApp.firm_name || "",
            location: selectedApp.location || "",
            experience_years: selectedApp.experience_years || 1,
            practice_areas: selectedApp.practice_areas || [],
            message: selectedApp.message || ""
        });
        setIsEditing(true);
    };

    const handleCreatePracticeAreaToggle = (area: string) => {
        const currentAreas = createForm.practice_areas || [];
        if (currentAreas.includes(area)) {
            setCreateForm({
                ...createForm,
                practice_areas: currentAreas.filter(a => a !== area)
            });
        } else {
            setCreateForm({
                ...createForm,
                practice_areas: [...currentAreas, area]
            });
        }
    };

    const handleEditPracticeAreaToggle = (area: string) => {
        const currentAreas = editForm.practice_areas || [];
        if (currentAreas.includes(area)) {
            setEditForm({
                ...editForm,
                practice_areas: currentAreas.filter(a => a !== area)
            });
        } else {
            setEditForm({
                ...editForm,
                practice_areas: [...currentAreas, area]
            });
        }
    };

    async function saveApplicationEdits() {
        if (!editForm.full_name || !editForm.email || !editForm.location) {
            alert("Name, Email, and Location are required fields.");
            return;
        }

        setActionLoading(true);
        const { error } = await supabase
            .from('network_applications')
            .update({
                full_name: editForm.full_name,
                email: editForm.email,
                firm_name: editForm.firm_name,
                location: editForm.location,
                experience_years: editForm.experience_years,
                practice_areas: editForm.practice_areas,
                message: editForm.message
            })
            .eq('id', selectedApp.id);

        if (error) {
            console.error("Error saving edits:", error);
            alert("Failed to save updates: " + error.message);
        } else {
            const updatedApp = {
                ...selectedApp,
                ...editForm
            };
            setApplications(applications.map(a => a.id === selectedApp.id ? updatedApp : a));
            setSelectedApp(updatedApp);
            setIsEditing(false);
            alert("Member updated successfully.");
        }
        setActionLoading(false);
    }

    async function createMember() {
        if (!createForm.full_name || !createForm.email || !createForm.location) {
            alert("Name, Email, and Location are required fields.");
            return;
        }

        setActionLoading(true);
        const { data, error } = await supabase
            .from('network_applications')
            .insert([{
                full_name: createForm.full_name,
                email: createForm.email,
                firm_name: createForm.firm_name,
                location: createForm.location,
                experience_years: createForm.experience_years,
                practice_areas: createForm.practice_areas,
                message: createForm.message,
                status: createForm.status
            }])
            .select();

        if (error) {
            console.error("Error creating member:", error);
            alert("Failed to create member: " + error.message);
        } else {
            if (data && data[0]) {
                setApplications([data[0], ...applications]);
                setSelectedApp(data[0]);
                setShowCreateForm(false);
                // Reset form
                setCreateForm({
                    full_name: "",
                    email: "",
                    firm_name: "",
                    location: "",
                    experience_years: 1,
                    practice_areas: [],
                    message: "",
                    status: "approved"
                });
                alert("Member created and assigned successfully.");
            }
        }
        setActionLoading(false);
    }

    // Client-side local filtering
    const filteredApps = applications.filter(app => 
        app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.firm_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-[calc(100vh-12rem)] bg-white border border-border rounded-sm overflow-hidden shadow-sm">
            {/* Application / Member List */}
            <div className="w-1/3 border-r border-border flex flex-col bg-[#fcfcfc]">
                <div className="p-6 border-b border-border bg-white flex items-center space-x-3">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted h-3.5 w-3.5" />
                        <input
                            type="text"
                            placeholder="Search directory..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-border rounded-sm outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all font-sans text-xs text-black"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => {
                            setShowCreateForm(true);
                            setSelectedApp(null);
                            setIsEditing(false);
                        }}
                        className="p-2 bg-secondary text-white rounded-sm hover:bg-black transition-colors flex items-center justify-center shrink-0"
                        title="Add Member Manually"
                    >
                        <Plus size={16} />
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto">
                    {loading ? (
                        <div className="p-10 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted" /></div>
                    ) : filteredApps.length === 0 ? (
                        <div className="p-10 text-center text-muted italic text-xs font-sans">No members found.</div>
                    ) : filteredApps.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setSelectedApp(item);
                                setShowCreateForm(false);
                                setIsEditing(false);
                            }}
                            className={`w-full text-left p-6 border-b border-border transition-all hover:bg-white group ${selectedApp?.id === item.id ? "bg-white border-l-4 border-l-secondary shadow-sm" : ""}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center space-x-3">
                                    {item.profile_image_url ? (
                                        <img src={item.profile_image_url} className="h-8 w-8 rounded-full object-cover" alt="" />
                                    ) : (
                                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                            <User size={12} className="text-muted" />
                                        </div>
                                    )}
                                    <p className="font-bold text-sm text-black group-hover:text-secondary transition-colors">{item.full_name}</p>
                                </div>
                                <span className={`text-[8px] uppercase tracking-widest font-black px-2 py-0.5 rounded-full ${item.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                    item.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                    {item.status}
                                </span>
                            </div>
                            <p className="text-xs text-muted font-sans font-medium line-clamp-1 mb-3">{item.firm_name || "Independent Professional"}</p>
                            <div className="flex items-center text-[10px] text-muted space-x-4">
                                <span className="flex items-center"><MapPin size={10} className="mr-1" /> {item.location}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Detail View / Create Form */}
            <div className="flex-grow flex flex-col bg-white overflow-y-auto">
                {showCreateForm ? (
                    // Add/Create Member Form
                    <div className="p-10 space-y-8 max-w-2xl">
                        <div className="flex justify-between items-center pb-4 border-b border-border">
                            <h2 className="font-serif text-3xl font-black italic">Create Member Profile</h2>
                            <button onClick={() => setShowCreateForm(false)} className="p-2 hover:bg-gray-100 rounded-full text-muted">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Full Name *</label>
                                <input
                                    type="text"
                                    className="w-full border border-border p-3 rounded-sm outline-none focus:border-secondary transition-colors font-sans text-sm text-black"
                                    value={createForm.full_name}
                                    onChange={(e) => setCreateForm({ ...createForm, full_name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Email Address *</label>
                                <input
                                    type="email"
                                    className="w-full border border-border p-3 rounded-sm outline-none focus:border-secondary transition-colors font-sans text-sm text-black"
                                    value={createForm.email}
                                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Firm Name</label>
                                <input
                                    type="text"
                                    className="w-full border border-border p-3 rounded-sm outline-none focus:border-secondary transition-colors font-sans text-sm text-black"
                                    value={createForm.firm_name}
                                    onChange={(e) => setCreateForm({ ...createForm, firm_name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Location *</label>
                                <input
                                    type="text"
                                    className="w-full border border-border p-3 rounded-sm outline-none focus:border-secondary transition-colors font-sans text-sm text-black"
                                    placeholder="e.g. Addis Ababa, Ethiopia"
                                    value={createForm.location}
                                    onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Years of Experience</label>
                                <input
                                    type="number"
                                    className="w-full border border-border p-3 rounded-sm outline-none focus:border-secondary transition-colors font-sans text-sm text-black"
                                    value={createForm.experience_years}
                                    onChange={(e) => setCreateForm({ ...createForm, experience_years: parseInt(e.target.value) || 1 })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Status</label>
                                <select
                                    className="w-full border border-border p-3 rounded-sm outline-none focus:border-secondary transition-colors font-sans text-sm text-black bg-white"
                                    value={createForm.status}
                                    onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
                                >
                                    <option value="approved">Approved (Visible in Directory)</option>
                                    <option value="pending">Pending</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Practice Areas</label>
                            <div className="flex flex-wrap gap-3 p-4 border border-border rounded-sm bg-gray-50/50">
                                {STANDARD_PRACTICE_AREAS.map(area => (
                                    <label key={area} className="flex items-center space-x-2 text-xs font-sans font-bold uppercase text-black cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={createForm.practice_areas.includes(area)}
                                            onChange={() => handleCreatePracticeAreaToggle(area)}
                                            className="rounded border-gray-300 text-secondary focus:ring-secondary"
                                        />
                                        <span>{area}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Professional Bio / Message</label>
                            <textarea
                                rows={5}
                                className="w-full border border-border p-3 rounded-sm outline-none focus:border-secondary transition-colors font-sans text-sm text-black"
                                value={createForm.message}
                                onChange={(e) => setCreateForm({ ...createForm, message: e.target.value })}
                            />
                        </div>

                        <div className="flex space-x-4 pt-4">
                            <button
                                onClick={createMember}
                                disabled={actionLoading}
                                className="px-8 py-3 bg-secondary text-white rounded-sm font-sans text-xs font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center shadow-lg disabled:opacity-50"
                            >
                                {actionLoading ? <Loader2 size={14} className="animate-spin mr-2" /> : <Save size={14} className="mr-2" />}
                                Create & Save
                            </button>
                            <button
                                onClick={() => setShowCreateForm(false)}
                                className="px-8 py-3 bg-gray-100 text-black border border-border rounded-sm font-sans text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : selectedApp ? (
                    // Detail View / Edit View
                    <>
                        <div className="p-10 border-b border-border space-y-8 bg-white sticky top-0 z-10 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center space-x-6">
                                    <div className="relative group">
                                        <div 
                                            onClick={() => !isEditing && fileInputRef.current?.click()}
                                            className={`h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-border text-muted cursor-pointer hover:border-secondary transition-all overflow-hidden relative ${isEditing && 'opacity-50 cursor-not-allowed'}`}
                                        >
                                            {selectedApp.profile_image_url ? (
                                                <>
                                                    <img src={selectedApp.profile_image_url} className="w-full h-full object-cover" alt="" />
                                                    {!isEditing && (
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                            <Camera size={20} className="text-white" />
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    {uploading ? <Loader2 className="animate-spin text-muted" size={20} /> : <Camera size={20} className="text-muted group-hover:text-secondary" />}
                                                </>
                                            )}
                                        </div>
                                        <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} disabled={isEditing} />
                                    </div>
                                    <div className="space-y-2">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="font-serif text-3xl font-black italic border-b border-secondary outline-none text-black bg-transparent py-1 w-full max-w-md"
                                                value={editForm.full_name}
                                                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                                            />
                                        ) : (
                                            <h2 className="font-serif text-3xl font-black italic text-black">{selectedApp.full_name}</h2>
                                        )}
                                        <div className="flex flex-wrap gap-6">
                                            <div className="flex items-center text-xs font-sans font-bold uppercase tracking-widest text-muted">
                                                <Mail size={14} className="mr-2 text-secondary" /> 
                                                {isEditing ? (
                                                    <input
                                                        type="email"
                                                        className="border-b border-border outline-none text-black font-sans text-xs bg-transparent py-0.5 ml-1"
                                                        value={editForm.email}
                                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                                    />
                                                ) : (
                                                    selectedApp.email
                                                )}
                                            </div>
                                            <div className="flex items-center text-xs font-sans font-bold uppercase tracking-widest text-muted">
                                                <Briefcase size={14} className="mr-2 text-secondary" />
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        className="border-b border-border outline-none text-black font-sans text-xs bg-transparent py-0.5 ml-1"
                                                        value={editForm.firm_name}
                                                        onChange={(e) => setEditForm({ ...editForm, firm_name: e.target.value })}
                                                    />
                                                ) : (
                                                    selectedApp.firm_name || "N/A"
                                                )}
                                            </div>
                                            <div className="flex items-center text-xs font-sans font-bold uppercase tracking-widest text-muted">
                                                <Calendar size={14} className="mr-2 text-secondary" /> {new Date(selectedApp.created_at).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 shrink-0">
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={saveApplicationEdits}
                                                disabled={actionLoading}
                                                className="px-4 py-2 bg-secondary text-white border border-secondary rounded-sm font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:border-black transition-all flex items-center shadow-md disabled:opacity-50"
                                            >
                                                <Save size={12} className="mr-2" /> Save Changes
                                            </button>
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="px-4 py-2 bg-gray-100 text-black border border-border rounded-sm font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center"
                                            >
                                                <X size={12} className="mr-2" /> Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={startEditing}
                                                className="px-4 py-2 bg-white text-black border border-border rounded-sm font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center"
                                            >
                                                <Edit size={12} className="mr-2" /> Edit Profile
                                            </button>
                                            <button
                                                onClick={() => deleteApplication(selectedApp.id)}
                                                disabled={actionLoading}
                                                className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-sm font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-red-100 transition-all flex items-center"
                                            >
                                                <Trash2 size={12} className="mr-2" /> Delete
                                            </button>
                                            {selectedApp.status !== 'approved' && (
                                                <button
                                                    onClick={() => updateStatus(selectedApp.id, 'approved')}
                                                    disabled={actionLoading}
                                                    className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-sm font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-100 transition-all flex items-center shadow-md"
                                                >
                                                    <CheckCircle2 size={12} className="mr-2" /> Approve
                                                </button>
                                            )}
                                            {selectedApp.status === 'approved' && (
                                                <button
                                                    onClick={() => updateStatus(selectedApp.id, 'rejected')}
                                                    disabled={actionLoading}
                                                    className="px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-sm font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-amber-100 transition-all flex items-center"
                                                >
                                                    <XCircle size={12} className="mr-2" /> Reject
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-10 flex-grow bg-gray-50/50">
                            <div className="grid lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-8">
                                    {/* Message / Bio */}
                                    <div className="bg-white p-12 border border-border shadow-sm rounded-sm space-y-8">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-4 italic">Professional Statement</p>
                                            {isEditing ? (
                                                <textarea
                                                    rows={8}
                                                    className="w-full border border-border p-3 rounded-sm outline-none focus:border-secondary transition-colors font-sans text-sm text-black bg-transparent"
                                                    value={editForm.message}
                                                    onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                                                />
                                            ) : (
                                                <p className="text-black font-sans leading-relaxed whitespace-pre-wrap">
                                                    {selectedApp.message || "No statement provided."}
                                                </p>
                                            )}
                                        </div>
                                        {!isEditing && (
                                            <div className="pt-8 border-t border-border">
                                                <a
                                                    href={`mailto:${selectedApp.email}?subject=Pan Afric Law Network Application Update`}
                                                    className="bg-black text-white px-10 py-4 rounded-sm font-sans font-bold uppercase tracking-widest text-xs hover:bg-secondary hover:text-white transition-all inline-flex items-center space-x-3 shadow-xl"
                                                >
                                                    <Mail size={14} />
                                                    <span>Send Official Update</span>
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    {/* Sidebar Information Card */}
                                    <div className="bg-white p-8 border border-border shadow-sm rounded-sm space-y-6">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted italic">Professional Profile</p>

                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Experience</p>
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        className="w-24 border border-border p-2 rounded-sm outline-none focus:border-secondary font-sans text-sm text-black"
                                                        value={editForm.experience_years}
                                                        onChange={(e) => setEditForm({ ...editForm, experience_years: parseInt(e.target.value) || 1 })}
                                                    />
                                                ) : (
                                                    <p className="text-sm font-serif font-bold italic text-black">{selectedApp.experience_years} Years</p>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Location</p>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        className="w-full border border-border p-2 rounded-sm outline-none focus:border-secondary font-sans text-sm text-black"
                                                        value={editForm.location}
                                                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                                    />
                                                ) : (
                                                    <p className="text-sm font-sans flex items-center text-black">
                                                        <MapPin size={12} className="mr-2 text-secondary shrink-0" /> {selectedApp.location}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Practice Areas</p>
                                                {isEditing ? (
                                                    <div className="flex flex-col space-y-2 p-3 border border-border rounded-sm bg-gray-50/50">
                                                        {STANDARD_PRACTICE_AREAS.map(area => (
                                                            <label key={area} className="flex items-center space-x-2 text-xs font-sans text-black cursor-pointer font-bold uppercase">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={editForm.practice_areas.includes(area)}
                                                                    onChange={() => handleEditPracticeAreaToggle(area)}
                                                                    className="rounded border-gray-300 text-secondary focus:ring-secondary"
                                                                />
                                                                <span>{area}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedApp.practice_areas?.map((area: string) => (
                                                            <span key={area} className="bg-secondary/10 text-secondary px-2 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-widest">
                                                                {area}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    // Placeholder when no app selected and showCreateForm is false
                    <div className="flex-grow flex flex-col items-center justify-center space-y-6 opacity-30 py-20">
                        <Users size={80} className="text-muted" />
                        <p className="font-serif text-2xl italic text-black">Select an application to review details</p>
                        <button
                            onClick={() => { setShowCreateForm(true); setSelectedApp(null); setIsEditing(false); }}
                            className="bg-secondary text-white px-8 py-3 rounded-sm font-sans font-bold uppercase tracking-widest text-xs hover:bg-black transition-all flex items-center space-x-2 shadow-lg"
                        >
                            <Plus size={16} />
                            <span>Create Member Profile</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
