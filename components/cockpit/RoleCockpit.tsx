import React, { useState } from 'react';
import {
    Sparkles,
    TreePine,
    Users,
    Settings,
    Search,
    Bell,
    Wifi,
    WifiOff,
    AlertTriangle,
    RefreshCw,
    BarChart3,
    Compass,
    TrendingUp,
} from 'lucide-react';
import { UserProfile, DailyCard, MarketGapCard, SkillBranch } from '../../types';
import { THEME_COLORS, MOCK_DAILY_CARDS, MOCK_MARKET_GAP, MOCK_SKILL_TREE } from '../../constants';
import Daily3Feed from './Daily3Feed';
import SkillTree from '../tree/SkillTree';
import MagicSearch from '../search/MagicSearch';
import ManagerHub from './manager/ManagerHub';
import AnalyticsDashboard from '../analytics/AnalyticsDashboard';
import InsightsHub from './InsightsHub';

type CockpitView = 'DAILY' | 'SKILLS' | 'INSIGHTS' | 'ANALYTICS' | 'MANAGER' | 'SETTINGS';

interface RoleCockpitProps {
    user: UserProfile;
    isWednesday?: boolean;
    onUpdateUser: (updates: Partial<UserProfile>) => void;
}

const RoleCockpit: React.FC<RoleCockpitProps> = ({ user, isWednesday = false, onUpdateUser }) => {
    const [activeView, setActiveView] = useState<CockpitView>('DAILY');
    const [isOnline, setIsOnline] = useState(true);
    const [showSearch, setShowSearch] = useState(false);
    const [cards, setCards] = useState<DailyCard[]>(MOCK_DAILY_CARDS);

    const navItems: { view: CockpitView; icon: React.ReactNode; label: string }[] = [
        { view: 'DAILY', icon: <Sparkles className="w-5 h-5" />, label: 'Daily 3' },
        { view: 'SKILLS', icon: <TreePine className="w-5 h-5" />, label: 'Skills' },
        { view: 'INSIGHTS', icon: <Compass className="w-5 h-5" />, label: 'Insights' },
        { view: 'ANALYTICS', icon: <TrendingUp className="w-5 h-5" />, label: 'Impact' },
        { view: 'SETTINGS', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
    ];

    const handleCardAction = (card: DailyCard) => {
        console.log('Card action:', card);
        if (card.actionUrl) {
            window.open(card.actionUrl, '_blank');
        }
    };

    const handleCardFlag = (cardId: string) => {
        setCards((prev) =>
            prev.map((c) =>
                c.id === cardId
                    ? { ...c, flagged: true, flagCount: (c.flagCount || 0) + 1 }
                    : c
            )
        );
    };

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ background: THEME_COLORS.performance.background }}
        >
            {/* Top Header */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/70 border-b border-slate-800">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-bold tracking-wider text-slate-300">
                            LIVING OS
                        </span>
                        <span className="text-xs text-amber-400 font-mono">PERFORMANCE</span>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        {/* Search Toggle */}
                        <button
                            onClick={() => setShowSearch(!showSearch)}
                            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
                            aria-label="Toggle Search"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        {/* Market Gap Alert */}
                        {MOCK_MARKET_GAP && (
                            <button className="p-2 rounded-lg hover:bg-slate-800 text-amber-400 relative">
                                <AlertTriangle className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400" />
                            </button>
                        )}

                        {/* Notifications */}
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors relative" aria-label="Notifications">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
                        </button>

                        <button
                            onClick={() => {
                                if (confirm('Reset entire demo? This will clear all progress.')) {
                                    localStorage.clear();
                                    window.location.reload();
                                }
                            }}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Reset Demo"
                            aria-label="Reset Demo"
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>

                        <div className="w-px h-8 bg-slate-700 mx-2"></div>
                        <button
                            onClick={() => setIsOnline(!isOnline)}
                            className={`p-2 rounded-lg hover:bg-slate-800 transition-all ${isOnline ? 'text-green-400' : 'text-red-400'
                                }`}
                        >
                            {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
                        </button>

                        {/* User Avatar */}
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                            {user.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                        </div>
                    </div>
                </div>

                {/* Magic Search (Expandable) */}
                {showSearch && (
                    <div className="border-t border-slate-800 p-4 animate-slide-down">
                        <MagicSearch onClose={() => setShowSearch(false)} />
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    {/* Daily View */}
                    {activeView === 'DAILY' && (
                        <Daily3Feed
                            cards={cards}
                            isWednesday={isWednesday}
                            onCardAction={handleCardAction}
                            onCardFlag={handleCardFlag}
                            user={{ jobTitle: user.jobTitle, department: user.department }}
                        />
                    )}

                    {/* Skills View */}
                    {activeView === 'SKILLS' && (
                        <SkillTree branches={MOCK_SKILL_TREE} />
                    )}

                    {/* Insights View */}
                    {activeView === 'INSIGHTS' && (
                        <InsightsHub />
                    )}

                    {/* Analytics View */}
                    {activeView === 'ANALYTICS' && (
                        <AnalyticsDashboard />
                    )}

                    {/* Manager View */}
                    {activeView === 'MANAGER' && (
                        <ManagerHub showSafeMode={true} />
                    )}

                    {/* Settings View */}
                    {activeView === 'SETTINGS' && (
                        <div className="space-y-6">
                            <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

                            {/* Safe Mode Toggle */}
                            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-white">Safe Mode</p>
                                        <p className="text-sm text-slate-400">
                                            Hide learning activity and simulator failures from Manager Dashboard
                                        </p>
                                    </div>
                                    <button
                                        className={`
                      w-12 h-6 rounded-full transition-all relative
                      ${user.safeMode ? 'bg-green-500' : 'bg-slate-700'}
                    `}
                                    >
                                        <div
                                            className={`
                        absolute top-1 w-4 h-4 rounded-full bg-white transition-all
                        ${user.safeMode ? 'left-7' : 'left-1'}
                      `}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Reset Onboarding (Demo) */}
                            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-white">Reset Onboarding</p>
                                        <p className="text-sm text-slate-400">
                                            Restart the onboarding sprint (demo only)
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem('livingos_state');
                                            window.location.reload();
                                        }}
                                        className="px-4 py-2 bg-red-500/20 text-red-400 text-sm font-medium rounded-lg hover:bg-red-500/30 transition-all"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>

                            {/* Demo Settings: Role Switcher */}
                            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <p className="font-medium text-white">Demo Mode: Manager View</p>
                                        <p className="text-sm text-slate-400">
                                            Enable experimental manager features
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => onUpdateUser({ role: user.role === 'MANAGER' ? 'EMPLOYEE' : 'MANAGER' })}
                                        className={`
                      w-12 h-6 rounded-full transition-all relative
                      ${user.role === 'MANAGER' ? 'bg-amber-500' : 'bg-slate-700'}
                    `}
                                    >
                                        <div
                                            className={`
                        absolute top-1 w-4 h-4 rounded-full bg-white transition-all
                        ${user.role === 'MANAGER' ? 'left-7' : 'left-1'}
                      `}
                                        />
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500 p-2 bg-slate-900/50 rounded-lg">
                                    Current Role: <span className="font-mono text-amber-500">{user.role}</span>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Bottom Navigation Dock */}
            <nav className="sticky bottom-0 backdrop-blur-md bg-slate-900/70 border-t border-slate-800">
                <div className="max-w-md mx-auto px-4 py-2 flex justify-around">
                    {navItems.map((item) => (
                        <button
                            key={item.view}
                            onClick={() => setActiveView(item.view)}
                            className={`
                flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all
                ${activeView === item.view
                                    ? 'text-amber-400 bg-amber-500/10'
                                    : 'text-slate-400 hover:text-white'
                                }
              `}
                        >
                            {item.icon}
                            <span className="text-xs">{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>
        </div>
    );
};

export default RoleCockpit;
