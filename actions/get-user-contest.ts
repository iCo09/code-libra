
import { API_URL } from "@/lib/api-url";

export interface ContestData {
    contestAttend: number;
    contestRating: number;
    contestGlobalRanking: number;
    totalParticipants: number;
    contestTopPercentage: number;
    contestBadges: {
        name: string; // e.g., "Knight", "Guardian"
    } | null;
    contestParticipation: {
        attended: boolean;
        rating: number;
        ranking: number;
        trendDirection: string;
        problemsSolved: number;
        totalProblems: number;
        finishTimeInSeconds: number;
        contest: {
            title: string;
            startTime: number;
        };
    }[];
}

export const getUserContest = async (username: string): Promise<ContestData> => {
    try {
        const response = await fetch(`${API_URL}/${username}/contest`);
        const data = await response.json();

        if (response.status === 429) {
            throw new Error('Too Many Requests. Please wait a moment before trying again.');
        }

        if (!response.ok) {
            throw new Error('Failed to fetch user contest data');
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
