// ============================================================================
// WORKPLACE HUB — ORIGINAL SPECIFICATION TYPE DEFINITIONS
// "Zero-Search" Intelligent Employee Experience Platform
// ============================================================================

// ----------------------------------------------------------------------------
// APP STATE: Two Distinct Modes
// ----------------------------------------------------------------------------
export type AppState = 'ROLE_SELECTION' | 'ONBOARDING' | 'ROLE_BASED';
export type OnboardingDay = 0 | 1 | 2 | 3 | 4 | 5;

// Theme transitions: Blue (Onboarding) → Gold (Role-Based)
export type AppTheme = 'onboarding' | 'performance';

// ----------------------------------------------------------------------------
// USER PROFILE
// ----------------------------------------------------------------------------
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  jobId: string;
  jobTitle: string;
  department: string;
  location: string;
  startDate: string;
  manager: string;
  avatar?: string;

  // Onboarding Progress
  onboardingDay: OnboardingDay;
  onboardingComplete: boolean;
  dayProgress: Record<OnboardingDay, DayProgress>;

  // Privacy Settings
  safeMode: boolean; // Hide learning activity from manager
  roleCategory?: 'DESK' | 'FRONTLINE' | 'REMOTE' | 'HYBRID';
  role: 'MANAGER' | 'EMPLOYEE';
}

export interface DayProgress {
  day: OnboardingDay;
  completed: boolean;
  completedAt?: string;
  tasks: OnboardingTask[];
}

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  type: 'CHECK' | 'FORM' | 'SCENARIO' | 'CHAT' | 'NETWORK' | 'CELEBRATION';
}

// ----------------------------------------------------------------------------
// DAY 1: AUTOMATED SETUP
// ----------------------------------------------------------------------------
export type SystemCheckStatus = 'PENDING' | 'CHECKING' | 'PASS' | 'FAIL';

export interface GreenLightCheck {
  id: string;
  label: string;
  category: 'HARDWARE' | 'SOFTWARE' | 'FACILITY';
  status: SystemCheckStatus;
  details?: string;
  icon: string;
  roleCategories?: string[];
}

export interface DigitalProfile {
  displayName: string;
  pronouns?: string;
  timezone: string;
  workStyle: 'EARLY_BIRD' | 'NIGHT_OWL' | 'FLEXIBLE';
  communicationPreference: 'SLACK' | 'EMAIL' | 'TEAMS';
  bio?: string;
}

// ----------------------------------------------------------------------------
// DAY 2: COMPANY CULTURE
// ----------------------------------------------------------------------------
export interface MicroScenario {
  id: string;
  title: string;
  description: string;
  choices: ScenarioChoice[];
  culturalDimension: 'SPEED_VS_PERFECTION' | 'HIERARCHY_VS_FLAT' | 'FORMAL_VS_CASUAL';
  roleCategory?: 'DESK' | 'FRONTLINE' | 'REMOTE' | 'HYBRID';
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
}

export interface ScenarioChoice {
  id: string;
  text: string;
  isRecommended: boolean;
  feedback: string;
}

export interface UnwrittenRule {
  id: string;
  question: string;
  answer: string;
  category: 'DRESS_CODE' | 'MEETINGS' | 'COMMUNICATION' | 'WORK_HOURS' | 'SOCIAL' | 'WORK_LIFE' | 'REMOTE'; // Added new categories
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
  keywords?: string[];
}

// ----------------------------------------------------------------------------
// DAY 3: LEARNING FOUNDATIONS (Inferred)
// ----------------------------------------------------------------------------
export interface LearningModule {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  type: 'VIDEO' | 'READING' | 'INTERACTIVE';
  completed: boolean;
}

