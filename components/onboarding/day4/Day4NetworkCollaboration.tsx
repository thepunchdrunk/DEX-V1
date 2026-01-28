import React, { useState } from 'react';
import {
    ChevronRight,
    Check,
    Users,
    Network,
    Mail,
    Calendar,
    Star,
    Heart,
    Clock,
    MessageSquare,
    Send,
    Coffee,
    Sparkles,
    Target,
    ChevronDown,
    ChevronUp,
    User,
    Building,
    Eye,
} from 'lucide-react';
import {
    UserProfile,
    Critical5Contact,
    StakeholderNode,
    TeamRitual,
    CollaborationNorm,
    PeerCohort,
} from '../../../types';
import {
    CRITICAL_5_CONTACTS,
    STAKEHOLDER_NODES,
    TEAM_RITUALS,
    COLLABORATION_NORMS,
    PEER_COHORT,
} from '../../../constants';

interface Day4NetworkCollaborationProps {
    user: UserProfile;
    onComplete: () => void;
}

type Phase = 'CRITICAL5' | 'STAKEHOLDERS' | 'RITUALS' | 'NORMS' | 'COHORT' | 'DONE';

const Day4NetworkCollaboration: React.FC<Day4NetworkCollaborationProps> = ({ user, onComplete }) => {
    const [phase, setPhase] = useState<Phase>('CRITICAL5');
    const [contacts, setContacts] = useState<Critical5Contact[]>(CRITICAL_5_CONTACTS);
    const [stakeholders] = useState<StakeholderNode[]>(STAKEHOLDER_NODES);
    const [rituals, setRituals] = useState<TeamRitual[]>(TEAM_RITUALS);
    const [norms] = useState<CollaborationNorm[]>(COLLABORATION_NORMS);
    const [cohort, setCohort] = useState<PeerCohort>(PEER_COHORT);
    const [expandedContact, setExpandedContact] = useState<string | null>(null);
    const [messageInputs, setMessageInputs] = useState<Record<string, string>>({});

    // Track completions
    const introDraftsSent = contacts.filter(c => c.introSent).length;
    const ritualsAcknowledged = rituals.filter(r => r.acknowledged).length;

    const canComplete = introDraftsSent >= 3 && ritualsAcknowledged >= 2;

    const handleSendIntro = (contactId: string) => {
        setContacts(prev => prev.map(c =>
            c.id === contactId ? { ...c, introSent: true, introSentAt: new Date().toISOString() } : c
        ));
    };

    const handleAcknowledgeRitual = (ritualId: string) => {
        setRituals(prev => prev.map(r =>
            r.id === ritualId ? { ...r, acknowledged: true } : r
        ));
    };

    const handleConnectPeer = (peerId: string) => {
        setCohort(prev => ({
            ...prev,
            peers: prev.peers.map(p =>
                p.id === peerId ? { ...p, connected: true, connectedAt: new Date().toISOString() } : p
            )
        }));
    };

    const handleCompletePhase = (current: Phase, next: Phase) => {
        setPhase(next);
    };

    const handleCompleteDay = () => {
        setPhase('DONE');
        setTimeout(onComplete, 1500);
    };

    const getRelationshipColor = (type: Critical5Contact['relationship']) => {
        switch (type) {
            case 'MANAGER': return 'border-blue-500 bg-blue-50';
            case 'MENTOR': return 'border-purple-500 bg-purple-50';
            case 'PEER': return 'border-[#4CAF50] bg-[#E8F5E9]';
            case 'STAKEHOLDER': return 'border-[#E65100] bg-[#FFF3E0]';
            case 'BUDDY': return 'border-pink-500 bg-pink-50';
        }
    };

    const getRelationshipIcon = (type: Critical5Contact['relationship']) => {
        switch (type) {
            case 'MANAGER': return '👤';
            case 'MENTOR': return '🎓';
            case 'PEER': return '🤝';
            case 'STAKEHOLDER': return '🎯';
            case 'BUDDY': return '👋';
        }
    };

    const renderCritical5Phase = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-black flex items-center gap-2">
                    <Star className="w-6 h-6 text-[#E60000]" />
                    Your Critical 5
                </h3>
                <p className="text-[#616161] text-sm mt-1">
                    These 5 people are essential to your success in the first 90 days. Build strong relationships early.
                </p>
            </div>

            <div className="space-y-4">
                {contacts.map((contact) => (
                    <div
                        key={contact.id}
                        className={`rounded-xl border-2 transition-all ${getRelationshipColor(contact.relationship)}`}
                    >
                        <button
                            onClick={() => setExpandedContact(expandedContact === contact.id ? null : contact.id)}
                            className="w-full p-4 flex items-center gap-4"
                        >
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                {contact.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1 text-left">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-black">{contact.name}</h4>
                                    <span className="text-sm">{getRelationshipIcon(contact.relationship)}</span>
                                    <span className="text-xs px-2 py-0.5 bg-[#E0E0E0] text-[#616161] rounded">
                                        {contact.relationship}
                                    </span>
                                </div>
                                <p className="text-sm text-[#616161]">{contact.title}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {contact.introSent && (
                                    <span className="text-[#4CAF50] text-sm flex items-center gap-1">
                                        <Check className="w-4 h-4" /> Intro sent
                                    </span>
                                )}
                                {expandedContact === contact.id ? (
                                    <ChevronUp className="w-5 h-5 text-[#616161]" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-[#616161]" />
                                )}
                            </div>
                        </button>

                        {/* Expanded View */}
                        {expandedContact === contact.id && (
                            <div className="px-4 pb-4 border-t border-[#E0E0E0]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    {/* Why They Matter */}
                                    <div>
                                        <p className="text-sm text-[#9E9E9E] mb-2">Why they matter:</p>
                                        <p className="text-sm text-[#616161]">{contact.whyTheyMatter}</p>
                                    </div>

                                    {/* Suggested Topics */}
                                    <div>
                                        <p className="text-sm text-[#9E9E9E] mb-2">Conversation starters:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {contact.suggestedTopics.map((topic, i) => (
                                                <span key={i} className="text-xs px-2 py-1 bg-[#F5F5F5] text-[#616161] rounded">
                                                    {topic}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Communication Preferences */}
                                <div className="mt-4 p-3 bg-white rounded-lg border border-[#E0E0E0]">
                                    <p className="text-xs text-[#9E9E9E] mb-2">Communication preferences:</p>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="text-[#616161]">
                                            📧 Preferred: {contact.communicationPreference.preferredChannel}
                                        </span>
                                        <span className="text-[#9E9E9E]">
                                            🕐 {contact.communicationPreference.bestTimeToReach}
                                        </span>
                                    </div>
                                    {contact.communicationPreference.quirks && (
                                        <p className="text-xs text-[#E65100] mt-2">
                                            💡 {contact.communicationPreference.quirks}
                                        </p>
                                    )}
                                </div>

                                {/* Introduction Message */}
                                {!contact.introSent && (
                                    <div className="mt-4">
                                        <p className="text-sm text-[#9E9E9E] mb-2">Auto-generated intro message:</p>
                                        <div className="bg-white rounded-lg p-3 border border-[#E0E0E0]">
                                            <p className="text-sm text-[#616161]">
                                                {messageInputs[contact.id] || contact.introTemplate}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleSendIntro(contact.id)}
                                            className="mt-3 w-full py-2 bg-[#E60000] hover:bg-[#CC0000] text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                                        >
                                            <Send className="w-4 h-4" /> Send Introduction
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between pt-4">
                <span className="text-sm text-[#616161]">
                    {introDraftsSent}/5 introductions sent
                </span>
                <button
                    onClick={() => handleCompletePhase('CRITICAL5', 'STAKEHOLDERS')}
                    disabled={introDraftsSent < 3}
                    className={`
                        px-6 py-2 font-medium rounded-xl transition-all flex items-center gap-2
                        ${introDraftsSent >= 3
                            ? 'bg-[#E60000] hover:bg-[#CC0000] text-white'
                            : 'bg-[#E0E0E0] text-[#9E9E9E] cursor-not-allowed'}
                    `}
                >
                    Continue <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );

    const renderStakeholdersPhase = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-black flex items-center gap-2">
                    <Network className="w-6 h-6 text-[#E60000]" />
                    Your Stakeholder Map
                </h3>
                <p className="text-[#616161] text-sm mt-1">
                    Understanding the landscape of people who influence and are influenced by your work.
                </p>
            </div>

            {/* Visual Network Map */}
            <div className="bg-[#FAFAFA] rounded-2xl border border-[#E0E0E0] p-6 min-h-[400px] relative">
                {/* Center - You */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#E60000] to-[#CC0000] flex items-center justify-center text-white font-bold border-4 border-white shadow-xl">
                        {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <p className="text-center text-xs text-[#616161] mt-2">You</p>
                </div>

                {/* Stakeholder Nodes */}
                {stakeholders.map((node, index) => {
                    const angle = (index / stakeholders.length) * 2 * Math.PI - Math.PI / 2;
                    const radius = node.circle === 'INNER' ? 120 : node.circle === 'MIDDLE' ? 180 : 240;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;

                    return (
                        <div
                            key={node.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2"
                            style={{
                                top: `calc(50% + ${y}px)`,
                                left: `calc(50% + ${x}px)`,
                            }}
                        >
                            <div className={`
                                w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold border-2 cursor-pointer transition-all hover:scale-110
                                ${node.circle === 'INNER' ? 'bg-[#E60000]/80 border-[#E60000] text-white' : ''}
                                ${node.circle === 'MIDDLE' ? 'bg-purple-500/80 border-purple-400 text-white' : ''}
                                ${node.circle === 'OUTER' ? 'bg-[#9E9E9E]/80 border-[#9E9E9E] text-white' : ''}
                            `}>
                                {node.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <p className="text-center text-xs text-[#616161] mt-1 whitespace-nowrap">
                                {node.name.split(' ')[0]}
                            </p>
                        </div>
                    );
                })}

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 text-xs border border-[#E0E0E0]">
                    <p className="text-[#616161] mb-2">Circle proximity = interaction frequency</p>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full bg-[#E60000]"></div>
                        <span className="text-[#616161]">Inner (Daily)</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-[#616161]">Middle (Weekly)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#9E9E9E]"></div>
                        <span className="text-[#616161]">Outer (Monthly)</span>
                    </div>
                </div>
            </div>

            {/* Stakeholder List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {stakeholders.map((node) => (
                    <div key={node.id} className="bg-[#FAFAFA] rounded-lg border border-[#E0E0E0] p-3 flex items-center gap-3">
                        <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold
                            ${node.circle === 'INNER' ? 'bg-[#E60000]' : ''}
                            ${node.circle === 'MIDDLE' ? 'bg-purple-500' : ''}
                            ${node.circle === 'OUTER' ? 'bg-[#9E9E9E]' : ''}
                        `}>
                            {node.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-black truncate">{node.name}</p>
                            <p className="text-xs text-[#616161] truncate">{node.title}</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-[#E0E0E0] text-[#616161] rounded">
                            {node.interactionType}
                        </span>
                    </div>
                ))}
            </div>

            <button
                onClick={() => handleCompletePhase('STAKEHOLDERS', 'RITUALS')}
                className="w-full py-3 bg-[#E60000] hover:bg-[#CC0000] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
                Continue to Team Rituals <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );

    const renderRitualsPhase = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-black flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-[#4CAF50]" />
                    Team Rituals
                </h3>
                <p className="text-[#616161] text-sm mt-1">
                    These recurring events keep the team connected and aligned.
                </p>
            </div>

            <div className="space-y-4">
                {rituals.map((ritual) => (
                    <div
                        key={ritual.id}
                        className={`
                            bg-[#FAFAFA] rounded-xl border p-5 transition-all
                            ${ritual.acknowledged ? 'border-[#4CAF50]/30' : 'border-[#E0E0E0]'}
                        `}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`
                                w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                                ${ritual.type === 'STANDUP' ? 'bg-blue-500/20' : ''}
                                ${ritual.type === 'RETROSPECTIVE' ? 'bg-purple-500/20' : ''}
                                ${ritual.type === 'PLANNING' ? 'bg-amber-500/20' : ''}
                                ${ritual.type === 'SOCIAL' ? 'bg-pink-500/20' : ''}
                                ${ritual.type === 'REVIEW' ? 'bg-green-500/20' : ''}
                            `}>
                                {ritual.type === 'STANDUP' && '📊'}
                                {ritual.type === 'RETROSPECTIVE' && '🔄'}
                                {ritual.type === 'PLANNING' && '📋'}
                                {ritual.type === 'SOCIAL' && '🎉'}
                                {ritual.type === 'REVIEW' && '👀'}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium text-black">{ritual.name}</h4>
                                    <span className="text-xs px-2 py-0.5 bg-[#E0E0E0] text-[#616161] rounded">
                                        {ritual.frequency}
                                    </span>
                                </div>
                                <p className="text-sm text-[#616161] mb-2">{ritual.description}</p>
                                <div className="flex items-center gap-4 text-xs text-[#9E9E9E]">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {ritual.duration}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        {ritual.participants.length} participants
                                    </span>
                                </div>

                                {/* Expectations */}
                                <div className="mt-3 p-3 bg-white rounded-lg border border-[#E0E0E0]">
                                    <p className="text-xs text-[#9E9E9E] mb-1">Your expected participation:</p>
                                    <p className="text-sm text-[#616161]">{ritual.newHireExpectations}</p>
                                </div>
                            </div>
                            <div>
                                {ritual.acknowledged ? (
                                    <span className="flex items-center gap-1 text-[#4CAF50] text-sm">
                                        <Check className="w-4 h-4" /> Added
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => handleAcknowledgeRitual(ritual.id)}
                                        className="px-3 py-1.5 bg-[#4CAF50] hover:bg-[#43A047] text-white text-sm font-medium rounded-lg transition-all flex items-center gap-1"
                                    >
                                        <Calendar className="w-4 h-4" /> Add to Calendar
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between pt-4">
                <span className="text-sm text-[#616161]">
                    {ritualsAcknowledged}/{rituals.length} rituals added
                </span>
                <button
                    onClick={() => handleCompletePhase('RITUALS', 'NORMS')}
                    disabled={ritualsAcknowledged < 2}
                    className={`
                        px-6 py-2 font-medium rounded-xl transition-all flex items-center gap-2
                        ${ritualsAcknowledged >= 2
                            ? 'bg-[#E60000] hover:bg-[#CC0000] text-white'
                            : 'bg-[#E0E0E0] text-[#9E9E9E] cursor-not-allowed'}
                    `}
                >
                    Continue <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );

    const renderNormsPhase = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-black flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-[#E60000]" />
                    Collaboration Norms
                </h3>
                <p className="text-[#616161] text-sm mt-1">
                    How your team works together effectively.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {norms.map((norm) => (
                    <div
                        key={norm.id}
                        className="bg-[#FAFAFA] rounded-xl border border-[#E0E0E0] p-5"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-xl">
                                {norm.category === 'COMMUNICATION' && '💬'}
                                {norm.category === 'MEETINGS' && '📅'}
                                {norm.category === 'FEEDBACK' && '📝'}
                                {norm.category === 'WORK_HOURS' && '🕐'}
                                {norm.category === 'COLLABORATION' && '🤝'}
                            </div>
                            <h4 className="font-medium text-black">{norm.title}</h4>
                        </div>
                        <p className="text-sm text-[#616161] mb-3">{norm.description}</p>
                        <div className="space-y-2">
                            {norm.examples.map((ex, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs">
                                    <span className="text-[#E60000]">•</span>
                                    <span className="text-[#616161]">{ex}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={() => handleCompletePhase('NORMS', 'COHORT')}
                className="w-full py-3 bg-[#E60000] hover:bg-[#CC0000] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
                Continue to Peer Cohort <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );

    const renderCohortPhase = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-black flex items-center gap-2">
                    <Users className="w-6 h-6 text-pink-500" />
                    Your Onboarding Cohort
                </h3>
                <p className="text-[#616161] text-sm mt-1">
                    Other new hires who started around the same time. You're not alone in this journey!
                </p>
            </div>

            {/* Cohort Name */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200 p-6 text-center">
                <p className="text-sm text-[#616161] mb-1">You're part of</p>
                <h4 className="text-2xl font-bold text-black mb-2">{cohort.cohortName}</h4>
                <p className="text-[#616161]">Started: {new Date(cohort.startDate).toLocaleDateString()}</p>
            </div>

            {/* Peer Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cohort.peers.map((peer) => (
                    <div
                        key={peer.id}
                        className={`
                            bg-[#FAFAFA] rounded-xl border p-5 transition-all
                            ${peer.connected ? 'border-[#4CAF50]/30' : 'border-[#E0E0E0]'}
                        `}
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold">
                                {peer.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-black">{peer.name}</h4>
                                <p className="text-sm text-[#616161]">{peer.title}</p>
                                <p className="text-xs text-[#9E9E9E]">{peer.department}</p>

                                {peer.sharedInterests && peer.sharedInterests.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {peer.sharedInterests.map((interest, i) => (
                                            <span key={i} className="text-xs px-2 py-0.5 bg-pink-50 text-pink-500 rounded">
                                                {interest}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-4">
                            {peer.connected ? (
                                <div className="flex items-center gap-2 text-[#4CAF50] text-sm">
                                    <Check className="w-4 h-4" />
                                    <span>Connected!</span>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleConnectPeer(peer.id)}
                                    className="w-full py-2 bg-pink-500 hover:bg-pink-400 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <Heart className="w-4 h-4" /> Connect
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Cohort Events */}
            {cohort.sharedEvents && cohort.sharedEvents.length > 0 && (
                <div className="bg-[#FAFAFA] rounded-xl border border-[#E0E0E0] p-6">
                    <h4 className="font-medium text-black mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[#E60000]" />
                        Upcoming Cohort Events
                    </h4>
                    <div className="space-y-3">
                        {cohort.sharedEvents.map((event) => (
                            <div key={event.id} className="flex items-center gap-4 p-3 bg-white rounded-lg border border-[#E0E0E0]">
                                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-[#E60000]">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-black">{event.title}</p>
                                    <p className="text-xs text-[#616161]">
                                        {new Date(event.date).toLocaleDateString()} • {event.location}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <button
                onClick={handleCompleteDay}
                disabled={!canComplete}
                className={`
                    w-full py-3 font-semibold rounded-xl transition-all flex items-center justify-center gap-2
                    ${canComplete
                        ? 'bg-[#E60000] hover:bg-[#CC0000] text-white'
                        : 'bg-[#E0E0E0] text-[#9E9E9E] cursor-not-allowed'}
                `}
            >
                Complete Day 4 — Proceed to Completion Day <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );

    const phases_list: { id: Phase; label: string; icon: string }[] = [
        { id: 'CRITICAL5', label: 'Critical 5', icon: '⭐' },
        { id: 'STAKEHOLDERS', label: 'Stakeholders', icon: '🗺️' },
        { id: 'RITUALS', label: 'Rituals', icon: '📅' },
        { id: 'NORMS', label: 'Norms', icon: '📋' },
        { id: 'COHORT', label: 'Cohort', icon: '👥' },
    ];

    const getPhaseIndex = (p: Phase) => phases_list.findIndex(x => x.id === p);

    return (
        <div className="p-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <p className="text-[#E60000] text-sm font-bold uppercase tracking-wider mb-2">
                    Day 4 of 5
                </p>
                <h1 className="text-3xl font-bold text-black mb-2">
                    Network & Collaboration
                </h1>
                <p className="text-[#616161]">
                    Build the relationships that will accelerate your success.
                </p>
            </div>

            {/* Phase Navigation */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {phases_list.map((p, i) => {
                    const isActive = phase === p.id;
                    const isPast = getPhaseIndex(phase) > i || phase === 'DONE';

                    return (
                        <button
                            key={p.id}
                            onClick={() => isPast && setPhase(p.id)}
                            className={`
                                px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all flex items-center gap-2
                                ${isActive ? 'bg-red-50 border border-[#E60000] text-black' : ''}
                                ${isPast && !isActive ? 'bg-[#E8F5E9] border border-[#4CAF50]/50 text-[#4CAF50]' : ''}
                                ${!isActive && !isPast ? 'bg-[#F5F5F5] text-[#9E9E9E]' : ''}
                            `}
                        >
                            {isPast && !isActive ? <Check className="w-4 h-4" /> : <span>{p.icon}</span>}
                            {p.label}
                        </button>
                    );
                })}
            </div>

            {/* Phase Content */}
            <div className="bg-white backdrop-blur-md rounded-2xl border border-[#E0E0E0] p-6">
                {phase === 'CRITICAL5' && renderCritical5Phase()}
                {phase === 'STAKEHOLDERS' && renderStakeholdersPhase()}
                {phase === 'RITUALS' && renderRitualsPhase()}
                {phase === 'NORMS' && renderNormsPhase()}
                {phase === 'COHORT' && renderCohortPhase()}
                {phase === 'DONE' && (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 rounded-full bg-[#E8F5E9] flex items-center justify-center mx-auto mb-4">
                            <Check className="w-10 h-10 text-[#4CAF50]" />
                        </div>
                        <h2 className="text-2xl font-bold text-black mb-2">Day 4 Complete!</h2>
                        <p className="text-[#616161]">Moving to Day 5: Completion...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Day4NetworkCollaboration;
