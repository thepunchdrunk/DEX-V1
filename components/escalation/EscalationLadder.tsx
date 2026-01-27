import React, { useState } from 'react';
import {
    Users,
    GraduationCap,
    UserCog,
    Building2,
    Scale,
    Shield,
    ChevronRight,
    MessageCircle,
    Mail,
    Calendar,
    Ticket,
    ArrowRight,
} from 'lucide-react';
import { EscalationPath, EscalationSuggestion, EscalationType } from '../../types';
import { ESCALATION_LADDER } from '../../constants';

interface EscalationLadderProps {
    suggestion?: EscalationSuggestion;
    onEscalate?: (path: EscalationPath) => void;
    showAllLevels?: boolean;
}

const EscalationLadder: React.FC<EscalationLadderProps> = ({
    suggestion,
    onEscalate,
    showAllLevels = false,
}) => {
    const [selectedLevel, setSelectedLevel] = useState<number | null>(
        suggestion?.recommendedPath.level ?? null
    );

    const getTypeIcon = (type: EscalationType) => {
        switch (type) {
            case 'PEER':
                return <Users className="w-5 h-5" />;
            case 'MENTOR':
                return <GraduationCap className="w-5 h-5" />;
            case 'MANAGER':
                return <UserCog className="w-5 h-5" />;
            case 'HR_SME':
                return <Building2 className="w-5 h-5" />;
            case 'LEGAL':
                return <Scale className="w-5 h-5" />;
            case 'SAFETY':
                return <Shield className="w-5 h-5" />;
        }
    };

    const getContactIcon = (method: string) => {
        switch (method) {
            case 'CHAT':
                return <MessageCircle className="w-4 h-4" />;
            case 'EMAIL':
                return <Mail className="w-4 h-4" />;
            case 'MEETING':
                return <Calendar className="w-4 h-4" />;
            case 'TICKET':
                return <Ticket className="w-4 h-4" />;
            default:
                return <MessageCircle className="w-4 h-4" />;
        }
    };

    const getLevelColor = (level: number) => {
        const colors = [
            '#10B981', // Level 1 - Green (Peer)
            '#3B82F6', // Level 2 - Blue (Mentor)
            '#8B5CF6', // Level 3 - Purple (Manager)
            '#F59E0B', // Level 4 - Amber (HR/SME)
            '#EF4444', // Level 5 - Red (Legal/Safety)
        ];
        return colors[level - 1] || colors[0];
    };

    const levelsToShow = showAllLevels
        ? ESCALATION_LADDER
        : suggestion
            ? [
                suggestion.recommendedPath,
                ...suggestion.alternativePaths.slice(0, 1),
            ]
            : ESCALATION_LADDER.slice(0, 3);

    return (
        <div className="space-y-4">
            {/* Header with AI Limitation */}
            {suggestion && (
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-amber-500/10">
                            <Shield className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white mb-1">
                                Human Guidance Recommended
                            </p>
                            <p className="text-sm text-slate-400">{suggestion.aiLimitation}</p>
                            <p className="text-xs text-slate-500 mt-2">
                                Issue type: <span className="text-slate-300">{suggestion.issueType}</span>
                                {' • '}
                                Severity: <span className="text-slate-300">{suggestion.severity}</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Escalation Ladder */}
            <div className="space-y-2">
                {levelsToShow.map((path, index) => {
                    const isRecommended =
                        suggestion && path.level === suggestion.recommendedPath.level;
                    const isSelected = selectedLevel === path.level;
                    const color = getLevelColor(path.level);

                    return (
                        <div
                            key={path.level}
                            className={`
                relative p-4 rounded-xl border transition-all duration-200 cursor-pointer
                ${isSelected ? 'ring-2' : ''}
                ${isRecommended ? 'bg-slate-800/80' : 'bg-slate-800/40'}
              `}
                            style={{
                                borderColor: isSelected || isRecommended ? `${color}50` : 'rgba(71, 85, 105, 0.5)',
                                ringColor: isSelected ? color : undefined,
                            }}
                            onClick={() => setSelectedLevel(path.level)}
                        >
                            {/* Recommended Badge */}
                            {isRecommended && (
                                <div
                                    className="absolute -top-2 left-4 px-2 py-0.5 text-xs font-bold rounded-full"
                                    style={{
                                        backgroundColor: color,
                                        color: 'white',
                                    }}
                                >
                                    RECOMMENDED
                                </div>
                            )}

                            <div className="flex items-start gap-4">
                                {/* Level Indicator */}
                                <div className="flex flex-col items-center">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{
                                            backgroundColor: `${color}20`,
                                            color: color,
                                        }}
                                    >
                                        {getTypeIcon(path.type)}
                                    </div>
                                    {index < levelsToShow.length - 1 && (
                                        <div
                                            className="w-0.5 h-6 mt-2"
                                            style={{ backgroundColor: `${color}30` }}
                                        />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-white">{path.label}</p>
                                            <p className="text-sm text-slate-400">{path.description}</p>
                                        </div>
                                        <ChevronRight
                                            className={`w-5 h-5 text-slate-500 transition-transform ${isSelected ? 'rotate-90' : ''
                                                }`}
                                        />
                                    </div>

                                    {/* Expanded Details */}
                                    {isSelected && (
                                        <div className="mt-4 pt-4 border-t border-slate-700/50 animate-fade-in">
                                            {/* Trigger Conditions */}
                                            <div className="mb-3">
                                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                                    Best for:
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {path.triggerConditions.map((condition, i) => (
                                                        <span
                                                            key={i}
                                                            className="px-2 py-1 text-xs rounded-lg bg-slate-700/50 text-slate-300"
                                                        >
                                                            {condition}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Contact Info */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 text-sm text-slate-400">
                                                    <span className="flex items-center gap-1">
                                                        {getContactIcon(path.contactMethod)}
                                                        {path.contactMethod.toLowerCase()}
                                                    </span>
                                                    <span>~{path.estimatedResponseTime}</span>
                                                </div>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onEscalate?.(path);
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all"
                                                    style={{
                                                        backgroundColor: color,
                                                        color: 'white',
                                                    }}
                                                >
                                                    Escalate
                                                    <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Show All Toggle */}
            {!showAllLevels && ESCALATION_LADDER.length > 3 && (
                <button className="w-full py-2 text-sm text-slate-400 hover:text-white transition-colors">
                    View all escalation levels
                </button>
            )}
        </div>
    );
};

export default EscalationLadder;
