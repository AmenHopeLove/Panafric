"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Scale, Globe, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { language, setLanguage, t } = useLanguage();

    const NAV_LINKS = [
        { name: t("home"), href: "/" },
        { name: t("about"), href: "/about" },
        { name: t("practiceAreas"), href: "/practice-areas" },
        { name: t("insights"), href: "/insights" },
        { name: t("news"), href: "/news" },
        { name: t("network"), href: "/network" },
        { name: t("careers"), href: "/careers" },
        { name: "AI Assistant", href: "/ai-assistant" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <nav className="fixed w-full z-50 p-6 flex justify-center pointer-events-none">
            <div className="max-w-7xl w-full luxury-glass rounded-full px-8 shadow-2xl pointer-events-auto border-secondary/20">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="bg-primary p-1.5 rounded-full group-hover:scale-110 transition-transform duration-500">
                            <Scale className="h-5 w-5 text-secondary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-serif text-lg font-black leading-none tracking-tight text-primary">
                                PAN AFRIC
                            </span>
                            <span className="font-sans text-[8px] uppercase tracking-[0.3em] text-secondary font-bold">
                                Law Firm & Network
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-6">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="font-sans text-[11px] font-bold text-muted hover:text-secondary transition-all uppercase tracking-widest relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        ))}

                        {/* Language Switcher */}
                        <div className="flex items-center border-l border-border/50 pl-6 space-x-3">
                            <button
                                onClick={() => setLanguage("en")}
                                className={`text-[10px] font-black font-sans transition-colors ${language === "en" ? "text-secondary" : "text-muted hover:text-primary"}`}
                            >
                                EN
                            </button>
                            <span className="text-border/30 text-[10px]">|</span>
                            <button
                                onClick={() => setLanguage("am")}
                                className={`text-[10px] font-black font-sans transition-colors ${language === "am" ? "text-secondary" : "text-muted hover:text-primary"}`}
                            >
                                AM
                            </button>
                        </div>

                        <Link
                            href="/consultation"
                            className="brand-gradient text-white px-6 py-2 rounded-full font-sans text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-brand"
                        >
                            {t("consultation")}
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="shadow-luxury p-2 rounded-full bg-white border border-border"
                        >
                            {isOpen ? <X className="h-5 w-5 text-primary" /> : <Menu className="h-5 w-5 text-primary" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="absolute top-24 left-6 right-6 md:hidden bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-secondary/20 animate-in fade-in zoom-in duration-300 pointer-events-auto">
                    <div className="p-6 space-y-4">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="block px-4 py-3 font-sans text-xs font-bold text-muted hover:text-secondary hover:bg-secondary/5 rounded-lg transition-colors border-b border-border/10 last:border-0"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Mobile Language Switcher */}
                        <div className="flex justify-between px-4 py-4 bg-accent/30 rounded-xl">
                            <button onClick={() => setLanguage("en")} className={`text-xs font-black ${language === "en" ? "text-secondary" : "text-muted"}`}>ENGLISH</button>
                            <button onClick={() => setLanguage("am")} className={`text-xs font-black ${language === "am" ? "text-secondary" : "text-muted"}`}>አማርኛ</button>
                        </div>

                        <Link
                            href="/consultation"
                            className="block py-4 text-center brand-gradient text-white rounded-full text-xs font-black uppercase tracking-widest shadow-brand"
                            onClick={() => setIsOpen(false)}
                        >
                            {t("bookConsultation")}
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
