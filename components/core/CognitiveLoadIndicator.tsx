import React from 'react';
import { Brain, AlertTriangle, Coffee, Zap, Clock } from 'lucide-react';
import { CognitiveLoadState, CognitiveLoadLevel } from '../../types';

interface CognitiveLoadIndicatorProps {
    loadState: CognitiveLoadState;
    compact?: boolean;
}

const CognitiveLoadIndicator: React.FC<CognitiveLoadIndicatorProps> = ({
    loadState,
    compact = false,
}) => {
    const getLoadConfig = (level: CognitiveLoadLevel) => {
        switch (level) {
            case 'LOW':
                return {
                    color: '#10B981',
                    bgColor: 'rgba(16, 185, 129, 0.15)',
                    borderColor: 'rgba(16, 185, 129, 0.3)',
                    label: 'Clear Mind',
                    description: 'Good conditions for deep work and learning',
                    icon: Coffee,
                };
            case 'MEDIUM':
                return {
                    color: '#F59E0B',
                    bgColor: 'rgba(245, 158, 11, 0.15)',
                    borderColor: 'rgba(245, 158, 11, 0.3)',
                    label: 'Moderate Load',
                    description: 'Some distractions present',
                    icon: Brain,
                };
            case 'HIGH':
                return {
                    color: '#F97316',
                    bgColor: 'rgba(249, 115, 22, 0.15)',
                    borderColor: 'rgba(249, 115, 22, 0.3)',
                    label: 'High Load',
                    description: 'Focus on essentials, learning deferred',
                    icon: Zap,
                };
            case 'CRITICAL':
                return {
                    color: '#EF4444',
                    bgColor: 'rgba(239, 68, 68, 0.15)',
                    borderColor: 'rgba(239, 68, 68, 0.3)',
                    label: 'Overloaded',
                    description: 'Critical items only, protect your focus',
                    icon: AlertTriangle,
                };
        }
    };

    const config = getLoadConfig(loadState.overallLoad);
    const Icon = config.icon;

    // Calculate load percentage for visual indicator
    const loadPercentage = {
        LOW: 25,
        MEDIUM: 50,
        HIGH: 75,
        CRITICAL: 95,
    }[loadState.overallLoad];

    if (compact) {
        return (
            <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                    backgroundColor: config.bgColor,
                    border: `1px solid ${config.borderColor}`,
                    color: config.color,
                }}
            >
                <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: config.color }}
                />
                <span>{config.label}</span>
            </div>
        );
    }

    return (
        <div
            className="p-4 rounded-xl border backdrop-blur-md"
            style={{
                backgroundColor: config.bgColor,
                borderColor: config.borderColor,
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5" style={{ color: config.color }} />
                    <span className="font-semibold text-white">{config.label}</span>
                </div>
                <span
                    className="text-xs font-mono px-2 py-0.5 rounded"
                    style={{
                        backgroundColor: `${config.color}20`,
                        color: config.color,
                    }}
                >
                    {loadPercentage}%
                </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden mb-3">
                <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                        width: `${loadPercentage}%`,
                        backgroundColor: config.color,
                        boxShadow: `0 0 10px ${config.color}60`,
                    }}
                />
            </div>

            {/* Description */}
            <p className="text-sm text-slate-400 mb-3">{config.description}</p>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>Meetings: {loadState.meetingDensity}%</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                    <Zap className="w-3 h-3" />
                    <span>Focus: {loadState.focusTimeAvailable}m</span>
                </div>
            </div>

            {/* Deferral Notice */}
            {loadState.deferralRecommended && (
                <div
                    className="mt-3 px-3 py-2 rounded-lg flex items-center gap-2 text-xs"
                    style={{
                        backgroundColor: `${config.color}15`,
                        border: `1px solid ${config.color}30`,
                    }}
                >
                    <AlertTriangle className="w-3 h-3" style={{ color: config.color }} />
                    <span style={{ color: config.color }}>
                        {loadState.deferredItemCount} items deferred to protect focus
                    </span>
                </div>
            )}
        </div>
    );
};

export default CognitiveLoadIndicator;
