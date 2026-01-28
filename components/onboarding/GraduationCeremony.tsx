import React, { useState, useEffect } from 'react';
import {
    Trophy,
    Sparkles,
    Check,
    Users,
    BookOpen,
    MessageCircle,
    Rocket,
    Star,
} from 'lucide-react';
import { UserProfile, GraduationStats } from '../../types';
import { THEME_COLORS } from '../../constants';

interface GraduationCeremonyProps {
    user: UserProfile;
    onGraduate: () => void;
}

const GraduationCeremony: React.FC<GraduationCeremonyProps> = ({
    user,
    onGraduate,
}) => {
    const [phase, setPhase] = useState<'REVEAL' | 'STATS' | 'TRANSITION'>('REVEAL');
    const [showConfetti, setShowConfetti] = useState(false);

    const stats: GraduationStats = {
        tasksCompleted: 15,
        totalTasks: 15,
        scenariosPlayed: 3,
        connectionsMode: 5,
        daysToComplete: 5,
    };

    useEffect(() => {
        // Trigger confetti on mount
        setShowConfetti(true);

        const timer = setTimeout(() => {
            setPhase('STATS');
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const handleGraduate = () => {
        setPhase('TRANSITION');
        setTimeout(onGraduate, 2000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
            {/* Confetti Effect (CSS-based) */}
            {showConfetti && (
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 rounded-full animate-confetti"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `-10%`,
                                backgroundColor: ['#FFD700', '#3B82F6', '#10B981', '#EC4899', '#8B5CF6'][
                                    Math.floor(Math.random() * 5)
                                ],
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${2 + Math.random() * 3}s`,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Background Glow */}
            <div
                className="absolute inset-0 transition-all duration-1000"
                style={{
                    background:
                        phase === 'TRANSITION'
                            ? `radial-gradient(circle at 50% 30%, ${THEME_COLORS.performance.primary}30, transparent 60%)`
                            : `radial-gradient(circle at 50% 30%, ${THEME_COLORS.onboarding.primary}30, transparent 60%)`,
                }}
            />

            {/* Content */}
            <div className="relative z-10 max-w-xl w-full text-center">
                {/* Reveal Phase */}
                {phase === 'REVEAL' && (
                    <div className="animate-scale-in">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-500/30">
                            <Trophy className="w-16 h-16 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-4">
                            Congratulations! 🎉
                        </h1>
                        <p className="text-xl text-slate-300">
                            You've completed your Onboarding Sprint
                        </p>
                    </div>
                )}

                {/* Stats Phase */}
                {phase === 'STATS' && (
                    <div className="animate-fade-in">
                        {/* Trophy */}
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/20">
                            <Trophy className="w-12 h-12 text-white" />
                        </div>

                        <h1 className="text-3xl font-bold text-white mb-2">
                            Sprint Complete!
                        </h1>
                        <p className="text-slate-400 mb-8">
                            You're ready for Performance Mode
                        </p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-4">
                                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mx-auto mb-2">
                                    <Check className="w-5 h-5 text-green-400" />
                                </div>
                                <p className="text-2xl font-bold text-white">{stats.tasksCompleted}</p>
                                <p className="text-xs text-slate-400">Tasks Completed</p>
                            </div>

                            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-4">
                                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mx-auto mb-2">
                                    <MessageCircle className="w-5 h-5 text-purple-400" />
                                </div>
                                <p className="text-2xl font-bold text-white">{stats.scenariosPlayed}</p>
                                <p className="text-xs text-slate-400">Scenarios Played</p>
                            </div>

                            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mx-auto mb-2">
                                    <Users className="w-5 h-5 text-blue-400" />
                                </div>
                                <p className="text-2xl font-bold text-white">{stats.connectionsMode}</p>
                                <p className="text-xs text-slate-400">Connections Made</p>
                            </div>

                            <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-4">
                                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center mx-auto mb-2">
                                    <Star className="w-5 h-5 text-amber-400" />
                                </div>
                                <p className="text-2xl font-bold text-white">{stats.daysToComplete}</p>
                                <p className="text-xs text-slate-400">Days to Complete</p>
                            </div>
                        </div>

                        {/* Unlock Message */}
                        <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-xl border border-amber-500/30 p-4 mb-6">
                            <div className="flex items-center justify-center gap-2 text-amber-400">
                                <Sparkles className="w-5 h-5" />
                                <span className="font-medium">Performance Mode Unlocked</span>
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <p className="text-sm text-slate-400 mt-1">
                                Your daily ritual begins tomorrow at 00:00
                            </p>
                        </div>

                        {/* CTA */}
                        <button
                            onClick={handleGraduate}
                            className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                        >
                            <Rocket className="w-5 h-5" />
                            Enter Performance Mode
                        </button>
                    </div>
                )}

                {/* Transition Phase */}
                {phase === 'TRANSITION' && (
                    <div className="animate-fade-in">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-6 animate-pulse">
                            <Rocket className="w-12 h-12 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Launching Performance Mode...
                        </h1>
                        <p className="text-slate-400">
                            Switching to your personalized dashboard
                        </p>
                    </div>
                )}
            </div>

            {/* CSS for confetti animation */}
            <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 3s ease-in-out forwards;
        }
        @keyframes scale-in {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out forwards;
        }
      `}</style>
        </div>
    );
};

export default GraduationCeremony;
