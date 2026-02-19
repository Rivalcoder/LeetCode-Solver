"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { SolutionData } from "@/lib/gemini";
import Visualizer, { CodeBlock } from "./Visualizer";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Zap, Code, GitCommit, Copy, Check, Clock, Database } from "lucide-react";

export default function SolutionDisplay({ data, onReset }: { data: SolutionData, onReset: () => void }) {
    const [activeTab, setActiveTab] = useState<"visual" | "optimized" | "brute">("visual");

    return (
        <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 pb-20">
            {/* Header / Nav */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between"
            >
                <div className="flex items-center gap-4">
                    <button
                        onClick={onReset}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors group"
                    >
                        <ArrowLeft size={20} className="text-white/60 group-hover:text-white transition-colors" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white">{data.title}</h1>
                        <span className={`text-xs font-bold uppercase tracking-wider ${data.difficulty === 'Easy' ? 'text-emerald-400' :
                            data.difficulty === 'Medium' ? 'text-amber-400' :
                                'text-red-400'
                            }`}>
                            {data.difficulty}
                        </span>
                    </div>
                </div>

                <div className="flex bg-white/5 rounded-full p-1 border border-white/5">
                    {[
                        { id: 'visual', label: 'Flowchart', icon: <GitCommit size={14} /> },
                        { id: 'optimized', label: 'Optimized', icon: <Zap size={14} /> },
                        { id: 'brute', label: 'Brute Force', icon: <Code size={14} /> }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeTab === tab.id
                                ? 'bg-white text-black shadow-lg'
                                : 'text-white/40 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {tab.icon}
                            <span className="hidden md:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </motion.header>

            <main className="container mx-auto max-w-7xl px-4 py-8">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-8 p-6 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm"
                >
                    <p className="text-lg text-white/80 leading-relaxed font-light">
                        {data.description}
                    </p>
                </motion.div>

                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'visual' && (
                        <Visualizer
                            mermaidChart={data.visualFlow.mermaidChart}
                            steps={data.visualFlow.steps}
                        />
                    )}

                    {activeTab === 'optimized' && (
                        <CodeView
                            approach={data.optimized.approach}
                            code={data.optimized.code}
                            time={data.optimized.timeComplexity}
                            space={data.optimized.spaceComplexity}
                            accentColor="emerald"
                        />
                    )}

                    {activeTab === 'brute' && (
                        <CodeView
                            approach={data.bruteForce.approach}
                            code={data.bruteForce.code}
                            time={data.bruteForce.timeComplexity}
                            space={data.bruteForce.spaceComplexity}
                            accentColor="amber"
                        />
                    )}
                </motion.div>
            </main>
        </div>
    );
}

function CodeView({ approach, code, time, space, accentColor }: { approach: string, code: { javascript: string, python?: string, java?: string, cpp?: string }, time: string, space: string, accentColor: string }) {
    const [language, setLanguage] = useState<"javascript" | "python" | "java" | "cpp">("javascript");

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white/5 border border-white/5 rounded-3xl p-8 space-y-6">
                    <h3 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                        <Zap className={`text-${accentColor}-400 fill-${accentColor}-400`} size={24} />
                        Strategy
                    </h3>
                    <div className="text-white/80 leading-relaxed font-light text-base md:text-lg prose prose-invert prose-p:my-2 prose-li:my-1 prose-strong:text-white/90 max-w-none">
                        <ReactMarkdown
                            components={{
                                ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-2" {...props} />,
                                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 space-y-2" {...props} />,
                                li: ({ node, ...props }) => <li className="marker:text-white/40" {...props} />,
                                strong: ({ node, ...props }) => <strong className={`font-bold text-${accentColor}-400`} {...props} />
                            }}
                        >
                            {approach}
                        </ReactMarkdown>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                        <div className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Clock size={14} /> Time Complexity
                        </div>
                        <div className="text-xl font-medium text-white/90">{time}</div>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                        <div className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Database size={14} /> Space Complexity
                        </div>
                        <div className="text-xl font-medium text-white/90">{space}</div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2 relative group rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-2xl h-full min-h-[500px] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/5 flex-shrink-0">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                        {[
                            { id: 'javascript', label: 'JavaScript' },
                            { id: 'python', label: 'Python' },
                            { id: 'java', label: 'Java' },
                            { id: 'cpp', label: 'C++' }
                        ].map((lang) => (
                            <button
                                key={lang.id}
                                onClick={() => setLanguage(lang.id as any)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${language === lang.id
                                    ? `bg-${accentColor}-500/20 text-${accentColor}-300 border border-${accentColor}-500/30`
                                    : 'text-white/40 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {lang.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 w-full relative">
                    <div className="absolute inset-0 overflow-auto custom-scrollbar">
                        <CodeBlock code={code[language] || "// Solutions are being generated..."} language={language} />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Add global styles for Prism if not already added by visualizer
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.innerHTML = `
        /* Shared Syntax Highlighting */
        code[class*="language-"],
        pre[class*="language-"] {
            color: #e2e8f0;
            text-shadow: none;
            background: transparent;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.9em;
            line-height: 1.5;
            direction: ltr;
            text-align: left;
            white-space: pre;
            word-spacing: normal;
            word-break: normal;
            tab-size: 4;
            hyphens: none;
        }
        .token.comment { color: #94a3b8; font-style: italic; }
        .token.keyword { color: #c084fc; font-weight: bold; }
        .token.function { color: #60a5fa; }
        .token.string { color: #34d399; }
        .token.selector { color: #f87171; }
        .token.operator { color: #e2e8f0; }
        .token.punctuation { color: #94a3b8; }
    `;
    document.head.appendChild(style);
}
