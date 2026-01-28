import React, { useState, useEffect } from 'react';
import {
    Check,
    Circle,
    Loader2,
    AlertCircle,
    ChevronRight,
    Laptop,
    Mail,
    MessageSquare,
    Key,
    Ticket,
    MapPin,
    Car,
    Shield,
} from 'lucide-react';
import { UserProfile, GreenLightCheck, DigitalProfile, SystemCheckStatus } from '../../types';
import { GREEN_LIGHT_CHECKS } from '../../constants';

interface GreenLightDashboardProps {
    user: UserProfile;
    onComplete: () => void;
}

const GreenLightDashboard: React.FC<GreenLightDashboardProps> = ({
    user,
    onComplete,
}) => {
    const [checks, setChecks] = useState<GreenLightCheck[]>(GREEN_LIGHT_CHECKS);
    const [phase, setPhase] = useState<'CHECKING' | 'PROFILE' | 'DONE'>('CHECKING');
    const [profile, setProfile] = useState<DigitalProfile>({
        displayName: user.name,
        pronouns: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        workStyle: 'FLEXIBLE',
        communicationPreference: 'SLACK',
        bio: '',
    });

    // Simulate system checks running
    useEffect(() => {
        const pending = checks.filter((c) => c.status === 'PENDING' || c.status === 'CHECKING');
        if (pending.length === 0) {
            setTimeout(() => setPhase('PROFILE'), 500);
            return;
        }

        const timer = setTimeout(() => {
            setChecks((prev) =>
                prev.map((check) => {
                    if (check.status === 'PENDING') {
                        return { ...check, status: 'CHECKING' as SystemCheckStatus };
                    }
                    if (check.status === 'CHECKING') {
                        // Simulate random pass/fail with mostly passes
                        const pass = Math.random() > 0.1;
                        return { ...check, status: (pass ? 'PASS' : 'FAIL') as SystemCheckStatus };
                    }
                    return check;
                })
            );
        }, 800);

        return () => clearTimeout(timer);
    }, [checks]);

    const getStatusIcon = (status: SystemCheckStatus) => {
        switch (status) {
            case 'PASS':
                return <Check className="w-4 h-4 text-green-400" />;
            case 'FAIL':
                return <AlertCircle className="w-4 h-4 text-red-400" />;
            case 'CHECKING':
                return <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />;
            default:
                return <Circle className="w-4 h-4 text-slate-500" />;
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'HARDWARE':
                return <Laptop className="w-5 h-5" />;
            case 'SOFTWARE':
                return <Key className="w-5 h-5" />;
            case 'FACILITY':
                return <MapPin className="w-5 h-5" />;
            default:
                return <Shield className="w-5 h-5" />;
        }
    };

    const allPassed = checks.every((c) => c.status === 'PASS');
    const passCount = checks.filter((c) => c.status === 'PASS').length;

    const handleSubmitProfile = () => {
        setPhase('DONE');
        setTimeout(onComplete, 1500);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <p className="text-blue-400 text-sm font-bold uppercase tracking-wider mb-2">
                    Day 1 of 5
                </p>
                <h1 className="text-3xl font-bold text-white mb-2">
                    Automated Setup
                </h1>
                <p className="text-slate-400">
                    Let's make sure everything is ready for your first day. We're running background checks on your systems.
                </p>
            </div>

            {/* Green Light Dashboard */}
            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <div
                            className={`w-3 h-3 rounded-full ${allPassed
                                ? 'bg-green-400 animate-pulse'
                                : phase === 'CHECKING'
                                    ? 'bg-blue-400 animate-pulse'
                                    : 'bg-amber-400'
                                }`}
                        />
                        Readiness Check
                    </h2>
                    <span className="text-sm text-slate-400">
                        {passCount}/{checks.length} Ready
                    </span>
                </div>

                {/* Checks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {checks.map((check) => (
                        <div
                            key={check.id}
                            className={`
                flex items-center gap-4 p-4 rounded-xl border transition-all duration-300
                ${check.status === 'PASS' ? 'bg-green-500/10 border-green-500/30' : ''}
                ${check.status === 'FAIL' ? 'bg-red-500/10 border-red-500/30' : ''}
                ${check.status === 'CHECKING' ? 'bg-blue-500/10 border-blue-500/30' : ''}
                ${check.status === 'PENDING' ? 'bg-slate-800/50 border-slate-700/50' : ''}
              `}
                        >
                            {/* Icon */}
                            <div
                                className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  ${check.status === 'PASS' ? 'bg-green-500/20 text-green-400' : ''}
                  ${check.status === 'FAIL' ? 'bg-red-500/20 text-red-400' : ''}
                  ${check.status === 'CHECKING' ? 'bg-blue-500/20 text-blue-400' : ''}
                  ${check.status === 'PENDING' ? 'bg-slate-700 text-slate-400' : ''}
                `}
                            >
                                {getCategoryIcon(check.category)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white">{check.label}</p>
                                <p className="text-xs text-slate-400 truncate">{check.details}</p>
                            </div>

                            {/* Status */}
                            {getStatusIcon(check.status)}
                        </div>
                    ))}
                </div>
            </div>

            {/* Digital Profile Form */}
            {phase === 'PROFILE' && (
                <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 animate-fade-in">
                    <h2 className="text-xl font-semibold text-white mb-6">
                        Complete Your Digital Profile
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Display Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Display Name
                            </label>
                            <input
                                type="text"
                                value={profile.displayName}
                                onChange={(e) =>
                                    setProfile({ ...profile, displayName: e.target.value })
                                }
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="How should we call you?"
                            />
                        </div>

                        {/* Pronouns */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Pronouns (optional)
                            </label>
                            <input
                                type="text"
                                value={profile.pronouns}
                                onChange={(e) =>
                                    setProfile({ ...profile, pronouns: e.target.value })
                                }
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="e.g., they/them, she/her"
                            />
                        </div>

                        {/* Work Style */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Work Style
                            </label>
                            <div className="flex gap-2">
                                {['EARLY_BIRD', 'NIGHT_OWL', 'FLEXIBLE'].map((style) => (
                                    <button
                                        key={style}
                                        onClick={() =>
                                            setProfile({
                                                ...profile,
                                                workStyle: style as typeof profile.workStyle,
                                            })
                                        }
                                        className={`
                      flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all
                      ${profile.workStyle === style
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                            }
                    `}
                                    >
                                        {style === 'EARLY_BIRD' && '🌅 Early Bird'}
                                        {style === 'NIGHT_OWL' && '🦉 Night Owl'}
                                        {style === 'FLEXIBLE' && '🌊 Flexible'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Communication Preference */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Preferred Communication
                            </label>
                            <div className="flex gap-2">
                                {['SLACK', 'EMAIL', 'TEAMS'].map((pref) => (
                                    <button
                                        key={pref}
                                        onClick={() =>
                                            setProfile({
                                                ...profile,
                                                communicationPreference: pref as typeof profile.communicationPreference,
                                            })
                                        }
                                        className={`
                      flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all
                      ${profile.communicationPreference === pref
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                            }
                    `}
                                    >
                                        {pref === 'SLACK' && '💬 Slack'}
                                        {pref === 'EMAIL' && '📧 Email'}
                                        {pref === 'TEAMS' && '👥 Teams'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Quick Bio (optional)
                            </label>
                            <textarea
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                                rows={3}
                                placeholder="A few words about you for your teammates..."
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        onClick={handleSubmitProfile}
                        className="mt-6 w-full py-3 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        Complete Day 1
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
                    <h2 className="text-2xl font-bold text-white mb-2">Day 1 Complete!</h2>
                    <p className="text-slate-400">Moving to Day 2: Company Culture...</p>
                </div>
            )}
        </div>
    );
};

export default GreenLightDashboard;
