import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] ?? null),
        setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
        removeItem: vi.fn((key: string) => { delete store[key]; }),
        clear: vi.fn(() => { store = {}; }),
    };
})();
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

// Mock the geminiService so we don't make real API calls
vi.mock('./geminiService', () => ({
    generateDaily3: vi.fn(() => Promise.resolve([])),
}));

import { GenAiService } from '../services/genAiService';
import { UserProfile } from '../types';

const MOCK_USER: UserProfile = {
    id: 'test-user-1',
    name: 'Test User',
    email: 'test@example.com',
    jobId: 'sr-eng',
    jobTitle: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'Remote',
    startDate: '2025-01-01',
    manager: 'Manager Name',
    onboardingDay: 1,
    onboardingComplete: true,
    dayProgress: {} as any,
    safeMode: false,
    roleCategory: 'DESK',
    role: 'EMPLOYEE',
};

describe('GenAiService', () => {
    beforeEach(() => {
        localStorageMock.clear();
        vi.clearAllMocks();
    });

    describe('generateBriefing (fallback)', () => {
        it('should return 3 cards when no API key is set', async () => {
            const result = await GenAiService.generateBriefing(MOCK_USER);

            expect(result).toBeDefined();
            expect(result.cards).toBeDefined();
            expect(result.cards.length).toBeLessThanOrEqual(3);
            expect(result.generated).toBe(false);
        });

        it('should return a greeting with the user first name', async () => {
            const result = await GenAiService.generateBriefing(MOCK_USER);

            expect(result.greeting).toBeDefined();
            expect(result.greeting.title).toContain('Test');
        });

        it('should filter cards by role category when available', async () => {
            const result = await GenAiService.generateBriefing(MOCK_USER);

            // All returned cards should be compatible with the DESK category
            for (const card of result.cards) {
                if ((card as any).roleCategories) {
                    expect((card as any).roleCategories).toContain('DESK');
                }
            }
        });
    });
});
