import React from 'react';
import {
    Globe,
    ExternalLink,
    TrendingUp,
    AlertCircle,
    FileText,
    Building,
    Zap,
    ChevronRight,
} from 'lucide-react';

interface DomainEdgeCardProps {
    className?: string;
}

// Enhanced Domain Edge with regulatory, vendor, market, competitor signals
const DomainEdgeCard: React.FC<DomainEdgeCardProps> = ({ className = '' }) => {
    // Mock enhanced data
    const signals = [
        {
            type: 'REGULATORY',
            title: 'GDPR Update: New AI Disclosure Requirements',
            source: 'EU Data Protection Board',
            relevance: 'Your team uses AI for customer recommendations — disclosure needed by Q2',
            urgency: 'HIGH',
            icon: FileText,
        },
        {
            type: 'VENDOR',
            title: 'AWS Announces New Cost Optimization Tools',
            source: 'AWS Blog',
            relevance: 'Could reduce your infrastructure costs by 15-20%',
            urgency: 'MEDIUM',
            icon: Building,
        },
        {
            type: 'MARKET',
            title: 'React 19 Server Components Gaining Adoption',
            source: 'State of JS 2025',
            relevance: 'Matches your tech stack — consider for next major release',
            urgency: 'LOW',
            icon: TrendingUp,
        },
        {
            type: 'COMPETITOR',
            title: 'Competitor X Launches Real-time Collaboration Feature',
            source: 'TechCrunch',
            relevance: 'Similar feature on your roadmap — may need to accelerate',
            urgency: 'MEDIUM',
            icon: Zap,
        },
    ];

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'HIGH': return 'text-red-400 bg-red-500/20 border-red-500/30';
            case 'MEDIUM': return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
            case 'LOW': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
            default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'REGULATORY': return 'from-red-400 to-rose-500';
            case 'VENDOR': return 'from-blue-400 to-cyan-500';
            case 'MARKET': return 'from-emerald-400 to-teal-500';
            case 'COMPETITOR': return 'from-violet-400 to-purple-500';
            default: return 'from-slate-400 to-slate-500';
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-white">Market Insight</h3>
                    <p className="text-xs text-slate-400">External signals relevant to your role</p>
                </div>
            </div>

            {/* Signal Cards */}
            <div className="space-y-3">
                {signals.map((signal, idx) => {
                    const IconComponent = signal.icon;
                    return (
                        <div
                            key={idx}
                            className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-all group cursor-pointer"
                        >
                            <div className="flex items-start gap-3">
                                {/* Type Icon */}
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getTypeColor(signal.type)} flex items-center justify-center flex-shrink-0`}>
                                    <IconComponent className="w-5 h-5 text-white" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs text-slate-500 uppercase tracking-wide">{signal.type}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${getUrgencyColor(signal.urgency)}`}>
                                            {signal.urgency}
                                        </span>
                                    </div>
                                    <h4 className="font-medium text-white group-hover:text-emerald-400 transition-colors mb-1">
                                        {signal.title}
                                    </h4>
                                    <p className="text-xs text-slate-500 mb-2">Source: {signal.source}</p>
                                    <div className="p-2 rounded-lg bg-slate-900/50 border-l-2 border-emerald-500">
                                        <p className="text-sm text-slate-300">
                                            <span className="text-emerald-400">Why this matters:</span> {signal.relevance}
                                        </p>
                                    </div>
                                </div>

                                {/* Action */}
                                <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Curated Feed Link */}
            <button className="w-full p-3 rounded-xl border border-dashed border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/5 text-slate-400 hover:text-emerald-400 transition-all flex items-center justify-center gap-2 text-sm">
                View Full Curated Feed
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export default DomainEdgeCard;
