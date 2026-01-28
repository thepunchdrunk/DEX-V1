import React, { useState } from 'react';
import {
    UserPlus,
    Calendar,
    Clock,
    Check,
    AlertTriangle,
    User,
    Laptop,
    Building2,
    Wallet,
    Users,
    ChevronLeft,
    ChevronRight,
    Send,
    Mail,
    Eye,
} from 'lucide-react';

// New Hire interface
interface NewHire {
    id: string;
    name: string;
    role: string;
    department: string;
    startDate: string;
    email: string;
    readinessScore: number;
    categories: {
        identity: 'READY' | 'IN_PROGRESS' | 'PENDING' | 'BLOCKED';
        device: 'READY' | 'IN_PROGRESS' | 'PENDING' | 'BLOCKED';
        facility: 'READY' | 'IN_PROGRESS' | 'PENDING' | 'BLOCKED';
        finance: 'READY' | 'IN_PROGRESS' | 'PENDING' | 'BLOCKED';
        team: 'READY' | 'IN_PROGRESS' | 'PENDING' | 'BLOCKED';
    };
    welcomeSent: boolean;
    oneOnOneScheduled: boolean;
}

// Mock new hires data
const MOCK_NEW_HIRES: NewHire[] = [
    {
        id: 'nh-1',
        name: 'Sarah Chen',
        role: 'Product Manager',
        department: 'Product',
        startDate: '2026-02-03',
        email: 'sarah.chen@company.com',
        readinessScore: 75,
        categories: {
            identity: 'READY',
            device: 'IN_PROGRESS',
            facility: 'READY',
            finance: 'READY',
            team: 'PENDING',
        },
        welcomeSent: true,
        oneOnOneScheduled: false,
    },
    {
        id: 'nh-2',
        name: 'Marcus Williams',
        role: 'Software Engineer',
        department: 'Engineering',
        startDate: '2026-02-10',
        email: 'marcus.williams@company.com',
        readinessScore: 45,
        categories: {
            identity: 'READY',
            device: 'PENDING',
            facility: 'PENDING',
            finance: 'IN_PROGRESS',
            team: 'PENDING',
        },
        welcomeSent: false,
        oneOnOneScheduled: false,
    },
];

interface NewHireOnboardingProps {
    className?: string;
}

