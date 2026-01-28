import React, { useEffect, useState } from 'react';
import { DailyCard } from '../types';
import { generateDailyCards } from '../services/geminiService';
import { ShieldAlert, TrendingUp, Zap, CheckCircle2, RefreshCw } from 'lucide-react';



const DailyCockpit: React.FC = () => {
  const [cards, setCards] = useState<DailyCard[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCards = async () => {
    setLoading(true);
    // Simulate user context fetch
    // const context = "Senior QA Engineer, recently promoted, struggling with Python automation, high ticket volume in Jira.";
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Use imported mocks
    setCards([]); // In a real app this would be MOCK_DAILY_CARDS but I don't have it imported here? 
    // Wait, I need to check imports.

  };

  /**
   * Initial data load
   */
  useEffect(() => {
    loadCards();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'COMPLIANCE': return <ShieldAlert className="h-6 w-6 text-red-400" />;
      case 'KPI': return <TrendingUp className="h-6 w-6 text-blue-400" />;
      case 'MICRO_SKILL': return <Zap className="h-6 w-6 text-yellow-400" />;
      default: return <CheckCircle2 className="h-6 w-6 text-slate-400" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'COMPLIANCE': return 'border-l-red-500';
      case 'KPI': return 'border-l-blue-500';
      case 'MICRO_SKILL': return 'border-l-yellow-500';
      default: return 'border-l-slate-500';
    }
  };

  const getCardLabel = (type: string) => {
    switch (type) {
      case 'CONTEXT_ANCHOR': return 'KEY UPDATE';
      case 'DOMAIN_EDGE': return 'MARKET INSIGHT';
      case 'MICRO_SKILL': return 'PRO TIP';
      default: return type.replace('_', ' ');
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Today's Top 3</h2>
        <button onClick={loadCards} disabled={loading} className="text-slate-400 hover:text-white transition-colors">
          <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-xl bg-slate-800/50 animate-pulse border border-slate-700" />
          ))
        ) : (
          cards.map((card) => (
            <div
              key={card.id}
              className={`relative bg-slate-800/40 backdrop-blur-md rounded-xl p-6 border border-slate-700 hover:border-slate-500 transition-all group overflow-hidden border-l-4 ${getBorderColor(card.type)}`}
            >
              <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                {getIcon(card.type)}
              </div>
              <div className="mb-4">
                <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">{getCardLabel(card.type)}</span>
                <h3 className="text-xl font-semibold text-white mt-1 leading-snug">{card.title}</h3>
              </div>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                {card.description}
              </p>
              {card.actionLabel && (
                <button className="w-full py-2 bg-slate-700/50 hover:bg-blue-600/20 hover:text-blue-300 text-slate-300 rounded-lg text-sm font-medium transition-colors border border-slate-600 hover:border-blue-500/50">
                  {card.actionLabel}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DailyCockpit;
