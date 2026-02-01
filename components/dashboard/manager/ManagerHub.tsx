import React, { useState, useMemo } from 'react';
import {
    Users,
    AlertTriangle,
    Shield,
    TrendingUp,
    Clock,
    Activity,
    ChevronRight,
    Zap,
    Heart,
    Target,
    Award,
    MessageSquare,
    UserPlus,
    Calendar,
    Send,
    Sparkles,
    CheckCircle2,
    ArrowDown,
    TreePine,
    Layers,
    ArrowUpRight,
    ArrowDownRight,
    UserCheck,
    Settings,
    Cpu,
} from 'lucide-react';
import { TeamMember, BurnoutSignal } from '../../../types';
import { MOCK_TEAM } from '../../../constants';
import NewHireOnboarding from './NewHireOnboarding';
import SquadPulse from './SquadPulse';
import MentorshipGrid from './MentorshipGrid';
import ResourceSimulator from './ResourceSimulator';

interface ManagerHubProps {
    showSafeMode?: boolean;
}

// Mock Team Pulse Data
const teamPulse = {
    energy: 68,
    alignment: 72,
    velocity: 85,
    velocityTrend: '+8%',
};

// Mock Wins for Recognition
const recentWins = [
    { id: 'win-1', name: 'Alex Thompson', achievement: 'Completed API migration 2 days early', type: 'DELIVERY', daysAgo: 1 },
    { id: 'win-2', name: 'Jamie Rodriguez', achievement: 'Improved test coverage to 90%', type: 'QUALITY', daysAgo: 3 },
];

// --- Analytics Data (Migrated from ManagerDashboard) ---

const teamSkillGaps = [
    { skill: 'AI-Assisted Testing', demandScore: 92, teamCoverage: 15, gap: 77, priority: 'CRITICAL' },
    { skill: 'Kubernetes', demandScore: 85, teamCoverage: 40, gap: 45, priority: 'HIGH' },
    { skill: 'GraphQL', demandScore: 78, teamCoverage: 25, gap: 53, priority: 'HIGH' },
    { skill: 'React Native', demandScore: 70, teamCoverage: 60, gap: 10, priority: 'LOW' },
];

const teamSkillDistribution = [
    { skill: 'Test Automation', avg: 70, members: [{ name: 'Alex', score: 85 }, { name: 'Jamie', score: 65 }, { name: 'Sam', score: 90 }, { name: 'Casey', score: 40 }] },
    { skill: 'Python', avg: 71, members: [{ name: 'Alex', score: 70 }, { name: 'Jamie', score: 80 }, { name: 'Sam', score: 85 }, { name: 'Casey', score: 50 }] },
    { skill: 'Communication', avg: 79, members: [{ name: 'Alex', score: 80 }, { name: 'Jamie', score: 75 }, { name: 'Sam', score: 90 }, { name: 'Casey', score: 70 }] },
];

const growthTrajectories = [
    { name: 'Alex Thompson', role: 'Senior QA', velocity: 85, trend: 'up', monthlyGrowth: [65, 70, 72, 78, 82, 85], readinessLevel: 'Promotion Ready' },
    { name: 'Jamie Rodriguez', role: 'QA Engineer', velocity: 72, trend: 'up', monthlyGrowth: [55, 58, 62, 65, 68, 72], readinessLevel: 'On Track' },
    { name: 'Sam Chen', role: 'QA Lead', velocity: 90, trend: 'stable', monthlyGrowth: [88, 89, 90, 89, 90, 90], readinessLevel: 'Expert' },
    { name: 'Casey Miller', role: 'Junior QA', velocity: 45, trend: 'down', monthlyGrowth: [50, 52, 48, 46, 44, 45], readinessLevel: 'Needs Support' },
];

const capacityData = [
    { name: 'Alex Thompson', currentLoad: 75, maxCapacity: 100, projects: ['API Migration', 'Test Framework'], availability: 'AVAILABLE', nextFreeSlot: 'Now' },
    { name: 'Jamie Rodriguez', currentLoad: 95, maxCapacity: 100, projects: ['Customer Portal', 'Mobile Tests', 'Regression Suite'], availability: 'OVERLOADED', nextFreeSlot: 'Feb 15' },
    { name: 'Sam Chen', currentLoad: 60, maxCapacity: 100, projects: ['Team Training'], availability: 'AVAILABLE', nextFreeSlot: 'Now' },
    { name: 'Casey Miller', currentLoad: 110, maxCapacity: 100, projects: ['Sprint Tasks', 'Bug Fixes', 'On-call'], availability: 'CRITICAL', nextFreeSlot: 'Feb 20' },
];

