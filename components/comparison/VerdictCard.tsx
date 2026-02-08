
'use client';

import { DetailedUserProfile } from '@/lib/mock-data';
import { motion } from 'framer-motion';
import { Sparkles, Share2, Download, Copy, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// @ts-ignore
import { toast } from 'sonner';

interface VerdictCardProps {
    userA: DetailedUserProfile;
    userB: DetailedUserProfile;
}

export default function VerdictCard({ userA, userB }: VerdictCardProps) {
    // Detailed Analysis Logic
    const getVerdictAnalysis = (winner: DetailedUserProfile, loser: DetailedUserProfile) => {
        const winningPoints: string[] = [];
        const improvementPoints: string[] = []; // Renamed for positive framing

        // --- Winning Factors (Keep existing logic mostly, maybe refine) ---
        // 1. Contest Rating
        if (winner.contestRating > loser.contestRating) {
            const diff = Math.round(winner.contestRating - loser.contestRating);
            winningPoints.push(`Dominant rating lead (+${diff} points)`);
        }
        // 2. Hard Problems
        if (winner.solvedStats.hard > loser.solvedStats.hard) {
            winningPoints.push(`Superior grasp of Hard problems (${winner.solvedStats.hard} solved)`);
        }
        // 3. Consistency
        if (winner.streak > loser.streak + 5) {
            winningPoints.push(`Higher consistency with ${winner.streak} day streak`);
        }
        // 4. Badges
        if ((winner.badgesData?.badgesCount || 0) > (loser.badgesData?.badgesCount || 0)) {
            winningPoints.push(`More achievements unlocked (${winner.badgesData?.badgesCount} badges)`);
        }
        // Fallback
        if (winningPoints.length === 0) winningPoints.push("Better overall performance metrics");


        // --- Strategies for Growth (Ensure 3+ points) ---

        // Point 1: Contest Strategy
        if (loser.contestRating < 1500) {
            improvementPoints.push("Focus on solving the first 2 contest problems consistently to reach 1500+.");
        } else if (Math.abs(winner.contestRating - loser.contestRating) > 200) {
            improvementPoints.push("Analyze 'Wrong Answer' submissions from recent contests to identify edge cases.");
        } else {
            improvementPoints.push("Prioritize speed on Medium problems to gain a rank advantage.");
        }

        // Point 2: Problem Solving Focus
        const hardRatio = loser.solvedStats.hard / (loser.totalSolved || 1);
        if (loser.solvedStats.hard < 10) {
            improvementPoints.push("Start tackling high-acceptance 'Hard' problems to break the difficulty ceiling.");
        } else if (hardRatio < 0.1) {
            improvementPoints.push("Increase 'Hard' problem practice to improve pattern recognition.");
        } else {
            improvementPoints.push("Revisit solved problems and attempt to optimize space complexity.");
        }

        // Point 3: Topics / Habits
        if (loser.streak < 7) {
            improvementPoints.push("Build a 7-day streak using the 'Daily Challenge' to improve muscle memory.");
        } else {
            improvementPoints.push("Try 'Virtual Contests' on weekends to simulate time pressure.");
        }

        // Point 4: Specific Topic (Generic for now as we lack granular topic stats in this view, but detailed usage suggests it)
        // We can rotate advice or check basic stats
        if (loser.solvedStats.medium < loser.solvedStats.easy) {
            improvementPoints.push("Shift focus from Easy to Medium problems (Graphs, DP) for faster growth.");
        }

        return { winningPoints, improvementPoints: improvementPoints.slice(0, 4) }; // Return up to 4
    };

    const winner = userA.contestRating >= userB.contestRating ? userA : userB;
    const loser = userA.contestRating >= userB.contestRating ? userB : userA;
    const isA = winner.username === userA.username;

    const { winningPoints, improvementPoints } = getVerdictAnalysis(winner, loser);

    const handleShare = async (platform: 'twitter' | 'linkedin' | 'copy') => {
        const currentUrl = window.location.href;
        const text = `Check out this LeetCode comparison: ${userA.username} vs ${userB.username}! 🚀 #LeetCode #Coding`;

        if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}`, '_blank');
        } else if (platform === 'linkedin') {
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`, '_blank');
        } else if (platform === 'copy') {
            await navigator.clipboard.writeText(currentUrl);
            toast.success("Link copied to clipboard!");
        }
    };



    return (
        <div id="verdict-card-capture-area" className="w-full relative z-20 p-4 bg-background/50 rounded-xl">
            <div className="relative z-10 bg-transparent py-8 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Left Column: Winner Analysis */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-semibold text-foreground">
                                Detailed Verdict
                            </h2>
                            <span className={`px-3 py-1 text-xs rounded-full uppercase tracking-wider font-mono font-bold ${isA ? 'bg-cyan-500/10 text-cyan-500' : 'bg-red-500/10 text-red-500'}`}>
                                Winner: {winner.username}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Winning Factors */}
                            <div className="space-y-3 bg-secondary/5 rounded-xl p-4 border border-border/50">
                                <h3 className="text-sm font-medium text-foreground uppercase tracking-wide flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-yellow-500" />
                                    Winning Factors
                                </h3>
                                <ul className="space-y-2">
                                    {winningPoints.map((point, i) => (
                                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                            <span className="text-green-500 mt-1">✓</span>
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Strategies for Growth (Loser) */}
                            <div className="space-y-3 bg-secondary/5 rounded-xl p-4 border border-border/50">
                                <h3 className="text-sm font-medium text-foreground uppercase tracking-wide flex items-center gap-2">
                                    <span className="text-muted-foreground">Strategies for {loser.username}</span>
                                </h3>
                                <ul className="space-y-2">
                                    {improvementPoints.map((point, i) => (
                                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                            <span className="text-blue-500 mt-1">↗</span>
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Actions & Summary */}
                    <div className="flex flex-col justify-between space-y-6 md:border-l md:border-border/50 md:pl-8">
                        <div>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                <span className={`font-medium ${isA ? 'text-cyan-500' : 'text-red-500'}`}>{winner.username}</span> leads with a stronger contest rating and problem-solving depth.
                                <span className="block mt-2">
                                    For <span className="text-foreground">{loser.username}</span>, focusing on <span className="text-foreground font-medium">Hard problems</span> & <span className="text-foreground font-medium">Contest Strategy</span> is key to closing the gap.
                                </span>
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full border-border cursor-pointer hover:bg-secondary text-foreground text-xs justify-start h-10">
                                        <Share2 className="w-4 h-4 mr-2" /> Share Comparison
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuItem onClick={() => handleShare('copy')} className="gap-2 cursor-pointer">
                                        <Copy className="w-4 h-4" /> Copy Link
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleShare('twitter')} className="gap-2 cursor-pointer">
                                        <Twitter className="w-4 h-4 text-[#1DA1F2]" /> Share on X
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleShare('linkedin')} className="gap-2 cursor-pointer">
                                        <Linkedin className="w-4 h-4 text-[#0A66C2]" /> Share on LinkedIn
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
