import React from 'react';
import {
    FileText,
    CheckCircle2,
    AlertTriangle,
    Clock,
    User,
    ExternalLink,
    RefreshCw,
    Archive,
} from 'lucide-react';
import { KnowledgeObject, KnowledgeStatus } from '../../types';

interface KnowledgeCardProps {
    knowledge: KnowledgeObject;
    onRevalidate?: (knowledge: KnowledgeObject) => void;
    onView?: (knowledge: KnowledgeObject) => void;
    compact?: boolean;
}

const KnowledgeCard: React.FC<KnowledgeCardProps> = ({
    knowledge,
    onRevalidate,
    onView,
    compact = false,
}) => {
    const getStatusConfig = (status: KnowledgeStatus) => {
        switch (status) {
            case 'FRESH':
                return {
                    color: '#10B981',
                    bgColor: 'rgba(16, 185, 129, 0.1)',
                    borderColor: 'rgba(16, 185, 129, 0.3)',
                    icon: CheckCircle2,
                    label: 'Fresh',
                };
            case 'AGING':
                return {
                    color: '#F59E0B',
                    bgColor: 'rgba(245, 158, 11, 0.1)',
                    borderColor: 'rgba(245, 158, 11, 0.3)',
                    icon: Clock,
                    label: 'Aging',
                };
            case 'STALE':
                return {
                    color: '#EF4444',
                    bgColor: 'rgba(239, 68, 68, 0.1)',
                    borderColor: 'rgba(239, 68, 68, 0.3)',
                    icon: AlertTriangle,
                    label: 'Stale',
                };
            case 'RETIRED':
                return {
                    color: '#64748B',
                    bgColor: 'rgba(100, 116, 139, 0.1)',
                    borderColor: 'rgba(100, 116, 139, 0.3)',
                    icon: Archive,
                    label: 'Retired',
                };
            case 'PENDING_REVIEW':
                return {
                    color: '#8B5CF6',
                    bgColor: 'rgba(139, 92, 246, 0.1)',
                    borderColor: 'rgba(139, 92, 246, 0.3)',
                    icon: RefreshCw,
                    label: 'Pending Review',
                };
        }
    };

    const getSourceTypeColor = (sourceType: string) => {
        switch (sourceType) {
            case 'OFFICIAL':
                return '#10B981';
            case 'PEER':
                return '#3B82F6';
            case 'EXTERNAL':
                return '#8B5CF6';
            case 'AI_GENERATED':
                return '#F59E0B';
            default:
                return '#64748B';
        }
    };

    const config = getStatusConfig(knowledge.status);
    const StatusIcon = config.icon;

    const freshnessColor =
        knowledge.freshnessScore > 70
            ? '#10B981'
            : knowledge.freshnessScore > 40
                ? '#F59E0B'
                : '#EF4444';

    if (compact) {
        return (
            <div
                className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer hover:border-slate-500 transition-all"
                style={{
                    backgroundColor: 'rgba(30, 41, 59, 0.5)',
                    borderColor: config.borderColor,
                }}
                onClick={() => onView?.(knowledge)}
            >
                <FileText className="w-4 h-4 text-slate-400" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                        {knowledge.title}
                    </p>
                    <p className="text-xs text-slate-500">{knowledge.source}</p>
                </div>
                <div
                    className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{
                        backgroundColor: config.bgColor,
                        color: config.color,
                    }}
                >
                    {config.label}
                </div>
            </div>
        );
    }

    return (
        <div
            className="p-4 rounded-xl border backdrop-blur-md"
            style={{
                backgroundColor: 'rgba(30, 41, 59, 0.8)',
                borderColor: config.borderColor,
            }}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: config.bgColor }}
                    >
                        <FileText className="w-5 h-5" style={{ color: config.color }} />
                    </div>
                    <div>
                        <p className="font-semibold text-white">{knowledge.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{
                                    backgroundColor: `${getSourceTypeColor(knowledge.sourceType)}20`,
                                    color: getSourceTypeColor(knowledge.sourceType),
                                }}
                            >
                                {knowledge.sourceType.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-slate-500">{knowledge.source}</span>
                        </div>
                    </div>
                </div>

                {/* Status Badge */}
                <div
                    className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                        backgroundColor: config.bgColor,
                        color: config.color,
                        border: `1px solid ${config.borderColor}`,
                    }}
                >
                    <StatusIcon className="w-3 h-3" />
                    {config.label}
                </div>
            </div>

            {/* Summary */}
            {knowledge.summary && (
                <p className="text-sm text-slate-400 mb-4">{knowledge.summary}</p>
            )}

            {/* Freshness Meter */}
            <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Freshness Score</span>
                    <span style={{ color: freshnessColor }}>
                        {knowledge.freshnessScore}%
                    </span>
                </div>
                <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                            width: `${knowledge.freshnessScore}%`,
                            backgroundColor: freshnessColor,
                        }}
                    />
                </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                <div className="flex items-center gap-2 text-slate-400">
                    <User className="w-3 h-3" />
                    <span>By {knowledge.createdBy}</span>
                </div>
                {knowledge.validatedBy && (
                    <div className="flex items-center gap-2 text-slate-400">
                        <CheckCircle2 className="w-3 h-3 text-green-400" />
                        <span>Validated by {knowledge.validatedBy}</span>
                    </div>
                )}
                <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>Accessed {knowledge.accessCount}x</span>
                </div>
                {knowledge.expiryDate && (
                    <div className="flex items-center gap-2 text-amber-400">
                        <AlertTriangle className="w-3 h-3" />
                        <span>
                            Expires{' '}
                            {new Date(knowledge.expiryDate).toLocaleDateString()}
                        </span>
                    </div>
                )}
            </div>

            {/* Tags */}
            {knowledge.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                    {knowledge.tags.map((tag, i) => (
                        <span
                            key={i}
                            className="px-2 py-0.5 text-xs rounded bg-slate-700/50 text-slate-300"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onView?.(knowledge)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-slate-300 bg-slate-700/50 hover:bg-slate-700 transition-all"
                >
                    <ExternalLink className="w-4 h-4" />
                    View
                </button>
                {(knowledge.status === 'AGING' || knowledge.status === 'STALE') && (
                    <button
                        onClick={() => onRevalidate?.(knowledge)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all"
                        style={{
                            backgroundColor: config.bgColor,
                            color: config.color,
                            border: `1px solid ${config.borderColor}`,
                        }}
                    >
                        <RefreshCw className="w-4 h-4" />
                        Request Review
                    </button>
                )}
            </div>
        </div>
    );
};

export default KnowledgeCard;
