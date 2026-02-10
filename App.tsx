import React, { useState, useEffect, useMemo } from 'react';
import {
  AppState,
  OnboardingDay,
  UserProfile,
} from './types';
import {
  MOCK_USER,
  MOCK_TEAM,
  MOCK_MANAGER,
} from './constants';

// Import components
import OnboardingShell from './components/onboarding/OnboardingShell';
import RoleDashboard from './components/dashboard/RoleDashboard';
import RoleSelectionScreen from './components/onboarding/RoleSelectionScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/ui/Toast';

// Import styles
import './styles/design-system.css';
// Shared provider wrapper — defined OUTSIDE App to prevent remounting
const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ToastProvider>
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  </ToastProvider>
);

const App: React.FC = () => {
  // appState and User initialization - always sequential
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('dex_user_profile');
    if (saved) return JSON.parse(saved);
    return null; // Start fresh if no saved profile
  });

  const [appState, setAppState] = useState<AppState>(() => {
    const savedUser = localStorage.getItem('dex_user_profile');
    if (!savedUser) return 'ROLE_SELECTION';

    const parsedUser: UserProfile = JSON.parse(savedUser);
    if (!parsedUser.onboardingComplete) return 'ONBOARDING';

    return 'ROLE_BASED';
  });

  // Check if today is Wednesday for Simulator — memoized
  const isWednesday = useMemo(() => new Date().getDay() === 3, []);

  // Persist user state ONLY if user exists
  useEffect(() => {
    if (user) {
      localStorage.setItem('dex_user_profile', JSON.stringify(user));
    }
  }, [user]);

  // Handle Role Selection
  const handleRoleSelect = (roleData: Partial<UserProfile>) => {
    // Find the persona from MOCK_TEAM if an ID is provided
    let personaData = {};
    if (roleData.id) {
      const teamMember = MOCK_TEAM.find(m => m.id === roleData.id);
      if (teamMember) {
        personaData = {
          id: teamMember.id,
          name: teamMember.name,
          jobTitle: teamMember.title,
          manager: 'Sarah Chen', // Default reporting line
        };
      }
    }

    const updatedUser = {
      ...user,
      ...personaData,
      ...roleData,
      onboardingDay: 1
    };

    setUser(updatedUser);
    setAppState('ONBOARDING');
  };

  // Handle onboarding day completion
  const handleDayComplete = (day: OnboardingDay) => {
    setUser((prev) => ({
      ...prev,
      onboardingDay: Math.min(5, day + 1) as OnboardingDay,
      dayProgress: {
        ...prev.dayProgress,
        [day]: {
          ...prev.dayProgress[day],
          completed: true,
          completedAt: new Date().toISOString(),
        },
      },
    }));
  };

  // Handle graduation (transition to Role-Based)
  const handleGraduate = () => {
    setUser((prev) => ({
      ...prev,
      onboardingComplete: true,
    }));
    setAppState('ROLE_BASED');
  };

  // Unified Role-Based Dashboard (Day 6+)
  // Safety check: If user is missing but state thinks we're done, reset/fallback
  if (!user) {
    return (
      <Providers>
        <RoleSelectionScreen onSelectRole={handleRoleSelect} />
      </Providers>
    );
  }

  return (
    <Providers>
      <RoleDashboard
        user={user}
        isWednesday={isWednesday}
        onUpdateUser={(updates) => setUser((prev) => ({ ...prev, ...updates }))}
        onSwitchContext={() => {
          // Toggle user role instead of app state
          setUser(prev => ({ ...prev, role: prev.role === 'MANAGER' ? 'EMPLOYEE' : 'MANAGER' }));
        }}
      />
    </Providers>
  );
};

export default App;
