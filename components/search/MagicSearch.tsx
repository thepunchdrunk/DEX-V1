import React, { useState, useEffect, useRef } from 'react';
import {
    Search,
    Sparkles,
    ArrowRight,
    AlertTriangle,
    FileText,
    Ticket,
    Navigation,
    HelpCircle,
    X,
    Loader2,
} from 'lucide-react';
import { MagicSearchResult, MagicAction } from '../../types';

interface MagicSearchProps {
    onClose?: () => void;
}

// Simulated intent classification
const classifyIntent = (query: string): MagicSearchResult | null => {
    const q = query.toLowerCase();

    if (q.includes('sandbox') || q.includes('provision') || q.includes('environment')) {
        return {
            query,
            intent: 'PROVISION',
            confidence: 0.92,
            action: {
                type: 'OPEN_TICKET',
                label: 'Open Provisioning Ticket',
                description: 'Create a new sandbox environment request with your User ID pre-filled.',
                prefilled: {
                    'User ID': 'alex.thompson',
                    'Request Type': 'Sandbox Environment',
                    'Priority': 'Medium',
                },
                requiresConfirmation: true,
            },
        };
    }

    if (q.includes('jira') || q.includes('ticket') || q.includes('issue')) {
        return {
            query,
            intent: 'NAVIGATE',
            confidence: 0.88,
            action: {
                type: 'NAVIGATE',
                label: 'Open Jira Board',
                description: 'Navigate to your assigned Jira board.',
                url: 'https://jira.company.com/board/qa-team',
                requiresConfirmation: false,
            },
        };
    }

    if (q.includes('doc') || q.includes('create') || q.includes('new')) {
        return {
            query,
            intent: 'CREATE',
            confidence: 0.85,
            action: {
                type: 'CREATE_DOCUMENT',
                label: 'Create New Document',
                description: 'Start a new document in Confluence.',
                url: 'https://confluence.company.com/new',
                requiresConfirmation: false,
            },
        };
    }

    if (q.includes('help') || q.includes('how') || q.includes('what')) {
        return {
            query,
            intent: 'HELP',
            confidence: 0.78,
            action: {
                type: 'SHOW_INFO',
                label: 'View Help Article',
                description: 'Show relevant help documentation.',
                requiresConfirmation: false,
            },
        };
    }

    if (q.length > 5) {
        return {
            query,
            intent: 'SEARCH',
            confidence: 0.65,
            action: {
                type: 'SHOW_INFO',
                label: 'Search Knowledge Base',
                description: 'Search for relevant information across all systems.',
                requiresConfirmation: false,
            },
        };
    }

    return null;
};

const MagicSearch: React.FC<MagicSearchProps> = ({ onClose }) => {
    const [query, setQuery] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<MagicSearchResult | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (query.length < 3) {
            setResult(null);
            return;
        }

        const timer = setTimeout(() => {
            setIsProcessing(true);
            // Simulate AI processing
            setTimeout(() => {
                setResult(classifyIntent(query));
                setIsProcessing(false);
            }, 400);
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const getIntentIcon = (intent: MagicSearchResult['intent']) => {
        switch (intent) {
            case 'PROVISION':
                return <Ticket className="w-5 h-5" />;
            case 'NAVIGATE':
                return <Navigation className="w-5 h-5" />;
            case 'CREATE':
                return <FileText className="w-5 h-5" />;
            case 'SEARCH':
                return <Search className="w-5 h-5" />;
            case 'HELP':
                return <HelpCircle className="w-5 h-5" />;
        }
    };

    const getIntentColor = (intent: MagicSearchResult['intent']) => {
        switch (intent) {
            case 'PROVISION':
                return 'text-purple-400 bg-purple-500/20';
            case 'NAVIGATE':
                return 'text-blue-400 bg-blue-500/20';
            case 'CREATE':
                return 'text-green-400 bg-green-500/20';
            case 'SEARCH':
                return 'text-slate-400 bg-slate-500/20';
            case 'HELP':
                return 'text-amber-400 bg-amber-500/20';
        }
    };

    const handleExecute = () => {
        if (!result) return;

        if (result.action.requiresConfirmation && !showConfirmation) {
            setShowConfirmation(true);
            return;
        }

        // Execute the action
        console.log('Executing action:', result.action);
        if (result.action.url) {
            window.open(result.action.url, '_blank');
        }
        setQuery('');
        setResult(null);
        setShowConfirmation(false);
        onClose?.();
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Search Input */}
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    {isProcessing ? (
                        <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                    ) : (
                        <Sparkles className="w-5 h-5 text-amber-400" />
                    )}
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder='Quick Actions — Try "I need a sandbox" or "Open Jira"'
                    className="w-full pl-12 pr-12 py-4 bg-slate-900 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all text-lg"
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery('');
                            setResult(null);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Result Preview */}
            {result && !showConfirmation && (
                <div className="mt-4 bg-slate-800/80 backdrop-blur-md rounded-xl border border-slate-700 p-4 animate-fade-in">
                    <div className="flex items-start gap-4">
                        {/* Intent Icon */}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getIntentColor(result.intent)}`}>
                            {getIntentIcon(result.intent)}
                        </div>

                        {/* Action Details */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-slate-400 uppercase">
                                    {result.intent.replace('_', ' ')}
                                </span>
                                <span className="text-xs text-slate-500">
                                    {Math.round(result.confidence * 100)}% confidence
                                </span>
                            </div>
                            <p className="font-semibold text-white mb-1">{result.action.label}</p>
                            <p className="text-sm text-slate-400">{result.action.description}</p>

                            {/* Pre-filled Fields */}
                            {result.action.prefilled && (
                                <div className="mt-3 p-3 bg-slate-900/50 rounded-lg">
                                    <p className="text-xs text-slate-500 mb-2">Pre-filled fields:</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.entries(result.action.prefilled).map(([key, value]) => (
                                            <div key={key} className="text-xs">
                                                <span className="text-slate-500">{key}:</span>{' '}
                                                <span className="text-white">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Execute Button */}
                        <button
                            onClick={handleExecute}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white font-medium rounded-lg transition-all flex items-center gap-2"
                        >
                            Execute
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Warning for high-impact actions */}
                    {result.action.requiresConfirmation && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-amber-400">
                            <AlertTriangle className="w-3 h-3" />
                            <span>This action requires confirmation</span>
                        </div>
                    )}
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmation && result && (
                <div className="mt-4 bg-amber-500/10 backdrop-blur-md rounded-xl border border-amber-500/30 p-4 animate-fade-in">
                    <div className="flex items-center gap-2 text-amber-400 mb-3">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="font-medium">Confirm Action</span>
                    </div>
                    <p className="text-slate-300 mb-4">
                        You're about to: <strong>{result.action.label}</strong>
                    </p>
                    <p className="text-sm text-slate-400 mb-4">{result.action.description}</p>
                    <div className="flex gap-3">
                        <button
                            onClick={handleExecute}
                            className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-white font-medium rounded-lg transition-all"
                        >
                            Confirm & Execute
                        </button>
                        <button
                            onClick={() => setShowConfirmation(false)}
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium rounded-lg transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Empty State Suggestions */}
            {!query && (
                <div className="mt-4 text-center">
                    <p className="text-sm text-slate-500 mb-3">Try saying:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {[
                            'I need a sandbox',
                            'Open my Jira board',
                            'Create a new doc',
                            'How do I request access?',
                        ].map((suggestion) => (
                            <button
                                key={suggestion}
                                onClick={() => setQuery(suggestion)}
                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-sm rounded-lg transition-all"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MagicSearch;
