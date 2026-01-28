import React, { useState } from 'react';
import {
    TrendingUp,
    Zap,
    Target,
    Activity,
    ShieldCheck,
    ArrowUpRight,
    Wifi,
    BarChart3,
    Briefcase
} from 'lucide-react';

interface AnalyticsDashboardProps {
    className?: string;
}

// Impact Data: Value-based metrics
const impactData = {
    velocity: {
        personal: 85, // User's learning/output rate
        market: 70,   // Rate of market change in their domain
        trend: 'accelerating',
        context: 'You are learning faster than your role requires.'
    },
    alignment: {
        strategic: 68, // % time on core goals
        maintenance: 32, // % time on email/admin
        target: 70,
        context: 'Good focus on strategic initiatives.'
    },
    trust: {
        score: 94, // Reliability score
        level: 'HIGH_AUTONOMY',
        context: 'Excellent delivery reliability. Remote autonomy approved.'
    }
};

const ImpactDynamics: React.FC<AnalyticsDashboardProps> = ({ className = '' }) => {

    return (
        <div className={`space-y-8 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E60000] flex items-center justify-center">
                        <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-black">Impact Dynamics</h2>
                        <p className="text-sm text-[#616161]">Measuring value, not just activity</p>
                    </div>
                </div>
            </div>

            {/* Main Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* 1. Market Velocity (Growth) */}
                <div className="bg-white rounded-2xl p-6 border border-[#E0E0E0] relative overflow-hidden group hover:border-[#E60000]/50 hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TrendingUp className="w-24 h-24 text-[#E60000]" />
                    </div>

                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 rounded-lg bg-[#FFEBEE] text-[#E60000]">
                            <Zap className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-black">Market Speed</h3>
                    </div>

                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-4xl font-bold text-black">{impactData.velocity.personal}</span>
                        <span className="text-sm text-[#616161] mb-1">/ {impactData.velocity.market} (Market)</span>
                    </div>

                    <div className="relative h-2 bg-[#E0E0E0] rounded-full mb-4 overflow-hidden">
                        <div className="absolute h-full bg-[#BDBDBD] w-[70%]" title="Market Rate" />
                        <div className="absolute h-full bg-[#E60000] w-[85%] opacity-80" title="Your Rate" />
                    </div>

                    <p className="text-xs text-[#616161] leading-relaxed">
                        {impactData.velocity.context}
                    </p>
                </div>

                {/* 2. Strategic Alignment (Focus) */}
                <div className="bg-white rounded-2xl p-6 border border-[#E0E0E0] relative overflow-hidden group hover:border-[#4CAF50]/50 hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Target className="w-24 h-24 text-[#4CAF50]" />
                    </div>

                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 rounded-lg bg-[#E8F5E9] text-[#4CAF50]">
                            <Target className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-black">Org Alignment</h3>
                    </div>

                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-4xl font-bold text-black">{impactData.alignment.strategic}%</span>
                        <span className="text-sm text-[#616161] mb-1">Strategic Work</span>
                    </div>

                    <div className="flex h-2 rounded-full overflow-hidden mb-4">
                        <div className="bg-[#4CAF50] h-full" style={{ width: `${impactData.alignment.strategic}%` }} title="Strategic" />
                        <div className="bg-[#E0E0E0] h-full" style={{ width: `${impactData.alignment.maintenance}%` }} title="Maintenance" />
                    </div>

                    <p className="text-xs text-[#616161] leading-relaxed">
                        {impactData.alignment.context}
                    </p>
                </div>

                {/* 3. Reliability Signal (Trust) */}
                <div className="bg-white rounded-2xl p-6 border border-[#E0E0E0] relative overflow-hidden group hover:border-blue-500/50 hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <ShieldCheck className="w-24 h-24 text-blue-500" />
                    </div>

                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                            <Wifi className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-black">Trust Signal</h3>
                    </div>

                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-4xl font-bold text-black">{impactData.trust.score}</span>
                        <span className="text-sm text-[#4CAF50] mb-1 font-bold">Strong</span>
                    </div>

                    <div className="flex gap-1 h-2 mb-4">
                        {[1, 2, 3, 4, 5].map((bar) => (
                            <div
                                key={bar}
                                className={`flex-1 rounded-full ${impactData.trust.score >= bar * 20
                                    ? 'bg-blue-500'
                                    : 'bg-[#E0E0E0]'
                                    }`}
                            />
                        ))}
                    </div>

                    <p className="text-xs text-[#616161] leading-relaxed">
                        {impactData.trust.context}
                    </p>
                </div>
            </div>

            {/* Deep Dive Section */}
            <div className="bg-white rounded-2xl p-6 border border-[#E0E0E0] shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-black flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-[#616161]" />
                        Value Trends
                    </h3>
                    <select className="bg-[#FAFAFA] border border-[#E0E0E0] text-xs text-black rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#E60000]">
                        <option>Last Quarter</option>
                        <option>Year to Date</option>
                    </select>
                </div>

                <div className="h-48 flex items-end justify-between gap-2 px-4 border-b border-[#E0E0E0] pb-2 relative">
                    {/* Background Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-2">
                        <div className="border-t border-[#E0E0E0]/50 w-full h-0"></div>
                        <div className="border-t border-[#E0E0E0]/50 w-full h-0"></div>
                        <div className="border-t border-[#E0E0E0]/50 w-full h-0"></div>
                        <div className="border-t border-[#E0E0E0]/50 w-full h-0"></div>
                    </div>

                    {[65, 70, 68, 72, 75, 78, 82, 80, 85, 84, 88, 90].map((val, i) => (
                        <div key={i} className="flex-1 group relative flex flex-col justify-end h-full">
                            <div
                                className="w-full bg-[#E60000]/20 group-hover:bg-[#E60000]/40 transition-all rounded-t-sm relative"
                                style={{ height: `${val}%` }}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs px-2 py-1 rounded border border-[#E0E0E0] opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none shadow-sm">
                                    {val}%
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between text-xs text-[#9E9E9E] mt-2 px-1">
                    <span>Week 1</span>
                    <span>Week 12</span>
                </div>
            </div>

            <div className="flex items-center gap-2 p-4 rounded-xl bg-[#E8F5E9] border border-[#4CAF50]/20">
                <Briefcase className="w-5 h-5 text-[#4CAF50]" />
                <div className="flex-1">
                    <p className="text-sm text-black font-medium">Ready for promotion cycle</p>
                    <p className="text-xs text-[#616161]">Your Velocity (85) and Trust (94) scores qualify you for Senior placement consideration.</p>
                </div>
                <button className="px-3 py-1.5 bg-[#4CAF50] text-white text-xs font-bold rounded-lg hover:bg-[#43A047] transition-colors">
                    View Path
                </button>
            </div>
        </div>
    );
};

export default ImpactDynamics;
