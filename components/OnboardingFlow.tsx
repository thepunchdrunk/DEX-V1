import React, { useState, useEffect } from 'react';
import { CheckCircle2, ShieldCheck, Map, Users, Award, ArrowRight, Loader2, Lock } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
}

// Extracted Sub-components for Performance
const Day1View: React.FC<{ onAdvance: () => void; loading: boolean }> = ({ onAdvance, loading }) => (
  <div className="animate-fade-in text-center max-w-lg mx-auto">
    <ShieldCheck className="w-16 h-16 text-blue-500 mx-auto mb-6" />
    <h2 className="text-3xl font-bold text-white mb-2">Automated Setup</h2>
    <p className="text-slate-400 mb-8">Verifying your digital identity and access privileges.</p>

    <div className="space-y-3 text-left bg-slate-800/50 p-6 rounded-xl border border-slate-700 mb-8">
      <div className="flex items-center gap-3 text-slate-300">
        <CheckCircle2 className="w-5 h-5 text-green-500" /> <span>Hardware ID Verified (MacBook Pro M2)</span>
      </div>
      <div className="flex items-center gap-3 text-slate-300">
        <CheckCircle2 className="w-5 h-5 text-green-500" /> <span>SSO & Okta Provisioning</span>
      </div>
      <div className="flex items-center gap-3 text-slate-300">
        <CheckCircle2 className="w-5 h-5 text-green-500" /> <span>GitHub & Jira Access Granted</span>
      </div>
      <div className="flex items-center gap-3 text-slate-300 opacity-50">
        <Loader2 className="w-4 h-4 animate-spin text-blue-400" /> <span>Syncing Payroll & Benefits...</span>
      </div>
    </div>

    <button onClick={onAdvance} disabled={loading} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-medium transition-all hover:scale-105 shadow-lg shadow-blue-900/20">
      {loading ? 'Processing...' : 'Confirm Profile'}
    </button>
  </div>
);

const Day2View: React.FC<{ onAdvance: () => void }> = ({ onAdvance }) => (
  <div className="animate-fade-in text-center max-w-lg mx-auto">
    <div className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-2xl mx-auto mb-6 flex items-center justify-center rotate-3 shadow-lg">
      <span className="text-2xl font-bold text-white">C</span>
    </div>
    <h2 className="text-3xl font-bold text-white mb-2">Company Culture</h2>
    <p className="text-slate-400 mb-8">Calibrating your decision matrix to company values.</p>

    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 text-left mb-8 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
      <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
      <h4 className="text-sm font-bold text-purple-400 mb-2 uppercase tracking-wide">Scenario #124</h4>
      <p className="text-white text-lg mb-4">"A critical deadline is 2 hours away, but you found a non-blocking edge-case bug in the UI. What do you do?"</p>

      <div className="space-y-3">
        <button onClick={onAdvance} className="w-full p-4 rounded-lg border border-slate-600 hover:bg-slate-700 hover:border-purple-400 transition-all text-left text-sm text-slate-300">
          A) Delay shipment to fix it (Perfection)
        </button>
        <button onClick={onAdvance} className="w-full p-4 rounded-lg border border-slate-600 hover:bg-slate-700 hover:border-purple-400 transition-all text-left text-sm text-slate-300 font-semibold">
          B) Ship and patch tomorrow (Velocity) <span className="ml-2 text-xs text-green-400 font-normal">- Recommended</span>
        </button>
      </div>
    </div>
  </div>
);

const Day3View: React.FC<{ onAdvance: () => void; loading: boolean }> = ({ onAdvance, loading }) => (
  <div className="animate-fade-in text-center max-w-2xl mx-auto">
    <Map className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
    <h2 className="text-3xl font-bold text-white mb-2">Organization Map</h2>
    <p className="text-slate-400 mb-8">Mapping your role to the downstream supply chain.</p>

    <div className="h-64 bg-slate-900 rounded-xl border border-slate-700 relative mb-8 overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950"></div>
      <div className="relative z-10 flex gap-12 items-center">
        <div className="text-center">
          <div className="w-4 h-4 bg-emerald-500 rounded-full mx-auto mb-2 animate-ping"></div>
          <div className="text-xs font-bold text-white">YOU (Austin)</div>
        </div>
        <div className="h-px w-24 bg-slate-600"></div>
        <div className="text-center opacity-50">
          <div className="w-3 h-3 bg-slate-500 rounded-full mx-auto mb-2"></div>
          <div className="text-xs text-slate-400">Dublin (HQ)</div>
        </div>
        <div className="h-px w-24 bg-slate-600"></div>
        <div className="text-center opacity-50">
          <div className="w-3 h-3 bg-slate-500 rounded-full mx-auto mb-2"></div>
          <div className="text-xs text-slate-400">Singapore (Ops)</div>
        </div>
      </div>
      <div className="absolute bottom-4 right-4 text-xs text-slate-600 font-mono">SUPPLY_CHAIN_VIS_V4.2</div>
    </div>

    <button onClick={onAdvance} disabled={loading} className="px-8 py-3 bg-slate-800 hover:bg-emerald-600 text-white border border-slate-600 hover:border-emerald-500 rounded-full font-medium transition-all">
      {loading ? 'Loading...' : 'Acknowledge Ecosystem'}
    </button>
  </div>
);

