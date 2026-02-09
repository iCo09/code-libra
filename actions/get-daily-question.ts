
import { API_URL } from "@/lib/api-url";

export interface DailyQuestion {
    questionLink: string;
    date: string;
    questionId: string;
    questionFrontendId: string;
    questionTitle: string;
    titleSlug: string;
    difficulty: "Easy" | "Medium" | "Hard";
    isPaidOnly: boolean;
    question: string;
    exampleTestcases: string;
    topicTags: Array<{
        name: string;
        slug: string;
        translatedName: string | null;
    }>;
    hints: string[];
    solution: {
        id: string;
        canSeeDetail: boolean;
        paidOnly: boolean;
        hasVideoSolution: boolean;
        paidOnlyVideo: boolean;
    };
    companyTagStats: any;
    likes: number;
    dislikes: number;
    similarQuestions: string;
}

export const getDailyQuestion = async (): Promise<DailyQuestion> => {
    try {
        const response = await fetch(`${API_URL}/daily`);
        const data = await response.json();

        if (response.status === 429) {
            throw new Error('Too Many Requests. Please wait a moment before trying again.');
        }

        if (!response.ok) {
            throw new Error('Failed to fetch daily question');
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
