'use client';

import { motion } from 'framer-motion';
import { Trophy, Flame, Code2, Target } from 'lucide-react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

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
        <div className="flex justify-between text-xs text-zinc-400 mb-1">
            <span>{label}</span>
            <span>{val}</span>
        </div>
        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
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
        //Rahul 
        <motion.div
            initial={{ opacity: 0, x: isRight ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={clsx(
                "relative w-72 md:w-80 bg-zinc-900/90 backdrop-blur-xl rounded-2xl border border-zinc-800 p-5 shadow-2xl z-10",
                isRight ? "translate-y-8 md:translate-y-12" : "-translate-y-8 md:-translate-y-12"
            )}
            whileHover={{ y: isRight ? 40 : -40, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center border border-zinc-700">
                    <span className="text-zinc-300 font-bold text-sm">{user.name[0].toUpperCase()}</span>
                </div>
                <div>
                    <h3 className="font-bold text-white text-sm">{user.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-zinc-400">
                        <Trophy size={12} className="text-yellow-500" />
                        <span>rating: {user.rating}</span>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="space-y-3 mb-4">
                <StatBar label="Easy" val={user.solved.easy} max={150} color="bg-teal-500" />
                <StatBar label="Medium" val={user.solved.medium} max={400} color="bg-yellow-500" />
                <StatBar label="Hard" val={user.solved.hard} max={100} color="bg-red-500" />
            </div>

            {/* Footer Metrics */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-zinc-800">
                <div className="text-center">
                    <div className="text-xs text-zinc-500 flex justify-center items-center gap-1">
                        <Target size={12} /> Rank
                    </div>
                    <div className="text-sm font-semibold text-white">#{user.rank.toLocaleString()}</div>
                </div>
                <div className="text-center">
                    <div className="text-xs text-zinc-500 flex justify-center items-center gap-1">
                        <Flame size={12} /> Consistency
                    </div>
                    <div className="text-sm font-semibold text-white">{user.consistency}%</div>
                </div>
            </div>

            {/* Active Glow Effect for Higher Rated User */}
            {user.rating > 2000 && (
                <div className="absolute -inset-[1px] bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-2xl -z-10 blur-sm" />
            )}
        </motion.div>
    );
};

export default function HeroRight() {
    return (
        <div className="h-full w-full flex items-center justify-center relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative flex items-center gap-4 md:gap-8">
                <ProfileCard user={userA} />

                {/* VS Badge */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8, type: "spring" }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center"
                >
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-black border-2 border-orange-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.5)]">
                        <span className="font-black text-orange-500 text-lg md:text-xl italic">VS</span>
                    </div>
                </motion.div>

                <ProfileCard user={userB} isRight />
            </div>

            {/* Floating Labels */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-zinc-900/80 backdrop-blur border border-zinc-800 px-4 py-2 rounded-full text-xs text-zinc-400 whitespace-nowrap"
            >
                Only <span className="text-white font-semibold">12%</span> gap in problem solving logic
            </motion.div>
        </div>
    );
}
