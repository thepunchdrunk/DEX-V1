import React, { useState } from 'react';
import {
    Users,
    TrendingUp,
    Lightbulb,
    ChevronRight,
    Eye,
    EyeOff,
    Sparkles,
    Clock,
    Check,
    MessageSquare,
    Inbox,
    Calendar,
} from 'lucide-react';
import { PeerPracticeInsight } from '../../../types';
import { MOCK_PEER_INSIGHTS } from '../../../constants';

interface PeerPracticeProps {
    className?: string;
}

const PeerPractice: React.FC<PeerPracticeProps> = ({ className = '' }) => {
    const [adoptedPractices, setAdoptedPractices] = useState<string[]>([]);
    const [showDetails, setShowDetails] = useState<string | null>(null);

    const insights = MOCK_PEER_INSIGHTS;

    const handleAdopt = (id: string) => {
        setAdoptedPractices((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    };

    const getCategoryIcon = (category: PeerPracticeInsight['category']) => {
        switch (category) {
            case 'PRODUCTIVITY': return Clock;
            case 'COMMUNICATION': return MessageSquare;
            case 'COLLABORATION': return Users;
            case 'TOOLING': return Inbox;
            case 'WELLBEING': return Sparkles;
            case 'LEARNING': return Lightbulb;
            default: return Lightbulb;
        }
    };

    const getCategoryColor = (category: PeerPracticeInsight['category']) => {
        switch (category) {
            case 'PRODUCTIVITY': return 'text-blue-400 bg-blue-500/20';
            case 'COMMUNICATION': return 'text-violet-400 bg-violet-500/20';
            case 'COLLABORATION': return 'text-cyan-400 bg-cyan-500/20';
            case 'TOOLING': return 'text-orange-400 bg-orange-500/20';
            case 'WELLBEING': return 'text-emerald-400 bg-emerald-500/20';
            case 'LEARNING': return 'text-amber-400 bg-amber-500/20';
            default: return 'text-slate-400 bg-slate-500/20';
        }
    };

    const getEffectivenessColor = (score: number) => {
        if (score >= 80) return 'text-emerald-400';
        if (score >= 60) return 'text-blue-400';
        return 'text-amber-400';
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Peer Practices</h2>
                        <p className="text-sm text-slate-400">Learn from high performers anonymously</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <EyeOff className="w-4 h-4" />
                    <span>Anonymized data</span>
                </div>
            </div>

            {/* Stats Banner */}
            <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20">
                <div className="text-center">
                    <p className="text-2xl font-bold text-white">{insights.length}</p>
                    <p className="text-xs text-slate-400">Practices</p>
                </div>
                <div className="text-center border-x border-slate-700">
                    <p className="text-2xl font-bold text-emerald-400">
                        {Math.round(insights.reduce((acc, i) => acc + i.adoptionRate, 0) / insights.length)}%
                    </p>
                    <p className="text-xs text-slate-400">Avg Adoption</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-violet-400">{adoptedPractices.length}</p>
                    <p className="text-xs text-slate-400">You've Adopted</p>
                </div>
            </div>

            {/* Practice Cards */}
            <div className="space-y-4">
                {insights.map((insight) => {
                    const IconComponent = getCategoryIcon(insight.category);
                    const isAdopted = adoptedPractices.includes(insight.id);
                    const isExpanded = showDetails === insight.id;

                    return (
                        <div
                            key={insight.id}
                            className={`rounded-2xl border transition-all ${isAdopted
                                ? 'bg-emerald-500/5 border-emerald-500/30'
                                : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                                }`}
                        >
                            <div className="p-4">
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className={`w-10 h-10 rounded-xl ${getCategoryColor(insight.category)} flex items-center justify-center flex-shrink-0`}>
                                        <IconComponent className="w-5 h-5" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-medium text-white">{insight.title}</h3>
                                            {isAdopted && (
                                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs">
                                                    Adopted
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-400 mb-3">{insight.description}</p>

                                        {/* Stats Row */}
                                        <div className="flex items-center gap-4 text-xs">
                                            <div className="flex items-center gap-1.5">
                                                <Users className="w-3.5 h-3.5 text-slate-500" />
                                                <span className="text-slate-400">
                                                    {insight.adoptionRate}% peers use this
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <TrendingUp className={`w-3.5 h-3.5 ${getEffectivenessColor(insight.effectiveness)}`} />
                                                <span className={getEffectivenessColor(insight.effectiveness)}>
                                                    {insight.effectiveness}% effective
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => handleAdopt(insight.id)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isAdopted
                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                : 'bg-violet-500/20 text-violet-400 hover:bg-violet-500/30'
                                                }`}
                                        >
                                            {isAdopted ? (
                                                <span className="flex items-center gap-1">
                                                    <Check className="w-3 h-3" /> Adopted
                                                </span>
                                            ) : (
                                                'Try This'
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setShowDetails(isExpanded ? null : insight.id)}
                                            className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                                        >
                                            {isExpanded ? 'Less' : 'More'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {isExpanded && (
                                <div className="px-4 pb-4 pt-2 border-t border-slate-700/50">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                                                How to implement
                                            </h4>
                                            <ul className="space-y-1.5">
                                                {insight.implementationSteps?.map((step, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                                                        <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs flex-shrink-0">
                                                            {idx + 1}
                                                        </span>
                                                        {step}
                                                    </li>
                                                )) || (
                                                        <>
                                                            <li className="flex items-start gap-2 text-sm text-slate-300">
                                                                <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs flex-shrink-0">1</span>
                                                                Start with a small commitment
                                                            </li>
                                                            <li className="flex items-start gap-2 text-sm text-slate-300">
                                                                <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs flex-shrink-0">2</span>
                                                                Track your progress for 2 weeks
                                                            </li>
                                                            <li className="flex items-start gap-2 text-sm text-slate-300">
                                                                <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs flex-shrink-0">3</span>
                                                                Adjust based on results
                                                            </li>
                                                        </>
                                                    )}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                                                Expected benefits
                                            </h4>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm text-emerald-400">
                                                    <TrendingUp className="w-4 h-4" />
                                                    <span>+{Math.round(insight.effectiveness * 0.3)}% productivity</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-blue-400">
                                                    <Clock className="w-4 h-4" />
                                                    <span>Save ~{Math.round(insight.effectiveness / 10)} hours/week</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Privacy Footer */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 py-2">
                <EyeOff className="w-3.5 h-3.5" />
                <span>All insights are anonymized aggregates from 50+ peers in similar roles</span>
            </div>
        </div>
    );
};

export default PeerPractice;
