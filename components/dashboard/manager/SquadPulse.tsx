import React, { useMemo } from 'react';
import {
    Heart,
    Shield,
    Target,
    TrendingUp,
    Info,
    AlertCircle
} from 'lucide-react';

interface PulseMetric {
    label: string;
    value: number;
    trend: number;
    status: 'OPTIMAL' | 'STABLE' | 'CONCERN';
    reason: string;
}

interface SquadPulseProps {
    className?: string;
}

import { useTeam } from '../../../hooks/useTeam';

const SquadPulse: React.FC<SquadPulseProps> = ({ className = '' }) => {
    const { team } = useTeam();

    const metrics: PulseMetric[] = useMemo(() => {
        const avgBurnout = team.reduce((acc, m) => acc + m.burnoutScore, 0) / team.length;

        return [
            {
                label: 'Team Energy',
                value: Math.round(100 - avgBurnout),
                trend: -2,
                status: (100 - avgBurnout) > 80 ? 'OPTIMAL' : 'STABLE',
                reason: avgBurnout > 30 ? 'Load clusters detected in infrastructure pods.' : 'Energy reserves are optimal.'
            },
            {
                label: 'Psychological Safety',
                value: 92,
                trend: +2,
                status: 'OPTIMAL',
                reason: 'High divergence in debates without interpersonal friction.'
            },
            {
                label: 'Strategic Alignment',
                value: 85,
                trend: +10,
                status: 'OPTIMAL',
                reason: 'Q3 roadmap clarity sessions have resolved prior ambiguity.'
            }
        ];
    }, [team]);

    return (
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
            {metrics.map((m) => (
                <div
                    key={m.label}
                    className="relative group p-6 rounded-[2rem] bg-white border border-[#E4E4E7] shadow-sm hover:border-[#E60000]/20 transition-all duration-500 overflow-hidden"
                >
                    {/* Background Glare */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#E60000]/3 blur-[100px] group-hover:bg-[#E60000]/8 transition-all duration-500" />

                    <div className="relative flex flex-col items-center text-center">
                        {/* Telemetry Ring (SVG) */}
                        <div className="relative w-32 h-32 mb-6">
                            <svg className="w-full h-full -rotate-90">
                                <circle
                                    cx="64" cy="64" r="58"
                                    fill="none"
                                    stroke="#F4F4F5"
                                    strokeWidth="10"
                                />
                                <circle
                                    cx="64" cy="64" r="58"
                                    fill="none"
                                    stroke={m.value > 80 ? '#E60000' : m.value > 60 ? '#18181b' : '#D50000'}
                                    strokeWidth="10"
                                    strokeDasharray={2 * Math.PI * 58}
                                    strokeDashoffset={2 * Math.PI * 58 * (1 - m.value / 100)}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-black text-[#18181b] tabular-nums tracking-tighter">{m.value}%</span>
                                <span className={`text-[10px] font-black font-mono ${m.trend >= 0 ? 'text-[#E60000]' : 'text-zinc-400'}`}>
                                    {m.trend >= 0 ? '+' : ''}{m.trend}%
                                </span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#A1A1AA]">{m.label}</h3>
                            <p className="text-[10px] text-[#52525B] px-4 leading-tight opacity-0 group-hover:opacity-100 transition-all duration-300">
                                {m.reason}
                            </p>
                        </div>
                    </div>

                    {/* Status Pip */}
                    <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${m.status === 'OPTIMAL' ? 'bg-[#E60000] shadow-[0_0_10px_rgba(230,0,0,0.3)]' :
                            m.status === 'STABLE' ? 'bg-zinc-400' : 'bg-red-500'
                        }`} />
                </div>
            ))}
        </div>
    );
};

export default SquadPulse;
