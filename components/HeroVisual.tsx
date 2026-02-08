'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HeroVisual() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const heroImage = mounted && resolvedTheme === 'dark' ? '/hero-image-dark.png' : '/hero-image-light.png';

    return (
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8 relative z-10 mt-12 pb-20">
            <motion.div
                initial={{ opacity: 0, y: 100, rotateX: 20 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
                className="relative rounded-xl bg-card border border-border shadow-2xl overflow-hidden ring-1 ring-border"
                style={{ perspective: 1000 }}
            >
                <div className="bg-muted/50 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-4">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex-1 text-center">
                        <div className="inline-flex items-center justify-center gap-2 bg-background/50 rounded-full px-4 py-1 border border-border max-w-md mx-auto">
                            <span className="text-xs text-muted-foreground">codelibra.vercel.app/compare-profile</span>
                        </div>
                    </div>
                    <Link
                        href="/compare-profile"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-foreground/10 hover:bg-foreground/20 text-foreground text-xs font-medium transition-colors cursor-pointer group"
                        title="Jump to Compare"
                    >
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>

                <div className="bg-card">
                    <div className="flex items-center justify-center">
                        <img
                            src={heroImage}
                            alt="LeetCode Contest Tracker Hero"
                            className="w-full h-auto select-none pointer-events-none rounded-lg"
                            draggable={false}
                        />
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-card to-transparent pointer-events-none" />
            </motion.div>
        </div>
    );
}
