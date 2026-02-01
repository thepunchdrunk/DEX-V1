import { DailyCard, UserProfile } from '../types';
import { MOCK_DAILY_CARDS } from '../constants';

// Storage key for API Key
export const API_KEY_STORAGE = 'dex_gemini_api_key';

interface GenerationResponse {
    cards: DailyCard[];
    greeting: {
        title: string;
        subtitle: string;
    };
    generated: boolean;
}

/**
 * Service to handle Generative AI content creation
 */
export const GenAiService = {
    /**
     * Generate the Daily 3 Briefing
     */
    generateBriefing: async (user: UserProfile): Promise<GenerationResponse> => {
        const apiKey = localStorage.getItem(API_KEY_STORAGE);

        // Simulate network delay for "Thinking" state
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (!apiKey) {
            console.log('No API Key found. Using Deterministic Fallback.');
            return getFallbackContent(user);
        }

        try {
            // TODO: Real API Call Here
            // For now, we simulate a successful "AI" generation using the mock data
            // but we could swap this for a real fetch to Gemini.
            console.log('API Key present. Simulating AI generation...');
            return getFallbackContent(user, true);
        } catch (error) {
            console.error('AI Generation failed:', error);
            return getFallbackContent(user);
        }
    }
};

/**
 * Fallback to our internal Expert System (Rule-Based)
 */
function getFallbackContent(user: UserProfile, isSimulation = false): GenerationResponse {
    // 1. Filter cards based on Role
    let roleCards = MOCK_DAILY_CARDS.filter(c => {
        // Filter by Category (Broad)
        if (c.roleCategories && user.roleCategory && !c.roleCategories.includes(user.roleCategory)) return false;
        // Filter by Specific Role (Narrow)
        if (c.targetRoles && (!user.jobTitle || !c.targetRoles.includes(user.jobTitle))) return false;
        return true;
    }).slice(0, 3);

    // If we have fewer than 3, fill with generic cards
    if (roleCards.length < 3) {
        const genericCards = MOCK_DAILY_CARDS.filter(c => !c.targetRoles && (!c.roleCategories || c.roleCategories.includes('DESK')));
        // Avoid duplicates
        const existingIds = roleCards.map(c => c.id);
        const fillers = genericCards.filter(c => !existingIds.includes(c.id));
        roleCards = [...roleCards, ...fillers].slice(0, 3);
    }

    // 2. Generate Greeting
    const greeting = {
        title: isSimulation ? `Good Morning, ${user.name.split(' ')[0]}` : `Welcome back, ${user.name.split(' ')[0]}`,
        subtitle: isSimulation
            ? `I've curated these priorities for your ${user.jobTitle} role.`
            : 'Here is your daily briefing.'
    };

    return {
        cards: roleCards,
        greeting,
        generated: isSimulation // True if "Simulating AI", False if pure fallback
    };
}
