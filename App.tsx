import React, { useState, useEffect } from 'react';
import {
  AppState,
  OnboardingDay,
  UserProfile,
} from './types';
import {
  MOCK_USER,
} from './constants';

// Import components
import OnboardingShell from './components/onboarding/OnboardingShell';
import RoleDashboard from './components/dashboard/RoleDashboard';
import RoleSelectionScreen from './components/onboarding/RoleSelectionScreen';
import ErrorBoundary from './components/ErrorBoundary';

// Import styles
import './styles/design-system.css';

// Storage key for persisting state
const STORAGE_KEY = 'dex_state';

interface AppPersistedState {
  appState: AppState;
  user: UserProfile;
}

const App: React.FC = () => {
  // Load persisted state
  const loadPersistedState = (): AppPersistedState | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load persisted state:', e);
    }
    return null;
  };

  const persistedState = loadPersistedState();

  // App State - Default to ROLE_SELECTION if no persisted state
  const [appState, setAppState] = useState<AppState>(
    persistedState?.appState || 'ROLE_SELECTION'
  );
  const [user, setUser] = useState<UserProfile>(
    persistedState?.user || MOCK_USER
  );

  // Check if today is Wednesday for Simulator
  const isWednesday = new Date().getDay() === 3;

  // Persist state on change
  useEffect(() => {
    const state: AppPersistedState = { appState, user };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [appState, user]);

  // Handle Role Selection
  const handleRoleSelect = (roleData: Partial<UserProfile>) => {
    setUser((prev) => ({
      ...prev,
      ...roleData,
    }));
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

  // Render Role Selection
  if (appState === 'ROLE_SELECTION') {
    return (
      <ErrorBoundary>
        <RoleSelectionScreen onSelectRole={handleRoleSelect} />
      </ErrorBoundary>
    );
  }

  // Render Onboarding Shell
  if (appState === 'ONBOARDING') {
    return (
      <ErrorBoundary>
        <OnboardingShell
          user={user}
          onDayComplete={handleDayComplete}
          onGraduate={handleGraduate}
        />
      </ErrorBoundary>
    );
  }

  // Unified Role-Based Dashboard (Day 6+)
  // Both Employees and Managers use RoleDashboard, but Managers get an extra "My Team" tab
  return (
    <ErrorBoundary>
      <RoleDashboard
        user={user}
        isWednesday={isWednesday}
        onUpdateUser={(updates) => setUser((prev) => ({ ...prev, ...updates }))}
      />
    </ErrorBoundary>
  );
};

export default App;
