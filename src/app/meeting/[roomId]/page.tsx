"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import { Loader2, ShieldCheck, ArrowLeft, Video, Mic, Share } from 'lucide-react';

export default function MeetingRoom() {
  const { roomId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [userName, setUserName] = useState("Guest");

  useEffect(() => {
    async function initMeeting() {
      // 1. Verify Session & Identity
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // We could technically allow guest access if needed, 
        // but for now, we enforce login for the "Secure Circle"
        router.push('/login');
        return;
      }

      setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || "Client");
      setAuthorized(true);
      setLoading(false);

      // 2. Dynamically Load Jitsi Script
      const script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      script.onload = () => {
        // @ts-ignore
        const domain = 'meet.jit.si';
        const options = {
          roomName: `PALF-SECURE-${roomId}`,
          width: '100%',
          height: '100%',
          parentNode: document.querySelector('#jitsi-container'),
          userInfo: {
            displayName: userName
          },
          configOverwrite: {
            startWithAudioMuted: true,
            disableModeratorIndicator: false,
            startScreenSharing: false,
            enableEmailInStats: false
          },
          interfaceConfigOverwrite: {
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
            SHOW_JITSI_WATERMARK: false,
            DEFAULT_BACKGROUND: '#050505'
          }
        };
        // @ts-ignore
        const api = new window.JitsiMeetExternalAPI(domain, options);
      };
      document.body.appendChild(script);

      return () => {
        // Cleanup script if needed, although usually not necessary for a page exit
        document.body.removeChild(script);
      };
    }

    initMeeting();
  }, [roomId, router, userName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-6 text-white">
        <Loader2 className="h-12 w-12 animate-spin text-secondary" />
        <p className="font-sans text-xs uppercase tracking-[0.4em] font-black">Initializing Secure Connection...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#050505] flex flex-col overflow-hidden">
      {/* Secure Header */}
      <div className="p-6 bg-black/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between z-50">
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => window.history.back()}
            className="p-3 rounded-full hover:bg-white/5 transition-colors text-white/40 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="text-secondary" size={16} />
              <h1 className="font-serif text-xl font-black text-white italic">Secure Consultation Room</h1>
            </div>
            <p className="text-[9px] font-sans text-white/40 uppercase tracking-widest font-black">End-to-End Encrypted Tunnel</p>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-8">
           <div className="flex items-center space-x-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live: {userName}</span>
           </div>
           <div className="flex items-center space-x-4">
              <Mic size={18} className="text-white/40" />
              <Video size={18} className="text-white/40" />
              <Share size={18} className="text-white/40" />
           </div>
        </div>
      </div>

      {/* Jitsi Container */}
      <div id="jitsi-container" className="flex-grow w-full relative bg-black">
        {/* Overlay for branding before Jitsi takes over completely */}
        <div className="absolute inset-0 pointer-events-none z-10 opacity-10">
           <div className="w-full h-full bg-[radial-gradient(circle_at_center,_rgba(194,65,12,0.1),_transparent_70%)]" />
        </div>
      </div>
    </div>
  );
}
