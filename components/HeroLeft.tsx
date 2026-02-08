'use client';

import { motion } from 'framer-motion';
import { Trophy, TrendingUp, BarChart3, Users, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

const features = [
    {
        icon: Users,
        title: 'Real Profile Comparison',
        description: 'Compare with real users, not just averages.',
    },
    {
        icon: Trophy,
        title: 'Contest Intelligence',
        description: 'Deep dive into contest performance & trends.',
    },
    {
        icon: BarChart3,
        title: 'Profile Value Score',
        description: 'One score to rule your competitive worth.',
    },
    {
        icon: TrendingUp,
        title: 'Strength Breakdown',
        description: 'Granular topic & difficulty analysis.',
    },
];

export default function HeroLeft() {
    return (
        <div className="flex flex-col justify-center h-full px-6 md:px-12 lg:px-16 py-12 md:py-0 z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight">
                    Compare Your <span className="text-muted-foreground">Coding Profile</span>.
                    <br />
                    Know Your <span className="text-muted-foreground">Real Value</span>.
                </h1>
            </motion.div>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed"
            >
                Analyze real LeetCode profiles, compare contest performance, problem-solving depth, and consistency — and see exactly where you stand.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {features.map((feature, index) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                        className="flex items-start space-x-3"
                    >
                        <div className="p-2 rounded-lg bg-secondary text-foreground mt-1">
                            <feature.icon size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
            >
                <button className="px-8 py-4 bg-foreground hover:bg-foreground/90 text-background font-semibold rounded-xl transition-all shadow-lg shadow-foreground/5 hover:shadow-foreground/10 flex items-center justify-center gap-2 group">
                    Compare My Profile
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-card hover:bg-accent text-foreground font-semibold rounded-xl border border-border transition-all flex items-center justify-center">
                    View Sample Comparison
                </button>
            </motion.div>
        </div >
    );
}
