'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HeroHeader() {
    return (
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto px-6 pt-20 md:pt-32 pb-12 z-20 relative">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lime/10 border border-brand-lime/20 text-brand-lime text-xs md:text-sm font-medium mb-6"
            >
                <Sparkles size={14} />
                <span>#1 Competitive Programming Tracker</span>
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-tight"
            >
                Transform Your <span className="text-brand-lime font-serif italic">Coding Journey</span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl leading-relaxed"
            >
                Analyze LeetCode profiles, compare contest performance, and visualize your growth with the most advanced analytics dashboard.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
            >
                <div className="relative group w-full max-w-xs">
                    <div className="absolute -inset-0.5 bg-brand-lime rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative flex items-center bg-zinc-900 rounded-lg p-1 pr-1 border border-zinc-800">
                        <input
                            type="text"
                            placeholder="Enter LeetCode Username"
                            className="w-full bg-transparent text-white px-4 py-3 outline-none placeholder:text-zinc-600"
                        />
                        <button className="bg-brand-lime hover:bg-brand-lime-hover text-brand-dark font-semibold px-6 py-3 rounded-md transition-colors whitespace-nowrap">
                            Compare
                        </button>
                    </div>
                </div>
                <p className="text-zinc-500 text-sm mt-4 sm:mt-0">or</p>
                <button className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-all border border-zinc-700">
                    View Demo
                </button>
            </motion.div>
        </div>
    );
}
