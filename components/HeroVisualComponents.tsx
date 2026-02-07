'use client';

import { motion } from 'framer-motion';

export const HeroVisualComponents = {
    ActivityGraph: () => (
        <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
            <span className="text-zinc-500 text-xs uppercase tracking-wider">Activity (Last 30 Days)</span>
            <div className="flex items-end gap-1 h-16 mt-4 opacity-80">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: Math.random() * 100 + '%' }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.05 }}
                        className="flex-1 bg-brand-lime rounded-t-sm opacity-60 hover:opacity-100 transition-opacity"
                    />
                ))}
            </div>
        </div>
    ),

    ComparisonBars: () => (
        <div className="space-y-4">
            {[
                { label: 'Rating', valA: 85, valB: 60, col: 'bg-brand-lime' },
                { label: 'Consistency', valA: 92, valB: 45, col: 'bg-teal-400' },
                { label: 'Problem Solving', valA: 78, valB: 65, col: 'bg-indigo-400' },
                { label: 'Speed', valA: 60, valB: 30, col: 'bg-purple-400' },
            ].map((item) => (
                <div key={item.label}>
                    <div className="flex justify-between text-xs text-zinc-400 mb-1">
                        <span>{item.label}</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden flex">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: item.valA + '%' }}
                            transition={{ duration: 1.2, delay: 0.8 }}
                            className={`h-full ${item.col}`}
                        />
                    </div>
                </div>
            ))}
        </div>
    ),

    RecentContests: () => (
        <div className="space-y-2">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center p-3 hover:bg-zinc-800/50 rounded-lg border border-transparent hover:border-zinc-800 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-xs text-zinc-400">WC</div>
                        <div>
                            <div className="text-sm text-white font-medium">Weekly Contest 3{80 + i}</div>
                            <div className="text-xs text-zinc-500">Rank: #{1200 - i * 100}</div>
                        </div>
                    </div>
                    <div className="text-brand-lime text-sm font-semibold">+1{i} Rating</div>
                </div>
            ))}
        </div>
    )
};
