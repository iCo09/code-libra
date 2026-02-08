
import { API_URL } from "@/lib/api-url";

export interface UserProfile {
    username: string;
    name: string;
    birthday: string;
    avatar: string;
    ranking: number;
    reputation: number;
    gitHub: string;
    twitter: string;
    linkedIN: string;
    website: string[];
    country: string;
    company: string | null;
    school: string | null;
    skillTags: string[];
    about: string;
}

export const getUserProfile = async (username: string): Promise<UserProfile> => {
    try {
        const response = await fetch(`${API_URL}/${username}`);
        const data = await response.json();

        if (response.status === 429) {
            throw new Error('Too Many Requests. Please wait a moment before trying again.');
        }

        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
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
