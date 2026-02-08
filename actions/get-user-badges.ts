
import { API_URL } from "@/lib/api-url";

export interface Badge {
    id: string;
    displayName: string;
    icon: string;
    creationDate: string;
}

export interface UpcomingBadge {
    name: string;
    icon: string;
}

export interface ActiveBadge {
    id: string;
    displayName: string;
    icon: string;
    creationDate: string;
}

export interface UserBadgesResponse {
    badgesCount: number;
    badges: Badge[];
    upcomingBadges: UpcomingBadge[];
    activeBadge: ActiveBadge;
}

export const getUserBadges = async (username: string): Promise<UserBadgesResponse> => {
    try {
        const response = await fetch(`${API_URL}/${username}/badges`);

        if (response.status === 429) {
            console.error(`Rate limited (429) fetching badges for ${username}`);
            // return empty structure or throw depending on desired behavior. 
            // Throwing allows the page to handle the rate limit globally.
            throw new Error('Too Many Requests. Please wait a moment before trying again.');
        }

        if (!response.ok) {
            // Handle errors gracefully, maybe return empty if not found or throw?
            // For now, let's assume if it fails we just return empty structure or throw to be caught by Promise.all
            console.error(`Failed to fetch badges for ${username}: ${response.statusText}`);
            return {
                badgesCount: 0,
                badges: [],
                upcomingBadges: [],
                activeBadge: {} as ActiveBadge
            };
        }

        const data: UserBadgesResponse = await response.json();
        return data;
    } catch (error) {
        console.error("API Error fetching badges:", error);
        return {
            badgesCount: 0,
            badges: [],
            upcomingBadges: [],
            activeBadge: {} as ActiveBadge
        };
    }
};
