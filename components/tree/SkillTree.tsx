import React, { useState, useMemo } from 'react';
import {
    Leaf,
    TreePine,
    AlertTriangle,
    Check,
    RefreshCw,
    ChevronRight,
    ChevronDown,
    TrendingUp,
    TrendingDown,
    Activity,
    Zap,
    Target,
    Award,
    Clock,
    BarChart3,
} from 'lucide-react';
import { SkillBranch, SkillHealth, SkillMastery } from '../../types';

interface SkillTreeProps {
    branches: SkillBranch[];
}

const SkillTree: React.FC<SkillTreeProps> = ({ branches }) => {
    const [expandedBranches, setExpandedBranches] = useState<string[]>(
        branches.map((b) => b.id)
    );
    const [viewMode, setViewMode] = useState<'tree' | 'visual' | 'analytics'>('visual');
    const [selectedSkill, setSelectedSkill] = useState<SkillBranch | null>(null);

    const toggleBranch = (branchId: string) => {
        setExpandedBranches((prev) =>
            prev.includes(branchId)
                ? prev.filter((id) => id !== branchId)
                : [...prev, branchId]
        );
    };

    // Flatten all skills
    const flattenBranches = (branches: SkillBranch[]): SkillBranch[] => {
        return branches.reduce((acc, branch) => {
            return [...acc, branch, ...flattenBranches(branch.children || [])];
        }, [] as SkillBranch[]);
    };

    const allSkills = useMemo(() => flattenBranches(branches), [branches]);
    const healthyCount = allSkills.filter((s) => s.health === 'THRIVING' || s.health === 'HEALTHY').length;
    const fadingCount = allSkills.filter((s) => s.health === 'FADING').length;
    const decayedCount = allSkills.filter((s) => s.health === 'DECAYED').length;

    // Calculate overall health score
    const healthScore = useMemo(() => {
        const weights = { THRIVING: 100, HEALTHY: 80, FADING: 40, DECAYED: 10 };
        const totalScore = allSkills.reduce((sum, s) => sum + weights[s.health], 0);
        return Math.round(totalScore / allSkills.length);
    }, [allSkills]);

    const getHealthColor = (health: SkillHealth) => {
        switch (health) {
            case 'THRIVING':
                return { bg: 'bg-[#4CAF50]', text: 'text-[#4CAF50]', glow: 'shadow-green-200' };
            case 'HEALTHY':
                return { bg: 'bg-[#66BB6A]', text: 'text-[#66BB6A]', glow: 'shadow-green-100' };
            case 'FADING':
                return { bg: 'bg-[#E65100]', text: 'text-[#E65100]', glow: 'shadow-orange-200' };
            case 'DECAYED':
                return { bg: 'bg-[#D32F2F]', text: 'text-[#D32F2F]', glow: 'shadow-red-200' };
        }
    };

    const getMasterySize = (mastery: SkillMastery) => {
        switch (mastery) {
            case 0: return 'w-8 h-8';
            case 1: return 'w-10 h-10';
            case 2: return 'w-12 h-12';
            case 3: return 'w-14 h-14';
        }
    };

    const getMasteryRing = (mastery: SkillMastery) => {
        const rings = [];
        for (let i = 0; i < 3; i++) {
            rings.push(
                <div
                    key={i}
                    className={`absolute inset-0 rounded-full border-2 ${i < mastery ? 'border-current opacity-100' : 'border-[#E0E0E0] opacity-50'
                        }`}
                    style={{ transform: `scale(${1 + i * 0.2})` }}
                />
            );
        }
        return rings;
    };

    const getDecayPercentage = (branch: SkillBranch) => {
        return Math.min(100, Math.round((branch.daysSinceVerified / branch.decayThreshold) * 100));
    };

    // Visual Tree Node Component
    const VisualNode: React.FC<{ skill: SkillBranch; index: number; total: number; level: number }> = ({
        skill,
        index,
        total,
        level,
    }) => {
        const colors = getHealthColor(skill.health);
        const size = getMasterySize(skill.mastery);
        const hasChildren = skill.children && skill.children.length > 0;
        const isSelected = selectedSkill?.id === skill.id;

        // Position calculations for radial layout
        const angle = (index / total) * 360 - 90;
        const radius = 80 + level * 70;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return (
            <div
                className="absolute transition-all duration-500 cursor-pointer group"
                style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: isSelected ? 10 : level,
                }}
                onClick={() => setSelectedSkill(isSelected ? null : skill)}
            >
                {/* Node */}
                <div
                    className={`
                        relative flex items-center justify-center rounded-full
                        ${size} ${colors.bg} ${isSelected ? 'ring-4 ring-white/30' : ''}
                        transition-all duration-300 group-hover:scale-110
                        shadow-lg ${colors.glow}
                    `}
                >
                    {/* Mastery rings */}
                    <div className={`absolute inset-0 ${colors.text}`}>
                        {getMasteryRing(skill.mastery)}
                    </div>

                    {/* Pulse for fading */}
                    {skill.health === 'FADING' && (
                        <div className="absolute inset-0 rounded-full bg-amber-500 animate-ping opacity-30" />
                    )}

                    {/* Icon */}
                    <TreePine className="w-4 h-4 text-white relative z-10" />
                </div>

                {/* Label */}
                <div
                    className={`
                        absolute left-1/2 -translate-x-1/2 top-full mt-2
                        px-2 py-1 rounded-lg bg-white/95 backdrop-blur-sm
                        text-xs font-medium text-black whitespace-nowrap
                        opacity-0 group-hover:opacity-100 transition-opacity
                        border border-[#E0E0E0] shadow-sm
                    `}
                >
                    {skill.name}
                </div>

                {/* Connecting lines to children */}
                {hasChildren && (
                    <svg
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ width: '300px', height: '300px', zIndex: -1 }}
                    >
                        {skill.children?.map((child, i) => {
                            const childAngle = ((index + (i - (skill.children!.length - 1) / 2) * 0.3) / total) * 360 - 90;
                            const childRadius = 80 + (level + 1) * 70;
                            const cx = Math.cos((childAngle * Math.PI) / 180) * childRadius - x;
                            const cy = Math.sin((childAngle * Math.PI) / 180) * childRadius - y;
                            return (
                                <line
                                    key={child.id}
                                    x1="150"
                                    y1="150"
                                    x2={150 + cx}
                                    y2={150 + cy}
                                    stroke="rgba(100, 116, 139, 0.3)"
                                    strokeWidth="2"
                                />
                            );
                        })}
                    </svg>
                )}
            </div>
        );
    };

    // Tree List View
    const renderBranch = (branch: SkillBranch, depth: number = 0) => {
        const hasChildren = branch.children && branch.children.length > 0;
        const isExpanded = expandedBranches.includes(branch.id);
        const healthColors = getHealthColor(branch.health);
        const decayPercent = getDecayPercentage(branch);

        return (
            <div key={branch.id} className="relative">
                <div
                    className={`
                        flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer
                        bg-white border border-[#E0E0E0] shadow-sm
                        hover:bg-[#FAFAFA] hover:border-[#BDBDBD]
                    `}
                    style={{ marginLeft: `${depth * 24}px` }}
                    onClick={() => hasChildren && toggleBranch(branch.id)}
                >
                    {hasChildren ? (
                        <button className="text-[#616161] hover:text-black">
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                    ) : (
                        <div className="w-4" />
                    )}

                    {/* Visual Node */}
                    <div className={`w-8 h-8 rounded-full ${healthColors.bg} flex items-center justify-center shadow-lg ${healthColors.glow}`}>
                        <TreePine className="w-4 h-4 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="font-medium text-black truncate">{branch.name}</p>
                            {branch.health === 'FADING' && <AlertTriangle className="w-3 h-3 text-[#E65100]" />}
                            {branch.health === 'DECAYED' && <AlertTriangle className="w-3 h-3 text-[#D32F2F]" />}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#616161]">
                            <span className={healthColors.text}>{branch.health}</span>
                            <span>•</span>
                            <span>Level {branch.mastery + 1}</span>
                        </div>
                    </div>

                    {/* Decay Ring */}
                    <div className="relative w-10 h-10">
                        <svg className="w-10 h-10 -rotate-90">
                            <circle
                                cx="20"
                                cy="20"
                                r="16"
                                fill="none"
                                stroke="#E0E0E0"
                                strokeWidth="3"
                            />
                            <circle
                                cx="20"
                                cy="20"
                                r="16"
                                fill="none"
                                stroke={decayPercent >= 70 ? '#D32F2F' : decayPercent >= 40 ? '#E65100' : '#4CAF50'}
                                strokeWidth="3"
                                strokeDasharray={`${(decayPercent / 100) * 100.5} 100.5`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-black">
                            {100 - decayPercent}%
                        </span>
                    </div>

                    {(branch.health === 'FADING' || branch.health === 'DECAYED') && (
                        <button
                            onClick={(e) => e.stopPropagation()}
                            className="px-3 py-1.5 rounded-lg bg-[#FFF3E0] text-[#E65100] text-xs font-medium hover:bg-[#FFE0B2] transition-all flex items-center gap-1"
                        >
                            <RefreshCw className="w-3 h-3" />
                            Verify
                        </button>
                    )}
                </div>

                {hasChildren && isExpanded && (
                    <div className="mt-2 space-y-2">
                        {branch.children.map((child) => renderBranch(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header with Health Score */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Health Score Circle */}
                    <div className="relative w-20 h-20">
                        <svg className="w-20 h-20 -rotate-90">
                            <circle
                                cx="40"
                                cy="40"
                                r="34"
                                fill="none"
                                stroke="#E0E0E0"
                                strokeWidth="6"
                            />
                            <circle
                                cx="40"
                                cy="40"
                                r="34"
                                fill="none"
                                stroke={healthScore >= 70 ? '#4CAF50' : healthScore >= 50 ? '#E65100' : '#D32F2F'}
                                strokeWidth="6"
                                strokeDasharray={`${(healthScore / 100) * 213.6} 213.6`}
                                strokeLinecap="round"
                                className="transition-all duration-1000"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold text-black">{healthScore}</span>
                            <span className="text-[10px] text-[#9E9E9E]">HEALTH</span>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-black">Your Skill Tree</h2>
                        <p className="text-sm text-[#616161]">
                            {allSkills.length} skills • {healthyCount} thriving
                        </p>
                    </div>
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-white border border-[#E0E0E0] shadow-sm">
                    {[
                        { id: 'visual', icon: Target, label: 'Visual' },
                        { id: 'tree', icon: TreePine, label: 'Tree' },
                        { id: 'analytics', icon: BarChart3, label: 'Stats' },
                    ].map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => setViewMode(mode.id as any)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === mode.id
                                ? 'bg-[#E60000] text-white'
                                : 'text-[#616161] hover:text-black'
                                }`}
                        >
                            <mode.icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{mode.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Visual View */}
            {viewMode === 'visual' && (
                <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-[#E0E0E0] overflow-hidden shadow-sm" style={{ height: '450px' }}>
                    {/* Background rings */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {[1, 2, 3].map((ring) => (
                            <div
                                key={ring}
                                className="absolute rounded-full border border-[#E0E0E0]/50"
                                style={{ width: `${ring * 150}px`, height: `${ring * 150}px` }}
                            />
                        ))}
                    </div>

                    {/* Center node */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                        <div className="w-16 h-16 rounded-full bg-[#E60000] flex items-center justify-center shadow-xl shadow-red-200">
                            <Award className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-center">
                            <p className="text-sm font-bold text-black">You</p>
                            <p className="text-xs text-[#E60000]">{allSkills.length} skills</p>
                        </div>
                    </div>

                    {/* Skill nodes */}
                    {branches.map((branch, index) => (
                        <VisualNode
                            key={branch.id}
                            skill={branch}
                            index={index}
                            total={branches.length}
                            level={0}
                        />
                    ))}

                    {/* Selected skill detail */}
                    {selectedSkill && (
                        <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-[#E0E0E0] shadow-lg animate-fadeIn z-30">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full ${getHealthColor(selectedSkill.health).bg} flex items-center justify-center`}>
                                        <TreePine className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-black">{selectedSkill.name}</h3>
                                        <p className="text-xs text-[#616161]">
                                            Level {selectedSkill.mastery + 1} • {selectedSkill.health} • {selectedSkill.daysSinceVerified} days since verified
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedSkill(null)}
                                    className="p-2 rounded-lg hover:bg-gray-100 text-[#616161]"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Legend */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 text-xs">
                        {[
                            { color: 'bg-[#4CAF50]', label: 'Thriving' },
                            { color: 'bg-[#66BB6A]', label: 'Healthy' },
                            { color: 'bg-[#E65100]', label: 'Fading' },
                            { color: 'bg-[#D32F2F]', label: 'Decayed' },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                <span className="text-[#616161]">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tree View */}
            {viewMode === 'tree' && (
                <div className="space-y-2">
                    {branches.map((branch) => renderBranch(branch))}
                </div>
            )}

            {/* Analytics View */}
            {viewMode === 'analytics' && (
                <div className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-[#E8F5E9] rounded-2xl p-4 border border-[#4CAF50]/20">
                            <div className="flex items-center gap-2 mb-2">
                                <Activity className="w-5 h-5 text-[#4CAF50]" />
                                <span className="text-sm text-[#4CAF50]">Healthy</span>
                            </div>
                            <p className="text-3xl font-bold text-black">{healthyCount}</p>
                            <p className="text-xs text-[#616161] mt-1">{Math.round((healthyCount / allSkills.length) * 100)}% of skills</p>
                        </div>

                        <div className="bg-[#FFF3E0] rounded-2xl p-4 border border-[#E65100]/20">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="w-5 h-5 text-[#E65100]" />
                                <span className="text-sm text-[#E65100]">Fading</span>
                            </div>
                            <p className="text-3xl font-bold text-black">{fadingCount}</p>
                            <p className="text-xs text-[#616161] mt-1">Need attention</p>
                        </div>

                        <div className="bg-[#FFEBEE] rounded-2xl p-4 border border-[#D32F2F]/20">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingDown className="w-5 h-5 text-[#D32F2F]" />
                                <span className="text-sm text-[#D32F2F]">Decayed</span>
                            </div>
                            <p className="text-3xl font-bold text-black">{decayedCount}</p>
                            <p className="text-xs text-[#616161] mt-1">Need rebuild</p>
                        </div>

                        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-500/20">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-5 h-5 text-blue-600" />
                                <span className="text-sm text-blue-600">Mastered</span>
                            </div>
                            <p className="text-3xl font-bold text-black">{allSkills.filter((s) => s.mastery === 3).length}</p>
                            <p className="text-xs text-[#616161] mt-1">Level 4 skills</p>
                        </div>
                    </div>

                    {/* Skill Distribution Chart */}
                    <div className="bg-white rounded-2xl p-6 border border-[#E0E0E0] shadow-sm">
                        <h3 className="text-lg font-bold text-black mb-4">Skill Distribution by Category</h3>
                        <div className="space-y-4">
                            {branches.map((branch) => {
                                const childCount = flattenBranches([branch]).length;
                                const percentage = Math.round((childCount / allSkills.length) * 100);
                                const colors = getHealthColor(branch.health);
                                return (
                                    <div key={branch.id}>
                                        <div className="flex items-center justify-between text-sm mb-2">
                                            <span className="text-black font-medium">{branch.name}</span>
                                            <span className="text-[#616161]">{childCount} skills</span>
                                        </div>
                                        <div className="h-3 bg-[#E0E0E0] rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${colors.bg} transition-all duration-1000`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Decay Timeline */}
                    <div className="bg-white rounded-2xl p-6 border border-[#E0E0E0] shadow-sm">
                        <h3 className="text-lg font-bold text-black mb-4">Decay Risk Timeline</h3>
                        <div className="relative">
                            <div className="absolute top-4 left-0 right-0 h-1 bg-gradient-to-r from-[#4CAF50] via-[#E65100] to-[#D32F2F] rounded-full opacity-30" />
                            <div className="flex justify-between text-xs text-[#9E9E9E] mb-8">
                                <span>Safe</span>
                                <span>30 days</span>
                                <span>60 days</span>
                                <span>90 days</span>
                            </div>
                            <div className="space-y-3">
                                {allSkills
                                    .sort((a, b) => b.daysSinceVerified - a.daysSinceVerified)
                                    .slice(0, 5)
                                    .map((skill) => {
                                        const position = Math.min(100, (skill.daysSinceVerified / 90) * 100);
                                        const colors = getHealthColor(skill.health);
                                        return (
                                            <div key={skill.id} className="flex items-center gap-4">
                                                <div className="w-32 text-sm text-[#616161] truncate">{skill.name}</div>
                                                <div className="flex-1 relative h-2 bg-[#E0E0E0] rounded-full">
                                                    <div
                                                        className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${colors.bg} shadow-lg ${colors.glow} border-2 border-white`}
                                                        style={{ left: `calc(${position}% - 8px)` }}
                                                    />
                                                </div>
                                                <div className="w-16 text-xs text-[#9E9E9E] text-right">
                                                    {skill.daysSinceVerified}d ago
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>

                    {/* Mastery Levels */}
                    <div className="bg-white rounded-2xl p-6 border border-[#E0E0E0] shadow-sm">
                        <h3 className="text-lg font-bold text-black mb-4">Mastery Progression</h3>
                        <div className="flex items-end justify-around h-40">
                            {[0, 1, 2, 3].map((level) => {
                                const count = allSkills.filter((s) => s.mastery === level).length;
                                const percentage = (count / allSkills.length) * 100;
                                const labels = ['Seed', 'Sprout', 'Growing', 'Mastered'];
                                const icons = ['🌱', '🌿', '🌳', '🌲'];
                                return (
                                    <div key={level} className="flex flex-col items-center gap-2">
                                        <span className="text-2xl">{icons[level]}</span>
                                        <div
                                            className="w-16 bg-gradient-to-t from-[#4CAF50] to-[#81C784] rounded-t-lg transition-all duration-1000"
                                            style={{ height: `${Math.max(10, percentage * 1.2)}%` }}
                                        />
                                        <div className="text-center">
                                            <p className="text-lg font-bold text-black">{count}</p>
                                            <p className="text-xs text-[#616161]">{labels[level]}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Action Alert */}
            {fadingCount > 0 && viewMode !== 'analytics' && (
                <div className="p-4 rounded-2xl bg-[#FFF3E0] border border-[#E65100]/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#FFE0B2] flex items-center justify-center">
                            <Clock className="w-5 h-5 text-[#E65100]" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-black">
                                {fadingCount} skill{fadingCount > 1 ? 's need' : ' needs'} attention
                            </p>
                            <p className="text-sm text-[#616161]">
                                Verify them before they decay to maintain your expertise
                            </p>
                        </div>
                        <button className="px-4 py-2 rounded-xl bg-[#E65100] hover:bg-[#F57C00] text-white font-medium text-sm transition-all">
                            Verify Now
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SkillTree;
