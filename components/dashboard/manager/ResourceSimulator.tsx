import React, { useState } from 'react';
import {
    Play,
    RefreshCcw,
    Users,
    Briefcase,
    Zap,
    AlertTriangle,
    ChevronDown
} from 'lucide-react';

interface TeamMemberSim {
    id: string;
    name: string;
    load: number;
    project: string;
}

import { useTeam } from '../../../hooks/useTeam';

const ResourceSimulator: React.FC = () => {
    const { team, applyStaffingPlan } = useTeam();
    const [localAssignments, setLocalAssignments] = useState(() =>
        team.map(m => ({ id: m.id, name: m.name, load: m.currentLoad || 0, project: m.project || 'Unassigned' }))
    );

    const projects = ['Mobile Alpha', 'Core API', 'Legacy Maintenance', 'Growth Lab', 'Core Platform', 'Recruitment AI', 'Zone 4 Safety', 'Cloud Infrastructure', 'Customer Onboarding', 'CI/CD Pipeline', 'Q3 Product Roadmap', 'Security Audit'];

    const handleLoadChange = (id: string, newLoad: number) => {
        setLocalAssignments(prev => prev.map(a => a.id === id ? { ...a, load: Math.min(150, Math.max(0, newLoad)) } : a));
    };

    const handleProjectChange = (id: string, newProject: string) => {
        setLocalAssignments(prev => prev.map(a => a.id === id ? { ...a, project: newProject } : a));
    };

    const handleApply = () => {
        applyStaffingPlan(localAssignments.map(a => ({ id: a.id, project: a.project, load: a.load })));
    };

    const avgLoad = Math.round(localAssignments.reduce((acc, curr) => acc + curr.load, 0) / localAssignments.length);

    return (
        <div className="flex flex-col h-full bg-white border border-[#E4E4E7] rounded-[2rem] overflow-hidden shadow-sm">
            {/* Control Header */}
            <div className="p-6 border-b border-[#F4F4F5] bg-zinc-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E60000]/10 border border-[#E60000]/20 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-[#E60000]" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-[#18181b]">Tactical Calibrator</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[#A1A1AA] font-bold font-mono">MODE: SIMULATION</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-[#E60000] animate-pulse" />
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <span className="block text-[10px] text-[#A1A1AA] font-bold uppercase">System Load</span>
                    <span className={`text-xl font-black tabular-nums ${avgLoad > 90 ? 'text-[#D32F2F]' : 'text-[#E60000]'}`}>
                        {avgLoad}%
                    </span>
                </div>
            </div>

            {/* Calibration Sliders */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                {localAssignments.map((member) => (
                    <div key={member.id} className="space-y-3 group">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-[#E4E4E7] flex items-center justify-center text-[10px] font-black text-[#A1A1AA] group-hover:text-[#E60000] group-hover:border-[#E60000]/30 transition-all">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-[#18181b]">{member.name}</span>
                                    <select
                                        value={member.project}
                                        onChange={(e) => handleProjectChange(member.id, e.target.value)}
                                        className="bg-transparent text-[10px] text-[#52525B] border-none p-0 focus:ring-0 cursor-pointer hover:text-[#E60000] transition-colors"
                                    >
                                        {projects.map(p => <option key={p} value={p} className="bg-white">{p}</option>)}
                                    </select>
                                </div>
                            </div>
                            <span className={`text-xs font-black tabular-nums ${member.load > 100 ? 'text-[#D32F2F]' : member.load > 85 ? 'text-orange-600' : 'text-[#52525B]'}`}>
                                {member.load}%
                            </span>
                        </div>

                        <div className="relative h-1.5 w-full bg-zinc-100 rounded-full group-hover:bg-zinc-200 transition-colors overflow-hidden">
                            <div
                                className={`absolute h-full rounded-full transition-all duration-300 ${member.load > 100 ? 'bg-[#D32F2F]' : member.load > 85 ? 'bg-orange-500' : 'bg-[#E60000]'
                                    }`}
                                style={{ width: `${Math.min(member.load, 150) / 1.5}%` }}
                            />
                            <input
                                type="range"
                                min="0"
                                max="150"
                                value={member.load}
                                onChange={(e) => handleLoadChange(member.id, parseInt(e.target.value))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Impact Trigger */}
            <div className="p-6 bg-zinc-50/50 border-t border-[#F4F4F5]">
                <button
                    onClick={handleApply}
                    className="w-full group relative flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#E60000] hover:bg-[#C62828] text-white font-black text-xs tracking-widest uppercase transition-all duration-300 shadow-lg shadow-[#E60000]/10"
                >
                    <Zap className="w-4 h-4 fill-white group-hover:animate-bounce" />
                    Commit Staffing Vector
                </button>
            </div>
        </div>
    );
};

export default ResourceSimulator;
