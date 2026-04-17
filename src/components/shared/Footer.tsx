import Link from "next/link";
import { Scale, Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-primary text-white pt-32 pb-16 selection:bg-secondary/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-24 mb-24">
                    {/* Brand */}
                    <div className="space-y-8">
                        <div className="flex items-center space-x-3 group">
                            <div className="bg-white p-2 rounded-xl group-hover:scale-105 transition-transform duration-500">
                                <img 
                                    src="/logo-icon.png" 
                                    alt="Pan Afric Logo" 
                                    className="h-12 w-auto object-contain" 
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-serif text-2xl font-black leading-none tracking-tight">PAN AFRIC</span>
                                <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-secondary font-bold">Law Firm & Network</span>
                            </div>
                        </div>
                        <p className="text-muted text-sm leading-relaxed font-light font-sans max-w-xs italic">
                            "Africa's premier legal collaboration platform connecting expertise, opportunity, and justice across borders."
                        </p>
                        <div className="flex space-x-6">
                            <a href="https://www.linkedin.com/company/106602144/admin/dashboard/" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-secondary transition-all transform hover:-translate-y-1"><Linkedin size={22} /></a>
                            <Link href="#" className="text-muted hover:text-secondary transition-all transform hover:-translate-y-1"><Twitter size={22} /></Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-sans text-secondary text-[10px] font-black uppercase tracking-[0.4em] mb-10">Navigation</h4>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-muted/80">
                            <li><Link href="/about" className="hover:text-white transition-colors">Our History</Link></li>
                            <li><Link href="/practice-areas" className="hover:text-white transition-colors">Practice Areas</Link></li>
                            <li><Link href="/network" className="hover:text-white transition-colors">Global Network</Link></li>
                            <li><Link href="/insights" className="hover:text-white transition-colors">Legal Intel</Link></li>
                            <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                        </ul>
                    </div>

                    {/* Practice Areas */}
                    <div>
                        <h4 className="font-sans text-secondary text-[10px] font-black uppercase tracking-[0.4em] mb-10">Excellence</h4>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-muted/80">
                            <li className="hover:text-white transition-colors cursor-default">Corporate & Commercial</li>
                            <li className="hover:text-white transition-colors cursor-default">Investment & Trade</li>
                            <li className="hover:text-white transition-colors cursor-default">Litigation & ADR</li>
                            <li className="hover:text-white transition-colors cursor-default">Intellectual Property</li>
                            <li className="hover:text-white transition-colors cursor-default">Infrastructure</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-sans text-secondary text-[10px] font-black uppercase tracking-[0.4em] mb-10">Get In Touch</h4>
                        <ul className="space-y-6 text-sm font-sans font-light">
                            <li className="flex items-start space-x-4 group">
                                <div className="bg-white/5 p-2 rounded-lg group-hover:bg-secondary transition-colors">
                                    <MapPin size={16} className="text-secondary group-hover:text-primary transition-colors" />
                                </div>
                                <span className="text-muted leading-relaxed">Lideta, Wil eshet Building, 4th floor<br />Addis Ababa, Ethiopia</span>
                            </li>
                            <li className="flex items-center space-x-4 group">
                                <div className="bg-white/5 p-2 rounded-lg group-hover:bg-secondary transition-colors">
                                    <Mail size={16} className="text-secondary group-hover:text-primary transition-colors" />
                                </div>
                                <span className="text-muted">info@panafriclawfirm.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 text-[10px] font-black uppercase tracking-[0.3em] text-muted/40">
                    <p>© {new Date().getFullYear()} Pan Afric Law Firm. Amen Kingdom</p>
                    <div className="flex space-x-12">
                        <Link href="/privacy" className="hover:text-secondary transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-secondary transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
