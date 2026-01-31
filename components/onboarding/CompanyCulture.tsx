import React, { useState } from 'react';
import {
    MessageCircle,
    Send,
    ChevronRight,
    Check,
    Lightbulb,
    ThumbsUp,
    ThumbsDown,
} from 'lucide-react';
import { MicroScenario, ScenarioChoice } from '../../types';
import { MICRO_SCENARIOS, UNWRITTEN_RULES } from '../../constants';

interface CulturalOSProps {
    onComplete: () => void;
}

const CulturalOS: React.FC<CulturalOSProps> = ({ onComplete }) => {
    const [phase, setPhase] = useState<'SCENARIOS' | 'BOT' | 'DONE'>('SCENARIOS');
    const [currentScenario, setCurrentScenario] = useState(0);
    const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [completedScenarios, setCompletedScenarios] = useState<string[]>([]);
    const [chatMessages, setChatMessages] = useState<
        { from: 'user' | 'bot'; text: string }[]
    >([
        {
            from: 'bot',
            text: "Hi! I'm the Unwritten Rules Bot. Ask me anything about our culture that you wouldn't find in the handbook. Try: 'Can I wear jeans?' or 'What time should I arrive?'",
        },
    ]);
    const [chatInput, setChatInput] = useState('');

    const scenario = MICRO_SCENARIOS[currentScenario];

    const handleChoiceSelect = (choice: ScenarioChoice) => {
        setSelectedChoice(choice.id);
        setShowFeedback(true);
    };

    const handleNextScenario = () => {
        setCompletedScenarios([...completedScenarios, scenario.id]);
        if (currentScenario < MICRO_SCENARIOS.length - 1) {
            setCurrentScenario(currentScenario + 1);
            setSelectedChoice(null);
            setShowFeedback(false);
        } else {
            setPhase('BOT');
        }
    };

    const handleSendMessage = () => {
        if (!chatInput.trim()) return;

        const userMessage = chatInput.trim();
        setChatMessages((prev) => [...prev, { from: 'user', text: userMessage }]);
        setChatInput('');

        // Find matching rule
        const matchingRule = UNWRITTEN_RULES.find(
            (rule) =>
                userMessage.toLowerCase().includes(rule.question.toLowerCase().split(' ')[2]) ||
                rule.category.toLowerCase().includes(userMessage.toLowerCase())
        );

        setTimeout(() => {
            if (matchingRule) {
                setChatMessages((prev) => [
                    ...prev,
                    { from: 'bot', text: matchingRule.answer },
                ]);
            } else {
                setChatMessages((prev) => [
                    ...prev,
                    {
                        from: 'bot',
                        text: "That's a great question! While I don't have a specific answer for that, feel free to ask your manager or any teammate. We have an open culture where no question is too silly. Try asking about dress code, meeting culture, or work hours!",
                    },
                ]);
            }
        }, 600);
    };

    const handleCompleteDay = () => {
        setPhase('DONE');
        setTimeout(onComplete, 1500);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <p className="text-blue-400 text-sm font-bold uppercase tracking-wider mb-2">
                    Day 2 of 5
                </p>
                <h1 className="text-3xl font-bold text-white mb-2">Company Culture</h1>
                <p className="text-slate-400">
                    Learn our unwritten rules through interactive scenarios and our AI culture guide.
                </p>
            </div>

            {/* Scenarios Phase */}
            {phase === 'SCENARIOS' && (
                <div className="animate-fade-in">
                    {/* Progress */}
                    <div className="flex items-center gap-2 mb-6">
                        {MICRO_SCENARIOS.map((s, i) => (
                            <div
                                key={s.id}
                                className={`
                  flex-1 h-2 rounded-full transition-all
                  ${completedScenarios.includes(s.id) ? 'bg-green-500' : ''}
                  ${i === currentScenario && !completedScenarios.includes(s.id) ? 'bg-blue-500' : ''}
                  ${i > currentScenario ? 'bg-slate-700' : ''}
                `}
                            />
                        ))}
                    </div>

                    {/* Scenario Card */}
                    <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Lightbulb className="w-5 h-5 text-amber-400" />
                            <span className="text-sm font-medium text-amber-400">
                                Scenario {currentScenario + 1} of {MICRO_SCENARIOS.length}
                            </span>
                        </div>

                        <h2 className="text-xl font-bold text-white mb-2">{scenario.title}</h2>
                        <p className="text-slate-300 mb-6">{scenario.description}</p>

                        {/* Choices */}
                        <div className="space-y-3">
                            {scenario.choices.map((choice) => {
                                const isSelected = selectedChoice === choice.id;
                                const showResult = showFeedback && isSelected;

                                return (
                                    <button
                                        key={choice.id}
                                        onClick={() => !showFeedback && handleChoiceSelect(choice)}
                                        disabled={showFeedback}
                                        className={`
                      w-full text-left p-4 rounded-xl border transition-all
                      ${isSelected && choice.isRecommended
                                                ? 'bg-green-500/20 border-green-500/50'
                                                : ''
                                            }
                      ${isSelected && !choice.isRecommended
                                                ? 'bg-amber-500/20 border-amber-500/50'
                                                : ''
                                            }
                      ${!isSelected && showFeedback
                                                ? 'opacity-50'
                                                : ''
                                            }
                      ${!showFeedback
                                                ? 'bg-slate-800/50 border-slate-700 hover:border-blue-500/50 hover:bg-slate-800'
                                                : ''
                                            }
                    `}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`
                          w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                          ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-600'}
                        `}
                                            >
                                                {isSelected && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white font-medium">{choice.text}</p>
                                                {showResult && (
                                                    <div className="mt-3 p-3 rounded-lg bg-slate-900/50 animate-fade-in">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            {choice.isRecommended ? (
                                                                <ThumbsUp className="w-4 h-4 text-green-400" />
                                                            ) : (
                                                                <ThumbsDown className="w-4 h-4 text-amber-400" />
                                                            )}
                                                            <span
                                                                className={`text-sm font-medium ${choice.isRecommended
                                                                    ? 'text-green-400'
                                                                    : 'text-amber-400'
                                                                    }`}
                                                            >
                                                                {choice.isRecommended ? 'Good choice!' : 'Almost right'}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-slate-400">{choice.feedback}</p>
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
                                className="mt-6 w-full py-3 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                {currentScenario < MICRO_SCENARIOS.length - 1
                                    ? 'Next Scenario'
                                    : 'Continue to Culture Bot'}
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Bot Phase */}
            {phase === 'BOT' && (
                <div className="animate-fade-in">
                    <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 overflow-hidden">
                        {/* Bot Header */}
                        <div className="p-4 border-b border-slate-700 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <MessageCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="font-medium text-white">Unwritten Rules Bot</p>
                                <p className="text-xs text-green-400">● Online</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="h-80 overflow-y-auto p-4 space-y-4">
                            {chatMessages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`
                      max-w-[80%] p-3 rounded-2xl
                      ${msg.from === 'user'
                                                ? 'bg-blue-500 text-white rounded-br-none'
                                                : 'bg-slate-700 text-slate-200 rounded-bl-none'
                                            }
                    `}
                                    >
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-slate-700">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSendMessage();
                                }}
                                className="flex gap-2"
                            >
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    placeholder="Ask about our culture..."
                                    className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-xl transition-all"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Complete Button */}
                    <button
                        onClick={handleCompleteDay}
                        className="mt-6 w-full py-3 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        Complete Day 2
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Done State */}
            {phase === 'DONE' && (
                <div className="text-center py-12 animate-fade-in">
                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                        <Check className="w-10 h-10 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Day 2 Complete!</h2>
                    <p className="text-slate-400">Moving to Day 3: Learning Foundations...</p>
                </div>
            )}
        </div>
    );
};

export default CulturalOS;
