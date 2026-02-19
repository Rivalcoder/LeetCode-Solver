"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Sparkles } from "lucide-react";

interface ApiKeyInputProps {
    onSave: (key: string) => void;
}

export default function ApiKeyInput({ onSave }: ApiKeyInputProps) {
    const [value, setValue] = useState("");
    const [focused, setFocused] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) onSave(value.trim());
    };

    return (
        <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black text-white selection:bg-indigo-500/30">

            {/* Ambient Background Lights */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '7s' }} />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center text-center gap-12"
            >
                {/* Hero section */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-indigo-300 backdrop-blur-sm"
                    >
                        <Sparkles size={14} />
                        <span>Power of AI</span>
                    </motion.div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 leading-[0.9]">
                        Unlock <br />
                        Insight.
                    </h1>
                </div>

                {/* Input Section */}
                <form onSubmit={handleSubmit} className="w-full relative group">
                    <motion.div
                        animate={focused ? { scale: 1.02, opacity: 1 } : { scale: 1, opacity: 0.8 }}
                        className="relative z-20"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-0 transition-opacity duration-500 ${focused ? 'opacity-30' : 'group-hover:opacity-20'}`} />

                        <div className="relative bg-white/5 border border-white/10 rounded-2xl p-2 backdrop-blur-xl flex items-center transition-all duration-300 focus-within:bg-black/40 focus-within:border-white/20">
                            <div className="pl-6 text-white/40">
                                <Lock size={24} />
                            </div>
                            <input
                                type="password"
                                placeholder="Paste API Key"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                onFocus={() => setFocused(true)}
                                onBlur={() => setFocused(false)}
                                className="w-full bg-transparent border-none text-2xl md:text-3xl text-white placeholder-white/20 px-6 py-6 font-medium focus:outline-none tracking-tight"
                                autoFocus
                            />
                            <button
                                type="submit"
                                disabled={!value.trim()}
                                className="bg-white text-black p-4 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-0 disabled:scale-50 duration-300 shadow-lg shadow-white/10"
                            >
                                <ArrowRight size={28} />
                            </button>
                        </div>
                    </motion.div>
                </form>

                {/* Footer Links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex gap-8 text-sm font-medium text-white/30"
                >
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors border-b border-transparent hover:border-white/50 pb-0.5">
                        Get API Key ↗
                    </a>
                    <span className="w-px h-4 bg-white/10"></span>
                    <span className="cursor-help hover:text-white transition-colors">Secure Connection</span>
                </motion.div>
            </motion.div>
        </div>
    );
}
