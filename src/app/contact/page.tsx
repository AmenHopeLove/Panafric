"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Mail, Phone, MapPin, Clock, MessageSquare, ArrowRight, ShieldCheck, User, Lock, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export default function ContactPage() {
    const { t } = useLanguage();
    const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        subject: "",
        message: "",
        company: "",
        phone: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: formData.full_name,
                    email: formData.email,
                    subject: formData.subject || `Inquiry from ${formData.company || 'Private Individual'}`,
                    message: `Company: ${formData.company || 'N/A'}\nPhone: ${formData.phone || 'N/A'}\n\n${formData.message}`
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to submit request');
            }

            setStatus("success");
            setFormData({ full_name: "", email: "", subject: "", message: "", company: "", phone: "" });
        } catch (err: any) {
            console.error("Submission Error:", err);
            setStatus("idle");
            alert(`Failed to send message: ${err.message || 'Unknown error'}`);
        }
    };

    return (
        <div className="flex flex-col bg-white">
            {/* Hero Section */}
            <section className="relative py-32 lg:py-48 bg-black overflow-hidden">
                <div className="absolute inset-0 opacity-40">
                    <img
                        src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=2000"
                        alt="Modern Office Space"
                        className="w-full h-full object-cover grayscale"
                    />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h2 className="font-sans text-secondary font-bold uppercase tracking-[0.3em] text-xs mb-6">
                        {t("contactSubtitle")}
                    </h2>
                    <h1 className="font-serif text-5xl md:text-8xl font-black text-white leading-tight max-w-5xl mx-auto">
                        {t("contactTitle")}
                    </h1>
                </div>
            </section>

            {/* Contact Form & Auth Section */}
            <section className="py-24 lg:py-40 border-b border-border bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-32 items-start">
                        {/* Standard Contact Form */}
                        <div className="space-y-16 animate-in fade-in slide-in-from-left-10 duration-1000">
                             <div className="space-y-6">
                                <h3 className="font-serif text-4xl font-black italic">Inquiry Center</h3>
                                <p className="text-muted font-sans font-light text-lg">
                                    Our executive team is available for strategic consultations and general inquiries.
                                </p>
                             </div>

                             <form onSubmit={handleSubmit} className="space-y-10 group">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <input
                                            required
                                            type="text"
                                            placeholder="Your Name *"
                                            value={formData.full_name || ""}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            className="w-full bg-transparent border-b border-black/20 focus:border-black py-4 font-sans text-lg placeholder:text-muted focus:outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <input
                                            required
                                            type="email"
                                            placeholder="Email Address *"
                                            value={formData.email || ""}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-transparent border-b border-black/20 focus:border-black py-4 font-sans text-lg placeholder:text-muted focus:outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <textarea
                                        required
                                        rows={1}
                                        placeholder="How can we assist you? *"
                                        value={formData.message || ""}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full bg-transparent border-b border-black/20 focus:border-black py-4 font-sans text-lg placeholder:text-muted focus:outline-none transition-all resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    disabled={status !== "idle"}
                                    className="group flex items-center space-x-6 w-fit"
                                >
                                    <div className={`h-16 w-16 rounded-full border border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-500 ${status === "success" ? "bg-green-600 border-green-600 text-white" : ""}`}>
                                        {status === "idle" && <ArrowRight className="group-hover:translate-x-1 transition-transform" />}
                                        {status === "submitting" && <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>}
                                        {status === "success" && <ShieldCheck size={24} />}
                                    </div>
                                    <span className="font-sans font-bold text-2xl uppercase tracking-widest text-black">
                                        {status === "idle" && "Send Inquiry"}
                                        {status === "submitting" && "Sending..."}
                                        {status === "success" && "Sent"}
                                    </span>
                                </button>
                             </form>

                             <div className="pt-12 border-t border-border mt-20">
                                <p className="font-sans text-sm text-black mb-6 flex items-center uppercase tracking-[0.2em] font-bold">
                                    <ShieldCheck className="mr-3 text-secondary" size={18} />
                                    Secure Case Intake
                                </p>
                                <a 
                                    href="/contact/start-case" 
                                    className="inline-flex items-center space-x-4 bg-black text-white px-10 py-6 rounded-full hover:bg-secondary transition-all duration-500 group shadow-xl"
                                >
                                    <span className="font-sans font-bold uppercase tracking-widest text-xs">Start Your Official Case</span>
                                    <ArrowRight className="group-hover:translate-x-2 transition-transform" size={16} />
                                </a>
                             </div>
                        </div>

                        {/* Integrated Portal Authentication */}
                        <div className="bg-[#fcfcfc] p-12 lg:p-20 border border-border shadow-[0_50px_100px_rgba(0,0,0,0.05)] relative overflow-hidden animate-in fade-in slide-in-from-right-10 duration-1000">
                             <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 -translate-y-1/2 translate-x-1/2 rounded-full"></div>
                             
                             <div className="relative z-10 space-y-12">
                                <div className="space-y-4">
                                    <h3 className="font-serif text-5xl font-black italic">Portal Access</h3>
                                    <p className="text-muted font-sans font-light text-lg">
                                        Members and Clients may access their secure environments below.
                                    </p>
                                </div>

                                <AuthBox />
                             </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Address & Hours Grid */}
            <section className="py-24 lg:py-40 bg-primary/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-px bg-border border border-border">
                        <div className="bg-white p-16 space-y-8">
                            <MapPin className="h-12 w-12 text-secondary" />
                            <div className="space-y-4">
                                <h3 className="font-serif text-3xl font-bold text-black border-l-4 border-secondary pl-6">
                                    {t("addressTitle")}
                                </h3>
                                <p className="text-muted font-sans font-light leading-relaxed">
                                    {t("addressDetail")}<br />
                                    Kirkos Subcity, Lideta
                                </p>
                            </div>
                        </div>

                        <div className="bg-white p-16 space-y-8">
                            <Clock className="h-12 w-12 text-secondary" />
                            <div className="space-y-4">
                                <h3 className="font-serif text-3xl font-bold text-black border-l-4 border-secondary pl-6">
                                    {t("officeHours")}
                                </h3>
                                <p className="text-muted font-sans font-light leading-relaxed">
                                    Mon - Fri: 08:30 - 18:00<br />
                                    Sat: 09:00 - 13:00 (By Appointment)
                                </p>
                            </div>
                        </div>

                        <div className="bg-white p-16 space-y-8">
                            <MessageSquare className="h-12 w-12 text-secondary" />
                            <div className="space-y-4">
                                <h3 className="font-serif text-3xl font-bold text-black border-l-4 border-secondary pl-6">
                                    {t("digitalSupport")}
                                </h3>
                                <div className="space-y-2">
                                    <p className="text-muted font-sans font-light">info@panafriclawfirm.com</p>
                                    <p className="text-muted font-sans font-light">+(251) 911-420-248</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function AuthBox() {
    const router = useRouter();
    const [mode, setMode] = useState<"signin" | "signup">("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState<"client" | "member">("client");

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (mode === "signin") {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                
                // Fetch profile to determine role and redirect
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', data.user.id)
                    .single();

                if (profile?.role === 'member') {
                    router.push('/member');
                } else {
                    router.push('/client');
                }
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            role: role
                        }
                    }
                });
                if (error) throw error;
                alert("Account created! Please check your email for verification.");
            }
        } catch (err: any) {
            console.error("Auth error:", err);
            alert(err.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex border-b border-border">
                <button 
                    onClick={() => setMode("signin")}
                    className={`flex-1 py-4 font-sans font-bold uppercase tracking-widest text-xs transition-all ${mode === "signin" ? "text-secondary border-b-2 border-secondary" : "text-muted hover:text-black"}`}
                >
                    Sign In
                </button>
                <button 
                    onClick={() => setMode("signup")}
                    className={`flex-1 py-4 font-sans font-bold uppercase tracking-widest text-xs transition-all ${mode === "signup" ? "text-secondary border-b-2 border-secondary" : "text-muted hover:text-black"}`}
                >
                    Create Account
                </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
                {mode === "signup" && (
                    <div className="space-y-2 relative group">
                        <User className="absolute left-0 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-black transition-colors" size={18} />
                        <input
                            required
                            type="text"
                            placeholder="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-transparent border-b border-black/10 focus:border-black py-4 pl-8 font-sans text-lg focus:outline-none transition-all"
                        />
                    </div>
                )}
                <div className="space-y-2 relative group">
                    <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-black transition-colors" size={18} />
                    <input
                        required
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-transparent border-b border-black/10 focus:border-black py-4 pl-8 font-sans text-lg focus:outline-none transition-all"
                    />
                </div>
                <div className="space-y-2 relative group">
                    <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-black transition-colors" size={18} />
                    <input
                        required
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-transparent border-b border-black/10 focus:border-black py-4 pl-8 pr-12 font-sans text-lg focus:outline-none transition-all"
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-muted hover:text-black transition-colors"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                {mode === "signup" && (
                    <div className="space-y-4">
                        <p className="font-sans font-bold text-[10px] uppercase tracking-widest text-muted">Join as:</p>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setRole("client")}
                                className={`flex-1 py-3 px-4 rounded-sm border font-sans font-bold uppercase tracking-widest text-[10px] transition-all ${role === "client" ? "bg-black text-white border-black" : "bg-transparent text-muted border-border hover:border-black"}`}
                            >
                                Client
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole("member")}
                                className={`flex-1 py-3 px-4 rounded-sm border font-sans font-bold uppercase tracking-widest text-[10px] transition-all ${role === "member" ? "bg-black text-white border-black" : "bg-transparent text-muted border-border hover:border-black"}`}
                            >
                                prospective Member
                            </button>
                        </div>
                    </div>
                )}

                <button
                    disabled={loading}
                    className="w-full bg-black text-white py-6 rounded-sm font-sans font-bold uppercase tracking-widest text-xs hover:bg-secondary transition-all duration-500 shadow-xl flex items-center justify-center space-x-4"
                >
                    {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    ) : (
                        <>
                            <span>{mode === "signin" ? "Sign In to Portal" : "Initialize Account"}</span>
                            <ArrowRight size={16} />
                        </>
                    )}
                </button>
                
                {mode === "signin" && (
                    <button type="button" className="w-full text-center font-sans text-xs text-muted hover:text-secondary transition-colors italic">
                        Forgot your credentials?
                    </button>
                )}
            </form>
        </div>
    );
}
