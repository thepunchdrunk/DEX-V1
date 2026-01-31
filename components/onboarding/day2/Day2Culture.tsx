import React, { useState } from 'react';
import {
    ChevronRight,
    Check,
    MessageSquare,
    Users,
    Calendar,
    Scale,
    Heart,
    Coffee,
    AlertCircle,
    Lightbulb,
    BookOpen,
    Flag,
    ThumbsUp,
    ThumbsDown,
    Send,
    Clock,
    Star,
} from 'lucide-react';
import {
    RoleBasedScenario,
    CommunicationNorm,
    MeetingCultureRule,
    DecisionBoundary,
    EthicsModule,
    CoffeeChatSuggestion,
    UnwrittenRuleResponse,
    RoleCategory,
} from '../../../types';
import {
    ROLE_BASED_SCENARIOS,
    COMMUNICATION_NORMS,
    MEETING_CULTURE_RULES,
    DECISION_BOUNDARIES,
    ETHICS_MODULES,
    COFFEE_CHAT_SUGGESTIONS,
    UNWRITTEN_RULES,
} from '../../../constants';

interface Day2CultureProps {
    roleCategory?: RoleCategory;
    onComplete: () => void;
}

type Phase = 'SCENARIOS' | 'COMMUNICATION' | 'MEETINGS' | 'DECISIONS' | 'ETHICS' | 'BOT' | 'COFFEE' | 'DONE';

