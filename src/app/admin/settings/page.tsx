"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import {
    Settings,
    Save,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Globe,
    Phone,
    Mail,
    Type
} from "lucide-react";

export default function SiteSettings() {
    const [configs, setConfigs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchConfigs();
    }, []);

    async function fetchConfigs() {
        setLoading(true);
        const { data, error } = await supabase
            .from('site_config')
            .select('*')
            .order('category', { ascending: true });

        if (error) {
            setMessage({ type: 'error', text: "Failed to load settings" });
        } else {
            setConfigs(data || []);
        }
        setLoading(false);
    }

    const handleValueChange = (id: string, field: string, newValue: string) => {
        setConfigs(configs.map(c => {
            if (c.id === id) {
                return {
                    ...c,
                    value: { ...c.value, [field]: newValue }
                };
            }
            return c;
        }));
    };

    async function saveSettings() {
        setSaving(true);
        setMessage(null);

        try {
            for (const config of configs) {
                const { error } = await supabase
                    .from('site_config')
                    .update({ value: config.value })
                    .eq('id', config.id);

                if (error) throw error;
            }
            setMessage({ type: 'success', text: "All settings saved successfully" });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || "Failed to save settings" });
        } finally {
            setSaving(false);
        }
    }

    if (loading) return (
        <div className="min-h-[400px] flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-secondary" />
        </div>
    );

    const categories = Array.from(new Set(configs.map(c => c.category)));

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="font-serif text-3xl font-black italic">Platform Configuration</h2>
                    <p className="font-sans text-xs uppercase tracking-widest text-muted font-bold">Manage global text, buttons, and settings</p>
                </div>
                <button
                    onClick={saveSettings}
                    disabled={saving}
                    className="bg-secondary text-white px-8 py-3 rounded-sm font-sans font-bold uppercase tracking-widest text-xs hover:bg-black transition-all flex items-center space-x-2 shadow-lg disabled:opacity-50"
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    <span>Save Changes</span>
                </button>
            </div>

            {/* Notification */}
            {message && (
                <div className={`p-6 rounded-sm border-l-4 flex items-center space-x-4 animate-in fade-in slide-in-from-top-4 ${message.type === 'success' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-red-50 border-red-500 text-red-800'
                    }`}>
                    {message.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                    <div>
                        <p className="font-bold text-sm uppercase tracking-widest">{message.type.toUpperCase()}</p>
                        <p className="text-sm font-medium">{message.text}</p>
                    </div>
                </div>
            )}

            {/* Settings Sections */}
            {categories.map(cat => (
                <div key={cat} className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <div className="h-px bg-border flex-grow"></div>
                        <h3 className="font-sans text-[10px] font-black uppercase tracking-[0.4em] text-secondary">{cat} settings</h3>
                        <div className="h-px bg-border flex-grow"></div>
                    </div>

                    <div className="grid gap-6">
                        {configs.filter(c => c.category === cat).map(config => (
                            <div key={config.id} className="bg-white border border-border p-8 rounded-sm shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-gray-50 p-2 rounded-sm text-secondary">
                                            {config.id.includes('email') ? <Mail size={16} /> :
                                                config.id.includes('phone') ? <Phone size={16} /> :
                                                    <Type size={16} />}
                                        </div>
                                        <p className="font-sans text-xs font-bold uppercase tracking-widest text-black">{config.id.replace(/_/g, ' ')}</p>
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-muted">{config.id}</span>
                                </div>

                                <div className="space-y-6">
                                    {Object.keys(config.value).map(field => (
                                        <div key={field} className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted flex items-center">
                                                {field === 'en' ? <Globe size={10} className="mr-2" /> :
                                                    field === 'am' ? <Globe size={10} className="mr-2" /> : null}
                                                {field.toUpperCase()}
                                            </label>
                                            {config.id.includes('footer_about') || config.id.includes('hero_title') ? (
                                                <textarea
                                                    rows={3}
                                                    className="w-full border border-border p-4 rounded-sm outline-none focus:border-secondary transition-colors font-sans text-sm"
                                                    value={config.value[field]}
                                                    onChange={(e) => handleValueChange(config.id, field, e.target.value)}
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    className="w-full border border-border p-4 rounded-sm outline-none focus:border-secondary transition-colors font-sans text-sm"
                                                    value={config.value[field]}
                                                    onChange={(e) => handleValueChange(config.id, field, e.target.value)}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
