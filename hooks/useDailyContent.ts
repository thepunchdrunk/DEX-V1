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
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        let mounted = true;

        async function fetchContent() {
            if (!user) return;

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
    }, [user.id, user.roleCategory, user.jobTitle, refreshKey]);

    const refresh = () => {
        setContent(null);
        setRefreshKey(k => k + 1);
    };

    return { content, loading, error, refresh };
}
