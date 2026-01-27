import React, { useState } from 'react';
import { Command, Mic, Loader2, ArrowRight } from 'lucide-react';
import { interpretCommand } from '../services/geminiService';
import { SearchIntent } from '../types';

import { UserContext } from '../types';

interface MagicCommandBarProps {
  userContext: UserContext;
}

const MagicCommandBar: React.FC<MagicCommandBarProps> = ({ userContext }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchIntent | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const intent = await interpretCommand(query, userContext);
      setResult(intent);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 relative z-20">
      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Command className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
        </div>
        <input
          type="text"
          className="w-full bg-slate-800/80 backdrop-blur-xl border border-slate-600 rounded-full py-4 pl-12 pr-12 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-lg hover:shadow-blue-500/10"
          placeholder="Ask Living OS (e.g., 'Request access to prod logs' or 'How is my team doing?')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="absolute inset-y-0 right-4 flex items-center">
          {loading ? (
            <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
          ) : (
            <button type="button" className="text-slate-400 hover:text-white transition-colors" aria-label="Voice Search">
              <Mic className="h-5 w-5" />
            </button>
          )}
        </div>
      </form>

      {/* Result Card (Simulated "Action Execution") */}
      {result && (
        <div className="absolute top-full left-0 right-0 mt-4 p-4 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl animate-fade-in-up backdrop-blur-md">
          <div className="flex items-start gap-4">
            <div className={`p-2 rounded-lg ${result.intentType === 'ACTION_EXECUTION' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
              <ArrowRight className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-1">
                {result.intentType.replace('_', ' ')}
              </h4>
              <p className="text-lg text-white font-medium">{result.responseMessage}</p>
              {Object.keys(result.actionParams || {}).length > 0 && (
                <div className="mt-2 text-xs font-mono text-slate-400 bg-slate-900/50 p-2 rounded">
                  {JSON.stringify(result.actionParams, null, 2)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MagicCommandBar;
