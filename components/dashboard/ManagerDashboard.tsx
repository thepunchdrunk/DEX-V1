import React, { useState } from 'react';
import { UserProfile } from '../../types';
import AppShell from '../layout/AppShell';
import ManagerHub from './manager/ManagerHub';
import { RefreshCw, Activity } from 'lucide-react';

interface ManagerDashboardProps {
    user: UserProfile;
    onSwitchContext: () => void;
    onLogout: () => void;
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ user, onSwitchContext, onLogout }) => {
    // Minimal Sidebar for Manager (since nav is internal)
    const MANAGER_SIDEBAR_ITEMS = [
        { view: 'MANAGER_HUB', icon: Activity, label: 'Dashboard' }
    ];

    // Header Actions (right side in AppShell)
    const HeaderActions = (
        <div className="flex items-center gap-2">
            <button
                onClick={() => {
                    if (confirm('Reset demo state?')) {
                        localStorage.clear();
                        window.location.reload();
                    }
                }}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-black/5 rounded-full transition-colors"
                title="Reset Demo"
            >
                <RefreshCw className="w-5 h-5" />
            </button>
        </div>
    );

    return (
        <AppShell
            user={user}
            activeView="MANAGER_HUB" // Matches sidebar item
            onViewChange={() => { }} // No-op
            onLogout={onLogout}
            onSwitchContext={onSwitchContext}
            headerAction={HeaderActions}
            mode="MANAGER"
            managerNavItems={MANAGER_SIDEBAR_ITEMS}
        >
            <ManagerHub showSafeMode={true} />
        </AppShell>
    );
};

export default ManagerDashboard;
