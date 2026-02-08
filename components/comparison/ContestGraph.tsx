
'use client';

import { DetailedUserProfile } from '@/lib/mock-data';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { Card } from '@/components/ui/card';

interface ContestGraphProps {
    userA: DetailedUserProfile;
    userB: DetailedUserProfile;
}

export default function ContestGraph({ userA, userB }: ContestGraphProps) {
    // Merge histories into a unified timeline
    // 1. Collect all unique dates/timestamps
    const allDates = new Set<string>();
    const historyA = new Map(userA.contestHistory.map(h => [h.date, h]));
    const historyB = new Map(userB.contestHistory.map(h => [h.date, h]));

    userA.contestHistory.forEach(h => allDates.add(h.date));
    userB.contestHistory.forEach(h => allDates.add(h.date));

    // 2. Sort dates chronologically
    const sortedDates = Array.from(allDates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    // 3. Keep track of last known rating to fill gaps if we want "stepped" look, 
    // or just let recharts handle nulls (connectNulls). 
    // Usually, rating persists until changed. Let's try filling forward for a better visual comparison?
    // Actually, LeetCode shows points. Connecting them is fine.

    // We'll prepare data points. If a user didn't participate, we can send null or the previous value.
    // Sending null with connectNulls={true} is often best for "rating over time".

    const chartData = sortedDates.map(date => {
        const entryA = historyA.get(date);
        const entryB = historyB.get(date);

        return {
            date,
            ratingA: entryA ? entryA.rating : null,
            ratingB: entryB ? entryB.rating : null,
            // rankA: entryA?.rank,
            // rankB: entryB?.rank
            // Rank is tricky to plot on same axis as rating due to scale diffs (1500 vs 5000)
        };
    });

    return (
        <div className="w-full h-full">


            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} strokeOpacity={0.5} />
                        <XAxis
                            dataKey="date"
                            stroke="var(--muted-foreground)"
                            tick={{ fontSize: 10 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="var(--muted-foreground)"
                            tick={{ fontSize: 10 }}
                            tickLine={false}
                            axisLine={false}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)', borderRadius: '0px' }}
                            itemStyle={{ fontSize: '12px', color: 'var(--foreground)' }}
                            labelStyle={{ color: 'var(--muted-foreground)', fontSize: '12px', marginBottom: '4px' }}
                        />
                        <Legend iconType="circle" />
                        <Line
                            type="monotone"
                            dataKey="ratingA"
                            name={userA.username}
                            stroke="#06b6d4"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4 }}
                            connectNulls
                        />
                        <Line
                            type="monotone"
                            dataKey="ratingB"
                            name={userB.username}
                            stroke="#ef4444"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4 }}
                            connectNulls
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground text-center font-light">
                    <span className="font-medium text-foreground">{userA.username}</span> shows steadier growth, while <span className="font-medium text-foreground">{userB.username}</span> has higher volatility.
                </p>
            </div>
        </div>
    );
}
