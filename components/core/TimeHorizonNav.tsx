import React from 'react';
import { Zap, TrendingUp, Rocket } from 'lucide-react';
import { TimeHorizon, HORIZON_CONFIG } from '../../types';

interface TimeHorizonNavProps {
    activeHorizon: TimeHorizon;
    onHorizonChange: (horizon: TimeHorizon) => void;
    horizonCounts?: Record<TimeHorizon, number>;
}

const TimeHorizonNav: React.FC<TimeHorizonNavProps> = ({
    activeHorizon,
    onHorizonChange,
    horizonCounts,
}) => {
    const horizons: TimeHorizon[] = ['IMMEDIATE', 'GROWTH', 'TRAJECTORY'];

    const getIcon = (horizon: TimeHorizon) => {
        switch (horizon) {
            case 'IMMEDIATE':
                return <Zap className="w-4 h-4" />;
            case 'GROWTH':
                return <TrendingUp className="w-4 h-4" />;
            case 'TRAJECTORY':
                return <Rocket className="w-4 h-4" />;
        }
    };

    return (
        <div className="flex items-center justify-center gap-2 p-1 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50">
            {horizons.map((horizon) => {
                const config = HORIZON_CONFIG[horizon];
                const isActive = activeHorizon === horizon;
                const count = horizonCounts?.[horizon];

                return (
                    <button
                        key={horizon}
                        onClick={() => onHorizonChange(horizon)}
                        className={`
              relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm
              transition-all duration-300 ease-out
              ${isActive
                                ? 'text-white shadow-lg'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                            }
            `}
                        style={{
                            backgroundColor: isActive ? config.color : undefined,
                            boxShadow: isActive ? `0 0 20px ${config.color}40` : undefined,
                        }}
                    >
                        {getIcon(horizon)}
                        <span>{config.label}</span>
                        {count !== undefined && count > 0 && (
                            <span
                                className={`
                  ml-1 px-1.5 py-0.5 text-xs font-bold rounded-full
                  ${isActive
                                        ? 'bg-white/20 text-white'
                                        : 'bg-slate-700 text-slate-300'
                                    }
                `}
                            >
                                {count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default TimeHorizonNav;