// ----------------------------------------------------------------------------
// DAY 4: TEAM CONNECTIONS
// ----------------------------------------------------------------------------
export interface CriticalPartner {
  id: string;
  name: string;
  title: string;
  department: string;
  relationshipType: 'MANAGER' | 'PEER' | 'STAKEHOLDER' | 'MENTOR' | 'CROSS_FUNCTIONAL';
  reason: string;
  icebreakerDraft: string;
  platform: 'SLACK' | 'TEAMS' | 'EMAIL' | 'IN_PERSON';
  connected: boolean;
  suggestedTopics?: string[]; // Added to match constants usage
  communicationPreference?: {
    preferredChannel: string;
    bestTimeToReach: string;
  };
  introTemplate?: string;
  introSent?: boolean;
  roleCategories?: string[];
}

// ----------------------------------------------------------------------------
// DAY 5: GRADUATION
// ----------------------------------------------------------------------------
export interface GraduationStats {
  tasksCompleted: number;
  totalTasks: number;
  scenariosPlayed: number;
  connectionsMode: number;
  daysToComplete: number;
}

// ----------------------------------------------------------------------------
// DAILY DASHBOARD: DAILY 3 CARDS
// ----------------------------------------------------------------------------
export type CardSlot = 'CONTEXT_ANCHOR' | 'DOMAIN_EDGE' | 'MICRO_SKILL' | 'SIMULATOR';
export type CardPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface DailyCard {
  id: string;
  slot: CardSlot;
  title: string;
  description: string;
  source: string;
  sourceType: 'INTERNAL' | 'EXTERNAL' | 'SYSTEM';
  timestamp: string;
  priority: CardPriority;
  actionLabel?: string;
  actionUrl?: string;
  read: boolean;
  flagged: boolean;
  flagCount?: number; // For "Incorrect" feedback tracking
  flagReason?: 'INCORRECT' | 'OUTDATED' | 'INAPPROPRIATE';
  explainer?: string; // "Why this appeared" explanation
  isQuarantined?: boolean; // 3+ flags triggers quarantine

  // New fields for Contextual Performance Engine
  horizon?: 'IMMEDIATE' | 'GROWTH' | 'TRAJECTORY';
  type?: string;
  urgency?: number;
  impact?: number;
  novelty?: number;
  estimatedMinutes?: number;
  cognitiveLoadAware?: boolean;
  confidence?: {
    level: 'HIGH' | 'MEDIUM' | 'LOW';
    freshness: number;
    completeness: number;
    behavioralReliability: number;
    sources: string[];
    lastUpdated: string;
  };
  roleCategories?: string[]; // Added for role filtering
}

// Card 1: Key Update (Internal KPIs, Strategic Updates)
export interface ContextAnchorCard extends DailyCard {
  slot: 'CONTEXT_ANCHOR';
  kpiType?: 'DEPARTMENT' | 'PROJECT' | 'COMPANY';
  kpiValue?: string;
  kpiChange?: number; // Percentage change
}

// Card 2: Market Insight (External Market Trends)
export interface DomainEdgeCard extends DailyCard {
  slot: 'DOMAIN_EDGE';
  industry: string;
  relevanceScore: number; // 0-100
  trendType: 'TECHNOLOGY' | 'MARKET' | 'REGULATION' | 'COMPETITOR';
}

// Card 3: Productivity Tip (Behavioral Tips)
export interface MicroSkillCard extends DailyCard {
  slot: 'MICRO_SKILL';
  frictionSource: string; // e.g., "Jira", "Excel"
  frictionMetric: string; // e.g., "2 hours spent"
  tipType: 'SHORTCUT' | 'AUTOMATION' | 'BEST_PRACTICE';
}

// ----------------------------------------------------------------------------
// SIMULATOR (WEDNESDAY REPLACEMENT FOR CARD 3)
// ----------------------------------------------------------------------------
export type SimulatorType = 'SAFETY_HAZARD' | 'FIND_THE_BUG' | 'EMAIL_DOJO';

export interface SimulatorChallenge {
  id: string;
  type: SimulatorType;
  title: string;
  description: string;
  durationMinutes: number; // Usually 3
  content: SafetyHazardContent | FindTheBugContent | EmailDojoContent;
  completed: boolean;
  score?: number;
  completedAt?: string;
}

