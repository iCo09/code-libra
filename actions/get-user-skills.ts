
import { API_URL } from "@/lib/api-url";

export interface SkillTag {
    tagName: string;
    tagSlug: string;
    problemsSolved: number;
}

export interface UserSkills {
    fundamental: SkillTag[];
    intermediate: SkillTag[];
    advanced: SkillTag[];
}

export const getUserSkills = async (username: string): Promise<UserSkills> => {
    try {
        const response = await fetch(`${API_URL}/${username}/skill`);
        const data = await response.json();

        if (response.status === 429) {
            throw new Error('Too Many Requests. Please wait a moment before trying again.');
        }

        if (!response.ok) {
            throw new Error('Failed to fetch user skills');
        }

        if (data.errors && data.errors.length > 0) {
            throw new Error(data.errors[0].message);
        }

        return data;
    } catch (error) {
        console.error("API Error:", error);
        // Return empty structure on error to prevent page crash
        return {
            fundamental: [],
            intermediate: [],
            advanced: []
        };
    }
};
