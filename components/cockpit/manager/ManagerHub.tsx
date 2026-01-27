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
            case 'HIGH': return 'border-red-500/50 bg-red-500/5';
            case 'MEDIUM': return 'border-amber-500/50 bg-amber-500/5';
            case 'LOW': return 'border-blue-500/50 bg-blue-500/5';
        }
    };

    const getPriorityBadge = (priority: 'HIGH' | 'MEDIUM' | 'LOW') => {
        switch (priority) {
            case 'HIGH': return 'bg-red-500/20 text-red-400';
            case 'MEDIUM': return 'bg-amber-500/20 text-amber-400';
            case 'LOW': return 'bg-blue-500/20 text-blue-400';
        }
    };

    const getPulseColor = (value: number) => {
        if (value >= 75) return 'text-emerald-400';
        if (value >= 50) return 'text-amber-400';
        return 'text-red-400';
    };

    const getPulseBarColor = (value: number) => {
        if (value >= 75) return 'bg-emerald-500';
        if (value >= 50) return 'bg-amber-500';
        return 'bg-red-500';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Team Command Center</h2>
                        <p className="text-sm text-slate-400">
                            {visibleMembers.length} team members
                            {safeModeCount > 0 && showSafeMode && (
                                <span className="ml-2 text-slate-500">• {safeModeCount} in Safe Mode</span>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Safe Mode Notice */}
            {safeModeCount > 0 && showSafeMode && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <div className="flex-1">
                        <p className="text-sm text-slate-300">
                            {safeModeCount} team member{safeModeCount > 1 ? 's have' : ' has'} Safe Mode enabled
                        </p>
                        <p className="text-xs text-slate-500">
                            Their detailed activity is private. You only see validated capabilities.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Action Queue */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                        <h3 className="font-bold text-white">Action Queue</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                            {actionQueue.length} pending
                        </span>
                    </div>

                    {actionQueue.length === 0 ? (
                        <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 text-center">
                            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                            <p className="text-slate-300 font-medium">All clear!</p>
                            <p className="text-xs text-slate-500">No urgent interventions needed.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {actionQueue.map((item) => (
                                <div
                                    key={item.id}
                                    className={`p-4 rounded-2xl border transition-all ${actionTaken[item.id]
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
                                                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                                                    <Users className="w-5 h-5 text-amber-400" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-white">{item.title}</p>
                                                <p className="text-xs text-slate-400">{item.context}</p>
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
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-medium transition-all border border-slate-700 hover:border-slate-600"
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

                {/* Right Column: Team Pulse + Wins */}
                <div className="space-y-6">
                    {/* Team Pulse */}
                    <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                        <div className="flex items-center gap-2 mb-4">
                            <Zap className="w-5 h-5 text-indigo-400" />
                            <h3 className="font-bold text-white">Team Pulse</h3>
                        </div>

                        <div className="space-y-4">
                            {/* Energy */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-slate-400 flex items-center gap-1.5">
                                        <Heart className="w-3.5 h-3.5" /> Energy
                                    </span>
                                    <span className={`text-sm font-bold ${getPulseColor(teamPulse.energy)}`}>
                                        {teamPulse.energy}%
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${getPulseBarColor(teamPulse.energy)}`} style={{ width: `${teamPulse.energy}%` }} />
                                </div>
                            </div>

                            {/* Alignment */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-slate-400 flex items-center gap-1.5">
                                        <Target className="w-3.5 h-3.5" /> Alignment
                                    </span>
                                    <span className={`text-sm font-bold ${getPulseColor(teamPulse.alignment)}`}>
                                        {teamPulse.alignment}%
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${getPulseBarColor(teamPulse.alignment)}`} style={{ width: `${teamPulse.alignment}%` }} />
                                </div>
                            </div>

                            {/* Velocity */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-slate-400 flex items-center gap-1.5">
                                        <TrendingUp className="w-3.5 h-3.5" /> Velocity
                                    </span>
                                    <span className={`text-sm font-bold ${getPulseColor(teamPulse.velocity)}`}>
                                        {teamPulse.velocity}%
                                        <span className="text-emerald-400 text-xs ml-1">{teamPulse.velocityTrend}</span>
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${getPulseBarColor(teamPulse.velocity)}`} style={{ width: `${teamPulse.velocity}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Wins */}
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                        <div className="flex items-center gap-2 mb-4">
                            <Award className="w-5 h-5 text-amber-400" />
                            <h3 className="font-bold text-white">Recent Wins</h3>
                        </div>

                        <div className="space-y-3">
                            {recentWins.map((win) => (
                                <div key={win.id} className="p-3 rounded-xl bg-slate-800/50">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="text-sm font-medium text-white">{win.name}</p>
                                            <p className="text-xs text-slate-400">{win.achievement}</p>
                                        </div>
                                        <span className="text-xs text-slate-500">{win.daysAgo}d ago</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500/20 text-amber-400 text-xs font-medium hover:bg-amber-500/30 transition-colors">
                                            <Sparkles className="w-3 h-3" /> Send Kudos
                                        </button>
                                        <button className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-700 text-slate-300 text-xs font-medium hover:bg-slate-600 transition-colors">
                                            <Send className="w-3 h-3" /> Share
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Privacy Footer */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <Shield className="w-3.5 h-3.5" />
                <span>Showing signals, not surveillance. Actions are logged for transparency.</span>
            </div>
        </div>
    );
};

export default TeamCommandCenter;
