import React from 'react';
import {
    Building2,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    ChevronRight,
    Target,
    Users,
    Calendar,
    Zap,
    ArrowUpRight,
    ArrowDownRight,
    Minus,
} from 'lucide-react';

interface ContextAnchorCardProps {
    className?: string;
}

// Enhanced Context Anchor with KPI movement, project risk, cross-team signals
const ContextAnchorCard: React.FC<ContextAnchorCardProps> = ({ className = '' }) => {
    // Mock enhanced data
    const kpis = [
        { name: 'Sprint Velocity', value: 42, change: 8, unit: 'pts', trend: 'up' as const },
        { name: 'Bug Backlog', value: 23, change: -5, unit: 'issues', trend: 'down' as const },
        { name: 'Test Coverage', value: 78, change: 2, unit: '%', trend: 'up' as const },
    ];

    const projectRisks = [
        { project: 'API Migration', risk: 'HIGH', reason: 'Dependency on external vendor' },
        { project: 'Dashboard Redesign', risk: 'LOW', reason: 'On track' },
    ];

    const crossTeamSignals = [
        { team: 'DevOps', signal: 'Infrastructure upgrade scheduled Friday', urgency: 'MEDIUM' },
        { team: 'Product', signal: 'New requirements for Q2 feature', urgency: 'LOW' },
    ];

    const suggestedFirstSteps = [
        'Review API migration blockers with vendor',
        'Schedule sync with DevOps before Friday upgrade',
        'Update sprint board with new velocity baseline',
    ];

    const getTrendIcon = (trend: 'up' | 'down' | 'flat') => {
        switch (trend) {
            case 'up': return <ArrowUpRight className="w-4 h-4" />;
            case 'down': return <ArrowDownRight className="w-4 h-4" />;
            case 'flat': return <Minus className="w-4 h-4" />;
        }
    };

    const getTrendColor = (trend: 'up' | 'down' | 'flat', isPositive: boolean) => {
        if (trend === 'flat') return 'text-slate-400';
        return (trend === 'up') === isPositive ? 'text-emerald-400' : 'text-red-400';
    };

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'HIGH': return 'text-red-400 bg-red-500/20';
            case 'MEDIUM': return 'text-amber-400 bg-amber-500/20';
            case 'LOW': return 'text-emerald-400 bg-emerald-500/20';
            default: return 'text-slate-400 bg-slate-500/20';
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-white">Your Context Today</h3>
                    <p className="text-xs text-slate-400">KPIs, risks, and cross-team signals</p>
                </div>
            </div>

            {/* KPI Movement */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">KPI Movement</h4>
                <div className="grid grid-cols-3 gap-3">
                    {kpis.map((kpi) => (
                        <div key={kpi.name} className="text-center">
                            <div className="flex items-center justify-center gap-1">
                                <span className="text-xl font-bold text-white">{kpi.value}</span>
                                <span className="text-xs text-slate-400">{kpi.unit}</span>
                            </div>
                            <div className={`flex items-center justify-center gap-0.5 text-xs ${getTrendColor(kpi.trend, kpi.name !== 'Bug Backlog')}`}>
                                {getTrendIcon(kpi.trend)}
                                <span>{kpi.change > 0 ? '+' : ''}{kpi.change}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{kpi.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Project Risks */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Project Risk</h4>
                <div className="space-y-2">
                    {projectRisks.map((project) => (
                        <div key={project.project} className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-white">{project.project}</p>
                                <p className="text-xs text-slate-500">{project.reason}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRiskColor(project.risk)}`}>
                                {project.risk}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cross-Team Signals */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Cross-Team Signals</h4>
                <div className="space-y-2">
                    {crossTeamSignals.map((signal, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-700/30 transition-colors">
                            <Users className="w-4 h-4 text-slate-400 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm text-white">{signal.signal}</p>
                                <p className="text-xs text-slate-500">From {signal.team}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Suggested First Steps */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-blue-400" />
                    <h4 className="text-sm font-medium text-blue-400">Suggested First Steps</h4>
                </div>
                <ul className="space-y-2">
                    {suggestedFirstSteps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                            <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs flex-shrink-0">
                                {idx + 1}
                            </span>
                            {step}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ContextAnchorCard;
