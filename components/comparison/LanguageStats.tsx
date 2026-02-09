'use client';

import { ColorTheme, HEATMAP_THEMES } from '@/components/profile/ProfileHeatmap';
import { useMemo } from 'react';
import { DetailedUserProfile } from '@/lib/mock-data';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Legend,
    Tooltip
} from 'recharts';
import { Code2, Braces } from 'lucide-react';

interface LanguageStatsProps {
    userA: DetailedUserProfile;
    userB?: DetailedUserProfile; // Optional for single-user mode
    singleUser?: boolean;
    variant?: 'list' | 'radar' | 'auto';
    colorTheme?: ColorTheme;
    hideUsername?: boolean; // Hide usernames from legend (for profile pages)
}

export default function LanguageStats({ userA, userB, singleUser = false, variant = 'auto', colorTheme, hideUsername = false }: LanguageStatsProps) {
    // Get theme color hex
    const themeColor = useMemo(() => {
        if (!colorTheme) return "#3b82f6"; // Default blue
        const theme = HEATMAP_THEMES.find(t => t.name === colorTheme);
        return theme ? theme.hex : "#3b82f6";
    }, [colorTheme]);

    // Determine view mode
    const showList = variant === 'list' || (variant === 'auto' && (singleUser || !userB));

    // For single user mode (List View), show bar chart of languages ranked by usage
    if (showList) {
        const sortedLanguages = [...userA.languages].sort((a, b) => b.solved - a.solved).slice(0, 10);

        if (sortedLanguages.length === 0) {
            return (
                <div className="w-full flex flex-col items-center justify-center gap-4 relative z-20 h-[300px] text-muted-foreground text-sm border border-border/50 rounded-xl bg-secondary/5">
                    No language data available
                </div>
            );
        }

        return (
            <div className="w-full space-y-4">
                <h3 className="text-lg font-medium text-foreground">Languages</h3>
                <div className="space-y-3">
                    {sortedLanguages.map((lang, index) => (
                        <div key={lang.name} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-foreground font-medium">{lang.name}</span>
                                <span className="text-muted-foreground tabular-nums">{lang.solved} problems</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-full transition-all duration-500"
                                    style={{ width: `${(lang.solved / sortedLanguages[0].solved) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Comparison/Radar mode - use radar chart
    // Normalize data for Radar Chart
    // We need a common set of languages to compare
    const allLangs = Array.from(new Set([...userA.languages.map(l => l.name), ...(userB?.languages.map(l => l.name) || [])]));

    const data = allLangs.map(lang => {
        const statA = userA.languages.find(l => l.name === lang);
        const statB = userB?.languages.find(l => l.name === lang);
        return {
            subject: lang,
            A: statA ? statA.solved : 0,
            B: statB ? statB.solved : 0,
            fullMark: Math.max(statA?.solved || 0, statB?.solved || 0) * 1.2
        };
    });

    if (allLangs.length === 0) {
        return (
            <div className="w-full flex flex-col items-center justify-center gap-4 relative z-20 h-[300px] text-muted-foreground text-sm border border-border/50 rounded-xl bg-secondary/5">
                No language data available to compare
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center justify-center gap-4 relative z-20">

            <div className="py-6 relative overflow-hidden w-full">

                <div className="h-[300px] w-full relative z-10 [&_.recharts-wrapper]:!outline-none [&_.recharts-surface]:!outline-none">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                            <PolarGrid stroke="var(--border)" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                            <Radar
                                name={userA.username}
                                dataKey="A"
                                stroke={themeColor}
                                strokeWidth={2}
                                fill={themeColor}
                                fillOpacity={0.1}
                            />
                            {userB && (
                                <Radar
                                    name={userB.username}
                                    dataKey="B"
                                    stroke="#ef4444"
                                    strokeWidth={2}
                                    fill="#ef4444"
                                    fillOpacity={0.1}
                                />
                            )}
                            {!hideUsername && <Legend />}
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}
                                itemStyle={{ fontSize: '12px', color: 'var(--foreground)' }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
