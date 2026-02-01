import { useState, useEffect } from 'react';
import { DailyCard, UserProfile } from '../types';
import { GenAiService } from '../services/genAiService';

interface DailyContent {
    cards: DailyCard[];
    greeting: {
        title: string;
        subtitle: string;
    };
    generated: boolean;
}

export function useDailyContent(user: UserProfile) {
    const [content, setContent] = useState<DailyContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        async function fetchContent() {
            if (!user) return;

            // Optional: Check cache here to prevent re-generation on every nav
            // const cached = sessionStorage.getItem(`daily_content_${user.id}`);
            // if (cached) { ... }

            setLoading(true);
            try {
                const result = await GenAiService.generateBriefing(user);
                if (mounted) {
                    setContent(result);
                    setError(null);
                }
            } catch (err) {
                if (mounted) {
                    setError('Failed to generate daily briefing');
                    console.error(err);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        fetchContent();

        return () => {
            mounted = false;
        };
    }, [user.id, user.roleCategory, user.jobTitle]); // Re-run if user context changes

    const refresh = () => {
        setContent(null);
        setLoading(true);
    };

    return { content, loading, error, refresh };
}
