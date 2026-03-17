"use client";

import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag, Facebook, Twitter, Linkedin, ArrowRight } from "lucide-react";

export default function NewsDetailClient({ article }: { article: any }) {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col bg-white">
            {/* Hero Header */}
            <section className="relative pt-32 pb-20 bg-primary overflow-hidden">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Link
                        href="/news"
                        className="inline-flex items-center text-primary-foreground/60 hover:text-secondary transition-colors font-sans text-xs uppercase tracking-[0.2em] font-bold mb-12 group"
                    >
                        <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        {t("backToNews")}
                    </Link>
                    <div className="space-y-8">
                        <span className="inline-block px-4 py-1 border border-secondary text-secondary font-sans text-[10px] uppercase font-bold tracking-[0.2em]">
                            {article.category}
                        </span>
                        <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-[1.1]">
                            {article.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-8 pt-4">
                            <div className="flex items-center space-x-3 text-primary-foreground/50 text-[10px] font-sans uppercase tracking-widest font-bold">
                                <Calendar size={14} className="text-secondary" />
                                <span>{article.date}</span>
                            </div>
                            <div className="flex items-center space-x-3 text-primary-foreground/50 text-[10px] font-sans uppercase tracking-widest font-bold">
                                <User size={14} className="text-secondary" />
                                <span>{article.author || "Pan Afric Editorial"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <article className="py-24 lg:py-40">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative w-full h-[600px] mb-20 overflow-hidden shadow-2xl">
                        <img
                            src={article.image_url || article.image}
                            alt={article.title}
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                        />
                    </div>

                    <div className="grid lg:grid-cols-12 gap-20">
                        {/* Sidebar */}
                        <aside className="lg:col-span-3 space-y-12 order-2 lg:order-1">
                            <div className="space-y-6 pt-4 border-t border-border">
                                <h5 className="font-sans text-xs font-bold uppercase tracking-widest text-black">Share Insight</h5>
                                <div className="flex space-x-4">
                                    <button className="h-10 w-10 border border-border flex items-center justify-center hover:bg-black hover:text-white transition-all">
                                        <Twitter size={16} />
                                    </button>
                                    <button className="h-10 w-10 border border-border flex items-center justify-center hover:bg-black hover:text-white transition-all">
                                        <Linkedin size={16} />
                                    </button>
                                    <button className="h-10 w-10 border border-border flex items-center justify-center hover:bg-black hover:text-white transition-all">
                                        <Facebook size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-6 pt-4 border-t border-border">
                                <h5 className="font-sans text-xs font-bold uppercase tracking-widest text-black">Category</h5>
                                <div className="flex items-center space-x-2 text-secondary font-sans text-xs font-bold">
                                    <Tag size={14} />
                                    <span>{article.category}</span>
                                </div>
                            </div>
                        </aside>

                        {/* Main Body */}
                        <div className="lg:col-span-9 order-1 lg:order-2">
                            <div className="prose prose-xl max-w-none prose-p:text-muted prose-p:font-sans prose-p:font-light prose-p:leading-[1.8] prose-h3:font-serif prose-h3:text-black space-y-8">
                                {article.content.split('\n').map((paragraph: string, i: number) => (
                                    <p key={i}>{paragraph}</p>
                                ))}
                            </div>

                            {/* Author Box */}
                            <div className="mt-24 p-12 bg-primary/5 border-l-4 border-secondary space-y-4">
                                <p className="font-serif text-2xl font-bold text-black italic">
                                    "Advancing African legal excellence through proximity and technology."
                                </p>
                                <p className="font-sans text-xs font-bold uppercase tracking-widest text-muted">
                                    Pan Afric Law Firm & Network
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </article>

            {/* Footer Navigation */}
            <section className="py-20 bg-black text-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <Link
                        href="/news"
                        className="inline-flex items-center text-sm font-sans font-bold uppercase tracking-widest hover:text-secondary group transition-all"
                    >
                        <ArrowLeft size={18} className="mr-3 group-hover:-translate-x-1 transition-transform" />
                        All News
                    </Link>
                    <div className="hidden md:block h-px bg-white/20 flex-1 mx-12"></div>
                    <Link
                        href="/contact"
                        className="inline-flex items-center text-sm font-sans font-bold uppercase tracking-widest hover:text-secondary group transition-all"
                    >
                        Talk to an Expert
                        <ArrowRight size={18} className="ml-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
