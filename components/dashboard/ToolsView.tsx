import React from 'react';
import { Sparkles, CheckCircle2, Circle, Target, Zap, BookOpen, ExternalLink, Wrench } from 'lucide-react';
import { UserProfile } from '../../types';

interface ToolsViewProps {
    user: UserProfile;
}

const TOOLS = [
    {
        id: 'jira',
        name: 'Jira',
        icon: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/atlassian_jira_logo_icon_170511.png',
        purpose: 'Project tracking & agile workflows',
        category: 'CORE',
        walkthroughCompleted: true,
        masteryLevel: 2,
    },
    {
        id: 'slack',
        name: 'Slack',
        icon: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/slack_logo_icon_169768.png',
        purpose: 'Team communication & alerts',
        category: 'CORE',
        walkthroughCompleted: true,
        masteryLevel: 3,
    },
    {
        id: 'confluence',
        name: 'Confluence',
        icon: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/atlassian_confluence_logo_icon_170514.png',
        purpose: 'Documentation & knowledge base',
        category: 'CORE',
        walkthroughCompleted: false,
        masteryLevel: 1,
    },
    {
        id: 'github',
        name: 'GitHub',
        icon: 'https://cdn.icon-icons.com/icons2/2351/PNG/512/logo_github_icon_143196.png',
        purpose: 'Code repositories & version control',
        category: 'DEV',
        walkthroughCompleted: true,
        masteryLevel: 2,
    },
    {
        id: 'vscode',
        name: 'VS Code',
        icon: 'https://cdn.icon-icons.com/icons2/2351/PNG/512/logo_visual_studio_code_icon_143324.png',
        purpose: 'IDE & development environment',
        category: 'DEV',
        walkthroughCompleted: true,
        masteryLevel: 3,
    },
    {
        id: 'zoom',
        name: 'Zoom',
        icon: 'https://cdn.icon-icons.com/icons2/2368/PNG/512/zoom_logo_icon_143765.png',
        purpose: 'Video conferencing',
        category: 'COMM',
        walkthroughCompleted: false,
        masteryLevel: 1,
    }
];

const ToolsView: React.FC<ToolsViewProps> = ({ user }) => {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-black flex items-center gap-2">
                    <Wrench className="w-6 h-6 text-red-600" />
                    My Tools
                </h1>
                <p className="text-gray-500">Manage and master your digital workbench.</p>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <Target className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Mastery</p>
                            <h3 className="text-2xl font-bold">{TOOLS.filter(t => t.walkthroughCompleted).length}/{TOOLS.length}</h3>
                        </div>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-1.5 mt-2">
                        <div
                            className="bg-red-500 h-1.5 rounded-full transition-all duration-1000"
                            style={{ width: `${(TOOLS.filter(t => t.walkthroughCompleted).length / TOOLS.length) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-[#E0E0E0] shadow-sm">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-[#616161] text-xs font-medium uppercase tracking-wider">Productivity</p>
                            <h3 className="text-2xl font-bold text-black border-none">+15%</h3>
                        </div>
                    </div>
                    <p className="text-xs text-[#616161]">Projected gain from tool mastery</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-[#E0E0E0] shadow-sm flex flex-col justify-center items-start">
                    <div className="flex items-center gap-2 text-[#616161] mb-2">
                        <BookOpen className="w-5 h-5" />
                        <span className="text-sm font-medium">Suggestion</span>
                    </div>
                    <p className="text-sm text-black">Complete <strong>Zoom</strong> walkthrough to boost collaboration score.</p>
                </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TOOLS.map((tool) => (
                    <div
                        key={tool.id}
                        className="group bg-white rounded-xl border border-[#E0E0E0] p-5 hover:border-red-200 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                                <img src={tool.icon} alt={tool.name} className="w-full h-full object-contain" />
                            </div>
                            {tool.category === 'CORE' && (
                                <span className="text-[10px] font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded-full flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" /> RECOMMENDED
                                </span>
                            )}
                        </div>

                        <div className="mb-4">
                            <h3 className="font-bold text-lg text-black group-hover:text-red-600 transition-colors">
                                {tool.name}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2">{tool.purpose}</p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs text-gray-400 uppercase tracking-wider font-semibold">
                                <span>Mastery Level</span>
                                <span>{tool.masteryLevel}/3</span>
                            </div>
                            <div className="flex gap-1">
                                {[1, 2, 3].map((level) => (
                                    <div
                                        key={level}
                                        className={`h-1.5 flex-1 rounded-full transition-all ${level <= tool.masteryLevel ? 'bg-green-500' : 'bg-gray-100'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                {tool.walkthroughCompleted ? (
                                    <span className="flex items-center gap-1 text-green-600 font-medium">
                                        <CheckCircle2 className="w-4 h-4" /> Certified
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-orange-500 font-medium">
                                        <Circle className="w-4 h-4" /> Pending
                                    </span>
                                )}
                            </div>
                            <button className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-black transition-colors">
                                <ExternalLink className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ToolsView;
