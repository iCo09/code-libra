'use client';

import { motion } from 'framer-motion';
import { Trophy, Flame, Code2, Target } from 'lucide-react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import Image from 'next/image';

// Simulated data for profiles
const userA = {
    name: 'dev_alex',
    rating: 1650,
    solved: { easy: 45, medium: 80, hard: 12 },
    rank: 12403,
    consistency: 65,
};

const userB = {
    name: 'algo_master_99',
    rating: 2150,
    solved: { easy: 120, medium: 340, hard: 85 },
    rank: 452,
    consistency: 92,
};

const StatBar = ({ label, val, max, color }: { label: string; val: number; max: number; color: string }) => (
    <div className="mb-2">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>{label}</span>
            <span>{val}</span>
        </div>
        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(val / max) * 100}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className={clsx('h-full rounded-full', color)}
            />
        </div>
    </div>
);

const ProfileCard = ({ user, isRight = false }: { user: typeof userA; isRight?: boolean }) => {
    return (
        //Rahul Bisht
        <motion.div
            initial={{ opacity: 0, x: isRight ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={clsx(
                "relative w-72 md:w-80 bg-card/90 backdrop-blur-xl rounded-2xl border border-border p-5 shadow-2xl z-10",
                isRight ? "translate-y-8 md:translate-y-12" : "-translate-y-8 md:-translate-y-12"
            )}
            whileHover={{ y: isRight ? 40 : -40, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border border-border">
                    <span className="text-secondary-foreground font-bold text-sm">{user.name[0].toUpperCase()}</span>
                </div>
                <div>
                    <h3 className="font-bold text-foreground text-sm">{user.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Trophy size={12} className="text-foreground" />
                        <span>rating: {user.rating}</span>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="space-y-3 mb-4">
                <StatBar label="Easy" val={user.solved.easy} max={150} color="bg-muted-foreground/40" />
                <StatBar label="Medium" val={user.solved.medium} max={400} color="bg-muted-foreground/60" />
                <StatBar label="Hard" val={user.solved.hard} max={100} color="bg-muted-foreground/80" />
            </div>

            {/* Footer Metrics */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border">
                <div className="text-center">
                    <div className="text-xs text-muted-foreground flex justify-center items-center gap-1">
                        <Target size={12} /> Rank
                    </div>
                    <div className="text-sm font-semibold text-foreground">#{user.rank.toLocaleString()}</div>
                </div>
                <div className="text-center">
                    <div className="text-xs text-muted-foreground flex justify-center items-center gap-1">
                        <Flame size={12} /> Consistency
                    </div>
                    <div className="text-sm font-semibold text-foreground">{user.consistency}%</div>
                </div>
            </div>

            {/* Active Glow Effect for Higher Rated User */}
            {user.rating > 2000 && (
                <div className="absolute -inset-[1px] bg-gradient-to-r from-foreground/20 to-muted-foreground/20 rounded-2xl -z-10 blur-sm" />
            )}
        </motion.div>
    );
};

export default function HeroRight() {
    return (
        <div className="h-full w-full flex items-center justify-center relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-foreground/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative flex items-center gap-4 md:gap-8">
                <ProfileCard user={userA} />

                {/* VS Badge */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8, type: "spring" }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center"
                >
                    <div className="relative w-12 h-12 md:w-16 md:h-16">
                        <Image
                            src="/vs_icon.png"
                            alt="VS"
                            fill
                            className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] dark:invert"
                        />
                    </div>
                </motion.div>

                <ProfileCard user={userB} isRight />
            </div>

            {/* Floating Labels */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur border border-border px-4 py-2 rounded-full text-xs text-muted-foreground whitespace-nowrap"
            >
                Only <span className="text-foreground font-semibold">12%</span> gap in problem solving logic
            </motion.div>
        </div>
    );
}
