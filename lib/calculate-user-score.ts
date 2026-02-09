/**
 * LeetCode User Scoring Algorithm
 * Total: 1000 points across 5 components
 */

// ============== Type Definitions ==============

export interface UserScoreInput {
    problemsSolved: {
        easy: number;
        medium: number;
        hard: number;
    };
    topics: {
        topicName: string;
        problemsSolved: number;
        isAdvanced: boolean;
    }[];
    contest: {
        rating: number;
        globalRanking: number;
        totalParticipants: number;
        participated: boolean;
    };
    activity: {
        activeDaysLast90: number;
        currentStreakDays: number;
    };
}

export interface ScoreBreakdown {
    problemSolving: number;
    topicCoverage: number;
    contestPerformance: number;
    consistency: number;
    advancedTopics: number;
}

export interface UserScoreResult {
    totalScore: number;
    breakdown: ScoreBreakdown;
    rank: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master';
}

// ============== Constants ==============

const MAX_RAW_SOLVE_SCORE = 10000; // Maximum expected raw solve score
const MAX_CONTEST_RATING = 3500; // LeetCode top ratings
const MAX_TOTAL_PARTICIPANTS = 30000; // Average weekly contest size
const CONSISTENCY_WINDOW_DAYS = 90;
const NO_CONTEST_BASELINE = 0.3; // 30% of max contest score for non-participants

// Advanced topics list - should match your skill categorization
export const ADVANCED_TOPICS = [
    'Dynamic Programming',
    'Graph',
    'Trie',
    'Union Find',
    'Segment Tree',
    'Binary Indexed Tree',
    'Topological Sort',
    'Suffix Array',
    'Strongly Connected Component',
    'Bipartite Graph',
    'Minimum Spanning Tree',
    'Eulerian Circuit',
];

// ============== Helper Utilities ==============

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/**
 * Calculate standard deviation of an array of numbers
 */
export function standardDeviation(values: number[]): number {
    if (values.length === 0) return 0;

    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;

    return Math.sqrt(variance);
}

// ============== Scoring Components ==============

/**
 * 1. Problem Solving Score (0-400)
 * Difficulty-weighted with log normalization
 */
export function calculateProblemSolvingScore(
    easy: number,
    medium: number,
    hard: number
): number {
    const rawSolveScore = easy * 1 + medium * 3 + hard * 7;

    if (rawSolveScore === 0) return 0;

    // Log scaling to prevent extreme outliers
    const normalizedScore = (400 * Math.log(1 + rawSolveScore)) / Math.log(1 + MAX_RAW_SOLVE_SCORE);

    return Math.min(400, normalizedScore);
}

/**
 * 2. Topic Coverage Score (0-200)
 * Rewards breadth and balance across topics
 */
export function calculateTopicCoverageScore(
    topics: { topicName: string; problemsSolved: number }[]
): number {
    if (topics.length === 0) return 0;

    const totalTopics = topics.length;

    // Count topics with at least 5 problems solved
    const topicsWithAtLeast5 = topics.filter(t => t.problemsSolved >= 5).length;
    const coverageRatio = topicsWithAtLeast5 / totalTopics;

    // Calculate balance factor using standard deviation
    const problemCounts = topics.map(t => t.problemsSolved);
    const stdDev = standardDeviation(problemCounts);

    // Estimate max deviation (assume very imbalanced case)
    const maxDeviation = Math.max(...problemCounts) || 1;

    // Balance factor: penalize if user is too specialized
    const balanceFactor = clamp(1 - stdDev / maxDeviation, 0.6, 1);

    return 200 * coverageRatio * balanceFactor;
}

/**
 * 3. Contest Performance Score (0-200)
 * Based on rating and percentile rank
 */
export function calculateContestPerformanceScore(
    rating: number,
    globalRanking: number,
    totalParticipants: number,
    participated: boolean
): number {
    if (!participated) {
        // Non-participants get 30% of max score
        return NO_CONTEST_BASELINE * 200;
    }

    // Percentile rank (higher is better)
    const percentileRank = totalParticipants > 0
        ? (totalParticipants - globalRanking) / totalParticipants
        : 0;

    // Normalized rating (0-1)
    const normalizedRating = clamp(rating / MAX_CONTEST_RATING, 0, 1);

    // Weighted combination
    const contestScore = 0.6 * percentileRank + 0.4 * normalizedRating;

    return clamp(contestScore * 200, 0, 200);
}

/**
 * 4. Consistency & Activity Score (0-100)
 * Measures regular coding activity
 */
export function calculateConsistencyScore(
    activeDaysLast90: number,
    currentStreakDays: number
): number {
    // Active days component (max 60 points)
    const activeDaysScore = (activeDaysLast90 / CONSISTENCY_WINDOW_DAYS) * 60;

    // Streak component (max 40 points)
    const streakWeeks = currentStreakDays / 7;
    const streakScore = Math.min(streakWeeks * 5, 40);

    return Math.min(100, activeDaysScore + streakScore);
}

/**
 * 5. Advanced Topics Mastery Score (0-100)
 * Rewards depth in complex topics
 */
export function calculateAdvancedTopicsScore(
    topics: { topicName: string; problemsSolved: number; isAdvanced: boolean }[]
): number {
    // Filter for advanced topics
    const advancedTopics = topics.filter(t => t.isAdvanced);

    if (advancedTopics.length === 0) return 0;

    // Count advanced topics with at least 5 problems solved
    const qualifiedAdvancedTopics = advancedTopics.filter(t => t.problemsSolved >= 5).length;

    const totalAdvancedTopics = advancedTopics.length;
    const advancedRatio = qualifiedAdvancedTopics / totalAdvancedTopics;

    return advancedRatio * 100;
}

// ============== Main Scoring Function ==============

/**
 * Calculate comprehensive user score (0-1000)
 */
export function calculateUserScore(input: UserScoreInput): UserScoreResult {
    // Calculate each component
    const problemSolving = calculateProblemSolvingScore(
        input.problemsSolved.easy,
        input.problemsSolved.medium,
        input.problemsSolved.hard
    );

    const topicCoverage = calculateTopicCoverageScore(input.topics);

    const contestPerformance = calculateContestPerformanceScore(
        input.contest.rating,
        input.contest.globalRanking,
        input.contest.totalParticipants,
        input.contest.participated
    );

    const consistency = calculateConsistencyScore(
        input.activity.activeDaysLast90,
        input.activity.currentStreakDays
    );

    const advancedTopics = calculateAdvancedTopicsScore(input.topics);

    // Calculate total score
    const totalScore = clamp(
        problemSolving + topicCoverage + contestPerformance + consistency + advancedTopics,
        0,
        1000
    );

    // Determine rank based on score
    let rank: UserScoreResult['rank'];
    if (totalScore >= 851) rank = 'Master';
    else if (totalScore >= 701) rank = 'Expert';
    else if (totalScore >= 501) rank = 'Advanced';
    else if (totalScore >= 301) rank = 'Intermediate';
    else rank = 'Beginner';

    return {
        totalScore: Math.round(totalScore),
        breakdown: {
            problemSolving: Math.round(problemSolving),
            topicCoverage: Math.round(topicCoverage),
            contestPerformance: Math.round(contestPerformance),
            consistency: Math.round(consistency),
            advancedTopics: Math.round(advancedTopics),
        },
        rank,
    };
}