export interface SafetyHazardContent {
  imageUrl: string; // 360-degree photo
  hazards: { id: string; x: number; y: number; description: string; found: boolean }[];
}

export interface FindTheBugContent {
  language: string;
  code: string;
  bugLine: number;
  bugDescription: string;
  hints: string[];
}

export interface EmailDojoContent {
  originalEmail: string;
  toneIssues: string[];
  suggestedRewrite: string;
  userRewrite?: string;
}

// ----------------------------------------------------------------------------
// SKILL TREE (ORGANIC VISUALIZATION)
// ----------------------------------------------------------------------------
export type SkillMastery = 0 | 1 | 2 | 3; // Seed, Sprout, Growing, Mastered
export type SkillHealth = 'THRIVING' | 'HEALTHY' | 'FADING' | 'DECAYED';

export interface SkillBranch {
  id: string;
  name: string;
  category: 'TECHNICAL' | 'SOFT' | 'DOMAIN' | 'TOOL';
  mastery: SkillMastery;
  health: SkillHealth;
  lastVerified: string;
  daysSinceVerified: number;
  decayThreshold: number; // Days until decay (90 default)
  children: SkillBranch[];
  parentId?: string;
}

export interface SkillTree {
  userId: string;
  rootBranches: SkillBranch[];
  totalSkills: number;
  masteredSkills: number;
  decayedSkills: number;
}

// ----------------------------------------------------------------------------
// ROLE DRIFT DETECTOR
// ----------------------------------------------------------------------------
export interface MarketGapCard {
  id: string;
  skillName: string;
  demandScore: number; // 0-100
  jobPostingsCount: number;
  topCompanies: string[];
  suggestedResources: string[];
  detectedAt: string;
}

// ----------------------------------------------------------------------------
// ADVANCED DASHBOARD FEATURES
// ----------------------------------------------------------------------------

// Weekly Behavioral Rhythm
export type WeekdayContext =
  | 'MONDAY_PLANNING'
  | 'MIDWEEK'
  | 'WEDNESDAY_SIMULATOR'
  | 'FRIDAY_REFLECTION';

// Decision Assist: High-stakes scenario guidance
export interface DecisionScenario {
  id: string;
  type: 'EXEC_PRESENTATION' | 'PERFORMANCE_REVIEW' | 'NEGOTIATION' | 'MAJOR_LAUNCH' | 'CONFLICT_RESOLUTION';
  title: string;
  description: string;
  checklist: DecisionChecklistItem[];
  framingTools: string[];
  preparationPrompts: string[];
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  triggeredBy?: string; // What context triggered this
}

export interface DecisionChecklistItem {
  id: string;
  text: string;
  category: 'PREPARATION' | 'EXECUTION' | 'FOLLOW_UP';
  completed: boolean;
}

// Meeting Intelligence: Pattern analysis
export interface MeetingPattern {
  weeklyMeetingHours: number;
  totalHours: number; // alias for component compatibility
  meetingsCount: number;
  oneOnOneCount: number;
  teamMeetingCount: number;
  backToBackDays: number;
  averageMeetingLength: number;
  averageDuration: number; // alias for component compatibility
  actionOwnershipRate: number; // % of meetings with clear action owners
  alerts: MeetingAlert[];
}

export interface MeetingAlert {
  id: string;
  type: 'OVERLOAD' | 'NO_ACTION_OWNER' | 'IMBALANCE' | 'BACK_TO_BACK';
  message: string;
  metric: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  suggestion: string;
}

// Focus Guard: Context switching detection
export interface FocusMetrics {
  contextSwitchesPerHour: number;
  longestFocusBlock: number; // minutes
  fragmentedDays: number; // days with no 2+ hour focus blocks
  deepWorkPercentage: number;
  alerts: FocusAlert[];
}

