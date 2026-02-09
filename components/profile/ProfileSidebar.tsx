'use client';

import { DetailedUserProfile } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, GitCompare, Share2, Github, Twitter, Linkedin, Globe, CheckCircle2, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import Image from 'next/image';
import type { Badge as BadgeType } from '@/actions/get-user-badges';

interface ProfileSidebarProps {
    user: DetailedUserProfile;
    score?: number | null;
}

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

export default function ProfileSidebar({ user, score }: ProfileSidebarProps) {
    const getIconUrl = (iconPath: string) => iconPath.startsWith('http') ? iconPath : `https://leetcode.com${iconPath}`;
    const activeBadge = user.badgesData?.activeBadge;
    const badges = user.badgesData?.badges || [];
    const badgesCount = user.badgesData?.badgesCount || 0;
    const [showAllBadges, setShowAllBadges] = useState(false);

    // Sort badges by creation date (most recent first)
    const sortedBadges = [...badges].sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
    const displayedBadges = showAllBadges ? sortedBadges : sortedBadges.slice(0, 4);

    return (
        <div className="sticky top-4 space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-row items-start gap-4 p-2 border-1 border-border/30">
                <div className="relative">
                    <Avatar className="h-24 w-24 rounded-md shadow-xl ring-2 ring-primary/20">
                        <AvatarImage src={user.avatar} alt={user.username} className="rounded-md" />
                        <AvatarFallback className="text-3xl rounded-md">{user.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                </div>

                {/* Name & Username */}
                <div className="flex flex-col pt-1 space-y-1">
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold text-foreground">{user.name}</h1>
                        {/* Active Badge */}
                        {activeBadge?.icon && (
                            <div className="relative w-5 h-5 md:w-6 md:h-6" title={activeBadge.displayName}>
                                <Image
                                    src={getIconUrl(activeBadge.icon)}
                                    alt={activeBadge.displayName}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        )}
                    </div>

                    <p className="text-sm text-muted-foreground">@{user.username}</p>

                    {(user.gitHub || user.twitter || user.linkedIN || (user.website && user.website.length > 0)) && (
                        <>
                            <div className="flex justify-start gap-3 mt-2">
                                <div className="flex items-center gap-3 text-sm">
                                    {user.country && (
                                        <div className="flex items-center gap-1.5">
                                            <span className={`fi fi-${getCountryCode(user.country)} text-base`} title={user.country} />
                                        </div>
                                    )}
                                </div>
                                {user.gitHub && (
                                    <a href={user.gitHub} target="_blank" rel="noreferrer" className="text-foreground hover:opacity-70 transition-opacity">
                                        <Github className="w-5 h-5" />
                                    </a>
                                )}
                                {user.twitter && (
                                    <a href={user.twitter} target="_blank" rel="noreferrer" className="text-[#1DA1F2] hover:opacity-70 transition-opacity">
                                        <Twitter className="w-5 h-5" />
                                    </a>
                                )}
                                {user.linkedIN && (
                                    <a href={user.linkedIN} target="_blank" rel="noreferrer" className="text-[#0A66C2] hover:opacity-70 transition-opacity">
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                )}
                                {user.website && user.website.length > 0 && (
                                    <a href={user.website[0]} target="_blank" rel="noreferrer" className="text-emerald-500 hover:opacity-70 transition-opacity">
                                        <Globe className="w-5 h-5" />
                                    </a>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Score Badge */}
            {score !== null && score !== undefined && (
                <div className="p-4 border-1 border-border/30">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex gap-2 items-center">
                                <span>Profile Score</span>
                                <span className="relative group cursor-help">
                                    <Info className="w-3 h-3" />
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-[10px] rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-border w-64">
                                        <div className="font-semibold mb-1">Score Components (0-1000)</div>
                                        <div className="space-y-0.5 text-left">
                                            <div>• Problem Solving: 400pts</div>
                                            <div>• Topic Coverage: 200pts</div>
                                            <div>• Contest Performance: 200pts</div>
                                            <div>• Consistency: 100pts</div>
                                            <div>• Advanced Topics: 100pts</div>
                                        </div>
                                        <div className="mt-1.5 pt-1.5 border-t border-border/50">
                                            <div className="font-semibold mb-0.5">Rank Tiers</div>
                                            <div className="grid grid-cols-2 gap-x-2 text-[9px]">
                                                <div className={score <= 200 ? 'text-gray-500 font-semibold' : ''}>0-200: Init</div>
                                                <div className={score > 200 && score <= 400 ? 'text-blue-500 font-semibold' : ''}>201-400: Loop</div>
                                                <div className={score > 400 && score <= 600 ? 'text-purple-500 font-semibold' : ''}>401-600: Optimize</div>
                                                <div className={score > 600 && score <= 800 ? 'text-orange-500 font-semibold' : ''}>601-800: Compile</div>
                                                <div className={score > 800 ? 'text-yellow-500 font-semibold' : ''}>801-1000: Execute</div>
                                            </div>
                                        </div>
                                    </div>
                                </span>
                            </span>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-3xl font-bold ${score >= 801 ? 'text-yellow-500' :
                                    score >= 601 ? 'text-orange-500' :
                                        score >= 401 ? 'text-purple-500' :
                                            score >= 201 ? 'text-blue-500' :
                                                'text-gray-500'
                                    }`}>
                                    {score}
                                </span>
                            </div>
                        </div>
                        <div className={`px-4 py-2 font-semibold text-sm ${score >= 801 ? 'bg-yellow-500/10 text-yellow-500' :
                            score >= 601 ? 'bg-orange-500/10 text-orange-500' :
                                score >= 401 ? 'bg-purple-500/10 text-purple-500' :
                                    score >= 201 ? 'bg-blue-500/10 text-blue-500' :
                                        'bg-gray-500/10 text-gray-500'
                            }`}>
                            {
                                score >= 801 ? 'Execute' :
                                    score >= 601 ? 'Compile' :
                                        score >= 401 ? 'Optimize' :
                                            score >= 201 ? 'Loop' :
                                                'Init'
                            }
                        </div>
                    </div>
                </div>
            )}


            <div className="flex items-center justify-between gap-4 p-2 border-1 border-border/30">
                {/* Circular Progress */}
                <div className="relative w-[120px] h-[120px] flex-shrink-0">
                    <svg width="120" height="120" className="transform -rotate-90">
                        <circle
                            cx="60"
                            cy="60"
                            r="52"
                            fill="none"
                            stroke="hsl(var(--secondary))"
                            strokeWidth="8"
                        />
                        {/* Hard Segment (Bottom Layer) */}
                        <circle
                            cx="60"
                            cy="60"
                            r="52"
                            fill="none"
                            stroke="#ef4444" // red-500
                            strokeWidth="8"
                            strokeDasharray={2 * Math.PI * 52}
                            strokeDashoffset={0}
                            strokeLinecap="round"
                            className="transition-all duration-500"
                            style={{ opacity: user.solvedStats.hard > 0 ? 1 : 0 }}
                        />
                        {/* Medium Segment (Middle Layer) */}
                        <circle
                            cx="60"
                            cy="60"
                            r="52"
                            fill="none"
                            stroke="#eab308" // yellow-500
                            strokeWidth="8"
                            strokeDasharray={2 * Math.PI * 52}
                            strokeDashoffset={2 * Math.PI * 52 * (1 - ((user.solvedStats.easy + user.solvedStats.medium) / (user.solvedStats.easy + user.solvedStats.medium + user.solvedStats.hard + 0.0001)))}
                            strokeLinecap="round"
                            className="transition-all duration-500"
                            style={{ opacity: user.solvedStats.medium > 0 ? 1 : 0 }}
                        />
                        {/* Easy Segment (Top Layer) */}
                        <circle
                            cx="60"
                            cy="60"
                            r="52"
                            fill="none"
                            stroke="#10b981" // emerald-500
                            strokeWidth="8"
                            strokeDasharray={2 * Math.PI * 52}
                            strokeDashoffset={2 * Math.PI * 52 * (1 - (user.solvedStats.easy / (user.solvedStats.easy + user.solvedStats.medium + user.solvedStats.hard + 0.0001)))}
                            strokeLinecap="round"
                            className="transition-all duration-500"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-foreground leading-none">
                            <span className="text-foreground font-bold text-lg">{user.totalSolved}</span><span className='text-md'>/</span><span className="text-muted-foreground text-sm">{user.solvedStats.totalEasy + user.solvedStats.totalMedium + user.solvedStats.totalHard}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase mt-1">Solved</div>
                    </div>
                </div>

                {/* Legend Stats */}
                <div className="flex flex-col gap-2 w-full min-w-0">
                    {/* Easy */}
                    <div className="flex items-center justify-between bg-secondary/20 px-2 py-1.5">
                        <div className="text-xs text-emerald-500 font-medium">Easy</div>
                        <div className="text-xs font-medium">
                            <span className="text-foreground">{user.solvedStats.easy}</span>
                            <span className="text-muted-foreground">/{user.solvedStats.totalEasy}</span>
                        </div>
                    </div>
                    {/* Medium */}
                    <div className="flex items-center justify-between bg-secondary/20 px-2 py-1.5">
                        <div className="text-xs text-yellow-500 font-medium">Med.</div>
                        <div className="text-xs font-medium">
                            <span className="text-foreground">{user.solvedStats.medium}</span>
                            <span className="text-muted-foreground">/{user.solvedStats.totalMedium}</span>
                        </div>
                    </div>
                    {/* Hard */}
                    <div className="flex items-center justify-between bg-secondary/20 px-2 py-1.5">
                        <div className="text-xs text-red-500 font-medium">Hard</div>
                        <div className="text-xs font-medium">
                            <span className="text-foreground">{user.solvedStats.hard}</span>
                            <span className="text-muted-foreground">/{user.solvedStats.totalHard}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Badges Section */}
            {badgesCount > 0 && (
                <div className="p-4 border-1 border-border/30 space-y-3 z-20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold">Badges</h3>
                            <span className="text-xs text-muted-foreground">({badgesCount})</span>
                        </div>
                        {sortedBadges.length > 4 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowAllBadges(!showAllBadges)}
                                className="h-6 px-2 text-xs"
                            >
                                {showAllBadges ? (
                                    <>
                                        Show Less <ChevronUp className="w-3 h-3 ml-1" />
                                    </>
                                ) : (
                                    <>
                                        Show All <ChevronDown className="w-3 h-3 ml-1" />
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                    <div className={cn(
                        "grid grid-cols-4 gap-3 transition-all duration-500 ease-in-out z-20",
                        showAllBadges ? "max-h-[1000px] opacity-100" : "max-h-[200px] opacity-100"
                    )}>
                        {displayedBadges.map((badge, index) => (
                            <BadgeItem
                                key={badge.id}
                                badge={badge}
                                getIconUrl={getIconUrl}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
                <Button variant="outline" className="w-full cursor-pointer" size="sm">
                    <GitCompare className="w-4 h-4 mr-2" />
                    Compare
                </Button>
                <Button variant="outline" className="w-full cursor-pointer" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                </Button>
            </div>

            <div className="flex justify-center -mt-2">
                <div className="text-xs text-muted-foreground font-medium">
                    {/* Placeholder for Attempting if data existed, for now omitted or static if requested */}
                </div>
            </div>
        </div>
    );
}

function BadgeItem({ badge, getIconUrl, index }: { badge: BadgeType; getIconUrl: (iconPath: string) => string; index: number }) {
    const iconUrl = getIconUrl(badge.icon);

    return (
        <div
            className="group relative flex flex-col items-center animate-in fade-in zoom-in duration-300"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className="w-10 h-10 relative transition-transform transform group-hover:scale-110">
                <Image
                    src={iconUrl}
                    alt={badge.displayName}
                    fill
                    className="object-contain"
                />
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-[10px] rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 border border-border">
                {badge.displayName}
                <div className="text-[9px] text-muted-foreground">{badge.creationDate}</div>
            </div>
        </div>
    );
}
