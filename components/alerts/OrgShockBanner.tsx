import React, { useState } from 'react';
import {
    AlertTriangle,
    X,
    ChevronRight,
    Users,
    Building2,
    TrendingUp,
    Calendar,
    Bell,
} from 'lucide-react';
import { OrgShockEvent, OrgShockSeverity } from '../../types';

interface OrgShockBannerProps {
    event: OrgShockEvent;
    onDismiss?: () => void;
    onViewDetails?: () => void;
}

const OrgShockBanner: React.FC<OrgShockBannerProps> = ({
    event,
    onDismiss,
    onViewDetails,
}) => {
    const [expanded, setExpanded] = useState(false);

    const getSeverityConfig = (severity: OrgShockSeverity) => {
        switch (severity) {
            case 'LOW':
                return {
                    gradient: 'linear-gradient(90deg, rgba(59, 130, 246, 0.9), rgba(99, 102, 241, 0.9))',
                    textColor: 'white',
                    icon: Bell,
                };
            case 'MEDIUM':
                return {
                    gradient: 'linear-gradient(90deg, rgba(245, 158, 11, 0.9), rgba(249, 115, 22, 0.9))',
                    textColor: '#1F2937',
                    icon: TrendingUp,
                };
            case 'HIGH':
                return {
                    gradient: 'linear-gradient(90deg, rgba(249, 115, 22, 0.9), rgba(239, 68, 68, 0.9))',
                    textColor: 'white',
                    icon: AlertTriangle,
                };
            case 'CRITICAL':
                return {
                    gradient: 'linear-gradient(90deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9))',
                    textColor: 'white',
                    icon: AlertTriangle,
                };
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'REORG':
                return <Building2 className="w-5 h-5" />;
            case 'NEW_LEADERSHIP':
                return <Users className="w-5 h-5" />;
            case 'MERGER':
                return <TrendingUp className="w-5 h-5" />;
            default:
                return <AlertTriangle className="w-5 h-5" />;
        }
    };

    const config = getSeverityConfig(event.severity);
    const Icon = config.icon;

    return (
        <div
            className="fixed top-0 left-0 right-0 z-50 animate-slide-down"
            style={{
                background: config.gradient,
            }}
        >
            {/* Main Banner */}
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-white/10">
                            {getTypeIcon(event.type)}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span
                                    className="text-sm font-bold uppercase tracking-wider"
                                    style={{ color: config.textColor }}
                                >
                                    {event.type.replace('_', ' ')}
                                </span>
                                {event.reducedNoiseMode && (
                                    <span className="px-2 py-0.5 text-xs bg-white/20 rounded-full">
                                        Reduced Noise Mode Active
                                    </span>
                                )}
                            </div>
                            <p
                                className="font-medium text-sm mt-0.5"
                                style={{ color: config.textColor }}
                            >
                                {event.title}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition-all"
                            style={{ color: config.textColor }}
                        >
                            {expanded ? 'Hide' : 'View'} Guidance
                            <ChevronRight
                                className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''
                                    }`}
                            />
                        </button>
                        {onDismiss && (
                            <button
                                onClick={onDismiss}
                                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                            >
                                <X className="w-4 h-4" style={{ color: config.textColor }} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Expanded Guidance */}
                {expanded && (
                    <div className="pb-4 animate-fade-in">
                        <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                            <p className="text-sm mb-4" style={{ color: config.textColor }}>
                                {event.description}
                            </p>

                            {/* Affected Areas */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {event.affectedAreas.map((area, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-1 text-xs rounded-full bg-white/20"
                                        style={{ color: config.textColor }}
                                    >
                                        {area}
                                    </span>
                                ))}
                            </div>

                            {/* Guidance Items */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {event.guidanceItems.map((item) => (
                                    <button
                                        key={item.id}
                                        className="flex items-start gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 text-left transition-all group"
                                    >
                                        <div className="p-1.5 rounded-lg bg-white/10">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1">
                                            <p
                                                className="font-medium text-sm"
                                                style={{ color: config.textColor }}
                                            >
                                                {item.title}
                                            </p>
                                            <p
                                                className="text-xs mt-0.5 opacity-80"
                                                style={{ color: config.textColor }}
                                            >
                                                {item.description}
                                            </p>
                                        </div>
                                        <ChevronRight
                                            className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                                            style={{ color: config.textColor }}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrgShockBanner;
