import React, { useState, useEffect } from 'react';
import {
    Check,
    Clock,
    AlertCircle,
    AlertTriangle,
    ChevronRight,
    User,
    Laptop,
    Building2,
    Wallet,
    Users,
    RefreshCw,
    Send,
    Mail,
    Calendar,
    Shield,
    Sparkles,
} from 'lucide-react';
import {
    PreboardingItem,
    Day1ReadinessScore,
    PreboardingCommunication,
} from '../../../types';
import {
    PREBOARDING_ITEMS,
    MOCK_READINESS_SCORE,
} from '../../../constants';

import { UserProfile } from '../../../types';

interface PreboardingOrchestratorProps {
    user: UserProfile;
    onComplete?: () => void;
}

const PreboardingOrchestrator: React.FC<PreboardingOrchestratorProps> = ({
    user,
    onComplete,
}) => {
    // Filter items based on user role
    const relevantItems = PREBOARDING_ITEMS.filter(item =>
        !item.roleCategories || (user.roleCategory && item.roleCategories.includes(user.roleCategory))
    );

    const [items, setItems] = useState<PreboardingItem[]>(relevantItems);
    const [readinessScore, setReadinessScore] = useState<Day1ReadinessScore>(MOCK_READINESS_SCORE);

    // Create mock communications
    const [communications, setCommunications] = useState<PreboardingCommunication[]>([
        {
            id: 'comm-1',
            type: 'WELCOME',
            sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            content: `Welcome to the team, ${user.name}! We're excited to have you join us.`,
            read: true,
        },
        {
            id: 'comm-2',
            type: 'LOGISTICS',
            sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            content: 'Your Day 1 logistics: Report to Building A, 2nd floor at 9:00 AM.',
            read: true,
        },
    ]);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Derived values
    const employeeName = user.name;
    const startDate = user.startDate || new Date().toISOString();
    const daysUntilStart = Math.ceil(
        (new Date(startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    // Calculate readiness score
    useEffect(() => {
        const readyItems = items.filter(i => i.status === 'READY');
        const criticalItems = items.filter(i =>
            i.category === 'IDENTITY' || i.category === 'DEVICE' || i.category === 'FACILITY'
        );
        const criticalReady = criticalItems.filter(i => i.status === 'READY');

        setReadinessScore({
            overallScore: Math.round((readyItems.length / items.length) * 100),
            criticalItemsReady: criticalReady.length,
            criticalItemsTotal: criticalItems.length,
            blockedItems: items.filter(i => i.status === 'BLOCKED'),
            lastUpdated: new Date().toISOString(),
        });
    }, [items]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        // Simulate refresh - progress some pending items
        setTimeout(() => {
            setItems(prev => prev.map(item => {
                if (item.status === 'PENDING' && Math.random() > 0.5) {
                    return { ...item, status: 'IN_PROGRESS' };
                }
                if (item.status === 'IN_PROGRESS' && Math.random() > 0.7) {
                    return { ...item, status: 'READY' };
                }
                return item;
            }));
            setIsRefreshing(false);
        }, 1500);
    };

    const handleEscalate = (itemId: string) => {
        setItems(prev => prev.map(item =>
            item.id === itemId
                ? { ...item, status: 'ESCALATED', escalatedTo: 'HR Manager' }
                : item
        ));
    };

    const getCategoryIcon = (category: PreboardingItem['category']) => {
        switch (category) {
            case 'IDENTITY': return <User className="w-5 h-5" />;
            case 'DEVICE': return <Laptop className="w-5 h-5" />;
            case 'FACILITY': return <Building2 className="w-5 h-5" />;
            case 'FINANCE': return <Wallet className="w-5 h-5" />;
            case 'TEAM': return <Users className="w-5 h-5" />;
        }
    };

    const getStatusColor = (status: PreboardingItem['status']) => {
        switch (status) {
            case 'READY': return 'text-green-400 bg-green-500/20';
            case 'IN_PROGRESS': return 'text-blue-400 bg-blue-500/20';
            case 'PENDING': return 'text-slate-400 bg-slate-500/20';
            case 'BLOCKED': return 'text-red-400 bg-red-500/20';
            case 'ESCALATED': return 'text-amber-400 bg-amber-500/20';
        }
    };

    const categories = ['IDENTITY', 'DEVICE', 'FACILITY', 'FINANCE', 'TEAM'] as const;
    const categoryLabels = {
        IDENTITY: 'Corporate Identity',
        DEVICE: 'Device & Equipment',
        FACILITY: 'Facility Access',
        FINANCE: 'Finance & Payroll',
        TEAM: 'Team Integration',
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <p className="text-blue-400 text-sm font-bold uppercase tracking-wider mb-2">
                    Day 0 — Preboarding
                </p>
                <h1 className="text-3xl font-bold text-white mb-2">
                    Welcome, {employeeName}!
                </h1>
                <p className="text-slate-400">
                    We're getting everything ready for your Day 1. Here's what's happening behind the scenes.
                </p>
            </div>

            {/* Countdown & Readiness Score */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Countdown */}
                <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                            <Calendar className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">Your First Day</p>
                            <p className="text-3xl font-bold text-white">
                                {daysUntilStart > 0 ? `${daysUntilStart} days` : 'Today!'}
                            </p>
                            <p className="text-sm text-slate-500">
                                {new Date(startDate).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Readiness Score */}
                <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-slate-400">Day 1 Readiness Score</p>
                            <p className={`text-3xl font-bold ${readinessScore.overallScore >= 80 ? 'text-green-400' :
                                readinessScore.overallScore >= 50 ? 'text-amber-400' : 'text-red-400'
                                }`}>
                                {readinessScore.overallScore}%
                            </p>
                        </div>
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all disabled:opacity-50"
                        >
                            <RefreshCw className={`w-5 h-5 text-slate-300 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
                        <div
                            className={`h-full transition-all duration-500 ${readinessScore.overallScore >= 80 ? 'bg-green-500' :
                                readinessScore.overallScore >= 50 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                            style={{ width: `${readinessScore.overallScore}%` }}
                        />
                    </div>
                    <p className="text-xs text-slate-500">
                        {readinessScore.criticalItemsReady}/{readinessScore.criticalItemsTotal} critical items ready
                    </p>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                <button
                    onClick={() => setActiveCategory(null)}
                    className={`
                        px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all
                        ${activeCategory === null
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}
                    `}
                >
                    All Items
                </button>
                {categories.map(cat => {
                    const catItems = items.filter(i => i.category === cat);
                    const catReady = catItems.filter(i => i.status === 'READY').length;

                    return (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`
                                px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all flex items-center gap-2
                                ${activeCategory === cat
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}
                            `}
                        >
                            {getCategoryIcon(cat)}
                            <span>{categoryLabels[cat]}</span>
                            <span className={`
                                px-2 py-0.5 rounded-full text-xs
                                ${catReady === catItems.length ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}
                            `}>
                                {catReady}/{catItems.length}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Item List */}
            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 overflow-hidden mb-8">
                <div className="divide-y divide-slate-700/50">
                    {items
                        .filter(item => activeCategory === null || item.category === activeCategory)
                        .map(item => (
                            <div key={item.id} className="p-4 flex items-center gap-4">
                                {/* Icon */}
                                <div className={`
                                    w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                                    ${getStatusColor(item.status)}
                                `}>
                                    {item.icon}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-white">{item.label}</p>
                                    <p className="text-sm text-slate-400">{item.description}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-slate-500">
                                            Responsible: {item.responsibleTeam}
                                        </span>
                                        {item.estimatedCompletion && item.status !== 'READY' && (
                                            <span className="text-xs text-slate-500">
                                                • ETA: {new Date(item.estimatedCompletion).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="flex items-center gap-2">
                                    {item.status === 'READY' && (
                                        <span className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 text-green-400 text-sm rounded-lg">
                                            <Check className="w-4 h-4" /> Ready
                                        </span>
                                    )}
                                    {item.status === 'IN_PROGRESS' && (
                                        <span className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 text-blue-400 text-sm rounded-lg">
                                            <Clock className="w-4 h-4" /> In Progress
                                        </span>
                                    )}
                                    {item.status === 'PENDING' && (
                                        <span className="flex items-center gap-1 px-3 py-1.5 bg-slate-500/20 text-slate-400 text-sm rounded-lg">
                                            <Clock className="w-4 h-4" /> Pending
                                        </span>
                                    )}
                                    {item.status === 'BLOCKED' && (
                                        <>
                                            <span className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 text-red-400 text-sm rounded-lg">
                                                <AlertCircle className="w-4 h-4" /> Blocked
                                            </span>
                                            <button
                                                onClick={() => handleEscalate(item.id)}
                                                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-white text-sm font-medium rounded-lg transition-all"
                                            >
                                                Escalate
                                            </button>
                                        </>
                                    )}
                                    {item.status === 'ESCALATED' && (
                                        <span className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/20 text-amber-400 text-sm rounded-lg">
                                            <AlertTriangle className="w-4 h-4" /> Escalated to {item.escalatedTo}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {/* Communications Timeline */}
            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 mb-8">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-400" />
                    Communications
                </h3>
                <div className="space-y-4">
                    {communications.map(comm => (
                        <div key={comm.id} className="flex items-start gap-4">
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                                ${comm.type === 'WELCOME' ? 'bg-purple-500/20 text-purple-400' : ''}
                                ${comm.type === 'LOGISTICS' ? 'bg-blue-500/20 text-blue-400' : ''}
                                ${comm.type === 'REMINDER' ? 'bg-amber-500/20 text-amber-400' : ''}
                                ${comm.type === 'ESCALATION' ? 'bg-red-500/20 text-red-400' : ''}
                            `}>
                                {comm.type === 'WELCOME' && <Sparkles className="w-5 h-5" />}
                                {comm.type === 'LOGISTICS' && <Building2 className="w-5 h-5" />}
                                {comm.type === 'REMINDER' && <Clock className="w-5 h-5" />}
                                {comm.type === 'ESCALATION' && <AlertTriangle className="w-5 h-5" />}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-white">{comm.content}</p>
                                <p className="text-xs text-slate-500 mt-1">
                                    {new Date(comm.sentAt).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                            {comm.read && (
                                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Help Section */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/30 p-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-medium text-white">Need Help?</h4>
                        <p className="text-sm text-slate-400">
                            If any items are blocked or you have questions, reach out to HR Support.
                        </p>
                    </div>
                    <button className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white font-medium rounded-lg transition-all flex items-center gap-2">
                        <Send className="w-4 h-4" /> Contact HR
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PreboardingOrchestrator;
