import React, { useState } from 'react';
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
} from 'lucide-react';
import { TeamMember, BurnoutSignal } from '../../../types';
import { MOCK_TEAM } from '../../../constants';
import NewHireOnboarding from './NewHireOnboarding';

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

// Action Queue Items (derived from signals)
const generateActionQueue = (team: TeamMember[]) => {
    const actions: {
        id: string;
        priority: 'HIGH' | 'MEDIUM' | 'LOW';
        type: 'BURNOUT' | 'SKILL_GAP' | 'VISIBILITY';
        member?: TeamMember;
        title: string;
        context: string;
        suggestedActions: { label: string; icon: React.ReactNode; action: string }[];
    }[] = [];

    team.forEach((member) => {
        if (member.burnoutScore >= 60) {
            actions.push({
                id: `action-burnout-${member.id}`,
                priority: member.burnoutScore >= 70 ? 'HIGH' : 'MEDIUM',
                type: 'BURNOUT',
                member,
                title: `${member.name.split(' ')[0]} may be overwhelmed`,
                context: member.burnoutSignals.map(s => s.metric).join(', '),
                suggestedActions: [
                    { label: 'Reduce Load', icon: <ArrowDown className="w-3.5 h-3.5" />, action: 'reduce_load' },
                    { label: 'Schedule 1:1', icon: <Calendar className="w-3.5 h-3.5" />, action: 'schedule_1on1' },
                    { label: 'Send Kudos', icon: <Heart className="w-3.5 h-3.5" />, action: 'send_kudos' },
                ],
            });
        }
    });

    // Add skill gap action if multiple people lack a skill
    const skillGaps = team.filter(m => m.skillScores['Test Automation'] < 50);
    if (skillGaps.length >= 2) {
        actions.push({
            id: 'action-skill-gap-automation',
            priority: 'MEDIUM',
            type: 'SKILL_GAP',
            title: `${skillGaps.length} team members need Test Automation training`,
            context: `${skillGaps.map(m => m.name.split(' ')[0]).join(', ')} scored below 50%`,
            suggestedActions: [
                { label: 'Schedule Workshop', icon: <Users className="w-3.5 h-3.5" />, action: 'workshop' },
                { label: 'Assign Peer Mentor', icon: <UserPlus className="w-3.5 h-3.5" />, action: 'mentor' },
            ],
        });
    }

    return actions.sort((a, b) => {
        const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
};

const TeamCommandCenter: React.FC<ManagerHubProps> = ({ showSafeMode = true }) => {
    const [actionTaken, setActionTaken] = useState<Record<string, string>>({});

    const visibleMembers = MOCK_TEAM.filter((m) => !m.safeMode || !showSafeMode);
    const safeModeCount = MOCK_TEAM.filter((m) => m.safeMode).length;
    const actionQueue = generateActionQueue(MOCK_TEAM);

    const handleAction = (actionId: string, actionType: string) => {
        setActionTaken(prev => ({ ...prev, [actionId]: actionType }));
        // In real app, this would trigger the actual action
        console.log(`Action taken: ${actionType} for ${actionId}`);
    };

    const getPriorityColor = (priority: 'HIGH' | 'MEDIUM' | 'LOW') => {
        switch (priority) {
            case 'HIGH': return 'border-[#D32F2F]/50 bg-[#FFEBEE]';
            case 'MEDIUM': return 'border-[#E65100]/50 bg-[#FFF3E0]';
            case 'LOW': return 'border-blue-500/50 bg-blue-50';
        }
    };

    const getPriorityBadge = (priority: 'HIGH' | 'MEDIUM' | 'LOW') => {
        switch (priority) {
            case 'HIGH': return 'bg-[#FFEBEE] text-[#D32F2F]';
            case 'MEDIUM': return 'bg-[#FFF3E0] text-[#E65100]';
            case 'LOW': return 'bg-blue-50 text-blue-600';
        }
    };

    const getPulseColor = (value: number) => {
        if (value >= 75) return 'text-[#4CAF50]';
        if (value >= 50) return 'text-[#E65100]';
        return 'text-[#D32F2F]';
    };

    const getPulseBarColor = (value: number) => {
        if (value >= 75) return 'bg-[#4CAF50]';
        if (value >= 50) return 'bg-[#E65100]';
        return 'bg-[#D32F2F]';
    };

    return (
        <div className="space-y-5">
            {/* Header with Team Pulse Stats */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E60000] flex items-center justify-center">
                        <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-black">Team Command Center</h2>
                        <p className="text-sm text-[#616161]">
                            {visibleMembers.length} team members
                            {safeModeCount > 0 && showSafeMode && (
                                <span className="ml-2 text-[#9E9E9E]">• {safeModeCount} in Safe Mode</span>
                            )}
                        </p>
                    </div>
                </div>

                {/* Inline Team Pulse Stats */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#E0E0E0]">
                        <Heart className="w-4 h-4 text-[#E60000]" />
                        <span className="text-xs text-[#616161]">Energy</span>
                        <span className={`text-sm font-bold ${getPulseColor(teamPulse.energy)}`}>{teamPulse.energy}%</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#E0E0E0]">
                        <Target className="w-4 h-4 text-purple-600" />
                        <span className="text-xs text-[#616161]">Alignment</span>
                        <span className={`text-sm font-bold ${getPulseColor(teamPulse.alignment)}`}>{teamPulse.alignment}%</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#E0E0E0]">
                        <TrendingUp className="w-4 h-4 text-[#4CAF50]" />
                        <span className="text-xs text-[#616161]">Velocity</span>
                        <span className={`text-sm font-bold ${getPulseColor(teamPulse.velocity)}`}>
                            {teamPulse.velocity}%
                            <span className="text-[#4CAF50] text-xs ml-1">{teamPulse.velocityTrend}</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Safe Mode Notice */}
            {safeModeCount > 0 && showSafeMode && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-200">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                        <p className="text-sm text-black">
                            {safeModeCount} team member{safeModeCount > 1 ? 's have' : ' has'} Safe Mode enabled
                        </p>
                        <p className="text-xs text-[#616161]">
                            Their detailed activity is private. You only see validated capabilities.
                        </p>
                    </div>
                </div>
            )}

            {/* Main Dashboard Grid - 3 Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left: Action Queue (Takes 7 columns) */}
                <div className="lg:col-span-7">
                    <div className="bg-white rounded-2xl border border-[#E0E0E0] shadow-sm overflow-hidden h-full">
                        <div className="flex items-center justify-between p-4 border-b border-[#E0E0E0] bg-[#FAFAFA]">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-[#E65100]" />
                                <h3 className="font-bold text-black">Action Queue</h3>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFF3E0] text-[#E65100]">
                                    {actionQueue.length} pending
                                </span>
                            </div>
                        </div>

                        <div className="p-4 max-h-[400px] overflow-y-auto">
                            {actionQueue.length === 0 ? (
                                <div className="p-6 rounded-2xl bg-[#E8F5E9] border border-[#4CAF50]/30 text-center">
                                    <CheckCircle2 className="w-10 h-10 text-[#4CAF50] mx-auto mb-3" />
                                    <p className="text-black font-medium">All clear!</p>
                                    <p className="text-xs text-[#616161]">No urgent interventions needed.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {actionQueue.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`p-4 rounded-xl border transition-all ${actionTaken[item.id]
                                                ? 'bg-emerald-500/10 border-emerald-500/30 opacity-60'
                                                : getPriorityColor(item.priority)
                                                }`}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    {item.member && (
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-sm font-bold text-white">
                                                            {item.member.name.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                    )}
                                                    {!item.member && (
                                                        <div className="w-10 h-10 rounded-full bg-[#FFF3E0] flex items-center justify-center">
                                                            <Users className="w-5 h-5 text-[#E65100]" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-black">{item.title}</p>
                                                        <p className="text-xs text-[#616161]">{item.context}</p>
                                                    </div>
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityBadge(item.priority)}`}>
                                                    {item.priority}
                                                </span>
                                            </div>

                                            {actionTaken[item.id] ? (
                                                <div className="flex items-center gap-2 text-emerald-400 text-sm">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    <span>Action taken: {actionTaken[item.id]}</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-wrap gap-2">
                                                    {item.suggestedActions.map((action) => (
                                                        <button
                                                            key={action.action}
                                                            onClick={() => handleAction(item.id, action.label)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-gray-50 text-[#616161] hover:text-black text-sm font-medium transition-all border border-[#E0E0E0] hover:border-[#E60000]/50 shadow-sm"
                                                        >
                                                            {action.icon}
                                                            {action.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Side: New Hires + Recent Wins (Takes 5 columns) */}
                <div className="lg:col-span-5 space-y-5">
                    {/* New Hire Onboarding - Compact */}
                    <NewHireOnboarding className="max-h-[280px] overflow-hidden" />

                    {/* Recent Wins - Compact */}
                    <div className="p-4 rounded-2xl bg-[#FFF8E1] border border-[#FFE082]">
                        <div className="flex items-center gap-2 mb-3">
                            <Award className="w-5 h-5 text-[#F9A825]" />
                            <h3 className="font-bold text-black text-sm">Recent Wins</h3>
                        </div>
                        <div className="space-y-2">
                            {recentWins.map((win) => (
                                <div key={win.id} className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#E0E0E0]">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-black truncate">{win.name}</p>
                                        <p className="text-xs text-[#616161] truncate">{win.achievement}</p>
                                    </div>
                                    <button className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-md bg-[#FFF3E0] text-[#F57C00] text-xs font-medium hover:bg-[#FFE0B2] transition-colors ml-2">
                                        <Sparkles className="w-3 h-3" /> Kudos
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Privacy Footer */}
            <div className="flex items-center justify-center gap-2 text-xs text-[#9E9E9E]">
                <Shield className="w-3.5 h-3.5" />
                <span>Showing signals, not surveillance. Actions are logged for transparency.</span>
            </div>
        </div>
    );
};

export default TeamCommandCenter;
