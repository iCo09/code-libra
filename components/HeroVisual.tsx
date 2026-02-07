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
                className="relative rounded-xl bg-[#0a0a0a] border border-zinc-800 shadow-2xl overflow-hidden ring-1 ring-white/10"
                style={{ perspective: 1000 }}
            >
                {/* Browser Header */}
                <div className="bg-zinc-900/50 backdrop-blur border-b border-zinc-800 px-4 py-3 flex items-center gap-4">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-zinc-700" />
                        <div className="w-3 h-3 rounded-full bg-zinc-700" />
                        <div className="w-3 h-3 rounded-full bg-zinc-700" />
                    </div>
                    <div className="flex-1 text-center">
                        <div className="inline-flex items-center justify-center gap-2 bg-zinc-950/50 rounded-full px-4 py-1 border border-zinc-800/50 max-w-md mx-auto">
                            <span className="text-xs text-zinc-500">leetcode-tracker.com/dashboard/compare</span>
                        </div>
                    </div>
                    <div className="w-16"></div> {/* Spacer for balance */}
                </div>

                {/* Dashboard Content */}
                <div className="p-6 md:p-8 bg-zinc-950">
                    {/* Split layout for comparison */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Side: Summary Metrics */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-semibold text-white">Overview</h3>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 bg-brand-lime text-brand-dark text-xs font-bold rounded">Export</button>
                                    <button className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs rounded border border-zinc-700">Insights</button>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                                    <span className="text-zinc-500 text-xs uppercase tracking-wider">Total Solved</span>
                                    <div className="text-2xl font-bold text-white mt-1">452</div>
                                    <div className="text-brand-lime text-xs mt-1">Top 15%</div>
                                </div>
                                <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                                    <span className="text-zinc-500 text-xs uppercase tracking-wider">Contest Rating</span>
                                    <div className="text-2xl font-bold text-white mt-1">1,840</div>
                                    <svg className="w-full h-8 mt-2 stroke-brand-lime fill-none" viewBox="0 0 100 40">
                                        <path d="M0 35 C 20 25, 40 35, 60 10 S 100 5, 100 5" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                            </div>

                            <HeroVisualComponents.ActivityGraph />
                        </div>

                        {/* Right Side: Comparison Table or Visual */}
                        <div className="bg-zinc-900/30 rounded-xl border border-zinc-800 p-6">
                            <h4 className="text-sm font-medium text-zinc-400 mb-4">Metric Comparison</h4>
                            <HeroVisualComponents.ComparisonBars />
                        </div>
                    </div>

                    {/* Bottom Section: Recent Activity List */}
                    <div className="mt-8">
                        <h4 className="text-sm font-medium text-zinc-400 mb-4">Recent Contests</h4>
                        <HeroVisualComponents.RecentContests />
                    </div>
                </div>

                {/* Overlay Gradient for Fade effect at bottom like in reference */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
            </motion.div>
        </div>
    );
}
