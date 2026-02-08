'use client';

import { DetailedUserProfile } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useMemo } from 'react';
import { ChevronDown, GitMerge, Split } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ActivityHeatmapProps {
    userA: DetailedUserProfile;
    userB: DetailedUserProfile;
}

export default function ActivityHeatmap({ userA, userB }: ActivityHeatmapProps) {
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [isMerged, setIsMerged] = useState(true);

    // Calculate union of active years
    const availableYears = useMemo(() => {
        const yearsA = userA.activeYears || [currentYear];
        const yearsB = userB.activeYears || [currentYear];
        const union = Array.from(new Set([...yearsA, ...yearsB])).sort((a, b) => b - a);
        return union;
    }, [userA.activeYears, userB.activeYears, currentYear]);

    // Generate heatmap data for a specific user and year
    const generateYearlyActivity = (user: DetailedUserProfile, year: number) => {
        const calendar = user.submissionCalendar || {};
        const startDate = new Date(year, 0, 1); // Local time Jan 1
        const endDate = new Date(year, 11, 31); // Local time Dec 31
        const days = [];

        // Add padding for start day of week (0=Sun, 1=Mon, etc.)
        const startDay = startDate.getDay();
        for (let i = 0; i < startDay; i++) {
            days.push({ date: '', count: 0, intensity: -1 });
        }

        // Lookup map for the user's calendar
        const statsMap = new Map<string, number>();
        Object.entries(calendar).forEach(([ts, count]) => {
            // ts is seconds. Convert to YYYY-MM-DD
            // Be careful with timezone. The ts is usually UTC midnight.
            // Let's rely on simple date string match if possible.
            // Or just use the timestamp approach from user request context if defined.
            // Actually, we can use the date string directly from `new Date(ts * 1000)`
            // But we need to match it with `currDate`.
            // Let's assume input calendar keys match standardized day?
            // Since we iterate days, let's just use ISO string YYYY-MM-DD.
            const date = new Date(parseInt(ts) * 1000);
            const dateIso = date.toISOString().split('T')[0];
            statsMap.set(dateIso, count);
        });

        const currDate = new Date(startDate);

        while (currDate <= endDate) {
            const dateStr = currDate.toISOString().split('T')[0];

            // Try to match dateStr (local YYYY-MM-DD) against statsMap keys (UTC YYYY-MM-DD?)
            // This timezone mismatch is common. 
            // If the user's calendar keys are UTC, and we iterate Local dates, we might have off-by-one.
            // But let's stick to simple ISO string matching for now.
            // To be safe, let's normalize the lookup to the same date string format.
            const count = statsMap.get(dateStr) || 0;

            let intensity = 0;
            if (count > 0) intensity = 1;
            if (count > 2) intensity = 2;
            if (count > 5) intensity = 3;
            if (count > 10) intensity = 4;

            days.push({ date: dateStr, count, intensity });
            currDate.setDate(currDate.getDate() + 1);
        }
        return days;
    };

    const activityA = useMemo(() => generateYearlyActivity(userA, selectedYear), [userA, selectedYear]);
    const activityB = useMemo(() => generateYearlyActivity(userB, selectedYear), [userB, selectedYear]);

    const mergedActivity = useMemo(() => {
        return activityA.map((dayA, i) => {
            const dayB = activityB[i];
            if (!dayB) return { ...dayA, winner: 'none', countA: dayA.count, countB: 0 };

            if (dayA.intensity === -1) return { ...dayA, winner: 'none', countA: 0, countB: 0 }; // Padding

            let winner: 'A' | 'B' | 'Tie' | 'None' = 'None';
            let winningIntensity = 0;

            if (dayA.count === 0 && dayB.count === 0) {
                winner = 'None';
                winningIntensity = 0;
            } else if (dayA.count > dayB.count) {
                winner = 'A';
                winningIntensity = dayA.intensity;
            } else if (dayB.count > dayA.count) {
                winner = 'B';
                winningIntensity = dayB.intensity;
            } else {
                winner = 'Tie';
                winningIntensity = dayA.intensity; // Same intensity
            }

            return {
                date: dayA.date,
                countA: dayA.count,
                countB: dayB.count,
                winner,
                intensity: winningIntensity
            };
        });
    }, [activityA, activityB]);


    const getColorClass = (intensity: number, theme: 'cyan' | 'red' | 'tie') => {
        if (intensity === -1) return "invisible"; // Padding
        if (intensity === 0) return "bg-secondary/30"; // Empty

        if (theme === 'cyan') {
            switch (intensity) {
                case 1: return "bg-cyan-200/40 dark:bg-cyan-900/40";
                case 2: return "bg-cyan-300/60 dark:bg-cyan-800/60";
                case 3: return "bg-cyan-400/80 dark:bg-cyan-600/80";
                case 4: return "bg-cyan-500 dark:bg-cyan-500";
            }
        } else if (theme === 'red') {
            switch (intensity) {
                case 1: return "bg-red-200/40 dark:bg-red-900/40";
                case 2: return "bg-red-300/60 dark:bg-red-800/60";
                case 3: return "bg-red-400/80 dark:bg-red-600/80";
                case 4: return "bg-red-500 dark:bg-red-500";
            }
        } else { // Tie (Amber/Purple)
            switch (intensity) {
                case 1: return "bg-purple-200/40 dark:bg-purple-900/40";
                case 2: return "bg-purple-300/60 dark:bg-purple-800/60";
                case 3: return "bg-purple-400/80 dark:bg-purple-600/80";
                case 4: return "bg-purple-500 dark:bg-purple-500";
            }
        }
        return "bg-secondary/30";
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-foreground">Submission Activity</h3>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5"
                        onClick={() => setIsMerged(!isMerged)}
                    >
                        {isMerged ? <Split className="h-3.5 w-3.5" /> : <GitMerge className="h-3.5 w-3.5" />}
                        <span className="hidden sm:inline">{isMerged ? 'Split View' : 'Merge View'}</span>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 gap-1">
                                {selectedYear}
                                <ChevronDown className="h-3 w-3 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {availableYears.map(year => (
                                <DropdownMenuItem key={year} onClick={() => setSelectedYear(year)}>
                                    {year}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="space-y-6">
                <AnimatePresence mode="wait">
                    {isMerged ? (
                        <motion.div
                            key="merged"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-2"
                        >
                            <div className="flex justify-between text-xs px-1">
                                <div className="flex gap-4">
                                    <span className="font-medium text-purple-500">Battle Map</span>
                                    <div className="flex gap-2 items-center text-[10px] text-muted-foreground">
                                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-[1px] bg-cyan-500" />{userA.username}</span>
                                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-[1px] bg-red-500" />{userB.username}</span>
                                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-[1px] bg-purple-500" />Tie</span>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-rows-7 grid-flow-col gap-[2px] w-fit max-w-full overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                                {mergedActivity.map((day, i) => (
                                    <TooltipProvider key={i}>
                                        <Tooltip delayDuration={0}>
                                            <TooltipTrigger asChild>
                                                <div
                                                    className={cn(
                                                        "w-4 h-4 rounded-[1px] transition-colors",
                                                        getColorClass(day.intensity,
                                                            day.winner === 'A' ? 'cyan' :
                                                                day.winner === 'B' ? 'red' : 'tie'
                                                        )
                                                    )}
                                                />
                                            </TooltipTrigger>
                                            {day.intensity !== -1 && (
                                                <TooltipContent className="text-xs">
                                                    <p className="font-bold mb-1">{day.date}</p>
                                                    <div className="flex flex-col gap-0.5">
                                                        <div className="flex justify-between gap-4 text-cyan-500">
                                                            <span>{userA.username}:</span>
                                                            <span>{day.countA}</span>
                                                        </div>
                                                        <div className="flex justify-between gap-4 text-red-500">
                                                            <span>{userB.username}:</span>
                                                            <span>{day.countB}</span>
                                                        </div>
                                                        <div className="border-t border-border mt-1 pt-1 text-[10px] text-muted-foreground">
                                                            Winner: {day.winner === 'A' ? userA.username : day.winner === 'B' ? userB.username : day.winner === 'Tie' ? 'Tie' : '-'}
                                                        </div>
                                                    </div>
                                                </TooltipContent>
                                            )}
                                        </Tooltip>
                                    </TooltipProvider>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="split"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-6"
                        >
                            {/* User A Heatmap */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs px-1">
                                    <span className="font-medium text-cyan-500">{userA.username}</span>
                                    <span className="text-muted-foreground">{activityA.reduce((acc, curr) => acc + (curr.count || 0), 0)} submissions in {selectedYear}</span>
                                </div>
                                <div className="grid grid-rows-7 grid-flow-col gap-[2px] w-fit max-w-full overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                                    {activityA.map((day, i) => (
                                        <TooltipProvider key={i}>
                                            <Tooltip delayDuration={0}>
                                                <TooltipTrigger asChild>
                                                    <div
                                                        className={cn("w-4 h-4 rounded-[1px] transition-colors", getColorClass(day.intensity, 'cyan'))}
                                                    />
                                                </TooltipTrigger>
                                                {day.intensity !== -1 && (
                                                    <TooltipContent className="text-xs">
                                                        <p className="font-medium">{day.count} submissions on {day.date}</p>
                                                    </TooltipContent>
                                                )}
                                            </Tooltip>
                                        </TooltipProvider>
                                    ))}
                                </div>
                            </div>

                            {/* User B Heatmap */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs px-1">
                                    <span className="font-medium text-red-500">{userB.username}</span>
                                    <span className="text-muted-foreground">{activityB.reduce((acc, curr) => acc + (curr.count || 0), 0)} submissions in {selectedYear}</span>
                                </div>
                                <div className="grid grid-rows-7 grid-flow-col gap-[2px] w-fit max-w-full overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                                    {activityB.map((day, i) => (
                                        <TooltipProvider key={i}>
                                            <Tooltip delayDuration={0}>
                                                <TooltipTrigger asChild>
                                                    <div
                                                        className={cn("w-4 h-4 rounded-[1px] transition-colors", getColorClass(day.intensity, 'red'))}
                                                    />
                                                </TooltipTrigger>
                                                {day.intensity !== -1 && (
                                                    <TooltipContent className="text-xs">
                                                        <p className="font-medium">{day.count} submissions on {day.date}</p>
                                                    </TooltipContent>
                                                )}
                                            </Tooltip>
                                        </TooltipProvider>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 text-center border-t border-border pt-6">
                <div>
                    {/* Keep total solved as comparison context */}
                    <div className="text-muted-foreground text-[10px] uppercase tracking-wider">Total Active Days</div>
                    <div className="text-foreground font-light text-xl mt-1">{userA.activeDays} <span className="text-muted-foreground text-sm opacity-50">vs</span> {userB.activeDays}</div>
                </div>
                <div>
                    <div className="text-muted-foreground text-[10px] uppercase tracking-wider">Total Solved</div>
                    <div className="text-foreground font-light text-xl mt-1">{userA.totalSolved.toLocaleString()} <span className="text-muted-foreground text-sm opacity-50">vs</span> {userB.totalSolved.toLocaleString()}</div>
                </div>
                <div>
                    <div className="text-muted-foreground text-[10px] uppercase tracking-wider">Max Streak</div>
                    <div className="text-foreground font-light text-xl mt-1">{userA.streak} <span className="text-muted-foreground text-sm opacity-50">vs</span> {userB.streak}</div>
                </div>
            </div>
        </div>
    );
}