import React from 'react';
import {
    TrendingUp,
    TrendingDown,
    Minus,
    Sparkles,
    ChevronRight,
    Target,
} from 'lucide-react';

interface CareerHorizonProps {
    className?: string;
    data?: {
        title: string;
        description: string;
        nextRole: string;
        readiness: number;
    };
}

const CareerHorizon: React.FC<CareerHorizonProps> = ({ className = '', data }) => {
    // Fallback data
    const defaultData = {
        title: 'Senior Software Engineer',
        description: 'Transitioning from feature lead to multi-project architecture.',
        nextRole: 'Staff Engineer',
        readiness: 45
    };

    const horizon = data || defaultData;

    return (
        <div className={`${className}`}>
            {/* Main Content */}
            <div className="bg-white rounded-2xl border border-[#E0E0E0] overflow-hidden shadow-sm">
                {/* Header */}
                <div className="p-5 border-b border-[#E0E0E0]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center">
                            <Target className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-black">Career Horizon</h2>
                            <p className="text-sm text-[#616161]">Personal Roadmap</p>
                        </div>
                    </div>
                </div>

                {/* Role Focus */}
                <div className="p-5 border-b border-[#E0E0E0]">
                    <h3 className="text-lg font-bold text-black mb-1">{horizon.title}</h3>
                    <p className="text-sm text-[#616161] leading-relaxed">
                        {horizon.description}
                    </p>
                </div>

                {/* Readiness Gauge */}
                <div className="p-5 border-b border-[#E0E0E0]">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#616161]">Readiness for {horizon.nextRole}</span>
                        <span className="text-sm font-bold text-purple-600">{horizon.readiness}%</span>
                    </div>
                    <div className="h-3 bg-[#E0E0E0] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-purple-600 transition-all duration-1000"
                            style={{ width: `${horizon.readiness}%` }}
                        />
                    </div>
                </div>

                {/* Next Steps / Emerging Capabilities (Placeholder) */}
                <div className="p-5">
                    <h4 className="text-sm font-medium text-[#616161] mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        Key Focus Areas
                    </h4>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <div className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-purple-600" />
                            <div>
                                <p className="text-sm font-medium text-black">Cross-Functional Strategy</p>
                                <p className="text-xs text-[#616161]">Leading initiatives across multiple domains.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-purple-600" />
                            <div>
                                <p className="text-sm font-medium text-black">Technical Mentorship</p>
                                <p className="text-xs text-[#616161]">Uplifting the engineering standards across the org.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[#E0E0E0] bg-[#FAFAFA]">
                    <button className="w-full py-2.5 rounded-xl bg-[#E60000] hover:bg-[#D32F2F] text-white font-medium text-sm transition-all flex items-center justify-center gap-2">
                        Explore Learning Paths
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CareerHorizon;
