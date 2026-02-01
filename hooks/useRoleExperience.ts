import { useMemo } from 'react';
import { UserProfile, RoleExperience } from '../types';
import { ROLE_EXPERIENCES } from '../constants';

export function useRoleExperience(user: UserProfile): RoleExperience | null {
    return useMemo(() => {
        if (!user || !user.jobTitle) return null;
        return ROLE_EXPERIENCES[user.jobTitle] || null;
    }, [user.jobTitle]);
}
