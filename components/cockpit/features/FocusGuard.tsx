import React from 'react';
import {
    Focus,
    Zap,
    Clock,
    AlertTriangle,
    TrendingDown,
    Calendar,
    ChevronRight,
} from 'lucide-react';
import { FocusMetrics, FocusAlert } from '../../../types';
import { MOCK_FOCUS_METRICS } from '../../../constants';

interface FocusGuardProps {
    metrics?: FocusMetrics;
    onDismiss?: () => void;
    className?: string;
}

const FocusGuard: React.FC<FocusGuardProps & { viewMode?: 'FULL' | 'WIDGET' }> = ({
    metrics: propMetrics,
    onDismiss,
    className = '',
    viewMode = 'FULL'
}) => {
    const metrics = propMetrics || MOCK_FOCUS_METRICS;

    const getSeverityColor = (severity: FocusAlert['severity']) => {
        switch (severity) {
            case 'CRITICAL':
                return 'text-red-400 bg-red-500/20 border-red-500/30';
            case 'WARNING':
                return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
            case 'INFO':
                return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
        }
    };

    const getDeepWorkColor = (percentage: number) => {
        if (percentage >= 40) return 'text-emerald-400';
        if (percentage >= 25) return 'text-amber-400';
        return 'text-red-400';
    };

    if (viewMode === 'WIDGET') {
        return (
            <div className={`p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors ${className}`}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                        <Focus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Focus Guard</h3>
                        <p className="text-xs text-slate-400">Deep work patterns</p>
                    </div>
                    <div className={`ml-auto px-2 py-1 rounded text-xs font-bold ${getDeepWorkColor(metrics.deepWorkPercentage)} bg-slate-700`}>
                        {metrics.deepWorkPercentage}%
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="p-3 bg-slate-800 rounded-lg">
                        <span className="block text-xs text-slate-400 mb-1">Longest Block</span>
                        <span className="block text-lg font-bold text-white">{metrics.longestFocusBlock}m</span>
                    </div>
                    <div className="p-3 bg-slate-800 rounded-lg">
                        <span className="block text-xs text-slate-400 mb-1">Switching</span>
                        <span className={`block text-lg font-bold ${metrics.contextSwitchesPerHour > 10 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {metrics.contextSwitchesPerHour}/hr
                        </span>
                    </div>
                </div>
                {metrics.alerts.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 p-2 rounded-lg">
                        <AlertTriangle className="w-3 h-3" />
                        {metrics.alerts[0].message}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                    <Focus className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Focus Guard</h2>
                    <p className="text-sm text-slate-400">Your deep work patterns this week</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-md rounded-2xl border border-cyan-500/30 overflow-hidden">
                {/* Metrics Grid */}
                <div className="p-5 grid grid-cols-2 gap-4">
                    {/* Deep Work Percentage */}
                    <div className="col-span-2 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-slate-400">Deep Work Time</span>
                            <span className={`text-2xl font-bold ${getDeepWorkColor(metrics.deepWorkPercentage)}`}>
                                {metrics.deepWorkPercentage}%
                            </span>
                        </div>
                        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${metrics.deepWorkPercentage >= 40
                                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                                    : metrics.deepWorkPercentage >= 25
                                        ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                                        : 'bg-gradient-to-r from-red-400 to-red-500'
                                    }`}
                                style={{ width: `${metrics.deepWorkPercentage}%` }}
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            Target: 40%+ of work time in focused blocks
                        </p>
                    </div>

                    {/* Context Switches */}
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-4 h-4 text-amber-400" />
                            <span className="text-xs text-slate-400">Context Switches</span>
                        </div>
                        <p className={`text-xl font-bold ${metrics.contextSwitchesPerHour > 10 ? 'text-red-400' : 'text-emerald-400'
                            }`}>
                            {metrics.contextSwitchesPerHour}/hr
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            {metrics.contextSwitchesPerHour > 10 ? 'High' : 'Normal'} switching
                        </p>
                    </div>

                    {/* Longest Focus Block */}
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-cyan-400" />
                            <span className="text-xs text-slate-400">Longest Focus</span>
                        </div>
                        <p className={`text-xl font-bold ${metrics.longestFocusBlock >= 90 ? 'text-emerald-400' : 'text-slate-300'
                            }`}>
                            {metrics.longestFocusBlock}min
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            {metrics.longestFocusBlock >= 90 ? 'Excellent' : 'Try 90+ min'}
                        </p>
                    </div>

                    {/* Fragmented Days */}
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingDown className="w-4 h-4 text-purple-400" />
                            <span className="text-xs text-slate-400">Fragmented Days</span>
                        </div>
                        <p className={`text-xl font-bold ${metrics.fragmentedDays >= 3 ? 'text-red-400' : 'text-emerald-400'
                            }`}>
                            {metrics.fragmentedDays}/5
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            Days without 2hr blocks
                        </p>
                    </div>

                    {/* Calendar Suggestion */}
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-blue-400" />
                            <span className="text-xs text-slate-400">Suggestion</span>
                        </div>
                        <p className="text-sm text-slate-300 font-medium">
                            Block mornings
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            9-11am focus time
                        </p>
                    </div>
                </div>

                {/* Alerts */}
                {metrics.alerts.length > 0 && (
                    <div className="px-5 pb-5">
                        <h4 className="text-sm font-medium text-slate-400 mb-3">Insights</h4>
                        <div className="space-y-2">
                            {metrics.alerts.map((alert) => (
                                <div
                                    key={alert.id}
                                    className={`p-3 rounded-xl border ${getSeverityColor(alert.severity)}`}
                                >
                                    <div className="flex items-start gap-2">
                                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium">{alert.message}</p>
                                            <p className="text-xs opacity-80 mt-1">{alert.suggestion}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
                    <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-medium text-sm transition-all flex items-center justify-center gap-2">
                        Schedule Focus Time
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FocusGuard;
