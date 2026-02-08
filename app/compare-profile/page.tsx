'use client';
import { useState, useEffect } from 'react';
import { DetailedUserProfile, DEFAULT_USERNAME_A, DEFAULT_USERNAME_B } from '@/lib/mock-data';
import ComparisonHeader from '@/components/comparison/ComparisonHeader';
import HeroComparison from '@/components/comparison/HeroComparison';
import ProblemStats from '@/components/comparison/ProblemStats';
import ContestGraph from '@/components/comparison/ContestGraph';
import ActivityHeatmap from '@/components/comparison/ActivityHeatmap';
import LanguageStats from '@/components/comparison/LanguageStats';
import VerdictCard from '@/components/comparison/VerdictCard';
import { getUserProfile } from '@/actions/get-user-profile';
import { getUserTotalActiveDays } from '@/actions/get-user-calendar';
import { getUserContest } from '@/actions/get-user-contest';
import { getUserStats } from '@/actions/get-user-stats';
//@ts-ignore
import { toast } from "sonner";
import { getUserSkills, UserSkills } from '@/actions/get-user-skills';
import SkillComparison from '@/components/comparison/SkillComparison';
import BadgeComparison from '@/components/comparison/BadgeComparison';
import { getUserBadges } from '@/actions/get-user-badges';
import { getUserLanguageStats } from '@/actions/get-user-language';


import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// Helper function to create a default empty user profile
const createDefaultProfile = (username: string): DetailedUserProfile => ({
    username,
    name: username,
    avatar: "https://assets.leetcode.com/users/default_avatar.png",
    country: "",
    ranking: 0,
    contestRating: 0,
    totalSolved: 0,
    reputation: 0,
    streak: 0,
    activeDays: 0,
    wins: 0,
    level: "None",
    skillTags: [],
    solvedStats: {
        easy: 0,
        medium: 0,
        hard: 0,
        totalEasy: 0,
        totalMedium: 0,
        totalHard: 0,
        beats: 0,
    },
    contestHistory: [],
    languages: [],
    badges: [],
    strengths: [],
});

