import React, { useState } from 'react';
import { UserProfile, DailyCard } from '../../types';
import { MOCK_DAILY_CARDS, MOCK_SKILL_TREE } from '../../constants';
import Daily3Feed from './Daily3Feed';
import SkillTree from '../tree/SkillTree';
import ManagerHub from './manager/ManagerHub';
import AnalyticsDashboard from '../analytics/AnalyticsDashboard';
import InsightsHub from './InsightsHub';
import AppShell from '../layout/AppShell';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useDailyContent } from '../../hooks/useDailyContent';
import { useRoleExperience } from '../../hooks/useRoleExperience';
import { useToast } from '../ui/Toast';

type DashboardView = 'DAILY' | 'SKILLS' | 'INSIGHTS' | 'ANALYTICS' | 'MANAGER' | 'SETTINGS';

interface RoleDashboardProps {
    user: UserProfile;
    isWednesday?: boolean;
    onUpdateUser: (updates: Partial<UserProfile>) => void;
    onSwitchContext?: () => void;
}

const RoleDashboard: React.FC<RoleDashboardProps> = ({ user, isWednesday = false, onUpdateUser, onSwitchContext }) => {
    const [activeView, setActiveView] = useState<DashboardView>('DAILY');
    const [isOnline, setIsOnline] = useState(true);
    const { showToast } = useToast();
    const { content, loading, error, refresh } = useDailyContent(user);
    const experience = useRoleExperience(user);

    // Filter logic is now inside GenAiService (Fallback) or API

    const handleCardAction = (card: DailyCard) => {
        console.log('Card action:', card);
        if (card.actionUrl) {
            window.open(card.actionUrl, '_blank');
        }
    };

    const handleCardFlag = (cardId: string) => {
        console.log('Flagged card:', cardId);
        showToast('Feedback submitted.', 'info');
        // AI Service will learn from this in future
    };

    const handleLogout = () => {
        if (confirm('Are you sure you want to sign out?')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    // Header Actions (right side in AppShell)
    const HeaderActions = (
        <div className="flex items-center gap-2">
            <button
                onClick={() => setIsOnline(!isOnline)}
                className={`p-2 rounded-full hover:bg-white transition-all ${isOnline ? 'text-green-500' : 'text-red-500'}`}
                title={isOnline ? "System Online" : "System Offline"}
            >
                {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
            </button>
            <button
                onClick={() => {
                    if (confirm('Reset entire demo?')) {
                        localStorage.clear();
                        window.location.reload();
                    }
                }}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Reset Demo"
            >
                <RefreshCw className="w-5 h-5" />
            </button>
        </div>
    );

    return (
        <AppShell
            user={user}
            activeView={activeView}
            onViewChange={setActiveView}
            onLogout={handleLogout}
            onSwitchContext={onSwitchContext}
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
                        isWednesday={isWednesday}
                        onCardAction={handleCardAction}
                        onCardFlag={handleCardFlag}
                    />
                </div>
            )}

            {/* Skills View */}
            {activeView === 'SKILLS' && (
                <SkillTree branches={experience?.skillTree || MOCK_SKILL_TREE} />
            )}

            {/* Insights View */}
            {activeView === 'INSIGHTS' && (
                <InsightsHub roleExperience={experience || undefined} />
            )}

            {/* Analytics View */}
            {activeView === 'ANALYTICS' && (
                <AnalyticsDashboard data={experience?.impactData} />
            )}

            {/* Manager View */}
            {activeView === 'MANAGER' && (
                <ManagerHub showSafeMode={true} />
            )}

            {/* Settings View */}
            {activeView === 'SETTINGS' && (
                <div className="max-w-2xl mx-auto space-y-6">
                    <div className="bg-white rounded-2xl border border-[var(--border-light)] p-6 shadow-sm">
                        <h3 className="text-lg font-bold mb-4">Workspace Preferences</h3>

                        {/* Safe Mode Toggle */}
                        <div className="flex items-center justify-between py-4 border-b border-[var(--border-light)]">
                            <div>
                                <p className="font-medium">Safe Mode</p>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    Hide learning failures from Manager Dashboard
                                </p>
                            </div>
                            <button
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

                        {/* Role Switcher */}
                        <div className="flex items-center justify-between py-4">
                            <div>
                                <p className="font-medium">Manager View (Demo)</p>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    Enable experimental manager features
                                </p>
                            </div>
                            <button
                                onClick={() => onUpdateUser({ role: user.role === 'MANAGER' ? 'EMPLOYEE' : 'MANAGER' })}
                                className={`
                                    w-12 h-6 rounded-full transition-all relative
                                    ${user.role === 'MANAGER' ? 'bg-[var(--brand-red)]' : 'bg-gray-200'}
                                `}
                            >
                                <div className={`
                                    absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all
                                    ${user.role === 'MANAGER' ? 'left-7' : 'left-1'}
                                `} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppShell>
    );
};

export default RoleDashboard;
