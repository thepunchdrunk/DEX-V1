import React, { useState } from 'react';
import {
    ChevronRight,
    Lock,
    Unlock,
    Check,
    Sparkles,
    LayoutDashboard,
    RefreshCw,
} from 'lucide-react';
import { OnboardingDay, UserProfile } from '../../types';
import { THEME_COLORS } from '../../constants';

// Import Day Components (Legacy)
import GreenLightDashboard from './GreenLightDashboard';
import CulturalOS from './CompanyCulture';
import LearningFoundations from './LearningFoundations';
import NetworkMapper from './NetworkMapper';
import GraduationCeremony from './GraduationCeremony';

// Import Enhanced Day Components
import Day1LifeWorkSetup from './day1/Day1LifeWorkSetup';
import Day2Culture from './day2/Day2Culture';
import Day3ToolsWorkflow from './day3/Day3ToolsWorkflow';
import Day4NetworkCollaboration from './day4/Day4NetworkCollaboration';
import Day5Graduation from './day5/Day5Graduation';

interface OnboardingShellProps {
    user: UserProfile;
    onDayComplete: (day: OnboardingDay) => void;
    onGraduate: () => void;
}

const OnboardingShell: React.FC<OnboardingShellProps> = ({
    user,
    onDayComplete,
    onGraduate,
}) => {
    // All roles start at Day 1
    const initialDay = (user.onboardingDay > 0) ? user.onboardingDay : 1;
    const [currentDay, setCurrentDay] = useState<OnboardingDay>(initialDay as OnboardingDay);

    // Feature flag to toggle between legacy and enhanced components
    const useEnhancedComponents = true;

    const days: { day: OnboardingDay; title: string; description: string }[] = [
        { day: 1, title: 'Setup & Essentials', description: 'Everything to function comfortably' },
        { day: 2, title: 'Company Culture', description: 'Learn our unwritten rules' },
        { day: 3, title: 'Tools & Workflow', description: 'How you get work done' },
        { day: 4, title: 'Team Connections', description: 'Connect with your Critical 5' },
        { day: 5, title: 'Completion Day', description: 'Complete your journey' },
    ];

    const handleDayComplete = (day: OnboardingDay) => {
        onDayComplete(day);
        if (day < 5) {
            setCurrentDay((day + 1) as OnboardingDay);
        }
    };

    const getDayStatus = (day: OnboardingDay) => {
        if (user.dayProgress[day]?.completed) return 'completed';
        if (day === currentDay) return 'active';
        if (day < currentDay) return 'available';
        return 'locked';
    };

    const renderDayContent = () => {
        switch (currentDay) {
            case 1:
                return (
                    <Day1LifeWorkSetup
                        user={user}
                        onComplete={() => handleDayComplete(1)}
                    />
                );
            case 2:
                return (
                    <Day2Culture
                        roleCategory={user.roleCategory || 'DESK'}
                        onComplete={() => handleDayComplete(2)}
                    />
                );
            case 3:
                return (
                    <Day3ToolsWorkflow
                        user={user}
                        onComplete={() => handleDayComplete(3)}
                    />
                );
            case 4:
                return (
                    <Day4NetworkCollaboration
                        user={user}
                        onComplete={() => handleDayComplete(4)}
                    />
                );
            case 5:
                return (
                    <Day5Graduation
                        user={user}
                        onGraduate={onGraduate}
                    />
                );
            default:
                return <div className="text-[var(--text-secondary)] p-8">Select a day to continue</div>;
        }
    };

    return (
        <div className="min-h-screen flex bg-[var(--surface-base)] text-[var(--text-primary)] font-sans">
            {/* Sidebar: Day Navigation - Kinetic Glass */}
            <aside className="w-80 flex-shrink-0 border-r border-[var(--surface-glass-border)] bg-[var(--surface-glass)] backdrop-blur-xl p-6 hidden md:flex flex-col fixed h-full z-30">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[var(--brand-red)] to-red-600 flex items-center justify-center shadow-lg shadow-red-500/20">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">DEX</span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] font-medium pl-1">Onboarding Journey</p>
                </div>

                {/* Navigation List */}
                <nav className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {days.map((item) => {
                        const status = getDayStatus(item.day);
                        const isActive = status === 'active';
                        const isLocked = status === 'locked';

                        return (
                            <button
                                key={item.day}
                                onClick={() => !isLocked && setCurrentDay(item.day)}
                                disabled={isLocked}
                                className={`
                                    w-full p-4 rounded-xl text-left transition-all duration-300 border
                                    group relative overflow-hidden
                                    ${isActive
                                        ? 'bg-gradient-to-r from-[var(--brand-red)] to-red-600 border-transparent shadow-lg shadow-red-500/10'
                                        : 'bg-white/40 border-transparent hover:bg-white/60 hover:border-[var(--brand-red)]/20'
                                    }
                                    ${isLocked ? 'opacity-40 cursor-not-allowed grayscale' : ''}
                                `}
                            >
                                <div className="flex items-center justify-between mb-1.5 relative z-10">
                                    <span className={`text-sm font-bold ${isActive ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                                        Day {item.day}
                                    </span>
                                    {status === 'completed' && <Check className="h-4 w-4 text-[var(--status-success)]" />}
                                    {status === 'locked' && <Lock className="h-3 w-3 text-[var(--text-tertiary)]" />}
                                </div>
                                <div className={`text-xs font-medium ${isActive ? 'text-white/90' : 'text-[var(--text-secondary)]'} relative z-10`}>
                                    {item.title}
                                </div>
                                {isActive && (
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="mt-8 pt-6 border-t border-[var(--border-light)] space-y-4">
                    {/* Demo Controls */}
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => {
                                if (confirm('Reset demo state?')) {
                                    localStorage.clear();
                                    window.location.reload();
                                }
                            }}
                            className="flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:bg-red-50 hover:text-[var(--brand-red)] transition-colors border border-dashed border-[var(--border-light)]"
                        >
                            <RefreshCw className="w-3 h-3" /> Reset
                        </button>
                        <button
                            onClick={() => {
                                const updatedUser = { ...user };
                                [0, 1, 2, 3, 4, 5].forEach(day => {
                                    if (updatedUser.dayProgress[day]) updatedUser.dayProgress[day].completed = true;
                                });
                                onDayComplete(5);
                                alert('All days unlocked!');
                            }}
                            className="flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:bg-emerald-50 hover:text-emerald-600 transition-colors border border-dashed border-[var(--border-light)]"
                        >
                            <Unlock className="w-3 h-3" /> Unlock
                        </button>
                    </div>

                    {/* User Profile */}
                    <div className="flex items-center gap-3 bg-white/50 p-3 rounded-xl border border-[var(--border-light)]">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-gray-700 to-gray-900 flex items-center justify-center text-white text-sm font-bold shadow-md">
                            {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-[var(--text-primary)] truncate">{user.name}</div>
                            <div className="text-xs text-[var(--text-secondary)] truncate">{user.jobTitle}</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-80 overflow-y-auto relative min-h-screen">
                {/* Mobile Header */}
                <div className="md:hidden bg-[var(--surface-glass)] backdrop-blur-xl p-4 sticky top-0 z-20 border-b border-[var(--surface-glass-border)] flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-[var(--brand-red)] flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-black font-bold">Day {currentDay}</span>
                    </div>
                    <div className="text-xs font-medium text-[var(--text-secondary)] bg-white/50 px-2 py-1 rounded-full border border-[var(--border-light)]">
                        {Object.values(user.dayProgress).filter((d: any) => d.completed).length}/6
                    </div>
                </div>

                <div className="relative z-10 pb-20">
                    {renderDayContent()}
                </div>
            </main>
        </div>
    );
};

export default OnboardingShell;
