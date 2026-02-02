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
    TreePine,
    Layers,
    ArrowUpRight,
    ArrowDownRight,
    UserCheck,
    Settings,
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

type ManagerView = 'COMMAND' | 'SKILLS' | 'GROWTH' | 'CAPACITY';

const ManagerHub: React.FC<ManagerHubProps> = ({ showSafeMode = true }) => {
    const [activeView, setActiveView] = useState<ManagerView>('COMMAND');
    const [actionTaken, setActionTaken] = useState<Record<string, string>>({});

    const visibleMembers = MOCK_TEAM.filter((m) => !m.safeMode || !showSafeMode);
    const safeModeCount = MOCK_TEAM.filter((m) => m.safeMode).length;
    const actionQueue = generateActionQueue(MOCK_TEAM);

    const handleAction = (actionId: string, actionType: string) => {
        setActionTaken(prev => ({ ...prev, [actionId]: actionType }));
        console.log(`Action taken: ${actionType} for ${actionId}`);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'CRITICAL': return 'text-[#D32F2F] bg-red-50';
            case 'HIGH': return 'text-[#E65100] bg-orange-50';
            case 'MEDIUM': return 'text-blue-600 bg-blue-50';
            case 'LOW': return 'text-blue-500 bg-blue-50';
            default: return 'text-[#9E9E9E] bg-gray-50';
        }
    };

    const getPriorityBadge = (priority: 'HIGH' | 'MEDIUM' | 'LOW') => {
        switch (priority) {
            case 'HIGH': return 'bg-[#FFEBEE] text-[#D32F2F]';
            case 'MEDIUM': return 'bg-[#FFF3E0] text-[#E65100]';
            case 'LOW': return 'bg-blue-50 text-blue-600';
        }
    };

    // Command center specific coloring for cards
    const getCommandPriorityColor = (priority: 'HIGH' | 'MEDIUM' | 'LOW') => {
        switch (priority) {
            case 'HIGH': return 'border-[#D32F2F]/50 bg-[#FFEBEE]';
            case 'MEDIUM': return 'border-[#E65100]/50 bg-[#FFF3E0]';
            case 'LOW': return 'border-blue-500/50 bg-blue-50';
        }
    };

    const getPulseColor = (value: number) => {
        if (value >= 75) return 'text-[#4CAF50]';
        if (value >= 50) return 'text-[#E65100]';
        return 'text-[#D32F2F]';
    };

    const getAvailabilityColor = (status: string) => {
        switch (status) {
            case 'AVAILABLE': return 'text-[#4CAF50] bg-[#E8F5E9] border-[#4CAF50]/30';
            case 'OVERLOADED': return 'text-[#E65100] bg-[#FFF3E0] border-[#E65100]/30';
            case 'CRITICAL': return 'text-[#D32F2F] bg-[#FFEBEE] border-[#D32F2F]/30';
            default: return 'text-[#9E9E9E] bg-gray-50 border-gray-200';
        }
    };

    const getTrendIcon = (trend: string) => {
        if (trend === 'up') return <ArrowUpRight className="w-4 h-4 text-[#4CAF50]" />;
        if (trend === 'down') return <ArrowDownRight className="w-4 h-4 text-[#D32F2F]" />;
        return <span className="text-[#9E9E9E]">→</span>;
    };

    const navItems: { view: ManagerView; icon: React.ReactNode; label: string }[] = [
        { view: 'COMMAND', icon: <Activity className="w-4 h-4" />, label: 'Command' },
        { view: 'SKILLS', icon: <TreePine className="w-4 h-4" />, label: 'Skills' },
        { view: 'GROWTH', icon: <TrendingUp className="w-4 h-4" />, label: 'Growth' },
        { view: 'CAPACITY', icon: <Layers className="w-4 h-4" />, label: 'Capacity' },
    ];

    return (
        <div className="space-y-6">
            {/* Embedded Navigation */}
            <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl w-fit">
                {navItems.map((item) => (
                    <button
                        key={item.view}
                        onClick={() => setActiveView(item.view)}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                            ${activeView === item.view
                                ? 'bg-white text-[#E60000] shadow-sm'
                                : 'text-[#616161] hover:text-black hover:bg-gray-200/50'
                            }
                        `}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </button>
                ))}
            </div>

            {/* COMMAND CENTER VIEW */}
            {activeView === 'COMMAND' && (
                <div className="space-y-5 animate-fade-in">
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

                    {/* Main Dashboard Grid */}
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
                                                        : getCommandPriorityColor(item.priority)
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

                        {/* Right Side: New Hires + Recent Wins */}
                        <div className="lg:col-span-5 space-y-5">
                            {/* New Hire Onboarding */}
                            <NewHireOnboarding className="max-h-[280px] overflow-hidden" />

                            {/* Recent Wins */}
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
                </div>
            )}

            {/* SKILLS VIEW */}
            {activeView === 'SKILLS' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center">
                            <TreePine className="w-5 h-5 text-[#4CAF50]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-black">Team Skills & Gap Analysis</h2>
                            <p className="text-sm text-[#616161]">Identify skill gaps and training priorities</p>
                        </div>
                    </div>

                    {/* Skill Gaps */}
                    <div className="p-5 rounded-2xl bg-white border border-[#E0E0E0] shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertTriangle className="w-5 h-5 text-[#E65100]" />
                            <h3 className="font-bold text-black">Skill Gaps vs Market Demand</h3>
                        </div>
                        <div className="space-y-3">
                            {teamSkillGaps.map((gap) => (
                                <div key={gap.skill} className="p-4 rounded-xl bg-[#FAFAFA] border border-[#E0E0E0]">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-black">{gap.skill}</span>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(gap.priority)}`}>
                                            {gap.priority}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="flex-1">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-[#616161]">Team Coverage</span>
                                                <span className="text-black">{gap.teamCoverage}%</span>
                                            </div>
                                            <div className="h-2 bg-[#E0E0E0] rounded-full overflow-hidden">
                                                <div className="h-full bg-[#E60000]" style={{ width: `${gap.teamCoverage}%` }} />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-[#616161]">Market Demand</span>
                                                <span className="text-black">{gap.demandScore}%</span>
                                            </div>
                                            <div className="h-2 bg-[#E0E0E0] rounded-full overflow-hidden">
                                                <div className="h-full bg-[#4CAF50]" style={{ width: `${gap.demandScore}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                        <button className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-[#E60000] hover:bg-red-100 transition-colors">
                                            Schedule Training
                                        </button>
                                        <button className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-[#616161] hover:bg-gray-200 transition-colors">
                                            Find External Expert
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skill Distribution Matrix */}
                    <div className="p-5 rounded-2xl bg-white border border-[#E0E0E0] shadow-sm">
                        <h3 className="font-bold text-black mb-4">Team Skill Distribution</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-[#E0E0E0]">
                                        <th className="text-left py-2 px-3 text-[#616161] font-medium">Skill</th>
                                        <th className="text-center py-2 px-3 text-[#616161] font-medium">Avg</th>
                                        {['Alex', 'Jamie', 'Sam', 'Casey'].map((name) => (
                                            <th key={name} className="text-center py-2 px-3 text-[#616161] font-medium">{name}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {teamSkillDistribution.map((row) => (
                                        <tr key={row.skill} className="border-b border-[#E0E0E0]/50">
                                            <td className="py-3 px-3 text-black">{row.skill}</td>
                                            <td className="text-center py-3 px-3">
                                                <span className="text-[#E60000] font-bold">{row.avg}%</span>
                                            </td>
                                            {row.members.map((member) => (
                                                <td key={member.name} className="text-center py-3 px-3">
                                                    <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium ${member.score >= 80 ? 'bg-[#E8F5E9] text-[#4CAF50]' :
                                                        member.score >= 60 ? 'bg-blue-50 text-blue-600' :
                                                            member.score >= 40 ? 'bg-[#FFF3E0] text-[#E65100]' :
                                                                'bg-[#FFEBEE] text-[#D32F2F]'
                                                        }`}>
                                                        {member.score}
                                                    </span>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* GROWTH VIEW */}
            {activeView === 'GROWTH' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-black">Growth Trajectories</h2>
                            <p className="text-sm text-[#616161]">Track individual progress and readiness levels</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {growthTrajectories.map((person) => (
                            <div key={person.name} className="p-5 rounded-2xl bg-white border border-[#E0E0E0] shadow-sm">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-[#E60000] flex items-center justify-center text-sm font-bold text-white">
                                            {person.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="font-medium text-black">{person.name}</p>
                                            <p className="text-xs text-[#616161]">{person.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {getTrendIcon(person.trend)}
                                        <span className="text-lg font-bold text-black">{person.velocity}</span>
                                    </div>
                                </div>

                                {/* Mini Chart */}
                                <div className="h-16 flex items-end gap-1 mb-4">
                                    {person.monthlyGrowth.map((val, i) => (
                                        <div key={i} className="flex-1 flex flex-col justify-end">
                                            <div
                                                className={`w-full rounded-t-sm transition-all ${person.trend === 'up' ? 'bg-[#4CAF50]' :
                                                    person.trend === 'down' ? 'bg-[#D32F2F]' :
                                                        'bg-blue-500'
                                                    }`}
                                                style={{ height: `${val}%` }}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${person.readinessLevel === 'Promotion Ready' ? 'bg-[#E8F5E9] text-[#4CAF50]' :
                                    person.readinessLevel === 'Expert' ? 'bg-purple-50 text-purple-600' :
                                        person.readinessLevel === 'On Track' ? 'bg-blue-50 text-blue-600' :
                                            'bg-[#FFEBEE] text-[#D32F2F]'
                                    }`}>
                                    {person.readinessLevel === 'Promotion Ready' && <CheckCircle2 className="w-3.5 h-3.5" />}
                                    {person.readinessLevel === 'Needs Support' && <AlertTriangle className="w-3.5 h-3.5" />}
                                    {person.readinessLevel}
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <button className="flex-1 text-xs px-3 py-2 rounded-lg bg-gray-100 text-[#616161] hover:bg-gray-200 transition-colors">
                                        View Details
                                    </button>
                                    <button className="flex-1 text-xs px-3 py-2 rounded-lg bg-red-50 text-[#E60000] hover:bg-red-100 transition-colors">
                                        Schedule 1:1
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* CAPACITY VIEW */}
            {activeView === 'CAPACITY' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <Layers className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-black">Capacity Planning</h2>
                            <p className="text-sm text-[#616161]">Team workload distribution and availability</p>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#4CAF50]/20">
                            <div className="flex items-center gap-2 mb-2">
                                <UserCheck className="w-5 h-5 text-[#4CAF50]" />
                                <span className="text-sm text-[#616161]">Available</span>
                            </div>
                            <p className="text-2xl font-bold text-[#4CAF50]">2</p>
                            <p className="text-xs text-[#9E9E9E]">Can take new work</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-[#FFF3E0] border border-[#E65100]/20">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-5 h-5 text-[#E65100]" />
                                <span className="text-sm text-[#616161]">At Capacity</span>
                            </div>
                            <p className="text-2xl font-bold text-[#E65100]">1</p>
                            <p className="text-xs text-[#9E9E9E]">Fully loaded</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-[#FFEBEE] border border-[#D32F2F]/20">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="w-5 h-5 text-[#D32F2F]" />
                                <span className="text-sm text-[#616161]">Overloaded</span>
                            </div>
                            <p className="text-2xl font-bold text-[#D32F2F]">1</p>
                            <p className="text-xs text-[#9E9E9E]">Needs rebalancing</p>
                        </div>
                    </div>

                    {/* Individual Capacity */}
                    <div className="space-y-3">
                        {capacityData.map((person) => (
                            <div key={person.name} className={`p-4 rounded-2xl border ${getAvailabilityColor(person.availability)}`}>
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#E60000] flex items-center justify-center text-sm font-bold text-white">
                                            {person.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="font-medium text-black">{person.name}</p>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {person.projects.map((project) => (
                                                    <span key={project} className="text-xs px-2 py-0.5 rounded bg-gray-100 text-[#616161]">
                                                        {project}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-lg font-bold ${person.currentLoad > 100 ? 'text-[#D32F2F]' :
                                            person.currentLoad > 80 ? 'text-[#E65100]' :
                                                'text-[#4CAF50]'
                                            }`}>
                                            {person.currentLoad}%
                                        </p>
                                        <p className="text-xs text-[#9E9E9E]">Next free: {person.nextFreeSlot}</p>
                                    </div>
                                </div>

                                <div className="relative h-3 bg-[#E0E0E0] rounded-full overflow-hidden">
                                    <div
                                        className={`absolute h-full rounded-full transition-all ${person.currentLoad > 100 ? 'bg-[#D32F2F]' :
                                            person.currentLoad > 80 ? 'bg-[#E65100]' :
                                                'bg-[#4CAF50]'
                                            }`}
                                        style={{ width: `${Math.min(person.currentLoad, 100)}%` }}
                                    />
                                    {person.currentLoad > 100 && (
                                        <div className="absolute right-0 top-0 h-full bg-[#D32F2F]/50 animate-pulse" style={{ width: `${person.currentLoad - 100}%` }} />
                                    )}
                                </div>

                                {person.availability === 'CRITICAL' && (
                                    <div className="flex gap-2 mt-3">
                                        <button className="text-xs px-3 py-1.5 rounded-lg bg-[#FFEBEE] text-[#D32F2F] hover:bg-red-100 transition-colors">
                                            Redistribute Work
                                        </button>
                                        <button className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-[#616161] hover:bg-gray-200 transition-colors">
                                            Extend Deadline
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Privacy Footer */}
            <div className="flex items-center justify-center gap-2 text-xs text-[#9E9E9E] mt-8">
                <Shield className="w-3.5 h-3.5" />
                <span>Showing signals, not surveillance. Actions are logged for transparency.</span>
            </div>
        </div>
    );
};

export default ManagerHub;
