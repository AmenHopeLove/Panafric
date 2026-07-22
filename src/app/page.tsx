"use client";

import Link from "next/link";
import { ArrowRight, Gavel, Users, Shield, BookOpen, Globe, Calendar } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";

export default function Home() {
  const { t, config } = useLanguage();
  
  const homeBanner = config?.HOME_HERO_BANNER || config?.home_hero_banner;
  const bannerUrl = homeBanner?.image_url || "";
  const overlayOpacity = parseFloat(homeBanner?.overlay_opacity || "0.6");

  const homeVideo = config?.HOME_VIDEO_URL || config?.home_video_url;
  const videoUrl = homeVideo?.url || "";
  const videoTitle = homeVideo?.title || "Watch Our Story: Legal Excellence Across Africa";

  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  
  const youtubeId = getYouTubeId(videoUrl);

  return (
    <div className="flex flex-col">
      {/* Hero Section - Gilded Noir Luxury */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-primary text-white">
        {/* Luxury Background FX */}
        <div className="absolute inset-0 z-0">
          {bannerUrl ? (
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-1000" 
              style={{ backgroundImage: `url(${bannerUrl})` }}
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(194,65,12,0.15),_transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,_rgba(255,255,255,0.02),_transparent_50%)]" />
            </>
          )}

          {/* Dynamic dark overlay to ensure readability */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-black transition-all" 
            style={{ opacity: bannerUrl ? overlayOpacity : 0.8 }} 
          />
          
          {/* Elegant gold dust texture */}
          <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

          {/* Sophisticated geometric overlay */}
          <div className="absolute inset-0 opacity-[0.02]"
            style={{ 
              backgroundImage: 'radial-gradient(#c2410c 1px, transparent 1px)', 
              backgroundSize: '40px 40px' 
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full pt-32">
          <div className="flex flex-col items-start text-left space-y-12 max-w-4xl">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-3 bg-white/5 border border-secondary/20 px-4 py-1.5 rounded-full animate-in fade-in slide-in-from-left-4 duration-700">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span className="font-sans text-secondary font-black uppercase tracking-[0.4em] text-[10px]">
                  {t("heroSubtitle")}
                </span>
              </div>
              <h1 className="font-serif text-6xl md:text-9xl font-black leading-[0.9] tracking-tighter text-white animate-in fade-in slide-in-from-left-6 duration-1000">
                {t("heroTitlePart1")}<br />
                <span className="text-brand">
                  {t("heroTitlePart2")}
                </span>
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-white/60 max-w-2xl leading-relaxed font-sans font-light animate-in fade-in slide-in-from-left-8 duration-1000 delay-200">
              {t("heroDesc")}
            </p>

            <div className="flex flex-wrap justify-start gap-8 pt-6 animate-in fade-in slide-in-from-left-10 duration-1000 delay-300">
              <Link
                href="/join-network"
                className="brand-gradient text-white px-12 py-5 rounded-full font-sans font-black uppercase tracking-[0.2em] text-xs hover:scale-105 active:scale-95 transition-all flex items-center group shadow-brand"
              >
                {t("joinNetwork")}
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="bg-white/5 hover:bg-white/10 text-white border border-white/20 px-12 py-5 rounded-full font-sans font-black uppercase tracking-[0.2em] text-xs transition-all backdrop-blur-sm"
              >
                {t("learnMore")}
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-4 animate-bounce opacity-30">
          <span className="text-[10px] uppercase tracking-[0.5em] font-black">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-secondary to-transparent" />
        </div>
      </section>

      {/* Quote Section - Editorial Presentation */}
      <section className="bg-white py-32 text-center border-y border-border">
        <div className="max-w-4xl mx-auto px-4">
          <Scale className="h-10 w-10 text-secondary/30 mx-auto mb-10" />
          <blockquote className="font-serif text-3xl md:text-5xl font-black text-black leading-tight italic">
            "{t("advancingExcellence")}"
          </blockquote>
          <div className="mt-12 flex justify-center space-x-2">
            <div className="w-2 h-2 rounded-full brand-gradient" />
            <div className="w-8 h-2 rounded-full bg-border" />
            <div className="w-2 h-2 rounded-full bg-border" />
          </div>
        </div>
      </section>

      {/* Trust Counters / Stats - Refined Luxury Grid */}
      <section className="bg-[#fcfcfc] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center text-primary">
            <div className="space-y-4 luxury-card bg-white p-10 rounded-3xl">
              <p className="font-serif text-6xl font-black text-brand">500+</p>
              <p className="font-sans text-[10px] font-black uppercase tracking-[0.3em] text-muted">{t("verifiedPartners")}</p>
            </div>
            <div className="space-y-4 luxury-card bg-white p-10 rounded-3xl">
              <p className="font-serif text-6xl font-black text-brand">15+</p>
              <p className="font-sans text-[10px] font-black uppercase tracking-[0.3em] text-muted">{t("africanMarkets")}</p>
            </div>
            <div className="space-y-4 luxury-card bg-white p-10 rounded-3xl">
              <p className="font-serif text-6xl font-black text-brand">2k+</p>
              <p className="font-sans text-[10px] font-black uppercase tracking-[0.3em] text-muted">{t("insightsPublished")}</p>
            </div>
            <div className="space-y-4 luxury-card bg-white p-10 rounded-3xl">
              <p className="font-serif text-6xl font-black text-brand">24/7</p>
              <p className="font-sans text-[10px] font-black uppercase tracking-[0.3em] text-muted">{t("smartSupport")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section - High-End Presentation */}
      <section className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 mb-32">
            <h2 className="font-sans text-secondary font-black uppercase tracking-[0.5em] text-[10px]">
              {t("howWeOperate")}
            </h2>
            <h3 className="font-serif text-5xl md:text-7xl font-black text-black leading-tight max-w-4xl mx-auto">
              {t("fourPillars")}
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: <Scale className="h-10 w-10" />, title: t("pillar1Title"), desc: t("pillar1Desc") },
              { icon: <Globe className="h-10 w-10" />, title: t("pillar2Title"), desc: t("pillar2Desc") },
              { icon: <Shield className="h-10 w-10" />, title: t("pillar3Title"), desc: t("pillar3Desc") },
              { icon: <BookOpen className="h-10 w-10" />, title: t("pillar4Title"), desc: t("pillar4Desc") }
            ].map((pillar, i) => (
              <div key={i} className="group luxury-card bg-white rounded-[40px] p-12 h-full flex flex-col justify-between hover:bg-primary transition-all duration-700">
                <div className="space-y-8">
                  <div className="brand-gradient p-4 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-500 shadow-brand">
                    <div className="text-white">{pillar.icon}</div>
                  </div>
                  <h4 className="font-serif text-3xl font-black text-black group-hover:text-white transition-colors">{pillar.title}</h4>
                  <p className="text-muted text-base leading-relaxed group-hover:text-white/60 transition-colors font-light font-sans">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      {youtubeId && (
        <section className="py-32 bg-[#fcfcfc] overflow-hidden border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-16 items-center">
              {/* Left Content */}
              <div className="lg:col-span-5 space-y-8">
                <div className="w-16 h-1 brand-gradient rounded-full" />
                <h2 className="font-sans text-secondary font-black uppercase tracking-[0.4em] text-[10px]">
                  Featured Broadcast
                </h2>
                <h3 className="font-serif text-4xl md:text-5xl font-black text-black leading-tight tracking-tight">
                  {videoTitle}
                </h3>
                <p className="text-muted text-lg font-sans font-light leading-relaxed">
                  Discover how our Pan-African network of legal experts leverages local expertise and global standards to advance justice, facilitate trade, and drive progress across the continent.
                </p>
                <div className="flex items-center space-x-6 pt-4">
                  <div className="flex -space-x-4">
                    <div className="w-12 h-12 rounded-full border-2 border-white bg-primary flex items-center justify-center text-white font-serif text-xs font-black shadow-lg">PA</div>
                    <div className="w-12 h-12 rounded-full border-2 border-white bg-secondary flex items-center justify-center text-white font-serif text-xs font-black shadow-lg">LF</div>
                  </div>
                  <div>
                    <p className="font-sans text-[10px] font-black uppercase tracking-widest text-black">Pan Afric Law Firm & Network</p>
                    <p className="font-sans text-[8px] uppercase tracking-widest text-muted">Excellence in Action</p>
                  </div>
                </div>
              </div>

              {/* Right Player Container */}
              <div className="lg:col-span-7">
                <div className="relative group rounded-[40px] overflow-hidden shadow-2xl border-4 border-accent aspect-video bg-black hover:scale-[1.02] transition-transform duration-700">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title={videoTitle}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recent News Section */}
      <HomeNewsSection />

      {/* Visual Section 1 - Addis Ababa Skyline (Luxury Treatment) */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative h-[700px] w-full group overflow-hidden rounded-[50px] shadow-2xl border-4 border-accent">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000"
              alt="Modern Architectural Excellence"
              className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-all duration-[2000ms] opacity-60 grayscale group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent flex items-end p-20">
              <div className="max-w-2xl space-y-6">
                <div className="w-20 h-1 brand-gradient rounded-full" />
                <p className="text-white font-serif text-5xl font-black leading-tight">
                  Rooted in Addis Ababa,<br />
                  <span className="text-secondary opacity-60 italic">scaling across Africa.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Section 2 - Professional Excellence (Ebony & Ivory) */}
      <section className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-32 items-center">
            <div className="space-y-10 order-2 lg:order-1">
              <div className="space-y-4">
                <h3 className="font-serif text-6xl font-black text-black leading-tight">
                  Empowering <br />
                  <span className="text-brand">Ethiopian Success.</span>
                </h3>
              </div>
              <p className="text-xl text-muted font-sans font-light leading-relaxed">
                Our network bridges the gap between local expertise in Addis Ababa and international standards, creating a seamless interface for Ethiopian businesses expanding across Africa and global firms entering the market.
              </p>
              <Link
                href="/network"
                className="inline-flex items-center text-primary font-sans font-black uppercase tracking-[0.3em] text-xs pb-4 border-b-2 border-secondary transition-all hover:pr-8 group"
              >
                Explore the Network
                <ArrowRight className="ml-4 h-5 w-5 text-secondary transition-transform group-hover:translate-x-2" />
              </Link>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="absolute -inset-10 border border-secondary/20 translate-x-4 translate-y-4 rounded-full aspect-square opacity-20 animate-spin-slow"></div>
              <div className="relative h-[650px] w-full rounded-[100px] overflow-hidden shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-1000">
                <img
                  src="/images/ethiopian-collaboration.png"
                  alt="Ethiopian Business Professionals"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-110 hover:scale-100"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function HomeNewsSection() {
  const { t } = useLanguage();
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestNews() {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('published_at', { ascending: false })
          .limit(3);

        if (error) {
          console.error("Error fetching news:", error);
        } else if (data) {
          setNews(data);
        }
      } catch (err) {
        console.error("Failed to load news:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLatestNews();
  }, []);

  if (loading) return null;
  if (news.length === 0) return null;

  return (
    <section className="py-32 bg-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="space-y-6">
            <h2 className="font-sans text-secondary font-bold uppercase tracking-[0.3em] text-xs">
              {t("latestUpdates")}
            </h2>
            <h3 className="font-serif text-5xl md:text-6xl font-black leading-tight">
              {t("newsTitle")}
            </h3>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center space-x-3 text-secondary font-sans font-bold uppercase tracking-widest text-xs border-b border-secondary pb-2 hover:text-white hover:border-white transition-all"
          >
            <span>{t("viewAllNews")}</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {news.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.id}`}
              className="group space-y-8 block"
            >
              <div className="relative h-80 w-full overflow-hidden">
                <img
                  src={item.image_url || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"}
                  alt={item.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 opacity-60 group-hover:opacity-100"
                />
                <div className="absolute top-0 right-0 p-4">
                  <span className="bg-secondary text-white px-3 py-1 text-[10px] uppercase font-bold tracking-widest">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-[10px] font-sans uppercase tracking-[0.2em] text-white/50 group-hover:text-secondary transition-colors">
                  <Calendar size={12} />
                  <span>{new Date(item.published_at).toLocaleDateString()}</span>
                </div>
                <h4 className="font-serif text-2xl font-bold leading-tight group-hover:text-secondary transition-colors line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-white/60 font-sans font-light leading-relaxed line-clamp-3">
                  {item.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const Scale = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path d="M7 21h10" /><path d="M12 3v18" /><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
  </svg>
);
