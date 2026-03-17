'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Upload, X, ShieldCheck, Scale, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import Link from 'next/link';

const STEPS = [
    { title: 'Contact', description: 'Your Information' },
    { title: 'Case profile', description: 'Conflict & Urgency' },
    { title: 'Details', description: 'Matter Background' },
    { title: 'Evidence', description: 'Upload Documents' }
];

const CASE_TYPES = [
    'Commercial Litigation',
    'Intellectual Property',
    'Corporate Setup',
    'Trade Dispute',
    'Employment Law',
    'Criminal Defense',
    'Family Law',
    'Regulatory Compliance',
    'Other'
];

export default function StartCasePage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        company: '',
        case_type: '',
        urgency: 'Standard',
        opposing_party: '',
        subject: '',
        description: ''
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
        if (!formData.full_name || !formData.email || !formData.subject || !formData.description) {
            alert("Please complete all required fields.");
            return;
        }

        setIsSubmitting(true);
        try {
            // 1. Insert Case Data
            const { data: caseRecord, error: caseError } = await supabase
                .from('cases')
                .insert([formData])
                .select()
                .single();

            if (caseError) throw caseError;

            // 2. Upload Files if any
            if (files.length > 0) {
                for (const file of files) {
                    const filePath = `cases/${caseRecord.id}/${Date.now()}_${file.name}`;
                    const { error: uploadError, data: uploadData } = await supabase.storage
                        .from('case_attachments')
                        .upload(filePath, file);

                    if (uploadError) {
                        console.error(`Upload failed for ${file.name}:`, uploadError);
                        continue;
                    }

                    // Get public URL
                    const { data: { publicUrl } } = supabase.storage
                        .from('case_attachments')
                        .getPublicUrl(filePath);

                    // Insert record in case_files
                    await supabase.from('case_files').insert([{
                        case_id: caseRecord.id,
                        file_path: filePath,
                        file_url: publicUrl,
                        file_name: file.name,
                        file_size: file.size
                    }]);
                }
            }

            setIsSuccess(true);
        } catch (error: any) {
            alert(`Error submitting case: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center space-y-8">
                    <div className="h-24 w-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                        <ShieldCheck size={48} />
                    </div>
                    <div className="space-y-4">
                        <h2 className="font-serif text-4xl font-bold text-black">Submission Successful</h2>
                        <p className="text-muted font-sans">
                            Your case #{Math.random().toString(36).substr(2, 9).toUpperCase()} has been submitted. Our legal team will review your details and documents and contact you within 24-48 hours.
                        </p>
                    </div>
                    <Link href="/contact" className="inline-block bg-black text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-secondary transition-colors">
                        Return to Contact
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pt-32 pb-20">
            {/* Form Header */}
            <div className="max-w-5xl mx-auto w-full px-4 mb-12">
                <Link href="/contact" className="flex items-center space-x-2 text-muted hover:text-black transition-colors mb-8 group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-sans text-xs font-bold uppercase tracking-widest">Back to Contact</span>
                </Link>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <h1 className="font-serif text-5xl font-black text-black leading-tight">
                            Start Your <span className="text-secondary italic">Legal Journey</span>
                        </h1>
                        <p className="text-muted font-sans font-light italic">
                            Official Legal Intake Submission — Pan Afric Law Firm & Network
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-black text-white rounded-xl flex items-center justify-center">
                            <Scale size={24} />
                        </div>
                    </div>
                </div>

                {/* Progress Mini Map */}
                <div className="grid grid-cols-4 gap-4 mt-12">
                    {STEPS.map((step, idx) => (
                        <div key={idx} className={`relative pt-4 border-t-2 transition-all duration-700 ${currentStep > idx ? 'border-secondary' : 'border-slate-200'}`}>
                            <span className={`block font-sans text-[10px] font-black uppercase tracking-widest mb-1 ${currentStep > idx ? 'text-secondary' : 'text-slate-400'}`}>
                                Step 0{idx + 1}
                            </span>
                            <span className={`block font-serif text-sm font-bold ${currentStep > idx ? 'text-black' : 'text-slate-400'}`}>
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Form Body */}
            <div className="max-w-5xl mx-auto w-full px-4 flex-grow">
                <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
                    <div className="p-8 md:p-16">
                        
                        {/* Step 1: Contact Info */}
                        {currentStep === 1 && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-right duration-500">
                                <div className="space-y-2">
                                    <h3 className="font-serif text-3xl font-bold">Contact Person</h3>
                                    <p className="text-muted font-sans text-sm">Please provide your official contact details for correspondence.</p>
                                </div>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="font-sans text-xs font-bold uppercase tracking-widest text-slate-500">Full Name *</label>
                                        <input 
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                            className="w-full bg-slate-50 border-b-2 border-slate-200 focus:border-secondary py-4 px-4 font-sans focus:outline-none transition-all"
                                            placeholder="Gentry Smith"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-sans text-xs font-bold uppercase tracking-widest text-slate-500">Email Address *</label>
                                        <input 
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full bg-slate-50 border-b-2 border-slate-200 focus:border-secondary py-4 px-4 font-sans focus:outline-none transition-all"
                                            placeholder="smith@company.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-sans text-xs font-bold uppercase tracking-widest text-slate-500">Phone Number</label>
                                        <input 
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            className="w-full bg-slate-50 border-b-2 border-slate-200 focus:border-secondary py-4 px-4 font-sans focus:outline-none transition-all"
                                            placeholder="+251 ..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-sans text-xs font-bold uppercase tracking-widest text-slate-500">Company / Organization</label>
                                        <input 
                                            value={formData.company}
                                            onChange={(e) => setFormData({...formData, company: e.target.value})}
                                            className="w-full bg-slate-50 border-b-2 border-slate-200 focus:border-secondary py-4 px-4 font-sans focus:outline-none transition-all"
                                            placeholder="Acme Corp"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Case Profile */}
                        {currentStep === 2 && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-right duration-500">
                                <div className="space-y-2">
                                    <h3 className="font-serif text-3xl font-bold">Case Profiling</h3>
                                    <p className="text-muted font-sans text-sm">Help us identify potential conflicts of interest and urgency.</p>
                                </div>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="font-sans text-xs font-bold uppercase tracking-widest text-slate-500">Legal Area *</label>
                                        <select 
                                            value={formData.case_type}
                                            onChange={(e) => setFormData({...formData, case_type: e.target.value})}
                                            className="w-full bg-slate-50 border-b-2 border-slate-200 focus:border-secondary py-4 px-4 font-sans focus:outline-none transition-all appearance-none"
                                        >
                                            <option value="">Select Category</option>
                                            {CASE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-sans text-xs font-bold uppercase tracking-widest text-slate-500">Case Urgency</label>
                                        <div className="flex gap-2 pt-2">
                                            {['Low', 'Standard', 'High', 'Urgent'].map(u => (
                                                <button 
                                                    key={u}
                                                    onClick={() => setFormData({...formData, urgency: u})}
                                                    className={`px-4 py-2 rounded-lg font-sans text-[10px] font-bold uppercase tracking-widest transition-all ${formData.urgency === u ? 'bg-secondary text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                                >
                                                    {u}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="font-sans text-xs font-bold uppercase tracking-widest text-slate-500">Opposing Party (For Conflict Check)</label>
                                        <input 
                                            value={formData.opposing_party}
                                            onChange={(e) => setFormData({...formData, opposing_party: e.target.value})}
                                            className="w-full bg-slate-50 border-b-2 border-slate-200 focus:border-secondary py-4 px-4 font-sans focus:outline-none transition-all"
                                            placeholder="Entity or individual you are filing against"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Matter Details */}
                        {currentStep === 3 && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-right duration-500">
                                <div className="space-y-2">
                                    <h3 className="font-serif text-3xl font-bold">Matter Narrative</h3>
                                    <p className="text-muted font-sans text-sm">Provide a clear summary and detailed background of your legal matter.</p>
                                </div>
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="font-sans text-xs font-bold uppercase tracking-widest text-slate-500">Subject Heading *</label>
                                        <input 
                                            value={formData.subject}
                                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                            className="w-full bg-slate-50 border-b-2 border-slate-200 focus:border-secondary py-4 px-4 font-sans text-xl font-bold focus:outline-none transition-all"
                                            placeholder="Example: Breach of Commercial Contract"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-sans text-xs font-bold uppercase tracking-widest text-slate-500">Detailed Statement *</label>
                                        <textarea 
                                            rows={8}
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            className="w-full bg-slate-50 border-b-2 border-slate-200 focus:border-secondary py-4 px-4 font-sans focus:outline-none transition-all resize-none"
                                            placeholder="Please describe the events, dates, and legal impact..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Files */}
                        {currentStep === 4 && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-right duration-500">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="space-y-2">
                                        <h3 className="font-serif text-3xl font-bold">Evidence Bucket</h3>
                                        <p className="text-muted font-sans text-sm italic flex items-center gap-2">
                                            <AlertCircle size={14} className="text-secondary" />
                                            Upload contracts, emails, or supporting docs (Max 10MB per file).
                                        </p>
                                    </div>
                                    <label className="cursor-pointer bg-black text-white px-8 py-4 rounded-2xl flex items-center space-x-3 hover:bg-secondary transition-all shadow-xl active:scale-95 group">
                                        <Upload size={20} className="group-hover:-translate-y-1 transition-transform" />
                                        <span className="font-sans font-bold uppercase tracking-widest text-xs">Add Files</span>
                                        <input type="file" multiple className="hidden" onChange={handleFileChange} />
                                    </label>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {files.length === 0 ? (
                                        <div className="col-span-full border-2 border-dashed border-slate-200 rounded-[30px] p-20 flex flex-col items-center justify-center text-slate-300 space-y-4">
                                            <Upload size={48} />
                                            <p className="font-sans italic">No files attached yet.</p>
                                        </div>
                                    ) : (
                                        files.map((file, idx) => (
                                            <div key={idx} className="bg-slate-50 p-6 rounded-[25px] border border-slate-100 flex items-center justify-between group">
                                                <div className="flex items-center space-x-4 overflow-hidden">
                                                    <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-secondary">
                                                        <ShieldCheck size={20} />
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <p className="font-sans text-sm font-bold text-black truncate">{file.name}</p>
                                                        <p className="text-[10px] text-muted uppercase tracking-widest">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => removeFile(idx)} className="text-slate-300 hover:text-red-500 transition-colors">
                                                    <X size={20} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Footer Actions */}
                    <div className="bg-slate-50 p-8 md:px-16 flex items-center justify-between border-t border-slate-100">
                        <button 
                            onClick={prevStep}
                            disabled={currentStep === 1 || isSubmitting}
                            className={`flex items-center space-x-2 font-sans font-bold uppercase tracking-widest text-xs transition-colors ${currentStep === 1 ? 'opacity-0' : 'text-slate-400 hover:text-black'}`}
                        >
                            <ArrowLeft size={16} />
                            <span>Previous</span>
                        </button>
                        
                        <div className="flex items-center gap-6">
                            {currentStep < 4 ? (
                                <button 
                                    onClick={nextStep}
                                    className="flex items-center space-x-4 bg-black text-white px-10 py-5 rounded-full hover:bg-secondary transition-all shadow-xl active:scale-95 group"
                                >
                                    <span className="font-sans font-bold uppercase tracking-widest text-sm">Next Step</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                </button>
                            ) : (
                                <button 
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="flex items-center space-x-4 bg-secondary text-white px-12 py-5 rounded-full hover:shadow-[0_20px_40px_-10px_rgba(194,65,12,0.4)] transition-all shadow-xl active:scale-95 disabled:grayscale"
                                >
                                    {isSubmitting ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                                    ) : (
                                        <ShieldCheck size={20} />
                                    )}
                                    <span className="font-sans font-bold uppercase tracking-widest text-sm">
                                        {isSubmitting ? "Finalizing Transaction..." : "Submit Case File"}
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center text-[10px] text-slate-400 font-sans font-black uppercase tracking-[0.4em] opacity-40">
                    Trusted Legal Submission Protocol | Pan Afric Secure Node
                </div>
            </div>
        </div>
    );
}