const NewHireOnboarding: React.FC<NewHireOnboardingProps> = ({ className = '' }) => {
    const [newHires, setNewHires] = useState<NewHire[]>(MOCK_NEW_HIRES);
    const [currentIndex, setCurrentIndex] = useState(0);

    const getDaysUntilStart = (startDate: string) => {
        const days = Math.ceil(
            (new Date(startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        return days;
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'READY':
                return <Check className="w-3 h-3 text-[#4CAF50]" />;
            case 'IN_PROGRESS':
                return <Clock className="w-3 h-3 text-[#E60000]" />;
            case 'PENDING':
                return <Clock className="w-3 h-3 text-[#9E9E9E]" />;
            case 'BLOCKED':
                return <AlertTriangle className="w-3 h-3 text-[#D32F2F]" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'READY':
                return 'bg-[#E8F5E9] border-[#4CAF50]/30';
            case 'IN_PROGRESS':
                return 'bg-red-50 border-[#E60000]/30';
            case 'PENDING':
                return 'bg-[#F5F5F5] border-[#E0E0E0]';
            case 'BLOCKED':
                return 'bg-[#FFEBEE] border-[#D32F2F]/30';
            default:
                return 'bg-gray-100';
        }
    };

    const getReadinessColor = (score: number) => {
        if (score >= 80) return 'text-[#4CAF50]';
        if (score >= 50) return 'text-[#FF9800]';
        return 'text-[#D32F2F]';
    };

    const getReadinessBgColor = (score: number) => {
        if (score >= 80) return 'bg-[#4CAF50]';
        if (score >= 50) return 'bg-[#FF9800]';
        return 'bg-[#D32F2F]';
    };

    const handleSendWelcome = (hireId: string) => {
        setNewHires(prev =>
            prev.map(h =>
                h.id === hireId ? { ...h, welcomeSent: true } : h
            )
        );
    };

    const handleScheduleOneOnOne = (hireId: string) => {
        setNewHires(prev =>
            prev.map(h =>
                h.id === hireId ? { ...h, oneOnOneScheduled: true } : h
            )
        );
    };

    const categoryIcons = {
        identity: <User className="w-3 h-3" />,
        device: <Laptop className="w-3 h-3" />,
        facility: <Building2 className="w-3 h-3" />,
        finance: <Wallet className="w-3 h-3" />,
        team: <Users className="w-3 h-3" />,
    };

    const categoryLabels = {
        identity: 'ID',
        device: 'Device',
        facility: 'Facility',
        finance: 'Finance',
        team: 'Team',
    };

    const nextHire = () => {
        setCurrentIndex((prev) => (prev + 1) % newHires.length);
    };

    const prevHire = () => {
        setCurrentIndex((prev) => (prev - 1 + newHires.length) % newHires.length);
    };

    if (newHires.length === 0) {
        return (
            <div className={`bg-white rounded-2xl border border-[#E0E0E0] p-6 text-center ${className}`}>
                <div className="w-12 h-12 rounded-full bg-[#FAFAFA] flex items-center justify-center mx-auto mb-3">
                    <UserPlus className="w-6 h-6 text-[#9E9E9E]" />
                </div>
                <p className="text-sm text-[#616161]">No incoming team members</p>
            </div>
        );
    }

    const hire = newHires[currentIndex];
    const daysUntil = getDaysUntilStart(hire.startDate);

    return (
        <div className={`bg-white rounded-2xl border border-[#E0E0E0] overflow-hidden shadow-sm ${className}`}>
            {/* Header with Navigation */}
            <div className="flex items-center justify-between p-3 border-b border-[#E0E0E0] bg-[#FAFAFA]">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#E60000] flex items-center justify-center">
                        <UserPlus className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-black text-sm">Incoming Team</h3>
                        <p className="text-xs text-[#9E9E9E]">{newHires.length} new hire{newHires.length !== 1 ? 's' : ''}</p>
                    </div>
                </div>

                {/* Carousel Controls */}
                {newHires.length > 1 && (
                    <div className="flex items-center gap-1">
                        <button
                            onClick={prevHire}
                            className="p-1.5 hover:bg-white rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 text-[#616161]" />
                        </button>
                        <span className="text-xs text-[#9E9E9E] px-1">{currentIndex + 1}/{newHires.length}</span>
                        <button
                            onClick={nextHire}
                            className="p-1.5 hover:bg-white rounded-lg transition-colors"
                        >
                            <ChevronRight className="w-4 h-4 text-[#616161]" />
                        </button>
                    </div>
                )}
            </div>

            {/* Current Hire Card */}
            <div className="p-4">
                {/* Profile Row */}
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                        <span className="text-[#E60000] font-bold text-sm">
                            {hire.name.split(' ').map(n => n[0]).join('')}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-black truncate">{hire.name}</h4>
                        <p className="text-xs text-[#616161] truncate">{hire.role}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="flex items-center gap-1 text-xs text-[#9E9E9E]">
                                <Calendar className="w-3 h-3" />
                                {daysUntil > 0 ? `${daysUntil}d` : 'Today'}
                            </span>
                        </div>
                    </div>
                    {/* Readiness Score Circle */}
                    <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-3 ${getReadinessBgColor(hire.readinessScore)}`}>
                            <span className="text-white font-bold text-sm">{hire.readinessScore}%</span>
                        </div>
                        <span className="text-[10px] text-[#9E9E9E] mt-1">Ready</span>
                    </div>
                </div>

                {/* Category Status - Compact Grid */}
                <div className="grid grid-cols-5 gap-1 mb-3">
                    {(Object.entries(hire.categories) as [keyof typeof hire.categories, string][]).map(([category, status]) => (
                        <div
                            key={category}
                            className={`flex flex-col items-center p-1.5 rounded-lg border ${getStatusColor(status)}`}
                        >
                            {categoryIcons[category]}
                            <span className="text-[9px] text-[#616161] mt-0.5">{categoryLabels[category]}</span>
                            <div className="mt-0.5">{getStatusIcon(status)}</div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={() => handleSendWelcome(hire.id)}
                        disabled={hire.welcomeSent}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium transition-all ${hire.welcomeSent
                            ? 'bg-[#E8F5E9] text-[#4CAF50]'
                            : 'bg-[#E60000] hover:bg-[#D32F2F] text-white'
                            }`}
                    >
                        {hire.welcomeSent ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                        {hire.welcomeSent ? 'Sent' : 'Welcome'}
                    </button>
                    <button
                        onClick={() => handleScheduleOneOnOne(hire.id)}
                        disabled={hire.oneOnOneScheduled}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium transition-all ${hire.oneOnOneScheduled
                            ? 'bg-[#E8F5E9] text-[#4CAF50]'
                            : 'bg-white hover:bg-[#FAFAFA] text-[#616161] border border-[#E0E0E0]'
                            }`}
                    >
                        {hire.oneOnOneScheduled ? <Check className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
                        {hire.oneOnOneScheduled ? 'Scheduled' : '1:1'}
                    </button>
                    <button className="p-2 rounded-lg bg-white hover:bg-[#FAFAFA] text-[#616161] border border-[#E0E0E0] transition-all">
                        <Eye className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Dot Indicators */}
                {newHires.length > 1 && (
                    <div className="flex justify-center gap-1.5 mt-3">
                        {newHires.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-[#E60000]' : 'bg-[#E0E0E0]'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewHireOnboarding;

