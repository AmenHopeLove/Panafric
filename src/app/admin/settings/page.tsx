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
    Type,
    Image as ImageIcon,
    Upload,
    Trash2,
    Video,
    VideoOff
} from "lucide-react";

const BANNER_IDS = [
    { id: 'HOME_HERO_BANNER', name: 'Homepage Banner', category: 'home' },
    { id: 'ABOUT_HERO_BANNER', name: 'About Page Banner', category: 'about' },
    { id: 'PRACTICE_AREAS_HERO_BANNER', name: 'Practice Areas Banner', category: 'practice-areas' },
    { id: 'INSIGHTS_HERO_BANNER', name: 'Insights Page Banner', category: 'insights' },
    { id: 'NEWS_HERO_BANNER', name: 'News Page Banner', category: 'news' },
    { id: 'NETWORK_HERO_BANNER', name: 'Network Page Banner', category: 'network' }
];

const SPECIAL_IDS = [
    { id: 'HOME_HERO_BANNER', default: { image_url: "", overlay_opacity: "0.6" }, category: 'home' },
    { id: 'ABOUT_HERO_BANNER', default: { image_url: "", overlay_opacity: "0.6" }, category: 'about' },
    { id: 'PRACTICE_AREAS_HERO_BANNER', default: { image_url: "", overlay_opacity: "0.6" }, category: 'practice-areas' },
    { id: 'INSIGHTS_HERO_BANNER', default: { image_url: "", overlay_opacity: "0.6" }, category: 'insights' },
    { id: 'NEWS_HERO_BANNER', default: { image_url: "", overlay_opacity: "0.6" }, category: 'news' },
    { id: 'NETWORK_HERO_BANNER', default: { image_url: "", overlay_opacity: "0.6" }, category: 'network' },
    { id: 'HOME_VIDEO_URL', default: { url: "", title: "Watch Our Story: Legal Excellence Across Africa" }, category: 'home' }
];

