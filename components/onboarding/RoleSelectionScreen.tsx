import React from 'react';
import { UserProfile, AppState } from '../../types';
import { Briefcase, Globe, Layout, CheckCircle2, Unlock } from 'lucide-react';

interface RoleSelectionScreenProps {
    onSelectRole: (roleData: Partial<UserProfile>) => void;
}

const ROLES = [
    {
        id: 'eng-manager',
        title: 'Engineering Manager',
        department: 'Engineering',
        roleCategory: 'DESK',
        icon: Briefcase,
        description: 'Leads teams, manages deliverables, and focuses on strategy.',
        color: 'bg-blue-500',
    },

    {
        id: 'product-manager',
        title: 'Product Manager',
        department: 'Product',
        roleCategory: 'DESK',
        icon: Layout,
        description: 'Defines vision, prioritizes features, and coordinates stakeholders.',
        color: 'bg-purple-500',
    },
    {
        id: 'remote-eng',
        title: 'Remote Engineer',
        department: 'Engineering',
        roleCategory: 'REMOTE',
        icon: Globe,
        description: 'Builds software from anywhere, prioritizing async collaboration.',
        color: 'bg-green-500',
    },
] as const;

const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ onSelectRole }) => {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative z-10 max-w-4xl w-full">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        Welcome to Living OS
                    </h1>
                    <p className="text-xl text-slate-400">
                        Select your role to personalize your onboarding journey.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ROLES.map((role) => (
                        <button
                            key={role.id}
                            onClick={() => onSelectRole({
                                jobTitle: role.title,
                                department: role.department,
                                roleCategory: role.roleCategory,
                            })}
                            className="group relative bg-slate-900/50 hover:bg-slate-800/80 border border-slate-700 hover:border-blue-500/50 rounded-2xl p-6 transition-all duration-300 text-left hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/20"
                        >
                            <div className="flex items-start gap-5">
                                <div className={`p-4 rounded-xl ${role.color} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
                                    <role.icon className={`w-8 h-8 ${role.color.replace('bg-', 'text-')}`} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                                        {role.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        {role.description}
                                    </p>
                                    <div className="mt-4 flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-wider">
                                        <span>{role.department}</span>
                                        <span>•</span>
                                        <span>{role.roleCategory} Mode</span>
                                    </div>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-6 right-6">
                                    <CheckCircle2 className="w-6 h-6 text-blue-500" />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RoleSelectionScreen;
