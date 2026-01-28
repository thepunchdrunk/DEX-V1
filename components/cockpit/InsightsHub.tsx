import React, { useState } from 'react';
import {
    Calendar,
    Users,
    Lightbulb,
    Gamepad2,
    Target,
    Shield,
    Map,
    ChevronRight,
} from 'lucide-react';
import { MeetingIntelligence, PeerPractice, EnhancedSimulator, DecisionAssist, FocusGuard, CareerHorizon } from './features';

type InsightsTab = 'MEETINGS' | 'PEERS' | 'SIMULATOR' | 'DECISIONS' | 'FOCUS' | 'CAREER';

interface InsightsHubProps {
    className?: string;
}

const InsightsHub: React.FC<InsightsHubProps> = ({ className = '' }) => {
    // State to track which "Active Tool" is open, if any
    const [activeTool, setActiveTool] = useState<InsightsTab | null>(null);

    // If a tool is open, show full view with back button
    if (activeTool) {
        return (
            <div className={`space-y-6 ${className}`}>
                <div className="flex items-center gap-3 mb-4">
                    <button
                        onClick={() => setActiveTool(null)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-[#616161] hover:text-black transition-colors flex items-center gap-2"
                    >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                        <span className="text-sm font-medium">Back to Radar</span>
                    </button>
                </div>

                <div className="bg-[#FAFAFA] rounded-2xl p-4 md:p-6 border border-[#E0E0E0] min-h-[600px] animate-fade-in-up">
                    {activeTool === 'MEETINGS' && <MeetingIntelligence />}
                    {activeTool === 'PEERS' && <PeerPractice />}
                    {activeTool === 'SIMULATOR' && <EnhancedSimulator />}
                    {activeTool === 'DECISIONS' && <DecisionAssist />}
                    {activeTool === 'FOCUS' && <FocusGuard />}
                    {activeTool === 'CAREER' && <CareerHorizon />}
                </div>
            </div>
        );
    }

    // Default: Radar & Toolkit Dashboard
    return (
        <div className={`space-y-8 ${className}`}>

            {/* 1. CONTEXT RADAR (Passive Analytics) */}
            <section className="animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-xl font-bold text-black">My Radar</h2>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#4CAF50] border border-[#4CAF50]/30">Live Signals</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <MeetingIntelligence viewMode="WIDGET" className="cursor-pointer" onClick={() => setActiveTool('MEETINGS')} />
                    <FocusGuard viewMode="WIDGET" className="cursor-pointer" onClick={() => setActiveTool('FOCUS')} />
                </div>
            </section>

            {/* 2. MY TOOLS (Active Tools) */}
            <section className="animate-fade-in delay-100">
                <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-xl font-bold text-black">My Tools</h2>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-200">On-Demand</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Tool Card: Simulator */}
                    <button
                        onClick={() => setActiveTool('SIMULATOR')}
                        className="group flex flex-col p-5 rounded-2xl bg-white border border-[#E0E0E0] hover:border-[#E60000]/50 hover:shadow-md text-left transition-all"
                    >
                        <div className="w-10 h-10 rounded-xl bg-[#E60000] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Gamepad2 className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-bold text-black mb-1">Simulator</h3>
                        <p className="text-xs text-[#616161] mb-4 flex-1">Practice high-stakes scenarios in a safe environment.</p>
                        <div className="flex items-center gap-2 text-xs font-mono text-[#E60000]">
                            <span>LAUNCH_SIM</span>
                            <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>

                    {/* Tool Card: Decision Assist */}
                    <button
                        onClick={() => setActiveTool('DECISIONS')}
                        className="group flex flex-col p-5 rounded-2xl bg-white border border-[#E0E0E0] hover:border-purple-300 hover:shadow-md text-left transition-all"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Target className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-bold text-black mb-1">Decision Forge</h3>
                        <p className="text-xs text-[#616161] mb-4 flex-1">Frameworks for making complex, high-impact choices.</p>
                        <div className="flex items-center gap-2 text-xs font-mono text-purple-600">
                            <span>OPEN_TOOL</span>
                            <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>

                    {/* Tool Card: Peer Practices */}
                    <button
                        onClick={() => setActiveTool('PEERS')}
                        className="group flex flex-col p-5 rounded-2xl bg-white border border-[#E0E0E0] hover:border-violet-300 hover:shadow-md text-left transition-all"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-bold text-black mb-1">Peer Practices</h3>
                        <p className="text-xs text-[#616161] mb-4 flex-1">Discover what high-performers are doing differently.</p>
                        <div className="flex items-center gap-2 text-xs font-mono text-violet-600">
                            <span>VIEW_DATA</span>
                            <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>

                    {/* Tool Card: Career Horizon */}
                    <button
                        onClick={() => setActiveTool('CAREER')}
                        className="group flex flex-col p-5 rounded-2xl bg-white border border-[#E0E0E0] hover:border-purple-300 hover:shadow-md text-left transition-all"
                    >
                        <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Map className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-bold text-black mb-1">Career Horizon</h3>
                        <p className="text-xs text-[#616161] mb-4 flex-1">Market trends & career pathing insights.</p>
                        <div className="flex items-center gap-2 text-xs font-mono text-purple-600">
                            <span>EXPLORE</span>
                            <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>

                </div>
            </section>
        </div>
    );
};

export default InsightsHub;
