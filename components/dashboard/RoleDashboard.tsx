import React, { useState, useMemo } from 'react';
import { UserProfile, DailyCard } from '../../types';
import { MOCK_SKILL_TREE } from '../../constants';
import Daily3Feed from './Daily3Feed';
import SkillTree from '../tree/SkillTree';
import ToolsView from './ToolsView';
import InsightsHub from './InsightsHub';
import AppShell from '../layout/AppShell';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useDailyContent } from '../../hooks/useDailyContent';
import { useRoleExperience } from '../../hooks/useRoleExperience';
import { useToast } from '../ui/Toast';
import { confirmAndReset, logout } from '../../utils/resetDemo';

type DashboardView = 'DAILY' | 'SKILLS' | 'TOOLS' | 'INSIGHTS' | 'SETTINGS';

interface RoleDashboardProps {
    user: UserProfile;
    isWednesday?: boolean;
    onUpdateUser: (updates: Partial<UserProfile>) => void;
}

const RoleDashboard: React.FC<RoleDashboardProps> = ({ user, isWednesday = false, onUpdateUser }) => {
    const [activeView, setActiveView] = useState<DashboardView>('DAILY');
    const [isOnline, setIsOnline] = useState(true);
    const { showToast } = useToast();
    const { content, loading, error, refresh } = useDailyContent(user);
    const experience = useRoleExperience(user);

    // Filter logic is now inside GenAiService (Fallback) or API

    const handleCardAction = (card: DailyCard) => {
        if (import.meta.env.DEV) console.log('Card action:', card);
        if (card.actionUrl) {
            window.open(card.actionUrl, '_blank');
        }
    };

    const handleCardFlag = (cardId: string) => {
        if (import.meta.env.DEV) console.log('Flagged card:', cardId);
        showToast('Feedback submitted.', 'info');
        // AI Service will learn from this in future
    };

    const handleLogout = () => logout();

    // Header Actions (right side in AppShell) — memoized to avoid re-creation
    const HeaderActions = useMemo(() => (
        <div className="flex items-center gap-2">
            <button
                onClick={() => setIsOnline(prev => !prev)}
                className={`p-2 rounded-full hover:bg-white transition-all ${isOnline ? 'text-green-500' : 'text-red-500'}`}
                title={isOnline ? "System Online" : "System Offline"}
            >
                {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
            </button>
            <button
                onClick={() => confirmAndReset()}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Reset Demo"
            >
                <RefreshCw className="w-5 h-5" />
            </button>
        </div>
    ), [isOnline]);

    return (
        <AppShell
            user={user}
            activeView={activeView}
            onViewChange={setActiveView}
            onLogout={handleLogout}
            headerAction={HeaderActions}
        >
            {/* Daily View */}
            {activeView === 'DAILY' && (
                <div className="space-y-6">
                    {/* Welcome Banner */}
                    {/* Daily 3 Feed (Handles its own header/greeting) */}
                    <Daily3Feed
                        user={user}
                        cards={content?.cards}
                        greeting={content?.greeting}
                        loading={loading}
                        error={error}
                        isWednesday={isWednesday}
                        onCardAction={handleCardAction}
                        onCardFlag={handleCardFlag}
                        onRetry={refresh}
                    />
                </div>
            )}

            {/* Skills View */}
            {activeView === 'SKILLS' && (
                <SkillTree branches={experience?.skillTree || MOCK_SKILL_TREE} />
            )}

            {/* Tools View */}
            {activeView === 'TOOLS' && (
                <ToolsView user={user} />
            )}

            {/* Insights View */}
            {activeView === 'INSIGHTS' && (
                <InsightsHub roleExperience={experience || undefined} />
            )}

            {/* Settings View */}
            {activeView === 'SETTINGS' && (
                <div className="max-w-2xl mx-auto space-y-6">
                    <div className="bg-white rounded-2xl border border-[var(--border-light)] p-6 shadow-sm">
                        <h3 className="text-lg font-bold mb-4">Workspace Preferences</h3>

                        {/* Safe Mode Toggle */}
                        <div className="flex items-center justify-between py-4">
                            <div>
                                <p className="font-medium">Safe Mode</p>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    Hide learning failures from Manager Dashboard
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    onUpdateUser({ safeMode: !user.safeMode });
                                    showToast(
                                        user.safeMode ? 'Safe Mode disabled — learning data visible to manager' : 'Safe Mode enabled — learning data hidden',
                                        user.safeMode ? 'info' : 'success'
                                    );
                                }}
                                className={`
                                    w-12 h-6 rounded-full transition-all relative
                                    ${user.safeMode ? 'bg-green-500' : 'bg-gray-200'}
                                `}
                            >
                                <div className={`
                                    absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all
                                    ${user.safeMode ? 'left-7' : 'left-1'}
                                `} />
                            </button>
                        </div>
                        {/* Restart Onboarding */}
                        <div className="flex items-center justify-between py-4 border-t border-[var(--border-light)]">
                            <div>
                                <p className="font-medium text-[var(--text-primary)]">Restart Onboarding</p>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    Reset your progress and return to Day 1
                                </p>
                            </div>
                            <button
                                onClick={() => confirmAndReset()}
                                className="px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors flex items-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Restart
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </AppShell >
    );
};

export default RoleDashboard;
