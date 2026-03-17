"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { Scale, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password.trim(),
            });

            if (signInError) throw signInError;

            // Immediately check role
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single();

            if (profileError || !profile || !['admin', 'staff'].includes(profile.role)) {
                await supabase.auth.signOut();
                throw new Error("Unauthorized: You do not have administrative access.");
            }

            // Success! Refresh to sync cookies then push
            router.refresh();
            router.push("/admin");
        } catch (err: any) {
            console.error("Login Error:", err);
            setError(err.message || "Failed to sign in. Please check your connection.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4">
            <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-2xl rounded-sm border border-border">
                <div className="text-center space-y-4">
                    <Link href="/" className="inline-flex items-center space-x-2">
                        <Scale className="h-10 w-10 text-primary" />
                    </Link>
                    <h2 className="font-serif text-3xl font-black text-black">
                        Portal Access
                    </h2>
                    <p className="font-sans text-xs uppercase tracking-[0.2em] text-secondary font-bold">
                        Administrative Login
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-start space-x-3">
                            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="block w-full px-4 py-3 border border-border rounded-sm focus:ring-1 focus:ring-secondary focus:border-secondary outline-none transition-all font-sans"
                                placeholder="admin@palf.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="block w-full px-4 py-3 border border-border rounded-sm focus:ring-1 focus:ring-secondary focus:border-secondary outline-none transition-all font-sans"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-4 px-4 bg-primary text-primary-foreground font-sans font-bold uppercase tracking-[0.2em] text-sm hover:bg-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <div className="pt-4 text-center">
                    <Link href="/" className="text-xs text-muted hover:text-black transition-colors font-sans uppercase tracking-widest">
                        ← Return to Website
                    </Link>
                </div>
            </div>
        </div>
    );
}
