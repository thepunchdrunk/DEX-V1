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
import CulturalOS from './CulturalOS';
import LearningFoundations from './LearningFoundations';
import NetworkMapper from './NetworkMapper';
import GraduationCeremony from './GraduationCeremony';

// Import Enhanced Day Components
import PreboardingOrchestrator from './day0/PreboardingOrchestrator';
import Day1LifeWorkSetup from './day1/Day1LifeWorkSetup';
import Day2CulturalOS from './day2/Day2CulturalOS';
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
    // If user is employee and on day 0, start at day 1
    const initialDay = (user.role === 'EMPLOYEE' && user.onboardingDay === 0) ? 1 : user.onboardingDay;
    const [currentDay, setCurrentDay] = useState<OnboardingDay>(initialDay);

    // Feature flag to toggle between legacy and enhanced components
    const useEnhancedComponents = true;

    const days: { day: OnboardingDay; title: string; description: string }[] = [
        { day: 0, title: 'Preboarding', description: 'Get ready before Day 1' },
        { day: 1, title: 'Life & Work Setup', description: 'Everything to function comfortably' },
        { day: 2, title: 'Cultural OS', description: 'Learn our unwritten rules' },
        { day: 3, title: 'Tools & Workflow', description: 'How you get work done' },
        { day: 4, title: 'Network Mapper', description: 'Connect with your Critical 5' },
        { day: 5, title: 'Graduation Day', description: 'Complete your journey' },
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
            case 0:
                return (
                    <PreboardingOrchestrator
                        user={user}
                        onComplete={() => handleDayComplete(0)}
                    />
                );
            case 1:
                return useEnhancedComponents ? (
                    <Day1LifeWorkSetup
                        user={user}
                        onComplete={() => handleDayComplete(1)}
                    />
                ) : (
                    <GreenLightDashboard
                        user={user}
                        onComplete={() => handleDayComplete(1)}
                    />
                );
            case 2:
                return useEnhancedComponents ? (
                    <Day2CulturalOS
                        roleCategory={user.roleCategory || 'DESK'}
                        onComplete={() => handleDayComplete(2)}
                    />
                ) : (
                    <CulturalOS
                        onComplete={() => handleDayComplete(2)}
                    />
                );
            case 3:
                return useEnhancedComponents ? (
                    <Day3ToolsWorkflow
                        user={user}
                        onComplete={() => handleDayComplete(3)}
                    />
                ) : (
                    <LearningFoundations
                        user={user}
                        onComplete={() => handleDayComplete(3)}
                    />
                );
            case 4:
                return useEnhancedComponents ? (
                    <Day4NetworkCollaboration
                        user={user}
                        onComplete={() => handleDayComplete(4)}
                    />
                ) : (
                    <NetworkMapper
                        user={user}
                        onComplete={() => handleDayComplete(4)}
                    />
                );
            case 5:
                return useEnhancedComponents ? (
                    <Day5Graduation
                        user={user}
                        onGraduate={onGraduate}
                    />
                ) : (
                    <GraduationCeremony
                        user={user}
                        onGraduate={onGraduate}
                    />
                );
            default:
                return <div className="text-white p-8">Select a day to continue</div>;
        }
    };

    return (
        <div
            className="min-h-screen flex"
            style={{ background: THEME_COLORS.onboarding.background }}
        >
            {/* Sidebar: Day Navigation */}
            <aside className="w-72 border-r border-blue-900/30 bg-slate-900/50 backdrop-blur-md p-6 flex flex-col hidden md:flex">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-lg font-bold text-white">Living OS</span>
                    </div>
                    <p className="text-blue-300/70">Onboarding Sprint</p>
                </div>

                <div className="mb-6">
                    <button
                        onClick={() => {
                            if (confirm('Reset demo state? This will return to Role Selection.')) {
                                localStorage.clear();
                                window.location.reload();
                            }
                        }}
                        className="w-full py-2 px-3 bg-slate-800 hover:bg-red-900/20 text-slate-400 hover:text-red-400 text-xs rounded-lg transition-colors flex items-center justify-center gap-2 mb-2"
                    >
                        <RefreshCw className="w-3 h-3" /> Reset Demo
                    </button>
                    <button
                        onClick={() => {
                            // Demo Utility: Mark all days as complete
                            const updatedUser = { ...user };
                            [0, 1, 2, 3, 4, 5].forEach(day => {
                                if (updatedUser.dayProgress[day]) {
                                    updatedUser.dayProgress[day].completed = true;
                                }
                            });
                            // Force update by calling onDayComplete with the fully unlocked user
                            // We need to trigger the parent update logic.
                            // Since we don't have a direct "updateUser" prop, we'll simulate completing the current day
                            // but pass the fully modified object if the parent supports merging.
                            // A better approach if parent JUST replaces user:
                            onDayComplete(5); // Hack: Completing day 5 usually triggers graduation or full unlock
                            alert('Demo Mode: All days unlocked! (Refresh if needed)');
                        }}
                        className="w-full py-2 px-3 bg-slate-800 hover:bg-blue-900/20 text-slate-400 hover:text-blue-400 text-xs rounded-lg transition-colors flex items-center justify-center gap-2 mb-4"
                    >
                        <Unlock className="w-3 h-3" /> Unlock All (Demo)
                    </button>
                    <div className="flex justify-between text-xs text-slate-400 mb-2">
                        <span>Progress</span>
                        <span>
                            {Object.values(user.dayProgress).filter((d: any) => d.completed).length}/6
                        </span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                            style={{
                                width: `${(Object.values(user.dayProgress).filter((d: any) => d.completed).length /
                                    6) *
                                    100
                                    }% `,
                            }}
                        />
                    </div>
                </div>

                {/* Navigation List */}
                <nav className="space-y-2 flex-1">
                    {days
                        .filter(item => user.role === 'MANAGER' || item.day !== 0) // Hide Day 0 for employees
                        .map((item) => {
                            const status = getDayStatus(item.day);
                            const isActive = status === 'active';
                            const isLocked = status === 'locked';

                            return (
                                <button
                                    key={item.day}
                                    onClick={() => !isLocked && setCurrentDay(item.day)}
                                    disabled={isLocked}
                                    className={`
w-full p-3 rounded-xl text-left transition-all border
                                        ${isActive
                                            ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-900/20'
                                            : 'border-transparent hover:bg-white/5'
                                        }
                                        ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}
`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span
                                            className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-slate-300'}`}
                                        >
                                            Day {item.day}
                                        </span>
                                        {status === 'completed' && (
                                            <Check className="h-4 w-4 text-green-400" />
                                        )}
                                        {status === 'locked' && (
                                            <Lock className="h-3 w-3 text-slate-500" />
                                        )}
                                    </div>
                                    <div
                                        className={`text-xs ${isActive ? 'text-blue-100' : 'text-slate-500'}`}
                                    >
                                        {item.title}
                                    </div>
                                </button>
                            );
                        })}
                </nav>

                {/* User Profile Snippet */}
                <div className="mt-8 pt-6 border-t border-slate-800 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">
                            {user.name}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                            {user.jobTitle}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto relative">
                {/* Background Ambient Effects */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                </div>

                <div className="relative z-10 min-h-full">
                    {/* Mobile Header (similar to sidebar logic but for small screens) */}
                    <div className="md:hidden bg-slate-900/80 backdrop-blur-md p-4 sticky top-0 z-20 border-b border-slate-800 flex justify-between items-center">
                        <span className="text-white font-bold">Day {currentDay}</span>
                        <div className="text-xs text-slate-400">
                            {Object.values(user.dayProgress).filter((d: any) => d.completed).length}/6
                        </div>
                    </div>

                    {renderDayContent()}
                </div>
            </main>
        </div>
    );
};

export default OnboardingShell;
