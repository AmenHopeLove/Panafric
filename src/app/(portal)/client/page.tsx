"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  Video, 
  Download,
  Shield,
  Briefcase,
  Copy,
  Check
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface Case {
  id: string;
  created_at: string;
  subject: string;
  status: 'new' | 'reviewing' | 'accepted' | 'rejected' | 'closed';
  case_type: string;
  description: string;
}

export default function ClientDashboard() {
  const { t } = useLanguage();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const copyMeetingLink = () => {
    const link = `${window.location.origin}/meeting/consultation-${user?.id?.slice(0, 8)}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data, error } = await supabase
          .from('cases')
          .select('*')
          .or(`client_id.eq.${user.id},email.eq.${user.email}`)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setCases(data);
        }
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'text-blue-500 bg-blue-50';
      case 'reviewing': return 'text-amber-500 bg-amber-50';
      case 'accepted': return 'text-green-500 bg-green-50';
      case 'rejected': return 'text-red-500 bg-red-50';
      case 'closed': return 'text-gray-500 bg-gray-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock size={16} />;
      case 'reviewing': return <AlertCircle size={16} />;
      case 'accepted': return <CheckCircle2 size={16} />;
      case 'rejected': return <AlertCircle size={16} />;
      default: return <FileText size={16} />;
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="w-16 h-1 brand-gradient rounded-full" />
          <h2 className="font-sans text-secondary font-black uppercase tracking-[0.4em] text-[10px]">
            Client Secure Portal
          </h2>
          <h1 className="font-serif text-5xl md:text-6xl font-black text-black leading-none tracking-tighter">
            Welcome back, <br />
            <span className="text-secondary italic">{user?.user_metadata?.full_name || 'Valued Client'}</span>
          </h1>
        </div>
        <div className="flex space-x-4">
          <button className="luxury-glass border border-secondary/20 text-primary px-8 py-4 rounded-full font-sans font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white transition-all">
            Update Profile
          </button>
          <button className="brand-gradient text-white px-8 py-4 rounded-full font-sans font-black uppercase tracking-widest text-[10px] shadow-brand hover:scale-105 transition-all">
            Logout
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Main Content: Case Tracking */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-3xl font-black text-black tracking-tight">Active Legal Cases</h3>
            <span className="bg-accent px-4 py-1 rounded-full font-sans text-[10px] font-black uppercase tracking-widest text-muted">
              {cases.length} Total
            </span>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-secondary border-t-transparent"></div>
              <p className="font-sans text-[10px] text-muted uppercase tracking-[0.3em]">Syncing Vault...</p>
            </div>
          ) : cases.length > 0 ? (
            <div className="space-y-6">
              {cases.map((c) => (
                <div key={c.id} className="luxury-card bg-white rounded-3xl p-8 border border-border/40 hover:border-secondary/40 transition-all group">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-4">
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(c.status)}`}>
                        {getStatusIcon(c.status)}
                        <span>{c.status}</span>
                      </div>
                      <h4 className="font-serif text-2xl font-black text-black group-hover:text-primary transition-colors">
                        {c.subject}
                      </h4>
                      <p className="text-muted text-sm font-sans line-clamp-2 italic">
                        {c.description}
                      </p>
                      <div className="flex items-center space-x-6 pt-4 text-[10px] font-black uppercase tracking-widest text-muted">
                        <span className="flex items-center space-x-2">
                          <Briefcase size={12} className="text-secondary" />
                          <span>{c.case_type}</span>
                        </span>
                        <span className="flex items-center space-x-2">
                          <Clock size={12} className="text-secondary" />
                          <span>{new Date(c.created_at).toLocaleDateString()}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-row md:flex-col justify-end gap-3">
                      <button className="p-4 rounded-2xl bg-accent text-primary hover:bg-secondary hover:text-white transition-all shadow-sm group/btn">
                        <FileText size={20} />
                      </button>
                      <button className="p-4 rounded-2xl bg-secondary text-white hover:scale-105 transition-all shadow-brand">
                        <Video size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-6 bg-accent/20 rounded-[40px] border border-dashed border-border">
              <Shield size={48} className="mx-auto text-secondary/30" />
              <p className="font-serif text-2xl text-muted italic">No active cases found in your vault.</p>
              <button className="text-secondary font-sans font-black uppercase tracking-widest text-xs border-b border-secondary pb-1">
                Start a New Case
              </button>
            </div>
          )}
        </div>

        {/* Sidebar: Secure Vault & Actions */}
        <div className="space-y-8">
          <div className="luxury-card brand-gradient p-10 rounded-[40px] text-white space-y-8 shadow-brand">
            <div className="space-y-2">
              <h3 className="font-serif text-3xl font-black">Secure Vault</h3>
              <p className="font-sans text-[10px] uppercase tracking-[0.2em] opacity-60 font-bold">Encrypted Document Storage</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <FileText size={18} className="text-secondary" />
                  <span className="text-xs font-bold uppercase tracking-wider">ID_Card.pdf</span>
                </div>
                <Download size={16} className="opacity-40" />
              </div>
              <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <FileText size={18} className="text-secondary" />
                  <span className="text-xs font-bold uppercase tracking-wider">NDA_Signed.pdf</span>
                </div>
                <Download size={16} className="opacity-40" />
              </div>
            </div>

            <button className="w-full bg-white text-primary py-5 rounded-2xl font-sans font-black uppercase tracking-widest text-[10px] flex items-center justify-center space-x-3 hover:bg-secondary hover:text-white transition-all">
              <Upload size={16} />
              <span>Upload Documents</span>
            </button>
          </div>

          <div className="luxury-card bg-[#0a0a0a] p-10 rounded-[40px] text-white space-y-8">
            <div className="space-y-2">
              <h3 className="font-serif text-3xl font-black">Next Meeting</h3>
              <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-secondary font-bold">Video Consultation</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-4xl font-serif font-black">Thursday</p>
              <p className="text-muted font-sans font-light italic">March 27, 2026 @ 10:00 AM</p>
            </div>

            <button 
              onClick={copyMeetingLink}
              className="w-full bg-white/10 text-white py-4 rounded-2xl font-sans font-black uppercase tracking-widest text-[10px] flex items-center justify-center space-x-3 hover:bg-white/20 transition-all border border-white/10"
            >
              {copied ? <Check size={16} className="text-secondary" /> : <Copy size={16} />}
              <span>{copied ? "Copied Link" : "Invite Participant"}</span>
            </button>

            <button 
              onClick={() => window.location.href = `/meeting/consultation-${user?.id?.slice(0, 8)}`}
              className="w-full brand-gradient py-5 rounded-2xl font-sans font-black uppercase tracking-widest text-[10px] flex items-center justify-center space-x-3 shadow-brand hover:scale-105 transition-all"
            >
              <Video size={16} />
              <span>Join Secure Room</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
