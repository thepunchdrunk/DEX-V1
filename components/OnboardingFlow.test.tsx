import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import OnboardingFlow from './OnboardingFlow';

describe('OnboardingFlow Integration', () => {
    it('renders Day 1 initially', () => {
        render(<OnboardingFlow onComplete={vi.fn()} />);
        expect(screen.getByText('Zero-Touch Admin')).toBeInTheDocument();
        expect(screen.getByText('Confirm Profile')).toBeInTheDocument();
    });

    it('advances to Day 2 when confirmed', async () => {
        vi.useFakeTimers();
        render(<OnboardingFlow onComplete={vi.fn()} />);

        const button = screen.getByText('Confirm Profile');
        fireEvent.click(button);

        // Advance timer for loading state (800ms in component)
        act(() => {
            vi.advanceTimersByTime(800);
        });

        // Check if Day 2 content is visible
        expect(screen.getByText('Cultural OS')).toBeInTheDocument();

        vi.useRealTimers();
    });

    it('completes the flow after Day 5', async () => {
        vi.useFakeTimers();
        const onCompleteMock = vi.fn();
        render(<OnboardingFlow onComplete={onCompleteMock} />);

        // Helper to advance day
        const advance = () => {
            // Find the primary button (it changes text)
            const buttons = screen.getAllByRole('button');
            const primaryButton = buttons[buttons.length - 1]; // Usually the last one is the action
            fireEvent.click(primaryButton);
            act(() => {
                vi.advanceTimersByTime(1000);
            });
        };

        // Day 1 -> 2
        advance();
        // Day 2 -> 3
        advance();
        // Day 3 -> 4
        advance();
        // Day 4 -> 5
        advance();

        // Day 5 -> Complete
        expect(screen.getByText('Onboarding Complete')).toBeInTheDocument();
        const enterButton = screen.getByText('Enter Role Cockpit');
        fireEvent.click(enterButton);

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(onCompleteMock).toHaveBeenCalled();

        vi.useRealTimers();
    });
});
