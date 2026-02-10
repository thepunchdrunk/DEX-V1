import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[var(--surface-base)] flex items-center justify-center p-4">
                    <div className="bg-[var(--surface-card)] border border-[var(--border-light)] rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8 text-[var(--brand-red)]" />
                        </div>
                        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Something went wrong</h1>
                        <p className="text-[var(--text-secondary)] mb-6">
                            The application encountered an unexpected error.
                        </p>
                        <div className="bg-[var(--surface-base)] p-4 rounded-lg text-left mb-6 overflow-auto max-h-40 border border-[var(--border-light)]">
                            <code className="text-xs text-[var(--status-error)] font-mono">
                                {this.state.error?.message}
                            </code>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-[var(--brand-red)] hover:opacity-90 text-white rounded-full font-medium transition-all flex items-center justify-center gap-2 mx-auto"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
