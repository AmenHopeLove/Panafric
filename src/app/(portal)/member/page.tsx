"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { 
  User, 
  MapPin, 
  Briefcase, 
  Settings, 
  ArrowRight, 
  CheckCircle2, 
  Globe,
  MessageSquare,
  Users,
  Clock,
  Video,
  Copy,
  Check
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function MemberDashboard() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const copyMeetingLink = () => {
    const link = `${window.location.origin}/meeting/legal-consultation-${profile?.id?.slice(0, 8)}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('network_applications')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (data) setProfile(data);
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Member Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="w-24 h-1 brand-gradient rounded-full" />
          <h2 className="font-sans text-secondary font-black uppercase tracking-[0.4em] text-[10px]">
            Network Member Portal
          </h2>
          <h1 className="font-serif text-5xl md:text-6xl font-black text-black leading-none tracking-tighter">
            Legal <span className="text-secondary italic">Excellence</span> <br />
            Dashboard
          </h1>
        </div>
        <div className="flex space-x-4">
          <button className="brand-gradient text-white px-8 py-4 rounded-full font-sans font-black uppercase tracking-widest text-[10px] shadow-brand hover:scale-105 transition-all">
            Logout
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-12">
        {/* Left Sidebar: Profile Summary */}
        <div className="lg:col-span-1 space-y-8">
          <div className="luxury-card bg-white rounded-[50px] overflow-hidden shadow-xl border border-border/40">
            <div className="h-48 relative overflow-hidden">
               <img 
                src={profile?.profile_image_url || "https://images.unsplash.com/photo-1507679799987-c7377f323b51?auto=format&fit=crop&q=80&w=2000"} 
                className="w-full h-full object-cover grayscale"
                alt="Profile"
              />
              <div className="absolute inset-0 bg-primary/20"></div>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-1 text-center">
                <h4 className="font-serif text-2xl font-black text-black">{profile?.full_name || 'Legal Professional'}</h4>
                <p className="font-sans text-[10px] text-secondary font-black uppercase tracking-widest">{profile?.firm_name || 'Pan Afric Network'}</p>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-border/30">
                <div className="flex items-center space-x-3 text-muted">
                  <MapPin size={14} className="text-secondary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{profile?.location || 'Addis Ababa, Ethiopia'}</span>
                </div>
                <div className="flex items-center space-x-3 text-muted">
                  <CheckCircle2 size={14} className="text-green-600" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-green-700">Verified Member</span>
                </div>
              </div>

              <button className="w-full luxury-glass border border-secondary/20 py-4 rounded-2xl font-sans font-black uppercase tracking-widest text-[10px] flex items-center justify-center space-x-2 hover:bg-primary hover:text-white transition-all">
                <Settings size={14} />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content: Stats & Referrals */}
        <div className="lg:col-span-3 space-y-12">
          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6">
             <div className="luxury-card bg-primary p-8 rounded-[35px] text-white flex justify-between items-center group overflow-hidden relative">
               <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-125 transition-transform duration-700">
                  <MessageSquare size={120} />
               </div>
               <div className="space-y-1 relative z-10">
                 <p className="text-4xl font-serif font-black">12</p>
                 <p className="font-sans text-[10px] uppercase tracking-widest font-bold opacity-60">Messages</p>
               </div>
               <ArrowRight size={24} className="text-secondary opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
             </div>
             <div className="luxury-card bg-[#f8f8f8] p-8 rounded-[35px] text-black flex justify-between items-center group border border-border/40 overflow-hidden relative">
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-125 transition-transform duration-700">
                  <Briefcase size={120} />
               </div>
               <div className="space-y-1 relative z-10">
                 <p className="text-4xl font-serif font-black">04</p>
                 <p className="font-sans text-[10px] uppercase tracking-widest font-bold text-muted">Active Referrals</p>
               </div>
               <ArrowRight size={24} className="text-secondary opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
             </div>
             <div className="luxury-card brand-gradient p-8 rounded-[35px] text-white flex justify-between items-center group shadow-brand overflow-hidden relative">
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                  <Globe size={120} />
               </div>
               <div className="space-y-1 relative z-10">
                 <p className="text-4xl font-serif font-black">28</p>
                 <p className="font-sans text-[10px] uppercase tracking-widest font-bold opacity-60">Network Reach</p>
               </div>
               <ArrowRight size={24} className="text-white opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
             </div>
          </div>

          {/* Referral Board */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-3xl font-black text-black tracking-tight">Referral Opportunity Board</h3>
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span className="font-sans text-[10px] font-black uppercase tracking-widest text-muted">Live Update</span>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { type: 'Corporate', loc: 'Lagos, Nigeria', client: 'Pharma Group', time: '2h ago' },
                { type: 'Litigation', loc: 'Nairobi, Kenya', client: 'Tech Startup', time: '5h ago' }
              ].map((ref, i) => (
                <div key={i} className="luxury-card bg-white p-8 rounded-[30px] border border-border/30 hover:border-secondary/40 transition-all group flex items-center justify-between">
                  <div className="flex items-center space-x-8">
                    <div className="p-4 bg-accent rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <Users size={24} />
                    </div>
                    <div>
                      <h4 className="font-serif text-xl font-black text-black tracking-tight">{ref.type} Referral - {ref.client}</h4>
                      <div className="flex items-center space-x-4 text-[10px] font-black uppercase tracking-widest text-muted mt-2">
                        <span className="flex items-center space-x-2">
                          <MapPin size={12} className="text-secondary" />
                          <span>{ref.loc}</span>
                        </span>
                        <span className="flex items-center space-x-2">
                          <Clock size={12} className="text-secondary" />
                          <span>{ref.time}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="luxury-glass border border-secondary/20 px-6 py-3 rounded-full font-sans font-black uppercase tracking-widest text-[9px] hover:bg-primary hover:text-white transition-all">
                    Express Interest
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
