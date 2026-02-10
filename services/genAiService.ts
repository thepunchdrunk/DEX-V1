import { DailyCard, UserProfile, CognitiveLoadState, UserContext } from '../types';
import { MOCK_DAILY_CARDS } from '../constants';
import { generateDaily3 } from './geminiService';

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
 * Build a UserContext from a UserProfile for the Gemini AI service
 */
function buildUserContext(user: UserProfile): UserContext {
    const cognitiveLoad = getDefaultCognitiveLoad();
    return {
        id: user.id,
        name: user.name,
        email: user.email || '',
        role: user.jobTitle || user.role || 'Employee',
        department: user.department || 'Engineering',
        team: user.department || 'Core Team',
        seniority: 'MID',
        location: user.location || '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        tenureDays: 30,
        currentFocus: '',
        activeProjects: [],
        recentActions: [],
        skills: [],
        cognitiveLoad,
        privacySettings: {
            shareDevelopmentData: !user.safeMode,
            shareSkillProgress: !user.safeMode,
            shareLearningHistory: !user.safeMode,
            visibleToManager: [],
            mandatoryCompliance: [],
        },
    };
}

/**
 * Default cognitive load state — assume a normal workday
 */
function getDefaultCognitiveLoad(): CognitiveLoadState {
    return {
        overallLoad: 'MEDIUM',
        meetingDensity: 40,
        focusTimeAvailable: 120,
        errorClusterCount: 0,
        afterHoursSpike: false,
        taskSwitchFrequency: 3,
        deferralRecommended: false,
        lastAssessed: new Date().toISOString(),
        deferredItemCount: 0,
    };
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
        const hasEnvKey = !!(
            (import.meta as any).env?.VITE_GEMINI_API_KEY ||
            (typeof process !== 'undefined' && (process as any).env?.GEMINI_API_KEY)
        );

        if (!apiKey && !hasEnvKey) {
            console.log('No API Key found. Using Deterministic Fallback.');
            return getFallbackContent(user);
        }

        try {
            console.log('API Key present. Calling Gemini AI...');
            const userContext = buildUserContext(user);
            const cognitiveLoad = getDefaultCognitiveLoad();
            const aiCards = await generateDaily3(userContext, cognitiveLoad);

            if (aiCards && aiCards.length > 0) {
                return {
                    cards: aiCards,
                    greeting: {
                        title: `Good Morning, ${user.name.split(' ')[0]}`,
                        subtitle: `I've curated these priorities for your ${user.jobTitle || 'role'}.`,
                    },
                    generated: true,
                };
            }

            // AI returned empty — fall back
            console.warn('AI returned no cards. Using fallback.');
            return getFallbackContent(user, true);
        } catch (error) {
            console.error('AI Generation failed, falling back:', error);
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
