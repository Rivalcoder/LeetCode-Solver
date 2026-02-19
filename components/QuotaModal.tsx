"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Key, ArrowRight, X } from "lucide-react";

interface QuotaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdateKey: (newKey: string) => void;
    errorMessage?: string;
    title?: string;
}

export default function QuotaModal({ isOpen, onClose, onUpdateKey, errorMessage, title }: QuotaModalProps) {
    const [value, setValue] = useState("");
    const [focused, setFocused] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            onUpdateKey(value.trim());
            setValue("");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
                    >

                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <div className="relative z-10 flex flex-col items-center text-center gap-6">

                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                                <AlertTriangle className="w-8 h-8 text-red-400" />
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-white">{title || "API Quota Exceeded"}</h2>
                                <p className="text-white/50 text-sm leading-relaxed">
                                    {errorMessage || "The current API key has reached its usage limit. Please provide a new Google Gemini API key to continue generating solutions."}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="w-full relative group mt-2">
                                <motion.div
                                    animate={focused ? { scale: 1.02 } : { scale: 1 }}
                                    className="relative z-20"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 rounded-xl blur opacity-0 transition-opacity duration-300 ${focused ? 'opacity-100' : ''}`} />

                                    <div className="relative bg-white/5 border border-white/10 rounded-xl p-1 backdrop-blur-xl flex items-center transition-colors focus-within:bg-black/40 focus-within:border-white/20">
                                        <div className="pl-4 text-white/40">
                                            <Key size={20} />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Paste new API Key"
                                            value={value}
                                            onChange={(e) => setValue(e.target.value)}
                                            onFocus={() => setFocused(true)}
                                            onBlur={() => setFocused(false)}
                                            className="w-full bg-transparent border-none text-lg text-white placeholder-white/20 px-4 py-3 font-medium focus:outline-none"
                                            autoFocus
                                        />
                                        <button
                                            type="submit"
                                            disabled={!value.trim()}
                                            className="bg-white text-black p-3 rounded-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ArrowRight size={20} />
                                        </button>
                                    </div>
                                </motion.div>
                            </form>

                            <button
                                onClick={onClose}
                                className="text-white/30 text-xs hover:text-white/60 transition-colors mt-2"
                            >
                                Cancel and go back
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
