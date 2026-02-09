import { getUserStats } from './get-user-stats';
import { getUserSkills } from './get-user-skills';
import { getUserContest } from './get-user-contest';
import { getUserCalendar } from './get-user-calendar';
import { calculateUserScore, UserScoreInput, UserScoreResult, ADVANCED_TOPICS } from '@/lib/calculate-user-score';

/**
 * Fetches all required user data and calculates their comprehensive score
 * @param username LeetCode username
 * @returns UserScoreResult with total score, breakdown, and rank
 */
export async function getUserScore(username: string): Promise<UserScoreResult> {
    try {
        // Fetch all required data in parallel
        const [statsData, skillsData, contestData, calendarData] = await Promise.all([
            getUserStats(username),
            getUserSkills(username),
            getUserContest(username),
            getUserCalendar(username),
        ]);

        // Calculate active days in last 90 days
        const activeDaysLast90 = calculateActiveDaysLast90(calendarData.submissionCalendar);

        // Transform skills data to include advanced flag
        const allTopics = [
            ...skillsData.fundamental.map(t => ({
                topicName: t.tagName,
                problemsSolved: t.problemsSolved,
                isAdvanced: false,
            })),
            ...skillsData.intermediate.map(t => ({
                topicName: t.tagName,
                problemsSolved: t.problemsSolved,
                isAdvanced: false,
            })),
            ...skillsData.advanced.map(t => ({
                topicName: t.tagName,
                problemsSolved: t.problemsSolved,
                isAdvanced: ADVANCED_TOPICS.includes(t.tagName),
            })),
        ];

        // Prepare input for scoring algorithm
        const scoreInput: UserScoreInput = {
            problemsSolved: {
                easy: statsData.easySolved,
                medium: statsData.mediumSolved,
                hard: statsData.hardSolved,
            },
            topics: allTopics,
            contest: {
                rating: contestData.contestRating || 0,
                globalRanking: contestData.contestGlobalRanking || 0,
                totalParticipants: contestData.totalParticipants || 0,
                participated: contestData.contestAttend > 0,
            },
            activity: {
                activeDaysLast90,
                currentStreakDays: calendarData.streak || 0,
            },
        };

        // Calculate and return score
        return calculateUserScore(scoreInput);
    } catch (error) {
        console.error('Error calculating user score:', error);

        // Return default score on error
        return {
            totalScore: 0,
            breakdown: {
                problemSolving: 0,
                topicCoverage: 0,
                contestPerformance: 0,
                consistency: 0,
                advancedTopics: 0,
            },
            rank: 'Beginner',
        };
    }
}

/**
 * Calculate number of active days in the last 90 days from submission calendar
 */
function calculateActiveDaysLast90(submissionCalendar: string): number {
    try {
        const calendar = JSON.parse(submissionCalendar);
        const now = Math.floor(Date.now() / 1000); // Current time in seconds
        const ninetyDaysAgo = now - (90 * 24 * 60 * 60);

        let activeDays = 0;

        for (const [timestamp, count] of Object.entries(calendar)) {
            const ts = parseInt(timestamp);
            if (ts >= ninetyDaysAgo && ts <= now && (count as number) > 0) {
                activeDays++;
            }
        }

        return activeDays;
    } catch (error) {
        console.error('Error parsing submission calendar:', error);
        return 0;
    }
}
