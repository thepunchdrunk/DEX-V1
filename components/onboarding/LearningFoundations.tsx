import React, { useState } from 'react';
import {
    BookOpen,
    Play,
    Check,
    ChevronRight,
    Clock,
    Video,
    FileText,
    Code,
} from 'lucide-react';
import { UserProfile, LearningModule } from '../../types';

interface LearningFoundationsProps {
    user: UserProfile;
    onComplete: () => void;
}

const LEARNING_MODULES: LearningModule[] = [
    {
        id: 'lm-1',
        title: 'Engineering Team Overview',
        description: 'Meet the engineering org structure and key leaders.',
        duration: 10,
        type: 'VIDEO',
        completed: false,
    },
    {
        id: 'lm-2',
        title: 'Development Workflow',
        description: 'Git branching strategy, PR process, and CI/CD pipelines.',
        duration: 15,
        type: 'READING',
        completed: false,
    },
    {
        id: 'lm-3',
        title: 'QA Best Practices',
        description: 'Our testing philosophy, automation standards, and tools.',
        duration: 20,
        type: 'INTERACTIVE',
        completed: false,
    },
    {
        id: 'lm-4',
        title: 'Security & Compliance',
        description: 'Required security training for all engineering roles.',
        duration: 15,
        type: 'VIDEO',
        completed: false,
    },
];

const LearningFoundations: React.FC<LearningFoundationsProps> = ({
    user,
    onComplete,
}) => {
    const [modules, setModules] = useState(LEARNING_MODULES);
    const [activeModule, setActiveModule] = useState<string | null>(null);

    const getModuleIcon = (type: LearningModule['type']) => {
        switch (type) {
            case 'VIDEO':
                return <Video className="w-5 h-5" />;
            case 'READING':
                return <FileText className="w-5 h-5" />;
            case 'INTERACTIVE':
                return <Code className="w-5 h-5" />;
        }
    };

    const handleStartModule = (moduleId: string) => {
        setActiveModule(moduleId);
    };

    const handleCompleteModule = (moduleId: string) => {
        setModules((prev) =>
            prev.map((m) => (m.id === moduleId ? { ...m, completed: true } : m))
        );
        setActiveModule(null);
    };

    const allCompleted = modules.every((m) => m.completed);
    const completedCount = modules.filter((m) => m.completed).length;
    const totalDuration = modules.reduce((acc, m) => acc + m.duration, 0);
    const completedDuration = modules
        .filter((m) => m.completed)
        .reduce((acc, m) => acc + m.duration, 0);

    const handleCompleteDay = () => {
        onComplete();
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <p className="text-blue-400 text-sm font-bold uppercase tracking-wider mb-2">
                    Day 3 of 5
                </p>
                <h1 className="text-3xl font-bold text-white mb-2">Learning Foundations</h1>
                <p className="text-slate-400">
                    Core knowledge modules to get you up to speed with tools and processes.
                </p>
            </div>

            {/* Progress Card */}
            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-white">Learning Progress</p>
                            <p className="text-sm text-slate-400">
                                {completedDuration} of {totalDuration} minutes completed
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-white">
                            {completedCount}/{modules.length}
                        </p>
                        <p className="text-xs text-slate-400">Modules</p>
                    </div>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                        style={{ width: `${(completedCount / modules.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Module List */}
            <div className="space-y-3 mb-6">
                {modules.map((module) => {
                    const isActive = activeModule === module.id;

                    return (
                        <div
                            key={module.id}
                            className={`
                bg-slate-800/50 backdrop-blur-md rounded-xl border transition-all
                ${isActive ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-700/50'}
                ${module.completed ? 'opacity-75' : ''}
              `}
                        >
                            <div className="p-4">
                                <div className="flex items-center gap-4">
                                    {/* Icon */}
                                    <div
                                        className={`
                      w-12 h-12 rounded-xl flex items-center justify-center
                      ${module.completed
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-slate-700 text-slate-400'
                                            }
                    `}
                                    >
                                        {module.completed ? (
                                            <Check className="w-6 h-6" />
                                        ) : (
                                            getModuleIcon(module.type)
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <p className="font-medium text-white">{module.title}</p>
                                        <p className="text-sm text-slate-400">{module.description}</p>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {module.duration} min
                                            </span>
                                            <span className="capitalize">{module.type.toLowerCase()}</span>
                                        </div>
                                    </div>

                                    {/* Action */}
                                    {!module.completed && !isActive && (
                                        <button
                                            onClick={() => handleStartModule(module.id)}
                                            className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2"
                                        >
                                            <Play className="w-4 h-4" />
                                            Start
                                        </button>
                                    )}
                                    {module.completed && (
                                        <div className="px-4 py-2 bg-green-500/20 text-green-400 text-sm font-medium rounded-lg flex items-center gap-2">
                                            <Check className="w-4 h-4" />
                                            Done
                                        </div>
                                    )}
                                </div>

                                {/* Active Module Content */}
                                {isActive && (
                                    <div className="mt-4 pt-4 border-t border-slate-700 animate-fade-in">
                                        <div className="bg-slate-900 rounded-xl p-6 text-center">
                                            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                                                {getModuleIcon(module.type)}
                                            </div>
                                            <p className="text-slate-400 mb-4">
                                                {module.type === 'VIDEO' && 'Video player would load here...'}
                                                {module.type === 'READING' && 'Document viewer would load here...'}
                                                {module.type === 'INTERACTIVE' && 'Interactive exercise would load here...'}
                                            </p>
                                            <p className="text-xs text-slate-500 mb-4">
                                                (Demo: Click complete to simulate finishing this module)
                                            </p>
                                            <button
                                                onClick={() => handleCompleteModule(module.id)}
                                                className="px-6 py-2 bg-green-500 hover:bg-green-400 text-white font-medium rounded-lg transition-all"
                                            >
                                                Mark as Complete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Complete Day Button */}
            <button
                onClick={handleCompleteDay}
                disabled={!allCompleted}
                className={`
          w-full py-3 font-semibold rounded-xl transition-all flex items-center justify-center gap-2
          ${allCompleted
                        ? 'bg-blue-500 hover:bg-blue-400 text-white'
                        : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    }
        `}
            >
                {allCompleted ? (
                    <>
                        Complete Day 3
                        <ChevronRight className="w-4 h-4" />
                    </>
                ) : (
                    <>Complete all modules to continue</>
                )}
            </button>
        </div>
    );
};

export default LearningFoundations;
