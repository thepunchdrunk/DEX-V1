import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TeamMember } from '../types';
import { Users, AlertTriangle } from 'lucide-react';

const mockTeamData: TeamMember[] = [
  { id: '1', name: 'Alice', role: 'DevOps', burnoutScore: 30, skillVelocity: 85, lastActive: '2m ago', skills: [] },
  { id: '2', name: 'Bob', role: 'Frontend', burnoutScore: 78, skillVelocity: 45, lastActive: '1h ago', skills: [] },
  { id: '3', name: 'Charlie', role: 'Backend', burnoutScore: 12, skillVelocity: 92, lastActive: '5m ago', skills: [] },
  { id: '4', name: 'Diana', role: 'QA', burnoutScore: 65, skillVelocity: 60, lastActive: '10m ago', skills: [] },
];

const ManagerHub: React.FC = () => {
  return (
    <div className="w-full mt-12">
      <div className="flex items-center gap-3 mb-6">
        <Users className="h-6 w-6 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Manager Hub <span className="text-slate-500 font-normal">| Team Pulse</span></h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Burnout Detector */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-200">Digital Friction & Burnout</h3>
              <p className="text-xs text-slate-400">Based on error rates, late logins, and dwell time.</p>
            </div>
            {mockTeamData.some(m => m.burnoutScore > 70) && (
              <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs font-bold">
                <AlertTriangle className="h-3 w-3" />
                ACTION REQUIRED
              </div>
            )}
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockTeamData} layout="vertical" margin={{ left: 0 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" width={80} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#334155', opacity: 0.2}}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                />
                <Bar dataKey="burnoutScore" radius={[0, 4, 4, 0]} barSize={20}>
                  {mockTeamData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.burnoutScore > 70 ? '#ef4444' : entry.burnoutScore > 40 ? '#f59e0b' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Velocity */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6">
           <h3 className="text-lg font-semibold text-slate-200 mb-6">Skill Acquisition Velocity</h3>
           <div className="space-y-4">
             {mockTeamData.map(member => (
               <div key={member.id} className="group">
                 <div className="flex justify-between text-sm mb-1">
                   <span className="text-slate-300">{member.name}</span>
                   <span className="text-blue-400 font-mono">{member.skillVelocity}%</span>
                 </div>
                 <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out group-hover:bg-blue-400" 
                    style={{ width: `${member.skillVelocity}%` }}
                   />
                 </div>
               </div>
             ))}
           </div>
           
           <div className="mt-6 pt-6 border-t border-slate-700">
             <button className="text-sm text-slate-400 hover:text-white transition-colors">
               View detailed training recommendations →
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerHub;
