import React, { useState, useEffect } from 'react';
import {
    Check,
    Circle,
    Loader2,
    AlertCircle,
    ChevronRight,
    ChevronDown,
    Laptop,
    Key,
    MapPin,
    Shield,
    Calendar,
    Receipt,
    Car,
    Utensils,
    Building2,
    Wifi,
    Wallet,
    Heart,
    Lock,
    FileSignature,
    AlertTriangle,
    Eye,
    EyeOff,
    Play,
    CheckCircle2,
} from 'lucide-react';
import {
    UserProfile,
    GreenLightCheck,
    DigitalProfile,
    SystemCheckStatus,
    Day1ModuleId,
    WorkEssential,
    DailyLifeLogistic,
    PayrollBenefitsItem,
    DigitalReadinessItem,
    SafetyWellbeingItem,
    PrivacySettings,
} from '../../../types';
import {
    GREEN_LIGHT_CHECKS,
    DAY1_MODULES,
    WORK_ESSENTIALS,
    DAILY_LIFE_LOGISTICS,
    PAYROLL_BENEFITS_ITEMS,
    DIGITAL_READINESS_ITEMS,
    SAFETY_WELLBEING_ITEMS,
} from '../../../constants';

interface Day1LifeWorkSetupProps {
    user: UserProfile;
    onComplete: () => void;
}

