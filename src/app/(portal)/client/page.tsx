"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { FileText, Clock, AlertCircle, Plus, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ClientDashboard() {
    const [consultations, setConsultations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.email) {
                setUserEmail(session.user.email);
                
                // Fetch cases/consultations linked to this email
                const { data } = await supabase
                    .from('consultations')
                    .select('*')
                    .eq('email', session.user.email)
                    .order('created_at', { ascending: false });
                    
                setConsultations(data || []);
            }
            setLoading(false);
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <div className="h-64 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-2 border-secondary border-t-transparent"></div></div>;
    }

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-8">
                <div className="space-y-4">
                    <h1 className="font-serif text-5xl font-black italic">Client Dashboard</h1>
                    <p className="font-sans text-muted text-lg tracking-wide font-light">
                        Manage your active inquiries and case files securely.
                    </p>
                </div>
                <Link href="/contact" className="bg-black text-white px-8 py-4 font-sans text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center hover:bg-secondary transition-all">
                    <Plus size={14} className="mr-2" /> New Consultation
                </Link>
            </div>

            <div className="space-y-8">
                <h2 className="font-sans text-xs font-black uppercase tracking-[0.2em] text-black">Active Inquiries & Cases</h2>
                
                {consultations.length === 0 ? (
                    <div className="bg-white border border-dashed border-border p-20 text-center rounded-sm">
                        <AlertCircle className="mx-auto text-secondary/50 mb-6" size={48} />
                        <h3 className="font-serif text-2xl italic text-black mb-2">No Active Cases Found</h3>
                        <p className="font-sans text-muted">You have no pending consultations or cases linked to {userEmail}.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {consultations.map((item) => (
                            <div key={item.id} className="bg-white border border-border p-8 hover:shadow-2xl transition-all group flex flex-col md:flex-row justify-between md:items-center gap-6 rounded-sm">
                                <div className="flex items-start space-x-6">
                                    <div className="bg-primary/5 p-4 rounded-xl text-primary mt-1 group-hover:bg-secondary/10 group-hover:text-secondary transition-colors">
                                        <FileText size={24} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-serif text-2xl font-bold italic">{item.subject || 'General Inquiry'}</h3>
                                        <p className="font-sans text-xs text-muted uppercase tracking-widest flex items-center">
                                            <Clock size={12} className="mr-2" />
                                            Submitted: {new Date(item.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-6 justify-between md:justify-end md:w-96">
                                    <span className={`px-4 py-2 font-sans text-[10px] font-black uppercase tracking-widest rounded-sm whitespace-nowrap text-center ${
                                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                        item.status === 'payment_pending' ? 'bg-orange-100 text-orange-800' : 
                                        item.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 
                                        item.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 
                                        'bg-blue-100 text-blue-800'
                                    }`}>
                                        {item.status ? item.status.replace('_', ' ') : 'Under Review'}
                                    </span>
                                    
                                    {(item.status === 'pending' || item.status === 'payment_pending') ? (
                                        <button 
                                            onClick={async () => {
                                                try {
                                                    const res = await fetch('/api/checkout', {
                                                        method: 'POST',
                                                        headers: {'Content-Type': 'application/json'},
                                                        body: JSON.stringify({
                                                            consultation_id: item.id,
                                                            amount: 250, // Standard retainer mock
                                                            email: userEmail,
                                                            name: item.full_name
                                                        })
                                                    });
                                                    const data = await res.json();
                                                    if(data.payment_url) {
                                                        window.location.href = data.payment_url;
                                                    }
                                                } catch(e) {
                                                    alert("Payment gateway connection failed.");
                                                }
                                            }}
                                            className="bg-black text-white px-6 py-3 font-sans text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-colors shadow-lg flex items-center justify-center whitespace-nowrap"
                                        >
                                            Pay Retainer ($250)
                                        </button>
                                    ) : (
                                        <div className="w-10 flex justify-end">
                                            <ChevronRight className="text-muted group-hover:text-secondary group-hover:translate-x-2 transition-all" size={20} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="bg-primary/5 p-10 border border-border rounded-sm">
                <h3 className="font-serif text-2xl font-bold italic mb-4">Secure Messaging</h3>
                <p className="font-sans text-sm text-muted mb-6">Need to send sensitive documents to our legal team? Please use our encrypted intake form.</p>
                <Link href="/contact/start-case" className="font-sans border-b border-black text-xs font-black uppercase tracking-widest pb-1 hover:text-secondary hover:border-secondary transition-all">Open Intake Form</Link>
            </div>
        </div>
    );
}
