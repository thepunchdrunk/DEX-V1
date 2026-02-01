import React from 'react';
import { UserProfile } from '../../types';
import { Briefcase, Globe, Layout, CheckCircle2, Unlock, Sparkles, ArrowRight } from 'lucide-react';
import AuthLayout from '../layout/AuthLayout';

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
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        borderColor: 'border-blue-100',
        personaTag: 'People Leader',
        highlightTask: 'Team Performance Review',
        reportingTo: 'Sarah Chen (Director of Eng)',
        personaId: 'tm-marcus',
    },
    {
        id: 'ops-supervisor',
        title: 'Operations Supervisor',
        department: 'Operations',
        roleCategory: 'FRONTLINE',
        role: 'MANAGER',
        icon: Layout,
        description: 'Leads frontline teams in Zone 4, prioritizing safety, shift productivity, and floor coaching.',
        color: 'text-orange-600',
        bg: 'bg-orange-50',
        borderColor: 'border-orange-100',
        personaTag: 'People Leader',
        highlightTask: 'Safety Drill Coaching',
        reportingTo: 'Sarah Chen (Director of Ops)',
        personaId: 'tm-casey',
    },
    {
        id: 'sr-eng',
        title: 'Senior Software Engineer',
        department: 'Engineering',
        roleCategory: 'DESK',
        role: 'EMPLOYEE',
        icon: Unlock,
        description: 'Leading technical implementation, architecture design, and high-quality code delivery.',
        color: 'text-cyan-600',
        bg: 'bg-cyan-50',
        borderColor: 'border-cyan-100',
        personaTag: 'Technical Lead',
        highlightTask: 'System Architecture PR',
        reportingTo: 'Sarah Chen (Director of Eng)',
        personaId: 'tm-alex',
    },
    {
        id: 'remote-eng',
        title: 'Cloud Architect',
        department: 'Engineering',
        roleCategory: 'REMOTE',
        role: 'EMPLOYEE',
        icon: Globe,
        description: 'Designs cloud infrastructure from anywhere, prioritizing async collaboration.',
        color: 'text-indigo-600',
        bg: 'bg-indigo-50',
        borderColor: 'border-indigo-100',
        personaTag: 'Global IC',
        highlightTask: 'Deploy Cloud Stack',
        reportingTo: 'Sarah Chen (Director of Eng)',
        personaId: 'tm-jamie',
    },
    {
        id: 'customer-success',
        title: 'Customer Success',
        department: 'Sales',
        roleCategory: 'REMOTE',
        role: 'EMPLOYEE',
        icon: Sparkles,
        description: 'Manages client relationships and ensures customer satisfaction remotely.',
        color: 'text-rose-600',
        bg: 'bg-rose-50',
        borderColor: 'border-rose-100',
        personaTag: 'Client IC',
        highlightTask: 'Log Client Discovery',
        reportingTo: 'Sarah Chen (Director of Sales)',
        personaId: 'tm-taylor',
    },
] as const;

const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ onSelectRole }) => {
    return (
        <AuthLayout
            title="Welcome to DEX"
            subtitle="Select a role to experience the Digital Employee Experience tailored to your journey."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {ROLES.map((role) => (
                    <button
                        key={role.id}
                        onClick={() => onSelectRole({
                            jobTitle: role.title,
                            department: role.department,
                            roleCategory: role.roleCategory as any,
                            role: role.role as any,
                            manager: role.reportingTo,
                            id: role.personaId, // Use persona ID
                        })}
                        className={`
                            group relative flex items-start gap-5 p-6 rounded-2xl text-left transition-all duration-300
                            bg-[var(--surface-card)] border border-[var(--border-light)]
                            hover:border-[var(--brand-red)] hover:shadow-lg hover:-translate-y-1
                            focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-2
                        `}
                        aria-label={`Select role: ${role.title}`}
                    >
                        {/* Icon Container */}
                        <div className={`
                            p-4 rounded-xl transition-colors duration-300
                            ${role.bg} ${role.color}
                            group-hover:bg-[var(--brand-red)] group-hover:text-white
                        `}>
                            <role.icon className="w-8 h-8" strokeWidth={1.5} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-3">
                            <div>
                                <h3 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-red)] transition-colors">
                                    {role.title}
                                </h3>
                                <p className="text-[var(--text-secondary)] text-sm leading-relaxed mt-1">
                                    {role.description}
                                </p>
                            </div>

                            {/* Metadata Tags */}
                            <div className="flex flex-wrap items-center gap-2">
                                <span className={`
                                    px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                                    bg-[var(--surface-base)] text-[var(--text-secondary)] border border-[var(--border-light)]
                                `}>
                                    {role.department}
                                </span>

                                <span className={`
                                    px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                                    border ${role.borderColor} ${role.bg} ${role.color}
                                `}>
                                    {role.personaTag}
                                </span>
                            </div>

                            {/* Highlight Task */}
                            <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] group-hover:text-[var(--brand-red)] transition-colors pt-2 border-t border-[var(--border-light)] border-dashed">
                                <Sparkles className="w-3 h-3" />
                                <span>Key Task: {role.highlightTask}</span>
                            </div>
                        </div>

                        {/* Hover Action Indicator */}
                        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                            <ArrowRight className="w-5 h-5 text-[var(--brand-red)]" />
                        </div>

                        {/* Selection Ring (Visual Polish) */}
                        <div className="absolute inset-0 border-2 border-[var(--brand-red)] rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
                    </button>
                ))}
            </div>
        </AuthLayout>
    );
};

export default RoleSelectionScreen;
