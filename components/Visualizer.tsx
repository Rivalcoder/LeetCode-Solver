"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MermaidChart from "./MermaidChart";
import { SolutionData, SolutionStep } from "@/lib/gemini";
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw, Copy, Check, ExternalLink, Maximize2, Minimize2 } from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "prismjs/themes/prism-twilight.css";

// Manually load languages in useEffect instead
// import "prismjs/themes/prism-twilight.css"; (imported via dynamic css or global usually better but css import is fine in nextjs)
import "prismjs/themes/prism-twilight.css";

// ... other imports

interface VisualizerProps {
    mermaidChart: string;
    steps: SolutionStep[];
    fullCode?: string;
}

export default function Visualizer({ mermaidChart, steps, fullCode }: VisualizerProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Dynamic import for Prism to avoid SSR issues
    useEffect(() => {
        const loadPrism = async () => {
            const Prism = (await import("prismjs")).default;
            await import("prismjs/components/prism-clike"); // Core dependency
            await import("prismjs/components/prism-javascript");
            await import("prismjs/components/prism-typescript");
            await import("prismjs/components/prism-python");
            await import("prismjs/components/prism-java");
            await import("prismjs/components/prism-c");
            await import("prismjs/components/prism-cpp");
            Prism.highlightAll();
        };
        loadPrism();
    }, [currentStep, isFullscreen]); // Trigger highlight on step change or fullscreen toggle

    const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

    return (
        <>
            <div className={`grid grid-cols-1 lg:grid-cols-5 gap-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-black p-6' : ''}`}>

                {/* Visual Chart Area */}
                <div className={`lg:col-span-3 bg-[#0a0a0a] border border-white/10 rounded-3xl relative overflow-hidden group flex flex-col ${isFullscreen ? 'h-full' : 'h-[600px]'}`}>

                    {/* Toolbar */}
                    <div className="absolute top-4 right-4 z-20 flex gap-2">
                        <button
                            onClick={toggleFullscreen}
                            className="p-2 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white rounded-lg transition-all backdrop-blur-md"
                        >
                            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                        </button>
                    </div>

                    <div className="absolute top-4 left-6 z-20 flex items-center gap-2 pointer-events-none">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">Interactive Canvas</span>
                    </div>

                    {/* Zoomable Canvas */}
                    <div className="flex-1 w-full h-full cursor-grab active:cursor-grabbing bg-[#0a0a0a/50] relative overflow-hidden">
                        <TransformWrapper
                            initialScale={1}
                            minScale={0.2}
                            maxScale={4}
                            centerOnInit={true}
                            limitToBounds={false}
                            wheel={{ step: 0.1 }}
                        >
                            {({ zoomIn, zoomOut, resetTransform }) => (
                                <>
                                    <div className="absolute bottom-4 right-4 z-20 flex gap-2 pointer-events-auto">
                                        <button onClick={() => zoomIn(0.2)} className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-bold text-lg">+</button>
                                        <button onClick={() => zoomOut(0.2)} className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-bold text-lg">-</button>
                                        <button onClick={() => resetTransform()} className="px-3 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-xs font-bold uppercase tracking-wider">Fit</button>
                                    </div>

                                    <TransformComponent
                                        wrapperClass="!w-full !h-full bg-transparent"
                                        contentClass="!w-full !h-full flex items-center justify-center pointer-events-none"
                                    >
                                        <div className="w-full h-full flex items-center justify-center pointer-events-auto p-12">
                                            <div className="scale-100 origin-center bg-transparent">
                                                <MermaidChart chart={mermaidChart} />
                                            </div>
                                        </div>
                                    </TransformComponent>
                                </>
                            )}
                        </TransformWrapper>
                    </div>

                    <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <p className="text-[10px] uppercase tracking-widest text-white/20">Scroll to Zoom • Drag to Pan</p>
                    </div>
                </div>

                {/* Controls Area */}
                <div className={`lg:col-span-2 flex flex-col gap-6 ${isFullscreen ? 'hidden lg:flex' : ''} h-[600px]`}>
                    <div className="flex-1 bg-white/5 border border-white/5 rounded-3xl p-8 relative flex flex-col backdrop-blur-md">
                        {/* Progress Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest">
                                <span className="w-4 h-px bg-white/20" />
                                Step {currentStep + 1}/{steps.length}
                            </div>
                            <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-indigo-500"
                                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Animated Step Content */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar"
                            >
                                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-tight">
                                    {steps[currentStep]?.text}
                                </h3>

                                {steps[currentStep]?.codeSnippet && (
                                    <div className="relative group/code">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-20 blur group-hover/code:opacity-40 transition duration-500" />
                                        <div className="relative bg-[#0f0f12] rounded-xl overflow-hidden border border-white/10 shadow-xl">
                                            <CodeBlock code={steps[currentStep].codeSnippet} language="javascript" />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Player Controls */}
                        <div className="grid grid-cols-4 gap-2 border-t border-white/10 pt-6 mt-6">
                            <button
                                onClick={() => { setCurrentStep(0); setIsPlaying(false); }}
                                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all flex items-center justify-center group"
                            >
                                <RotateCcw size={18} className="group-hover:-rotate-90 transition-transform" />
                            </button>
                            <button
                                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                                disabled={currentStep === 0}
                                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-30 transition-all flex items-center justify-center"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="p-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] flex items-center justify-center active:scale-95"
                            >
                                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                            </button>
                            <button
                                onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
                                disabled={currentStep === steps.length - 1}
                                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-30 transition-all flex items-center justify-center"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Style for Syntax Highlighting Overrides */}
            <style jsx global>{`
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
                
                /* Keyword */
                .token.keyword { color: #c084fc; font-weight: bold; } /* Purple-400 */
                /* Built-in */
                .token.builtin { color: #38bdf8; } /* Sky-400 */
                /* Class name */
                .token.class-name { color: #fbbf24; } /* Amber-400 */
                /* Function */
                .token.function { color: #60a5fa; } /* Blue-400 */
                /* Boolean */
                .token.boolean { color: #f87171; } /* Red-400 */
                /* Number */
                .token.number { color: #f87171; } /* Red-400 */
                /* String */
                .token.string { color: #34d399; } /* Emerald-400 */
                /* Comment */
                .token.comment { color: #94a3b8; font-style: italic; } /* Slate-400 */
                /* Operator */
                .token.operator { color: #e2e8f0; } /* Slate-200 */
                /* Variable */
                .token.variable { color: #e2e8f0; } /* Slate-200 */
            `}</style>
        </>
    );
}

// Helper to display full code view with syntax highlighting
export function CodeBlock({ code, language = "javascript" }: { code: string, language?: string }) {
    useEffect(() => {
        // Dynamic import here too to ensure it runs client-side
        const highlight = async () => {
            const Prism = (await import("prismjs")).default;
            Prism.highlightAll();
        }
        highlight();
    }, [code]); // Re-run when code changes

    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group overflow-hidden bg-[#0a0a0a]">
            <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                <div className="flex gap-1.5 opacity-50">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                </div>
                <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-md hover:bg-white/10 text-white/40 hover:text-white transition-all"
                >
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
            </div>

            <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed custom-scrollbar max-h-[400px]">
                <code className={`language-${language} text-white/90 block`}>
                    {code}
                </code>
            </pre>
        </div>
    );
}
