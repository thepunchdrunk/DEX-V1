import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useDailyContent } from '../hooks/useDailyContent';
import { UserProfile } from '../types';

// Mock the GenAiService
vi.mock('../services/genAiService', () => ({
    GenAiService: {
        generateBriefing: vi.fn(() =>
            Promise.resolve({
                cards: [
                    { id: 'c1', title: 'Card 1', slot: 'CONTEXT_ANCHOR' },
                    { id: 'c2', title: 'Card 2', slot: 'DOMAIN_EDGE' },
                    { id: 'c3', title: 'Card 3', slot: 'MICRO_SKILL' },
                ],
                greeting: { title: 'Hello', subtitle: 'Your briefing' },
                generated: false,
            })
        ),
    },
    API_KEY_STORAGE: 'dex_gemini_api_key',
}));

const mockUser: UserProfile = {
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

describe('useDailyContent', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should start in loading state', () => {
        const { result } = renderHook(() => useDailyContent(mockUser));

        expect(result.current.loading).toBe(true);
        expect(result.current.content).toBeNull();
    });

    it('should return content after loading', async () => {
        const { result } = renderHook(() => useDailyContent(mockUser));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.content).toBeDefined();
        expect(result.current.content?.cards).toHaveLength(3);
    });

    it('should re-fetch when refresh is called', async () => {
        const { GenAiService } = await import('../services/genAiService');
        const { result } = renderHook(() => useDailyContent(mockUser));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        // First call from mount
        expect(GenAiService.generateBriefing).toHaveBeenCalledTimes(1);

        // Trigger refresh
        act(() => {
            result.current.refresh();
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        // Should have been called again
        expect(GenAiService.generateBriefing).toHaveBeenCalledTimes(2);
    });
});