const Day1LifeWorkSetup: React.FC<Day1LifeWorkSetupProps> = ({
    user,
    onComplete,
}) => {
    // State for each module
    const [checks, setChecks] = useState<GreenLightCheck[]>(
        GREEN_LIGHT_CHECKS.filter(item => !item.roleCategories || (user.roleCategory && item.roleCategories.includes(user.roleCategory)))
    );
    const [workEssentials, setWorkEssentials] = useState<WorkEssential[]>(
        WORK_ESSENTIALS.filter(item => !item.roleCategories || (user.roleCategory && item.roleCategories.includes(user.roleCategory)))
    );
    const [dailyLogistics, setDailyLogistics] = useState<DailyLifeLogistic[]>(DAILY_LIFE_LOGISTICS);
    const [payrollBenefits, setPayrollBenefits] = useState<PayrollBenefitsItem[]>(PAYROLL_BENEFITS_ITEMS);
    const [digitalReadiness, setDigitalReadiness] = useState<DigitalReadinessItem[]>(
        DIGITAL_READINESS_ITEMS.filter(item => !item.roleCategories || (user.roleCategory && item.roleCategories.includes(user.roleCategory)))
    );
    const [safetyWellbeing, setSafetyWellbeing] = useState<SafetyWellbeingItem[]>(
        SAFETY_WELLBEING_ITEMS.filter(item => !item.roleCategories || (user.roleCategory && item.roleCategories.includes(user.roleCategory)))
    );
    const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
        safeMode: false,
        learningVisibility: 'VISIBLE',
        behaviorTracking: true,
        dataRetentionAcknowledged: false,
        lastUpdated: new Date().toISOString(),
    });

    // Active module and demo states
    const [activeModule, setActiveModule] = useState<Day1ModuleId>('GREEN_LIGHT');
    const [activeDemo, setActiveDemo] = useState<string | null>(null);
    const [demoStep, setDemoStep] = useState(0);
    const [profile, setProfile] = useState<DigitalProfile>({
        displayName: user.name,
        pronouns: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        workStyle: 'FLEXIBLE',
        communicationPreference: 'SLACK',
        bio: '',
    });

    // Simulate system checks
    useEffect(() => {
        const pending = checks.filter((c) => c.status === 'PENDING' || c.status === 'CHECKING');
        if (pending.length === 0) return;

        const timer = setTimeout(() => {
            setChecks((prev) =>
                prev.map((check) => {
                    if (check.status === 'PENDING') {
                        return { ...check, status: 'CHECKING' as SystemCheckStatus };
                    }
                    if (check.status === 'CHECKING') {
                        const pass = Math.random() > 0.1;
                        return { ...check, status: (pass ? 'PASS' : 'FAIL') as SystemCheckStatus };
                    }
                    return check;
                })
            );
        }, 800);

        return () => clearTimeout(timer);
    }, [checks]);

    // Module completion calculations
    const greenLightComplete = checks.every(c => c.status === 'PASS');
    const workEssentialsComplete = workEssentials.every(w => w.completed);
    const dailyLogisticsComplete = dailyLogistics.every(d => d.status === 'COMPLETED');
    const payrollBenefitsComplete = payrollBenefits.every(p => p.completed);
    const digitalReadinessComplete = digitalReadiness.every(d => d.status === 'VERIFIED');
    const safetyWellbeingComplete = safetyWellbeing.every(s => s.acknowledged);
    const privacyComplete = privacySettings.dataRetentionAcknowledged;

    const moduleProgress: Record<Day1ModuleId, { complete: boolean; progress: number }> = {
        GREEN_LIGHT: {
            complete: greenLightComplete,
            progress: checks.filter(c => c.status === 'PASS').length / checks.length * 100
        },
        WORK_ESSENTIALS: {
            complete: workEssentialsComplete,
            progress: workEssentials.filter(w => w.completed).length / workEssentials.length * 100
        },
        DAILY_LOGISTICS: {
            complete: dailyLogisticsComplete,
            progress: dailyLogistics.filter(d => d.status === 'COMPLETED').length / dailyLogistics.length * 100
        },
        PAYROLL_BENEFITS: {
            complete: payrollBenefitsComplete,
            progress: payrollBenefits.filter(p => p.completed).length / payrollBenefits.length * 100
        },
        DIGITAL_READINESS: {
            complete: digitalReadinessComplete,
            progress: digitalReadiness.filter(d => d.status === 'VERIFIED').length / digitalReadiness.length * 100
        },
        SAFETY_WELLBEING: {
            complete: safetyWellbeingComplete,
            progress: safetyWellbeing.filter(s => s.acknowledged).length / safetyWellbeing.length * 100
        },
        PRIVACY_SETTINGS: {
            complete: privacyComplete,
            progress: privacyComplete ? 100 : 0
        },
    };

    const allModulesComplete = Object.values(moduleProgress).every(m => m.complete);
    const completedModulesCount = Object.values(moduleProgress).filter(m => m.complete).length;

    const getModuleIcon = (id: Day1ModuleId, size = 5) => {
        const iconClass = `w-${size} h-${size}`;
        switch (id) {
            case 'GREEN_LIGHT': return <Circle className={iconClass} />;
            case 'WORK_ESSENTIALS': return <Calendar className={iconClass} />;
            case 'DAILY_LOGISTICS': return <Building2 className={iconClass} />;
            case 'PAYROLL_BENEFITS': return <Wallet className={iconClass} />;
            case 'DIGITAL_READINESS': return <Key className={iconClass} />;
            case 'SAFETY_WELLBEING': return <Shield className={iconClass} />;
            case 'PRIVACY_SETTINGS': return <Lock className={iconClass} />;
        }
    };

    const handleStartDemo = (itemId: string) => {
        setActiveDemo(itemId);
        setDemoStep(0);
    };

    const handleDemoNext = (item: WorkEssential) => {
        if (item.demoSteps && demoStep < item.demoSteps.length - 1) {
            setDemoStep(prev => prev + 1);
        } else {
            setWorkEssentials(prev => prev.map(w =>
                w.id === item.id ? { ...w, completed: true } : w
            ));
            setActiveDemo(null);
            setDemoStep(0);
        }
    };

    const handleCompleteLogistic = (id: string) => {
        setDailyLogistics(prev => prev.map(d =>
            d.id === id ? { ...d, status: 'COMPLETED' } : d
        ));
    };

    const handleCompletePayroll = (id: string) => {
        setPayrollBenefits(prev => prev.map(p =>
            p.id === id ? { ...p, completed: true, signedAt: p.requiresSignature ? new Date().toISOString() : undefined } : p
        ));
    };

    const handleVerifyDigital = (id: string) => {
        setDigitalReadiness(prev => prev.map(d =>
            d.id === id ? { ...d, status: 'VERIFIED', verifiedAt: new Date().toISOString() } : d
        ));
    };

    const handleAcknowledgeSafety = (id: string) => {
        setSafetyWellbeing(prev => prev.map(s =>
            s.id === id ? { ...s, acknowledged: true, acknowledgedAt: new Date().toISOString() } : s
        ));
    };

    const renderModuleContent = () => {
        switch (activeModule) {
            case 'GREEN_LIGHT':
                return renderGreenLightModule();
            case 'WORK_ESSENTIALS':
                return renderWorkEssentialsModule();
            case 'DAILY_LOGISTICS':
                return renderDailyLogisticsModule();
            case 'PAYROLL_BENEFITS':
                return renderPayrollBenefitsModule();
            case 'DIGITAL_READINESS':
                return renderDigitalReadinessModule();
            case 'SAFETY_WELLBEING':
                return renderSafetyWellbeingModule();
            case 'PRIVACY_SETTINGS':
                return renderPrivacyModule();
        }
    };

    const renderGreenLightModule = () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-black">System Readiness Checks</h3>
                <span className="text-sm text-[#616161]">
                    {checks.filter(c => c.status === 'PASS').length}/{checks.length} Ready
                </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {checks.map((check) => (
                    <div
                        key={check.id}
                        className={`
                            flex items-center gap-4 p-4 rounded-xl border transition-all duration-300
                            ${check.status === 'PASS' ? 'bg-[#E8F5E9] border-[#4CAF50]/30' : ''}
                            ${check.status === 'FAIL' ? 'bg-[#FFEBEE] border-[#D32F2F]/30' : ''}
                            ${check.status === 'CHECKING' ? 'bg-red-50 border-[#E60000]/30' : ''}
                            ${check.status === 'PENDING' ? 'bg-[#F5F5F5] border-[#E0E0E0]' : ''}
                        `}
                    >
                        <div className={`
                            w-10 h-10 rounded-lg flex items-center justify-center text-xl
                            ${check.status === 'PASS' ? 'bg-[#C8E6C9]' : ''}
                            ${check.status === 'FAIL' ? 'bg-[#FFCDD2]' : ''}
                            ${check.status === 'CHECKING' ? 'bg-red-100' : ''}
                            ${check.status === 'PENDING' ? 'bg-[#E0E0E0]' : ''}
                        `}>
                            {check.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-black">{check.label}</p>
                            <p className="text-xs text-[#757575] truncate">{check.details}</p>
                        </div>
                        {check.status === 'PASS' && <Check className="w-5 h-5 text-[#4CAF50]" />}
                        {check.status === 'FAIL' && <AlertCircle className="w-5 h-5 text-[#D32F2F]" />}
                        {check.status === 'CHECKING' && <Loader2 className="w-5 h-5 text-[#E60000] animate-spin" />}
                        {check.status === 'PENDING' && <Circle className="w-5 h-5 text-[#9E9E9E]" />}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderWorkEssentialsModule = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black mb-4">Work Essentials</h3>
            <p className="text-[#616161] text-sm mb-6">
                Learn how to manage your time off, expenses, and view company holidays.
            </p>
            {workEssentials.map((item) => (
                <div key={item.id} className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden">
                    <div className="p-4 flex items-center gap-4">
                        <div className={`
                            w-12 h-12 rounded-xl flex items-center justify-center
                            ${item.completed ? 'bg-[#E8F5E9] text-[#4CAF50]' : 'bg-[#F5F5F5] text-[#757575]'}
                        `}>
                            {item.category === 'LEAVE' && <Calendar className="w-6 h-6" />}
                            {item.category === 'EXPENSES' && <Receipt className="w-6 h-6" />}
                            {item.category === 'HOLIDAY_CALENDAR' && <Calendar className="w-6 h-6" />}
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-black">{item.title}</p>
                            <p className="text-sm text-[#616161]">{item.description}</p>
                        </div>
                        {item.completed ? (
                            <div className="px-3 py-1.5 bg-[#E8F5E9] text-[#4CAF50] text-sm rounded-lg flex items-center gap-1">
                                <Check className="w-4 h-4" /> Done
                            </div>
                        ) : item.interactiveDemo ? (
                            <button
                                onClick={() => handleStartDemo(item.id)}
                                className="px-4 py-2 bg-[#E60000] hover:bg-[#CC0000] text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-all"
                            >
                                <Play className="w-4 h-4" /> Start Demo
                            </button>
                        ) : (
                            <button
                                onClick={() => setWorkEssentials(prev => prev.map(w => w.id === item.id ? { ...w, completed: true } : w))}
                                className="px-4 py-2 bg-[#F5F5F5] hover:bg-[#E0E0E0] text-black text-sm font-medium rounded-lg transition-all border border-[#E0E0E0]"
                            >
                                View & Complete
                            </button>
                        )}
                    </div>

                    {/* Interactive Demo */}
                    {activeDemo === item.id && item.demoSteps && (
                        <div className="p-4 bg-[#FAFAFA] border-t border-[#E0E0E0]">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-xs text-[#E60000] font-medium">
                                    Step {demoStep + 1} of {item.demoSteps.length}
                                </span>
                                <div className="flex-1 h-1 bg-[#E0E0E0] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#E60000] transition-all"
                                        style={{ width: `${((demoStep + 1) / item.demoSteps.length) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <p className="text-black mb-4">{item.demoSteps[demoStep]}</p>
                            <button
                                onClick={() => handleDemoNext(item)}
                                className="px-4 py-2 bg-[#E60000] hover:bg-[#CC0000] text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-all"
                            >
                                {demoStep < item.demoSteps.length - 1 ? 'Next Step' : 'Complete Demo'}
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );

    const renderDailyLogisticsModule = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black mb-4">Daily Life Logistics</h3>
            <p className="text-[#616161] text-sm mb-6">
                Everything you need to know about commuting, parking, meals, and workplace facilities.
            </p>
            <div className="grid grid-cols-1 gap-3">
                {dailyLogistics.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl border border-[#E0E0E0] p-4 flex items-center gap-4">
                        <div className={`
                            w-12 h-12 rounded-xl flex items-center justify-center
                            ${item.status === 'COMPLETED' ? 'bg-[#E8F5E9] text-[#4CAF50]' : 'bg-[#F5F5F5] text-[#757575]'}
                        `}>
                            {item.category === 'COMMUTE' && <Car className="w-6 h-6" />}
                            {item.category === 'PARKING' && <Car className="w-6 h-6" />}
                            {item.category === 'CANTEEN' && <Utensils className="w-6 h-6" />}
                            {item.category === 'FACILITIES' && <Building2 className="w-6 h-6" />}
                            {item.category === 'WIFI_PRINTER' && <Wifi className="w-6 h-6" />}
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-black">{item.title}</p>
                            <p className="text-sm text-[#616161]">{item.description}</p>
                        </div>
                        {item.status === 'COMPLETED' ? (
                            <div className="px-3 py-1.5 bg-[#E8F5E9] text-[#4CAF50] text-sm rounded-lg flex items-center gap-1">
                                <Check className="w-4 h-4" /> Done
                            </div>
                        ) : (
                            <button
                                onClick={() => handleCompleteLogistic(item.id)}
                                className="px-4 py-2 bg-[#F5F5F5] hover:bg-[#E0E0E0] text-black text-sm font-medium rounded-lg transition-all border border-[#E0E0E0]"
                            >
                                {item.actionLabel || 'View'}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderPayrollBenefitsModule = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black mb-4">Payroll & Benefits</h3>
            <p className="text-[#616161] text-sm mb-6">
                Understand your compensation, benefits, and required forms.
            </p>
            <div className="grid grid-cols-1 gap-3">
                {payrollBenefits.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl border border-[#E0E0E0] p-4 flex items-center gap-4">
                        <div className={`
                            w-12 h-12 rounded-xl flex items-center justify-center
                            ${item.completed ? 'bg-[#E8F5E9] text-[#4CAF50]' : 'bg-[#F5F5F5] text-[#757575]'}
                        `}>
                            {item.category === 'PAYROLL' && <Wallet className="w-6 h-6" />}
                            {item.category === 'INSURANCE' && <Heart className="w-6 h-6" />}
                            {item.category === 'DEPENDENT' && <Heart className="w-6 h-6" />}
                            {item.category === 'CLAIMS' && <Receipt className="w-6 h-6" />}
                            {item.category === 'TAX' && <FileSignature className="w-6 h-6" />}
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-black flex items-center gap-2">
                                {item.title}
                                {item.requiresSignature && (
                                    <span className="text-xs px-2 py-0.5 bg-[#FFF3E0] text-[#E65100] rounded">
                                        Signature Required
                                    </span>
                                )}
                            </p>
                            <p className="text-sm text-[#616161]">{item.description}</p>
                        </div>
                        {item.completed ? (
                            <div className="px-3 py-1.5 bg-[#E8F5E9] text-[#4CAF50] text-sm rounded-lg flex items-center gap-1">
                                <Check className="w-4 h-4" /> {item.signedAt ? 'Signed' : 'Done'}
                            </div>
                        ) : (
                            <button
                                onClick={() => handleCompletePayroll(item.id)}
                                className="px-4 py-2 bg-[#F5F5F5] hover:bg-[#E0E0E0] text-black text-sm font-medium rounded-lg transition-all border border-[#E0E0E0]"
                            >
                                {item.requiresSignature ? 'Sign Now' : 'Review'}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderDigitalReadinessModule = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black mb-4">Digital Readiness</h3>
            <p className="text-[#616161] text-sm mb-6">
                Verify your access to essential systems and complete security setup.
            </p>
            <div className="grid grid-cols-1 gap-3">
                {digitalReadiness.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl border border-[#E0E0E0] p-4 flex items-center gap-4">
                        <div className={`
                            w-12 h-12 rounded-xl flex items-center justify-center
                            ${item.status === 'VERIFIED' ? 'bg-[#E8F5E9] text-[#4CAF50]' : ''}
                            ${item.status === 'FAILED' ? 'bg-[#FFEBEE] text-[#D32F2F]' : ''}
                            ${item.status === 'NOT_STARTED' || item.status === 'IN_PROGRESS' ? 'bg-[#F5F5F5] text-[#757575]' : ''}
                        `}>
                            <Key className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-black">{item.title}</p>
                            <p className="text-sm text-[#616161]">{item.description}</p>
                        </div>
                        {item.status === 'VERIFIED' ? (
                            <div className="px-3 py-1.5 bg-[#E8F5E9] text-[#4CAF50] text-sm rounded-lg flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" /> Verified
                            </div>
                        ) : item.status === 'FAILED' ? (
                            <button
                                onClick={() => handleVerifyDigital(item.id)}
                                className="px-4 py-2 bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-sm font-medium rounded-lg transition-all"
                            >
                                Retry
                            </button>
                        ) : (
                            <button
                                onClick={() => handleVerifyDigital(item.id)}
                                className="px-4 py-2 bg-[#E60000] hover:bg-[#CC0000] text-white text-sm font-medium rounded-lg transition-all"
                            >
                                Verify Now
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderSafetyWellbeingModule = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black mb-4">Safety & Wellbeing</h3>
            <p className="text-[#616161] text-sm mb-6">
                Important safety procedures and wellbeing resources available to you.
            </p>
            <div className="grid grid-cols-1 gap-3">
                {safetyWellbeing.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl border border-[#E0E0E0] p-4">
                        <div className="flex items-center gap-4">
                            <div className={`
                                w-12 h-12 rounded-xl flex items-center justify-center
                                ${item.acknowledged ? 'bg-[#E8F5E9] text-[#4CAF50]' : 'bg-[#FFF3E0] text-[#E65100]'}
                            `}>
                                {item.category === 'EMERGENCY' && <AlertTriangle className="w-6 h-6" />}
                                {item.category === 'EVACUATION' && <MapPin className="w-6 h-6" />}
                                {item.category === 'HEALTH' && <Heart className="w-6 h-6" />}
                                {item.category === 'ACCESSIBILITY' && <Shield className="w-6 h-6" />}
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-black">{item.title}</p>
                                <p className="text-sm text-[#616161]">{item.description}</p>
                            </div>
                            {item.acknowledged ? (
                                <div className="px-3 py-1.5 bg-[#E8F5E9] text-[#4CAF50] text-sm rounded-lg flex items-center gap-1">
                                    <Check className="w-4 h-4" /> Acknowledged
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleAcknowledgeSafety(item.id)}
                                    className="px-4 py-2 bg-[#FF9800] hover:bg-[#F57C00] text-white text-sm font-medium rounded-lg transition-all"
                                >
                                    Acknowledge
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderPrivacyModule = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-black mb-4">Privacy Settings</h3>
            <p className="text-[#616161] text-sm mb-6">
                Control how your data is used within DEX. We believe in transparency.
            </p>

            {/* Data Collection Notice */}
            <div className="bg-white rounded-xl border border-[#E0E0E0] p-6">
                <h4 className="font-medium text-black mb-4">What data we collect</h4>
                <ul className="text-sm text-[#616161] space-y-2">
                    <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#E60000] mt-0.5 flex-shrink-0" />
                        <span>Learning progress and completion data to personalize your experience</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#E60000] mt-0.5 flex-shrink-0" />
                        <span>Tool usage patterns to suggest productivity improvements</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#E60000] mt-0.5 flex-shrink-0" />
                        <span>Collaboration patterns to identify helpful connections</span>
                    </li>
                </ul>
            </div>

            {/* Safe Mode */}
            <div className="bg-white rounded-xl border border-[#E0E0E0] p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h4 className="font-medium text-black flex items-center gap-2">
                            {privacySettings.safeMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            Safe Mode
                        </h4>
                        <p className="text-sm text-[#616161] mt-1">
                            When enabled, your learning activity and performance signals are hidden from your manager's view.
                        </p>
                    </div>
                    <button
                        onClick={() => setPrivacySettings(prev => ({ ...prev, safeMode: !prev.safeMode }))}
                        className={`
                            relative w-12 h-6 rounded-full transition-all
                            ${privacySettings.safeMode ? 'bg-[#E60000]' : 'bg-[#BDBDBD]'}
                        `}
                    >
                        <span className={`
                            absolute top-1 w-4 h-4 rounded-full bg-white transition-all
                            ${privacySettings.safeMode ? 'left-7' : 'left-1'}
                        `} />
                    </button>
                </div>
            </div>

            {/* Learning Visibility */}
            <div className="bg-white rounded-xl border border-[#E0E0E0] p-6">
                <h4 className="font-medium text-black mb-4">Learning Activity Visibility</h4>
                <div className="flex gap-2">
                    {(['VISIBLE', 'TEAM_ONLY', 'PRIVATE'] as const).map((option) => (
                        <button
                            key={option}
                            onClick={() => setPrivacySettings(prev => ({ ...prev, learningVisibility: option }))}
                            className={`
                                flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all
                                ${privacySettings.learningVisibility === option
                                    ? 'bg-[#E60000] text-white'
                                    : 'bg-[#F5F5F5] text-[#616161] hover:bg-[#E0E0E0] border border-[#E0E0E0]'}
                            `}
                        >
                            {option === 'VISIBLE' && '🌐 Public'}
                            {option === 'TEAM_ONLY' && '👥 Team Only'}
                            {option === 'PRIVATE' && '🔒 Private'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Acknowledge */}
            {!privacySettings.dataRetentionAcknowledged && (
                <button
                    onClick={() => setPrivacySettings(prev => ({
                        ...prev,
                        dataRetentionAcknowledged: true,
                        lastUpdated: new Date().toISOString()
                    }))}
                    className="w-full py-3 bg-[#E60000] hover:bg-[#CC0000] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                    <Check className="w-5 h-5" />
                    I understand and accept these privacy settings
                </button>
            )}

            {privacySettings.dataRetentionAcknowledged && (
                <div className="p-4 bg-[#E8F5E9] border border-[#4CAF50]/30 rounded-xl text-center">
                    <Check className="w-8 h-8 text-[#4CAF50] mx-auto mb-2" />
                    <p className="text-[#4CAF50] font-medium">Privacy settings configured</p>
                </div>
            )}
        </div>
    );

    return (
        <div className="p-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <p className="text-[#E60000] text-sm font-bold uppercase tracking-wider mb-2">
                    Day 1 of 5
                </p>
                <h1 className="text-3xl font-bold text-black mb-2">
                    Life & Work Setup
                </h1>
                <p className="text-[#616161]">
                    Everything you need to function comfortably starting tomorrow.
                </p>
            </div>

            {/* Progress Overview */}
            <div className="bg-white backdrop-blur-md rounded-2xl border border-[#E0E0E0] p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-black">Today's Progress</h2>
                    <span className="text-sm text-[#616161]">
                        {completedModulesCount}/{DAY1_MODULES.length} modules complete
                    </span>
                </div>
                <div className="h-2 bg-[#E0E0E0] rounded-full overflow-hidden mb-6">
                    <div
                        className="h-full bg-gradient-to-r from-[#E60000] to-[#FF1A1A] transition-all duration-500"
                        style={{ width: `${(completedModulesCount / DAY1_MODULES.length) * 100}%` }}
                    />
                </div>

                {/* Module Quick Nav */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                    {DAY1_MODULES.map((module) => {
                        const progress = moduleProgress[module.id];
                        const isActive = activeModule === module.id;

                        return (
                            <button
                                key={module.id}
                                onClick={() => setActiveModule(module.id)}
                                className={`
                                    p-3 rounded-xl text-center transition-all
                                    ${isActive ? 'bg-red-50 border-2 border-[#E60000]' : 'bg-[#F5F5F5] border border-[#E0E0E0] hover:border-[#BDBDBD]'}
                                `}
                            >
                                <div className={`
                                    w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center text-lg
                                    ${progress.complete ? 'bg-[#E8F5E9]' : 'bg-[#E0E0E0]'}
                                `}>
                                    {progress.complete ? (
                                        <Check className="w-4 h-4 text-[#4CAF50]" />
                                    ) : (
                                        <span>{module.icon}</span>
                                    )}
                                </div>
                                <p className="text-xs text-[#424242] font-medium truncate">{module.title}</p>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Active Module Content */}
            <div className="bg-white backdrop-blur-md rounded-2xl border border-[#E0E0E0] p-6 mb-8">
                {renderModuleContent()}
            </div>

            {/* Complete Day Button */}
            <button
                onClick={onComplete}
                disabled={!allModulesComplete}
                className={`
                    w-full py-4 font-semibold rounded-xl transition-all flex items-center justify-center gap-2
                    ${allModulesComplete
                        ? 'bg-[#E60000] hover:bg-[#CC0000] text-white'
                        : 'bg-[#E0E0E0] text-[#9E9E9E] cursor-not-allowed'}
                `}
            >
                {allModulesComplete ? (
                    <>
                        Complete Day 1 — Proceed to Company Culture
                        <ChevronRight className="w-5 h-5" />
                    </>
                ) : (
                    <>Complete all modules to continue ({completedModulesCount}/{DAY1_MODULES.length})</>
                )}
            </button>
        </div>
    );
};

export default Day1LifeWorkSetup;
