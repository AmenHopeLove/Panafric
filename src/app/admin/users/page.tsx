"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import {
    Users,
    UserPlus,
    Shield,
    Trash2,
    Mail,
    Loader2,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

export default function UserManagement() {
    const [profiles, setProfiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchProfiles();
        checkCurrentUser();
    }, []);

    async function checkCurrentUser() {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
    }

    async function fetchProfiles() {
        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            setMessage({ type: 'error', text: "Failed to load profiles" });
        } else {
            setProfiles(data || []);
        }
        setLoading(false);
    }

    async function updateRole(userId: string, newRole: string) {
        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId);

        if (error) {
            setMessage({ type: 'error', text: "Access Denied: Only admins can change roles." });
        } else {
            setProfiles(profiles.map(p => p.id === userId ? { ...p, role: newRole } : p));
            setMessage({ type: 'success', text: "Role updated successfully" });
        }
    }

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="font-serif text-3xl font-black italic">Staff Directory</h2>
                    <p className="font-sans text-xs uppercase tracking-widest text-muted font-bold">Manage administrative access levels</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-sm flex items-center space-x-3 max-w-md">
                    <Shield className="text-amber-600 h-5 w-5" />
                    <p className="text-[10px] text-amber-800 font-sans leading-tight">
                        <strong>Admin Note:</strong> New users must first sign up via Supabase Auth before they appear here for role assignment.
                    </p>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-sm border-l-4 flex items-center space-x-3 ${message.type === 'success' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-red-50 border-red-500 text-red-800'
                    }`}>
                    {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <p className="text-sm font-medium">{message.text}</p>
                    <button onClick={() => setMessage(null)} className="ml-auto text-xs font-bold uppercase tracking-widest opacity-50 hover:opacity-100">Dismiss</button>
                </div>
            )}

            <div className="bg-white border border-border rounded-sm overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border bg-[#fcfcfc]">
                            <th className="px-6 py-4 font-sans text-[10px] uppercase tracking-[0.2em] text-muted font-bold">User</th>
                            <th className="px-6 py-4 font-sans text-[10px] uppercase tracking-[0.2em] text-muted font-bold">Email</th>
                            <th className="px-6 py-4 font-sans text-[10px] uppercase tracking-[0.2em] text-muted font-bold">Role</th>
                            <th className="px-6 py-4 font-sans text-[10px] uppercase tracking-[0.2em] text-muted font-bold">Joined</th>
                            <th className="px-6 py-4 font-sans text-[10px] uppercase tracking-[0.2em] text-muted font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className="px-6 py-20 text-center"><Loader2 className="animate-spin mx-auto text-muted" /></td></tr>
                        ) : profiles.map((profile) => (
                            <tr key={profile.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-6 font-bold text-sm text-black flex items-center space-x-3">
                                    <div className="h-8 w-8 rounded-full bg-secondary text-white flex items-center justify-center font-serif text-xs italic">
                                        {profile.full_name?.charAt(0) || profile.email.charAt(0).toUpperCase()}
                                    </div>
                                    <span>{profile.full_name || "New Staff"}</span>
                                </td>
                                <td className="px-6 py-6 text-xs text-muted flex items-center">
                                    <Mail size={12} className="mr-2" /> {profile.email}
                                </td>
                                <td className="px-6 py-6 text-xs">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${profile.role === 'admin' ? 'bg-black text-white' : 'bg-gray-100 text-muted'
                                        }`}>
                                        {profile.role}
                                    </span>
                                </td>
                                <td className="px-6 py-6 text-xs text-muted font-light">
                                    {new Date(profile.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-6 text-right">
                                    {currentUser?.id !== profile.id && (
                                        <select
                                            className="bg-gray-50 border border-border text-[10px] font-bold uppercase tracking-widest p-2 rounded-sm outline-none focus:border-secondary transition-colors"
                                            value={profile.role}
                                            onChange={(e) => updateRole(profile.id, e.target.value)}
                                        >
                                            <option value="staff">Make Staff</option>
                                            <option value="admin">Promote Admin</option>
                                        </select>
                                    )}
                                    {currentUser?.id === profile.id && (
                                        <span className="text-[10px] font-bold text-secondary uppercase tracking-widest italic">You</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
