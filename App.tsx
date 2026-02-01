import React, { useState, useEffect } from 'react';
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
import ManagerDashboard from './components/dashboard/ManagerDashboard';
import RoleSelectionScreen from './components/onboarding/RoleSelectionScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/ui/Toast';

// Import styles
import './styles/design-system.css';
import { TeamProvider } from './hooks/useTeam';

// Storage key for persisting state
const STORAGE_KEY = 'dex_state';

interface AppPersistedState {
  appState: AppState;
  user: UserProfile;
}

const App: React.FC = () => {
  // appState and User initialization - always sequential
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('dex_user_profile');
    if (saved) return JSON.parse(saved);
    return { ...MOCK_USER, id: `user-${Math.random().toString(36).substr(2, 9)}` };
  });

  const [appState, setAppState] = useState<AppState>(() => {
    const savedUser = localStorage.getItem('dex_user_profile');
    if (!savedUser) return 'ROLE_SELECTION';

    const parsedUser: UserProfile = JSON.parse(savedUser);
    if (!parsedUser.onboardingComplete) return 'ONBOARDING';

    return 'ROLE_BASED';
  });

  // Check if today is Wednesday for Simulator
  const isWednesday = new Date().getDay() === 3;

  // Persist user state on change
  useEffect(() => {
    localStorage.setItem('dex_user_profile', JSON.stringify(user));
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

  // Toggle Context (Employee <-> Manager)
  const toggleManagerMode = () => {
    setAppState(prev => prev === 'MANAGER_HUB' ? 'ROLE_BASED' : 'MANAGER_HUB');
  };

  // Render Role Selection
  if (appState === 'ROLE_SELECTION') {
    return (
      <TeamProvider>
        <ToastProvider>
          <ErrorBoundary>
            <RoleSelectionScreen onSelectRole={handleRoleSelect} />
          </ErrorBoundary>
        </ToastProvider>
      </TeamProvider>
    );
  }

  // Render Onboarding Shell
  if (appState === 'ONBOARDING') {
    return (
      <TeamProvider>
        <ToastProvider>
          <ErrorBoundary>
            <OnboardingShell
              user={user}
              onDayComplete={handleDayComplete}
              onGraduate={handleGraduate}
            />
          </ErrorBoundary>
        </ToastProvider>
      </TeamProvider>
    );
  }

  // Manager Hub View
  if (appState === 'MANAGER_HUB') {
    return (
      <TeamProvider>
        <ToastProvider>
          <ErrorBoundary>
            <ManagerDashboard
              user={MOCK_MANAGER} // View as Sarah Chen
              onSwitchContext={toggleManagerMode}
              onLogout={() => window.location.reload()}
            />
          </ErrorBoundary>
        </ToastProvider>
      </TeamProvider>
    );
  }

  // Unified Role-Based Dashboard (Day 6+)
  return (
    <TeamProvider>
      <ToastProvider>
        <ErrorBoundary>
          <RoleDashboard
            user={user}
            isWednesday={isWednesday}
            onUpdateUser={(updates) => setUser((prev) => ({ ...prev, ...updates }))}
            onSwitchContext={toggleManagerMode}
          />
        </ErrorBoundary>
      </ToastProvider>
    </TeamProvider>
  );
};

export default App;
