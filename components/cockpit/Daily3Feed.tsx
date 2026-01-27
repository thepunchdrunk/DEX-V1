import React, { useState, useMemo } from 'react';
import {
    Building2,
    Compass,
    Lightbulb,
    Gamepad2,
    ExternalLink,
    Flag,
    Check,
    TrendingUp,
    TrendingDown,
    Clock,
    HelpCircle,
    X,
    AlertTriangle,
    Calendar,
    Sparkles,
    ChevronRight,
} from 'lucide-react';
import { DailyCard, CardSlot, SimulatorChallenge, MicroSkillCard, ContextAnchorCard } from '../../types';
import { MOCK_SIMULATOR, MONDAY_CONTEXT_ANCHOR, FRIDAY_MICRO_SKILL } from '../../constants';
import { getWeekdayContext, generateCardExplainer } from '../../services/cardSelectionEngine';

interface Daily3FeedProps {
    cards: DailyCard[];
    isWednesday?: boolean;
    onCardAction: (card: DailyCard) => void;
    onCardFlag: (cardId: string, reason?: 'INCORRECT' | 'OUTDATED' | 'INAPPROPRIATE') => void;
    user?: { jobTitle: string; department: string };
}

const Daily3Feed: React.FC<Daily3FeedProps> = ({
    cards,
    isWednesday = false,
    onCardAction,
    onCardFlag,
    user = { jobTitle: 'Employee', department: 'General' },
}) => {
    const [completedCards, setCompletedCards] = useState<string[]>([]);
    const [showSimulator, setShowSimulator] = useState(false);
    const [expandedExplainer, setExpandedExplainer] = useState<string | null>(null);
    const [showFlagModal, setShowFlagModal] = useState<string | null>(null);

    // Determine day context
    const dayOfWeek = new Date().getDay();
    const weekdayContext = getWeekdayContext(dayOfWeek);

    // Get weekday-specific greeting
    const getGreeting = () => {
        switch (weekdayContext) {
            case 'MONDAY_PLANNING':
                return { title: 'Plan Your Week', subtitle: 'Focus on strategic priorities' };
            case 'WEDNESDAY_SIMULATOR':
                return { title: 'Simulator Wednesday', subtitle: 'Practice makes perfect' };
            case 'FRIDAY_REFLECTION':
                return { title: 'Reflect & Grow', subtitle: 'Celebrate your progress' };
            default:
                return { title: 'Your Daily 3', subtitle: 'Stay focused on what matters' };
        }
    };

    const greeting = getGreeting();

    // Adjust cards based on weekly rhythm
    const displayCards = useMemo(() => {
        let adjustedCards = [...cards];

        // Monday: Use planning-oriented Context Anchor
        if (weekdayContext === 'MONDAY_PLANNING' && adjustedCards.length > 0) {
            adjustedCards[0] = { ...MONDAY_CONTEXT_ANCHOR };
        }

        // Wednesday: Replace Card 3 with Simulator
        if (weekdayContext === 'WEDNESDAY_SIMULATOR' || isWednesday) {
            adjustedCards = [
                ...adjustedCards.slice(0, 2),
                {
                    id: 'simulator-card',
                    slot: 'SIMULATOR' as CardSlot,
                    title: MOCK_SIMULATOR.title,
                    description: MOCK_SIMULATOR.description,
                    source: 'Living OS',
                    sourceType: 'SYSTEM' as const,
                    timestamp: new Date().toISOString(),
                    priority: 'MEDIUM' as const,
                    actionLabel: 'Start Challenge',
                    read: false,
                    flagged: false,
                    explainer: 'Wednesday is Simulator Day! This challenge helps build applied judgment.',
                },
            ];
        }

        // Friday: Use reflection-oriented Micro-Skill
        if (weekdayContext === 'FRIDAY_REFLECTION' && adjustedCards.length >= 3) {
            adjustedCards[2] = { ...FRIDAY_MICRO_SKILL };
        }

        return adjustedCards;
    }, [cards, weekdayContext, isWednesday]);

    const getSlotIcon = (slot: CardSlot) => {
        switch (slot) {
            case 'CONTEXT_ANCHOR':
                return <Building2 className="w-5 h-5" />;
            case 'DOMAIN_EDGE':
                return <Compass className="w-5 h-5" />;
            case 'MICRO_SKILL':
                return <Lightbulb className="w-5 h-5" />;
            case 'SIMULATOR':
                return <Gamepad2 className="w-5 h-5" />;
        }
    };

    const getSlotColor = (slot: CardSlot) => {
        switch (slot) {
            case 'CONTEXT_ANCHOR':
                return {
                    bg: 'bg-gradient-to-br from-blue-500/20 to-blue-600/10',
                    border: 'border-blue-500/40 hover:border-blue-400/60',
                    text: 'text-blue-400',
                    glow: 'shadow-blue-500/10',
                    badge: 'bg-blue-500/30 text-blue-300',
                };
            case 'DOMAIN_EDGE':
                return {
                    bg: 'bg-gradient-to-br from-purple-500/20 to-purple-600/10',
                    border: 'border-purple-500/40 hover:border-purple-400/60',
                    text: 'text-purple-400',
                    glow: 'shadow-purple-500/10',
                    badge: 'bg-purple-500/30 text-purple-300',
                };
            case 'MICRO_SKILL':
                return {
                    bg: 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/10',
                    border: 'border-emerald-500/40 hover:border-emerald-400/60',
                    text: 'text-emerald-400',
                    glow: 'shadow-emerald-500/10',
                    badge: 'bg-emerald-500/30 text-emerald-300',
                };
            case 'SIMULATOR':
                return {
                    bg: 'bg-gradient-to-br from-amber-500/20 to-amber-600/10',
                    border: 'border-amber-500/40 hover:border-amber-400/60',
                    text: 'text-amber-400',
                    glow: 'shadow-amber-500/10',
                    badge: 'bg-amber-500/30 text-amber-300',
                };
        }
    };

    const getSlotLabel = (slot: CardSlot) => {
        switch (slot) {
            case 'CONTEXT_ANCHOR':
                return 'Context Anchor';
            case 'DOMAIN_EDGE':
                return 'Domain Edge';
            case 'MICRO_SKILL':
                return 'Micro-Skill';
            case 'SIMULATOR':
                return 'Simulator';
        }
    };

    const getSlotDescription = (slot: CardSlot) => {
        switch (slot) {
            case 'CONTEXT_ANCHOR':
                return 'Internal Awareness';
            case 'DOMAIN_EDGE':
                return 'External Signal';
            case 'MICRO_SKILL':
                return 'Behavioral Edge';
            case 'SIMULATOR':
                return 'Applied Practice';
        }
    };

    const handleMarkComplete = (cardId: string) => {
        setCompletedCards([...completedCards, cardId]);
    };

    const handleFlagSubmit = (cardId: string, reason: 'INCORRECT' | 'OUTDATED' | 'INAPPROPRIATE') => {
        onCardFlag(cardId, reason);
        setShowFlagModal(null);
    };

    // Generate explainer for a card
    const getExplainer = (card: DailyCard): string => {
        if (card.explainer) return card.explainer;
        return generateCardExplainer(card, {
            user: { ...user } as any,
            recentlySeenCardIds: [],
            dayOfWeek,
            currentWorkload: 'MEDIUM',
            recentKPIAlerts: 0,
            pendingDeadlines: 0,
        });
    };

    return (
        <div className="space-y-6">
            {/* Header with Weekly Context */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">{greeting.title}</h1>
                            <p className="text-slate-400 text-sm">{greeting.subtitle}</p>
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm mt-2">
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Refreshes at midnight</span>
                </div>
            </div>

            {/* Cards */}
            <div className="space-y-4">
                {displayCards.map((card, index) => {
                    const colors = getSlotColor(card.slot);
                    const isCompleted = completedCards.includes(card.id);
                    const isQuarantined = card.isQuarantined || (card.flagCount && card.flagCount >= 3);

                    if (isQuarantined) return null;

                    return (
                        <div
                            key={card.id}
                            className={`
                                relative backdrop-blur-md rounded-2xl border overflow-hidden transition-all duration-300
                                ${colors.bg} ${colors.border} ${colors.glow}
                                ${isCompleted ? 'opacity-50 scale-[0.98]' : 'hover:scale-[1.01] hover:shadow-xl'}
                            `}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Top accent line */}
                            <div className={`h-0.5 ${colors.text.replace('text-', 'bg-')} opacity-50`} />

                            <div className="p-5">
                                {/* Card Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl ${colors.badge} flex items-center justify-center`}>
                                            {getSlotIcon(card.slot)}
                                        </div>
                                        <div>
                                            <span className={`text-sm font-semibold ${colors.text}`}>
                                                {getSlotLabel(card.slot)}
                                            </span>
                                            <p className="text-xs text-slate-500">
                                                {getSlotDescription(card.slot)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-600 font-mono">
                                            {index + 1}/3
                                        </span>
                                        {/* Why this appeared button */}
                                        <button
                                            onClick={() => setExpandedExplainer(
                                                expandedExplainer === card.id ? null : card.id
                                            )}
                                            className={`
                                                p-1.5 rounded-lg transition-all
                                                ${expandedExplainer === card.id
                                                    ? `${colors.badge}`
                                                    : 'hover:bg-slate-700/50 text-slate-500 hover:text-slate-300'}
                                            `}
                                            title="Why this appeared"
                                        >
                                            <HelpCircle className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Explainer Panel */}
                                {expandedExplainer === card.id && (
                                    <div className="mb-4 p-3 rounded-xl bg-slate-900/50 border border-slate-700/50 animate-fadeIn">
                                        <div className="flex items-start gap-2">
                                            <HelpCircle className={`w-4 h-4 ${colors.text} flex-shrink-0 mt-0.5`} />
                                            <div>
                                                <p className="text-xs font-medium text-slate-300 mb-1">
                                                    Why this appeared
                                                </p>
                                                <p className="text-xs text-slate-400 leading-relaxed">
                                                    {getExplainer(card)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Content */}
                                <h3 className="text-lg font-semibold text-white mb-2 leading-tight">
                                    {card.title}
                                </h3>
                                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                                    {card.description}
                                </p>

                                {/* Metadata Row */}
                                <div className="flex items-center justify-between text-xs mb-4">
                                    <span className="text-slate-500 flex items-center gap-1">
                                        {card.source}
                                        {card.sourceType === 'EXTERNAL' && (
                                            <ExternalLink className="w-3 h-3" />
                                        )}
                                    </span>
                                    {/* KPI Change indicator for Context Anchor */}
                                    {card.slot === 'CONTEXT_ANCHOR' && 'kpiChange' in card && (
                                        <span className={`flex items-center gap-1 font-medium ${(card as ContextAnchorCard).kpiChange! >= 0
                                                ? 'text-emerald-400'
                                                : 'text-red-400'
                                            }`}>
                                            {(card as ContextAnchorCard).kpiChange! >= 0 ? (
                                                <TrendingUp className="w-3.5 h-3.5" />
                                            ) : (
                                                <TrendingDown className="w-3.5 h-3.5" />
                                            )}
                                            {Math.abs((card as ContextAnchorCard).kpiChange!)}%
                                        </span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    {!isCompleted && card.actionLabel && (
                                        <button
                                            onClick={() => {
                                                if (card.slot === 'SIMULATOR') {
                                                    setShowSimulator(true);
                                                } else {
                                                    onCardAction(card);
                                                }
                                            }}
                                            className={`
                                                flex-1 py-2.5 px-4 rounded-xl font-medium transition-all text-sm
                                                flex items-center justify-center gap-2
                                                ${colors.badge} hover:opacity-90
                                            `}
                                        >
                                            {card.actionLabel}
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    )}
                                    {!isCompleted && (
                                        <button
                                            onClick={() => handleMarkComplete(card.id)}
                                            className="p-2.5 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white transition-all"
                                            title="Mark as viewed"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowFlagModal(card.id)}
                                        className={`
                                            p-2.5 rounded-xl transition-all
                                            ${card.flagged
                                                ? 'bg-red-500/20 text-red-400'
                                                : 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white'}
                                        `}
                                        title="Report issue"
                                    >
                                        <Flag className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Completed overlay */}
                                {isCompleted && (
                                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs">
                                        <Check className="w-3.5 h-3.5" />
                                        Viewed
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Completion Status */}
            <div className="text-center py-4">
                {completedCards.length === displayCards.length ? (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
                        <Check className="w-4 h-4" />
                        All done! New cards arrive at midnight.
                    </div>
                ) : (
                    <div className="text-slate-500 text-sm">
                        {completedCards.length}/{displayCards.length} cards reviewed
                    </div>
                )}
            </div>

            {/* Flag Modal */}
            {showFlagModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-800 rounded-2xl border border-slate-700 max-w-sm w-full p-6 animate-fadeIn">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Report Issue</h3>
                            <button
                                onClick={() => setShowFlagModal(null)}
                                className="p-1 rounded-lg hover:bg-slate-700 text-slate-400"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-slate-400 text-sm mb-4">
                            Why is this card not helpful? Your feedback improves recommendations.
                        </p>
                        <div className="space-y-2">
                            {[
                                { value: 'INCORRECT', label: 'Incorrect information', icon: AlertTriangle },
                                { value: 'OUTDATED', label: 'Outdated content', icon: Clock },
                                { value: 'INAPPROPRIATE', label: 'Not relevant to my role', icon: Flag },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleFlagSubmit(showFlagModal, option.value as any)}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-sm"
                                >
                                    <option.icon className="w-4 h-4 text-slate-400" />
                                    {option.label}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-slate-500 mt-4 text-center">
                            3 reports will quarantine this content for review
                        </p>
                    </div>
                </div>
            )}

            {/* Simulator Modal */}
            {showSimulator && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-800 rounded-2xl border border-amber-500/30 max-w-2xl w-full max-h-[80vh] overflow-auto animate-fadeIn">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                                    <Gamepad2 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        {MOCK_SIMULATOR.title}
                                    </h2>
                                    <p className="text-sm text-slate-400">
                                        {MOCK_SIMULATOR.durationMinutes} minute challenge
                                    </p>
                                </div>
                            </div>

                            <p className="text-slate-300 mb-6">{MOCK_SIMULATOR.description}</p>

                            {/* Code Block for Find the Bug */}
                            {MOCK_SIMULATOR.type === 'FIND_THE_BUG' && (
                                <div className="bg-slate-900 rounded-xl p-4 mb-6 border border-slate-700">
                                    <pre className="text-sm text-slate-300 overflow-x-auto font-mono">
                                        <code>{(MOCK_SIMULATOR.content as any).code}</code>
                                    </pre>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowSimulator(false);
                                        handleMarkComplete('simulator-card');
                                    }}
                                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-semibold rounded-xl transition-all"
                                >
                                    Submit Answer
                                </button>
                                <button
                                    onClick={() => setShowSimulator(false)}
                                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold rounded-xl transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Daily3Feed;
