'use client';

import { useState, useEffect, use } from 'react';
import { DetailedUserProfile, DEFAULT_USERNAME_A } from '@/lib/mock-data';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import SummaryCard from '@/components/profile/SummaryCard';
import RatingMiniGraph from '@/components/profile/RatingMiniGraph';
import BadgesSection from '@/components/profile/BadgesSection';
import ActivityFeed from '@/components/profile/ActivityFeed';
import ProfileHeatmap, { ColorTheme } from '@/components/profile/ProfileHeatmap';
import ContestGraph from '@/components/comparison/ContestGraph';
import LanguageStats from '@/components/comparison/LanguageStats';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, Target, Award, Flame } from 'lucide-react';
import { getUserProfile } from '@/actions/get-user-profile';
import { getUserTotalActiveDays } from '@/actions/get-user-calendar';
import { getUserContest } from '@/actions/get-user-contest';
import { getUserStats } from '@/actions/get-user-stats';
import { getUserBadges } from '@/actions/get-user-badges';
import { getUserLanguageStats } from '@/actions/get-user-language';
import { getDailyQuestion, DailyQuestion } from '@/actions/get-daily-question';
//@ts-ignore
import { toast } from 'sonner';

interface ProfilePageProps {
    params: Promise<{
        username: string;
    }>;
}

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
        totalEasy: 3274,
        totalMedium: 1500,
        totalHard: 642,
        beats: 0,
    },
    contestHistory: [],
    languages: [],
    badges: [],
    strengths: [],
});

export default function ProfilePage({ params }: ProfilePageProps) {
    // Unwrap the params Promise
    const { username } = use(params);

    const [user, setUser] = useState<DetailedUserProfile>(createDefaultProfile(username));
    const [loading, setLoading] = useState(true);
    const [colorTheme, setColorTheme] = useState<ColorTheme>('green');
    const [dailyQuestion, setDailyQuestion] = useState<DailyQuestion | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
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
                    ranking: profileData.ranking || 0,
                    reputation: profileData.reputation || 0,
                    skillTags: profileData.skillTags || [],
                    birthday: profileData.birthday,
                    gitHub: profileData.gitHub,
                    twitter: profileData.twitter,
                    linkedIN: profileData.linkedIN,
                    website: profileData.website,
                    company: profileData.company,
                    school: profileData.school,
                    about: profileData.about,
                    submissionCalendar: calendarAggregated.submissionCalendar,

                    contestRating: contestData.contestRating || 0,
                    contestTopPercentage: contestData.contestTopPercentage,
                    totalSolved: statsData.totalSolved,
                    streak: calendarAggregated.streak,
                    activeDays: calendarAggregated.totalActiveDays,
                    activeYears: calendarAggregated.activeYears,
                    wins: 0,
                    level: (contestData.contestBadges?.name as "Knight" | "Guardian" | "None") || "None",

                    solvedStats: {
                        easy: statsData.easySolved,
                        medium: statsData.mediumSolved,
                        hard: statsData.hardSolved,
                        totalEasy: statsData.totalEasy,
                        totalMedium: statsData.totalMedium,
                        totalHard: statsData.totalHard,
                        beats: 0,
                    },

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
                    badges: [],
                    strengths: [],
                    badgesData: badgesData
                });
            } catch (error: any) {
                console.error(error);
                toast.error(`Failed to fetch profile: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [username]);

    useEffect(() => {
        const fetchDailyQuestion = async () => {
            try {
                const data = await getDailyQuestion();
                setDailyQuestion(data);
            } catch (error: any) {
                console.error('Failed to fetch daily question:', error);
            }
        };

        fetchDailyQuestion();
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground px-6">
            <div className="max-w-7xl mx-auto px-4 py-2">
                {/* Two-column Layout - Adjusted for compact design */}
                <div className="grid grid-cols-1 lg:grid-cols-[25%_75%] gap-4">
                    {/* Left Sidebar - Sticky & Compact */}
                    <div className="lg:sticky lg:top-4 lg:self-start border-1 p-2">
                        <ProfileSidebar user={user} />
                    </div>

                    {/* Right Panel - Main Content - Prioritized Sections */}
                    <div className="space-y-4 p-2 border-1">
                        {/* Top Summary Strip - Compact */}
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 border-1 border-border/50">
                            <SummaryCard
                                title="Rating"
                                value={user.contestRating.toFixed(1)}
                                subtitle={user.level !== "None" ? user.level : undefined}
                                icon={Trophy}
                                iconColor="text-yellow-500"
                                className='border-r-1'
                            />
                            <SummaryCard
                                title="Rank"
                                value={`#${user.ranking.toLocaleString()}`}
                                icon={TrendingUp}
                                iconColor="text-blue-500"
                                className='border-r-1'
                            />
                            <SummaryCard
                                title="Solved"
                                value={user.totalSolved}
                                subtitle={`${user.solvedStats.easy}/${user.solvedStats.medium}/${user.solvedStats.hard}`}
                                icon={Target}
                                iconColor="text-green-500"
                                className='border-r-1'
                            />
                            <SummaryCard
                                title="Contests"
                                value={user.contestHistory.length}
                                subtitle={user.contestTopPercentage ? `Top ${user.contestTopPercentage.toFixed(1)}%` : undefined}
                                icon={Award}
                                iconColor="text-purple-500"
                                className='border-r-1'
                            />


                            {/* POTD */}
                            <div className="relative p-2 transition-all shadow-sm">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-background/50 text-yellow-500">
                                            <Flame className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                                            POTD
                                        </span>
                                        {dailyQuestion && (
                                            <div className="group relative">
                                                <a
                                                    href={dailyQuestion.questionLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`text-md font-bold tabular-nums hover:underline ${dailyQuestion.difficulty === 'Easy' ? 'text-green-500' :
                                                        dailyQuestion.difficulty === 'Medium' ? 'text-yellow-500' :
                                                            'text-red-500'
                                                        }`}
                                                >
                                                    {dailyQuestion.questionFrontendId}
                                                </a>
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-border">
                                                    {dailyQuestion.questionTitle}
                                                    <div className="text-[10px] text-muted-foreground mt-0.5">{dailyQuestion.difficulty}</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PRIORITY 1: Activity & Consistency Heatmap */}
                        <div className="border-1 border-border/50 p-2">
                            <ProfileHeatmap user={user} theme={colorTheme} onThemeChange={setColorTheme} />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* PRIORITY 2: Rating History Graph */}
                            <div className="border-1 border-border/50 p-2">
                                <h3 className="text-base font-medium text-foreground mb-3">Rating History</h3>
                                <ContestGraph userA={user} singleUser={true} colorTheme={colorTheme} />
                            </div>

                            {/* Secondary: Language Stats */}
                            <div className="border-1 border-border/50 p-2">
                                <h3 className="text-base font-medium text-foreground mb-3">Languages</h3>
                                <LanguageStats userA={user} singleUser={true} variant="radar" colorTheme={colorTheme} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}