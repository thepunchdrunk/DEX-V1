import React, { useMemo } from 'react';
import { Share2 } from 'lucide-react';
import { useTeam } from '../../../hooks/useTeam';

const MentorshipGrid: React.FC = () => {
    const { team } = useTeam();

    const networkData = useMemo(() => [
        { id: '1', from: 'Alex', to: 'Jamie', strength: 85, topic: 'Cloud Architecture' },
        { id: '2', from: 'Jamie', to: 'Sam', strength: 92, topic: 'React Performance' },
        { id: '3', from: 'Sam', to: 'Alex', strength: 64, topic: 'CI/CD Pipelines' },
        { id: '4', from: 'Alex', to: 'Casey', strength: 78, topic: 'System Design' },
        { id: '5', from: 'Casey', to: 'Jamie', strength: 88, topic: 'Typescript Patterns' },
    ], []);

    return (
        <div className="flex flex-col h-full bg-white border border-[#E4E4E7] rounded-[2rem] overflow-hidden shadow-sm min-h-[400px]">
            {/* Network Header */}
            <div className="p-6 border-b border-[#F4F4F5] bg-zinc-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E60000]/10 border border-[#E60000]/20 flex items-center justify-center">
                        <Share2 className="w-5 h-5 text-[#E60000]" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-[#18181b]">Network Matrix</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[#A1A1AA] font-bold font-mono">MODE: KNOWLEDGE FLOW</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-[#E60000] animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Matrix Body */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto scrollbar-hide">
                <div className="grid grid-cols-1 gap-4">
                    {networkData.map((node) => (
                        <div key={node.id} className="relative group p-4 rounded-2xl bg-white border border-[#E4E4E7] hover:border-[#E60000]/30 transition-all duration-300 hover:shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-zinc-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-[#52525B]">
                                            {node.from[0]}
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-[#E60000] border-2 border-white flex items-center justify-center text-[10px] font-black text-white">
                                            {node.to[0]}
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-[#E60000] uppercase tracking-tighter">Transmission</span>
                                        <span className="text-xs font-black text-[#18181b]">{node.topic}</span>
                                    </div>
                                </div>
                                <span className="text-xs font-black tabular-nums text-[#E60000] bg-[#E60000]/5 px-2 py-1 rounded-md border border-[#E60000]/10">
                                    {node.strength}%
                                </span>
                            </div>

                            {/* Density Bar */}
                            <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#E60000] transition-all duration-1000"
                                    style={{ width: `${node.strength}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Interaction Footer */}
            <div className="p-6 bg-zinc-50/50 border-t border-[#F4F4F5] flex items-center justify-center">
                <p className="text-[10px] font-black text-[#A1A1AA] tracking-[0.3em] uppercase font-mono">Visualizing Social Capital</p>
            </div>
        </div>
    );
};

export default MentorshipGrid;
