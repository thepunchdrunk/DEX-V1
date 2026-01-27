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
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Friday Reflection</h3>
                        <p className="text-xs text-slate-400">Celebrate your week's growth</p>
                    </div>
                </div>

                {/* Week Highlight */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-violet-400" />
                        <span className="font-medium text-white">Week Highlight</span>
                    </div>
                    <p className="text-slate-300">{reflectionData.weekHighlight}</p>
                </div>

                {/* Skills Grown */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                    <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Skills That Grew</h4>
                    <div className="flex flex-wrap gap-2">
                        {reflectionData.skillsGrown.map((skill) => (
                            <span key={skill} className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-sm flex items-center gap-1.5">
                                <TrendingUp className="w-3.5 h-3.5" />
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Streak */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold text-amber-400">{reflectionData.streakDays} 🔥</p>
                            <p className="text-xs text-slate-400">Day streak</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-300">{reflectionData.nextMilestone}</p>
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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-white">Micro-Skill</h3>
                    <p className="text-xs text-slate-400">Targeted learning based on your patterns</p>
                </div>
            </div>

            {/* Friction Detection */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5" />
                    Friction Detected
                </h4>
                <div className="space-y-2">
                    {frictionSources.map((friction, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-amber-500/5 border border-amber-500/20">
                            <span className="text-sm text-slate-300">{friction.description}</span>
                            <span className="text-amber-400 font-medium">{friction.count}x</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Micro Lesson */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h4 className="font-medium text-white">{microLesson.title}</h4>
                        <p className="text-xs text-slate-500">{microLesson.skill} • {microLesson.duration}</p>
                    </div>
                    <div className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-400 text-xs">
                        Suggested
                    </div>
                </div>

                {/* Peer Coaching Tone */}
                <div className="p-3 rounded-lg bg-slate-900/50 border-l-2 border-blue-500 mb-3">
                    <p className="text-sm text-slate-300 italic">💡 {microLesson.peerCoaching}</p>
                </div>

                {/* Professional Advantage */}
                <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 mb-3">
                    <p className="text-sm text-emerald-400 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        <span className="font-medium">Professional Advantage:</span>
                    </p>
                    <p className="text-sm text-slate-300 mt-1">{microLesson.professionalAdvantage}</p>
                </div>

                {/* Action Steps */}
                <div>
                    <h5 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Quick Actions</h5>
                    <ul className="space-y-1.5">
                        {microLesson.actionSteps.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs flex-shrink-0">
                                    {idx + 1}
                                </span>
                                {step}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Time Investment */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span>Estimated time: 10 minutes</span>
                </div>
                <button className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1">
                    Start Practice <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default MicroSkillCard;