export interface FocusAlert {
  id: string;
  type: 'HIGH_SWITCHING' | 'NO_FOCUS_BLOCKS' | 'FRAGMENTED_SCHEDULE';
  message: string;
  suggestion: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

// Career Horizon: Market trend signals (quarterly)
export interface CareerHorizonSignal {
  id: string;
  quarter: string; // e.g., "Q1 2026"
  userSkills: string[];
  marketTrends: MarketTrend[];
  emergingCapabilities: EmergingCapability[];
  roleEvolutionInsights: string[];
}

export interface MarketTrend {
  skillName: string;
  demandChange: number; // percentage change
  direction: 'RISING' | 'STABLE' | 'DECLINING';
  topIndustries: string[];
}

export interface EmergingCapability {
  name: string;
  relevanceToRole: number; // 0-100
  description: string;
  learningResources: string[];
}

// Peer Practice: Anonymized aggregate insights
export interface PeerPracticeInsight {
  id: string;
  category: 'PRODUCTIVITY' | 'COMMUNICATION' | 'COLLABORATION' | 'TOOLING' | 'WELLBEING' | 'LEARNING';
  title: string;
  description: string;
  adoption: number; // % of similar roles using this practice
  adoptionRate: number; // alias for component compatibility
  effectiveness: number; // 0-100 effectiveness score
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  howToAdopt: string;
  implementationSteps?: string[];
  roleCategory: 'DESK' | 'FRONTLINE' | 'REMOTE' | 'HYBRID';
}

// ----------------------------------------------------------------------------
// MANAGER HUB
// ----------------------------------------------------------------------------
export interface TeamMember {
  id: string;
  name: string;
  title: string;
  avatar?: string;
  skillScores: Record<string, number>; // Skill -> 0-100
  burnoutScore: number; // 0-100
  burnoutSignals: BurnoutSignal[];
  safeMode: boolean; // If true, hide from detailed view
}

export interface BurnoutSignal {
  type: 'LATE_NIGHT_LOGIN' | 'ERROR_RATE' | 'OVERTIME' | 'CONTEXT_SWITCHING';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  metric: string;
  detectedAt: string;
}

export interface SkillHeatmapCell {
  skillName: string;
  teamAverage: number;
  distribution: number[]; // Histogram buckets
  trend: 'UP' | 'DOWN' | 'STABLE';
}

// ----------------------------------------------------------------------------
// QUICK ACTIONS
// ----------------------------------------------------------------------------
export interface MagicSearchResult {
  query: string;
  intent: 'PROVISION' | 'NAVIGATE' | 'CREATE' | 'SEARCH' | 'HELP';
  action: MagicAction;
  confidence: number;
}

export interface MagicAction {
  type: 'OPEN_TICKET' | 'NAVIGATE' | 'CREATE_DOCUMENT' | 'SHOW_INFO';
  label: string;
  description: string;
  prefilled?: Record<string, string>; // Pre-filled form values
  url?: string;
  requiresConfirmation: boolean;
}

// ----------------------------------------------------------------------------
// OPERATIONAL RULES
// ----------------------------------------------------------------------------
export interface ContentFlag {
  contentId: string;
  userId: string;
  reason: 'INCORRECT' | 'OUTDATED' | 'INAPPROPRIATE';
  flaggedAt: string;
}

export interface QuarantinedContent {
  contentId: string;
  flagCount: number;
  quarantinedAt: string;
  status: 'REVIEWING' | 'APPROVED' | 'REMOVED';
}

// ----------------------------------------------------------------------------
// PROJECT PRIMER (Webhook Triggered)
// ----------------------------------------------------------------------------
export interface ProjectPrimer {
  projectId: string;
  projectName: string;
  strategySummary: string;
  acronymDictionary: Record<string, string>;
  keyContacts: CriticalPartner[];
  generatedAt: string;
}

// ----------------------------------------------------------------------------
// FRONTLINE KIOSK MODE
// ----------------------------------------------------------------------------
export interface KioskSession {
  badgeId: string;
  userId: string;
  loginTime: string;
  offlineCache: DailyCard[];
  syncPending: boolean;
}

// ============================================================================
// DAY 0: PREBOARDING ORCHESTRATION
// ============================================================================
export type PreboardingItemStatus = 'PENDING' | 'IN_PROGRESS' | 'READY' | 'BLOCKED' | 'ESCALATED';

export interface PreboardingItem {
  id: string;
  category: 'IDENTITY' | 'DEVICE' | 'FACILITY' | 'FINANCE' | 'TEAM';
  label: string;
  description: string;
  status: PreboardingItemStatus;
  responsibleTeam: string;
  blockedSince?: string;
  escalatedTo?: string;
  estimatedCompletion?: string;
  roleCategories?: string[]; // e.g., ['DESK', 'REMOTE', 'FRONTLINE']
  icon: string;
}

export interface Day1ReadinessScore {
  overallScore: number; // 0-100
  criticalItemsReady: number;
  criticalItemsTotal: number;
  blockedItems: PreboardingItem[];
  lastUpdated: string;
}

export interface PreboardingCommunication {
  id: string;
  type: 'WELCOME' | 'LOGISTICS' | 'REMINDER' | 'ESCALATION';
  sentAt: string;
  content: string;
  read: boolean;
}

// ============================================================================
// DAY 1: EXPANDED LIFE & WORK SETUP
// ============================================================================
export type Day1ModuleId =
  | 'GREEN_LIGHT'
  | 'WORK_ESSENTIALS'
  | 'DAILY_LOGISTICS'
  | 'PAYROLL_BENEFITS'
  | 'DIGITAL_READINESS'
  | 'SAFETY_WELLBEING'
  | 'PRIVACY_SETTINGS';

export interface Day1Module {
  id: Day1ModuleId;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  items: Day1ModuleItem[];
}

export interface Day1ModuleItem {
  id: string;
  title: string;
  description: string;
  type: 'CHECK' | 'FORM' | 'DEMO' | 'ACKNOWLEDGE' | 'SETUP';
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  actionLabel?: string;
  actionUrl?: string;
  blockerReason?: string;
}

export interface WorkEssential {
  id: string;
  category: 'LEAVE' | 'EXPENSES' | 'HOLIDAY_CALENDAR';
  title: string;
  description: string;
  interactiveDemo: boolean;
  completed: boolean;
  demoSteps?: string[];
  roleCategories?: string[]; // Added for role filtering
}

export interface DailyLifeLogistic {
  id: string;
  category: 'COMMUTE' | 'PARKING' | 'CANTEEN' | 'FACILITIES' | 'WIFI_PRINTER';
  title: string;
  description: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  actionLabel?: string;
  actionUrl?: string;
}

export interface PayrollBenefitsItem {
  id: string;
  category: 'PAYROLL' | 'INSURANCE' | 'DEPENDENT' | 'CLAIMS' | 'TAX';
  title: string;
  description: string;
  completed: boolean;
  requiresSignature: boolean;
  signedAt?: string;
}

export interface DigitalReadinessItem {
  id: string;
  category: 'SSO' | 'MFA' | 'EMAIL' | 'COLLABORATION' | 'VPN' | 'SECURITY_TRAINING';
  title: string;
  description: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'VERIFIED' | 'FAILED';
  verifiedAt?: string;
  roleCategories?: string[]; // Added for role filtering
}

export interface SafetyWellbeingItem {
  id: string;
  category: 'EMERGENCY' | 'EVACUATION' | 'HEALTH' | 'ACCESSIBILITY';
  title: string;
  description: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
  roleCategories?: string[]; // Added for role filtering
}

export interface PrivacySettings {
  safeMode: boolean;
  learningVisibility: 'VISIBLE' | 'TEAM_ONLY' | 'PRIVATE';
  behaviorTracking: boolean;
  dataRetentionAcknowledged: boolean;
  lastUpdated: string;
}

// ============================================================================
// DAY 2: ENHANCED COMPANY CULTURE
// ============================================================================
export type RoleCategory = 'DESK' | 'FRONTLINE' | 'REMOTE' | 'HYBRID';

export interface RoleBasedScenario extends MicroScenario {
  roleCategory: RoleCategory;
  region?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export interface UnwrittenRuleResponse {
  question: string;
  answer: string;
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNCERTAIN';
  sourceLink?: string;
  sourceName?: string;
  flaggedCount: number;
  isQuarantined: boolean;
}

export interface CommunicationNorm {
  id: string;
  channel: 'CHAT' | 'EMAIL' | 'TICKET' | 'MEETING';
  useCase: string;
  expectedResponseTime: string;
  urgencySignal: string;
  examples: {
    good: string;
    bad: string;
  };
}

export interface MeetingCultureRule {
  id: string;
  type: 'AGENDA' | 'DECISION_RECORDING' | 'PREPARATION' | 'FOLLOWUP' | 'PUNCTUALITY';
  title: string;
  description: string;
  template?: string;
}

export interface DecisionBoundary {
  id: string;
  scope: 'INDEPENDENT' | 'MANAGER_APPROVAL' | 'CROSS_TEAM' | 'EXECUTIVE';
  title: string;
  examples: string[];
  escalationPath?: string;
}

export interface EthicsModule {
  id: string;
  title: string;
  description: string;
  scenarios: EthicsScenario[];
  completed: boolean;
}

export interface EthicsScenario {
  id: string;
  situation: string;
  correctAction: string;
  reportingPath: string;
}

export interface CoffeeChatSuggestion {
  id: string;
  personId: string;
  personName: string;
  personTitle: string;
  reason: string;
  suggestedTopics: string[];
  scheduled: boolean;
  scheduledAt?: string;
  roleCategories?: string[];
}

// ============================================================================
// DAY 3: TOOLS, WORKFLOW & FIRST TASK SIMULATOR
// ============================================================================
export interface WorkTool {
  id: string;
  name: string;
  icon: string;
  category: 'CORE' | 'SUPPORTING' | 'OPTIONAL';
  purpose: string;
  upstreamTools: string[];
  downstreamTools: string[];
  walkthroughCompleted: boolean;
  roleCategories?: string[]; // 'DESK' | 'FRONTLINE' | 'REMOTE' etc.
  quickActions: ToolQuickAction[];
}

export interface ToolQuickAction {
  id: string;
  label: string;
  description: string;
  shortcut?: string;
}

export type SimulatorMode = 'GUIDED' | 'CONFIDENCE';

export interface FirstTaskSimulation {
  id: string;
  roleCategory: string;
  title: string;
  description: string;
  mode: SimulatorMode;
  steps: SimulationStep[];
  artifactType: 'TICKET' | 'DOCUMENT' | 'CODE_PR' | 'LOG_ENTRY' | 'CRM_ENTRY' | 'CRM_RECORD' | 'SAFETY_LOG' | 'APPROVAL';
  artifactId?: string;
  artifactPreview?: string;
  completedAt?: string;
  managerReviewed: boolean;
  managerFeedback?: string;
}

export interface SimulationStep {
  id: string;
  instruction: string;
  hint?: string;
  completed: boolean;
  userInput?: string;
  validationResult?: 'PASS' | 'FAIL' | 'PENDING';
  errorRecoveryGuidance?: string;
}

export interface FirstContribution {
  id: string;
  title: string;
  description: string;
  type: 'STANDUP' | 'DOCUMENT_UPDATE' | 'SHADOW' | 'TASK' | 'CODE_REVIEW';
  status: 'AVAILABLE' | 'IN_PROGRESS' | 'PENDING_CONFIRM' | 'COMPLETED';
  managerConfirmed: boolean;
  confirmedAt?: string;
}

export interface ProductivityTip {
  id: string;
  toolId: string;
  toolName: string;
  title: string;
  description: string;
  category: 'SHORTCUT' | 'AUTOMATION' | 'TEMPLATE' | 'BEST_PRACTICE';
  shortcutKey?: string;
  source: string; // "Shared by senior engineers"
}

export interface PermissionRequest {
  id: string;
  systemName: string;
  accessLevel: string;
  reason: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'DENIED';
  approverId?: string;
  submittedAt?: string;
  resolvedAt?: string;
  expectedTimeline: string;
}

// ============================================================================
// DAY 4: ENHANCED NETWORK & COLLABORATION
// ============================================================================

export interface Critical5Contact {
  id: string;
  name: string;
  title: string;
  relationship: 'MANAGER' | 'MENTOR' | 'PEER' | 'STAKEHOLDER' | 'BUDDY';
  whyTheyMatter: string;
  suggestedTopics: string[];
  communicationPreference: {
    preferredChannel: string;
    bestTimeToReach: string;
    quirks?: string;
  };
  introTemplate: string;
  introSent: boolean;
  introSentAt?: string;
  roleCategories?: string[];
}

export interface StakeholderNode {
  id: string;
  name: string;
  title: string;
  circle: 'INNER' | 'MIDDLE' | 'OUTER';
  interactionType: string;
}

export interface TeamRitual {
  id: string;
  name: string;
  type: 'STANDUP' | 'RETROSPECTIVE' | 'PLANNING' | 'SOCIAL' | 'REVIEW';
  description: string;
  frequency: string;
  duration: string;
  participants: string[];
  newHireExpectations: string;
  acknowledged: boolean;
}

export interface CollaborationNorm {
  id: string;
  category: 'COMMUNICATION' | 'MEETINGS' | 'FEEDBACK' | 'WORK_HOURS' | 'COLLABORATION';
  title: string;
  description: string;
  examples: string[];
}

export interface PeerCohort {
  id: string;
  cohortName: string;
  startDate: string;
  peers: PeerCohortMember[];
  sharedEvents: {
    id: string;
    title: string;
    date: string;
    location: string;
  }[];
}

export interface PeerCohortMember {
  id: string;
  name: string;
  title: string;
  department: string;
  sharedInterests: string[];
  connected: boolean;
  connectedAt?: string;
}

// ============================================================================
// DAY 5: GRADUATION & IDENTITY TRANSITION
// ============================================================================
export interface CompletionStatus {
  day: OnboardingDay;
  dayTitle: string;
  category: string;
  itemsCompleted: number;
  itemsTotal: number;
  incompleteItems: { id: string; title: string; actionUrl?: string }[];
}

export interface ManagerSignoff {
  managerId: string;
  managerName: string;
  signedOff: boolean;
  signedOffAt?: string;
  firstWeekGoals: Goal[];
  firstMonthGoals: Goal[];
  comments?: string;
  welcomeMessage?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  category: 'LEARNING' | 'DELIVERY' | 'RELATIONSHIP' | 'PROCESS';
}

export interface OnboardingFeedback {
  overallSatisfaction: 1 | 2 | 3 | 4 | 5;
  confidenceLevel: 1 | 2 | 3 | 4 | 5;
  dayRatings: Record<OnboardingDay, number>;
  frictionPoints: string[];
  highlights: string[];
  suggestions?: string;
  submittedAt?: string;
  requiresFollowUp: boolean;
}

export interface GraduationBadge {
  id: string;
  name: string;
  description: string;
  earnedAt: string;
  badgeImageUrl: string;
}

export interface GrowthPlan {
  id: string;
  skillFocusAreas: string[];
  suggestedLearning: LearningModule[];
  mentorAssigned?: string;
  nextCheckIn: string;
}

// ============================================================================
// KIOSK & FRONTLINE SUPPORT
// ============================================================================
export type KioskLoginMethod = 'RFID' | 'PIN' | 'QR';

export interface KioskConfig {
  loginMethod: KioskLoginMethod;
  simplifiedUI: boolean;
  offlineCapable: boolean;
  cachedModules: Day1ModuleId[];
  autoLogoutMinutes: number;
}

export interface FrontlineProfile {
  shiftPattern: 'DAY' | 'NIGHT' | 'ROTATING';
  primaryLocation: string;
  supervisorId: string;
  supervisorName: string;
  safetyTrainingRequired: boolean;
  safetyTrainingCompleted: boolean;
  equipmentAssigned: string[];
}

// ============================================================================
// ESCALATION & NOTIFICATION SYSTEM
// ============================================================================
export interface EscalationEvent {
  id: string;
  type: 'PREBOARDING_BLOCKED' | 'SYSTEM_ACCESS_FAILED' | 'FEEDBACK_CRITICAL';
  itemId: string;
  itemDescription: string;
  escalatedTo: string;
  escalatedAt: string;
  resolved: boolean;
  resolvedAt?: string;
  resolution?: string;
}

export interface OnboardingNotification {
  id: string;
  type: 'INFO' | 'ACTION_REQUIRED' | 'CELEBRATION' | 'ESCALATION';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

// ============================================================================
// AI & CONTEXT ENGINE TYPES
// ============================================================================

export type TimeHorizon = 'IMMEDIATE' | 'GROWTH' | 'TRAJECTORY';

export interface UserContext {
  id: string;
  name: string;
  email: string;
  role: string;
  seniority: string;
  department: string;
  team: string;
  location: string;
  timezone: string;
  tenureDays: number;
  skills: SkillNode[];
  cognitiveLoad: CognitiveLoadState;
  activeProjects: string[]; // names or IDs
  recentActions: string[];
  currentFocus?: string;
  privacySettings: {
    shareDevelopmentData: boolean;
    shareSkillProgress: boolean;
    shareLearningHistory: boolean;
    visibleToManager: string[];
    mandatoryCompliance: string[];
  };
}

export interface SkillNode {
  id: string;
  name: string;
  proficiency: number; // 1-5
  status: 'ACTIVE' | 'DECAYING' | 'DORMANT' | 'MASTERED';
  decayPercentage: number;
  lastUsedDate: string;
  marketDemand: 'LOW' | 'MEDIUM' | 'HIGH';
  verificationSource: 'SELF' | 'PEER' | 'MANAGER' | 'CERTIFICATION';
}

export interface CognitiveLoadState {
  meetingDensity: number; // 0-100%
  afterHoursSpike: boolean;
  errorClusterCount: number;
  taskSwitchFrequency: number;
  focusTimeAvailable: number; // minutes
  overallLoad: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  lastAssessed: string;
  deferralRecommended: boolean;
  deferredItemCount: number;
}

export interface SignalConfidence {
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  freshness: number; // 0-100
  completeness: number; // 0-100
  behavioralReliability: number; // 0-100
  sources: string[];
  lastUpdated: string;
}

export interface SearchIntent {
  originalQuery: string;
  intentType: 'ACCESS_REQUEST' | 'INFORMATION_RETRIEVAL' | 'ACTION_EXECUTION' | 'NAVIGATION' | 'ESCALATION' | 'LEARNING';
  confidence: SignalConfidence;
  responseMessage: string;
  actionPreview?: {
    actionName: string;
    description: string;
    riskLevel: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    requiresConfirmation: boolean;
    reversible: boolean;
    affectedSystems: string[];
    parameters: Record<string, any>;
    auditTrailEnabled: boolean;
  };
  actionParams?: Record<string, any>; // Legacy support
}

export interface TrustCalibration {
  assertiveness: 'DIRECTIVE' | 'SUGGESTIVE' | 'EXPLORATORY';
  explanation: string;
  userSeniority: 'JUNIOR' | 'MID' | 'SENIOR' | 'STAFF' | 'EXECUTIVE';
  domainRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface EscalationSuggestion {
  issueType: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendedPath: {
    level: number;
    type: 'PEER' | 'MENTOR' | 'MANAGER' | 'HR_SME' | 'LEGAL' | 'SAFETY';
    label: string;
    description: string;
    triggerConditions: string[];
    contactMethod: 'CHAT' | 'EMAIL' | 'MEETING' | 'TICKET';
    estimatedResponseTime: string;
  };
  alternativePaths: any[];
  reasoning: string;
  aiLimitation: string;
}

export interface SkillReinforcementSuggestion {
  skillId: string;
  skillName: string;
  reason: 'DECAY' | 'DORMANT' | 'MARKET_DEMAND' | 'ROLE_REQUIREMENT';
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  suggestedAction: string;
  estimatedMinutes: number;
}

