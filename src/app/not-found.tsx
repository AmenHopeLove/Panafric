import Link from 'next/link';
import { ArrowRight, SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {/* We use a sophisticated, dark-themed legal/architectural image as the background */}
        <img
          src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=2000"
          alt="Page Not Found Background"
          className="w-full h-full object-cover opacity-30 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-primary/80 to-black opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(194,65,12,0.1),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.05]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-8 px-4 max-w-3xl">
        <div className="bg-white/5 border border-secondary/20 p-6 rounded-full backdrop-blur-md mb-6 animate-in zoom-in duration-700">
          <SearchX className="h-12 w-12 text-secondary" />
        </div>
        
        <h1 className="font-serif text-8xl md:text-[150px] font-black text-white tracking-tighter drop-shadow-2xl leading-none animate-in slide-in-from-bottom-8 duration-700 delay-100">
          404
        </h1>
        
        <div className="space-y-4 animate-in fade-in duration-1000 delay-300">
          <h2 className="font-sans text-lg md:text-2xl font-black uppercase tracking-[0.4em] text-secondary">
            Page Not Found
          </h2>
          <p className="text-white/60 font-sans font-light text-base md:text-lg leading-relaxed max-w-lg mx-auto">
            The page you are looking for has been moved, archived, or simply does not exist in our current directory.
          </p>
        </div>

        <div className="pt-10 flex flex-col sm:flex-row gap-6 w-full sm:w-auto animate-in slide-in-from-bottom-4 duration-700 delay-500">
          <Link
            href="/"
            className="brand-gradient text-white px-10 py-5 rounded-full font-sans font-black uppercase tracking-[0.2em] text-xs hover:scale-105 active:scale-95 transition-all shadow-brand flex items-center justify-center group"
          >
            Return to Homepage
            <ArrowRight className="ml-4 h-4 w-4 group-hover:translate-x-2 transition-transform" />
          </Link>
          <Link
            href="/contact"
            className="bg-white/5 hover:bg-white/10 text-white border border-white/20 px-10 py-5 rounded-full font-sans font-black uppercase tracking-[0.2em] text-xs transition-all backdrop-blur-sm flex items-center justify-center"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
