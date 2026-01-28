import React, { useState } from 'react';
import {
    Users,
    Settings,
    Bell,
    Wifi,
    WifiOff,
    Activity,
    BarChart3,
    Shield,
    LogOut,
    TreePine,
    TrendingUp,
    Target,
    Calendar,
    AlertTriangle,
    CheckCircle2,
    ArrowUpRight,
    ArrowDownRight,
    Zap,
    Clock,
    UserCheck,
    Layers,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { MOCK_TEAM, MOCK_SKILL_TREE } from '../../constants';
import TeamCommandCenter from './manager/ManagerHub';

type ManagerView = 'COMMAND' | 'SKILLS' | 'GROWTH' | 'CAPACITY' | 'SETTINGS';

interface ManagerCockpitProps {
    user: UserProfile;
    onUpdateUser: (updates: Partial<UserProfile>) => void;
    onSwitchToEmployee?: () => void;
}

// Aggregated Team Skill Data
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

// Growth trajectory data
const growthTrajectories = [
    { name: 'Alex Thompson', role: 'Senior QA', velocity: 85, trend: 'up', monthlyGrowth: [65, 70, 72, 78, 82, 85], readinessLevel: 'Promotion Ready' },
    { name: 'Jamie Rodriguez', role: 'QA Engineer', velocity: 72, trend: 'up', monthlyGrowth: [55, 58, 62, 65, 68, 72], readinessLevel: 'On Track' },
    { name: 'Sam Chen', role: 'QA Lead', velocity: 90, trend: 'stable', monthlyGrowth: [88, 89, 90, 89, 90, 90], readinessLevel: 'Expert' },
    { name: 'Casey Miller', role: 'Junior QA', velocity: 45, trend: 'down', monthlyGrowth: [50, 52, 48, 46, 44, 45], readinessLevel: 'Needs Support' },
];

// Capacity data
const capacityData = [
    { name: 'Alex Thompson', currentLoad: 75, maxCapacity: 100, projects: ['API Migration', 'Test Framework'], availability: 'AVAILABLE', nextFreeSlot: 'Now' },
    { name: 'Jamie Rodriguez', currentLoad: 95, maxCapacity: 100, projects: ['Customer Portal', 'Mobile Tests', 'Regression Suite'], availability: 'OVERLOADED', nextFreeSlot: 'Feb 15' },
    { name: 'Sam Chen', currentLoad: 60, maxCapacity: 100, projects: ['Team Training'], availability: 'AVAILABLE', nextFreeSlot: 'Now' },
    { name: 'Casey Miller', currentLoad: 110, maxCapacity: 100, projects: ['Sprint Tasks', 'Bug Fixes', 'On-call'], availability: 'CRITICAL', nextFreeSlot: 'Feb 20' },
];

const ManagerCockpit: React.FC<ManagerCockpitProps> = ({ user, onUpdateUser, onSwitchToEmployee }) => {
    const [activeView, setActiveView] = useState<ManagerView>('COMMAND');
    const [isOnline, setIsOnline] = useState(true);

    const navItems: { view: ManagerView; icon: React.ReactNode; label: string }[] = [
        { view: 'COMMAND', icon: <Activity className="w-5 h-5" />, label: 'Command' },
        { view: 'SKILLS', icon: <TreePine className="w-5 h-5" />, label: 'Team Skills' },
        { view: 'GROWTH', icon: <TrendingUp className="w-5 h-5" />, label: 'Growth' },
        { view: 'CAPACITY', icon: <Layers className="w-5 h-5" />, label: 'Capacity' },
        { view: 'SETTINGS', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
    ];

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'CRITICAL': return 'text-[#D32F2F] bg-red-50';
            case 'HIGH': return 'text-[#E65100] bg-orange-50';
            case 'MEDIUM': return 'text-blue-600 bg-blue-50';
            default: return 'text-[#9E9E9E] bg-gray-50';
        }
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

    return (
        <div
            className="min-h-screen flex flex-col bg-[#FAFAFA]"
        >
            {/* Top Header */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-[#E0E0E0]">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-[#E60000] flex items-center justify-center">
                            <Shield className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-bold tracking-wider text-black">WORKPLACE HUB</span>
                        <span className="text-xs text-[#E60000] font-mono">MANAGER</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsOnline(!isOnline)}
                            className={`p-2 rounded-lg transition-all ${isOnline ? 'text-[#4CAF50] hover:bg-green-50' : 'text-[#9E9E9E] hover:bg-gray-100'}`}
                        >
                            {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-100 text-[#616161] hover:text-black relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#E60000]" />
                        </button>
                        <div className="flex items-center gap-2 pl-2 border-l border-[#E0E0E0]">
                            <div className="w-8 h-8 rounded-full bg-[#E60000] flex items-center justify-center text-xs font-bold text-white">
                                {user.name.split(' ').map((n) => n[0]).join('')}
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-medium text-black">{user.name}</p>
                                <p className="text-xs text-[#E60000]">Manager</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <nav className="sticky top-[57px] z-40 bg-white/90 backdrop-blur-sm border-b border-[#E0E0E0]">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
                        {navItems.map((item) => (
                            <button
                                key={item.view}
                                onClick={() => setActiveView(item.view)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeView === item.view
                                    ? 'bg-[#E60000] text-white shadow-lg shadow-red-200'
                                    : 'text-[#616161] hover:text-black hover:bg-gray-100'
                                    }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </button>
                        ))}
                        {onSwitchToEmployee && (
                            <button
                                onClick={onSwitchToEmployee}
                                className="ml-auto flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#9E9E9E] hover:text-[#616161] hover:bg-gray-100 transition-all"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Employee View</span>
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
                {/* Command Center */}
                {activeView === 'COMMAND' && <TeamCommandCenter />}

                {/* Team Skills - Skill Gap Analysis */}
                {activeView === 'SKILLS' && (
                    <div className="space-y-6">
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

                {/* Growth Trajectories */}
                {activeView === 'GROWTH' && (
                    <div className="space-y-6">
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

                {/* Capacity Planning */}
                {activeView === 'CAPACITY' && (
                    <div className="space-y-6">
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

                {/* Settings */}
                {activeView === 'SETTINGS' && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                                <Settings className="w-5 h-5 text-[#616161]" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-black">Manager Settings</h2>
                                <p className="text-sm text-[#616161]">Configure your team management preferences</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { title: 'Burnout Alerts', desc: 'Get notified when team members show fatigue signals', enabled: true },
                                { title: 'Weekly Digest', desc: 'Receive a summary of team pulse every Monday', enabled: true },
                                { title: 'Capacity Warnings', desc: 'Alert when team members exceed 90% load', enabled: true },
                                { title: 'Skill Gap Reports', desc: 'Monthly report on emerging skill gaps', enabled: false },
                                { title: 'Safe Mode Visibility', desc: 'Respect team member privacy settings', enabled: true },
                            ].map((setting) => (
                                <div key={setting.title} className="p-4 rounded-2xl bg-white border border-[#E0E0E0] shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-black">{setting.title}</p>
                                            <p className="text-sm text-[#616161]">{setting.desc}</p>
                                        </div>
                                        <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${setting.enabled ? 'bg-[#E60000]' : 'bg-gray-200'}`}>
                                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${setting.enabled ? 'ml-auto' : ''}`} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-[#E0E0E0] py-4 bg-white">
                <div className="max-w-6xl mx-auto px-4 flex items-center justify-center gap-2 text-xs text-[#9E9E9E]">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Manager Mode • Privacy-First Leadership</span>
                </div>
            </footer>
        </div>
    );
};

export default ManagerCockpit;
