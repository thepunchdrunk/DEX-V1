import React, { useState } from 'react';
import {
    Gamepad2,
    AlertTriangle,
    Bug,
    Mail,
    Shield,
    Clock,
    Check,
    X,
    ChevronRight,
    Award,
    Lightbulb,
    RotateCcw,
    Zap,
    Target,
} from 'lucide-react';

interface SimulatorScenario {
    id: string;
    type: 'SAFETY_HAZARD' | 'FIND_THE_BUG' | 'EMAIL_DOJO' | 'DECISION_MATRIX' | 'STAKEHOLDER_MANAGE';
    title: string;
    description: string;
    timeLimit: number; // seconds
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    content: SimulatorContent;
    skillsValidated: string[];
}

interface SimulatorContent {
    scenario: string;
    options?: SimulatorOption[];
    codeSnippet?: string;
    emailContent?: string;
    correctAnswers?: string[];
}

interface SimulatorOption {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
}

interface EnhancedSimulatorProps {
    className?: string;
}

// Mock scenarios
const MOCK_SCENARIOS: SimulatorScenario[] = [
    {
        id: 'sim-1',
        type: 'SAFETY_HAZARD',
        title: 'Safety Inspection',
        description: 'Identify the safety hazards in this manufacturing floor image',
        timeLimit: 60,
        difficulty: 'MEDIUM',
        content: {
            scenario: 'You are reviewing a photo from the factory floor. Identify all safety violations.',
            options: [
                { id: 'a', text: 'Worker without hard hat near machinery', isCorrect: true, feedback: 'Correct! PPE is mandatory in this zone.' },
                { id: 'b', text: 'Fire extinguisher properly mounted', isCorrect: false, feedback: 'This is compliant, not a hazard.' },
                { id: 'c', text: 'Spill near electrical panel', isCorrect: true, feedback: 'Correct! Liquid near electrical equipment is a serious hazard.' },
                { id: 'd', text: 'Emergency exit clearly marked', isCorrect: false, feedback: 'This is compliant, not a hazard.' },
            ],
        },
        skillsValidated: ['Safety Awareness', 'Risk Assessment'],
    },
    {
        id: 'sim-2',
        type: 'FIND_THE_BUG',
        title: 'Bug Hunter',
        description: 'Find the bug in this code snippet that causes a memory leak',
        timeLimit: 90,
        difficulty: 'HARD',
        content: {
            scenario: 'This React component has a memory leak. Find and fix it.',
            codeSnippet: `useEffect(() => {
  const interval = setInterval(() => {
    fetchData().then(setData);
  }, 1000);
  // Bug: Missing cleanup!
}, []);`,
            options: [
                { id: 'a', text: 'Missing return statement with clearInterval', isCorrect: true, feedback: 'Correct! Without cleanup, the interval continues after unmount.' },
                { id: 'b', text: 'Should use useCallback for fetchData', isCorrect: false, feedback: 'While useCallback can help, it\'s not the memory leak cause here.' },
                { id: 'c', text: 'Dependency array should include fetchData', isCorrect: false, feedback: 'This might cause re-renders but isn\'t the memory leak.' },
                { id: 'd', text: 'setData should be in a try-catch', isCorrect: false, feedback: 'Error handling is good practice but doesn\'t fix the leak.' },
            ],
        },
        skillsValidated: ['React', 'Debugging', 'Performance'],
    },
    {
        id: 'sim-3',
        type: 'EMAIL_DOJO',
        title: 'Stakeholder Email',
        description: 'Draft a response to a frustrated stakeholder about project delays',
        timeLimit: 120,
        difficulty: 'MEDIUM',
        content: {
            scenario: 'A VP just sent an angry email about the project being 2 weeks late. Choose the best response approach.',
            emailContent: `From: VP of Operations
Subject: RE: Project Alpha - URGENT

This is unacceptable. We were promised delivery by Q4 and now I'm hearing it's delayed AGAIN. 
I need answers NOW about what's happening and who is responsible.`,
            options: [
                { id: 'a', text: 'Apologize profusely and promise immediate delivery', isCorrect: false, feedback: 'Over-promising will make things worse if you can\'t deliver.' },
                { id: 'b', text: 'Blame the delay on external factors and other teams', isCorrect: false, feedback: 'Deflecting blame damages trust and doesn\'t solve the problem.' },
                { id: 'c', text: 'Acknowledge concerns, provide context, and offer a recovery plan with realistic timeline', isCorrect: true, feedback: 'Perfect! Taking ownership while providing a path forward shows leadership.' },
                { id: 'd', text: 'Forward to your manager and let them handle it', isCorrect: false, feedback: 'Escalation without taking initiative shows lack of ownership.' },
            ],
        },
        skillsValidated: ['Communication', 'Stakeholder Management', 'Professional Writing'],
    },
];

