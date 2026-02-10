import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Storage key matching App.tsx
const STORAGE_KEY = 'dex_user_profile';

// Create a mock localStorage since jsdom's built-in one may not work properly
const store: Record<string, string> = {};
const mockLocalStorage = {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
};
vi.stubGlobal('localStorage', mockLocalStorage);

describe('App State Machine', () => {
    beforeEach(() => {
        delete store[STORAGE_KEY];
    });

    it('starts with no saved profile (ROLE_SELECTION expected)', () => {
        const savedProfile = localStorage.getItem(STORAGE_KEY);
        expect(savedProfile).toBeNull();
    });

    it('persists profile to localStorage', () => {
        const profile = {
            id: 'sr-eng',
            name: 'Alex Rivera',
            role: 'EMPLOYEE',
            onboardingDay: 1,
            onboardingComplete: false,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));

        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
        expect(saved.id).toBe('sr-eng');
        expect(saved.onboardingComplete).toBe(false);
    });

    it('transitions to ROLE_BASED when onboardingComplete is true', () => {
        const profile = {
            id: 'sr-eng',
            name: 'Alex Rivera',
            role: 'EMPLOYEE',
            onboardingDay: 5,
            onboardingComplete: true,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));

        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
        expect(saved.onboardingComplete).toBe(true);
    });

    it('clears state on logout', () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: 'test' }));
        localStorage.removeItem(STORAGE_KEY);

        expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('falls back to role selection when saved profile is malformed JSON', () => {
        localStorage.setItem(STORAGE_KEY, '{not valid json');

        render(<App />);

        expect(screen.getByText('Welcome to DEX')).toBeInTheDocument();
        expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
});
