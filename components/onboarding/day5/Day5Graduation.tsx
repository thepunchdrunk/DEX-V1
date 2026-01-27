import React, { useState, useEffect } from 'react';
import {
    Check,
    ChevronRight,
    Trophy,
    Star,
    Sparkles,
    Award,
    MessageSquare,
    Target,
    Users,
    Calendar,
    AlertCircle,
    FileText,
    Send,
    ThumbsUp,
    Clock,
    Rocket,
    PartyPopper,
    Heart,
} from 'lucide-react';
import {
    UserProfile,
    ManagerSignoff,
    Goal,
    OnboardingFeedback,
    CompletionStatus,
    OnboardingDay,
} from '../../../types';
import { MOCK_MANAGER_SIGNOFF } from '../../../constants';

interface Day5GraduationProps {
    user: UserProfile;
    onGraduate: () => void;
}

const Day5Graduation: React.FC<Day5GraduationProps> = ({ user, onGraduate }) => {
    const [phase, setPhase] = useState<'OVERVIEW' | 'SIGNOFF' | 'FEEDBACK' | 'GRADUATION' | 'TRANSITION'>('OVERVIEW');
    const [managerSignoff, setManagerSignoff] = useState<ManagerSignoff>(MOCK_MANAGER_SIGNOFF);
    const [feedback, setFeedback] = useState<Partial<OnboardingFeedback>>({
        overallSatisfaction: undefined,
        confidenceLevel: undefined,
        dayRatings: { 1: 5, 2: 5, 3: 5, 4: 5, 5: 5 },
        frictionPoints: [],
        highlights: [],
        suggestions: '',
    });
    const [frictionInput, setFrictionInput] = useState('');
    const [highlightInput, setHighlightInput] = useState('');
    const [signoffRequested, setSignoffRequested] = useState(false);
    const [themeTransitionProgress, setThemeTransitionProgress] = useState(0);

    // Completion status mock data
    const completionStatuses: CompletionStatus[] = [
        { day: 1, dayTitle: 'Life & Work Setup', category: 'Setup', itemsCompleted: 7, itemsTotal: 7, incompleteItems: [] },
        { day: 2, dayTitle: 'Cultural OS', category: 'Culture', itemsCompleted: 5, itemsTotal: 5, incompleteItems: [] },
        { day: 3, dayTitle: 'Tools & Workflow', category: 'Skills', itemsCompleted: 4, itemsTotal: 4, incompleteItems: [] },
        { day: 4, dayTitle: 'Network Mapping', category: 'Relationships', itemsCompleted: 5, itemsTotal: 5, incompleteItems: [] },
        {
            day: 5, dayTitle: 'Graduation', category: 'Completion', itemsCompleted: 0, itemsTotal: 3, incompleteItems: [
                { id: 'signoff', title: 'Manager Sign-off' },
                { id: 'feedback', title: 'Submit Feedback' },
                { id: 'graduate', title: 'Complete Graduation' },
            ]
        },
    ];

    // Theme transition animation
    useEffect(() => {
        if (phase === 'TRANSITION') {
            const interval = setInterval(() => {
                setThemeTransitionProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(onGraduate, 500);
                        return 100;
                    }
                    return prev + 2;
                });
            }, 50);
            return () => clearInterval(interval);
        }
    }, [phase, onGraduate]);

    const handleRequestSignoff = () => {
        setSignoffRequested(true);
        // Simulate manager approval after 2 seconds
        setTimeout(() => {
            setManagerSignoff(prev => ({
                ...prev,
                signedOff: true,
                signedOffAt: new Date().toISOString(),
            }));
        }, 2000);
    };

    const handleAddFriction = () => {
        if (frictionInput.trim()) {
            setFeedback(prev => ({
                ...prev,
                frictionPoints: [...(prev.frictionPoints || []), frictionInput.trim()]
            }));
            setFrictionInput('');
        }
    };

    const handleAddHighlight = () => {
        if (highlightInput.trim()) {
            setFeedback(prev => ({
                ...prev,
                highlights: [...(prev.highlights || []), highlightInput.trim()]
            }));
            setHighlightInput('');
        }
    };

    const handleSubmitFeedback = () => {
        setFeedback(prev => ({
            ...prev,
            submittedAt: new Date().toISOString(),
            requiresFollowUp: (prev.overallSatisfaction || 5) <= 2,
        }));
        setPhase('GRADUATION');
    };

    const canSubmitFeedback = feedback.overallSatisfaction && feedback.confidenceLevel;

    const renderOverviewPhase = () => (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Your Onboarding Journey</h2>
                <p className="text-slate-400">A quick overview of everything you've accomplished.</p>
            </div>

            {/* Completion Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                {completionStatuses.map((status) => (
                    <div
                        key={status.day}
                        className={`
                            bg-slate-800/50 rounded-xl border p-4 text-center
                            ${status.itemsCompleted === status.itemsTotal ? 'border-green-500/30' : 'border-slate-700/50'}
                        `}
                    >
                        <div className={`
                            w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center
                            ${status.itemsCompleted === status.itemsTotal ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}
                        `}>
                            {status.itemsCompleted === status.itemsTotal ? (
                                <Check className="w-5 h-5" />
                            ) : (
                                <span className="text-sm font-bold">{status.day}</span>
                            )}
                        </div>
                        <p className="text-sm font-medium text-white mb-1">Day {status.day}</p>
                        <p className="text-xs text-slate-400">{status.dayTitle}</p>
                        <div className="mt-2 text-xs text-slate-500">
                            {status.itemsCompleted}/{status.itemsTotal} complete
                        </div>
                    </div>
                ))}
            </div>

            {/* What's Next */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/30 p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-blue-400" />
                    Final Steps to Graduate
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center
                            ${managerSignoff.signedOff ? 'bg-green-500' : 'bg-slate-700'}
                        `}>
                            {managerSignoff.signedOff ? <Check className="w-4 h-4 text-white" /> : <span className="text-white text-sm">1</span>}
                        </div>
                        <span className={managerSignoff.signedOff ? 'text-green-400' : 'text-white'}>
                            Manager Sign-off
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center
                            ${feedback.submittedAt ? 'bg-green-500' : 'bg-slate-700'}
                        `}>
                            {feedback.submittedAt ? <Check className="w-4 h-4 text-white" /> : <span className="text-white text-sm">2</span>}
                        </div>
                        <span className={feedback.submittedAt ? 'text-green-400' : 'text-white'}>
                            Submit Onboarding Feedback
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                            <span className="text-white text-sm">3</span>
                        </div>
                        <span className="text-white">Graduate & Transition to Daily Cockpit</span>
                    </div>
                </div>
            </div>

            <button
                onClick={() => setPhase('SIGNOFF')}
                className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
                Begin Final Steps <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );

    const renderSignoffPhase = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-400" />
                Manager Sign-off
            </h3>

            {/* Manager Message */}
            {managerSignoff.welcomeMessage && (
                <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {managerSignoff.managerName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 mb-1">Message from {managerSignoff.managerName}</p>
                            <p className="text-white">{managerSignoff.welcomeMessage}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Goals Overview */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
                <h4 className="font-medium text-white mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-amber-400" />
                    First Week Goals
                </h4>
                <div className="space-y-3">
                    {managerSignoff.firstWeekGoals.map((goal) => (
                        <div key={goal.id} className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                                {goal.category === 'LEARNING' && '📚'}
                                {goal.category === 'DELIVERY' && '✅'}
                                {goal.category === 'RELATIONSHIP' && '🤝'}
                                {goal.category === 'PROCESS' && '⚙️'}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">{goal.title}</p>
                                <p className="text-xs text-slate-400">{goal.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
                <h4 className="font-medium text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    First Month Goals
                </h4>
                <div className="space-y-3">
                    {managerSignoff.firstMonthGoals.map((goal) => (
                        <div key={goal.id} className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                {goal.category === 'LEARNING' && '📚'}
                                {goal.category === 'DELIVERY' && '✅'}
                                {goal.category === 'RELATIONSHIP' && '🤝'}
                                {goal.category === 'PROCESS' && '⚙️'}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">{goal.title}</p>
                                <p className="text-xs text-slate-400">{goal.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sign-off Status */}
            {!managerSignoff.signedOff ? (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-4">
                        {signoffRequested ? (
                            <>
                                <Clock className="w-8 h-8 text-amber-400 animate-pulse" />
                                <div>
                                    <p className="font-medium text-amber-400">Awaiting Manager Sign-off</p>
                                    <p className="text-sm text-slate-400">Notification sent to {managerSignoff.managerName}</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <AlertCircle className="w-8 h-8 text-amber-400" />
                                <div className="flex-1">
                                    <p className="font-medium text-white">Manager sign-off required</p>
                                    <p className="text-sm text-slate-400">Your manager will confirm you're ready to proceed</p>
                                </div>
                                <button
                                    onClick={handleRequestSignoff}
                                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white font-medium rounded-lg transition-all flex items-center gap-2"
                                >
                                    <Send className="w-4 h-4" /> Request Sign-off
                                </button>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-4">
                        <Check className="w-8 h-8 text-green-400" />
                        <div>
                            <p className="font-medium text-green-400">Signed Off!</p>
                            <p className="text-sm text-slate-400">
                                {managerSignoff.managerName} signed off on {new Date(managerSignoff.signedOffAt!).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <button
                onClick={() => setPhase('FEEDBACK')}
                disabled={!managerSignoff.signedOff}
                className={`
                    w-full py-4 font-semibold rounded-xl transition-all flex items-center justify-center gap-2
                    ${managerSignoff.signedOff
                        ? 'bg-blue-500 hover:bg-blue-400 text-white'
                        : 'bg-slate-700 text-slate-400 cursor-not-allowed'}
                `}
            >
                Continue to Feedback <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );

    const renderFeedbackPhase = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-purple-400" />
                Onboarding Feedback
            </h3>
            <p className="text-slate-400">
                Help us improve the experience for future new hires.
            </p>

            {/* Overall Satisfaction */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
                <h4 className="font-medium text-white mb-4">How satisfied are you with your onboarding experience?</h4>
                <div className="flex items-center justify-center gap-4">
                    {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                            key={rating}
                            onClick={() => setFeedback(prev => ({ ...prev, overallSatisfaction: rating as 1 | 2 | 3 | 4 | 5 }))}
                            className={`
                                w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all
                                ${feedback.overallSatisfaction === rating
                                    ? 'bg-blue-500 scale-110'
                                    : 'bg-slate-700 hover:bg-slate-600'}
                            `}
                        >
                            {rating === 1 && '😔'}
                            {rating === 2 && '😕'}
                            {rating === 3 && '😐'}
                            {rating === 4 && '🙂'}
                            {rating === 5 && '😄'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Confidence Level */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
                <h4 className="font-medium text-white mb-4">How confident do you feel starting your role?</h4>
                <div className="flex items-center justify-center gap-4">
                    {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                            key={rating}
                            onClick={() => setFeedback(prev => ({ ...prev, confidenceLevel: rating as 1 | 2 | 3 | 4 | 5 }))}
                            className={`
                                w-12 h-12 rounded-xl flex items-center justify-center transition-all
                                ${feedback.confidenceLevel === rating
                                    ? 'bg-purple-500 scale-110'
                                    : 'bg-slate-700 hover:bg-slate-600'}
                            `}
                        >
                            {rating === 1 && <Star className="w-6 h-6 text-slate-400" />}
                            {rating === 2 && <Star className="w-6 h-6 text-slate-300" />}
                            {rating === 3 && <Star className="w-6 h-6 text-amber-400" />}
                            {rating === 4 && <Star className="w-6 h-6 text-amber-400 fill-amber-400" />}
                            {rating === 5 && <Sparkles className="w-6 h-6 text-amber-400" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Friction Points */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
                <h4 className="font-medium text-white mb-4">Any friction points or challenges? (Optional)</h4>
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={frictionInput}
                        onChange={(e) => setFrictionInput(e.target.value)}
                        placeholder="e.g., System access took too long"
                        className="flex-1 px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddFriction()}
                    />
                    <button
                        onClick={handleAddFriction}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
                    >
                        Add
                    </button>
                </div>
                {feedback.frictionPoints && feedback.frictionPoints.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {feedback.frictionPoints.map((point, i) => (
                            <span key={i} className="px-3 py-1 bg-red-500/20 text-red-400 text-sm rounded-full">
                                {point}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Highlights */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
                <h4 className="font-medium text-white mb-4">What worked well? (Optional)</h4>
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={highlightInput}
                        onChange={(e) => setHighlightInput(e.target.value)}
                        placeholder="e.g., The buddy system was really helpful"
                        className="flex-1 px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddHighlight()}
                    />
                    <button
                        onClick={handleAddHighlight}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
                    >
                        Add
                    </button>
                </div>
                {feedback.highlights && feedback.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {feedback.highlights.map((highlight, i) => (
                            <span key={i} className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                                {highlight}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <button
                onClick={handleSubmitFeedback}
                disabled={!canSubmitFeedback}
                className={`
                    w-full py-4 font-semibold rounded-xl transition-all flex items-center justify-center gap-2
                    ${canSubmitFeedback
                        ? 'bg-blue-500 hover:bg-blue-400 text-white'
                        : 'bg-slate-700 text-slate-400 cursor-not-allowed'}
                `}
            >
                <Send className="w-5 h-5" /> Submit Feedback
            </button>
        </div>
    );

    const renderGraduationPhase = () => (
        <div className="text-center py-8 space-y-8">
            <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 flex items-center justify-center mx-auto animate-pulse">
                    <Trophy className="w-16 h-16 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center animate-bounce">
                    <PartyPopper className="w-6 h-6 text-white" />
                </div>
            </div>

            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Congratulations, {user.name}!</h2>
                <p className="text-xl text-slate-400">You've completed your onboarding journey.</p>
            </div>

            {/* Badges Earned */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
                {[
                    { icon: '🚀', label: 'Quick Starter' },
                    { icon: '🎯', label: 'Goal Setter' },
                    { icon: '🤝', label: 'Connector' },
                    { icon: '📚', label: 'Fast Learner' },
                ].map((badge, i) => (
                    <div
                        key={i}
                        className="flex flex-col items-center p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
                    >
                        <span className="text-3xl mb-2">{badge.icon}</span>
                        <span className="text-sm text-slate-400">{badge.label}</span>
                    </div>
                ))}
            </div>

            {/* What's Next Teaser */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/30 p-6 max-w-lg mx-auto">
                <h3 className="font-semibold text-white mb-4 flex items-center justify-center gap-2">
                    <Rocket className="w-5 h-5 text-blue-400" />
                    Your Daily Cockpit Awaits
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                    Starting tomorrow, you'll have a personalized daily experience with context cards,
                    smart nudges, and everything you need to thrive in your role.
                </p>
                <div className="flex items-center justify-center gap-4 text-sm">
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-slate-300">📊 Daily Cards</span>
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-slate-300">🔔 Smart Nudges</span>
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-slate-300">📈 Growth Tracking</span>
                </div>
            </div>

            <button
                onClick={() => setPhase('TRANSITION')}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-lg rounded-xl transition-all flex items-center justify-center gap-3 mx-auto"
            >
                <Sparkles className="w-6 h-6" />
                Enter Your Daily Cockpit
                <ChevronRight className="w-6 h-6" />
            </button>
        </div>
    );

    const renderTransitionPhase = () => (
        <div className="text-center py-16 space-y-8" style={{
            background: `linear-gradient(135deg, 
                rgba(59, 130, 246, ${0.1 * (1 - themeTransitionProgress / 100)}) 0%, 
                rgba(245, 158, 11, ${0.1 * themeTransitionProgress / 100}) 100%)`
        }}>
            <div className="relative">
                <div
                    className="w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all duration-500"
                    style={{
                        background: `linear-gradient(135deg, 
                            rgba(59, 130, 246, ${1 - themeTransitionProgress / 100}) 0%, 
                            rgba(245, 158, 11, ${themeTransitionProgress / 100}) 100%)`
                    }}
                >
                    <Sparkles className="w-12 h-12 text-white animate-spin" />
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                    {themeTransitionProgress < 50 ? 'Transitioning...' : 'Welcome to your new experience!'}
                </h2>
                <p className="text-slate-400">
                    {themeTransitionProgress < 50
                        ? 'Switching from Onboarding Blue to Performance Gold'
                        : 'Your daily cockpit is ready'}
                </p>
            </div>

            {/* Progress Bar */}
            <div className="max-w-sm mx-auto">
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className="h-full transition-all duration-100"
                        style={{
                            width: `${themeTransitionProgress}%`,
                            background: `linear-gradient(90deg, #3B82F6, #F59E0B)`
                        }}
                    />
                </div>
                <p className="text-sm text-slate-500 mt-2">{themeTransitionProgress}%</p>
            </div>
        </div>
    );

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <p className="text-amber-400 text-sm font-bold uppercase tracking-wider mb-2">
                    Day 5 of 5
                </p>
                <h1 className="text-3xl font-bold text-white mb-2">
                    Graduation Day
                </h1>
                <p className="text-slate-400">
                    You've made it! Time to celebrate and transition to your daily experience.
                </p>
            </div>

            {/* Phase Navigation */}
            {phase !== 'TRANSITION' && (
                <div className="flex items-center gap-4 mb-8">
                    {[
                        { id: 'OVERVIEW', label: 'Overview', icon: '📊' },
                        { id: 'SIGNOFF', label: 'Sign-off', icon: '✍️' },
                        { id: 'FEEDBACK', label: 'Feedback', icon: '💬' },
                        { id: 'GRADUATION', label: 'Graduate', icon: '🎓' },
                    ].map((p, i) => {
                        const isActive = phase === p.id;
                        const isPast =
                            (p.id === 'OVERVIEW' && phase !== 'OVERVIEW') ||
                            (p.id === 'SIGNOFF' && (phase === 'FEEDBACK' || phase === 'GRADUATION')) ||
                            (p.id === 'FEEDBACK' && phase === 'GRADUATION');

                        return (
                            <React.Fragment key={p.id}>
                                <div
                                    className={`
                                        flex items-center gap-2 px-4 py-2 rounded-xl transition-all
                                        ${isActive ? 'bg-amber-500/20 border border-amber-500/50 text-white' : ''}
                                        ${isPast ? 'bg-green-500/20 border border-green-500/50 text-green-400' : ''}
                                        ${!isActive && !isPast ? 'bg-slate-800/50 text-slate-500' : ''}
                                    `}
                                >
                                    {isPast ? <Check className="w-4 h-4" /> : <span>{p.icon}</span>}
                                    <span className="font-medium">{p.label}</span>
                                </div>
                                {i < 3 && <ChevronRight className="w-5 h-5 text-slate-600" />}
                            </React.Fragment>
                        );
                    })}
                </div>
            )}

            {/* Phase Content */}
            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6">
                {phase === 'OVERVIEW' && renderOverviewPhase()}
                {phase === 'SIGNOFF' && renderSignoffPhase()}
                {phase === 'FEEDBACK' && renderFeedbackPhase()}
                {phase === 'GRADUATION' && renderGraduationPhase()}
                {phase === 'TRANSITION' && renderTransitionPhase()}
            </div>
        </div>
    );
};

export default Day5Graduation;
