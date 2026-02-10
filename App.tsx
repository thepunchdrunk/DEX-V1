import React, { useState, useEffect, useMemo } from 'react';
import {
  AppState,
  OnboardingDay,
  UserProfile,
} from './types';
import {
  MOCK_USER,
  MOCK_TEAM,
} from './constants';

// Import components
import OnboardingShell from './components/onboarding/OnboardingShell';
import RoleDashboard from './components/dashboard/RoleDashboard';
import RoleSelectionScreen from './components/onboarding/RoleSelectionScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/ui/Toast';

// Import styles
import './styles/design-system.css';

const STORAGE_KEY = 'dex_user_profile';

const isValidOnboardingDay = (day: unknown): day is OnboardingDay =>
  typeof day === 'number' && day >= 0 && day <= 5;

const parseSavedUser = (): UserProfile | null => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;

  try {
    const parsed = JSON.parse(saved) as Partial<UserProfile>;

    if (!parsed?.id || !parsed?.name || !parsed?.role || !isValidOnboardingDay(parsed?.onboardingDay)) {
      return null;
    }

    return {
      ...MOCK_USER,
      ...parsed,
      dayProgress: {
        ...MOCK_USER.dayProgress,
        ...(parsed.dayProgress ?? {}),
      },
    };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

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
  const [user, setUser] = useState<UserProfile | null>(parseSavedUser);

  const [appState, setAppState] = useState<AppState>(() => {
    const savedUser = parseSavedUser();
    if (!savedUser) return 'ROLE_SELECTION';
    if (!savedUser.onboardingComplete) return 'ONBOARDING';

    return 'ROLE_BASED';
  });

  // Check if today is Wednesday for Simulator — memoized
  const isWednesday = useMemo(() => new Date().getDay() === 3, []);

  // Persist user state ONLY if user exists
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
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

    const updatedUser: UserProfile = {
      ...MOCK_USER,
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
      ...MOCK_USER,
      ...prev,
      onboardingDay: Math.min(5, day + 1) as OnboardingDay,
      dayProgress: {
        ...MOCK_USER.dayProgress,
        ...prev.dayProgress,
        [day]: {
          ...MOCK_USER.dayProgress[day],
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
      {appState === 'ROLE_SELECTION' && <RoleSelectionScreen onSelectRole={handleRoleSelect} />}

      {appState === 'ONBOARDING' && (
        <OnboardingShell
          user={user}
          onDayComplete={handleDayComplete}
          onGraduate={handleGraduate}
        />
      )}

      {appState === 'ROLE_BASED' && (
        <RoleDashboard
          user={user}
          isWednesday={isWednesday}
          onUpdateUser={(updates) => setUser((prev) => ({ ...prev, ...updates }))}
        />
      )}
    </Providers>
  );
};

export default App;
