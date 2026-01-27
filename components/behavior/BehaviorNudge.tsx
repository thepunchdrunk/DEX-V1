import React, { useState } from 'react';
import {
    Sparkles,
    Check,
    Clock,
    MessageCircle,
    FileText,
    Shield,
    Zap,
    Users,
    Award,
    ChevronRight,
} from 'lucide-react';
import { BehaviorNudge as BehaviorNudgeType, BehaviorCategory } from '../../types';

interface BehaviorNudgeProps {
    nudge: BehaviorNudgeType;
    onComplete?: (nudge: BehaviorNudgeType) => void;
    onDismiss?: (nudge: BehaviorNudgeType) => void;
}

const BehaviorNudge: React.FC<BehaviorNudgeProps> = ({
    nudge,
    onComplete,
    onDismiss,
}) => {
    const [completed, setCompleted] = useState(false);
    const [showReinforcement, setShowReinforcement] = useState(false);

    const getCategoryConfig = (category: BehaviorCategory) => {
        switch (category) {
            case 'COMMUNICATION':
                return {
                    icon: MessageCircle,
                    color: '#3B82F6',
                    bgColor: 'rgba(59, 130, 246, 0.1)',
                };
            case 'DOCUMENTATION':
                return {
                    icon: FileText,
                    color: '#10B981',
                    bgColor: 'rgba(16, 185, 129, 0.1)',
                };
            case 'SAFETY':
                return {
                    icon: Shield,
                    color: '#EF4444',
                    bgColor: 'rgba(239, 68, 68, 0.1)',
                };
            case 'EFFICIENCY':
                return {
                    icon: Zap,
                    color: '#F59E0B',
                    bgColor: 'rgba(245, 158, 11, 0.1)',
                };
            case 'COLLABORATION':
                return {
                    icon: Users,
                    color: '#8B5CF6',
                    bgColor: 'rgba(139, 92, 246, 0.1)',
                };
            case 'QUALITY':
                return {
                    icon: Award,
                    color: '#EC4899',
                    bgColor: 'rgba(236, 72, 153, 0.1)',
                };
        }
    };

    const config = getCategoryConfig(nudge.category);
    const Icon = config.icon;

    const handleComplete = () => {
        setCompleted(true);
        setShowReinforcement(true);
        onComplete?.(nudge);

        // Hide reinforcement after 3 seconds
        setTimeout(() => {
            setShowReinforcement(false);
        }, 3000);
    };

    if (completed && !showReinforcement) {
        return null;
    }

    return (
        <div
            className={`
        relative p-4 rounded-xl border backdrop-blur-md transition-all duration-300
        ${completed ? 'scale-95 opacity-80' : 'hover:scale-[1.02]'}
      `}
            style={{
                backgroundColor: config.bgColor,
                borderColor: `${config.color}30`,
            }}
        >
            {/* Completion Animation */}
            {showReinforcement && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-green-500/20 backdrop-blur-sm animate-fade-in z-10">
                    <div className="text-center">
                        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-2">
                            <Check className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-green-400 font-medium text-sm">
                            {nudge.reinforcementMessage || 'Great work!'}
                        </p>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
                <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${config.color}20` }}
                >
                    <Icon className="w-4 h-4" style={{ color: config.color }} />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span
                            className="text-xs font-bold uppercase tracking-wider"
                            style={{ color: config.color }}
                        >
                            {nudge.category}
                        </span>
                        <Sparkles className="w-3 h-3" style={{ color: config.color }} />
                    </div>
                    <p className="font-medium text-white text-sm mt-1">{nudge.title}</p>
                </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-400 mb-3">{nudge.description}</p>

            {/* Micro Action */}
            <div
                className="p-3 rounded-lg mb-3"
                style={{ backgroundColor: `${config.color}10` }}
            >
                <p className="text-sm text-slate-300 flex items-center gap-2">
                    <ChevronRight className="w-4 h-4" style={{ color: config.color }} />
                    {nudge.microAction}
                </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {nudge.estimatedSeconds}s
                    </span>
                    {nudge.completedCount > 0 && (
                        <span className="flex items-center gap-1">
                            <Check className="w-3 h-3 text-green-400" />
                            {nudge.completedCount}x completed
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onDismiss?.(nudge)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                    >
                        Later
                    </button>
                    <button
                        onClick={handleComplete}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={{
                            backgroundColor: config.color,
                            color: 'white',
                        }}
                    >
                        <Check className="w-3 h-3" />
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BehaviorNudge;
