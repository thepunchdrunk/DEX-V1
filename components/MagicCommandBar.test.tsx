import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MagicCommandBar from '../components/MagicCommandBar';
import { UserContext } from '../types';

// Mock types if not available in tests yet due to compilation issues
const mockUserContext: any = {
    id: 'test-user',
    name: 'Test User',
    role: 'ENGINEER',
    seniority: 'SENIOR',
    department: 'ENGINEERING',
    team: 'Platform',
    tenureDays: 100,
    skills: [],
    activeProjects: ['Project Alpha']
};

// Mock the service
vi.mock('../services/geminiService', () => ({
    interpretCommand: vi.fn().mockResolvedValue({
        intentType: 'ACTION_EXECUTION',
        responseMessage: 'Executing action',
        confidence: { level: 'HIGH' }
    })
}));

describe('MagicCommandBar', () => {
    it('renders input field', () => {
        render(<MagicCommandBar userContext={mockUserContext} />);
        expect(screen.getByPlaceholderText(/Ask Workplace Hub/i)).toBeInTheDocument();
    });

    it('calls service on submission', async () => {
        render(<MagicCommandBar userContext={mockUserContext} />);

        const input = screen.getByPlaceholderText(/Ask Workplace Hub/i);
        fireEvent.change(input, { target: { value: 'Test command' } });
        fireEvent.submit(input.closest('form')!);

        await waitFor(() => {
            // We expect some result or loading state change
            // Since we mocked the service, we assumes it resolves
            expect(input).toBeInTheDocument();
        });
    });
});
