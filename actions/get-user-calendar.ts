
import { API_URL } from "@/lib/api-url";

export interface CalendarData {
    activeYears: number[];
    streak: number;
    totalActiveDays: number;
    submissionCalendar: string; // JSON string
}


export const getUserCalendar = async (username: string, year?: number): Promise<CalendarData> => {
    try {
        const yearParam = year ? `?year=${year}` : '';
        const response = await fetch(`${API_URL}/${username}/calendar${yearParam}`);
        const data = await response.json();

        if (response.status === 429) {
            throw new Error('Too Many Requests. Please wait a moment before trying again.');
        }

        if (!response.ok) {
            throw new Error('Failed to fetch user calendar');
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

export const getUserTotalActiveDays = async (username: string): Promise<{ totalActiveDays: number; streak: number; activeYears: number[]; submissionCalendar: Record<string, number> }> => {
    try {
        // 1. Fetch current year to get the list of activeYears
        const currentYear = new Date().getFullYear();
        const initialData = await getUserCalendar(username, currentYear);

        // 2. Fetch all other active years in parallel
        const otherYears = initialData.activeYears.filter(y => y !== currentYear);

        const otherYearsData = await Promise.all(
            otherYears.map(year => getUserCalendar(username, year))
        );

        // 3. Sum totalActiveDays and merge submission calendars
        let totalActiveDays = initialData.totalActiveDays;
        let mergedCalendar: Record<string, number> = {};

        // Helper to merge
        const merge = (calendarStr: string) => {
            try {
                const cal = JSON.parse(calendarStr);
                Object.assign(mergedCalendar, cal);
            } catch (e) {
                console.error("Failed to parse calendar", e);
            }
        };

        merge(initialData.submissionCalendar); // Current year

        otherYearsData.forEach(data => {
            totalActiveDays += data.totalActiveDays;
            merge(data.submissionCalendar);
        });

        return {
            totalActiveDays,
            streak: initialData.streak, // Current streak is typically in the current year response (or latest)
            activeYears: initialData.activeYears,
            submissionCalendar: mergedCalendar
        };
    } catch (error) {
        console.error("Aggregation Error:", error);
        // Fallback to basic data if specific year fetch fails
        return { totalActiveDays: 0, streak: 0, activeYears: [], submissionCalendar: {} };
    }
};