export default function SiteSettings() {
    const [configs, setConfigs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [currentUser, setCurrentUser] = useState<{ email?: string; role?: string } | null>(null);
    const [activeBannerTab, setActiveBannerTab] = useState('HOME_HERO_BANNER');

    useEffect(() => {
        fetchConfigs();
        fetchCurrentUser();
    }, []);

    async function fetchCurrentUser() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('email, role')
                    .eq('id', user.id)
                    .single();
                
                if (!error && profile) {
                    setCurrentUser({
                        email: user.email || profile.email,
                        role: profile.role || 'unknown'
                    });
                } else {
                    setCurrentUser({
                        email: user.email,
                        role: 'unknown (no profile found)'
                    });
                }
            }
        } catch (err) {
            console.error("Error fetching current user info:", err);
        }
    }

    async function fetchConfigs() {
        setLoading(true);
        const { data, error } = await supabase
            .from('site_config')
            .select('*')
            .order('category', { ascending: true });

        if (error) {
            setMessage({ type: 'error', text: "Failed to load settings" });
        } else {
            // Map configuration IDs to uppercase for casing normalization while retaining originalId for SQL updates
            let loadedConfigs = (data || []).map(c => ({
                ...c,
                originalId: c.id,
                id: c.id.toUpperCase()
            }));

            // Self-heal each special key if it's missing from the database (checking case-insensitively)
            for (const specialDef of SPECIAL_IDS) {
                const existingConfig = loadedConfigs.find(c => c.id === specialDef.id);

                if (!existingConfig) {
                    const newConfig = {
                        id: specialDef.id,
                        originalId: specialDef.id,
                        value: specialDef.default,
                        category: specialDef.category
                    };
                    const { data: insertedData, error: insertError } = await supabase
                        .from('site_config')
                        .insert([{
                            id: specialDef.id,
                            value: specialDef.default,
                            category: specialDef.category
                        }])
                        .select();

                    if (!insertError && insertedData && insertedData[0]) {
                        loadedConfigs = [...loadedConfigs, {
                            ...insertedData[0],
                            originalId: insertedData[0].id,
                            id: insertedData[0].id.toUpperCase()
                        }];
                    } else {
                        loadedConfigs = [...loadedConfigs, newConfig];
                    }
                }
            }
            setConfigs(loadedConfigs);
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

    const handleBannerChange = (field: string, value: string) => {
        setConfigs(configs.map(c => {
            if (c.id === activeBannerTab) {
                return {
                    ...c,
                    value: { ...c.value, [field]: value }
                };
            }
            return c;
        }));
    };

    const handleVideoChange = (field: string, value: string) => {
        setConfigs(configs.map(c => {
            if (c.id === 'HOME_VIDEO_URL') {
                return {
                    ...c,
                    value: { ...c.value, [field]: value }
                };
            }
            return c;
        }));
    };

    const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setMessage(null);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${activeBannerTab.toLowerCase()}_${Date.now()}.${fileExt}`;
            const filePath = `banners/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('cms-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('cms-images')
                .getPublicUrl(filePath);

            handleBannerChange('image_url', publicUrl);
            setMessage({ type: 'success', text: "Banner image uploaded successfully" });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || "Failed to upload image" });
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveBanner = () => {
        handleBannerChange('image_url', "");
    };

    const getYouTubeId = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    async function saveSettings() {
        setSaving(true);
        setMessage(null);

        try {
            for (const config of configs) {
                const { error } = await supabase
                    .from('site_config')
                    .update({ value: config.value })
                    .eq('id', config.originalId || config.id);

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

    const activeBannerConfig = configs.find(c => c.id === activeBannerTab);
    const videoConfig = configs.find(c => c.id === 'HOME_VIDEO_URL');
    const filteredConfigs = configs.filter(c => !SPECIAL_IDS.some(s => s.id === c.id));
    const categories = Array.from(new Set(filteredConfigs.map(c => c.category)));
    const youtubeId = videoConfig ? getYouTubeId(videoConfig.value.url) : null;

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="font-serif text-3xl font-black italic">Platform Configuration</h2>
                    <p className="font-sans text-xs uppercase tracking-widest text-muted font-bold">
                        Logged in as: <span className="text-secondary font-black">{currentUser?.email || "Checking session..."}</span> ({currentUser?.role || "loading..."})
                    </p>
                </div>
                <button
                    onClick={saveSettings}
                    disabled={saving || uploading || !!(currentUser && currentUser.role !== 'admin')}
                    className="bg-secondary text-white px-8 py-3 rounded-sm font-sans font-bold uppercase tracking-widest text-xs hover:bg-black transition-all flex items-center space-x-2 shadow-lg disabled:opacity-50"
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    <span>Save Changes</span>
                </button>
            </div>

            {/* Non-Admin Warnings */}
            {currentUser && currentUser.role !== 'admin' && (
                <div className="p-6 rounded-sm border-l-4 bg-amber-50 border-amber-500 text-amber-800 flex items-center space-x-4 animate-in fade-in slide-in-from-top-4">
                    <AlertCircle size={24} className="flex-shrink-0" />
                    <div>
                        <p className="font-bold text-sm uppercase tracking-widest">Access Denied</p>
                        <p className="text-sm font-medium">
                            Your account (<span className="font-bold">{currentUser.email}</span>) is assigned the <span className="font-bold">"{currentUser.role}"</span> role.
                            Only users with the <span className="font-bold">"admin"</span> role have the database privileges to edit configurations or upload media files.
                        </p>
                    </div>
                </div>
            )}

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

            {/* Hero Banners Management Block */}
            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <div className="h-px bg-border flex-grow"></div>
                    <h3 className="font-sans text-[10px] font-black uppercase tracking-[0.4em] text-secondary">Hero Banner settings</h3>
                    <div className="h-px bg-border flex-grow"></div>
                </div>

                <div className="bg-white border border-border p-8 rounded-sm shadow-sm hover:shadow-md transition-shadow space-y-8">
                    {/* Tabs Navigation */}
                    <div className="flex flex-wrap border-b border-border gap-2">
                        {BANNER_IDS.map(b => (
                            <button
                                key={b.id}
                                type="button"
                                onClick={() => setActiveBannerTab(b.id)}
                                className={`px-6 py-3 font-sans text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${
                                    activeBannerTab === b.id
                                        ? 'border-secondary text-secondary font-black'
                                        : 'border-transparent text-muted hover:text-black hover:border-gray-300'
                                }`}
                            >
                                {b.name.replace(" Page Banner", "").replace(" Banner", "")}
                            </button>
                        ))}
                    </div>

                    {activeBannerConfig && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                            {/* Upload Area */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted flex items-center">
                                        Upload Banner Photo
                                    </label>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-muted">{activeBannerConfig.id}</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <label className="flex-1 cursor-pointer">
                                        <div className={`border-2 border-dashed border-border rounded-sm p-8 text-center hover:border-secondary transition-all ${uploading && 'opacity-50 pointer-events-none'}`}>
                                            {uploading ? (
                                                <Loader2 size={24} className="animate-spin mx-auto text-secondary" />
                                            ) : (
                                                <div className="space-y-2">
                                                    <Upload size={24} className="mx-auto text-muted" />
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Select Banner Image</p>
                                                    <p className="text-[8px] text-muted">High resolution JPG/PNG recommended</p>
                                                </div>
                                            )}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleBannerUpload} disabled={uploading} />
                                        </div>
                                    </label>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Or Enter Image URL</label>
                                    <input
                                        type="url"
                                        placeholder="https://images.unsplash.com/photo-..."
                                        className="w-full border border-border p-4 rounded-sm outline-none focus:border-secondary transition-colors font-sans text-sm"
                                        value={activeBannerConfig.value.image_url || ""}
                                        onChange={(e) => handleBannerChange('image_url', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Preview & Controls */}
                            <div className="space-y-6">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted">
                                    Banner Live Preview & Opacity
                                </label>

                                <div className="border border-border rounded-sm bg-black h-[140px] flex items-center justify-center overflow-hidden relative group">
                                    {activeBannerConfig.value.image_url ? (
                                        <>
                                            <img
                                                src={activeBannerConfig.value.image_url}
                                                alt="Banner Preview"
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            {/* Simulate overlay */}
                                            <div
                                                className="absolute inset-0 bg-black transition-opacity"
                                                style={{ opacity: parseFloat(activeBannerConfig.value.overlay_opacity || "0.6") }}
                                            />

                                            {/* Preview text overlay to simulate real landing page */}
                                            <div className="absolute inset-0 flex flex-col justify-center px-6 z-10 text-white pointer-events-none">
                                                {activeBannerTab === 'HOME_HERO_BANNER' && (
                                                    <>
                                                        <p className="text-[5px] uppercase tracking-[0.3em] text-secondary font-black">Africa's Premier Legal Collaboration</p>
                                                        <p className="text-sm font-serif font-black leading-tight mt-1">Expertise & Justice</p>
                                                    </>
                                                )}
                                                {activeBannerTab === 'ABOUT_HERO_BANNER' && (
                                                    <>
                                                        <p className="text-[5px] uppercase tracking-[0.3em] text-secondary font-black">Our Firm</p>
                                                        <p className="text-sm font-serif font-black leading-tight mt-1">About Pan Afric</p>
                                                    </>
                                                )}
                                                {activeBannerTab === 'PRACTICE_AREAS_HERO_BANNER' && (
                                                    <>
                                                        <p className="text-[5px] uppercase tracking-[0.3em] text-secondary font-black">Our Expertise</p>
                                                        <p className="text-sm font-serif font-black leading-tight mt-1">Practice Areas</p>
                                                    </>
                                                )}
                                                {activeBannerTab === 'INSIGHTS_HERO_BANNER' && (
                                                    <>
                                                        <p className="text-[5px] uppercase tracking-[0.3em] text-secondary font-black">Knowledge Hub</p>
                                                        <p className="text-sm font-serif font-black leading-tight mt-1">Legal Insights</p>
                                                    </>
                                                )}
                                                {activeBannerTab === 'NEWS_HERO_BANNER' && (
                                                    <>
                                                        <p className="text-[5px] uppercase tracking-[0.3em] text-secondary font-black">Stay Informed</p>
                                                        <p className="text-sm font-serif font-black leading-tight mt-1">Latest Updates</p>
                                                    </>
                                                )}
                                                {activeBannerTab === 'NETWORK_HERO_BANNER' && (
                                                    <>
                                                        <p className="text-[5px] uppercase tracking-[0.3em] text-secondary font-black">Legal Network</p>
                                                        <p className="text-sm font-serif font-black leading-tight mt-1">Member Directory</p>
                                                    </>
                                                )}
                                            </div>

                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveBanner}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm flex items-center space-x-2 transition-colors"
                                                >
                                                    <Trash2 size={12} />
                                                    <span>Remove Image</span>
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center space-y-2 p-6">
                                            <ImageIcon size={32} className="mx-auto text-gray-700" />
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">No Banner Image Set</p>
                                            <p className="text-[8px] text-gray-600">Falling back to original page styling</p>
                                        </div>
                                    )}
                                </div>

                                {activeBannerConfig.value.image_url && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted">
                                                Dark Overlay Opacity
                                            </label>
                                            <span className="text-[10px] font-sans font-bold text-secondary">{Math.round(parseFloat(activeBannerConfig.value.overlay_opacity || "0.6") * 100)}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0.1"
                                            max="0.9"
                                            step="0.05"
                                            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-secondary"
                                            value={activeBannerConfig.value.overlay_opacity || "0.6"}
                                            onChange={(e) => handleBannerChange('overlay_opacity', e.target.value)}
                                        />
                                        <p className="text-[8px] text-muted leading-tight">Controls background image dimming to ensure hero text remains readable.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Video Settings Section */}
            {videoConfig && (
                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <div className="h-px bg-border flex-grow"></div>
                        <h3 className="font-sans text-[10px] font-black uppercase tracking-[0.4em] text-secondary">Featured Video settings</h3>
                        <div className="h-px bg-border flex-grow"></div>
                    </div>

                    <div className="bg-white border border-border p-8 rounded-sm shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="bg-gray-50 p-2 rounded-sm text-secondary">
                                    <Video size={16} />
                                </div>
                                <p className="font-sans text-xs font-bold uppercase tracking-widest text-black">Homepage Featured Video</p>
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-widest text-muted">home_video_url</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Inputs */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted">YouTube Video URL</label>
                                    <input
                                        type="url"
                                        placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                        className="w-full border border-border p-4 rounded-sm outline-none focus:border-secondary transition-colors font-sans text-sm"
                                        value={videoConfig.value.url || ""}
                                        onChange={(e) => handleVideoChange('url', e.target.value)}
                                    />
                                    <p className="text-[8px] text-muted">Paste any standard YouTube video URL, e.g. watch link or share link.</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Video Title / Heading</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Firm Overview & Legal Excellence"
                                        className="w-full border border-border p-4 rounded-sm outline-none focus:border-secondary transition-colors font-sans text-sm"
                                        value={videoConfig.value.title || ""}
                                        onChange={(e) => handleVideoChange('title', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted">
                                    Video Preview
                                </label>
                                {youtubeId ? (
                                    <div className="relative aspect-video rounded-sm overflow-hidden border border-border bg-black">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${youtubeId}`}
                                            title={videoConfig.value.title || "YouTube video"}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                            className="absolute inset-0 w-full h-full"
                                        ></iframe>
                                    </div>
                                ) : (
                                    <div className="border border-border rounded-sm bg-gray-50 aspect-video flex flex-col items-center justify-center p-6 text-center animate-pulse">
                                        <VideoOff size={32} className="text-gray-300 mb-2" />
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No Valid Video URL</p>
                                        <p className="text-[8px] text-gray-500 max-w-[200px] mt-1">Please enter a valid YouTube link to preview and embed the video.</p>
                                    </div>
                                )}
                            </div>
                        </div>
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
                        {filteredConfigs.filter(c => c.category === cat).map(config => (
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
