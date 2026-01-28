import React from 'react';
import {
    Lightbulb,
    RefreshCw,
    Clock,
    Target,
    ChevronRight,
    Sparkles,
    TrendingUp,
    Award,
} from 'lucide-react';

interface MicroSkillCardProps {
    className?: string;
    isReflectionMode?: boolean; // Friday mode
}

// Enhanced Micro-Skill with friction detection, peer coaching, professional advantage
const MicroSkillCard: React.FC<MicroSkillCardProps> = ({ className = '', isReflectionMode = false }) => {
    // Mock enhanced data
    const frictionSources = [
        { type: 'TASK_REOPENING', count: 3, description: 'PRs reopened after review this week' },
        { type: 'MISSED_FOLLOWUP', count: 2, description: 'Follow-ups that slipped past deadline' },
    ];

    const microLesson = {
        title: 'The 24-Hour PR Turnaround',
        skill: 'Code Review Efficiency',
        duration: '3 min read',
        peerCoaching: 'Top performers review PRs within 24 hours. This reduces context switching for authors and keeps momentum high.',
        professionalAdvantage: 'Engineers with fast review turnarounds get 40% more collaboration requests — visible to leadership.',
        actionSteps: [
            'Block 15 min morning slot for PR reviews',
            'Use "Request Changes" sparingly — prefer suggestions',
            'Leave one positive comment per review',
        ],
    };

    const reflectionData = {
        weekHighlight: 'You verified 3 skills and completed 2 simulator challenges!',
        skillsGrown: ['Test Automation', 'Communication'],
        streakDays: 7,
        nextMilestone: 'Complete 5 more challenges for "Skill Hunter" badge',
    };

    if (isReflectionMode) {
        return (
            <div className={`space-y-4 ${className}`}>
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E60000] flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-black">Friday Reflection</h3>
                        <p className="text-xs text-[#616161]">Celebrate your week's growth</p>
                    </div>
                </div>

                {/* Week Highlight */}
                <div className="p-4 rounded-xl bg-[#FFF3E0] border border-[#E65100]/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-[#E65100]" />
                        <span className="font-medium text-black">Week Highlight</span>
                    </div>
                    <p className="text-[#616161]">{reflectionData.weekHighlight}</p>
                </div>

                {/* Skills Grown */}
                <div className="bg-white rounded-xl p-4 border border-[#E0E0E0] shadow-sm">
                    <h4 className="text-xs font-medium text-[#9E9E9E] uppercase tracking-wide mb-3">Skills That Grew</h4>
                    <div className="flex flex-wrap gap-2">
                        {reflectionData.skillsGrown.map((skill) => (
                            <span key={skill} className="px-3 py-1.5 rounded-full bg-[#E8F5E9] text-[#4CAF50] text-sm flex items-center gap-1.5">
                                <TrendingUp className="w-3.5 h-3.5" />
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Streak */}
                <div className="bg-white rounded-xl p-4 border border-[#E0E0E0] shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold text-[#E65100]">{reflectionData.streakDays} 🔥</p>
                            <p className="text-xs text-[#616161]">Day streak</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-[#616161]">{reflectionData.nextMilestone}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E65100] flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-black">Productivity Tip</h3>
                    <p className="text-xs text-[#616161]">Targeted learning based on your patterns</p>
                </div>
            </div>

            {/* Friction Detection */}
            <div className="bg-white rounded-xl p-4 border border-[#E0E0E0] shadow-sm">
                <h4 className="text-xs font-medium text-[#9E9E9E] uppercase tracking-wide mb-3 flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5" />
                    Friction Detected
                </h4>
                <div className="space-y-2">
                    {frictionSources.map((friction, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#FFF3E0] border border-[#E65100]/20">
                            <span className="text-sm text-[#616161]">{friction.description}</span>
                            <span className="text-[#E65100] font-medium">{friction.count}x</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Micro Lesson */}
            <div className="bg-white rounded-xl p-4 border border-[#E0E0E0] shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h4 className="font-medium text-black">{microLesson.title}</h4>
                        <p className="text-xs text-[#9E9E9E]">{microLesson.skill} • {microLesson.duration}</p>
                    </div>
                    <div className="px-2 py-1 rounded-lg bg-[#FFF3E0] text-[#E65100] text-xs">
                        Suggested
                    </div>
                </div>

                {/* Peer Coaching Tone */}
                <div className="p-3 rounded-lg bg-blue-50 border-l-2 border-blue-500 mb-3">
                    <p className="text-sm text-[#616161] italic">💡 {microLesson.peerCoaching}</p>
                </div>

                {/* Professional Advantage */}
                <div className="p-3 rounded-lg bg-[#E8F5E9] border border-[#4CAF50]/20 mb-3">
                    <p className="text-sm text-[#4CAF50] flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        <span className="font-medium">Professional Advantage:</span>
                    </p>
                    <p className="text-sm text-[#616161] mt-1">{microLesson.professionalAdvantage}</p>
                </div>

                {/* Action Steps */}
                <div>
                    <h5 className="text-xs font-medium text-[#9E9E9E] uppercase tracking-wide mb-2">Quick Actions</h5>
                    <ul className="space-y-1.5">
                        {microLesson.actionSteps.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-[#616161]">
                                <span className="w-5 h-5 rounded-full bg-[#FFF3E0] text-[#E65100] flex items-center justify-center text-xs flex-shrink-0">
                                    {idx + 1}
                                </span>
                                {step}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Time Investment */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-[#E0E0E0]">
                <div className="flex items-center gap-2 text-sm text-[#616161]">
                    <Clock className="w-4 h-4" />
                    <span>Estimated time: 10 minutes</span>
                </div>
                <button className="text-sm text-[#E60000] hover:text-[#D32F2F] flex items-center gap-1 font-medium">
                    Start Practice <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default MicroSkillCard;