const Day4View: React.FC<{ onAdvance: () => void; loading: boolean }> = ({ onAdvance, loading }) => (
  <div className="animate-fade-in text-center max-w-lg mx-auto">
    <Users className="w-16 h-16 text-amber-500 mx-auto mb-6" />
    <h2 className="text-3xl font-bold text-white mb-2">Team Connections</h2>
    <p className="text-slate-400 mb-8">AI has identified your "Critical 5" partners based on job function.</p>

    <div className="grid gap-3 mb-8">
      {[
        { name: "Sarah J.", role: "Product Lead", match: "98%" },
        { name: "Mike T.", role: "Senior Dev", match: "95%" },
        { name: "Elena R.", role: "Ops Manager", match: "88%" },
      ].map((person, i) => (
        <div key={i} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center font-bold text-slate-300">
              {person.name[0]}
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-white">{person.name}</div>
              <div className="text-xs text-slate-400">{person.role}</div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs font-mono text-amber-500 mb-1">Match: {person.match}</span>
            <button className="text-xs bg-slate-700 hover:bg-amber-600 text-white px-3 py-1 rounded transition-colors">
              Connect
            </button>
          </div>
        </div>
      ))}
    </div>

    <button onClick={onAdvance} disabled={loading} className="px-8 py-3 bg-slate-800 hover:bg-amber-600 text-white border border-slate-600 hover:border-amber-500 rounded-full font-medium transition-all">
      Finalize Network
    </button>
  </div>
);

const Day5View: React.FC<{ onAdvance: () => void; loading: boolean }> = ({ onAdvance, loading }) => (
  <div className="animate-fade-in text-center max-w-lg mx-auto py-12">
    <div className="mb-8 relative inline-block">
      <div className="absolute inset-0 bg-amber-500 blur-2xl opacity-20 rounded-full"></div>
      <Award className="w-24 h-24 text-amber-400 relative z-10" />
    </div>

    <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500 mb-4">
      Onboarding Complete
    </h2>
    <p className="text-slate-300 text-lg mb-12">
      You have graduated from the sandbox.
      <br />
      <span className="text-amber-400 font-semibold">Full Dashboard Access</span> unlocked.
    </p>

    <button
      onClick={onAdvance}
      disabled={loading}
      className="group relative px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center gap-3 mx-auto"
    >
      <span>Enter Daily Dashboard</span>
      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
);

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [day, setDay] = useState(1);
  const [loading, setLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Simulation of async actions
  const advanceDay = () => {
    setLoading(true);
    setTimeout(() => {
      setCompletedSteps([...completedSteps, day]);
      if (day < 5) {
        setDay(day + 1);
      } else {
        onComplete();
      }
      setLoading(false);
    }, 800);
  };

  const renderProgressBar = () => (
    <div className="flex justify-between items-center mb-12 relative">
      <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-10 rounded-full"></div>
      {[1, 2, 3, 4, 5].map((step) => {
        const isActive = step === day;
        const isCompleted = completedSteps.includes(step) || step < day;
        return (
          <div key={step} className="flex flex-col items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 border-2
              ${isActive ? 'bg-blue-600 border-blue-400 text-white scale-110 shadow-[0_0_20px_rgba(37,99,235,0.5)]' :
                  isCompleted ? 'bg-slate-700 border-slate-600 text-slate-400' : 'bg-slate-900 border-slate-800 text-slate-600'}`}
            >
              {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step}
            </div>
            <span className={`text-xs font-mono tracking-widest ${isActive ? 'text-blue-400' : 'text-slate-600'}`}>
              DAY 0{step}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-12 px-4">
      <div className="w-full max-w-4xl">
        {renderProgressBar()}

        <div className="mt-8 min-h-[400px] flex flex-col justify-center">
          {day === 1 && <Day1View onAdvance={advanceDay} loading={loading} />}
          {day === 2 && <Day2View onAdvance={advanceDay} />}
          {day === 3 && <Day3View onAdvance={advanceDay} loading={loading} />}
          {day === 4 && <Day4View onAdvance={advanceDay} loading={loading} />}
          {day === 5 && <Day5View onAdvance={advanceDay} loading={loading} />}
        </div>

        {day < 5 && (
          <div className="mt-12 flex justify-center gap-2 text-xs text-slate-600 uppercase tracking-widest">
            <Lock className="w-3 h-3" />
            <span>Role Features Locked until Day 5</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;

