import React from 'react';
import {
    TrendingUp,
    TrendingDown,
    Minus,
    Sparkles,
    BookOpen,
    ChevronRight,
    Target,
    Briefcase,
} from 'lucide-react';
import { CareerHorizonSignal, MarketTrend } from '../../../types';
import { MOCK_CAREER_HORIZON } from '../../../constants';

interface CareerHorizonProps {
    signal?: CareerHorizonSignal;
    onDismiss?: () => void;
    className?: string;
}

const CareerHorizon: React.FC<CareerHorizonProps> = ({
    signal: propSignal,
    onDismiss,
    className = ''
}) => {
    const signal = propSignal || MOCK_CAREER_HORIZON;

    const getTrendIcon = (direction: MarketTrend['direction']) => {
        switch (direction) {
            case 'RISING':
                return <TrendingUp className="w-4 h-4 text-emerald-400" />;
            case 'DECLINING':
                return <TrendingDown className="w-4 h-4 text-red-400" />;
            case 'STABLE':
                return <Minus className="w-4 h-4 text-slate-400" />;
        }
    };

    const getTrendColor = (direction: MarketTrend['direction']) => {
        switch (direction) {
            case 'RISING':
                return 'text-emerald-400';
            case 'DECLINING':
                return 'text-red-400';
            case 'STABLE':
                return 'text-slate-400';
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-pink-600 flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Career Horizon</h2>
                    <p className="text-sm text-slate-400">{signal.quarter} Market Signals</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-gradient-to-br from-violet-500/10 to-pink-500/10 backdrop-blur-md rounded-2xl border border-violet-500/30 overflow-hidden">
                {/* Your Skills */}
                <div className="p-5 border-b border-violet-500/20">
                    <span className="text-xs text-slate-500 uppercase tracking-wide">Your Skills</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {signal.userSkills.map((skill) => (
                            <span
                                key={skill}
                                className="px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-medium border border-violet-500/30"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Market Trends */}
                <div className="p-5 border-b border-slate-700/50">
                    <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Market Demand Trends
                    </h4>
                    <div className="space-y-3">
                        {signal.marketTrends.map((trend) => (
                            <div
                                key={trend.skillName}
                                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50"
                            >
                                <div className="flex items-center gap-3">
                                    {getTrendIcon(trend.direction)}
                                    <span className="text-sm text-slate-200">{trend.skillName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm font-bold ${getTrendColor(trend.direction)}`}>
                                        {trend.demandChange > 0 ? '+' : ''}{trend.demandChange}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Emerging Capabilities */}
                <div className="p-5 border-b border-slate-700/50">
                    <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Emerging Capabilities for Your Role
                    </h4>
                    <div className="space-y-3">
                        {signal.emergingCapabilities.map((cap) => (
                            <div
                                key={cap.name}
                                className="p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-pink-500/10 border border-violet-500/20"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-white">{cap.name}</span>
                                    <span className="px-2 py-0.5 rounded-full bg-violet-500/30 text-violet-300 text-xs">
                                        {cap.relevanceToRole}% match
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 mb-3">{cap.description}</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {cap.learningResources.map((resource) => (
                                        <span
                                            key={resource}
                                            className="px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400 text-xs flex items-center gap-1"
                                        >
                                            <BookOpen className="w-3 h-3" />
                                            {resource}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Role Evolution Insights */}
                <div className="p-5">
                    <h4 className="text-sm font-medium text-slate-400 mb-3">Role Evolution Insights</h4>
                    <ul className="space-y-2">
                        {signal.roleEvolutionInsights.map((insight, index) => (
                            <li
                                key={index}
                                className="flex items-start gap-2 text-sm text-slate-300"
                            >
                                <span className="text-violet-400 mt-0.5">•</span>
                                {insight}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
                    <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-400 hover:to-pink-400 text-white font-medium text-sm transition-all flex items-center justify-center gap-2">
                        Explore Learning Paths
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CareerHorizon;
