import React, { useState } from 'react';
import {
    Users,
    Send,
    Check,
    ChevronRight,
    MessageSquare,
    Mail,
    Copy,
    ExternalLink,
} from 'lucide-react';
import { UserProfile, CriticalPartner } from '../../types';
import { CRITICAL_PARTNERS } from '../../constants';

interface NetworkMapperProps {
    user: UserProfile;
    onComplete: () => void;
}

const NetworkMapper: React.FC<NetworkMapperProps> = ({ user, onComplete }) => {
    const [partners, setPartners] = useState(
        CRITICAL_PARTNERS.filter(p => !p.roleCategories || (user.roleCategory && p.roleCategories.includes(user.roleCategory)))
    );
    const [activePartner, setActivePartner] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const connectedCount = partners.filter((p) => p.connected).length;
    const allConnected = connectedCount >= 3; // Require at least 3 connections

    const handleConnect = (partnerId: string) => {
        setPartners((prev) =>
            prev.map((p) => (p.id === partnerId ? { ...p, connected: true } : p))
        );
        setActivePartner(null);
    };

    const handleCopyIcebreaker = (partner: CriticalPartner) => {
        navigator.clipboard.writeText(partner.icebreakerDraft);
        setCopiedId(partner.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getRelationshipColor = (type: CriticalPartner['relationshipType']) => {
        switch (type) {
            case 'CROSS_FUNCTIONAL':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'STAKEHOLDER':
                return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'PEER':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'MENTOR':
                return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
        }
    };

    const getPlatformIcon = (platform: CriticalPartner['platform']) => {
        switch (platform) {
            case 'SLACK':
                return <MessageSquare className="w-4 h-4" />;
            case 'TEAMS':
                return <Users className="w-4 h-4" />;
            case 'EMAIL':
                return <Mail className="w-4 h-4" />;
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <p className="text-blue-400 text-sm font-bold uppercase tracking-wider mb-2">
                    Day 4 of 5
                </p>
                <h1 className="text-3xl font-bold text-white mb-2">Team Connections</h1>
                <p className="text-slate-400">
                    We've identified your "Critical 5" — key people who'll help you succeed. Let's break the ice!
                </p>
            </div>

            {/* Progress */}
            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                            <Users className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-white">Connections Made</p>
                            <p className="text-sm text-slate-400">
                                Connect with at least 3 to continue
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-white">
                            {connectedCount}/{partners.length}
                        </p>
                        <p className="text-xs text-slate-400">Critical 5</p>
                    </div>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                        style={{ width: `${(connectedCount / partners.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Partner Cards */}
            <div className="space-y-4 mb-6">
                {partners.map((partner) => {
                    const isActive = activePartner === partner.id;

                    return (
                        <div
                            key={partner.id}
                            className={`
                bg-slate-800/50 backdrop-blur-md rounded-xl border transition-all
                ${isActive ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-slate-700/50'}
                ${partner.connected ? 'opacity-75' : ''}
              `}
                        >
                            <div className="p-4">
                                <div className="flex items-center gap-4">
                                    {/* Avatar */}
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-lg font-bold text-white">
                                        {partner.name
                                            .split(' ')
                                            .map((n) => n[0])
                                            .join('')}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-medium text-white">{partner.name}</p>
                                            {partner.connected && (
                                                <Check className="w-4 h-4 text-green-400" />
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-400">
                                            {partner.title} · {partner.department}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full border ${getRelationshipColor(
                                                    partner.relationshipType
                                                )}`}
                                            >
                                                {partner.relationshipType.replace('_', ' ')}
                                            </span>
                                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                                {getPlatformIcon(partner.platform)}
                                                {partner.platform}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action */}
                                    {!partner.connected && !isActive && (
                                        <button
                                            onClick={() => setActivePartner(partner.id)}
                                            className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white text-sm font-medium rounded-lg transition-all"
                                        >
                                            Reach Out
                                        </button>
                                    )}
                                    {partner.connected && (
                                        <div className="px-4 py-2 bg-green-500/20 text-green-400 text-sm font-medium rounded-lg flex items-center gap-2">
                                            <Check className="w-4 h-4" />
                                            Connected
                                        </div>
                                    )}
                                </div>

                                {/* Expanded Content */}
                                {isActive && (
                                    <div className="mt-4 pt-4 border-t border-slate-700 animate-fade-in">
                                        {/* Why Connect */}
                                        <div className="mb-4">
                                            <p className="text-sm font-medium text-slate-300 mb-1">
                                                Why this person?
                                            </p>
                                            <p className="text-sm text-slate-400">{partner.reason}</p>
                                        </div>

                                        {/* Icebreaker */}
                                        <div className="bg-slate-900 rounded-xl p-4 mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-sm font-medium text-slate-300">
                                                    AI-drafted Icebreaker
                                                </p>
                                                <button
                                                    onClick={() => handleCopyIcebreaker(partner)}
                                                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                                                >
                                                    {copiedId === partner.id ? (
                                                        <>
                                                            <Check className="w-3 h-3 text-green-400" />
                                                            Copied!
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-3 h-3" />
                                                            Copy
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                            <p className="text-sm text-slate-400 italic">
                                                "{partner.icebreakerDraft}"
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleConnect(partner.id)}
                                                className="flex-1 py-2 bg-purple-500 hover:bg-purple-400 text-white text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                                            >
                                                <Send className="w-4 h-4" />
                                                Send via {partner.platform}
                                            </button>
                                            <button
                                                onClick={() => setActivePartner(null)}
                                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium rounded-lg transition-all"
                                            >
                                                Cancel
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
                onClick={onComplete}
                disabled={!allConnected}
                className={`
          w-full py-3 font-semibold rounded-xl transition-all flex items-center justify-center gap-2
          ${allConnected
                        ? 'bg-blue-500 hover:bg-blue-400 text-white'
                        : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    }
        `}
            >
                {allConnected ? (
                    <>
                        Complete Day 4
                        <ChevronRight className="w-4 h-4" />
                    </>
                ) : (
                    <>Connect with at least 3 people to continue</>
                )}
            </button>
        </div>
    );
};

export default NetworkMapper;
