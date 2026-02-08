
import { API_URL } from "@/lib/api-url";

export interface UserStats {
    totalSolved: number;
    totalSubmissions: {
        difficulty: "All" | "Easy" | "Medium" | "Hard";
        count: number;
        submissions: number;
    }[];
    totalQuestions: number;
    easySolved: number;
    totalEasy: number;
    mediumSolved: number;
    totalMedium: number;
    hardSolved: number;
    totalHard: number;
    ranking: number;
    contributionPoint: number;
    reputation: number;
    submissionCalendar: Record<string, number>;
    recentSubmissions: {
        title: string;
        titleSlug: string;
        timestamp: string;
        statusDisplay: string;
        lang: string;
    }[];
    matchedUserStats: {
        acSubmissionNum: {
            difficulty: string;
            count: number;
            submissions: number;
        }[];
        totalSubmissionNum: {
            difficulty: string;
            count: number;
            submissions: number;
        }[];
    }
}

export const getUserStats = async (username: string): Promise<UserStats> => {
    try {
        const response = await fetch(`${API_URL}/${username}/profile`);
        const data = await response.json();

        if (response.status === 429) {
            throw new Error('Too Many Requests. Please wait a moment before trying again.');
        }

        if (!response.ok) {
            throw new Error('Failed to fetch user stats');
        }

        if (data.errors && data.errors.length > 0) {
            throw new Error(data.errors[0].message);
        }

        return data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};
