'use client';

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
    userB: DetailedUserProfile;
}

export default function LanguageStats({ userA, userB }: LanguageStatsProps) {
    // Normalize data for Radar Chart
    // We need a common set of languages to compare
    const allLangs = Array.from(new Set([...userA.languages.map(l => l.name), ...userB.languages.map(l => l.name)]));

    const data = allLangs.map(lang => {
        const statA = userA.languages.find(l => l.name === lang);
        const statB = userB.languages.find(l => l.name === lang);
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
                                stroke="#06b6d4"
                                strokeWidth={2}
                                fill="#06b6d4"
                                fillOpacity={0.1}
                            />
                            <Radar
                                name={userB.username}
                                dataKey="B"
                                stroke="#ef4444"
                                strokeWidth={2}
                                fill="#ef4444"
                                fillOpacity={0.1}
                            />
                            <Legend />
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
