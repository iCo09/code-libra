'use client';

import { motion } from 'framer-motion';

export const HeroVisualComponents = {
    ActivityGraph: () => (
        <div className="bg-secondary/50 p-4 rounded-xl border border-border">
            <span className="text-muted-foreground text-xs uppercase tracking-wider">Activity (Last 30 Days)</span>
            <div className="flex items-end gap-1 h-16 mt-4 opacity-80">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: Math.random() * 100 + '%' }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.05 }}
                        className="flex-1 bg-foreground rounded-t-sm opacity-60 hover:opacity-100 transition-opacity"
                    />
                ))}
            </div>
        </div>
    ),

    ComparisonBars: () => (
        <div className="space-y-4">
            {[
                { label: 'Rating', valA: 85, valB: 60, col: 'bg-foreground' },
                { label: 'Consistency', valA: 92, valB: 45, col: 'bg-muted-foreground/40' },
                { label: 'Problem Solving', valA: 78, valB: 65, col: 'bg-muted-foreground/60' },
                { label: 'Speed', valA: 60, valB: 30, col: 'bg-muted-foreground/80' },
            ].map((item) => (
                <div key={item.label}>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{item.label}</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden flex">
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
                <div key={i} className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-lg border border-transparent hover:border-border transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center text-xs text-muted-foreground">WC</div>
                        <div>
                            <div className="text-sm text-foreground font-medium">Weekly Contest 3{80 + i}</div>
                            <div className="text-xs text-muted-foreground">Rank: #{1200 - i * 100}</div>
                        </div>
                    </div>
                    <div className="text-muted-foreground text-sm font-semibold">+1{i} Rating</div>
                </div>
            ))}
        </div>
    )
};
