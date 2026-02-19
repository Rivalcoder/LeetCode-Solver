"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Search, Zap, Code2 } from "lucide-react";

interface ProblemInputProps {
    onSearch: (query: string) => void;
    isLoading: boolean;
}

export default function ProblemInput({ onSearch, isLoading }: ProblemInputProps) {
    const [query, setQuery] = useState("");
    const [focused, setFocused] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim() && !isLoading) onSearch(query.trim());
    };

    return (
        <div className="relative w-full min-h-[80vh] flex flex-col items-center justify-center overflow-hidden bg-black text-white selection:bg-indigo-500/30">

            {/* Ambient Background Lights (Matching ApiKeyInput) */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s' }} />
                <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-3xl px-6 flex flex-col items-center text-center gap-12"
            >
                {/* Minimal Header */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-indigo-300 backdrop-blur-sm"
                    >
                        <Zap size={14} className="fill-indigo-300" />
                        <span>Ready to Analyze</span>
                    </motion.div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 leading-[0.9]">
                        Decode <br />
                        Logic.
                    </h1>
                </div>

                {/* Input Section */}
                <form onSubmit={handleSubmit} className="w-full relative group max-w-2xl">
                    <motion.div
                        animate={focused ? { scale: 1.02, opacity: 1 } : { scale: 1, opacity: 0.8 }}
                        className="relative z-20"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 rounded-2xl blur opacity-0 transition-opacity duration-500 ${focused ? 'opacity-30' : 'group-hover:opacity-20'}`} />

                        <div className="relative bg-white/5 border border-white/10 rounded-2xl p-2 backdrop-blur-xl flex items-center transition-all duration-300 focus-within:bg-black/40 focus-within:border-white/20">
                            <div className="pl-6 text-white/40">
                                <Search size={24} />
                            </div>
                            <input
                                type="text"
                                placeholder="LeetCode problem name or number..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onFocus={() => setFocused(true)}
                                onBlur={() => setFocused(false)}
                                disabled={isLoading}
                                className="w-full bg-transparent border-none text-2xl md:text-3xl text-white placeholder-white/20 px-6 py-6 font-medium focus:outline-none tracking-tight"
                                autoFocus
                            />
                            <button
                                type="submit"
                                disabled={!query.trim() || isLoading}
                                className="bg-white text-black p-4 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-0 disabled:scale-50 duration-300 shadow-lg shadow-white/10 min-w-[60px] flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                ) : (
                                    <ArrowRight size={28} />
                                )}
                            </button>
                        </div>
                    </motion.div>
                </form>

                {/* Quick Tags / Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-wrap justify-center gap-6 text-sm font-medium text-white/30"
                >
                    {["Two Sum", "LRU Cache", "Merge Sort", "N-Queens"].map((tag) => (
                        <button
                            key={tag}
                            onClick={() => setQuery(tag)}
                            className="hover:text-white transition-colors border-b border-transparent hover:border-white/50 pb-0.5"
                        >
                            {tag}
                        </button>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
}
