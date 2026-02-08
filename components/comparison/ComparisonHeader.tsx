
'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { DetailedUserProfile } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Swords } from 'lucide-react';
import { cn } from '@/lib/utils';

import Image from 'next/image';

interface ComparisonHeaderProps {
    userA: DetailedUserProfile;
    userB: DetailedUserProfile;
}

export default function ComparisonHeader({ userA, userB }: ComparisonHeaderProps) {
    const { scrollY } = useScroll();

    // Show header only after scrolling past the hero section (approx 400px)
    const opacity = useTransform(scrollY, [300, 400], [0, 1]);
    const y = useTransform(scrollY, [300, 400], [-100, 0]);

    return (
        <motion.div
            style={{ opacity, y }}
            className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3"
        >
            <div className="max-w-5xl mx-auto flex items-center justify-between">

                {/* User A - Left */}
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-blue-500/50">
                        <AvatarImage src={userA.avatar} />
                        <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block">
                        <div className="font-bold text-foreground text-sm">{userA.username}</div>
                        <div className="text-xs text-blue-500">Rating: {userA.contestRating}</div>
                    </div>
                </div>

                {/* Center - VS */}
                <div className="flex items-center justify-center">
                    <div className="relative w-6 h-6 md:w-8 md:h-8">
                        <Image
                            src="/vs_icon.png"
                            alt="VS"
                            fill
                            className="object-contain drop-shadow-md dark:invert"
                        />
                    </div>
                </div>

                {/* User B - Right */}
                <div className="flex items-center gap-3 flex-row-reverse text-right">
                    <Avatar className="h-10 w-10 border border-orange-500/50">
                        <AvatarImage src={userB.avatar} />
                        <AvatarFallback>B</AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block">
                        <div className="font-bold text-foreground text-sm">{userB.username}</div>
                        <div className="text-xs text-orange-500">Rating: {userB.contestRating}</div>
                    </div>
                </div>

            </div>
        </motion.div>
    );
}
