// ============================================================================
// WORKPLACE HUB — CARD SELECTION ENGINE
// Daily Dashboard | Nightly Pipeline Logic
// ============================================================================

import {
    DailyCard,
    CardSlot,
    CardPriority,
    UserProfile,
    ContextAnchorCard,
    DomainEdgeCard,
    MicroSkillCard,
} from '../types';

// ----------------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------------

export interface CardCandidate {
    card: DailyCard;
    urgencyScore: number;
    roleRelevanceScore: number;
    impactScore: number;
    noveltyScore: number;
    cognitiveLoadScore: number;
    confidenceScore: number;
    finalScore: number;
}

export interface UserContext {
    user: UserProfile;
    recentlySeenCardIds: string[];
    dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
    currentWorkload: 'LOW' | 'MEDIUM' | 'HIGH';
    recentKPIAlerts: number;
    pendingDeadlines: number;
}

export type WeekdayContext =
    | 'MONDAY_PLANNING'
    | 'MIDWEEK'
    | 'WEDNESDAY_SIMULATOR'
    | 'FRIDAY_REFLECTION';

// ----------------------------------------------------------------------------
// CONSTANTS
// ----------------------------------------------------------------------------

const WEIGHTS = {
    urgency: 0.25,
    roleRelevance: 0.30,
    impact: 0.20,
    novelty: 0.10,
    cognitiveLoad: 0.15,
};

const CONFIDENCE_THRESHOLD = 0.6;
const MAX_CARDS_PER_SLOT = 1;

// ----------------------------------------------------------------------------
// HELPERS
// ----------------------------------------------------------------------------

/**
 * Get the weekday context for card selection
 */
export function getWeekdayContext(dayOfWeek: number): WeekdayContext {
    switch (dayOfWeek) {
        case 1: // Monday
            return 'MONDAY_PLANNING';
        case 3: // Wednesday
            return 'WEDNESDAY_SIMULATOR';
        case 5: // Friday
            return 'FRIDAY_REFLECTION';
        default:
            return 'MIDWEEK';
    }
}

/**
 * Calculate urgency score based on card priority and timing
 */
function calculateUrgencyScore(card: DailyCard, context: UserContext): number {
    const priorityMap: Record<CardPriority, number> = {
        CRITICAL: 1.0,
        HIGH: 0.8,
        MEDIUM: 0.5,
        LOW: 0.2,
    };

    let score = priorityMap[card.priority];

    // Boost for Context Anchor on Monday (planning day)
    if (card.slot === 'CONTEXT_ANCHOR' && context.dayOfWeek === 1) {
        score = Math.min(1.0, score + 0.2);
    }

    // Boost for Micro-Skill on Friday (reflection day)
    if (card.slot === 'MICRO_SKILL' && context.dayOfWeek === 5) {
        score = Math.min(1.0, score + 0.15);
    }

    return score;
}

/**
 * Calculate role relevance based on job title and department matching
 */
function calculateRoleRelevanceScore(card: DailyCard, context: UserContext): number {
    const { user } = context;

    // Base relevance from sourceType
    let score = card.sourceType === 'INTERNAL' ? 0.7 : 0.5;

    // Boost for role category alignment
    if (card.slot === 'CONTEXT_ANCHOR') {
        // Internal cards highly relevant to role
        score = 0.9;
    }

    if (card.slot === 'DOMAIN_EDGE') {
        // External cards vary by relevance
        score = 0.7;
    }

    if (card.slot === 'MICRO_SKILL') {
        // Behavioral tips always relevant
        score = 0.85;
    }

    return score;
}

/**
 * Calculate impact score - would ignoring this hurt effectiveness?
 */
function calculateImpactScore(card: DailyCard, context: UserContext): number {
    // Critical priority always high impact
    if (card.priority === 'CRITICAL') return 1.0;
    if (card.priority === 'HIGH') return 0.8;

    // Context Anchors about KPIs have high impact
    if (card.slot === 'CONTEXT_ANCHOR') {
        return context.recentKPIAlerts > 0 ? 0.9 : 0.6;
    }

    // Domain Edge cards - career relevance
    if (card.slot === 'DOMAIN_EDGE') {
        return 0.5;
    }

    // Micro-skills - growth impact
    if (card.slot === 'MICRO_SKILL') {
        return 0.7;
    }

    return 0.5;
}

/**
 * Calculate novelty suppression - penalize recently seen content
 */
function calculateNoveltyScore(card: DailyCard, context: UserContext): number {
    // If card was recently shown, reduce novelty
    if (context.recentlySeenCardIds.includes(card.id)) {
        return 0.1;
    }
    return 1.0;
}

/**
 * Calculate cognitive load - respect user's current bandwidth
 */
function calculateCognitiveLoadScore(card: DailyCard, context: UserContext): number {
    const { currentWorkload } = context;

    // Under high workload, prefer simpler cards
    if (currentWorkload === 'HIGH') {
        // Micro-skills are quick, prefer them
        if (card.slot === 'MICRO_SKILL') return 0.9;
        // Domain Edge requires more thinking
        if (card.slot === 'DOMAIN_EDGE') return 0.5;
        return 0.7;
    }

    if (currentWorkload === 'LOW') {
        // More bandwidth for strategic content
        if (card.slot === 'DOMAIN_EDGE') return 0.9;
        return 0.8;
    }

    // Medium workload - balanced
    return 0.75;
}

/**
 * Calculate overall confidence that this card should be shown
 */
