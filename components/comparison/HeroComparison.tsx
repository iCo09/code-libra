'use client';

import { motion } from 'framer-motion';
import { DetailedUserProfile } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Trophy, Zap, Award, Target, TrendingUp, Search, Github, Twitter, Linkedin, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import Image from 'next/image';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Share2 } from 'lucide-react';
// @ts-ignore
import { toast } from 'sonner';

interface HeroComparisonProps {
    userA: DetailedUserProfile;
    userB: DetailedUserProfile;
    onUserUpdate: (username: string, slot: 'A' | 'B') => void;
    loadingA: boolean;
    loadingB: boolean;
}

const StatBox = ({ label, valueA, valueB, icon: Icon, delay = 0, className, loadingA, loadingB }: any) => {
    // ... existing StatBox code ...
    const isAWinning = valueA > valueB;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5, type: "spring", stiffness: 100 }}
        >
            <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className={cn("relative flex flex-col items-center justify-center p-3 w-36 h-28 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all border border-transparent hover:border-border/50 shadow-sm backdrop-blur-sm", className)}
            >
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest mb-2">
                    <Icon className="w-3 h-3" /> {label}
                </div>

                <div className="flex items-baseline gap-1">
                    {loadingA ? (
                        <div className="h-6 w-12 bg-gray-700/50 rounded animate-pulse" />
                    ) : (
                        <span className={cn("text-xl font-bold tab-nums", isAWinning ? "text-foreground scale-110" : "text-muted-foreground/70")}>
                            {typeof valueA === 'number' ? valueA.toLocaleString() : valueA}
                        </span>
                    )}
                </div>
                <div className="w-full h-px bg-border/50 my-1.5" />
                <div className="flex items-baseline gap-1">
                    {loadingB ? (
                        <div className="h-6 w-12 bg-gray-700/50 rounded animate-pulse" />
                    ) : (
                        <span className={cn("text-xl font-bold tab-nums", !isAWinning ? "text-foreground scale-110" : "text-muted-foreground/70")}>
                            {typeof valueB === 'number' ? valueB.toLocaleString() : valueB}
                        </span>
                    )}
                </div>

                {/* Micro Indicator - Absolute Bottom */}
                <div className="w-full h-1 absolute bottom-0 left-0 flex overflow-hidden rounded-b-xl opacity-50">
                    <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${(valueA / (valueA + valueB)) * 100}%` }} />
                    <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${(valueB / (valueA + valueB)) * 100}%` }} />
                </div>
            </motion.div>
        </motion.div>
    );
};

const getCountryCode = (countryName: string) => {
    if (!countryName) return "un";
    const map: Record<string, string> = {
        "India": "in", "United States": "us", "China": "cn", "Taiwan": "tw",
        "Japan": "jp", "South Korea": "kr", "Canada": "ca", "Vietnam": "vn",
        "Russia": "ru", "Ukraine": "ua", "Germany": "de", "France": "fr",
        "United Kingdom": "gb", "Brazil": "br", "Singapore": "sg", "Australia": "au",
        "Turkey": "tr", "Poland": "pl", "Netherlands": "nl", "Italy": "it",
        "Egypt": "eg", "Bangladesh": "bd", "Romania": "ro", "Israel": "il",
        "Indonesia": "id", "Mexico": "mx", "Spain": "es", "Sweden": "se",
        "Switzerland": "ch", "Belgium": "be", "Argentina": "ar", "Colombia": "co",
        "Greece": "gr", "Portugal": "pt", "Norway": "no", "Denmark": "dk",
        "Finland": "fi", "Austria": "at", "Hong Kong": "hk", "Ireland": "ie",
        "New Zealand": "nz", "Malaysia": "my", "Philippines": "ph", "Thailand": "th",
        "Saudi Arabia": "sa", "Pakistan": "pk", "Iran": "ir", "South Africa": "za",
        "Nigeria": "ng", "Kenya": "ke", "Chile": "cl", "Peru": "pe", "Venezuela": "ve",
        "Czechia": "cz", "Hungary": "hu", "Slovakia": "sk", "Bulgaria": "bg",
        "Serbia": "rs", "Croatia": "hr", "Estonia": "ee", "Latvia": "lv", "Lithuania": "lt"
    };
    return map[countryName] || "un";
};

