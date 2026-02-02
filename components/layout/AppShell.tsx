import React, { useState } from 'react';
import {
    Sparkles, TreePine, Compass, TrendingUp, Users, Settings,
    Menu, X, Bell, Search, LogOut, RefreshCw
} from 'lucide-react';
import { UserProfile } from '../../types';

interface AppShellProps {
    children: React.ReactNode;
    user: UserProfile;
    activeView: string;
    onViewChange: (view: any) => void;
    onLogout: () => void;
    headerAction?: React.ReactNode;
    mode?: 'EMPLOYEE' | 'MANAGER';
    managerNavItems?: { view: string; icon: any; label: string }[];
    onSwitchContext?: () => void;
}

const NAV_ITEMS = [
    { view: 'DAILY', icon: Sparkles, label: 'Daily 3' },
    { view: 'SKILLS', icon: TreePine, label: 'Skill Tree' },
    { view: 'INSIGHTS', icon: Compass, label: 'Insights' },
    { view: 'ANALYTICS', icon: TrendingUp, label: 'Performance' },
];

const AppShell: React.FC<AppShellProps> = ({
    children, user, activeView, onViewChange, onLogout, headerAction, mode = 'EMPLOYEE', managerNavItems, onSwitchContext
}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Manager Nav Items injected or standard
    const standardNavItems = [
        ...NAV_ITEMS,
        { view: 'SETTINGS', icon: Settings, label: 'Settings' }
    ];

    interface NavItem {
        view: string;
        icon: any;
        label: string;
    }

    const [currentNavItems, setCurrentNavItems] = useState<NavItem[]>(standardNavItems);

    React.useEffect(() => {
        if (mode === 'MANAGER' && managerNavItems) {
            setCurrentNavItems(managerNavItems);
        } else {
            setCurrentNavItems(standardNavItems);
        }
    }, [mode, managerNavItems]);

    return (
        <div className="min-h-screen bg-[var(--surface-base)] flex text-[var(--text-primary)]">
            {/* 
        DESKTOP SIDEBAR 
      */}
            <aside className="hidden md:flex flex-col w-64 bg-[var(--surface-card)] border-r border-[var(--border-light)] fixed h-full z-30">
                {/* Brand */}
                <div className="p-6 flex items-center gap-3">
                    <div className={`
                        h-8 w-8 rounded-lg flex items-center justify-center shadow-lg
                        ${mode === 'MANAGER' ? 'bg-indigo-600 shadow-indigo-500/20' : 'bg-[var(--brand-red)] shadow-red-500/20'}
                    `}>
                        {mode === 'MANAGER' ? <Users className="h-4 w-4 text-white" /> : <Sparkles className="h-4 w-4 text-white" />}
                    </div>
                    <div>
                        <h1 className="font-bold tracking-tight text-lg">{mode === 'MANAGER' ? 'Manager View' : 'DEX'}</h1>
                        <p className="text-[10px] text-[var(--text-secondary)] font-mono uppercase tracking-wider">
                            {mode === 'MANAGER' ? 'Strategic Command' : 'Workspace'}
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-4 space-y-1">
                    {currentNavItems.map((item) => (
                        <button
                            key={item.view}
                            onClick={() => onViewChange(item.view)}
                            className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                ${activeView === item.view
                                    ? (mode === 'MANAGER' ? 'bg-indigo-50 text-indigo-600 font-medium' : 'bg-red-50 text-[var(--brand-red)] font-medium')
                                    : 'text-[var(--text-secondary)] hover:bg-[#F5F5F5] hover:text-[var(--text-primary)]'}
              `}
                        >
                            <item.icon
                                className={`w-5 h-5 transition-colors ${activeView === item.view ? (mode === 'MANAGER' ? 'text-indigo-600' : 'text-[var(--brand-red)]') : 'text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]'}`}
                            />
                            {item.label}

                            {/* Active Indicator */}
                            {activeView === item.view && (
                                <div className={`ml-auto w-1.5 h-1.5 rounded-full shadow-[0_0_8px] ${mode === 'MANAGER' ? 'bg-indigo-600 shadow-indigo-600' : 'bg-[var(--brand-red)] shadow-[var(--brand-red)]'}`} />
                            )}
                        </button>
                    ))}
                </nav>

                {/* Switch Context Button (If Manager) */}
                {user.role === 'MANAGER' && (
                    <div className="px-4 pb-2">
                        <button
                            onClick={onSwitchContext}
                            className={`
                                w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all
                                ${mode === 'MANAGER'
                                    ? 'bg-white text-[var(--brand-red)] border border-[var(--border-light)] hover:bg-red-50'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20'
                                }
                            `}
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            {mode === 'MANAGER' ? 'Switch to Personal' : 'Switch to Manager View'}
                        </button>
                    </div>
                )}

                {/* User Footer */}
                <div className="p-4 border-t border-[var(--border-light)] bg-white/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3 p-2 rounded-xl border border-[var(--border-light)] bg-white shadow-sm">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--brand-red)] to-purple-600 flex items-center justify-center text-white text-xs font-bold border-2 border-white ring-1 ring-gray-100">
                            {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user.name}</p>
                            <p className="text-xs text-[var(--text-secondary)] truncate">{user.jobTitle}</p>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="w-full mt-3 flex items-center justify-center gap-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--status-error)] transition-colors py-2"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* 
        MAIN CONTENT AREA
        Pushed right on desktop
      */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                {/* Mobile Header */}
                <header className="md:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[var(--border-light)] px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${mode === 'MANAGER' ? 'bg-indigo-600' : 'bg-[var(--brand-red)]'}`}>
                            {mode === 'MANAGER' ? <Users className="h-4 w-4 text-white" /> : <Sparkles className="h-4 w-4 text-white" />}
                        </div>
                        <span className="font-bold">DEX {mode === 'MANAGER' && 'Manager View'}</span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-[var(--text-secondary)]">
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </header>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="md:hidden fixed inset-0 z-30 bg-white pt-20 px-4 animate-slide-down">
                        <nav className="space-y-2">
                            {currentNavItems.map((item) => (
                                <button
                                    key={item.view}
                                    onClick={() => {
                                        onViewChange(item.view);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`
                    w-full flex items-center gap-4 p-4 rounded-xl text-lg font-medium border
                    ${activeView === item.view
                                            ? 'bg-red-50 border-red-100 text-[var(--brand-red)]'
                                            : 'border-transparent text-[var(--text-secondary)]'}
                  `}
                                >
                                    <item.icon className="w-6 h-6" />
                                    {item.label}
                                </button>
                            ))}
                            {user.role === 'MANAGER' && (
                                <button
                                    onClick={() => {
                                        onSwitchContext && onSwitchContext();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-4 p-4 rounded-xl text-lg font-medium border border-indigo-100 bg-indigo-50 text-indigo-600 mt-4"
                                >
                                    <RefreshCw className="w-6 h-6" />
                                    {mode === 'MANAGER' ? 'Switch to Personal' : 'Switch to Manager View'}
                                </button>
                            )}
                        </nav>
                    </div>
                )}

                {/* Desktop Header (Search/Notifications) */}
                <header className="hidden md:flex sticky top-0 z-20 px-8 py-4 items-center justify-between bg-[var(--surface-base)]/80 backdrop-blur-sm">
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">
                        {currentNavItems.find(i => i.view === activeView)?.label || 'Dashboard'}
                    </h2>
                    <div className="flex items-center gap-4">
                        {headerAction}
                        <button className="p-2 text-[var(--text-secondary)] hover:bg-white hover:shadow-sm rounded-full transition-all">
                            <Search className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-[var(--text-secondary)] hover:bg-white hover:shadow-sm rounded-full transition-all relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--brand-red)] rounded-full border border-white" />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 px-4 md:px-8 py-6 overflow-x-hidden">
                    <div className="max-w-5xl mx-auto w-full animate-slide-up">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AppShell;