const EnhancedSimulator: React.FC<EnhancedSimulatorProps> = ({ className = '' }) => {
    const [currentScenario, setCurrentScenario] = useState<SimulatorScenario | null>(null);
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [score, setScore] = useState<number | null>(null);

    const getTypeIcon = (type: SimulatorScenario['type']) => {
        switch (type) {
            case 'SAFETY_HAZARD': return Shield;
            case 'FIND_THE_BUG': return Bug;
            case 'EMAIL_DOJO': return Mail;
            case 'DECISION_MATRIX': return Target;
            case 'STAKEHOLDER_MANAGE': return Zap;
        }
    };

    const getTypeColor = (type: SimulatorScenario['type']) => {
        switch (type) {
            case 'SAFETY_HAZARD': return 'bg-[#D32F2F]';
            case 'FIND_THE_BUG': return 'bg-purple-600';
            case 'EMAIL_DOJO': return 'bg-blue-600';
            case 'DECISION_MATRIX': return 'bg-[#4CAF50]';
            case 'STAKEHOLDER_MANAGE': return 'bg-[#E65100]';
        }
    };

    const getDifficultyColor = (difficulty: SimulatorScenario['difficulty']) => {
        switch (difficulty) {
            case 'EASY': return 'text-[#4CAF50] bg-[#E8F5E9]';
            case 'MEDIUM': return 'text-[#E65100] bg-[#FFF3E0]';
            case 'HARD': return 'text-[#D32F2F] bg-[#FFEBEE]';
        }
    };

    const startSimulator = (scenario: SimulatorScenario) => {
        setCurrentScenario(scenario);
        setTimeLeft(scenario.timeLimit);
        setSelectedAnswers([]);
        setIsSubmitted(false);
        setScore(null);

        // Start timer
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const toggleAnswer = (answerId: string) => {
        if (isSubmitted) return;
        setSelectedAnswers((prev) =>
            prev.includes(answerId)
                ? prev.filter((a) => a !== answerId)
                : [...prev, answerId]
        );
    };

    const submitAnswers = () => {
        if (!currentScenario) return;
        setIsSubmitted(true);

        const correctAnswers = currentScenario.content.options?.filter((o) => o.isCorrect).map((o) => o.id) || [];
        const correctCount = selectedAnswers.filter((a) => correctAnswers.includes(a)).length;
        const incorrectCount = selectedAnswers.filter((a) => !correctAnswers.includes(a)).length;
        const totalCorrect = correctAnswers.length;

        const calculatedScore = Math.max(0, Math.round(((correctCount - incorrectCount) / totalCorrect) * 100));
        setScore(calculatedScore);
    };

    const resetSimulator = () => {
        setCurrentScenario(null);
        setSelectedAnswers([]);
        setIsSubmitted(false);
        setScore(null);
    };

    // Scenario Selection View
    if (!currentScenario) {
        return (
            <div className={`space-y-6 ${className}`}>
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E65100] flex items-center justify-center">
                        <Gamepad2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-black">Wednesday Simulator</h2>
                        <p className="text-sm text-[#616161]">Practice real-world scenarios to validate your skills</p>
                    </div>
                </div>

                {/* Scenario Cards */}
                <div className="grid gap-4">
                    {MOCK_SCENARIOS.map((scenario) => {
                        const IconComponent = getTypeIcon(scenario.type);
                        return (
                            <div
                                key={scenario.id}
                                className="p-5 rounded-2xl bg-white border border-[#E0E0E0] hover:border-[#E60000]/50 transition-all cursor-pointer group shadow-sm"
                                onClick={() => startSimulator(scenario)}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-xl ${getTypeColor(scenario.type)} flex items-center justify-center flex-shrink-0`}>
                                        <IconComponent className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-black group-hover:text-[#E60000] transition-colors">
                                                {scenario.title}
                                            </h3>
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${getDifficultyColor(scenario.difficulty)}`}>
                                                {scenario.difficulty}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[#616161] mb-3">{scenario.description}</p>
                                        <div className="flex items-center gap-4 text-xs text-[#9E9E9E]">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                {scenario.timeLimit}s
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Award className="w-3.5 h-3.5" />
                                                {scenario.skillsValidated.join(', ')}
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-[#9E9E9E] group-hover:text-[#E60000] transition-colors" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Stats */}
                <div className="p-4 rounded-2xl bg-[#FFF3E0] border border-[#FFE0B2]">
                    <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-[#E65100]" />
                        <div>
                            <p className="font-medium text-black">Complete simulators to validate skills</p>
                            <p className="text-sm text-[#616161]">Passing scores refresh your Skill Tree nodes</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Active Simulator View
    const IconComponent = getTypeIcon(currentScenario.type);

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${getTypeColor(currentScenario.type)} flex items-center justify-center`}>
                        <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-black">{currentScenario.title}</h2>
                        <p className="text-sm text-[#616161]">{currentScenario.description}</p>
                    </div>
                </div>

                {/* Timer */}
                <div className={`px-4 py-2 rounded-xl font-mono text-lg font-bold ${timeLeft <= 10 ? 'bg-[#FFEBEE] text-[#D32F2F] animate-pulse' : 'bg-[#FAFAFA] text-black border border-[#E0E0E0]'
                    }`}>
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
            </div>

            {/* Scenario Content */}
            <div className="p-5 rounded-2xl bg-white border border-[#E0E0E0] shadow-sm">
                <p className="text-black mb-4">{currentScenario.content.scenario}</p>

                {/* Code Snippet */}
                {currentScenario.content.codeSnippet && (
                    <pre className="p-4 rounded-xl bg-gray-900 border border-gray-700 text-sm text-green-400 font-mono overflow-x-auto mb-4">
                        {currentScenario.content.codeSnippet}
                    </pre>
                )}

                {/* Email Content */}
                {currentScenario.content.emailContent && (
                    <div className="p-4 rounded-xl bg-[#FAFAFA] border border-[#E0E0E0] mb-4">
                        <pre className="text-sm text-black whitespace-pre-wrap font-sans">
                            {currentScenario.content.emailContent}
                        </pre>
                    </div>
                )}
            </div>

            {/* Options */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-[#616161]">
                    {currentScenario.type === 'SAFETY_HAZARD' ? 'Select all hazards:' : 'Choose the best answer:'}
                </h3>
                {currentScenario.content.options?.map((option) => {
                    const isSelected = selectedAnswers.includes(option.id);
                    const showResult = isSubmitted;
                    const isCorrect = option.isCorrect;

                    return (
                        <button
                            key={option.id}
                            onClick={() => toggleAnswer(option.id)}
                            disabled={isSubmitted}
                            className={`w-full p-4 rounded-xl border text-left transition-all ${showResult
                                ? isCorrect
                                    ? 'bg-emerald-500/10 border-emerald-500/50'
                                    : isSelected
                                        ? 'bg-red-500/10 border-red-500/50'
                                        : 'bg-slate-800/50 border-slate-700/50'
                                : isSelected
                                    ? 'bg-amber-500/10 border-amber-500/50'
                                    : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${showResult
                                    ? isCorrect
                                        ? 'border-emerald-500 bg-emerald-500'
                                        : isSelected
                                            ? 'border-red-500 bg-red-500'
                                            : 'border-slate-600'
                                    : isSelected
                                        ? 'border-amber-500 bg-amber-500'
                                        : 'border-slate-600'
                                    }`}>
                                    {showResult && isCorrect && <Check className="w-4 h-4 text-white" />}
                                    {showResult && !isCorrect && isSelected && <X className="w-4 h-4 text-white" />}
                                </div>
                                <div className="flex-1">
                                    <p className={`${showResult && isCorrect ? 'text-emerald-400' : showResult && isSelected && !isCorrect ? 'text-red-400' : 'text-white'}`}>
                                        {option.text}
                                    </p>
                                    {showResult && (isSelected || isCorrect) && (
                                        <p className="text-sm text-slate-400 mt-1 flex items-start gap-1">
                                            <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                            {option.feedback}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                {!isSubmitted ? (
                    <button
                        onClick={submitAnswers}
                        disabled={selectedAnswers.length === 0}
                        className="flex-1 py-3 rounded-xl bg-[#E60000] hover:bg-[#D32F2F] disabled:bg-[#E0E0E0] disabled:text-[#9E9E9E] text-white font-bold transition-all"
                    >
                        Submit Answer
                    </button>
                ) : (
                    <>
                        <div className={`flex-1 py-3 rounded-xl text-center font-bold ${score !== null && score >= 70 ? 'bg-[#E8F5E9] text-[#4CAF50]' : 'bg-[#FFEBEE] text-[#D32F2F]'
                            }`}>
                            Score: {score}%
                            {score !== null && score >= 70 ? ' — Skills Validated!' : ' — Try Again'}
                        </div>
                        <button
                            onClick={resetSimulator}
                            className="px-4 py-3 rounded-xl bg-white text-[#616161] hover:text-black hover:bg-gray-50 transition-all flex items-center gap-2 border border-[#E0E0E0]"
                        >
                            <RotateCcw className="w-4 h-4" />
                            New Challenge
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default EnhancedSimulator;
