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
    FIRST_TASK_SIMULATION_MANAGER,
    FIRST_TASK_SIMULATION_FRONTLINE,
    FIRST_TASK_SIMULATION_SALES,
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

    // Select simulation based on role
    const getSimulationForRole = () => {
        if (user.role === 'MANAGER') return FIRST_TASK_SIMULATION_MANAGER;
        if (user.roleCategory === 'FRONTLINE') return FIRST_TASK_SIMULATION_FRONTLINE;
        if (user.department === 'Sales' || user.roleCategory === 'REMOTE') return FIRST_TASK_SIMULATION_SALES;
        return FIRST_TASK_SIMULATION_QA;
    };

    const [simulation, setSimulation] = useState<FirstTaskSimulation>(getSimulationForRole());
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
                    <h3 className="text-xl font-semibold text-black">Your Work Toolkit</h3>
                    <p className="text-[#616161] text-sm mt-1">
                        Learn the essential tools you'll use daily in your role.
                    </p>
                </div>
                {toolkitComplete && (
                    <button
                        onClick={() => setPhase('SIMULATOR')}
                        className="px-4 py-2 bg-[#E60000] hover:bg-[#CC0000] text-white font-medium rounded-lg flex items-center gap-2 transition-all"
                    >
                        Continue to Simulator <ChevronRight className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Tool Flow Diagram */}
            <div className="bg-[#FAFAFA] rounded-xl border border-[#E0E0E0] p-6">
                <h4 className="text-sm font-medium text-[#616161] mb-4">How your tools connect</h4>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                    {tools.filter(t => t.category === 'CORE').map((tool, index) => (
                        <React.Fragment key={tool.id}>
                            <div className={`
                                flex flex-col items-center p-4 rounded-xl border-2 transition-all cursor-pointer
                                ${tool.walkthroughCompleted
                                    ? 'border-[#4CAF50]/50 bg-[#E8F5E9]'
                                    : 'border-[#E0E0E0] bg-white hover:border-[#E60000]/50'}
                            `}
                                onClick={() => handleToolWalkthrough(tool.id)}
                            >
                                <span className="text-3xl mb-2">{tool.icon}</span>
                                <span className="text-sm font-medium text-black">{tool.name}</span>
                                {tool.walkthroughCompleted && (
                                    <Check className="w-4 h-4 text-[#4CAF50] mt-1" />
                                )}
                            </div>
                            {index < tools.filter(t => t.category === 'CORE').length - 1 && (
                                <ChevronRight className="w-6 h-6 text-[#BDBDBD]" />
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
                            bg-[#FAFAFA] rounded-xl border transition-all
                            ${tool.walkthroughCompleted ? 'border-[#4CAF50]/30' : 'border-[#E0E0E0]'}
                            ${activeToolId === tool.id ? 'ring-2 ring-[#E60000]' : ''}
                        `}
                    >
                        <div className="p-4">
                            <div className="flex items-start gap-4">
                                <div className={`
                                    w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                                    ${tool.walkthroughCompleted ? 'bg-[#E8F5E9]' : 'bg-[#E0E0E0]'}
                                `}>
                                    {tool.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-medium text-black">{tool.name}</h4>
                                        <span className={`
                                            text-xs px-2 py-0.5 rounded
                                            ${tool.category === 'CORE' ? 'bg-red-50 text-[#E60000]' : 'bg-[#E0E0E0] text-[#616161]'}
                                        `}>
                                            {tool.category}
                                        </span>
                                    </div>
                                    <p className="text-sm text-[#616161] mt-1">{tool.purpose}</p>
                                </div>
                                {tool.walkthroughCompleted ? (
                                    <CheckCircle2 className="w-6 h-6 text-[#4CAF50]" />
                                ) : (
                                    <button
                                        onClick={() => handleToolWalkthrough(tool.id)}
                                        className="px-3 py-1.5 bg-[#E60000] hover:bg-[#CC0000] text-white text-sm font-medium rounded-lg transition-all"
                                    >
                                        Learn
                                    </button>
                                )}
                            </div>

                            {/* Expanded Tool View */}
                            {activeToolId === tool.id && !tool.walkthroughCompleted && (
                                <div className="mt-4 pt-4 border-t border-[#E0E0E0]">
                                    <h5 className="text-sm font-medium text-black mb-3">Quick Actions</h5>
                                    <div className="space-y-2">
                                        {tool.quickActions.map((action) => (
                                            <div
                                                key={action.id}
                                                className="flex items-center gap-3 p-2 bg-white border border-[#E0E0E0] rounded-lg"
                                            >
                                                <Zap className="w-4 h-4 text-[#E60000]" />
                                                <div className="flex-1">
                                                    <span className="text-sm text-black">{action.label}</span>
                                                    <span className="text-xs text-[#9E9E9E] ml-2">{action.description}</span>
                                                </div>
                                                {action.shortcut && (
                                                    <kbd className="px-2 py-0.5 bg-[#F5F5F5] border border-[#E0E0E0] rounded text-xs text-[#616161]">
                                                        {action.shortcut}
                                                    </kbd>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => handleCompleteToolWalkthrough(tool.id)}
                                        className="mt-4 w-full py-2 bg-[#4CAF50] hover:bg-[#43A047] text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2"
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
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-[#E60000]/20 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Lightbulb className="w-6 h-6 text-[#E60000]" />
                    <h4 className="font-medium text-black">Insider Tips from Senior Engineers</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {tips.map((tip) => (
                        <div key={tip.id} className="bg-white rounded-lg p-4 border border-[#E0E0E0]">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">{tools.find(t => t.id === tip.toolId)?.icon}</span>
                                <span className="text-xs text-[#9E9E9E]">{tip.toolName}</span>
                            </div>
                            <h5 className="text-sm font-medium text-black mb-1">{tip.title}</h5>
                            <p className="text-xs text-[#616161]">{tip.description}</p>
                            {tip.shortcutKey && (
                                <kbd className="mt-2 inline-block px-2 py-0.5 bg-[#F5F5F5] border border-[#E0E0E0] rounded text-xs text-[#616161]">
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
                    <h3 className="text-xl font-semibold text-black flex items-center gap-2">
                        <Target className="w-6 h-6 text-[#E60000]" />
                        First Task Simulator
                    </h3>
                    <p className="text-[#616161] text-sm mt-1">
                        Practice in a safe sandbox environment. Errors are learning moments!
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-[#616161]">Mode:</span>
                    <button
                        onClick={toggleSimulatorMode}
                        className={`
                            px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                            ${simulation.mode === 'GUIDED'
                                ? 'bg-[#E60000] text-white'
                                : 'bg-[#E0E0E0] text-[#616161]'}
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
                                : 'bg-[#E0E0E0] text-[#616161]'}
                        `}
                    >
                        🚀 Confidence
                    </button>
                </div>
            </div>

            {/* Simulator Card */}
            <div className="bg-[#FAFAFA] rounded-2xl border border-[#E0E0E0] overflow-hidden">
                {/* Header */}
                <div className="p-4 bg-white border-b border-[#E0E0E0] flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-[#E60000]" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-medium text-black">{simulation.title}</h4>
                        <p className="text-sm text-[#616161]">{simulation.description}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-[#616161]">Progress</div>
                        <div className="text-lg font-bold text-black">
                            {simulation.steps.filter(s => s.completed).length}/{simulation.steps.length}
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-[#E0E0E0]">
                    <div
                        className="h-full bg-gradient-to-r from-[#E60000] to-purple-500 transition-all duration-300"
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
                                            ${index === currentStep ? 'bg-red-50 border border-[#E60000]/30' : ''}
                                            ${step.completed ? 'bg-[#E8F5E9] border border-[#4CAF50]/30' : ''}
                                            ${index > currentStep && !step.completed ? 'opacity-50' : ''}
                                        `}
                                    >
                                        <div className={`
                                            w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                                            ${step.completed ? 'bg-[#4CAF50] text-white' : ''}
                                            ${index === currentStep && !step.completed ? 'bg-[#E60000] text-white' : ''}
                                            ${index > currentStep && !step.completed ? 'bg-[#E0E0E0] text-[#9E9E9E]' : ''}
                                        `}>
                                            {step.completed ? (
                                                <Check className="w-4 h-4" />
                                            ) : (
                                                <span className="text-sm font-bold">{index + 1}</span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm ${index === currentStep ? 'text-black font-medium' : 'text-[#616161]'}`}>
                                                {step.instruction}
                                            </p>
                                            {index === currentStep && simulation.mode === 'GUIDED' && step.hint && showHint && (
                                                <div className="mt-2 p-2 bg-[#FFF3E0] border border-[#E65100]/30 rounded-lg flex items-start gap-2">
                                                    <Lightbulb className="w-4 h-4 text-[#E65100] flex-shrink-0 mt-0.5" />
                                                    <p className="text-xs text-[#E65100]">{step.hint}</p>
                                                </div>
                                            )}
                                            {step.errorRecoveryGuidance && index === currentStep && (
                                                <p className="mt-1 text-xs text-[#9E9E9E]">
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
                                        className="px-4 py-2 bg-[#FFF3E0] hover:bg-[#FFE0B2] text-[#E65100] font-medium rounded-lg flex items-center gap-2 transition-all"
                                    >
                                        <HelpCircle className="w-4 h-4" /> Show Hint
                                    </button>
                                )}
                                <button
                                    onClick={handleSimulatorStep}
                                    className="flex-1 py-3 bg-[#E60000] hover:bg-[#CC0000] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
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
                            <div className="w-20 h-20 rounded-full bg-[#E8F5E9] flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-10 h-10 text-[#4CAF50]" />
                            </div>
                            <h4 className="text-xl font-bold text-black mb-2">Artifact Created!</h4>
                            <p className="text-[#616161] mb-6">
                                Your first task has been logged in the sandbox environment.
                            </p>

                            {/* Artifact Preview */}
                            <div className="bg-white rounded-xl p-4 mb-6 text-left border border-[#E0E0E0]">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="w-5 h-5 text-[#E60000]" />
                                    <span className="text-sm font-medium text-black">
                                        {simulation.artifactType}: {simulation.artifactId}
                                    </span>
                                </div>
                                <p className="text-sm text-[#616161]">{simulation.artifactPreview}</p>
                                <div className="mt-3 flex items-center gap-2 text-xs text-[#9E9E9E]">
                                    <Eye className="w-4 h-4" />
                                    <span>Manager will receive notification to review</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setPhase('CONTRIBUTIONS')}
                                className="px-6 py-3 bg-[#E60000] hover:bg-[#CC0000] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 mx-auto"
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
                <h3 className="text-xl font-semibold text-black flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-[#E60000]" />
                    First Contribution Path
                </h3>
                <p className="text-[#616161] text-sm mt-1">
                    Small wins that help you feel useful and build confidence early.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contributions.map((contribution) => (
                    <div
                        key={contribution.id}
                        className={`
                            bg-[#FAFAFA] rounded-xl border p-4 transition-all
                            ${contribution.status === 'COMPLETED' ? 'border-[#4CAF50]/30' : 'border-[#E0E0E0]'}
                        `}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`
                                w-10 h-10 rounded-lg flex items-center justify-center
                                ${contribution.status === 'COMPLETED' ? 'bg-[#E8F5E9] text-[#4CAF50]' : ''}
                                ${contribution.status === 'PENDING_CONFIRM' ? 'bg-[#FFF3E0] text-[#E65100]' : ''}
                                ${contribution.status === 'IN_PROGRESS' ? 'bg-red-50 text-[#E60000]' : ''}
                                ${contribution.status === 'AVAILABLE' ? 'bg-[#E0E0E0] text-[#616161]' : ''}
                            `}>
                                {contribution.type === 'STANDUP' && '🎤'}
                                {contribution.type === 'DOCUMENT_UPDATE' && '📝'}
                                {contribution.type === 'SHADOW' && '👀'}
                                {contribution.type === 'TASK' && '✅'}
                                {contribution.type === 'CODE_REVIEW' && '🔍'}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-black">{contribution.title}</h4>
                                <p className="text-sm text-[#616161]">{contribution.description}</p>

                                {/* Status Badge */}
                                <div className="mt-2">
                                    {contribution.status === 'AVAILABLE' && (
                                        <button
                                            onClick={() => handleStartContribution(contribution.id)}
                                            className="px-3 py-1.5 bg-[#E60000] hover:bg-[#CC0000] text-white text-sm font-medium rounded-lg transition-all"
                                        >
                                            Start
                                        </button>
                                    )}
                                    {contribution.status === 'IN_PROGRESS' && (
                                        <button
                                            onClick={() => handleCompleteContribution(contribution.id)}
                                            className="px-3 py-1.5 bg-[#4CAF50] hover:bg-[#43A047] text-white text-sm font-medium rounded-lg transition-all"
                                        >
                                            Mark Complete
                                        </button>
                                    )}
                                    {contribution.status === 'PENDING_CONFIRM' && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#FFF3E0] text-[#E65100] text-sm rounded-lg">
                                            <AlertCircle className="w-4 h-4" /> Awaiting Manager Confirmation
                                        </span>
                                    )}
                                    {contribution.status === 'COMPLETED' && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#E8F5E9] text-[#4CAF50] text-sm rounded-lg">
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
                        ? 'bg-[#E60000] hover:bg-[#CC0000] text-white'
                        : 'bg-[#E0E0E0] text-[#9E9E9E] cursor-not-allowed'}
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
                <p className="text-[#E60000] text-sm font-bold uppercase tracking-wider mb-2">
                    Day 3 of 5
                </p>
                <h1 className="text-3xl font-bold text-black mb-2">
                    Tools, Workflow & Performance
                </h1>
                <p className="text-[#616161]">
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
                                    ${isActive ? 'bg-red-50 border border-[#E60000] text-black' : ''}
                                    ${isPast ? 'bg-[#E8F5E9] border border-[#4CAF50]/50 text-[#4CAF50]' : ''}
                                    ${!isActive && !isPast ? 'bg-[#F5F5F5] text-[#9E9E9E]' : ''}
                                `}
                            >
                                {isPast ? <Check className="w-4 h-4" /> : <span>{p.icon}</span>}
                                <span className="font-medium">{p.label}</span>
                            </div>
                            {i < 2 && <ChevronRight className="w-5 h-5 text-[#BDBDBD]" />}
                        </React.Fragment>
                    );
                })}
            </div>

            {/* Phase Content */}
            <div className="bg-white backdrop-blur-md rounded-2xl border border-[#E0E0E0] p-6">
                {phase === 'TOOLKIT' && renderToolkitPhase()}
                {phase === 'SIMULATOR' && renderSimulatorPhase()}
                {phase === 'CONTRIBUTIONS' && renderContributionsPhase()}
                {phase === 'DONE' && (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 rounded-full bg-[#E8F5E9] flex items-center justify-center mx-auto mb-4">
                            <Check className="w-10 h-10 text-[#4CAF50]" />
                        </div>
                        <h2 className="text-2xl font-bold text-black mb-2">Day 3 Complete!</h2>
                        <p className="text-[#616161]">Moving to Day 4: Network & Collaboration...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Day3ToolsWorkflow;
