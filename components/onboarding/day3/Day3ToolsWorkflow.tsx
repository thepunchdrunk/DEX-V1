import React, { useState } from 'react';
import {
    ChevronRight,
    Check,
    Lightbulb,
    HelpCircle,
    Play,
    Pause,
    RotateCcw,
    Sparkles,
    FileText,
    AlertCircle,
    CheckCircle2,
    Target,
    Zap,
    BookOpen,
    Send,
    Eye,
} from 'lucide-react';
import {
    UserProfile,
    WorkTool,
    FirstTaskSimulation,
    SimulatorMode,
    FirstContribution,
    ProductivityTip,
} from '../../../types';
import {
    WORK_TOOLS,
    FIRST_TASK_SIMULATION_QA,
    FIRST_CONTRIBUTIONS,
    PRODUCTIVITY_TIPS,
} from '../../../constants';

interface Day3ToolsWorkflowProps {
    user: UserProfile;
    onComplete: () => void;
}

const Day3ToolsWorkflow: React.FC<Day3ToolsWorkflowProps> = ({ user, onComplete }) => {
    const [phase, setPhase] = useState<'TOOLKIT' | 'SIMULATOR' | 'CONTRIBUTIONS' | 'DONE'>('TOOLKIT');

    // Filter tools based on user role
    const relevantTools = WORK_TOOLS.filter(t =>
        !t.roleCategories || (user.roleCategory && t.roleCategories.includes(user.roleCategory))
    );

    const [tools, setTools] = useState<WorkTool[]>(relevantTools);
    const [simulation, setSimulation] = useState<FirstTaskSimulation>(FIRST_TASK_SIMULATION_QA);
    const [contributions, setContributions] = useState<FirstContribution[]>(FIRST_CONTRIBUTIONS);
    const [tips] = useState<ProductivityTip[]>(PRODUCTIVITY_TIPS);
    const [activeToolId, setActiveToolId] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [artifactCreated, setArtifactCreated] = useState(false);

    // Toolkit completion
    const toolkitComplete = tools.filter(t => t.category === 'CORE').every(t => t.walkthroughCompleted);

    // Simulator completion
    const simulatorComplete = simulation.steps.every(s => s.completed);

    // Contributions - need at least 2
    const contributionsStarted = contributions.filter(c => c.status !== 'AVAILABLE').length >= 2;

    const handleToolWalkthrough = (toolId: string) => {
        setActiveToolId(toolId);
    };

    const handleCompleteToolWalkthrough = (toolId: string) => {
        setTools(prev => prev.map(t =>
            t.id === toolId ? { ...t, walkthroughCompleted: true } : t
        ));
        setActiveToolId(null);
    };

    const handleSimulatorStep = () => {
        if (currentStep < simulation.steps.length - 1) {
            setSimulation(prev => ({
                ...prev,
                steps: prev.steps.map((s, i) =>
                    i === currentStep ? { ...s, completed: true, validationResult: 'PASS' } : s
                )
            }));
            setCurrentStep(prev => prev + 1);
            setShowHint(false);
        } else {
            // Complete the simulation
            setSimulation(prev => ({
                ...prev,
                steps: prev.steps.map((s, i) =>
                    i === currentStep ? { ...s, completed: true, validationResult: 'PASS' } : s
                ),
                completedAt: new Date().toISOString(),
                artifactId: 'QA-SANDBOX-001',
                artifactPreview: 'Bug: Login button unresponsive on mobile',
            }));
            setArtifactCreated(true);
        }
    };

    const handleStartContribution = (id: string) => {
        setContributions(prev => prev.map(c =>
            c.id === id ? { ...c, status: 'IN_PROGRESS' } : c
        ));
    };

    const handleCompleteContribution = (id: string) => {
        setContributions(prev => prev.map(c =>
            c.id === id ? { ...c, status: 'PENDING_CONFIRM' } : c
        ));
    };

    const handleCompleteDay = () => {
        setPhase('DONE');
        setTimeout(onComplete, 1500);
    };

    const toggleSimulatorMode = () => {
        setSimulation(prev => ({
            ...prev,
            mode: prev.mode === 'GUIDED' ? 'CONFIDENCE' : 'GUIDED'
        }));
    };

    const renderToolkitPhase = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-white">Your Work Toolkit</h3>
                    <p className="text-slate-400 text-sm mt-1">
                        Learn the essential tools you'll use daily in your role.
                    </p>
                </div>
                {toolkitComplete && (
                    <button
                        onClick={() => setPhase('SIMULATOR')}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white font-medium rounded-lg flex items-center gap-2 transition-all"
                    >
                        Continue to Simulator <ChevronRight className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Tool Flow Diagram */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
                <h4 className="text-sm font-medium text-slate-400 mb-4">How your tools connect</h4>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                    {tools.filter(t => t.category === 'CORE').map((tool, index) => (
                        <React.Fragment key={tool.id}>
                            <div className={`
                                flex flex-col items-center p-4 rounded-xl border-2 transition-all cursor-pointer
                                ${tool.walkthroughCompleted
                                    ? 'border-green-500/50 bg-green-500/10'
                                    : 'border-slate-700 bg-slate-800 hover:border-blue-500/50'}
                            `}
                                onClick={() => handleToolWalkthrough(tool.id)}
                            >
                                <span className="text-3xl mb-2">{tool.icon}</span>
                                <span className="text-sm font-medium text-white">{tool.name}</span>
                                {tool.walkthroughCompleted && (
                                    <Check className="w-4 h-4 text-green-400 mt-1" />
                                )}
                            </div>
                            {index < tools.filter(t => t.category === 'CORE').length - 1 && (
                                <ChevronRight className="w-6 h-6 text-slate-600" />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Tool Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tools.map((tool) => (
                    <div
                        key={tool.id}
                        className={`
                            bg-slate-800/50 rounded-xl border transition-all
                            ${tool.walkthroughCompleted ? 'border-green-500/30' : 'border-slate-700/50'}
                            ${activeToolId === tool.id ? 'ring-2 ring-blue-500' : ''}
                        `}
                    >
                        <div className="p-4">
                            <div className="flex items-start gap-4">
                                <div className={`
                                    w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                                    ${tool.walkthroughCompleted ? 'bg-green-500/20' : 'bg-slate-700'}
                                `}>
                                    {tool.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-medium text-white">{tool.name}</h4>
                                        <span className={`
                                            text-xs px-2 py-0.5 rounded
                                            ${tool.category === 'CORE' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-400'}
                                        `}>
                                            {tool.category}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-400 mt-1">{tool.purpose}</p>
                                </div>
                                {tool.walkthroughCompleted ? (
                                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                                ) : (
                                    <button
                                        onClick={() => handleToolWalkthrough(tool.id)}
                                        className="px-3 py-1.5 bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium rounded-lg transition-all"
                                    >
                                        Learn
                                    </button>
                                )}
                            </div>

                            {/* Expanded Tool View */}
                            {activeToolId === tool.id && !tool.walkthroughCompleted && (
                                <div className="mt-4 pt-4 border-t border-slate-700">
                                    <h5 className="text-sm font-medium text-white mb-3">Quick Actions</h5>
                                    <div className="space-y-2">
                                        {tool.quickActions.map((action) => (
                                            <div
                                                key={action.id}
                                                className="flex items-center gap-3 p-2 bg-slate-900/50 rounded-lg"
                                            >
                                                <Zap className="w-4 h-4 text-amber-400" />
                                                <div className="flex-1">
                                                    <span className="text-sm text-white">{action.label}</span>
                                                    <span className="text-xs text-slate-500 ml-2">{action.description}</span>
                                                </div>
                                                {action.shortcut && (
                                                    <kbd className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-xs text-slate-400">
                                                        {action.shortcut}
                                                    </kbd>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => handleCompleteToolWalkthrough(tool.id)}
                                        className="mt-4 w-full py-2 bg-green-500 hover:bg-green-400 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        <Check className="w-4 h-4" /> Mark as Learned
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Productivity Tips */}
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Lightbulb className="w-6 h-6 text-amber-400" />
                    <h4 className="font-medium text-white">Insider Tips from Senior Engineers</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {tips.map((tip) => (
                        <div key={tip.id} className="bg-slate-900/50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">{tools.find(t => t.id === tip.toolId)?.icon}</span>
                                <span className="text-xs text-slate-500">{tip.toolName}</span>
                            </div>
                            <h5 className="text-sm font-medium text-white mb-1">{tip.title}</h5>
                            <p className="text-xs text-slate-400">{tip.description}</p>
                            {tip.shortcutKey && (
                                <kbd className="mt-2 inline-block px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-xs text-slate-400">
                                    {tip.shortcutKey}
                                </kbd>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderSimulatorPhase = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                        <Target className="w-6 h-6 text-blue-400" />
                        First Task Simulator
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">
                        Practice in a safe sandbox environment. Errors are learning moments!
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">Mode:</span>
                    <button
                        onClick={toggleSimulatorMode}
                        className={`
                            px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                            ${simulation.mode === 'GUIDED'
                                ? 'bg-blue-500 text-white'
                                : 'bg-slate-700 text-slate-300'}
                        `}
                    >
                        🎓 Guided
                    </button>
                    <button
                        onClick={toggleSimulatorMode}
                        className={`
                            px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                            ${simulation.mode === 'CONFIDENCE'
                                ? 'bg-purple-500 text-white'
                                : 'bg-slate-700 text-slate-300'}
                        `}
                    >
                        🚀 Confidence
                    </button>
                </div>
            </div>

            {/* Simulator Card */}
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
                {/* Header */}
                <div className="p-4 bg-slate-900/50 border-b border-slate-700 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-medium text-white">{simulation.title}</h4>
                        <p className="text-sm text-slate-400">{simulation.description}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-slate-400">Progress</div>
                        <div className="text-lg font-bold text-white">
                            {simulation.steps.filter(s => s.completed).length}/{simulation.steps.length}
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-slate-700">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${(simulation.steps.filter(s => s.completed).length / simulation.steps.length) * 100}%` }}
                    />
                </div>

                {/* Steps */}
                <div className="p-6">
                    {!artifactCreated ? (
                        <>
                            {/* Step List */}
                            <div className="space-y-3 mb-6">
                                {simulation.steps.map((step, index) => (
                                    <div
                                        key={step.id}
                                        className={`
                                            flex items-start gap-3 p-4 rounded-xl transition-all
                                            ${index === currentStep ? 'bg-blue-500/10 border border-blue-500/30' : ''}
                                            ${step.completed ? 'bg-green-500/10 border border-green-500/30' : ''}
                                            ${index > currentStep && !step.completed ? 'opacity-50' : ''}
                                        `}
                                    >
                                        <div className={`
                                            w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                                            ${step.completed ? 'bg-green-500 text-white' : ''}
                                            ${index === currentStep && !step.completed ? 'bg-blue-500 text-white' : ''}
                                            ${index > currentStep && !step.completed ? 'bg-slate-700 text-slate-400' : ''}
                                        `}>
                                            {step.completed ? (
                                                <Check className="w-4 h-4" />
                                            ) : (
                                                <span className="text-sm font-bold">{index + 1}</span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm ${index === currentStep ? 'text-white font-medium' : 'text-slate-400'}`}>
                                                {step.instruction}
                                            </p>
                                            {index === currentStep && simulation.mode === 'GUIDED' && step.hint && showHint && (
                                                <div className="mt-2 p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-2">
                                                    <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                                    <p className="text-xs text-amber-300">{step.hint}</p>
                                                </div>
                                            )}
                                            {step.errorRecoveryGuidance && index === currentStep && (
                                                <p className="mt-1 text-xs text-slate-500">
                                                    💡 {step.errorRecoveryGuidance}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3">
                                {simulation.mode === 'GUIDED' && simulation.steps[currentStep]?.hint && !showHint && (
                                    <button
                                        onClick={() => setShowHint(true)}
                                        className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-medium rounded-lg flex items-center gap-2 transition-all"
                                    >
                                        <HelpCircle className="w-4 h-4" /> Show Hint
                                    </button>
                                )}
                                <button
                                    onClick={handleSimulatorStep}
                                    className="flex-1 py-3 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    {currentStep < simulation.steps.length - 1 ? (
                                        <>Complete Step {currentStep + 1} <ChevronRight className="w-5 h-5" /></>
                                    ) : (
                                        <>Finish & Create Artifact <Sparkles className="w-5 h-5" /></>
                                    )}
                                </button>
                            </div>
                        </>
                    ) : (
                        /* Artifact Created */
                        <div className="text-center py-8">
                            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-10 h-10 text-green-400" />
                            </div>
                            <h4 className="text-xl font-bold text-white mb-2">Artifact Created!</h4>
                            <p className="text-slate-400 mb-6">
                                Your first task has been logged in the sandbox environment.
                            </p>

                            {/* Artifact Preview */}
                            <div className="bg-slate-900/50 rounded-xl p-4 mb-6 text-left">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="w-5 h-5 text-blue-400" />
                                    <span className="text-sm font-medium text-white">
                                        {simulation.artifactType}: {simulation.artifactId}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-400">{simulation.artifactPreview}</p>
                                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                                    <Eye className="w-4 h-4" />
                                    <span>Manager will receive notification to review</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setPhase('CONTRIBUTIONS')}
                                className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 mx-auto"
                            >
                                Continue to First Contributions <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderContributionsPhase = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-purple-400" />
                    First Contribution Path
                </h3>
                <p className="text-slate-400 text-sm mt-1">
                    Small wins that help you feel useful and build confidence early.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contributions.map((contribution) => (
                    <div
                        key={contribution.id}
                        className={`
                            bg-slate-800/50 rounded-xl border p-4 transition-all
                            ${contribution.status === 'COMPLETED' ? 'border-green-500/30' : 'border-slate-700/50'}
                        `}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`
                                w-10 h-10 rounded-lg flex items-center justify-center
                                ${contribution.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' : ''}
                                ${contribution.status === 'PENDING_CONFIRM' ? 'bg-amber-500/20 text-amber-400' : ''}
                                ${contribution.status === 'IN_PROGRESS' ? 'bg-blue-500/20 text-blue-400' : ''}
                                ${contribution.status === 'AVAILABLE' ? 'bg-slate-700 text-slate-400' : ''}
                            `}>
                                {contribution.type === 'STANDUP' && '🎤'}
                                {contribution.type === 'DOCUMENT_UPDATE' && '📝'}
                                {contribution.type === 'SHADOW' && '👀'}
                                {contribution.type === 'TASK' && '✅'}
                                {contribution.type === 'CODE_REVIEW' && '🔍'}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-white">{contribution.title}</h4>
                                <p className="text-sm text-slate-400">{contribution.description}</p>

                                {/* Status Badge */}
                                <div className="mt-2">
                                    {contribution.status === 'AVAILABLE' && (
                                        <button
                                            onClick={() => handleStartContribution(contribution.id)}
                                            className="px-3 py-1.5 bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium rounded-lg transition-all"
                                        >
                                            Start
                                        </button>
                                    )}
                                    {contribution.status === 'IN_PROGRESS' && (
                                        <button
                                            onClick={() => handleCompleteContribution(contribution.id)}
                                            className="px-3 py-1.5 bg-green-500 hover:bg-green-400 text-white text-sm font-medium rounded-lg transition-all"
                                        >
                                            Mark Complete
                                        </button>
                                    )}
                                    {contribution.status === 'PENDING_CONFIRM' && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500/20 text-amber-400 text-sm rounded-lg">
                                            <AlertCircle className="w-4 h-4" /> Awaiting Manager Confirmation
                                        </span>
                                    )}
                                    {contribution.status === 'COMPLETED' && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500/20 text-green-400 text-sm rounded-lg">
                                            <Check className="w-4 h-4" /> Confirmed
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Complete Day Button */}
            <button
                onClick={handleCompleteDay}
                disabled={!contributionsStarted}
                className={`
                    w-full py-4 font-semibold rounded-xl transition-all flex items-center justify-center gap-2
                    ${contributionsStarted
                        ? 'bg-blue-500 hover:bg-blue-400 text-white'
                        : 'bg-slate-700 text-slate-400 cursor-not-allowed'}
                `}
            >
                {contributionsStarted ? (
                    <>
                        Complete Day 3 — Proceed to Network Mapping
                        <ChevronRight className="w-5 h-5" />
                    </>
                ) : (
                    <>Start at least 2 contributions to continue</>
                )}
            </button>
        </div>
    );

    return (
        <div className="p-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <p className="text-blue-400 text-sm font-bold uppercase tracking-wider mb-2">
                    Day 3 of 5
                </p>
                <h1 className="text-3xl font-bold text-white mb-2">
                    Tools, Workflow & Performance
                </h1>
                <p className="text-slate-400">
                    How you get work done in this role. Practice makes confident!
                </p>
            </div>

            {/* Phase Navigation */}
            <div className="flex items-center gap-4 mb-8">
                {[
                    { id: 'TOOLKIT', label: 'Your Toolkit', icon: '🛠️' },
                    { id: 'SIMULATOR', label: 'First Task', icon: '🎮' },
                    { id: 'CONTRIBUTIONS', label: 'Contributions', icon: '⭐' },
                ].map((p, i) => {
                    const isActive = phase === p.id || (phase === 'DONE' && p.id === 'CONTRIBUTIONS');
                    const isPast =
                        (p.id === 'TOOLKIT' && (phase === 'SIMULATOR' || phase === 'CONTRIBUTIONS' || phase === 'DONE')) ||
                        (p.id === 'SIMULATOR' && (phase === 'CONTRIBUTIONS' || phase === 'DONE'));

                    return (
                        <React.Fragment key={p.id}>
                            <div
                                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-xl transition-all
                                    ${isActive ? 'bg-blue-500/20 border border-blue-500/50 text-white' : ''}
                                    ${isPast ? 'bg-green-500/20 border border-green-500/50 text-green-400' : ''}
                                    ${!isActive && !isPast ? 'bg-slate-800/50 text-slate-500' : ''}
                                `}
                            >
                                {isPast ? <Check className="w-4 h-4" /> : <span>{p.icon}</span>}
                                <span className="font-medium">{p.label}</span>
                            </div>
                            {i < 2 && <ChevronRight className="w-5 h-5 text-slate-600" />}
                        </React.Fragment>
                    );
                })}
            </div>

            {/* Phase Content */}
            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6">
                {phase === 'TOOLKIT' && renderToolkitPhase()}
                {phase === 'SIMULATOR' && renderSimulatorPhase()}
                {phase === 'CONTRIBUTIONS' && renderContributionsPhase()}
                {phase === 'DONE' && (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                            <Check className="w-10 h-10 text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Day 3 Complete!</h2>
                        <p className="text-slate-400">Moving to Day 4: Network & Collaboration...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Day3ToolsWorkflow;
