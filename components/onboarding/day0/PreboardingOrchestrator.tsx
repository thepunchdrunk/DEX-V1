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

    const refreshStatus = () => {
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
            case 'READY': return 'text-[#4CAF50] bg-[#E8F5E9]';
            case 'IN_PROGRESS': return 'text-[#E60000] bg-red-50';
            case 'PENDING': return 'text-[#9E9E9E] bg-[#F5F5F5]';
            case 'BLOCKED': return 'text-[#D32F2F] bg-[#FFEBEE]';
            case 'ESCALATED': return 'text-[#FF9800] bg-[#FFF3E0]';
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
                <p className="text-[#E60000] text-sm font-bold uppercase tracking-wider mb-2">
                    Day 0 — Preboarding
                </p>
                <h1 className="text-3xl font-bold text-black mb-2">
                    Welcome, {employeeName}!
                </h1>
                <p className="text-[#616161]">
                    We're getting everything ready for your Day 1. Here's what's happening behind the scenes.
                </p>
            </div>

            {/* Countdown & Readiness Score */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Countdown */}
                <div className="bg-white rounded-2xl border border-[#E0E0E0] p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center border border-red-100">
                            <Calendar className="w-8 h-8 text-[#E60000]" />
                        </div>
                        <div>
                            <p className="text-sm text-[#757575]">Your First Day</p>
                            <p className="text-3xl font-bold text-black">
                                {daysUntilStart > 0 ? `${daysUntilStart} days` : 'Today!'}
                            </p>
                            <p className="text-sm text-[#9E9E9E]">
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
                <div className="bg-white rounded-2xl border border-[#E0E0E0] p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-[#757575]">Day 1 Readiness Score</p>
                            <p className={`text-3xl font-bold ${readinessScore.overallScore >= 80 ? 'text-[#4CAF50]' :
                                readinessScore.overallScore >= 50 ? 'text-[#FF9800]' : 'text-[#D32F2F]'
                                }`}>
                                {readinessScore.overallScore}%
                            </p>
                        </div>
                        <button
                            onClick={refreshStatus}
                            disabled={isRefreshing}
                            className="p-2 bg-[#FAFAFA] hover:bg-[#F5F5F5] border border-[#E0E0E0] rounded-lg transition-all disabled:opacity-50"
                        >
                            <RefreshCw className={`w-5 h-5 text-[#757575] ${isRefreshing ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                    <div className="h-2 bg-[#F5F5F5] rounded-full overflow-hidden mb-2">
                        <div
                            className={`h-full transition-all duration-500 ${readinessScore.overallScore >= 80 ? 'bg-[#4CAF50]' :
                                readinessScore.overallScore >= 50 ? 'bg-[#FF9800]' : 'bg-[#D32F2F]'
                                }`}
                            style={{ width: `${readinessScore.overallScore}%` }}
                        />
                    </div>
                    <p className="text-xs text-[#9E9E9E]">
                        {readinessScore.criticalItemsReady}/{readinessScore.criticalItemsTotal} critical items ready
                    </p>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                <button
                    onClick={() => setActiveCategory(null)}
                    className={`
                        px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all shadow-sm
                        ${activeCategory === null
                            ? 'bg-[#E60000] text-white shadow-md'
                            : 'bg-white text-[#757575] border border-[#E0E0E0] hover:bg-[#FAFAFA]'}
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
                                px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all flex items-center gap-2 shadow-sm
                                ${activeCategory === cat
                                    ? 'bg-[#E60000] text-white shadow-md'
                                    : 'bg-white text-[#757575] border border-[#E0E0E0] hover:bg-[#FAFAFA]'}
                            `}
                        >
                            {getCategoryIcon(cat)}
                            <span>{categoryLabels[cat]}</span>
                            <span className={`
                                px-2 py-0.5 rounded-full text-xs
                                ${catReady === catItems.length
                                    ? (activeCategory === cat ? 'bg-white/20 text-white' : 'bg-[#E8F5E9] text-[#4CAF50]')
                                    : (activeCategory === cat ? 'bg-white/20 text-white' : 'bg-[#F5F5F5] text-[#9E9E9E]')}
                            `}>
                                {catReady}/{catItems.length}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Item List */}
            <div className="bg-white rounded-2xl border border-[#E0E0E0] overflow-hidden mb-8 shadow-sm">
                <div className="divide-y divide-[#E0E0E0]">
                    {items
                        .filter(item => activeCategory === null || item.category === activeCategory)
                        .map(item => (
                            <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-[#FAFAFA] transition-colors">
                                {/* Icon */}
                                <div className={`
                                    w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                                    ${getStatusColor(item.status)}
                                `}>
                                    {item.icon}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-black">{item.label}</p>
                                    <p className="text-sm text-[#757575]">{item.description}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-[#9E9E9E]">
                                            Responsible: {item.responsibleTeam}
                                        </span>
                                        {item.estimatedCompletion && item.status !== 'READY' && (
                                            <span className="text-xs text-[#9E9E9E]">
                                                • ETA: {new Date(item.estimatedCompletion).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="flex items-center gap-2">
                                    {item.status === 'READY' && (
                                        <span className="flex items-center gap-1 px-3 py-1.5 bg-[#E8F5E9] text-[#4CAF50] text-sm rounded-lg border border-green-100">
                                            <Check className="w-4 h-4" /> Ready
                                        </span>
                                    )}
                                    {item.status === 'IN_PROGRESS' && (
                                        <span className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-[#E60000] text-sm rounded-lg border border-red-100">
                                            <Clock className="w-4 h-4" /> In Progress
                                        </span>
                                    )}
                                    {item.status === 'PENDING' && (
                                        <span className="flex items-center gap-1 px-3 py-1.5 bg-[#F5F5F5] text-[#9E9E9E] text-sm rounded-lg border border-[#E0E0E0]">
                                            <Clock className="w-4 h-4" /> Pending
                                        </span>
                                    )}
                                    {item.status === 'BLOCKED' && (
                                        <>
                                            <span className="flex items-center gap-1 px-3 py-1.5 bg-[#FFEBEE] text-[#D32F2F] text-sm rounded-lg border border-red-100">
                                                <AlertCircle className="w-4 h-4" /> Blocked
                                            </span>
                                            <button
                                                onClick={() => handleEscalate(item.id)}
                                                className="px-3 py-1.5 bg-[#FF9800] hover:bg-[#F57C00] text-white text-sm font-medium rounded-lg transition-all shadow-sm"
                                            >
                                                Escalate
                                            </button>
                                        </>
                                    )}
                                    {item.status === 'ESCALATED' && (
                                        <span className="flex items-center gap-1 px-3 py-1.5 bg-[#FFF3E0] text-[#FF9800] text-sm rounded-lg border border-orange-100">
                                            <AlertTriangle className="w-4 h-4" /> Escalated to {item.escalatedTo}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {/* Communications Timeline */}
            <div className="bg-white rounded-2xl border border-[#E0E0E0] p-6 mb-8 shadow-sm">
                <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[#E60000]" />
                    Communications
                </h3>
                <div className="space-y-4">
                    {communications.map(comm => (
                        <div key={comm.id} className="flex items-start gap-4">
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border
                                ${comm.type === 'WELCOME' ? 'bg-purple-50 text-purple-600 border-purple-100' : ''}
                                ${comm.type === 'LOGISTICS' ? 'bg-blue-50 text-blue-600 border-blue-100' : ''}
                                ${comm.type === 'REMINDER' ? 'bg-orange-50 text-orange-600 border-orange-100' : ''}
                                ${comm.type === 'ESCALATION' ? 'bg-red-50 text-red-600 border-red-100' : ''}
                            `}>
                                {comm.type === 'WELCOME' && <Sparkles className="w-5 h-5" />}
                                {comm.type === 'LOGISTICS' && <Building2 className="w-5 h-5" />}
                                {comm.type === 'REMINDER' && <Clock className="w-5 h-5" />}
                                {comm.type === 'ESCALATION' && <AlertTriangle className="w-5 h-5" />}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-black">{comm.content}</p>
                                <p className="text-xs text-[#9E9E9E] mt-1">
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
                                <Check className="w-4 h-4 text-[#4CAF50] flex-shrink-0" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Help Section */}
            <div className="bg-[#E3F2FD] rounded-2xl border border-[#BBDEFB] p-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#BBDEFB] flex items-center justify-center">
                        <Shield className="w-6 h-6 text-[#1E88E5]" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-medium text-[#0D47A1]">Need Help?</h4>
                        <p className="text-sm text-[#546E7A]">
                            If any items are blocked or you have questions, reach out to HR Support.
                        </p>
                    </div>
                    <button className="px-4 py-2 bg-[#1E88E5] hover:bg-[#1976D2] text-white font-medium rounded-lg transition-all flex items-center gap-2 shadow-sm">
                        <Send className="w-4 h-4" /> Contact HR
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PreboardingOrchestrator;
