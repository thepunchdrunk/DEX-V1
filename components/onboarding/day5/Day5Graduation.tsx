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
        { day: 2, dayTitle: 'Company Culture', category: 'Culture', itemsCompleted: 5, itemsTotal: 5, incompleteItems: [] },
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

    const requestSignoff = () => {
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
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center mx-auto mb-4 border border-red-200">
                    <Trophy className="w-10 h-10 text-[#E60000]" />
                </div>
                <h2 className="text-2xl font-bold text-black mb-2">Your Onboarding Journey</h2>
                <p className="text-[#616161]">A quick overview of everything you've accomplished.</p>
            </div>

            {/* Completion Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                {completionStatuses.map((status) => (
                    <div
                        key={status.day}
                        className={`
                            bg-white rounded-xl border p-4 text-center shadow-sm
                            ${status.itemsCompleted === status.itemsTotal ? 'border-[#4CAF50]' : 'border-[#E0E0E0]'}
                        `}
                    >
                        <div className={`
                            w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center
                            ${status.itemsCompleted === status.itemsTotal ? 'bg-[#E8F5E9] text-[#4CAF50]' : 'bg-[#F5F5F5] text-[#9E9E9E]'}
                        `}>
                            {status.itemsCompleted === status.itemsTotal ? (
                                <Check className="w-5 h-5" />
                            ) : (
                                <span className="text-sm font-bold">{status.day}</span>
                            )}
                        </div>
                        <p className="text-sm font-medium text-black mb-1">Day {status.day}</p>
                        <p className="text-xs text-[#757575]">{status.dayTitle}</p>
                        <div className="mt-2 text-xs text-[#9E9E9E]">
                            {status.itemsCompleted}/{status.itemsTotal} complete
                        </div>
                    </div>
                ))}
            </div>

            {/* What's Next */}
            <div className="bg-[#FFF8E1] rounded-xl border border-[#FFECB3] p-6">
                <h3 className="font-semibold text-black mb-4 flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-[#FF6F00]" />
                    Final Steps to Graduate
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center border
                            ${managerSignoff.signedOff ? 'bg-[#4CAF50] border-[#4CAF50]' : 'bg-white border-[#BDBDBD]'}
                        `}>
                            {managerSignoff.signedOff ? <Check className="w-4 h-4 text-white" /> : <span className="text-[#757575] text-sm">1</span>}
                        </div>
                        <span className={managerSignoff.signedOff ? 'text-[#388E3C] font-medium' : 'text-black'}>
                            Manager Sign-off
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center border
                            ${feedback.submittedAt ? 'bg-[#4CAF50] border-[#4CAF50]' : 'bg-white border-[#BDBDBD]'}
                        `}>
                            {feedback.submittedAt ? <Check className="w-4 h-4 text-white" /> : <span className="text-[#757575] text-sm">2</span>}
                        </div>
                        <span className={feedback.submittedAt ? 'text-[#388E3C] font-medium' : 'text-black'}>
                            Submit Onboarding Feedback
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white border border-[#BDBDBD] flex items-center justify-center">
                            <span className="text-[#757575] text-sm">3</span>
                        </div>
                        <span className="text-black">Graduate & Transition to Daily Dashboard</span>
                    </div>
                </div>
            </div>

            <button
                onClick={() => setPhase('SIGNOFF')}
                className="w-full py-4 bg-[#E60000] hover:bg-[#C62828] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
                Begin Final Steps <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );

    const renderSignoffPhase = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-black flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#E60000]" />
                Manager Sign-off
            </h3>

            {/* Manager Message */}
            {managerSignoff.welcomeMessage && (
                <div className="bg-white rounded-xl border border-[#E0E0E0] p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-black flex items-center justify-center text-white font-bold">
                            {managerSignoff.managerName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <p className="text-sm text-[#757575] mb-1">Message from {managerSignoff.managerName}</p>
                            <p className="text-black">{managerSignoff.welcomeMessage}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Goals Overview */}
            <div className="bg-white rounded-xl border border-[#E0E0E0] p-6 shadow-sm">
                <h4 className="font-medium text-black mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#E60000]" />
                    First Week Goals
                </h4>
                <div className="space-y-3">
                    {managerSignoff.firstWeekGoals.map((goal) => (
                        <div key={goal.id} className="flex items-start gap-3 p-3 bg-[#FAFAFA] rounded-lg border border-[#F5F5F5]">
                            <div className="w-8 h-8 rounded-lg bg-white border border-[#E0E0E0] flex items-center justify-center flex-shrink-0 text-lg">
                                {goal.category === 'LEARNING' && '📚'}
                                {goal.category === 'DELIVERY' && '✅'}
                                {goal.category === 'RELATIONSHIP' && '🤝'}
                                {goal.category === 'PROCESS' && '⚙️'}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-black">{goal.title}</p>
                                <p className="text-xs text-[#616161]">{goal.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E0E0E0] p-6 shadow-sm">
                <h4 className="font-medium text-black mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#E60000]" />
                    First Month Goals
                </h4>
                <div className="space-y-3">
                    {managerSignoff.firstMonthGoals.map((goal) => (
                        <div key={goal.id} className="flex items-start gap-3 p-3 bg-[#FAFAFA] rounded-lg border border-[#F5F5F5]">
                            <div className="w-8 h-8 rounded-lg bg-white border border-[#E0E0E0] flex items-center justify-center flex-shrink-0 text-lg">
                                {goal.category === 'LEARNING' && '📚'}
                                {goal.category === 'DELIVERY' && '✅'}
                                {goal.category === 'RELATIONSHIP' && '🤝'}
                                {goal.category === 'PROCESS' && '⚙️'}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-black">{goal.title}</p>
                                <p className="text-xs text-[#616161]">{goal.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sign-off Status */}
            {!managerSignoff.signedOff ? (
                <div className="bg-[#FFF3E0] border border-[#FFB74D] rounded-xl p-6">
                    <div className="flex items-center gap-4">
                        {signoffRequested ? (
                            <>
                                <Clock className="w-8 h-8 text-[#FF9800] animate-pulse" />
                                <div>
                                    <p className="font-medium text-[#F57C00]">Awaiting Manager Sign-off</p>
                                    <p className="text-sm text-[#795548]">Notification sent to {managerSignoff.managerName}</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <AlertCircle className="w-8 h-8 text-[#FF9800]" />
                                <div className="flex-1">
                                    <p className="font-medium text-[#E65100]">Manager sign-off required</p>
                                    <p className="text-sm text-[#795548]">Your manager will confirm you're ready to proceed</p>
                                </div>
                                <button
                                    onClick={requestSignoff}
                                    className="px-4 py-2 bg-[#FF9800] hover:bg-[#F57C00] text-white font-medium rounded-lg transition-all flex items-center gap-2 shadow-sm"
                                >
                                    <Send className="w-4 h-4" /> Complete Onboarding
                                </button>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-[#E8F5E9] border border-[#66BB6A] rounded-xl p-6">
                    <div className="flex items-center gap-4">
                        <Check className="w-8 h-8 text-[#2E7D32]" />
                        <div>
                            <p className="font-medium text-[#2E7D32]">Signed Off!</p>
                            <p className="text-sm text-[#388E3C]">
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
                    w-full py-4 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm
                    ${managerSignoff.signedOff
                        ? 'bg-[#E60000] hover:bg-[#C62828] text-white'
                        : 'bg-[#F5F5F5] text-[#9E9E9E] cursor-not-allowed border border-[#E0E0E0]'}
                `}
            >
                Continue to Feedback <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );

    const renderFeedbackPhase = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-black flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-[#E60000]" />
                Onboarding Feedback
            </h3>
            <p className="text-[#616161]">
                Help us improve the experience for future new hires.
            </p>

            {/* Overall Satisfaction */}
            <div className="bg-white rounded-xl border border-[#E0E0E0] p-6 shadow-sm">
                <h4 className="font-medium text-black mb-4">How satisfied are you with your onboarding experience?</h4>
                <div className="flex items-center justify-center gap-4">
                    {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                            key={rating}
                            onClick={() => setFeedback(prev => ({ ...prev, overallSatisfaction: rating as 1 | 2 | 3 | 4 | 5 }))}
                            className={`
                                w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all border
                                ${feedback.overallSatisfaction === rating
                                    ? 'bg-red-50 border-red-200 scale-110 shadow-sm'
                                    : 'bg-white border-[#E0E0E0] hover:bg-[#F5F5F5]'}
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
            <div className="bg-white rounded-xl border border-[#E0E0E0] p-6 shadow-sm">
                <h4 className="font-medium text-black mb-4">How confident do you feel starting your role?</h4>
                <div className="flex items-center justify-center gap-4">
                    {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                            key={rating}
                            onClick={() => setFeedback(prev => ({ ...prev, confidenceLevel: rating as 1 | 2 | 3 | 4 | 5 }))}
                            className={`
                                w-12 h-12 rounded-xl flex items-center justify-center transition-all border
                                ${feedback.confidenceLevel === rating
                                    ? 'bg-red-50 border-red-200 scale-110 shadow-sm'
                                    : 'bg-white border-[#E0E0E0] hover:bg-[#F5F5F5]'}
                            `}
                        >
                            {rating === 1 && <Star className="w-6 h-6 text-[#9E9E9E]" />}
                            {rating === 2 && <Star className="w-6 h-6 text-[#757575]" />}
                            {rating === 3 && <Star className="w-6 h-6 text-[#E60000]" />}
                            {rating === 4 && <Star className="w-6 h-6 text-[#E60000] fill-[#E60000]" />}
                            {rating === 5 && <Sparkles className="w-6 h-6 text-[#E60000]" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Friction Points */}
            <div className="bg-white rounded-xl border border-[#E0E0E0] p-6 shadow-sm">
                <h4 className="font-medium text-black mb-4">Any friction points or challenges? (Optional)</h4>
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={frictionInput}
                        onChange={(e) => setFrictionInput(e.target.value)}
                        placeholder="e.g., System access took too long"
                        className="flex-1 px-4 py-2 bg-[#FAFAFA] border border-[#E0E0E0] rounded-lg text-black placeholder-[#9E9E9E] focus:outline-none focus:border-[#E60000] focus:ring-1 focus:ring-[#E60000]"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddFriction()}
                    />
                    <button
                        onClick={handleAddFriction}
                        className="px-4 py-2 bg-[#FAFAFA] border border-[#E0E0E0] hover:bg-[#F5F5F5] text-black rounded-lg transition-all"
                    >
                        Add
                    </button>
                </div>
                {feedback.frictionPoints && feedback.frictionPoints.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {feedback.frictionPoints.map((point, i) => (
                            <span key={i} className="px-3 py-1 bg-red-50 text-red-600 border border-red-100 text-sm rounded-full">
                                {point}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-xl border border-[#E0E0E0] p-6 shadow-sm">
                <h4 className="font-medium text-black mb-4">What worked well? (Optional)</h4>
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={highlightInput}
                        onChange={(e) => setHighlightInput(e.target.value)}
                        placeholder="e.g., The buddy system was really helpful"
                        className="flex-1 px-4 py-2 bg-[#FAFAFA] border border-[#E0E0E0] rounded-lg text-black placeholder-[#9E9E9E] focus:outline-none focus:border-[#E60000] focus:ring-1 focus:ring-[#E60000]"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddHighlight()}
                    />
                    <button
                        onClick={handleAddHighlight}
                        className="px-4 py-2 bg-[#FAFAFA] border border-[#E0E0E0] hover:bg-[#F5F5F5] text-black rounded-lg transition-all"
                    >
                        Add
                    </button>
                </div>
                {feedback.highlights && feedback.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {feedback.highlights.map((highlight, i) => (
                            <span key={i} className="px-3 py-1 bg-green-50 text-green-600 border border-green-100 text-sm rounded-full">
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
                    w-full py-4 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm
                    ${canSubmitFeedback
                        ? 'bg-[#E60000] hover:bg-[#C62828] text-white'
                        : 'bg-[#F5F5F5] text-[#9E9E9E] cursor-not-allowed border border-[#E0E0E0]'}
                `}
            >
                <Send className="w-5 h-5" /> Submit Feedback
            </button>
        </div>
    );

    const renderGraduationPhase = () => (
        <div className="text-center py-8 space-y-8">
            <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center mx-auto border border-red-200">
                    <Trophy className="w-16 h-16 text-[#E60000]" />
                </div>
                <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-[#E60000] flex items-center justify-center animate-bounce shadow-lg">
                    <PartyPopper className="w-6 h-6 text-white" />
                </div>
            </div>

            <div>
                <h2 className="text-3xl font-bold text-black mb-2">Congratulations, {user.name}!</h2>
                <p className="text-xl text-[#757575]">You've completed your onboarding journey.</p>
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
                        className="flex flex-col items-center p-4 bg-white border border-[#E0E0E0] rounded-xl shadow-sm"
                    >
                        <span className="text-3xl mb-2">{badge.icon}</span>
                        <span className="text-sm text-[#616161]">{badge.label}</span>
                    </div>
                ))}
            </div>

            {/* What's Next Teaser */}
            <div className="bg-[#FFF8E1] rounded-xl border border-[#FFECB3] p-6 max-w-lg mx-auto shadow-sm">
                <h3 className="font-semibold text-black mb-4 flex items-center justify-center gap-2">
                    <Rocket className="w-5 h-5 text-[#FF6F00]" />
                    Your Daily Dashboard Awaits
                </h3>
                <p className="text-[#616161] text-sm mb-4">
                    Starting tomorrow, you'll have a personalized daily experience with context cards,
                    smart nudges, and everything you need to thrive in your role.
                </p>
                <div className="flex items-center justify-center gap-4 text-sm">
                    <span className="px-3 py-1 bg-white border border-[#E0E0E0] rounded-full text-[#757575]">📊 Daily Cards</span>
                    <span className="px-3 py-1 bg-white border border-[#E0E0E0] rounded-full text-[#757575]">🔔 Smart Nudges</span>
                    <span className="px-3 py-1 bg-white border border-[#E0E0E0] rounded-full text-[#757575]">📈 Growth Tracking</span>
                </div>
            </div>

            <button
                onClick={() => setPhase('TRANSITION')}
                className="px-8 py-4 bg-[#E60000] hover:bg-[#C62828] text-white font-bold text-lg rounded-xl transition-all flex items-center justify-center gap-3 mx-auto shadow-md hover:shadow-lg"
            >
                <Sparkles className="w-6 h-6" />
                Enter Daily Dashboard
                <ChevronRight className="w-6 h-6" />
            </button>
        </div>
    );

    const renderTransitionPhase = () => (
        <div className="text-center py-16 space-y-8 bg-white rounded-xl">
            <div className="relative">
                <div
                    className="w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all duration-500 bg-red-50"
                >
                    <Sparkles className="w-12 h-12 text-[#E60000] animate-spin" />
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-black mb-2">
                    {themeTransitionProgress < 50 ? 'Transitioning...' : 'Welcome to your new experience!'}
                </h2>
                <p className="text-[#757575]">
                    {themeTransitionProgress < 50
                        ? 'Finalizing your profile setup...'
                        : 'Your daily dashboard is ready'}
                </p>
            </div>

            {/* Progress Bar */}
            <div className="max-w-sm mx-auto">
                <div className="h-2 bg-[#E0E0E0] rounded-full overflow-hidden">
                    <div
                        className="h-full transition-all duration-100 bg-[#E60000]"
                        style={{
                            width: `${themeTransitionProgress}%`,
                        }}
                    />
                </div>
                <p className="text-sm text-[#9E9E9E] mt-2">{themeTransitionProgress}%</p>
            </div>
        </div>
    );

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <p className="text-[#E60000] text-sm font-bold uppercase tracking-wider mb-2">
                    Day 5 of 5
                </p>
                <h1 className="text-3xl font-bold text-black mb-2">
                    Completion Day
                </h1>
                <p className="text-[#616161]">
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
                        { id: 'GRADUATION', label: 'Complete', icon: '🎓' },
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
                                        flex items-center gap-2 px-4 py-2 rounded-xl transition-all border
                                        ${isActive ? 'bg-red-50 border-red-200 text-[#E60000]' : ''}
                                        ${isPast ? 'bg-green-50 border-green-200 text-[#4CAF50]' : ''}
                                        ${!isActive && !isPast ? 'bg-white border-[#E0E0E0] text-[#9E9E9E]' : ''}
                                    `}
                                >
                                    {isPast ? <Check className="w-4 h-4" /> : <span>{p.icon}</span>}
                                    <span className="font-medium">{p.label}</span>
                                </div>
                                {i < 3 && <ChevronRight className="w-5 h-5 text-[#BDBDBD]" />}
                            </React.Fragment>
                        );
                    })}
                </div>
            )}

            {/* Phase Content */}
            <div className="bg-white rounded-2xl border border-[#E0E0E0] p-6 shadow-sm">
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
