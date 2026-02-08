
export interface DetailedUserProfile {
    username: string;
    name: string;
    avatar: string;
    country: string; // e.g., "US", "IN"
    ranking: number;
    contestRating: number;
    totalSolved: number;
    reputation: number;
    streak: number;
    activeDays: number;
    wins: number;
    level: "Knight" | "Guardian" | "None";
    skillTags: string[];
    // New fields from API
    birthday?: string;
    gitHub?: string;
    twitter?: string;
    linkedIN?: string;
    website?: string[];
    company?: string | null;
    school?: string | null;
    about?: string;
    submissionCalendar?: Record<string, number>;
    contestTopPercentage?: number;
    activeYears?: number[];
    badgesData?: import("../actions/get-user-badges").UserBadgesResponse;

    // Problem Solving
    solvedStats: {
        easy: number;
        medium: number;
        hard: number;
        totalEasy: number;
        totalMedium: number;
        totalHard: number;
        beats: number; // percentage
    };

    // Contest History (simplified for graph)
    contestHistory: { date: string; rating: number; rank: number }[];

    // Language Stats
    languages: { name: string; solved: number }[];

    // Badges
    badges: { name: string; icon: string; rare?: boolean }[];

    // Comparison Verdict (mocked)
    strengths: string[];
}

// Default usernames - can be overridden by URL params
export const DEFAULT_USERNAME_A = "devlprnitish";
export const DEFAULT_USERNAME_B = "iCo09";