const UsernameInput = ({ value, onChange, onSearch, loading }: { value: string, onChange: (v: string) => void, onSearch: () => void, loading: boolean }) => (
    <div className="relative flex items-center justify-center group w-full max-w-[180px]">
        <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            className={cn(
                "h-9 py-1 px-3 bg-secondary/10 border border-border/50 focus-visible:ring-1 focus-visible:ring-cyan-500/50 text-center text-sm md:text-base font-medium rounded-md placeholder:text-muted-foreground/50 transition-all w-full shadow-sm hover:border-cyan-500/30"
            )}
            placeholder="Enter username"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
            {loading ? (
                <div className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            ) : (
                <Search className="w-3 h-3 text-muted-foreground" />
            )}
        </div>
    </div>
);

export default function HeroComparison({ userA, userB, onUserUpdate, loadingA, loadingB }: HeroComparisonProps) {
    const [nameA, setNameA] = useState(userA.username);
    const [nameB, setNameB] = useState(userB.username);
    const activeBadgeA = userA.badgesData?.activeBadge;
    const activeBadgeB = userB.badgesData?.activeBadge;

    // Helper to format icon URL
    const getIconUrl = (iconPath: string) => iconPath.startsWith('http') ? iconPath : `https://leetcode.com${iconPath}`;

    // Debounce values
    const debouncedNameA = useDebounce(nameA, 800); // 800ms delay
    const debouncedNameB = useDebounce(nameB, 800);

    // Track first render/prop sync to avoid initial double fetch
    const isFirstRender = useRef(true);

    // Sync state if props change (e.g. initial load or external update)
    useEffect(() => {
        if (userA.username !== nameA) {
            setNameA(userA.username);
        }
    }, [userA.username]);

    useEffect(() => {
        if (userB.username !== nameB) {
            setNameB(userB.username);
        }
    }, [userB.username]);

    // Trigger updates on debounce
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (debouncedNameA && debouncedNameA !== userA.username) {
            onUserUpdate(debouncedNameA, 'A');
        }
    }, [debouncedNameA, userA.username, onUserUpdate]);

    useEffect(() => {
        if (debouncedNameB && debouncedNameB !== userB.username) {
            onUserUpdate(debouncedNameB, 'B');
        }
    }, [debouncedNameB, userB.username, onUserUpdate]);

    // Share Functionality
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
        <div id="comparison-capture-area" className="w-full pt-8 pb-12 relative overflow-hidden">
            {/* Share Button - Absolute Top Right */}
            <div className="absolute top-4 right-4 z-50">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 rounded-md cursor-pointer bg-secondary/20 hover:bg-secondary/40 border border-white/10 backdrop-blur-md transition-colors text-muted-foreground hover:text-foreground"
                        >
                            <Share2 className="w-4 h-4 cursor-pointer" />
                        </motion.button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 backdrop-blur-xl bg-black/80 border-white/10">
                        <DropdownMenuItem onClick={() => handleShare('copy')} className="gap-2 cursor-pointer focus:bg-white/10">
                            <Copy className="w-4 h-4" /> Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare('twitter')} className="gap-2 cursor-pointer focus:bg-white/10">
                            <Twitter className="w-4 h-4 text-[#1DA1F2]" /> Share on X
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare('linkedin')} className="gap-2 cursor-pointer focus:bg-white/10">
                            <Linkedin className="w-4 h-4 text-[#0A66C2]" /> Share on LinkedIn
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {/* Background Glows (Ice & Fire) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-20 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
                <div className="absolute -top-20 right-1/4 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="flex flex-col items-center max-w-3xl mx-auto px-4 relative z-10">

                {/* Top Section: Avatar VS Avatar */}
                <div className="flex items-center justify-between w-full max-w-xl mb-8 relative">
                    {/* User A (Ice) */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col items-center group"
                    >
                        <div className="relative mb-3">
                            <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />

                            {/* Orbiting Drop A */}
                            <div className="absolute -inset-1 rounded-full border border-cyan-500/30 z-0" /> {/* Track */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute -inset-1 z-0 rounded-full"
                            >
                                {/* Tail */}
                                <div
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        background: "conic-gradient(from 0deg, transparent 0deg, transparent 300deg, rgba(6,182,212,0.6) 360deg)",
                                        maskImage: "radial-gradient(closest-side, transparent 88%, black 93%)",
                                        WebkitMaskImage: "radial-gradient(closest-side, transparent 88%, black 93%)"
                                    }}
                                />
                                <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)] blur-[0.5px]" />
                            </motion.div>

                            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background relative z-10 shadow-xl ring-2 ring-cyan-500/20">
                                <AvatarImage src={userA.avatar} />
                                <AvatarFallback>A</AvatarFallback>
                            </Avatar>
                            <div className="absolute -right-1 top-1 bg-background/90 backdrop-blur text-[10px] font-bold px-2 py-0.5 rounded-full border border-border shadow-sm z-20 text-cyan-500">
                                #{userA.ranking}
                            </div>

                            {/* Active Badge A */}
                            {activeBadgeA?.icon && (
                                <div className="absolute -bottom-2 -right-2 z-20 rounded-full p-1.5" title={activeBadgeA.displayName}>
                                    <div className="w-6 h-6 md:w-8 md:h-8 relative">
                                        <Image
                                            src={getIconUrl(activeBadgeA.icon)}
                                            alt={activeBadgeA.displayName}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <UsernameInput
                            value={nameA}
                            onChange={setNameA}
                            onSearch={() => onUserUpdate(nameA, 'A')} // Keep manual enter for immediate
                            loading={loadingA}
                        />

                        {/* Social Links A */}
                        <div className="flex items-center gap-3 mt-3">
                            {userA.country && (
                                <span
                                    className={`fi fi-${getCountryCode(userA.country)} text-sm shadow-sm`}
                                    title={userA.country}
                                />
                            )}

                            {userA.gitHub && <a href={userA.gitHub} target="_blank" rel="noreferrer" className="text-foreground/80 hover:text-black dark:hover:text-white transition-colors scale-100 hover:scale-110"><Github className="w-4 h-4" /></a>}
                            {userA.twitter && <a href={userA.twitter} target="_blank" rel="noreferrer" className="text-[#1DA1F2]/80 hover:text-[#1DA1F2] transition-colors scale-100 hover:scale-110"><Twitter className="w-4 h-4" /></a>}
                            {userA.linkedIN && <a href={userA.linkedIN} target="_blank" rel="noreferrer" className="text-[#0A66C2]/80 hover:text-[#0A66C2] transition-colors scale-100 hover:scale-110"><Linkedin className="w-4 h-4" /></a>}
                            {userA.website && userA.website.length > 0 && <a href={userA.website[0]} target="_blank" rel="noreferrer" className="text-emerald-500/80 hover:text-emerald-500 transition-colors scale-100 hover:scale-110"><Globe className="w-4 h-4" /></a>}
                        </div>
                    </motion.div>

                    {/* VS Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="relative z-20 -mt-8 flex justify-center items-center"
                    >
                        <div className="relative w-16 h-16 md:w-24 md:h-24">
                            <Image
                                src="/vs_icon.png"
                                alt="VS"
                                fill
                                className="object-contain drop-shadow-2xl dark:invert"
                                priority
                            />
                        </div>
                    </motion.div>

                    {/* User B (Fire) */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col items-center group"
                    >
                        <div className="relative mb-3">
                            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />

                            {/* Orbiting Drop B */}
                            <div className="absolute -inset-1 rounded-full border border-red-500/30 z-0" /> {/* Track */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute -inset-1 z-0 rounded-full"
                            >
                                {/* Tail */}
                                <div
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        background: "conic-gradient(from 0deg, transparent 0deg, transparent 300deg, rgba(239,68,68,0.6) 360deg)",
                                        maskImage: "radial-gradient(closest-side, transparent 88%, black 93%)",
                                        WebkitMaskImage: "radial-gradient(closest-side, transparent 88%, black 93%)"
                                    }}
                                />
                                <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)] blur-[0.5px]" />
                            </motion.div>

                            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background relative z-10 shadow-xl ring-2 ring-red-500/20">
                                <AvatarImage src={userB.avatar} />
                                <AvatarFallback>B</AvatarFallback>
                            </Avatar>
                            <div className="absolute -left-1 top-1 bg-background/90 backdrop-blur text-[10px] font-bold px-2 py-0.5 rounded-full border border-border shadow-sm z-20 text-red-500">
                                #{userB.ranking}
                            </div>

                            {/* Active Badge B */}
                            {activeBadgeB?.icon && (
                                <div className="absolute -bottom-2 -left-2 z-20 rounded-full p-1.5" title={activeBadgeB.displayName}>
                                    <div className="w-6 h-6 md:w-8 md:h-8 relative">
                                        <Image
                                            src={getIconUrl(activeBadgeB.icon)}
                                            alt={activeBadgeB.displayName}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <UsernameInput
                            value={nameB}
                            onChange={setNameB}
                            onSearch={() => onUserUpdate(nameB, 'B')}
                            loading={loadingB}
                        />

                        {/* Social Links B */}
                        <div className="flex items-center gap-3 mt-3">
                            {userB.country && (
                                <span
                                    className={`fi fi-${getCountryCode(userB.country)} text-sm shadow-sm`}
                                    title={userB.country}
                                />
                            )}

                            {userB.gitHub && <a href={userB.gitHub} target="_blank" rel="noreferrer" className="text-foreground/80 hover:text-black dark:hover:text-white transition-colors scale-100 hover:scale-110"><Github className="w-4 h-4" /></a>}
                            {userB.twitter && <a href={userB.twitter} target="_blank" rel="noreferrer" className="text-[#1DA1F2]/80 hover:text-[#1DA1F2] transition-colors scale-100 hover:scale-110"><Twitter className="w-4 h-4" /></a>}
                            {userB.linkedIN && <a href={userB.linkedIN} target="_blank" rel="noreferrer" className="text-[#0A66C2]/80 hover:text-[#0A66C2] transition-colors scale-100 hover:scale-110"><Linkedin className="w-4 h-4" /></a>}
                            {userB.website && userB.website.length > 0 && <a href={userB.website[0]} target="_blank" rel="noreferrer" className="text-emerald-500/80 hover:text-emerald-500 transition-colors scale-100 hover:scale-110"><Globe className="w-4 h-4" /></a>}
                        </div>
                    </motion.div>
                </div>

                {/* We create an 'Arc' by offsetting the Y position of the cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 items-start">
                    <div className="pt-8"> {/* Outer cards lower (reduced form 12) */}
                        <StatBox
                            label="Rating"
                            valueA={userA.contestRating}
                            valueB={userB.contestRating}
                            icon={Trophy}
                            delay={0.4}
                            loadingA={loadingA}
                            loadingB={loadingB}
                        />
                    </div>

                    <div className="pt-0"> {/* Inner cards higher (top of arc) */}
                        <StatBox
                            label="Solved"
                            valueA={userA.totalSolved}
                            valueB={userB.totalSolved}
                            icon={Target}
                            delay={0.5}
                            loadingA={loadingA}
                            loadingB={loadingB}
                        />
                    </div>

                    <div className="pt-0"> {/* Inner cards higher (top of arc) */}
                        <StatBox
                            label="Streak"
                            valueA={userA.streak}
                            valueB={userB.streak}
                            icon={Zap}
                            delay={0.6}
                            loadingA={loadingA}
                            loadingB={loadingB}
                        />
                    </div>

                    <div className="pt-8"> {/* Outer cards lower (reduced from 12) */}
                        <StatBox
                            label="Level"
                            valueA={userA.level === "Guardian" ? 2 : userA.level === "Knight" ? 1 : 0}
                            valueB={userB.level === "Guardian" ? 2 : userB.level === "Knight" ? 1 : 0}
                            icon={TrendingUp}
                            delay={0.7}
                            loadingA={loadingA}
                            loadingB={loadingB}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
