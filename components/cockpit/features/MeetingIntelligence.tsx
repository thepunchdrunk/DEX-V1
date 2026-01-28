import React, { useState } from 'react';
import {
    Calendar,
    Clock,
    Users,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    Video,
    Phone,
    MapPin,
    ChevronRight,
    BarChart3,
    Zap,
    Coffee,
    Moon,
} from 'lucide-react';
import { MeetingPattern } from '../../../types';
import { MOCK_MEETING_PATTERNS } from '../../../constants';

interface MeetingIntelligenceProps {
    className?: string;
}

const MeetingIntelligence: React.FC<MeetingIntelligenceProps & { viewMode?: 'FULL' | 'WIDGET' }> = ({ className = '', viewMode = 'FULL' }) => {
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const pattern = MOCK_MEETING_PATTERNS;

    // Calculate insights
    const meetingLoad = Math.round((pattern.totalHours / 40) * 100);
    const focusTimePercent = Math.round(((40 - pattern.totalHours) / 40) * 100);
    const avgMeetingLength = Math.round(pattern.averageDuration);

    const getLoadColor = (load: number) => {
        if (load >= 70) return 'text-[#D32F2F] bg-[#FFEBEE]';
        if (load >= 50) return 'text-[#E65100] bg-[#FFF3E0]';
        return 'text-[#4CAF50] bg-[#E8F5E9]';
    };

    const getSeverityColor = (severity: 'HIGH' | 'MEDIUM' | 'LOW') => {
        switch (severity) {
            case 'HIGH': return 'text-[#D32F2F] bg-[#FFEBEE] border-[#D32F2F]/30';
            case 'MEDIUM': return 'text-[#E65100] bg-[#FFF3E0] border-[#E65100]/30';
            case 'LOW': return 'text-blue-600 bg-blue-50 border-blue-300';
        }
    };

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const dailyHours = [6, 5, 4, 7, 3]; // Mock daily meeting hours

    if (viewMode === 'WIDGET') {
        return (
            <div className={`p-5 rounded-2xl bg-white border border-[#E0E0E0] hover:shadow-md transition-colors ${className}`}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-black">Meeting Load</h3>
                        <p className="text-xs text-[#616161]">Total hours this week</p>
                    </div>
                    <div className={`ml-auto px-2 py-1 rounded text-xs font-bold ${getLoadColor(meetingLoad)}`}>
                        {meetingLoad}%
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-[#616161]">Total Load</span>
                            <span className="text-black font-medium">{pattern.totalHours}h / 40h</span>
                        </div>
                        <div className="h-2 bg-[#E0E0E0] rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full ${meetingLoad >= 70 ? 'bg-[#D32F2F]' : meetingLoad >= 50 ? 'bg-[#E65100]' : 'bg-[#4CAF50]'}`}
                                style={{ width: `${meetingLoad}%` }}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-[#616161]">Focus Time</span>
                            <span className="text-black font-medium">{focusTimePercent}%</span>
                        </div>
                        <div className="h-2 bg-[#E0E0E0] rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full bg-[#4CAF50]"
                                style={{ width: `${focusTimePercent}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-black">Meeting Intelligence</h2>
                    <p className="text-sm text-[#616161]">Your calendar patterns this week</p>
                </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-4 border border-[#E0E0E0] shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-[#616161]">Total Hours</span>
                    </div>
                    <p className="text-2xl font-bold text-black">{pattern.totalHours}h</p>
                    <p className="text-xs text-[#9E9E9E]">of 40h work week</p>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-[#E0E0E0] shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-[#616161]">Meetings</span>
                    </div>
                    <p className="text-2xl font-bold text-black">{pattern.meetingsCount}</p>
                    <p className="text-xs text-[#9E9E9E]">this week</p>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-[#E0E0E0] shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-[#4CAF50]" />
                        <span className="text-sm text-[#616161]">Focus Time</span>
                    </div>
                    <p className="text-2xl font-bold text-black">{focusTimePercent}%</p>
                    <p className="text-xs text-[#9E9E9E]">available</p>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-[#E0E0E0] shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-4 h-4 text-[#E65100]" />
                        <span className="text-sm text-[#616161]">Avg Length</span>
                    </div>
                    <p className="text-2xl font-bold text-black">{avgMeetingLength}m</p>
                    <p className="text-xs text-[#9E9E9E]">per meeting</p>
                </div>
            </div>

            {/* Meeting Load Visualization */}
            <div className="bg-white rounded-2xl p-6 border border-[#E0E0E0] shadow-sm">
                <h3 className="text-lg font-bold text-black mb-4">Weekly Meeting Load</h3>

                {/* Load Gauge */}
                <div className="relative h-4 bg-[#E0E0E0] rounded-full overflow-hidden mb-4">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${meetingLoad >= 70 ? 'bg-[#D32F2F]' : meetingLoad >= 50 ? 'bg-[#E65100]' : 'bg-[#4CAF50]'
                            }`}
                        style={{ width: `${meetingLoad}%` }}
                    />
                    <div className="absolute inset-y-0 left-[50%] w-px bg-[#9E9E9E]" />
                    <div className="absolute inset-y-0 left-[70%] w-px bg-[#D32F2F]/50" />
                </div>
                <div className="flex justify-between text-xs text-[#9E9E9E] mb-6">
                    <span>0%</span>
                    <span className="text-[#E65100]">50% threshold</span>
                    <span className="text-[#D32F2F]">70% overload</span>
                    <span>100%</span>
                </div>

                {/* Daily Breakdown */}
                <h4 className="text-sm font-medium text-[#616161] mb-3">Daily Breakdown</h4>
                <div className="flex items-end justify-between h-32 gap-2">
                    {days.map((day, index) => {
                        const hours = dailyHours[index];
                        const isSelected = selectedDay === day;
                        const heightPercent = (hours / 8) * 100;
                        return (
                            <div
                                key={day}
                                className="flex-1 flex flex-col items-center gap-2 cursor-pointer"
                                onClick={() => setSelectedDay(isSelected ? null : day)}
                            >
                                <div className="text-xs text-[#616161]">{hours}h</div>
                                <div
                                    className={`w-full rounded-t-lg transition-all ${isSelected ? 'bg-blue-500' :
                                        hours >= 6 ? 'bg-[#D32F2F]' : hours >= 4 ? 'bg-[#E65100]' : 'bg-[#4CAF50]'
                                        }`}
                                    style={{ height: `${heightPercent}%` }}
                                />
                                <span className={`text-xs ${isSelected ? 'text-black font-medium' : 'text-[#9E9E9E]'}`}>
                                    {day}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Meeting Type Distribution */}
            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-[#E0E0E0] shadow-sm">
                    <h3 className="text-sm font-medium text-[#616161] mb-4">Meeting Types</h3>
                    <div className="space-y-3">
                        {[
                            { type: 'Team Syncs', percent: 35, icon: Users, color: 'bg-blue-500' },
                            { type: '1:1s', percent: 25, icon: Phone, color: 'bg-violet-500' },
                            { type: 'Project Reviews', percent: 25, icon: Video, color: 'bg-[#4CAF50]' },
                            { type: 'External', percent: 15, icon: MapPin, color: 'bg-[#E65100]' },
                        ].map((item) => (
                            <div key={item.type} className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg ${item.color}/10 flex items-center justify-center`}>
                                    <item.icon className={`w-4 h-4 ${item.color.replace('bg-', 'text-')}`} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-black">{item.type}</span>
                                        <span className="text-[#616161]">{item.percent}%</span>
                                    </div>
                                    <div className="h-1.5 bg-[#E0E0E0] rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-[#E0E0E0] shadow-sm">
                    <h3 className="text-sm font-medium text-[#616161] mb-4">Peak Times</h3>
                    <div className="space-y-3">
                        {[
                            { time: '9-11 AM', percent: 80, icon: Coffee, label: 'Busiest' },
                            { time: '11-1 PM', percent: 45, icon: TrendingUp, label: 'Moderate' },
                            { time: '2-4 PM', percent: 65, icon: Users, label: 'High' },
                            { time: '4-6 PM', percent: 20, icon: Moon, label: 'Light' },
                        ].map((item) => (
                            <div key={item.time} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#FAFAFA] flex items-center justify-center">
                                    <item.icon className="w-4 h-4 text-[#616161]" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-black">{item.time}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${item.percent >= 70 ? 'bg-[#FFEBEE] text-[#D32F2F]' :
                                            item.percent >= 40 ? 'bg-[#FFF3E0] text-[#E65100]' :
                                                'bg-[#E8F5E9] text-[#4CAF50]'
                                            }`}>{item.label}</span>
                                    </div>
                                    <div className="h-1.5 bg-[#E0E0E0] rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${item.percent >= 70 ? 'bg-[#D32F2F]' :
                                                item.percent >= 40 ? 'bg-[#E65100]' :
                                                    'bg-[#4CAF50]'
                                                }`}
                                            style={{ width: `${item.percent}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Alerts */}
            {pattern.alerts.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-[#616161]">Insights & Alerts</h3>
                    {pattern.alerts.map((alert, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-xl border ${getSeverityColor(alert.severity)}`}
                        >
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-medium">{alert.metric}</p>
                                    <p className="text-sm opacity-70 mt-1">{alert.suggestion}</p>
                                </div>
                                <button className="text-sm hover:underline flex items-center gap-1">
                                    Fix <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Suggestion */}
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-black">Suggested Focus Blocks</p>
                        <p className="text-sm text-[#616161]">
                            Tuesday & Thursday afternoons have the most open slots. Consider blocking 2-4 PM for deep work.
                        </p>
                    </div>
                    <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all">
                        Block Time
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MeetingIntelligence;