function calculateConfidenceScore(candidate: Omit<CardCandidate, 'confidenceScore' | 'finalScore'>): number {
    // Confidence based on data quality and relevance signals
    const baseConfidence = 0.7;

    // Boost confidence if high role relevance
    if (candidate.roleRelevanceScore > 0.8) {
        return Math.min(1.0, baseConfidence + 0.2);
    }

    // Lower confidence for low novelty
    if (candidate.noveltyScore < 0.5) {
        return Math.max(0.3, baseConfidence - 0.2);
    }

    return baseConfidence;
}

/**
 * Calculate final weighted score for a card
 */
function calculateFinalScore(candidate: Omit<CardCandidate, 'finalScore'>): number {
    return (
        candidate.urgencyScore * WEIGHTS.urgency +
        candidate.roleRelevanceScore * WEIGHTS.roleRelevance +
        candidate.impactScore * WEIGHTS.impact +
        candidate.noveltyScore * WEIGHTS.novelty +
        candidate.cognitiveLoadScore * WEIGHTS.cognitiveLoad
    ) * candidate.confidenceScore;
}

// ----------------------------------------------------------------------------
// MAIN SELECTION FUNCTION
// ----------------------------------------------------------------------------

/**
 * Select the Daily 3 cards using the nightly pipeline:
 * Urgency → Role Relevance → Impact → Novelty Suppression → Cognitive Load → Confidence Threshold
 */
export function selectDailyCards(
    context: UserContext,
    availableCards: DailyCard[]
): DailyCard[] {
    const weekdayContext = getWeekdayContext(context.dayOfWeek);

    // Score all cards
    const scoredCandidates: CardCandidate[] = availableCards.map((card) => {
        const urgencyScore = calculateUrgencyScore(card, context);
        const roleRelevanceScore = calculateRoleRelevanceScore(card, context);
        const impactScore = calculateImpactScore(card, context);
        const noveltyScore = calculateNoveltyScore(card, context);
        const cognitiveLoadScore = calculateCognitiveLoadScore(card, context);

        const partialCandidate = {
            card,
            urgencyScore,
            roleRelevanceScore,
            impactScore,
            noveltyScore,
            cognitiveLoadScore,
        };

        const confidenceScore = calculateConfidenceScore(partialCandidate);
        const candidateWithConfidence = { ...partialCandidate, confidenceScore };
        const finalScore = calculateFinalScore(candidateWithConfidence);

        return {
            ...candidateWithConfidence,
            finalScore,
        };
    });

    // Filter by confidence threshold
    const confidentCandidates = scoredCandidates.filter(
        (c) => c.confidenceScore >= CONFIDENCE_THRESHOLD
    );

    // Group by slot
    const bySlot: Record<CardSlot, CardCandidate[]> = {
        CONTEXT_ANCHOR: [],
        DOMAIN_EDGE: [],
        MICRO_SKILL: [],
        SIMULATOR: [],
    };

    confidentCandidates.forEach((candidate) => {
        bySlot[candidate.card.slot].push(candidate);
    });

    // Sort each slot by final score and pick top
    const selectedCards: DailyCard[] = [];

    // Always select one Context Anchor
    const contextAnchors = bySlot.CONTEXT_ANCHOR.sort((a, b) => b.finalScore - a.finalScore);
    if (contextAnchors.length > 0) {
        selectedCards.push(contextAnchors[0].card);
    }

    // Always select one Domain Edge
    const domainEdges = bySlot.DOMAIN_EDGE.sort((a, b) => b.finalScore - a.finalScore);
    if (domainEdges.length > 0) {
        selectedCards.push(domainEdges[0].card);
    }

    // On Wednesday, select Simulator instead of Micro-Skill
    if (weekdayContext === 'WEDNESDAY_SIMULATOR') {
        const simulators = bySlot.SIMULATOR.sort((a, b) => b.finalScore - a.finalScore);
        if (simulators.length > 0) {
            selectedCards.push(simulators[0].card);
        }
    } else {
        const microSkills = bySlot.MICRO_SKILL.sort((a, b) => b.finalScore - a.finalScore);
        if (microSkills.length > 0) {
            selectedCards.push(microSkills[0].card);
        }
    }

    return selectedCards;
}

/**
 * Generate card explainer text for "Why this appeared"
 */
export function generateCardExplainer(card: DailyCard, context: UserContext): string {
    const weekdayContext = getWeekdayContext(context.dayOfWeek);

    switch (card.slot) {
        case 'CONTEXT_ANCHOR':
            if (weekdayContext === 'MONDAY_PLANNING') {
                return `This strategic insight was selected to help you plan your week effectively. Source: ${card.source}.`;
            }
            return `This internal update is relevant to your role as ${context.user.jobTitle}. Source: ${card.source}.`;

        case 'DOMAIN_EDGE':
            return `This external signal may impact your ${context.user.department} responsibilities. Curated from: ${card.source}.`;

        case 'MICRO_SKILL':
            if (weekdayContext === 'FRIDAY_REFLECTION') {
                return `This reflection tip helps reinforce your growth patterns this week. Based on: ${card.source}.`;
            }
            return `This behavioral tip can improve your daily effectiveness. Identified from: ${card.source}.`;

        case 'SIMULATOR':
            return `Wednesday is Simulator Day! This challenge helps build applied judgment in realistic scenarios.`;

        default:
            return `Selected based on relevance to your role and current context.`;
    }
}