// --- Helper Functions ---

const generateActionQueue = (team: TeamMember[]) => {
    const actions: {
        id: string;
        priority: 'HIGH' | 'MEDIUM' | 'LOW';
        type: 'BURNOUT' | 'SKILL_GAP' | 'VISIBILITY';
        member?: TeamMember;
        title: string;
        context: string;
        confidence: number;
        suggestedActions: { label: string; icon: React.ReactNode; action: string }[];
    }[] = [];

    team.forEach((member) => {
        // High Burnout OR High Load trigger
        if (member.burnoutScore >= 60 || (member.currentLoad && member.currentLoad > 105)) {
            const isLoadExtreme = member.currentLoad && member.currentLoad > 120;
            actions.push({
                id: `action-burnout-${member.id}`,
                priority: (member.burnoutScore >= 75 || isLoadExtreme) ? 'HIGH' : 'MEDIUM',
                type: 'BURNOUT',
                member,
                title: isLoadExtreme ? `Critical: ${member.name.split(' ')[0]} Overloaded` : `Intervention: ${member.name.split(' ')[0]}`,
                context: isLoadExtreme
                    ? `Load at ${member.currentLoad}% on ${member.project || 'Project'}. High risk of immediate departure.`
                    : `Load at ${member.currentLoad}%. Detected drift in ${member.burnoutSignals.map(s => s.metric).join(', ') || 'work patterns'}.`,
                confidence: 94,
                suggestedActions: [
                    { label: 'Relieve Load', icon: <ArrowDown className="w-3.5 h-3.5" />, action: 'reduce_load' },
                    { label: 'Connect (1:1)', icon: <Calendar className="w-3.5 h-3.5" />, action: 'schedule_1on1' },
                ],
            });
        }
    });

    // Smart Nudge for visibility/recognition
    actions.push({
        id: 'nudge-recognition',
        priority: 'LOW',
        type: 'VISIBILITY',
        title: 'Nudge: Team Visibility',
        context: 'Recognition frequency is 15% lower than peers this month.',
        confidence: 88,
        suggestedActions: [
            { label: 'Send Batch Kudos', icon: <Heart className="w-3.5 h-3.5" />, action: 'kudos' },
        ]
    });

    return actions.sort((a, b) => {
        const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
};

export type ManagerView = 'COMMAND' | 'SKILLS' | 'GROWTH' | 'CAPACITY';

export const MANAGER_NAV_ITEMS: { view: ManagerView; icon: any; label: string }[] = [
    { view: 'COMMAND', icon: Activity, label: 'Command' },
    { view: 'SKILLS', icon: TreePine, label: 'Skills' },
    { view: 'GROWTH', icon: TrendingUp, label: 'Growth' },
    { view: 'CAPACITY', icon: Layers, label: 'Capacity' },
];

interface ManagerHubProps {
    showSafeMode?: boolean;
    activeView?: ManagerView;
    onViewChange?: (view: ManagerView) => void;
}

import { useTeam } from '../../../hooks/useTeam';

const ManagerHub: React.FC<ManagerHubProps> = ({
    showSafeMode = true,
    activeView = 'COMMAND',
    onViewChange
}) => {
    const { team } = useTeam();
    const [actionTaken, setActionTaken] = useState<Record<string, string>>({});

    const visibleMembers = useMemo(() => team.filter((m) => !m.safeMode || !showSafeMode), [team, showSafeMode]);
    const safeModeCount = useMemo(() => team.filter((m) => m.safeMode).length, [team]);
    const actionQueue = useMemo(() => generateActionQueue(team), [team]);

    const handleAction = (actionId: string, actionType: string) => {
        setActionTaken(prev => ({ ...prev, [actionId]: actionType }));
        console.log(`Action taken: ${actionType} for ${actionId}`);
    };

    const getPriorityBadge = (priority: 'HIGH' | 'MEDIUM' | 'LOW') => {
        switch (priority) {
            case 'HIGH': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'MEDIUM': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            case 'LOW': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#18181b] p-6 lg:ml-64 transition-all duration-500">
            {/* COMMAND CENTER VIEW */}
            {activeView === 'COMMAND' && (
                <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">

                    {/* 1. STRATEGIC HEADER (Squad Pulse) */}
                    <section className="space-y-6">
                        <div className="flex items-end justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-[#E60000] animate-pulse" />
                                    <span className="text-[10px] font-black tracking-[0.2em] text-[#A1A1AA] uppercase">System Live</span>
                                </div>
                                <h1 className="text-4xl font-black tracking-tight text-[#18181b] mb-1">Squad Intelligence</h1>
                                <p className="text-[#52525B] text-sm">Real-time team telemetry and alignment heuristics</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="text-right">
                                    <span className="block text-[10px] text-[#A1A1AA] uppercase font-bold">Privacy Layer</span>
                                    <div className="flex items-center gap-1.5 text-[#E60000]/80 text-xs font-bold">
                                        <Shield className="w-3.5 h-3.5" />
                                        Differential Protected
                                    </div>
                                </div>
                            </div>
                        </div>

                        <SquadPulse />
                    </section>

                    {/* 2. TACTICAL GRID */}
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                        {/* LEFT: CO-PILOT FEED (Action Queue) */}
                        <div className="xl:col-span-4 space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-2">
                                    <Cpu className="w-5 h-5 text-[#E60000]" />
                                    <h2 className="text-lg font-black tracking-tight text-[#18181b]">Intelligence Feed</h2>
                                </div>
                                <span className="text-[10px] font-bold text-[#A1A1AA]">{actionQueue.length} Active Nudges</span>
                            </div>

                            <div className="space-y-4">
                                {actionQueue.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`group relative p-5 rounded-2xl bg-white border border-[#E4E4E7] shadow-sm hover:border-[#E60000]/30 transition-all duration-300 ${actionTaken[item.id] ? 'opacity-40 grayscale scale-[0.98]' : 'hover:shadow-md'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex gap-4">
                                                <div className="relative">
                                                    <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-[#E4E4E7] flex items-center justify-center overflow-hidden">
                                                        {item.member?.avatar ? (
                                                            <img src={item.member.avatar} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-xs font-black text-[#18181b]">{item.member?.name.split(' ').map(n => n[0]).join('')}</span>
                                                        )}
                                                    </div>
                                                    {!actionTaken[item.id] && (
                                                        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${item.priority === 'HIGH' ? 'bg-[#E60000]' : 'bg-orange-500'
                                                            }`} />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="text-sm font-black text-[#18181b]">{item.title}</h4>
                                                    </div>
                                                    <p className="text-xs text-[#52525B] leading-relaxed line-clamp-2">{item.context}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex gap-2">
                                                {!actionTaken[item.id] && item.suggestedActions.map((act) => (
                                                    <button
                                                        key={act.label}
                                                        onClick={() => handleAction(item.id, act.label)}
                                                        className="px-3 py-1.5 rounded-lg bg-zinc-50 border border-[#E4E4E7] hover:border-[#E60000]/50 hover:bg-[#E60000]/5 text-[10px] font-black text-[#52525B] hover:text-[#E60000] transition-all"
                                                    >
                                                        {act.label}
                                                    </button>
                                                ))}
                                                {actionTaken[item.id] && (
                                                    <div className="flex items-center gap-2 text-[#E60000] text-[10px] font-black font-mono">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        ACTION LOGGED
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-[10px] font-black text-[#E60000]/60 bg-[#E60000]/5 px-2 py-1 rounded-md">
                                                {item.confidence}% CONF
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT: ORCHESTRATION HUB */}
                        <div className="xl:col-span-8 space-y-8">
                            {/* Orchestration Header */}
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-2">
                                    <Target className="w-5 h-5 text-[#E60000]" />
                                    <h2 className="text-lg font-black tracking-tight text-[#18181b]">Resource Orchestration</h2>
                                </div>
                                <div className="flex gap-4 text-[10px] font-bold text-[#A1A1AA]">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#E60000]" />
                                        <span>Correction Vector</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <span>Optimal</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-[500px]">
                                <ResourceSimulator />
                                <MentorshipGrid />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Placeholder for other views (Skills, Growth, Capacity) - to be updated in next steps */}
            {activeView !== 'COMMAND' && (
                <div className="flex items-center justify-center min-h-[60vh] text-[#A1A1AA]">
                    <div className="text-center">
                        <Activity className="w-16 h-16 mx-auto mb-4 opacity-10" />
                        <h2 className="text-2xl font-black uppercase tracking-[0.5em]">Sector Offline</h2>
                        <p className="text-sm mt-2 font-mono">Intelligence modules for this view are initializing...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagerHub;
