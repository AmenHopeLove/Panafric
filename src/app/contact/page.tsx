"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Mail, Phone, MapPin, Clock, MessageSquare, ArrowRight, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase-client";

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
            const { error } = await supabase
                .from('consultations')
                .insert([
                    {
                        full_name: formData.full_name,
                        email: formData.email,
                        subject: formData.subject || `Inquiry from ${formData.company || 'Private Individual'}`,
                        message: `Company: ${formData.company || 'N/A'}\nPhone: ${formData.phone || 'N/A'}\n\n${formData.message}`,
                        status: 'pending'
                    }
                ]);

            if (error) throw error;
            setStatus("success");
            setFormData({ full_name: "", email: "", subject: "", message: "", company: "", phone: "" });
        } catch (err: any) {
            console.error("Full Submission Error Object:", err);

            // Supabase errors often have a message property, or it might be a standard Error
            const errorMsg = err.message || (typeof err === 'object' ? JSON.stringify(err) : String(err));

            setStatus("idle");
            alert(`Failed to send message: ${errorMsg}`);

            // If it's a "table not found" error again, we know the SQL hasn't been applied or synced
            if (errorMsg.includes("schema cache") || errorMsg.includes("not found")) {
                console.warn("Possible schema cache issue. Try running: NOTIFY pgrst, 'reload schema'; in Supabase SQL editor.");
            }
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

            {/* Contact Form Section (Visual Replica of User Request) */}
            <section className="py-24 lg:py-40 border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-24 items-start">
                        {/* Text Content */}
                        <div className="space-y-8">
                            <p className="font-sans text-2xl lg:text-3xl text-black leading-relaxed">
                                If you have any questions regarding the <span className="font-bold underline decoration-secondary decoration-4 underline-offset-8">Pan Afric Law Firm & Network</span>, please contact:
                            </p>
                            
                            <div className="pt-8">
                                <a 
                                    href="/contact/start-case" 
                                    className="inline-flex items-center space-x-4 bg-black text-white px-10 py-6 rounded-full hover:bg-secondary transition-all duration-500 group"
                                >
                                    <span className="font-sans font-bold uppercase tracking-widest">Start Your Case Officially</span>
                                    <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                                </a>
                                <p className="mt-4 text-muted font-sans text-sm italic">
                                    Submit case details and upload supporting documentation securely.
                                </p>
                            </div>

                            <p className="text-muted font-sans font-light text-sm italic pt-12">
                                This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
                            </p>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleSubmit} className="space-y-12">
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
                                    type="text"
                                    placeholder="Company / Firm Name"
                                    value={formData.company || ""}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
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
                            <div className="space-y-2">
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={formData.phone || ""}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full bg-transparent border-b border-black/20 focus:border-black py-4 font-sans text-lg placeholder:text-muted focus:outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <textarea
                                    required
                                    rows={1}
                                    placeholder="Comments / Questions *"
                                    value={formData.message || ""}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-transparent border-b border-black/20 focus:border-black py-4 font-sans text-lg placeholder:text-muted focus:outline-none transition-all resize-none"
                                ></textarea>
                            </div>

                            <div className="flex flex-col space-y-8">
                                <p className="text-muted font-sans text-xs">* These fields are required.</p>

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
                                        {status === "idle" && "Send"}
                                        {status === "submitting" && "Sending..."}
                                        {status === "success" && "Sent"}
                                    </span>
                                </button>
                            </div>
                        </form>
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
