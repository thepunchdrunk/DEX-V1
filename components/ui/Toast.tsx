import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertTriangle, Info, Bell } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto-dismiss
        setTimeout(() => removeToast(id), 5000);
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
                            pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl 
                            border shadow-glass backdrop-blur-xl animate-slide-up
                            transition-all duration-300
                            ${getToastStyles(toast.type)}
                        `}
                    >
                        {getToastIcon(toast.type)}
                        <span className="text-sm font-medium">{toast.message}</span>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="p-1 rounded-full hover:bg-black/5 transition-colors"
                        >
                            <X className="w-4 h-4 opacity-50" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const getToastStyles = (type: ToastType): string => {
    switch (type) {
        case 'success':
            return 'bg-emerald-50/90 border-emerald-200 text-emerald-800';
        case 'error':
            return 'bg-red-50/90 border-red-200 text-red-800';
        case 'warning':
            return 'bg-amber-50/90 border-amber-200 text-amber-800';
        case 'info':
        default:
            return 'bg-blue-50/90 border-blue-200 text-blue-800';
    }
};

const getToastIcon = (type: ToastType) => {
    switch (type) {
        case 'success':
            return <CheckCircle className="w-5 h-5 text-emerald-600" />;
        case 'error':
            return <AlertTriangle className="w-5 h-5 text-red-600" />;
        case 'warning':
            return <AlertTriangle className="w-5 h-5 text-amber-600" />;
        case 'info':
        default:
            return <Info className="w-5 h-5 text-blue-600" />;
    }
};
