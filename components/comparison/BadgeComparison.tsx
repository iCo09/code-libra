'use client';

import React from 'react';
import { DetailedUserProfile } from '@/lib/mock-data';
import Image from 'next/image';
import { Badge } from '@/actions/get-user-badges';

interface BadgeComparisonProps {
    userA: DetailedUserProfile;
    userB: DetailedUserProfile;
}

export default function BadgeComparison({ userA, userB }: BadgeComparisonProps) {
    const badgesA = userA.badgesData?.badges || [];
    const badgesB = userB.badgesData?.badges || [];

    // Combine all unique badges to create a union set for comparison if needed, 
    // or just list them side by side. 
    // The request asks to "show real comparison". 
    // A simple list might not be enough. Let's try to align them or show stats.

    // Let's sort badges by creation date desc for both
    const sortedBadgesA = [...badgesA].sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
    const sortedBadgesB = [...badgesB].sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());

    return (
        <div className="space-y-6">
            {/* <h3 className="text-xl font-semibold mb-4 text-center">Badges Collection</h3> */}

            <div className="grid grid-cols-2 gap-8">
                {/* User A Column */}
                <div className="space-y-4">
                    <div className="text-center pb-2 border-b border-border/50">
                        <div className="text-2xl font-bold text-cyan-500">{userA.badgesData?.badgesCount || 0}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Badges</div>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {sortedBadgesA.map((badge) => (
                            <BadgeItem key={badge.id} badge={badge} />
                        ))}
                        {sortedBadgesA.length === 0 && (
                            <div className="col-span-full text-center text-muted-foreground text-sm py-4">No badges found</div>
                        )}
                    </div>
                </div>

                {/* User B Column */}
                <div className="space-y-4">
                    <div className="text-center pb-2 border-b border-border/50">
                        <div className="text-2xl font-bold text-red-500">{userB.badgesData?.badgesCount || 0}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Badges</div>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {sortedBadgesB.map((badge) => (
                            <BadgeItem key={badge.id} badge={badge} />
                        ))}
                        {sortedBadgesB.length === 0 && (
                            <div className="col-span-full text-center text-muted-foreground text-sm py-4">No badges found</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function BadgeItem({ badge }: { badge: Badge }) {
    // Some icons are full URLs, others are relative path
    const iconUrl = badge.icon.startsWith('http') ? badge.icon : `https://leetcode.com${badge.icon}`;

    return (
        <div className="group relative flex flex-col items-center">
            <div className="w-8 h-8 relative transition-transform transform group-hover:scale-110">
                <Image
                    src={iconUrl}
                    alt={badge.displayName}
                    fill
                    className="object-contain"
                    onError={(e) => {
                        // Fallback or hide? for now let Next.js handle it, or we could add a placeholder
                        // e.currentTarget.style.display = 'none';
                    }}
                />
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-[10px] rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-border">
                {badge.displayName}
                <div className="text-[9px] text-muted-foreground">{badge.creationDate}</div>
            </div>
        </div>
    );
}