const Day2Culture: React.FC<Day2CultureProps> = ({ roleCategory = 'DESK', onComplete }) => {
    const [phase, setPhase] = useState<Phase>('SCENARIOS');
    const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
    const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [completedScenarios, setCompletedScenarios] = useState<string[]>([]);
    const [completedModules, setCompletedModules] = useState<Phase[]>([]);

    // Bot state
    const [botQuestion, setBotQuestion] = useState('');
    const [botResponses, setBotResponses] = useState<UnwrittenRuleResponse[]>([]);
    const [isTyping, setIsTyping] = useState(false);

    // Coffee chat state
    const [coffeeChats, setCoffeeChats] = useState<CoffeeChatSuggestion[]>(COFFEE_CHAT_SUGGESTIONS);

    // Filter scenarios by role
    const scenarios = ROLE_BASED_SCENARIOS.filter(s =>
        s.roleCategory === roleCategory || s.roleCategory === 'DESK'
    ).slice(0, 5);

    const currentScenario = scenarios[currentScenarioIndex];

    const phases: { id: Phase; label: string; icon: React.ReactNode }[] = [
        { id: 'SCENARIOS', label: 'Scenarios', icon: '🎭' },
        { id: 'COMMUNICATION', label: 'Communication', icon: '💬' },
        { id: 'MEETINGS', label: 'Meetings', icon: '📅' },
        { id: 'DECISIONS', label: 'Decisions', icon: '⚖️' },
        { id: 'ETHICS', label: 'Ethics', icon: '🤝' },
        { id: 'BOT', label: 'Ask Anything', icon: '🤖' },
        { id: 'COFFEE', label: 'Coffee Chats', icon: '☕' },
    ];

    const handleChoiceSelect = (choiceId: string) => {
        setSelectedChoice(choiceId);
        setShowFeedback(true);
    };

    const handleNextScenario = () => {
        if (currentScenario) {
            setCompletedScenarios(prev => [...prev, currentScenario.id]);
        }
        setSelectedChoice(null);
        setShowFeedback(false);

        if (currentScenarioIndex < scenarios.length - 1) {
            setCurrentScenarioIndex(prev => prev + 1);
        } else {
            setCompletedModules(prev => [...prev, 'SCENARIOS']);
            setPhase('COMMUNICATION');
        }
    };

    const handleCompleteModule = (currentPhase: Phase, nextPhase: Phase) => {
        setCompletedModules(prev => [...prev, currentPhase]);
        setPhase(nextPhase);
    };

    const handleBotSubmit = () => {
        if (!botQuestion.trim()) return;

        setIsTyping(true);
        const question = botQuestion;
        setBotQuestion('');

        // Find matching rule or generate response
        setTimeout(() => {
            const matchingRule = UNWRITTEN_RULES.find(r =>
                r.keywords.some(k => question.toLowerCase().includes(k.toLowerCase()))
            );

            const response: UnwrittenRuleResponse = matchingRule
                ? {
                    question,
                    answer: matchingRule.answer,
                    confidenceLevel: 'HIGH',
                    sourceName: 'Company Culture Guide',
                    flaggedCount: 0,
                    isQuarantined: false,
                }
                : {
                    question,
                    answer: "I'm not entirely sure about this. It might vary by team. I'd suggest asking your buddy or manager for clarification.",
                    confidenceLevel: 'LOW',
                    flaggedCount: 0,
                    isQuarantined: false,
                };

            setBotResponses(prev => [...prev, response]);
            setIsTyping(false);
        }, 1500);
    };

    const handleScheduleCoffee = (id: string) => {
        setCoffeeChats(prev => prev.map(c =>
            c.id === id ? { ...c, scheduled: true, scheduledAt: new Date().toISOString() } : c
        ));
    };

    const handleCompleteDay = () => {
        setPhase('DONE');
        setTimeout(onComplete, 1500);
    };

    const canCompleteDay = completedModules.length >= 5; // Need at least 5 modules

    const renderScenariosPhase = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-black">Culture Scenarios</h3>
                    <p className="text-[#616161] text-sm mt-1">
                        Navigate real situations you might encounter in your role.
                    </p>
                </div>
                <span className="text-sm text-[#616161]">
                    {currentScenarioIndex + 1} of {scenarios.length}
                </span>
            </div>

            {/* Progress */}
            <div className="h-1 bg-[#E0E0E0] rounded-full overflow-hidden">
                <div
                    className="h-full bg-[#E60000] transition-all"
                    style={{ width: `${((currentScenarioIndex + (showFeedback ? 1 : 0)) / scenarios.length) * 100}%` }}
                />
            </div>

            {currentScenario && (
                <div className="bg-[#FAFAFA] rounded-2xl border border-[#E0E0E0] p-6">
                    {/* Scenario Header */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`
                            px-2 py-1 rounded text-xs font-medium
                            ${currentScenario.difficulty === 'EASY' ? 'bg-[#E8F5E9] text-[#4CAF50]' : ''}
                            ${currentScenario.difficulty === 'MEDIUM' ? 'bg-[#FFF3E0] text-[#E65100]' : ''}
                            ${currentScenario.difficulty === 'HARD' ? 'bg-[#FFEBEE] text-[#D32F2F]' : ''}
                        `}>
                            {currentScenario.difficulty}
                        </span>
                        <span className="text-sm text-[#9E9E9E]">
                            {currentScenario.culturalDimension.replace(/_/g, ' ')}
                        </span>
                    </div>

                    <h4 className="text-lg font-medium text-black mb-2">{currentScenario.title}</h4>
                    <p className="text-[#616161] mb-6">{currentScenario.description}</p>

                    {/* Choices */}
                    <div className="space-y-3">
                        {currentScenario.choices.map((choice) => {
                            const isSelected = selectedChoice === choice.id;
                            const showResult = showFeedback && isSelected;

                            return (
                                <button
                                    key={choice.id}
                                    onClick={() => !showFeedback && handleChoiceSelect(choice.id)}
                                    disabled={showFeedback}
                                    className={`
                                        w-full p-4 rounded-xl border text-left transition-all
                                        ${!showFeedback ? 'hover:border-[#E60000]/50 hover:bg-[#F5F5F5]' : ''}
                                        ${isSelected && choice.isRecommended ? 'border-[#4CAF50] bg-[#E8F5E9]' : ''}
                                        ${isSelected && !choice.isRecommended ? 'border-[#E65100] bg-[#FFF3E0]' : ''}
                                        ${!isSelected && showFeedback ? 'opacity-50' : ''}
                                        ${!showFeedback ? 'border-[#E0E0E0]' : ''}
                                    `}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`
                                            w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                                            ${isSelected ? 'border-[#E60000] bg-[#E60000]' : 'border-[#BDBDBD]'}
                                        `}>
                                            {isSelected && <Check className="w-4 h-4 text-white" />}
                                        </div>
                                        <div>
                                            <p className="text-black">{choice.text}</p>
                                            {showResult && (
                                                <div className={`
                                                    mt-3 p-3 rounded-lg flex items-start gap-2
                                                    ${choice.isRecommended ? 'bg-[#C8E6C9]' : 'bg-[#FFE0B2]'}
                                                `}>
                                                    {choice.isRecommended ? (
                                                        <ThumbsUp className="w-5 h-5 text-[#4CAF50] flex-shrink-0" />
                                                    ) : (
                                                        <Lightbulb className="w-5 h-5 text-[#E65100] flex-shrink-0" />
                                                    )}
                                                    <p className={`text-sm ${choice.isRecommended ? 'text-[#2E7D32]' : 'text-[#E65100]'}`}>
                                                        {choice.feedback}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Next Button */}
                    {showFeedback && (
                        <button
                            onClick={handleNextScenario}
                            className="mt-6 w-full py-3 bg-[#E60000] hover:bg-[#CC0000] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            {currentScenarioIndex < scenarios.length - 1 ? 'Next Scenario' : 'Continue to Communication'}
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );

    const renderCommunicationPhase = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-black flex items-center gap-2">
                        <MessageSquare className="w-6 h-6 text-[#E60000]" />
                        Communication Norms
                    </h3>
                    <p className="text-[#616161] text-sm mt-1">
                        How we communicate at this company — and when to use each channel.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COMMUNICATION_NORMS.map(norm => (
                    <div key={norm.id} className="bg-[#FAFAFA] rounded-xl border border-[#E0E0E0] p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`
                                w-10 h-10 rounded-lg flex items-center justify-center
                                ${norm.channel === 'CHAT' ? 'bg-purple-100 text-purple-600' : ''}
                                ${norm.channel === 'EMAIL' ? 'bg-blue-100 text-blue-600' : ''}
                                ${norm.channel === 'TICKET' ? 'bg-green-100 text-green-600' : ''}
                                ${norm.channel === 'MEETING' ? 'bg-amber-100 text-amber-600' : ''}
                            `}>
                                {norm.channel === 'CHAT' && '💬'}
                                {norm.channel === 'EMAIL' && '📧'}
                                {norm.channel === 'TICKET' && '🎫'}
                                {norm.channel === 'MEETING' && '📅'}
                            </div>
                            <div>
                                <h4 className="font-medium text-black">{norm.channel}</h4>
                                <p className="text-xs text-[#9E9E9E]">Response: {norm.expectedResponseTime}</p>
                            </div>
                        </div>
                        <p className="text-sm text-[#616161] mb-3">{norm.useCase}</p>
                        <div className="text-xs text-[#9E9E9E] mb-2">
                            <strong>Urgency signal:</strong> {norm.urgencySignal}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="p-2 bg-[#E8F5E9] rounded-lg">
                                <p className="text-[#4CAF50] font-medium mb-1">✓ Good</p>
                                <p className="text-[#2E7D32]/70 line-clamp-2">{norm.examples.good}</p>
                            </div>
                            <div className="p-2 bg-[#FFEBEE] rounded-lg">
                                <p className="text-[#D32F2F] font-medium mb-1">✗ Avoid</p>
                                <p className="text-[#C62828]/70 line-clamp-2">{norm.examples.bad}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={() => handleCompleteModule('COMMUNICATION', 'MEETINGS')}
                className="w-full py-3 bg-[#E60000] hover:bg-[#CC0000] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
                Continue to Meeting Culture <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );

    const renderMeetingsPhase = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-black flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-[#E60000]" />
                    Meeting Culture
                </h3>
                <p className="text-[#616161] text-sm mt-1">
                    Our meetings are productive because we follow these unwritten rules.
                </p>
            </div>

            <div className="space-y-4">
                {MEETING_CULTURE_RULES.map((rule, index) => (
                    <div key={rule.id} className="bg-[#FAFAFA] rounded-xl border border-[#E0E0E0] p-5 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#E60000] font-bold flex-shrink-0">
                            {index + 1}
                        </div>
                        <div>
                            <h4 className="font-medium text-black mb-1">{rule.title}</h4>
                            <p className="text-sm text-[#616161]">{rule.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={() => handleCompleteModule('MEETINGS', 'DECISIONS')}
                className="w-full py-3 bg-[#E60000] hover:bg-[#CC0000] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
                Continue to Decision Boundaries <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );

    const renderDecisionsPhase = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-black flex items-center gap-2">
                    <Scale className="w-6 h-6 text-[#E60000]" />
                    Decision-Making Boundaries
                </h3>
                <p className="text-[#616161] text-sm mt-1">
                    Understanding when you can act independently vs. when to escalate.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DECISION_BOUNDARIES.map((boundary) => (
                    <div key={boundary.id} className={`
                        bg-white rounded-xl border p-5
                        ${boundary.scope === 'INDEPENDENT' ? 'border-[#4CAF50]/30' : ''}
                        ${boundary.scope === 'MANAGER_APPROVAL' ? 'border-blue-300' : ''}
                        ${boundary.scope === 'CROSS_TEAM' ? 'border-[#E65100]/30' : ''}
                        ${boundary.scope === 'EXECUTIVE' ? 'border-[#D32F2F]/30' : ''}
                    `}>
                        <div className="flex items-center gap-2 mb-3">
                            <div className={`
                                w-8 h-8 rounded-lg flex items-center justify-center
                                ${boundary.scope === 'INDEPENDENT' ? 'bg-[#E8F5E9] text-[#4CAF50]' : ''}
                                ${boundary.scope === 'MANAGER_APPROVAL' ? 'bg-blue-100 text-blue-600' : ''}
                                ${boundary.scope === 'CROSS_TEAM' ? 'bg-[#FFF3E0] text-[#E65100]' : ''}
                                ${boundary.scope === 'EXECUTIVE' ? 'bg-[#FFEBEE] text-[#D32F2F]' : ''}
                            `}>
                                {boundary.scope === 'INDEPENDENT' && '✓'}
                                {boundary.scope === 'MANAGER_APPROVAL' && '👤'}
                                {boundary.scope === 'CROSS_TEAM' && '👥'}
                                {boundary.scope === 'EXECUTIVE' && '⬆️'}
                            </div>
                            <h4 className="font-medium text-black">{boundary.title}</h4>
                        </div>
                        <ul className="text-sm text-[#616161] space-y-1">
                            {boundary.examples.map((ex, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="text-[#BDBDBD]">•</span>
                                    <span>{ex}</span>
                                </li>
                            ))}
                        </ul>
                        {boundary.escalationPath && (
                            <p className="mt-3 text-xs text-[#9E9E9E]">
                                <strong>How:</strong> {boundary.escalationPath}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            <button
                onClick={() => handleCompleteModule('DECISIONS', 'ETHICS')}
                className="w-full py-3 bg-[#E60000] hover:bg-[#CC0000] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
                Continue to Ethics & Inclusion <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );

    const renderEthicsPhase = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-black flex items-center gap-2">
                    <Heart className="w-6 h-6 text-[#E60000]" />
                    Ethics, Inclusion & Conduct
                </h3>
                <p className="text-[#616161] text-sm mt-1">
                    Building a respectful and ethical workplace together.
                </p>
            </div>

            {ETHICS_MODULES.map((module) => (
                <div key={module.id} className="bg-[#FAFAFA] rounded-xl border border-[#E0E0E0] p-6">
                    <h4 className="font-medium text-black mb-2">{module.title}</h4>
                    <p className="text-sm text-[#616161] mb-4">{module.description}</p>

                    <div className="space-y-4">
                        {module.scenarios.map((scenario) => (
                            <div key={scenario.id} className="bg-white rounded-lg p-4 border border-[#E0E0E0]">
                                <p className="text-sm text-black mb-2">
                                    <strong>Situation:</strong> {scenario.situation}
                                </p>
                                <p className="text-sm text-[#4CAF50] mb-2">
                                    <strong>What to do:</strong> {scenario.correctAction}
                                </p>
                                <p className="text-xs text-[#9E9E9E]">
                                    <strong>Report via:</strong> {scenario.reportingPath}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <button
                onClick={() => handleCompleteModule('ETHICS', 'BOT')}
                className="w-full py-3 bg-[#E60000] hover:bg-[#CC0000] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
                Continue to Ask Anything <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );

    const renderBotPhase = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-black flex items-center gap-2">
                    🤖 Unwritten Rules Assistant
                </h3>
                <p className="text-[#616161] text-sm mt-1">
                    Ask me anything about how things work here. I'll give you my best answer with a confidence level.
                </p>
            </div>

            {/* Chat Area */}
            <div className="bg-[#FAFAFA] rounded-xl border border-[#E0E0E0] h-96 flex flex-col">
                <div className="flex-1 p-4 overflow-auto space-y-4">
                    {botResponses.length === 0 && (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-2">🤖</div>
                            <p className="text-[#616161]">
                                Try asking something like:<br />
                                "Can I work from home?" or "What's the dress code?"
                            </p>
                        </div>
                    )}
                    {botResponses.map((response, i) => (
                        <div key={i} className="space-y-2">
                            {/* User Question */}
                            <div className="flex justify-end">
                                <div className="bg-[#E60000] text-white px-4 py-2 rounded-xl rounded-br-none max-w-xs">
                                    {response.question}
                                </div>
                            </div>
                            {/* Bot Answer */}
                            <div className="flex justify-start">
                                <div className="bg-white text-black px-4 py-3 rounded-xl rounded-bl-none max-w-md border border-[#E0E0E0]">
                                    <p className="mb-2">{response.answer}</p>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className={`
                                            px-2 py-0.5 rounded
                                            ${response.confidenceLevel === 'HIGH' ? 'bg-[#E8F5E9] text-[#4CAF50]' : ''}
                                            ${response.confidenceLevel === 'MEDIUM' ? 'bg-[#FFF3E0] text-[#E65100]' : ''}
                                            ${response.confidenceLevel === 'LOW' ? 'bg-[#FFEBEE] text-[#D32F2F]' : ''}
                                        `}>
                                            {response.confidenceLevel} confidence
                                        </span>
                                        {response.sourceName && (
                                            <span className="text-[#9E9E9E]">
                                                Source: {response.sourceName}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white text-black px-4 py-2 rounded-xl rounded-bl-none flex items-center gap-1 border border-[#E0E0E0]">
                                <span className="w-2 h-2 bg-[#9E9E9E] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 bg-[#9E9E9E] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 bg-[#9E9E9E] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-[#E0E0E0]">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={botQuestion}
                            onChange={(e) => setBotQuestion(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleBotSubmit()}
                            placeholder="Ask about our culture..."
                            className="flex-1 px-4 py-2 bg-white border border-[#E0E0E0] rounded-lg text-black placeholder-[#9E9E9E] focus:outline-none focus:border-[#E60000]"
                        />
                        <button
                            onClick={handleBotSubmit}
                            disabled={!botQuestion.trim() || isTyping}
                            className="px-4 py-2 bg-[#E60000] hover:bg-[#CC0000] disabled:bg-[#E0E0E0] text-white rounded-lg transition-all"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <button
                onClick={() => handleCompleteModule('BOT', 'COFFEE')}
                className="w-full py-3 bg-[#E60000] hover:bg-[#CC0000] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
                Continue to Coffee Chats <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );

    const renderCoffeePhase = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-black flex items-center gap-2">
                    <Coffee className="w-6 h-6 text-[#E60000]" />
                    Suggested Coffee Chats
                </h3>
                <p className="text-[#616161] text-sm mt-1">
                    Build relationships early. We've identified some great people for you to connect with.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coffeeChats.map((chat) => (
                    <div key={chat.id} className="bg-[#FAFAFA] rounded-xl border border-[#E0E0E0] p-5">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E60000] to-[#FF6666] flex items-center justify-center text-white font-bold">
                                {chat.personName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-black">{chat.personName}</h4>
                                <p className="text-sm text-[#616161]">{chat.personTitle}</p>
                            </div>
                        </div>

                        <p className="mt-4 text-sm text-[#616161]">{chat.reason}</p>

                        <div className="mt-3 flex flex-wrap gap-1">
                            {chat.suggestedTopics.map((topic, i) => (
                                <span key={i} className="text-xs px-2 py-1 bg-[#E0E0E0] text-[#616161] rounded">
                                    {topic}
                                </span>
                            ))}
                        </div>

                        <div className="mt-4">
                            {chat.scheduled ? (
                                <div className="flex items-center gap-2 text-[#4CAF50] text-sm">
                                    <Check className="w-4 h-4" />
                                    <span>Chat scheduled!</span>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleScheduleCoffee(chat.id)}
                                    className="w-full py-2 bg-[#E60000] hover:bg-[#CC0000] text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <Coffee className="w-4 h-4" /> Schedule Chat
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={handleCompleteDay}
                disabled={!canCompleteDay}
                className={`
                    w-full py-3 font-semibold rounded-xl transition-all flex items-center justify-center gap-2
                    ${canCompleteDay
                        ? 'bg-[#E60000] hover:bg-[#CC0000] text-white'
                        : 'bg-[#E0E0E0] text-[#9E9E9E] cursor-not-allowed'}
                `}
            >
                Complete Day 2 — Proceed to Tools & Workflow <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );

    return (
        <div className="p-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <p className="text-[#E60000] text-sm font-bold uppercase tracking-wider mb-2">
                    Day 2 of 5
                </p>
                <h1 className="text-3xl font-bold text-black mb-2">
                    Company Culture
                </h1>
                <p className="text-[#616161]">
                    Master the unwritten rules that make you effective here.
                </p>
            </div>

            {/* Phase Navigation */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {phases.map((p) => {
                    const isActive = phase === p.id;
                    const isCompleted = completedModules.includes(p.id);

                    return (
                        <button
                            key={p.id}
                            onClick={() => setPhase(p.id)}
                            className={`
                                px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer
                                ${isActive ? 'bg-red-50 border border-[#E60000] text-black' : ''}
                                ${isCompleted ? 'bg-[#E8F5E9] border border-[#4CAF50]/50 text-[#4CAF50]' : ''}
                                ${!isActive && !isCompleted ? 'bg-[#F5F5F5] text-[#616161] hover:bg-[#E0E0E0] hover:text-black' : ''}
                            `}
                        >
                            {isCompleted ? <Check className="w-4 h-4" /> : <span>{p.icon}</span>}
                            {p.label}
                        </button>
                    );
                })}
            </div>

            {/* Phase Content */}
            <div className="bg-white backdrop-blur-md rounded-2xl border border-[#E0E0E0] p-6">
                {phase === 'SCENARIOS' && renderScenariosPhase()}
                {phase === 'COMMUNICATION' && renderCommunicationPhase()}
                {phase === 'MEETINGS' && renderMeetingsPhase()}
                {phase === 'DECISIONS' && renderDecisionsPhase()}
                {phase === 'ETHICS' && renderEthicsPhase()}
                {phase === 'BOT' && renderBotPhase()}
                {phase === 'COFFEE' && renderCoffeePhase()}
                {phase === 'DONE' && (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 rounded-full bg-[#E8F5E9] flex items-center justify-center mx-auto mb-4">
                            <Check className="w-10 h-10 text-[#4CAF50]" />
                        </div>
                        <h2 className="text-2xl font-bold text-black mb-2">Day 2 Complete!</h2>
                        <p className="text-[#616161]">Moving to Day 3: Tools & Workflow...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Day2Culture;
