'use client';

import { motion } from 'framer-motion';
import { HeroVisualComponents } from './HeroVisualComponents';

export default function HeroVisual() {
    return (
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8 relative z-10 -mt-8 pb-20">
            <motion.div
                initial={{ opacity: 0, y: 100, rotateX: 20 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
                className="relative rounded-xl bg-card border border-border shadow-2xl overflow-hidden ring-1 ring-border"
                style={{ perspective: 1000 }}
            >
                {/* Browser Header */}
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
                    <div className="w-16"></div> {/* Spacer for balance */}
                </div>

                {/* Dashboard Content */}
                <div className="p-6 md:p-8 bg-card">
                    {/* Split layout for comparison */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Side: Summary Metrics */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-semibold text-foreground">Overview</h3>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 bg-foreground text-background text-xs font-bold rounded">Export</button>
                                    <button className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded border border-border">Insights</button>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-secondary/50 p-4 rounded-xl border border-border">
                                    <span className="text-muted-foreground text-xs uppercase tracking-wider">Total Solved</span>
                                    <div className="text-2xl font-bold text-foreground mt-1">452</div>
                                    <div className="text-muted-foreground text-xs mt-1">Top 15%</div>
                                </div>
                                <div className="bg-secondary/50 p-4 rounded-xl border border-border">
                                    <span className="text-muted-foreground text-xs uppercase tracking-wider">Contest Rating</span>
                                    <div className="text-2xl font-bold text-foreground mt-1">1,840</div>
                                    <svg className="w-full h-8 mt-2 stroke-foreground fill-none" viewBox="0 0 100 40">
                                        <path d="M0 35 C 20 25, 40 35, 60 10 S 100 5, 100 5" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                            </div>

                            <HeroVisualComponents.ActivityGraph />
                        </div>

                        {/* Right Side: Comparison Table or Visual */}
                        <div className="bg-secondary/30 rounded-xl border border-border p-6">
                            <h4 className="text-sm font-medium text-muted-foreground mb-4">Metric Comparison</h4>
                            <HeroVisualComponents.ComparisonBars />
                        </div>
                    </div>

                    {/* Bottom Section: Recent Activity List */}
                    <div className="mt-8">
                        <h4 className="text-sm font-medium text-muted-foreground mb-4">Recent Contests</h4>
                        <HeroVisualComponents.RecentContests />
                    </div>
                </div>

                {/* Overlay Gradient for Fade effect at bottom like in reference */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-card to-transparent pointer-events-none" />
            </motion.div>
        </div>
    );
}
