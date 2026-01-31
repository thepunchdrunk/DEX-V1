import React, { useState } from 'react';
import {
    Sparkles,
    Zap,
    TrendingUp,
    Rocket,
    Brain,
    Shield,
    Users,
    ChevronRight,
    Check,
    Network,
} from 'lucide-react';

interface OnboardingV2Props {
    onComplete: () => void;
    userName?: string;
}

interface OnboardingStep {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    features?: string[];
}

const OnboardingV2: React.FC<OnboardingV2Props> = ({
    onComplete,
    userName = 'there',
}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [animating, setAnimating] = useState(false);

    const steps: OnboardingStep[] = [
        {
            id: 0,
            title: `Welcome, ${userName}!`,
            subtitle: 'DEX v2',
            description:
                "I'm your Contextual Performance Engine — continuously reducing uncertainty and increasing clarity, capability, and momentum at work.",
            icon: <Sparkles className="w-10 h-10" />,
            color: '#3B82F6',
            features: [
                'Adaptive guidance embedded in daily work',
                'Context-aware recommendations',
                'Precision over volume',
            ],
        },
        {
            id: 1,
            title: 'Time Horizon Intelligence',
            subtitle: 'Three Layers of Guidance',
            description:
                'Every recommendation belongs to one of three time layers, balanced to avoid over-indexing on urgent at the cost of growth.',
            icon: <Zap className="w-10 h-10" />,
            color: '#3B82F6',
            features: [
                '🔵 Today — Remove friction, ensure compliance',
                '🟢 Quarter — Build skills for your evolving role',
                '🟣 Career — Prepare for your next chapter',
            ],
        },
        {
            id: 2,
            title: 'Your Digital Twin',
            subtitle: 'Employee Context Graph',
            description:
                "I maintain a dynamic map of your skills, tools, actions, and connections — your professional digital twin that evolves with you.",
            icon: <Network className="w-10 h-10" />,
            color: '#10B981',
            features: [
                'Skills with proficiency levels (1-5)',
                'Decay detection for unused skills',
                'Market demand alignment',
            ],
        },
        {
            id: 3,
            title: 'Cognitive Load Protection',
            subtitle: "I Know When You're Busy",
            description:
                "When you're in back-to-back meetings or handling a crisis, I dial back learning nudges and focus only on what's critical.",
            icon: <Brain className="w-10 h-10" />,
            color: '#F59E0B',
            features: [
                'Meeting density awareness',
                'Stress signal detection',
                'Smart deferral of non-urgent items',
            ],
        },
        {
            id: 4,
            title: 'Privacy First',
            subtitle: 'You Control Your Data',
            description:
                'Your learning struggles are private by default. You choose what to share with your manager — never the other way around.',
            icon: <Shield className="w-10 h-10" />,
            color: '#8B5CF6',
            features: [
                'Development data is yours',
                'Granular sharing controls',
                'Managers see trends, not struggles',
            ],
        },
        {
            id: 5,
            title: 'Human Escalation',
            subtitle: 'AI Knows Its Limits',
            description:
                "When I can't fully help, I'll connect you to the right person — from peers to mentors to managers to experts.",
            icon: <Users className="w-10 h-10" />,
            color: '#EC4899',
            features: [
                'Peer → Mentor → Manager → HR/SME',
                'Automatic escalation suggestions',
                "I never pretend to know what I don't",
            ],
        },
    ];

    const currentStepData = steps[currentStep];
    const isLastStep = currentStep === steps.length - 1;

    const handleNext = () => {
        if (animating) return;

        setAnimating(true);
        setCompletedSteps([...completedSteps, currentStep]);

        setTimeout(() => {
            if (isLastStep) {
                onComplete();
            } else {
                setCurrentStep(currentStep + 1);
            }
            setAnimating(false);
        }, 300);
    };

    const handleSkip = () => {
        onComplete();
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 overflow-hidden">
            {/* Background Gradient */}
            <div
                className="fixed inset-0 transition-all duration-700"
                style={{
                    background: `radial-gradient(circle at 50% 30%, ${currentStepData.color}15, transparent 60%)`,
                }}
            />

            {/* Content */}
            <div className="relative z-10 w-full max-w-lg">
                {/* Progress Bar */}
                <div className="flex items-center gap-2 mb-8">
                    {steps.map((step, index) => (
                        <div
                            key={step.id}
                            className="flex-1 h-1 rounded-full transition-all duration-300"
                            style={{
                                backgroundColor:
                                    index < currentStep
                                        ? currentStepData.color
                                        : index === currentStep
                                            ? `${currentStepData.color}80`
                                            : 'rgba(100, 116, 139, 0.3)',
                            }}
                        />
                    ))}
                </div>

                {/* Step Content */}
                <div
                    className={`transition-all duration-300 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                        }`}
                >
                    {/* Icon */}
                    <div
                        className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 mx-auto"
                        style={{
                            backgroundColor: `${currentStepData.color}20`,
                            color: currentStepData.color,
                            boxShadow: `0 0 40px ${currentStepData.color}30`,
                        }}
                    >
                        {currentStepData.icon}
                    </div>

                    {/* Subtitle */}
                    <p
                        className="text-sm font-bold uppercase tracking-widest text-center mb-2"
                        style={{ color: currentStepData.color }}
                    >
                        {currentStepData.subtitle}
                    </p>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-white text-center mb-4">
                        {currentStepData.title}
                    </h1>

                    {/* Description */}
                    <p className="text-slate-400 text-center text-lg leading-relaxed mb-8">
                        {currentStepData.description}
                    </p>

                    {/* Features */}
                    {currentStepData.features && (
                        <div className="space-y-3 mb-8">
                            {currentStepData.features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50"
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                    }}
                                >
                                    <Check
                                        className="w-4 h-4 flex-shrink-0"
                                        style={{ color: currentStepData.color }}
                                    />
                                    <span className="text-slate-300 text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSkip}
                        className="flex-1 py-3 text-slate-400 hover:text-white transition-colors text-sm"
                    >
                        Skip Tour
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={animating}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 disabled:opacity-50"
                        style={{
                            backgroundColor: currentStepData.color,
                            boxShadow: `0 4px 20px ${currentStepData.color}40`,
                        }}
                    >
                        {isLastStep ? (
                            <>
                                Get Started
                                <Sparkles className="w-4 h-4" />
                            </>
                        ) : (
                            <>
                                Continue
                                <ChevronRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>

                {/* Step Counter */}
                <p className="text-center text-slate-600 text-xs mt-6">
                    Step {currentStep + 1} of {steps.length}
                </p>
            </div>
        </div>
    );
};

export default OnboardingV2;
