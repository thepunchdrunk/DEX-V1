import React, { useState } from 'react';
import {
    Target,
    CheckCircle2,
    Circle,
    ChevronRight,
    Lightbulb,
    AlertCircle,
    Clock,
} from 'lucide-react';
import { DecisionScenario, DecisionChecklistItem } from '../../../types';
import { MOCK_DECISION_SCENARIOS } from '../../../constants';

interface DecisionAssistProps {
    scenario?: DecisionScenario;
    onDismiss?: () => void;
    className?: string;
}

const DecisionAssist: React.FC<DecisionAssistProps> = ({
    scenario: propScenario,
    onDismiss,
    className = ''
}) => {
    // Use prop scenario or first mock scenario as default
    const defaultScenario = propScenario || MOCK_DECISION_SCENARIOS[0];
    const [selectedScenario, setSelectedScenario] = useState<DecisionScenario>(defaultScenario);
    const [checklist, setChecklist] = useState(defaultScenario.checklist);
    const [activeTab, setActiveTab] = useState<'checklist' | 'framing' | 'prompts'>('checklist');
    const [showScenarioList, setShowScenarioList] = useState(!propScenario);

    const completedCount = checklist.filter((item) => item.completed).length;
    const progressPercent = (completedCount / checklist.length) * 100;

    const handleSelectScenario = (scenario: DecisionScenario) => {
        setSelectedScenario(scenario);
        setChecklist(scenario.checklist);
        setShowScenarioList(false);
    };

    const toggleChecklistItem = (itemId: string) => {
        setChecklist((prev) =>
            prev.map((item) =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
            )
        );
    };

    const getUrgencyColor = (urgency: DecisionScenario['urgency']) => {
        switch (urgency) {
            case 'HIGH':
                return 'text-[#D32F2F] bg-[#FFEBEE] border-[#D32F2F]/30';
            case 'MEDIUM':
                return 'text-[#E65100] bg-[#FFF3E0] border-[#E65100]/30';
            case 'LOW':
                return 'text-[#4CAF50] bg-[#E8F5E9] border-[#4CAF50]/30';
        }
    };

    const getCategoryLabel = (category: DecisionChecklistItem['category']) => {
        switch (category) {
            case 'PREPARATION':
                return { label: 'Prep', color: 'text-blue-600' };
            case 'EXECUTION':
                return { label: 'Execute', color: 'text-[#E65100]' };
            case 'FOLLOW_UP':
                return { label: 'Follow-up', color: 'text-[#4CAF50]' };
        }
    };

    const getTypeIcon = (type: DecisionScenario['type']) => {
        switch (type) {
            case 'EXEC_PRESENTATION':
                return '📊';
            case 'PERFORMANCE_REVIEW':
                return '⭐';
            case 'NEGOTIATION':
                return '🤝';
            case 'MAJOR_LAUNCH':
                return '🚀';
            case 'CONFLICT_RESOLUTION':
                return '🕊️';
        }
    };

    // Show scenario list if no prop scenario provided
    if (showScenarioList) {
        return (
            <div className={`space-y-6 ${className}`}>
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center">
                        <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-black">Decision Assist</h2>
                        <p className="text-sm text-[#616161]">Prepare for high-stakes scenarios</p>
                    </div>
                </div>

                {/* Scenario Cards */}
                <div className="space-y-3">
                    {MOCK_DECISION_SCENARIOS.map((scenario) => (
                        <button
                            key={scenario.id}
                            onClick={() => handleSelectScenario(scenario)}
                            className="w-full p-4 rounded-xl bg-white border border-[#E0E0E0] hover:border-[#E60000]/50 hover:shadow-md transition-all text-left group"
                        >
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">{getTypeIcon(scenario.type)}</span>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-medium text-black group-hover:text-[#E60000] transition-colors">
                                            {scenario.title}
                                        </h3>
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${getUrgencyColor(scenario.urgency)}`}>
                                            {scenario.urgency}
                                        </span>
                                    </div>
                                    <p className="text-sm text-[#616161]">{scenario.description}</p>
                                    {scenario.triggeredBy && (
                                        <p className="text-xs text-[#9E9E9E] mt-2 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {scenario.triggeredBy}
                                        </p>
                                    )}
                                </div>
                                <ChevronRight className="w-5 h-5 text-[#9E9E9E] group-hover:text-[#E60000]" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // Show selected scenario details
    return (
        <div className={`space-y-4 ${className}`}>
            {/* Back Button */}
            {!propScenario && (
                <button
                    onClick={() => setShowScenarioList(true)}
                    className="text-sm text-[#616161] hover:text-black flex items-center gap-1"
                >
                    ← Back to scenarios
                </button>
            )}

            {/* Header */}
            <div className="bg-white rounded-2xl border border-[#E0E0E0] overflow-hidden shadow-sm">
                <div className="p-5 border-b border-[#E0E0E0]">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center">
                                <Target className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-black">{selectedScenario.title}</h3>
                                <p className="text-sm text-[#616161]">{selectedScenario.description}</p>
                            </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(selectedScenario.urgency)}`}>
                            {selectedScenario.urgency} Priority
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-[#616161] mb-1.5">
                            <span>Preparation Progress</span>
                            <span className="font-medium">{completedCount}/{checklist.length}</span>
                        </div>
                        <div className="h-2 bg-[#E0E0E0] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-purple-600 transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-[#E0E0E0]">
                    {[
                        { id: 'checklist', label: 'Checklist', icon: CheckCircle2 },
                        { id: 'framing', label: 'Framing Tools', icon: Lightbulb },
                        { id: 'prompts', label: 'Prompts', icon: Target },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all ${activeTab === tab.id
                                ? 'text-[#E60000] border-b-2 border-[#E60000] bg-[#FFF0F0]'
                                : 'text-[#616161] hover:text-black'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="p-5 max-h-80 overflow-y-auto">
                    {activeTab === 'checklist' && (
                        <div className="space-y-2">
                            {checklist.map((item) => {
                                const categoryStyle = getCategoryLabel(item.category);
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => toggleChecklistItem(item.id)}
                                        className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left ${item.completed
                                            ? 'bg-[#E8F5E9] border border-[#4CAF50]/20'
                                            : 'bg-[#FAFAFA] hover:bg-gray-100 border border-transparent'
                                            }`}
                                    >
                                        {item.completed ? (
                                            <CheckCircle2 className="w-5 h-5 text-[#4CAF50] flex-shrink-0 mt-0.5" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-[#9E9E9E] flex-shrink-0 mt-0.5" />
                                        )}
                                        <div className="flex-1">
                                            <p className={`text-sm ${item.completed ? 'text-[#9E9E9E] line-through' : 'text-black'}`}>
                                                {item.text}
                                            </p>
                                            <span className={`text-xs ${categoryStyle.color} mt-1`}>
                                                {categoryStyle.label}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {activeTab === 'framing' && (
                        <div className="space-y-3">
                            {selectedScenario.framingTools.map((tool, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 p-3 rounded-xl bg-[#FAFAFA] border border-[#E0E0E0]"
                                >
                                    <div className="w-6 h-6 rounded-lg bg-[#FFF3E0] flex items-center justify-center flex-shrink-0">
                                        <Lightbulb className="w-3.5 h-3.5 text-[#E65100]" />
                                    </div>
                                    <p className="text-sm text-black leading-relaxed">{tool}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'prompts' && (
                        <div className="space-y-3">
                            {selectedScenario.preparationPrompts.map((prompt, index) => (
                                <div
                                    key={index}
                                    className="p-4 rounded-xl bg-purple-50 border border-purple-200"
                                >
                                    <p className="text-sm text-black leading-relaxed italic">
                                        "{prompt}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[#E0E0E0] bg-[#FAFAFA]">
                    <button className="w-full py-2.5 rounded-xl bg-[#E60000] hover:bg-[#D32F2F] text-white font-medium text-sm transition-all flex items-center justify-center gap-2">
                        I'm Prepared
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DecisionAssist;
