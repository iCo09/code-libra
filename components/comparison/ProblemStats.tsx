
'use client';

import { DetailedUserProfile } from '@/lib/mock-data';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

interface ProblemStatsProps {
    userA: DetailedUserProfile;
    userB: DetailedUserProfile;
}

export default function ProblemStats({ userA, userB }: ProblemStatsProps) {
    const data = [
        {
            name: 'Easy',
            [userA.username]: userA.solvedStats.easy,
            [userB.username]: userB.solvedStats.easy,
        },
        {
            name: 'Medium',
            [userA.username]: userA.solvedStats.medium,
            [userB.username]: userB.solvedStats.medium,
        },
        {
            name: 'Hard',
            [userA.username]: userA.solvedStats.hard,
            [userB.username]: userB.solvedStats.hard,
        },
    ];

    return (
        <div className="w-full h-full">

            <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <BarChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 0,
                            bottom: 5,
                        }}
                        barGap={8}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} strokeOpacity={0.5} />
                        <XAxis
                            dataKey="name"
                            stroke="var(--muted-foreground)"
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="var(--muted-foreground)"
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: 'var(--muted)' }}
                            contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)', borderRadius: '0px' }}
                            itemStyle={{ fontSize: '12px', color: 'var(--foreground)' }}
                        />
                        <Legend
                            iconType="circle"
                            wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                        />
                        <Bar dataKey={userA.username} fill="#06b6d4" radius={[4, 4, 0, 0]} maxBarSize={50} />
                        <Bar dataKey={userB.username} fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={50} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Beats Stats - Minimal */}
            <div className="mt-8 flex justify-between border-t border-border pt-4">
                <div className="text-left">
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Avg. Beats</div>
                    <div className="text-2xl font-light text-foreground">{userA.solvedStats.beats}%</div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Avg. Beats</div>
                    <div className="text-2xl font-light text-foreground">{userB.solvedStats.beats}%</div>
                </div>
            </div>
        </div>
    );
}
