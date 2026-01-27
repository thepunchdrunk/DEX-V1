import React, { useState, useEffect } from 'react';
import {
    ShieldAlert,
    TrendingUp,
    Zap,
    Target,
    Sparkles,
    RefreshCw,
    Clock,
    ChevronRight,
    AlertCircle,
    CheckCircle2,
} from 'lucide-react';
import { DailyCard, TimeHorizon, HORIZON_CONFIG, CognitiveLoadLevel } from '../../types';

interface Daily3EngineProps {
    cards: DailyCard[];
    deferredCards?: DailyCard[];
    cognitiveLoad: CognitiveLoadLevel;
    activeHorizon?: TimeHorizon;
    onRefresh?: () => void;
    onCardAction?: (card: DailyCard) => void;
    onCardDismiss?: (card: DailyCard) => void;
    loading?: boolean;
}

const Daily3Engine: React.FC<Daily3EngineProps> = ({
    cards,
    deferredCards = [],
    cognitiveLoad,
    activeHorizon,
    onRefresh,
    onCardAction,
    onCardDismiss,
    loading = false,
}) => {
    const [visibleCards, setVisibleCards] = useState<DailyCard[]>([]);

    useEffect(() => {
        // Filter cards based on active horizon if specified
        let filtered = activeHorizon
            ? cards.filter((c) => c.horizon === activeHorizon)
            : cards;

        // If high cognitive load, dim non-critical cards
        if (cognitiveLoad === 'HIGH' || cognitiveLoad === 'CRITICAL') {
            filtered = filtered.map((c) => ({
                ...c,
                _dimmed: c.cognitiveLoadAware && c.type !== 'CRITICAL',
            }));
        }

        setVisibleCards(filtered as any);
    }, [cards, activeHorizon, cognitiveLoad]);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'CRITICAL':
                return <ShieldAlert className="w-5 h-5" />;
            case 'ORG_CONTEXT':
                return <TrendingUp className="w-5 h-5" />;
            case 'SKILL_GROWTH':
                return <Zap className="w-5 h-5" />;
            case 'MARKET_GAP':
                return <Target className="w-5 h-5" />;
            case 'BEHAVIOR':
                return <Sparkles className="w-5 h-5" />;
            case 'REINFORCEMENT':
                return <RefreshCw className="w-5 h-5" />;
            default:
                return <CheckCircle2 className="w-5 h-5" />;
        }
    };

    const getConfidenceBadge = (level: string) => {
        const configs = {
            HIGH: {
                bg: 'rgba(16, 185, 129, 0.15)',
                border: 'rgba(16, 185, 129, 0.3)',
                color: '#10B981',
                label: 'High Confidence',
            },
            MEDIUM: {
                bg: 'rgba(245, 158, 11, 0.15)',
                border: 'rgba(245, 158, 11, 0.3)',
                color: '#F59E0B',
                label: 'Suggestive',
            },
            LOW: {
                bg: 'rgba(148, 163, 184, 0.15)',
                border: 'rgba(148, 163, 184, 0.3)',
                color: '#94A3B8',
                label: 'Exploratory',
            },
        };
        return configs[level as keyof typeof configs] || configs.MEDIUM;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        Daily 3
                        <span className="text-slate-500 text-lg font-normal">
                            Contextual Intelligence
                        </span>
                    </h2>
                    {cognitiveLoad === 'HIGH' || cognitiveLoad === 'CRITICAL' ? (
                        <p className="text-sm text-amber-400 flex items-center gap-2 mt-1">
                            <AlertCircle className="w-4 h-4" />
                            High load detected — showing critical items only
                        </p>
                    ) : null}
                </div>
                {onRefresh && (
                    <button
                        onClick={onRefresh}
                        disabled={loading}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                )}
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {loading
                    ? [1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-56 rounded-2xl bg-slate-800/50 animate-pulse border border-slate-700/50"
                        />
                    ))
                    : visibleCards.map((card: any) => {
                        const horizonConfig = HORIZON_CONFIG[card.horizon];
                        const confidenceConfig = getConfidenceBadge(card.confidence.level);
                        const isDimmed = card._dimmed;

                        return (
                            <div
                                key={card.id}
                                className={`
                    relative group rounded-2xl p-6 border backdrop-blur-md
                    transition-all duration-300 ease-out
                    ${isDimmed ? 'opacity-40 grayscale-[30%]' : 'hover:scale-[1.02]'}
                    ${card.type === 'CRITICAL' ? 'border-red-500/50' : 'border-slate-700/50'}
                  `}
                                style={{
                                    background: card.type === 'CRITICAL'
                                        ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(239, 68, 68, 0.1))'
                                        : 'rgba(30, 41, 59, 0.8)',
                                    borderLeft: `4px solid ${horizonConfig.color}`,
                                }}
                            >
                                {/* Horizon Glow Effect */}
                                <div
                                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                    style={{
                                        boxShadow: `inset 0 0 30px ${horizonConfig.color}10`,
                                    }}
                                />

                                {/* Top Row: Type & Confidence */}
                                <div className="flex items-start justify-between mb-4">
                                    <div
                                        className="p-2 rounded-lg"
                                        style={{
                                            backgroundColor: `${horizonConfig.color}20`,
                                            color: horizonConfig.color,
                                        }}
                                    >
                                        {getTypeIcon(card.type)}
                                    </div>
                                    <div
                                        className="px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                                        style={{
                                            backgroundColor: confidenceConfig.bg,
                                            border: `1px solid ${confidenceConfig.border}`,
                                            color: confidenceConfig.color,
                                        }}
                                    >
                                        {confidenceConfig.label}
                                    </div>
                                </div>

                                {/* Type Label */}
                                <div className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-2">
                                    {card.type.replace('_', ' ')}
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-semibold text-white mb-2 leading-snug">
                                    {card.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-slate-300 mb-4 leading-relaxed line-clamp-2">
                                    {card.description}
                                </p>

                                {/* Footer */}
                                <div className="flex items-center justify-between mt-auto pt-2">
                                    {card.estimatedMinutes && (
                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                            <Clock className="w-3 h-3" />
                                            <span>{card.estimatedMinutes} min</span>
                                        </div>
                                    )}

                                    {card.actionLabel && (
                                        <button
                                            onClick={() => onCardAction?.(card)}
                                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                                            style={{
                                                backgroundColor: `${horizonConfig.color}20`,
                                                color: horizonConfig.color,
                                                border: `1px solid ${horizonConfig.color}40`,
                                            }}
                                        >
                                            {card.actionLabel}
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Skill Decay Badge */}
                                {card.skillDecayRelated && (
                                    <div className="absolute top-4 right-4">
                                        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
            </div>

            {/* Deferred Cards Notice */}
            {deferredCards.length > 0 && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="p-2 rounded-lg bg-amber-500/10">
                        <Clock className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-slate-300">
                            <span className="font-semibold text-amber-400">
                                {deferredCards.length} items
                            </span>{' '}
                            deferred due to high cognitive load
                        </p>
                        <p className="text-xs text-slate-500">
                            These will appear when your schedule clears
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Daily3Engine;
