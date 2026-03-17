'use client';

import { Bot, Send, User, Scale, Mic } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function AIAssistant() {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [isListening, setIsListening] = useState(false);
    const [hasRecognition, setHasRecognition] = useState(false);
    const recognitionRef = useRef<any>(null);

    // Initialize Speech Recognition
    useEffect(() => {
        // @ts-ignore - Vendor prefixes
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            // Set language to Amharic (Ethiopia)
            recognitionRef.current.lang = 'am-ET';

            recognitionRef.current.onresult = (event: any) => {
                let currentTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    currentTranscript += event.results[i][0].transcript;
                }
                setInput(currentTranscript);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event: any) => {
                if (event.error === 'network') {
                    console.warn("Speech recognition network error (often caused by non-HTTPS local IP connections). Stopping recognition.");
                } else {
                    console.error("Speech recognition error:", event.error);
                }

                // Ensure we cleanly toggle off the UI state so it doesn't get stuck red
                if (recognitionRef.current) {
                    recognitionRef.current.stop();
                }
                setIsListening(false);
            };
            setHasRecognition(true);
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            setInput(''); // Clear old text when starting to record
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Stop recording forcefully if submitted while talking
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        }

        const text = input?.trim();
        if (!text || isLoading) return;

        // Immediately add user message to UI
        const newMessages = [...messages, { id: Date.now().toString(), role: 'user', content: text }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            // Hit the Next.js API route
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages })
            });

            if (!res.ok) throw new Error("Network response was not ok");

            // We use standard streaming reader implementation to bypass the broken React 19 useChat hook
            const reader = res.body?.getReader();
            const decoder = new TextDecoder();

            // Setup the placeholder message for the AI response
            let aiMessageId = (Date.now() + 1).toString();
            setMessages((prev) => [...prev, { id: aiMessageId, role: 'assistant', content: '' }]);

            while (reader) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });

                // Directly append the raw decoded chunk
                setMessages((prev) => prev.map(m => {
                    if (m.id === aiMessageId) {
                        return { ...m, content: m.content + chunk };
                    }
                    return m;
                }));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const messagesContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    return (
        <div className="min-h-screen bg-white flex flex-col pt-32 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(194,65,12,0.05),_transparent_50%)]" />
            
            {/* Header Section */}
            <div className="max-w-4xl mx-auto w-full text-center mb-16 relative z-10">
                <div className="flex justify-center mb-8">
                    <div className="h-20 w-20 brand-gradient rounded-3xl flex items-center justify-center text-white shadow-brand rotate-3">
                        <Scale size={40} className="-rotate-3" />
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="w-20 h-1 brand-gradient rounded-full mx-auto" />
                    <h1 className="font-serif text-6xl md:text-7xl font-black text-black leading-tight tracking-tighter">
                        PALF Legal <span className="text-brand italic">AI Assistant</span>
                    </h1>
                    <p className="text-xl text-muted max-w-2xl mx-auto font-sans font-light leading-relaxed italic">
                        "Get quick, intelligent guidance on legal matters, corporate law, and business registration. Let our AI point you in the right direction."
                    </p>
                </div>
            </div>

            {/* Chat Container */}
            <div className="max-w-4xl mx-auto w-full flex-grow flex flex-col luxury-card bg-white/90 backdrop-blur-xl rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden border border-accent/30 h-[700px] relative z-10">
                {/* Messages Layout */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={messagesContainerRef}>
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-40">
                            <div className="brand-gradient p-6 rounded-3xl shadow-brand">
                                <Bot size={48} className="text-white" />
                            </div>
                            <div className="space-y-2">
                                <p className="font-serif text-3xl font-black text-black italic">Hello! I am the PALF AI Assistant.</p>
                                <p className="font-sans text-sm uppercase tracking-[0.2em] font-black text-secondary">Prestige Legal Intelligence</p>
                            </div>
                            <p className="font-sans font-light text-muted max-w-sm italic">Ask me about starting a business, commercial law, or any general legal inquiries.</p>
                        </div>
                    ) : (
                        messages.map((m: any) => (
                            <div
                                key={m.id}
                                className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {/* AI Avatar */}
                                {m.role !== 'user' && (
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="h-12 w-12 text-white rounded-2xl flex items-center justify-center brand-gradient shadow-brand">
                                            <Bot size={24} />
                                        </div>
                                    </div>
                                )}

                                {/* Message Bubble */}
                                <div
                                    className={`relative px-8 py-5 text-base shadow-sm rounded-[30px] max-w-[80%] font-sans ${m.role === 'user'
                                        ? 'bg-primary text-white rounded-tr-none shadow-brand/20'
                                        : 'bg-accent/30 text-black border border-accent/50 rounded-tl-none font-medium leading-relaxed'
                                        }`}
                                >
                                    <div className="whitespace-pre-wrap">
                                        {m.content}
                                    </div>
                                </div>

                                {/* User Avatar */}
                                {m.role === 'user' && (
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="h-12 w-12 text-white rounded-2xl flex items-center justify-center bg-primary border border-white/10 shadow-lg">
                                            <User size={24} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}

                    {/* Loading Indicator */}
                    {isLoading && (
                        <div className="flex gap-4 justify-start">
                            <div className="flex-shrink-0 mt-1">
                                <div className="h-12 w-12 text-white rounded-2xl flex items-center justify-center brand-gradient shadow-brand">
                                    <Bot size={24} />
                                </div>
                            </div>
                            <div className="relative px-8 py-5 bg-accent/30 rounded-[30px] rounded-tl-none border border-accent/50 flex items-center space-x-2">
                                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Input Area */}
                <div className="p-8 bg-white/50 backdrop-blur-md border-t border-accent/50 space-y-4">
                    <form onSubmit={onSubmit} className="relative flex items-center max-w-4xl mx-auto">
                        <input
                            className="w-full bg-white border border-accent/50 px-8 pr-32 py-5 rounded-[25px] outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all font-sans text-black font-light placeholder:italic"
                            value={input || ''}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isListening ? "Listening with intelligence..." : "Ask a legal question..."}
                            disabled={isLoading}
                        />
                        <div className="absolute right-3 flex items-center gap-3">
                            {hasRecognition && (
                                <button
                                    type="button"
                                    onClick={toggleListening}
                                    disabled={isLoading}
                                    className={`p-3.5 rounded-2xl transition-all flex items-center justify-center ${isListening
                                        ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
                                        : 'bg-accent/50 text-secondary hover:bg-accent hover:text-black transition-colors'
                                        }`}
                                >
                                    <Mic size={20} />
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={isLoading || !input?.trim()}
                                className="p-3.5 brand-gradient text-white rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center shadow-brand"
                            >
                                <Send size={20} className="translate-x-[1px] translate-y-[-1px]" />
                            </button>
                        </div>
                    </form>
                    <div className="text-center text-[10px] text-muted font-sans font-black uppercase tracking-[0.3em] opacity-40">
                        Strategic Advisory Notice: Accuracy Verification Recommended
                    </div>
                </div>
            </div>
        </div>
    );
}
