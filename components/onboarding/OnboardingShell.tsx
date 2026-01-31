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
                return <div className="text-white p-8">Select a day to continue</div>;
        }
    };

    return (
        <div
            className="min-h-screen flex bg-white"
        >
            {/* Sidebar: Day Navigation */}
            <aside className="w-72 border-r border-[#E0E0E0] bg-[#FAFAFA] backdrop-blur-md p-6 flex flex-col hidden md:flex">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded-lg bg-[#E60000] flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-lg font-bold text-black">DEX</span>
                    </div>
                    <p className="text-[#757575]">Onboarding Period</p>
                </div>

                <div className="mb-6">
                    <button
                        onClick={() => {
                            if (confirm('Reset demo state? This will return to Role Selection.')) {
                                localStorage.clear();
                                window.location.reload();
                            }
                        }}
                        className="w-full py-2 px-3 bg-white hover:bg-red-50 text-[#757575] hover:text-[#E60000] text-xs rounded-lg transition-colors flex items-center justify-center gap-2 mb-2 border border-[#E0E0E0]"
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
                            onDayComplete(5);
                            alert('Demo Mode: All days unlocked! (Refresh if needed)');
                        }}
                        className="w-full py-2 px-3 bg-white hover:bg-red-50 text-[#757575] hover:text-[#E60000] text-xs rounded-lg transition-colors flex items-center justify-center gap-2 mb-4 border border-[#E0E0E0]"
                    >
                        <Unlock className="w-3 h-3" /> Unlock All (Demo)
                    </button>
                    <div className="flex justify-between text-xs text-[#757575] mb-2">
                        <span>Progress</span>
                        <span>
                            {Object.values(user.dayProgress).filter((d: any) => d.completed).length}/6
                        </span>
                    </div>
                    <div className="h-2 bg-[#E0E0E0] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#E60000] transition-all duration-500"
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
                                            ? 'bg-[#E60000] border-[#E60000] shadow-lg shadow-red-900/20'
                                            : 'border-transparent hover:bg-gray-100'
                                        }
                                        ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}
`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span
                                            className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-black'}`}
                                        >
                                            Day {item.day}
                                        </span>
                                        {status === 'completed' && (
                                            <Check className="h-4 w-4 text-[#4CAF50]" />
                                        )}
                                        {status === 'locked' && (
                                            <Lock className="h-3 w-3 text-[#BDBDBD]" />
                                        )}
                                    </div>
                                    <div
                                        className={`text-xs ${isActive ? 'text-white/80' : 'text-[#757575]'}`}
                                    >
                                        {item.title}
                                    </div>
                                </button>
                            );
                        })}
                </nav>

                {/* User Profile Snippet */}
                <div className="mt-8 pt-6 border-t border-[#E0E0E0] flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-gray-700 to-black flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-black truncate">
                            {user.name}
                        </div>
                        <div className="text-xs text-[#757575] truncate">
                            {user.jobTitle}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto relative bg-white">
                {/* Background Ambient Effects - Removed for Bright Mode */}

                <div className="relative z-10 min-h-full">
                    {/* Mobile Header (similar to sidebar logic but for small screens) */}
                    <div className="md:hidden bg-white backdrop-blur-md p-4 sticky top-0 z-20 border-b border-[#E0E0E0] flex justify-between items-center">
                        <span className="text-black font-bold">Day {currentDay}</span>
                        <div className="text-xs text-[#616161]">
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
