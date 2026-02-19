"use client";
import { useState } from "react";
import ApiKeyInput from "@/components/ApiKeyInput";
import ProblemInput from "@/components/ProblemInput";
import SolutionDisplay from "@/components/SolutionDisplay";
import { getProblemSolution, SolutionData } from "@/lib/gemini";
import { AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [solution, setSolution] = useState<SolutionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    if (!apiKey) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getProblemSolution(apiKey, query);
      setSolution(data);
    } catch (err: any) {
      console.error("Full Gemini Error:", err);
      // Check for 429 or quota related messages
      if (err.message.includes("429") || err.message.toLowerCase().includes("quota") || err.message.includes("403")) {
        setError("Quota Limit Reached. Google's Free Tier has rate limits (15 RPM). Please change your API Key or wait a moment.");
      } else {
        setError(err.message || "Engine Error: Check your API Key and Network.");
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSolution(null);
    setError(null);
  };

  const clearKey = () => {
    setApiKey(null);
    setError(null);
  }

  return (
    <main className="min-h-screen relative bg-black text-white overflow-x-hidden selection:bg-indigo-500/30">

      <AnimatePresence mode="wait">
        {!apiKey ? (
          <motion.div
            key="key-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ApiKeyInput onSave={setApiKey} />
          </motion.div>
        ) : solution ? (
          <motion.div
            key="solution-page"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container mx-auto px-4 py-8 relative z-10"
          >
            <SolutionDisplay data={solution} onReset={reset} />
          </motion.div>
        ) : (
          <motion.div
            key="search-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col items-center justify-center p-6 relative"
          >
            {/* Top Right Change Key Button */}
            <div className="absolute top-6 right-6 z-20">
              <button
                onClick={clearKey}
                className="text-white/40 hover:text-white text-sm font-medium transition-colors border border-white/10 px-4 py-2 rounded-full hover:bg-white/5"
              >
                Change Key
              </button>
            </div>

            <ProblemInput onSearch={handleSearch} isLoading={loading} />

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="mt-12 p-8 bg-red-500/5 border border-red-500/20 rounded-3xl text-red-200 flex flex-col items-center gap-6 max-w-lg backdrop-blur-2xl shadow-2xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
                <div className="bg-red-500/20 p-4 rounded-full relative z-10">
                  <AlertCircle size={32} className="text-red-400" />
                </div>
                <div className="text-center space-y-2 relative z-10">
                  <h3 className="text-xl font-bold tracking-tight text-red-100">Connection Interrupted</h3>
                  <p className="text-red-300/80 leading-relaxed font-medium">
                    {error}
                  </p>
                </div>

                <button
                  onClick={clearKey}
                  className="relative z-10 px-8 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 font-bold transition-all hover:scale-105 active:scale-95"
                >
                  Change API Key
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ultra-Minimal Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-3xl z-[100] flex flex-col items-center justify-center cursor-wait"
          >
            <div className="relative flex flex-col items-center gap-12">
              <div className="relative w-24 h-24">
                <span className="absolute inset-0 border-t-2 border-white rounded-full animate-spin"></span>
                <span className="absolute inset-2 border-r-2 border-white/30 rounded-full animate-spin duration-reverse"></span>
              </div>

              <div className="text-center space-y-2">
                <motion.h2
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl font-black tracking-tighter text-white"
                >
                  GENERATING
                </motion.h2>
                <p className="text-white/40 font-medium tracking-widest text-sm uppercase">
                  Constructing Logic Solution
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
