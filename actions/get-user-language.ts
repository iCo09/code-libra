
import { API_URL } from "@/lib/api-url";

export interface LanguageStatsResponse {
    languageProblemCount: {
        languageName: string;
        problemsSolved: number;
    }[];
}

export const getUserLanguageStats = async (username: string): Promise<LanguageStatsResponse> => {
    try {
        const response = await fetch(`${API_URL}/${username}/language`);
        const data = await response.json();

        if (response.status === 429) {
            throw new Error('Too Many Requests. Please wait a moment before trying again.');
        }

        if (!response.ok) {
            // It's possible the user doesn't have language stats or the endpoint fails. 
            // We can return an empty list or throw. Returning empty might be safer for UI.
            console.error('Failed to fetch user language stats', data);
            return { languageProblemCount: [] };
        }

        if (data.errors && data.errors.length > 0) {
            console.error('API Error fetching language stats:', data.errors);
            return { languageProblemCount: [] };
        }

        return data;
    } catch (error) {
        console.error("API Error:", error);
        return { languageProblemCount: [] };
    }
};
