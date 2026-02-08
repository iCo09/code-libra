'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { UserSkills, SkillTag } from '@/actions/get-user-skills';
import { cn } from '@/lib/utils';
import { DetailedUserProfile } from '@/lib/mock-data';
import { motion } from 'framer-motion';

interface SkillComparisonProps {
    userA: DetailedUserProfile;
    userB: DetailedUserProfile;
    skillsA: UserSkills | null;
    skillsB: UserSkills | null;
}

interface ProcessedSkill {
    name: string;
    slug: string;
    countA: number;
    countB: number;
    total: number;
    ratio: number; // 0 to 1 (share of A)
    category: string; // Added category field
}

const BubbleChart = ({ data, width = 800, height = 600, userA, userB }: { data: ProcessedSkill[], width?: number, height?: number, userA: DetailedUserProfile, userB: DetailedUserProfile }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    // Pack layout
    const root = useMemo(() => {
        if (!data || data.length === 0) return null;

        const hierarchy = d3.hierarchy({ children: data } as any)
            .sum(d => (d as any).total)
            .sort((a, b) => (b.value || 0) - (a.value || 0));

        const pack = d3.pack()
            .size([width, height])
            .padding(10); // More padding for jumping space

        return pack(hierarchy);
    }, [data, width, height]);

    return (
        <div className="flex justify-center items-center w-full overflow-hidden bg-secondary/5 rounded-2xl border border-border/50 p-4">
            <svg
                ref={svgRef}
                width={width}
                height={height}
                className="max-w-full h-auto drop-shadow-2xl"
                viewBox={`0 0 ${width} ${height}`}
                style={{ overflow: 'visible' }} // Allow bubbles to jump outside initial bounds
            >
                <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    {data.map((item, i) => (
                        <linearGradient key={`grad-${item.slug}`} id={`grad-${item.slug}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset={`${item.ratio * 100}%`} stopColor="#06b6d4" /> {/* Cyan 500 */}
                            <stop offset={`${item.ratio * 100}%`} stopColor="#ef4444" /> {/* Red 500 */}
                        </linearGradient>
                    ))}
                </defs>

                {root && root.leaves().map((leaf: any, i) => {
                    const item = leaf.data as ProcessedSkill;
                    // Randomize jump parameters for a more natural look
                    const jumpDuration = 2 + Math.random() * 2; // 2 to 4 seconds
                    const jumpDelay = Math.random() * 2; // 0 to 2 seconds initial delay
                    const jumpHeight = -5 - Math.random() * 10; // -5 to -15 pixels

                    return (
                        <motion.g
                            key={item.slug}
                            initial={{ scale: 0, opacity: 0, y: 0 }} // Initial state for entrance
                            animate={{
                                scale: 1,
                                opacity: 1,
                                y: [0, jumpHeight, 0] // Continuous jump animation
                            }}
                            transition={{
                                scale: { type: "spring", stiffness: 200, damping: 20, delay: i * 0.01 }, // Entrance scale transition
                                opacity: { duration: 0.5, delay: i * 0.01 }, // Entrance opacity transition
                                y: {
                                    duration: jumpDuration,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    repeatType: "mirror", // Makes it bounce smoothly
                                    delay: jumpDelay + 0.5 // Start jumping after entrance animation
                                }
                            }}
                            transform={`translate(${leaf.x},${leaf.y})`}
                            className="cursor-pointer hover:z-50" // Bring hovered item to front
                        >
                            {/* Shadow/Glow behind for depth */}
                            <circle
                                r={leaf.r}
                                fill={`url(#grad-${item.slug})`}
                                className="opacity-20 blur-md"
                            />

                            {/* Main Bubble */}
                            <circle
                                r={leaf.r}
                                fill={`url(#grad-${item.slug})`}
                                stroke="rgba(255,255,255,0.2)"
                                strokeWidth="1.5"
                                className="transition-all duration-300 hover:stroke-white hover:stroke-[3px]"
                            />

                            {/* Text Label (only if big enough) */}
                            {leaf.r > 15 && ( // Adjusted minimum radius for text
                                <g pointerEvents="none">
                                    <text
                                        y={-leaf.r * 0.1} // Position text relative to bubble center
                                        textAnchor="middle"
                                        dominantBaseline="middle" // Vertically center text
                                        className="fill-white font-bold drop-shadow-md pointer-events-none select-none"
                                        style={{ fontSize: Math.min(leaf.r / 2.5, 14) }} // Dynamic font size
                                    >
                                        {item.name.substring(0, Math.floor(leaf.r / 2))} {/* Truncate if too long */}
                                    </text>
                                    <text
                                        y={leaf.r * 0.4} // Position total count below name
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className="fill-white/90 font-medium drop-shadow-md pointer-events-none select-none"
                                        style={{ fontSize: Math.min(leaf.r / 3.5, 10) }}
                                    >
                                        {item.total}
                                    </text>
                                </g>
                            )}

                            {/* Tooltip with more details */}
                            <title>{`${item.name} (${item.category})\n${userA.username}: ${item.countA}\n${userB.username}: ${item.countB}`}</title>
                        </motion.g>
                    );
                })}
            </svg>
        </div>
    );
};

export default function SkillComparison({ userA, userB, skillsA, skillsB }: SkillComparisonProps) {
    if (!skillsA || !skillsB) return null;

    // Function to get all processed data across all categories
    const getAllProcessedData = (): ProcessedSkill[] => {
        const categories: (keyof UserSkills)[] = ['fundamental', 'intermediate', 'advanced'];
        let allSkills: ProcessedSkill[] = [];

        categories.forEach(categoryName => {
            const tags = new Set([
                ...(skillsA[categoryName]?.map(s => s.tagSlug) || []),
                ...(skillsB[categoryName]?.map(s => s.tagSlug) || [])
            ]);

            const categorySkills = Array.from(tags).map(slug => {
                const tagA = skillsA[categoryName]?.find(s => s.tagSlug === slug);
                const tagB = skillsB[categoryName]?.find(s => s.tagSlug === slug);
                const name = tagA?.tagName || tagB?.tagName || slug;
                const countA = tagA?.problemsSolved || 0;
                const countB = tagB?.problemsSolved || 0;
                const total = countA + countB;
                const ratio = total === 0 ? 0.5 : countA / total;

                return { name, slug, countA, countB, total, ratio, category: categoryName }; // Include category
            }).filter(item => item.total > 0);

            allSkills = [...allSkills, ...categorySkills];
        });

        return allSkills;
    };

    const allData = getAllProcessedData();

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col items-center gap-2 mb-8 text-center">
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-red-500">
                    Skill Universe
                </h3>
                <p className="text-muted-foreground text-sm">
                    Comparison across all topics. Size represents total solved, color split shows dominance.
                </p>
            </div>

            {allData.length > 0 ? (
                <BubbleChart data={allData} width={800} height={600} userA={userA} userB={userB} />
            ) : (
                <div className="text-center text-muted-foreground py-8">
                    No data available.
                </div>
            )}
        </div>
    );
}
