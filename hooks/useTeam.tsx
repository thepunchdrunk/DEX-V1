import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { TeamMember } from '../types';
import { MOCK_TEAM } from '../constants';

interface TeamContextType {
    team: TeamMember[];
    updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
    applyStaffingPlan: (assignments: { id: string; project: string; load: number }[]) => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [team, setTeam] = useState<TeamMember[]>(MOCK_TEAM);

    const updateTeamMember = useCallback((id: string, updates: Partial<TeamMember>) => {
        setTeam(prev => prev.map(member =>
            member.id === id ? { ...member, ...updates } : member
        ));
    }, []);

    const applyStaffingPlan = useCallback((assignments: { id: string; project: string; load: number }[]) => {
        setTeam(prev => prev.map(member => {
            const assignment = assignments.find(a => a.id === member.id);
            if (assignment) {
                // Heuristic: If load > 100, increase burnout score slightly for the simulation
                const burnoutInc = assignment.load > 100 ? (assignment.load - 100) / 2 : 0;
                return {
                    ...member,
                    project: assignment.project,
                    currentLoad: assignment.load,
                    burnoutScore: Math.min(100, member.burnoutScore + burnoutInc)
                };
            }
            return member;
        }));
    }, []);

    const value = useMemo(() => ({
        team,
        updateTeamMember,
        applyStaffingPlan
    }), [team, updateTeamMember, applyStaffingPlan]);

    return (
        <TeamContext.Provider value={value}>
            {children}
        </TeamContext.Provider>
    );
};

export const useTeam = () => {
    const context = useContext(TeamContext);
    if (!context) {
        throw new Error('useTeam must be used within a TeamProvider');
    }
    return context;
};
