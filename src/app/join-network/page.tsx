"use client";

import { useLanguage } from "@/context/LanguageContext";
import {
    Users,
    Briefcase,
    Globe,
    CheckCircle,
    ArrowRight,
    ShieldCheck,
    MapPin,
    Clock,
    Handshake,
    User
} from "lucide-react";
import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase-client";

export default function JoinNetworkPage() {
    const { t } = useLanguage();
    const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        firm_name: "",
        location: "",
        practice_areas: [] as string[],
        experience_years: "",
        message: "",
        password: "",
        confirmPassword: ""
    });

    const [profile_image_url, setProfileImageUrl] = useState("");
    const [uploading, setUploading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [currentPracticeArea, setCurrentPracticeArea] = useState("");

    const addPracticeArea = () => {
        if (currentPracticeArea.trim() && !formData.practice_areas.includes(currentPracticeArea)) {
            setFormData({
                ...formData,
                practice_areas: [...formData.practice_areas, currentPracticeArea.trim()]
            });
            setCurrentPracticeArea("");
        }
    };

    const removePracticeArea = (area: string) => {
        setFormData({
            ...formData,
            practice_areas: formData.practice_areas.filter(a => a !== area)
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(file);
        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `profile-pics/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('network-profiles')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('network-profiles')
                .getPublicUrl(filePath);

            setProfileImageUrl(publicUrl);
        } catch (err: any) {
            console.error("Upload error:", err);
            alert("Failed to upload image.");
            setImageFile(null);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match.");
            setStatus("idle");
            return;
        }

        try {
            // 1. Create Supabase Auth User (Pending)
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.full_name,
                        role: 'client' // New members start as 'client' until approved as 'member'
                    }
                }
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error("Failed to initialize account security.");

            // 2. Dispatch Application via API
            const response = await fetch('/api/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'network',
                    payload: {
                        user_id: authData.user.id,
                        full_name: formData.full_name,
                        email: formData.email,
                        phone: formData.phone,
                        firm_name: formData.firm_name,
                        location: formData.location,
                        practice_areas: formData.practice_areas,
                        experience_years: parseInt(formData.experience_years) || 0,
                        message: formData.message,
                        profile_image_url: profile_image_url,
                        status: 'pending'
                    }
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to submit application');
            }
            setStatus("success");
            // Reset form
            setFormData({
                full_name: "",
                email: "",
                phone: "",
                firm_name: "",
                location: "",
                practice_areas: [],
                experience_years: "",
                message: "",
                password: "",
                confirmPassword: ""
            });
            setProfileImageUrl("");
            setImageFile(null);
        } catch (err: any) {
            console.error("Application error:", err);
            setStatus("idle");
            alert(`Failed to submit application: ${err.message || 'Unknown error'}`);
        }
    };

    return (
        <div className="flex flex-col bg-white">
            {/* Hero Section */}
            <section className="relative py-32 lg:py-48 bg-black overflow-hidden">
                <div className="absolute inset-0 opacity-40">
                    <img
                        src="https://images.unsplash.com/photo-1573164067507-40e1d6a0b7b3?auto=format&fit=crop&q=80&w=2000"
                        alt="Global Network"
                        className="w-full h-full object-cover grayscale"
                    />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h2 className="font-sans text-secondary font-bold uppercase tracking-[0.3em] text-xs mb-6">
                        Expand Your Reach
                    </h2>
                    <h1 className="font-serif text-5xl md:text-8xl font-black text-white leading-tight max-w-5xl mx-auto">
                        Join Our Pan-African <span className="text-secondary">Network</span>
                    </h1>
                </div>
            </section>

            {/* Why Join Section */}
            <section className="py-24 lg:py-40 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        <div className="space-y-12">
                            <h2 className="font-serif text-4xl lg:text-6xl font-black text-black leading-tight italic">
                                Elevate your practice through strategic collaboration.
                            </h2>
                            <div className="space-y-8">
                                <div className="flex items-start space-x-6">
                                    <div className="bg-secondary/10 p-4 rounded-sm text-secondary">
                                        <Globe size={32} />
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-2xl font-bold mb-2">Continental Reach</h3>
                                        <p className="text-muted font-sans font-light leading-relaxed">
                                            Gain access to a vast network of legal professionals across Africa, facilitating cross-border legal services.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-6">
                                    <div className="bg-secondary/10 p-4 rounded-sm text-secondary">
                                        <Handshake size={32} />
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-2xl font-bold mb-2">Strategic Partnerships</h3>
                                        <p className="text-muted font-sans font-light leading-relaxed">
                                            Collaborate with the Pan Afric Law Firm on high-stakes cases and international regulatory matters.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-6">
                                    <div className="bg-secondary/10 p-4 rounded-sm text-secondary">
                                        <Briefcase size={32} />
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-2xl font-bold mb-2">Professional Growth</h3>
                                        <p className="text-muted font-sans font-light leading-relaxed">
                                            Access shared resources, specialized knowledge, and referral programs designed to scale your firm.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Application Form */}
                        <div className="bg-[#fcfcfc] p-12 lg:p-16 border border-border shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 -translate-y-1/2 translate-x-1/2 rounded-full"></div>

                            <h3 className="font-serif text-3xl font-black italic mb-12 border-b border-border pb-6">
                                Network Application
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <input
                                            required
                                            type="text"
                                            placeholder="Full Name *"
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            className="w-full bg-transparent border-b border-black/20 focus:border-black py-4 font-sans text-lg placeholder:text-muted focus:outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <input
                                            required
                                            type="email"
                                            placeholder="Email Address *"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-transparent border-b border-black/20 focus:border-black py-4 font-sans text-lg placeholder:text-muted focus:outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <input
                                            type="tel"
                                            placeholder="Phone Number"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-transparent border-b border-black/20 focus:border-black py-4 font-sans text-lg placeholder:text-muted focus:outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            placeholder="Firm Name (optional)"
                                            value={formData.firm_name}
                                            onChange={(e) => setFormData({ ...formData, firm_name: e.target.value })}
                                            className="w-full bg-transparent border-b border-black/20 focus:border-black py-4 font-sans text-lg placeholder:text-muted focus:outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <input
                                            required
                                            type="text"
                                            placeholder="Location (City, Country) *"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full bg-transparent border-b border-black/20 focus:border-black py-4 font-sans text-lg placeholder:text-muted focus:outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <input
                                            required
                                            type="number"
                                            placeholder="Years of Experience *"
                                            value={formData.experience_years}
                                            onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                                            className="w-full bg-transparent border-b border-black/20 focus:border-black py-4 font-sans text-lg placeholder:text-muted focus:outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Practice Areas Tags */}
                                <div className="space-y-4">
                                    <p className="font-sans font-bold text-xs uppercase tracking-widest text-muted">Practice Areas</p>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.practice_areas.map((area) => (
                                            <span
                                                key={area}
                                                className="bg-secondary/10 text-secondary px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-widest flex items-center"
                                            >
                                                {area}
                                                <button
                                                    type="button"
                                                    onClick={() => removePracticeArea(area)}
                                                    className="ml-2 hover:text-black transition-colors"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            placeholder="e.g. Corporate Law"
                                            value={currentPracticeArea}
                                            onChange={(e) => setCurrentPracticeArea(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPracticeArea())}
                                            className="flex-grow bg-transparent border-b border-black/20 focus:border-black py-2 font-sans text-sm outline-none transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={addPracticeArea}
                                            className="px-4 py-2 border border-black rounded-sm font-sans text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <input
                                            required
                                            type="password"
                                            placeholder="Set Password *"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full bg-transparent border-b border-black/20 focus:border-black py-4 font-sans text-lg placeholder:text-muted focus:outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <input
                                            required
                                            type="password"
                                            placeholder="Confirm Password *"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="w-full bg-transparent border-b border-black/20 focus:border-black py-4 font-sans text-lg placeholder:text-muted focus:outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <textarea
                                        rows={2}
                                        placeholder="Professional Bio / Vision Statement (Optional)"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full bg-transparent border-b border-black/20 focus:border-black py-4 font-sans text-lg placeholder:text-muted focus:outline-none transition-all"
                                    ></textarea>
                                </div>

                                {/* Profile Image Upload */}
                                <div className="space-y-4 pt-4">
                                     <p className="font-sans font-bold text-xs uppercase tracking-widest text-muted">Professional Photo</p>
                                     <div className="flex items-center space-x-8">
                                         <div className="h-24 w-24 rounded-full bg-gray-50 border border-dashed border-border flex items-center justify-center overflow-hidden relative group/img">
                                             {imageFile || profile_image_url ? (
                                                 <img
                                                     src={imageFile ? URL.createObjectURL(imageFile) : profile_image_url}
                                                     className="h-full w-full object-cover"
                                                     alt="Preview"
                                                 />
                                             ) : (
                                                 <User className="text-muted" size={32} />
                                             )}
                                             {uploading && (
                                                 <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                                     <div className="animate-spin rounded-full h-5 w-5 border-2 border-secondary border-t-transparent"></div>
                                                 </div>
                                             )}
                                         </div>
                                         <div className="space-y-2 flex-grow">
                                             <input
                                                 type="file"
                                                 accept="image/*"
                                                 className="hidden"
                                                 ref={fileInputRef}
                                                 onChange={handleImageUpload}
                                             />
                                             <button
                                                 type="button"
                                                 onClick={() => fileInputRef.current?.click()}
                                                 className="px-6 py-2 border border-black font-sans text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105"
                                             >
                                                 {profile_image_url ? "Change Photo" : "Upload Photo"}
                                             </button>
                                             <p className="text-[10px] text-muted font-sans font-light">Recommended: 400x400px Square Image. (Max 2MB)</p>
                                         </div>
                                     </div>
                                 </div>

                                <div className="flex flex-col space-y-8 pt-8">
                                    <button
                                         disabled={status !== "idle" || uploading}
                                         className={`group flex items-center space-x-6 w-full md:w-fit ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
                                     >
                                         <div className={`h-16 w-16 rounded-full border border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-500 ${status === "success" ? "bg-green-600 border-green-600 text-white" : ""}`}>
                                             {(status === "idle" && !uploading) && <ArrowRight className="group-hover:translate-x-1 transition-transform" />}
                                             {(status === "submitting" || uploading) && <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>}
                                             {status === "success" && <ShieldCheck size={24} />}
                                         </div>
                                         <span className="font-sans font-bold text-2xl uppercase tracking-widest text-black">
                                             {(status === "idle" && !uploading) && "Submit Application"}
                                             {status === "submitting" && "Submitting..."}
                                             {uploading && "Uploading Image..."}
                                             {status === "success" && "Application Sent"}
                                         </span>
                                     </button>

                                    {status === "success" && (
                                        <p className="text-emerald-700 font-sans text-sm italic py-4 border-t border-emerald-100 flex items-center">
                                            <CheckCircle className="mr-2" size={16} /> Thank you. Your application is under review by our executive committee.
                                        </p>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Support Message */}
            <section className="py-24 bg-primary/5 text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <Users className="h-16 w-16 text-secondary mx-auto mb-8" />
                    <h3 className="font-serif text-3xl font-black italic mb-6">Need assistance with your application?</h3>
                    <p className="text-muted font-sans font-light text-lg max-w-2xl mx-auto mb-12">
                        Our network management team is here to help you navigate the process and answer any questions regarding membership tiers.
                    </p>
                    <a href="mailto:network@panafriclawfirm.com" className="font-sans font-bold text-black border-b-2 border-secondary pb-1 hover:text-secondary transition-all">
                        network@panafriclawfirm.com
                    </a>
                </div>
            </section>
        </div>
    );
}