function CompareProfileContent() {
    const searchParams = useSearchParams();
    const u1 = searchParams.get("u1");
    const u2 = searchParams.get("u2");

    // Initialize with URL params if available, otherwise use defaults
    const initialUsernameA = u1 || DEFAULT_USERNAME_A;
    const initialUsernameB = u2 || DEFAULT_USERNAME_B;

    const [userA, setUserA] = useState<DetailedUserProfile>(createDefaultProfile(initialUsernameA));
    const [userB, setUserB] = useState<DetailedUserProfile>(createDefaultProfile(initialUsernameB));
    const [loadingA, setLoadingA] = useState(!!u1);
    const [loadingB, setLoadingB] = useState(!!u2);
    const [skillsA, setSkillsA] = useState<UserSkills | null>(null);
    const [skillsB, setSkillsB] = useState<UserSkills | null>(null);

    const handleFetchUser = async (username: string, slot: 'A' | 'B') => {
        if (!username.trim()) return;

        const setLoading = slot === 'A' ? setLoadingA : setLoadingB;
        const setUser = slot === 'A' ? setUserA : setUserB;
        const defaultProfile = createDefaultProfile(username);

        setLoading(true);
        try {
            // Parallel fetch for profile, stats, contest, and aggregated calendar metrics
            const [profileData, statsData, contestData, calendarAggregated, badgesData, languageData] = await Promise.all([
                getUserProfile(username),
                getUserStats(username),
                getUserContest(username),
                getUserTotalActiveDays(username),
                getUserBadges(username),
                getUserLanguageStats(username)
            ]);


            setUser({
                username: profileData.username,
                name: profileData.name,
                avatar: profileData.avatar,
                country: profileData.country,
                ranking: profileData.ranking || defaultProfile.ranking,
                reputation: profileData.reputation || defaultProfile.reputation,
                skillTags: profileData.skillTags || defaultProfile.skillTags,
                birthday: profileData.birthday,
                gitHub: profileData.gitHub,
                twitter: profileData.twitter,
                linkedIN: profileData.linkedIN,
                website: profileData.website,
                company: profileData.company,
                school: profileData.school,
                about: profileData.about,
                submissionCalendar: calendarAggregated.submissionCalendar,

                // Merged Stats
                contestRating: contestData.contestRating || 0,
                contestTopPercentage: contestData.contestTopPercentage,
                totalSolved: statsData.totalSolved,
                streak: calendarAggregated.streak,
                activeDays: calendarAggregated.totalActiveDays,
                activeYears: calendarAggregated.activeYears,
                wins: defaultProfile.wins,
                level: (contestData.contestBadges?.name as "Knight" | "Guardian" | "None") || defaultProfile.level,

                solvedStats: {
                    easy: statsData.easySolved,
                    medium: statsData.mediumSolved,
                    hard: statsData.hardSolved,
                    totalEasy: statsData.totalEasy,
                    totalMedium: statsData.totalMedium,
                    totalHard: statsData.totalHard,
                    beats: defaultProfile.solvedStats.beats,
                },

                // Transform contestParticipation to contestHistory format
                contestHistory: contestData.contestParticipation
                    .filter(p => p.attended)
                    .map(p => ({
                        date: new Date(p.contest.startTime * 1000).toISOString().split('T')[0],
                        rating: p.rating,
                        rank: p.ranking,
                        timestamp: p.contest.startTime
                    }))
                    .sort((a, b) => a.timestamp - b.timestamp),

                languages: languageData.languageProblemCount.map(l => ({
                    name: l.languageName,
                    solved: l.problemsSolved
                })),
                badges: defaultProfile.badges,
                strengths: defaultProfile.strengths,
                badgesData: badgesData
            });


            // Fetch skills separately to avoid blocking main profile load if slow? 
            // Or just await it with the others. It's fast enough.
            // But we need to update state.
            const skills = await getUserSkills(username);
            if (slot === 'A') setSkillsA(skills);
            else setSkillsB(skills);

            toast.success(`Fetched profile for ${profileData.username}`);
        } catch (error: any) {
            console.error(error);
            if (error.message.includes("Too Many Requests")) {
                toast.error("Rate Limit Exceeded: You are making too many requests. Please wait a moment before trying again.", {
                    duration: 5000,
                });
            } else {
                toast.error(`Failed to fetch profile for ${username}: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    // Fetch initial data on load
    useEffect(() => {
        const initialUserA = u1 || DEFAULT_USERNAME_A;
        const initialUserB = u2 || DEFAULT_USERNAME_B;

        handleFetchUser(initialUserA, 'A');
        handleFetchUser(initialUserB, 'B');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [u1, u2]);

    return (
        <div className="min-h-screen bg-background text-foreground pb-20 overflow-x-hidden selection:bg-blue-500/30">
            {/* Sticky Header */}
            <ComparisonHeader userA={userA} userB={userB} />

            {/* Hero Section */}
            <HeroComparison
                userA={userA}
                userB={userB}
                onUserUpdate={handleFetchUser}
                loadingA={loadingA}
                loadingB={loadingB}
            />

            <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 relative z-10">
                {/* ROW 2: Activity Heatmap (Full Width) */}
                <div className="p-4 rounded-xl">
                    <ActivityHeatmap userA={userA} userB={userB} />
                </div>

                {/* Visual Separator */}
                <div className="h-px bg-border/50 w-full mb-8" />

                {/* ROW 1: Problem Stats + Contest Graph */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
                    <div className="p-4 rounded-xl">
                        <ProblemStats userA={userA} userB={userB} />
                    </div>
                    <div className="p-4 rounded-xl">
                        <ContestGraph userA={userA} userB={userB} />
                    </div>
                </div>

                {/* Visual Separator */}
                <div className="h-px bg-border/50 w-full" />



                {/* Visual Separator */}
                <div className="h-px bg-border/50 w-full" />

                {/* ROW 3: Language Stats + Verdict */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
                    <div className="p-4 rounded-xl">
                        <LanguageStats userA={userA} userB={userB} />
                    </div>

                    {/* ROW 4: Badge Comparison */}
                    <div className="p-4 rounded-xl">
                        <BadgeComparison userA={userA} userB={userB} />
                    </div>

                </div>

                {/* Visual Separator */}
                <div className="h-px bg-border/50 w-full" />



                <div className="p-4 rounded-xl flex items-center justify-center">
                    <VerdictCard userA={userA} userB={userB} />
                </div>


                {/* Visual Separator */}
                <div className="h-px bg-border/50 w-full" />

                {/* ROW 4: Skill Comparison (New) */}
                {/* <div className="p-4 rounded-xl">
                    <SkillComparison
                        userA={userA}
                        userB={userB}
                        skillsA={skillsA}
                        skillsB={skillsB}
                    />
                </div> */}
            </div>

            {/* Footer / Disclaimer */}
            <div className="text-center text-gray-500 text-sm mt-20 opacity-50">
                Generated by LeetCode Conflict • Data updated just now
            </div>
        </div>
    );
}

export default function CompareProfile() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading comparison...</div>}>
            <CompareProfileContent />
        </Suspense>
    );
}