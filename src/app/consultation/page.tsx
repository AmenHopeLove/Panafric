"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Mail, Phone, MapPin, Send, ShieldCheck, Clock } from "lucide-react";
import { useState } from "react";

export default function ConsultationPage() {
    const { t } = useLanguage();
    const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");

        const formData = new FormData(e.target as HTMLFormElement);
        const data = {
            full_name: formData.get("name"),
            email: formData.get("email"),
            subject: formData.get("subject"),
            message: formData.get("message"),
        };

        try {
            const { supabase } = await import("@/lib/supabase-client");
            const { error } = await supabase
                .from("consultations")
                .insert([data]);

            if (error) throw error;
            setStatus("success");
        } catch (error) {
            console.error("Error submitting consultation:", error);
            alert("Failed to submit inquiry. Please try again or contact us directly.");
            setStatus("idle");
        }
    };

    return (
        <div className="flex flex-col bg-white">
            {/* Hero Section */}
            <section className="relative py-32 lg:py-48 bg-black overflow-hidden">
                <div className="absolute inset-0 opacity-40">
                    <img
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"
                        alt="Modern Professional Office"
                        className="w-full h-full object-cover grayscale"
                    />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h2 className="font-sans text-secondary font-bold uppercase tracking-[0.3em] text-xs mb-6">
                        {t("consultationSubtitle")}
                    </h2>
                    <h1 className="font-serif text-5xl md:text-8xl font-black text-white leading-tight max-w-5xl mx-auto">
                        {t("consultationTitle")}
                    </h1>
                </div>
            </section>

            {/* Main Content: Form & Info */}
            <section className="py-24 lg:py-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-32">
                        {/* Contact Form */}
                        <div className="space-y-16">
                            <div className="space-y-6">
                                <h3 className="font-serif text-4xl font-bold text-black border-l-8 border-secondary pl-8">
                                    Send an Inquiry
                                </h3>
                                <p className="text-xl text-muted font-sans font-light leading-relaxed">
                                    Our legal team will review your request and contact you within 24 hours to schedule a detailed session.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="font-sans text-xs font-bold uppercase tracking-widest text-muted">{t("formName")}</label>
                                        <input
                                            required
                                            name="name"
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full bg-primary/5 border-b-2 border-border focus:border-secondary px-0 py-4 font-sans text-black focus:outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="font-sans text-xs font-bold uppercase tracking-widest text-muted">{t("formEmail")}</label>
                                        <input
                                            required
                                            name="email"
                                            type="email"
                                            placeholder="john@example.com"
                                            className="w-full bg-primary/5 border-b-2 border-border focus:border-secondary px-0 py-4 font-sans text-black focus:outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="font-sans text-xs font-bold uppercase tracking-widest text-muted">{t("formSubject")}</label>
                                    <input
                                        required
                                        name="subject"
                                        type="text"
                                        placeholder="Corporate Advisory / Trade Compliance"
                                        className="w-full bg-primary/5 border-b-2 border-border focus:border-secondary px-0 py-4 font-sans text-black focus:outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="font-sans text-xs font-bold uppercase tracking-widest text-muted">{t("formMessage")}</label>
                                    <textarea
                                        required
                                        name="message"
                                        rows={6}
                                        placeholder="Please provide a brief overview of your legal requirements..."
                                        className="w-full bg-primary/5 border-b-2 border-border focus:border-secondary px-0 py-4 font-sans text-black focus:outline-none transition-all resize-none"
                                    ></textarea>
                                </div>
                                <button
                                    disabled={status !== "idle"}
                                    className={`w-full py-6 font-sans font-bold uppercase tracking-[0.2em] text-sm transition-all flex items-center justify-center space-x-3 ${status === "success"
                                        ? "bg-green-600 text-white"
                                        : "bg-black text-white hover:bg-secondary"
                                        }`}
                                >
                                    {status === "idle" && (
                                        <>
                                            <span>{t("submitInquiry")}</span>
                                            <Send size={16} />
                                        </>
                                    )}
                                    {status === "submitting" && <span>Processing...</span>}
                                    {status === "success" && (
                                        <>
                                            <ShieldCheck size={20} />
                                            <span>Sent Successfully</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Contact Information & Image */}
                        <div className="space-y-16">
                            <div className="relative h-[500px] overflow-hidden group">
                                <img
                                    src="https://images.unsplash.com/photo-1507679799987-c7377f323b51?auto=format&fit=crop&q=80&w=2000"
                                    alt="Professional Legal Consultation"
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                                />
                                <div className="absolute inset-0 bg-secondary/10 group-hover:bg-transparent transition-all"></div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3 text-secondary">
                                        <MapPin size={20} />
                                        <h4 className="font-sans text-sm font-bold uppercase tracking-widest text-black underline decoration-secondary decoration-2 underline-offset-8">
                                            {t("addressTitle")}
                                        </h4>
                                    </div>
                                    <p className="font-sans text-muted leading-relaxed pl-8">
                                        {t("addressDetail")}
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3 text-secondary">
                                        <Clock size={20} />
                                        <h4 className="font-sans text-sm font-bold uppercase tracking-widest text-black underline decoration-secondary decoration-2 underline-offset-8">
                                            Availability
                                        </h4>
                                    </div>
                                    <p className="font-sans text-muted leading-relaxed pl-8">
                                        Mon - Fri: 8:30 AM - 6:00 PM<br />
                                        Sat: 9:00 AM - 1:00 PM
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3 text-secondary">
                                        <Phone size={20} />
                                        <h4 className="font-sans text-sm font-bold uppercase tracking-widest text-black underline decoration-secondary decoration-2 underline-offset-8">
                                            {t("phoneTitle")}
                                        </h4>
                                    </div>
                                    <p className="font-sans text-muted leading-relaxed pl-8">
                                        +(251) 911-420-248
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3 text-secondary">
                                        <Mail size={20} />
                                        <h4 className="font-sans text-sm font-bold uppercase tracking-widest text-black underline decoration-secondary decoration-2 underline-offset-8">
                                            {t("emailTitle")}
                                        </h4>
                                    </div>
                                    <p className="font-sans text-muted leading-relaxed pl-8">
                                        info@panafriclawfirm.com
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
