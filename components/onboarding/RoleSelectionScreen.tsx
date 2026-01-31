import React from 'react';
import { UserProfile, AppState } from '../../types';
import { Briefcase, Globe, Layout, CheckCircle2, Unlock, Sparkles } from 'lucide-react';

interface RoleSelectionScreenProps {
    onSelectRole: (roleData: Partial<UserProfile>) => void;
}

const ROLES = [
    {
        id: 'eng-manager',
        title: 'Engineering Manager',
        department: 'Engineering',
        roleCategory: 'DESK',
        role: 'MANAGER',
        icon: Briefcase,
        description: 'Focuses on team growth, performance management, and technical delivery through people leadership.',
        color: 'bg-blue-600',
        personaTag: 'People Leader',
        highlightTask: 'Team Performance Review',
    },
    {
        id: 'ops-supervisor',
        title: 'Operations Supervisor',
        department: 'Operations',
        roleCategory: 'FRONTLINE',
        role: 'MANAGER',
        icon: Layout,
        description: 'Leads frontline teams in Zone 4, prioritizing safety, shift productivity, and floor coaching.',
        color: 'bg-orange-600',
        personaTag: 'People Leader',
        highlightTask: 'Safety Drill Coaching',
    },
    {
        id: 'sr-eng',
        title: 'Senior Software Engineer',
        department: 'Engineering',
        roleCategory: 'DESK',
        role: 'EMPLOYEE',
        icon: Unlock,
        description: 'Leading technical implementation, architecture design, and high-quality code delivery.',
        color: 'bg-cyan-600',
        personaTag: 'Technical Lead',
        highlightTask: 'System Architecture PR',
    },
    {
        id: 'remote-eng',
        title: 'Cloud Architect',
        department: 'Engineering',
        roleCategory: 'REMOTE',
        role: 'EMPLOYEE',
        icon: Globe,
        description: 'Designs cloud infrastructure from anywhere, prioritizing async collaboration.',
        color: 'bg-indigo-600',
        personaTag: 'Global IC',
        highlightTask: 'Deploy Cloud Stack',
    },
    {
        id: 'customer-success',
        title: 'Customer Success',
        department: 'Sales',
        roleCategory: 'REMOTE',
        role: 'EMPLOYEE',
        icon: Sparkles,
        description: 'Manages client relationships and ensures customer satisfaction remotely.',
        color: 'bg-rose-600',
        personaTag: 'Client IC',
        highlightTask: 'Log Client Discovery',
    },
] as const;

const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ onSelectRole }) => {
    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-8 relative overflow-hidden">
            <div className="relative z-10 max-w-4xl w-full">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
                        Welcome to DEX
                    </h1>
                    <p className="text-xl text-[#616161]">
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
                                roleCategory: role.roleCategory as any,
                                role: role.role as any,
                            })}
                            className="group relative bg-white hover:bg-[#F5F5F5] border border-[#E0E0E0] hover:border-[#E60000] rounded-2xl p-6 transition-all duration-300 text-left hover:-translate-y-1 hover:shadow-xl hover:shadow-red-900/5"
                        >
                            <div className="flex items-start gap-5">
                                <div className={`p-4 rounded-xl ${role.color.replace('bg-', 'bg-opacity-10 text-')} transition-all group-hover:bg-opacity-20`}>
                                    <role.icon className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-black mb-2 group-hover:text-[#E60000] transition-colors">
                                        {role.title}
                                    </h3>
                                    <p className="text-[#616161] text-sm leading-relaxed">
                                        {role.description}
                                    </p>
                                    <div className="mt-4 flex flex-wrap items-center gap-2">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white ${role.color}`}>
                                            {role.personaTag}
                                        </span>
                                        <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-[#757575] border border-[#E0E0E0]">
                                            {role.department}
                                        </span>
                                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium text-[#E60000] bg-red-50 border border-red-100">
                                            <Sparkles className="w-3 h-3" />
                                            Key Task: {role.highlightTask}
                                        </div>
                                    </div>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-6 right-6">
                                    <CheckCircle2 className="w-6 h-6 text-[#E60000]" />
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
