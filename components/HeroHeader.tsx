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
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-foreground text-xs md:text-sm font-medium mb-6"
            >
                <Sparkles size={14} />
                <span>#1 Competitive Programming Tracker</span>
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight"
            >
                Track Your <span className="text-muted-foreground font-serif italic">Coding Journey</span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed"
            >
                Analyze Leetcode profiles, filter contest-wise questions, get personalized topic recommendations based on your data. Compare profiles and share your achievements on social media.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
            >
                <div className="relative group w-full max-w-sm">
                    <div className="absolute -inset-0.5 bg-foreground rounded-lg blur opacity-10 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative flex items-center bg-card rounded-lg p-1 pr-1 border border-border">
                        <input
                            type="text"
                            placeholder="Enter leetcode username"
                            className="w-full bg-transparent text-foreground px-4 py-3 outline-none placeholder:text-muted-foreground"
                        />
                        <button className="bg-foreground cursor-pointer hover:bg-foreground/90 text-background font-semibold px-6 py-3 rounded-md transition-colors whitespace-nowrap">
                            Get Started
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
