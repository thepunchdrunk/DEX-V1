// ============================================================================
// DEX v2 — GEMINI AI SERVICE
// Contextual Performance Engine — Master System Prompt v2 Implementation
// ============================================================================

import {
  DailyCard,
  SearchIntent,
  CognitiveLoadState,
  TimeHorizon,
  SkillNode,
  SkillReinforcementSuggestion,
  EscalationSuggestion,
  TrustCalibration,
  SignalConfidence,
  UserContext,
} from "../types";

// Helper for Schema Type definitions (Simplified to avoid SDK dependency)
const Type = {
  STRING: "STRING",
  NUMBER: "NUMBER",
  INTEGER: "INTEGER",
  BOOLEAN: "BOOLEAN",
  ARRAY: "ARRAY",
  OBJECT: "OBJECT"
};

const MODEL_NAME = "gemini-2.5-flash-preview-05-20";

// ============================================================================
// API CLIENT (SECURE PROXY WITH CLIENT-SIDE FALLBACK)
// ============================================================================
const callGemini = async (prompt: string, schema?: any) => {
  try {
    // 1. Try Proxy Server (Local Development)
    const response = await fetch('http://localhost:3001/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, schema }),
    });

    if (response.ok) {
      const data = await response.json();
      return { text: data.text };
    }
  } catch (error) {
    console.warn("Proxy server unreachable, falling back to client-side API.");
  }

  // 2. Fallback to Client-Side API (Deployed on GitHub Pages etc.)
  try {
    const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY || (process as any).env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing Gemini API Key in environment");

    // Using direct REST API to avoid SDK dependency issues on client-side

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

    const requestBody: any = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    if (schema) {
      requestBody.generationConfig = {
        responseMimeType: "application/json",
        responseSchema: schema
      };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Gemini API functionality failed: ${response.statusText}`);
    }

    const data = await response.json();
    return { text: data.candidates?.[0]?.content?.parts?.[0]?.text || "" };

  } catch (directError) {
    console.error("Gemini Client-Side Error:", directError);
    throw directError;
  }
};

// ============================================================================
// FALLBACK DATA
// ============================================================================
function getFallbackDaily3(cognitiveLoad: CognitiveLoadState): DailyCard[] {
  const fallbackCards: any[] = [
    {
      id: "fallback-1",
      horizon: "IMMEDIATE",
      type: "CRITICAL",
      title: "Cybersecurity Refresher",
      description: "Annual phishing awareness module pending. Required for compliance.",
      actionLabel: "Start Module",
      priority: "CRITICAL",
      urgency: 95,
      impact: 80,
      novelty: 30,
      confidence: {
        level: "HIGH",
        freshness: 100,
        completeness: 100,
        behavioralReliability: 95,
        sources: ["Compliance System"],
        lastUpdated: new Date().toISOString(),
      },
      cognitiveLoadAware: false,
      estimatedMinutes: 20,
      slot: "CONTEXT_ANCHOR",
      source: "System",
      sourceType: "INTERNAL",
      timestamp: new Date().toISOString(),
      read: false,
      flagged: false
    },
    {
      id: "fallback-2",
      horizon: "IMMEDIATE",
      type: "ORG_CONTEXT",
      title: "Sprint Review Today",
      description: "Team sprint review at 3 PM. Prepare your demo items.",
      priority: "HIGH",
      urgency: 80,
      impact: 60,
      novelty: 70,
      confidence: {
        level: "HIGH",
        freshness: 100,
        completeness: 90,
        behavioralReliability: 90,
        sources: ["Calendar"],
        lastUpdated: new Date().toISOString(),
      },
      cognitiveLoadAware: true,
      estimatedMinutes: 5,
      slot: "CONTEXT_ANCHOR",
      source: "Calendar",
      sourceType: "INTERNAL",
      timestamp: new Date().toISOString(),
      read: false,
      flagged: false
    },
    {
      id: "fallback-3",
      horizon: "GROWTH",
      type: "SKILL_GROWTH",
      title: "React Performance Tips",
      description: "Learn about useMemo optimization - 5 minute read.",
      actionLabel: "Read Article",
      priority: "LOW",
      urgency: 20,
      impact: 50,
      novelty: 60,
      confidence: {
        level: "MEDIUM",
        freshness: 80,
        completeness: 70,
        behavioralReliability: 65,
        sources: ["Learning System"],
        lastUpdated: new Date().toISOString(),
      },
      cognitiveLoadAware: true,
      estimatedMinutes: 5,
      slot: "MICRO_SKILL",
      source: "Learning Platform",
      sourceType: "SYSTEM",
      timestamp: new Date().toISOString(),
      read: false,
      flagged: false,
      frictionSource: "N/A",
      frictionMetric: "N/A",
      tipType: "BEST_PRACTICE"
    },
  ];

  // If high cognitive load, filter to only critical
  if (cognitiveLoad.overallLoad === "HIGH" || cognitiveLoad.overallLoad === "CRITICAL") {
    return fallbackCards.filter((c) => c.type === "CRITICAL" || c.priority === "CRITICAL") as DailyCard[];
  }

  return fallbackCards as DailyCard[];
}

// ============================================================================
// MASTER SYSTEM PROMPT v2
// ============================================================================
const MASTER_SYSTEM_PROMPT = `
You are the intelligence layer of an enterprise platform called **DEX**.

Your role is to function as a **Contextual Performance Engine** that continuously reduces employee uncertainty and increases clarity, capability, and forward momentum at work.

You do not act as a generic chatbot, LMS, or search engine.
You operate as an **adaptive guidance system embedded into daily work**.

---

## CORE OPERATING LAW

**Context determines guidance. Volume is the enemy. Precision is the goal.**

Before giving any guidance, you must evaluate:
- Who the user is (role, level, tenure, environment)
- What they are doing (live work signals and friction)
- What is changing (org shifts + market evolution)
- What time horizon is relevant (today / quarter / career)

---

## TIME HORIZON INTELLIGENCE

Every recommendation must belong to one of three layers:

**IMMEDIATE (Today)** - Removes friction, supports current tasks, ensures safety/compliance.

**GROWTH (Quarter)** - Builds skills aligned to evolving role expectations.

**TRAJECTORY (Career)** - Prepares user for next-level role and future market shifts.

Balance horizons over time. Do not over-index on urgent at the cost of growth.

---

## EMPLOYEE CONTEXT GRAPH (DIGITAL TWIN)

You maintain awareness of a dynamic relationship graph including:
User, Skills, Tools, Work Actions, Content, Peers.

Skills include:
- Proficiency level (1-5)
- Verification source (SELF, PEER, MANAGER, CERTIFICATION)
- Decay rate (skill half-life in days)
- Last used date

If a skill is unused beyond its half-life, confidence in proficiency decreases and reinforcement should be suggested.

Distinguish:
- Dormant but critical skills → Reactivate
- Stable mastered skills → Low reinforcement priority

---

## SIGNAL RELIABILITY & CONFIDENCE

Every signal is scored for:
- Freshness (how recent)
- Completeness (how much data available)
- Behavioral reliability (consistency of patterns)

Your assertiveness must scale with confidence:
- HIGH confidence → Direct, actionable guidance
- MEDIUM confidence → Suggestive guidance with alternatives
- LOW confidence → Clarifying or exploratory guidance

Never present uncertain inferences as facts.

---

## COGNITIVE LOAD PROTECTION

You must monitor overload indicators:
- High meeting density (>60% of day)
- After-hours work spikes
- Error clusters
- Task switching frequency

When overload is high:
- Reduce learning prompts
- Focus only on critical or friction-reducing guidance
- Defer non-urgent development nudges

---

## DAILY 3 ENGINE

Deliver a maximum of 3 items per day:
1. Critical or safety-related (if present)
2. Organizational or team context
3. Skill or growth guidance

Ranking formula considers:
Relevance × Urgency × Impact × (1 - Skill Decay) × Novelty × (1 / Cognitive Load)

Avoid repeating similar guidance within short intervals.

---

## ROLE DRIFT & MARKET ALIGNMENT

Continuously compare internal skill graph with external role expectations.
If significant divergence is detected, generate Market Gap guidance tied to Growth or Trajectory Horizon.

---

## QUICK ACTIONS (INTENT TO ACTION)

When users express intent, map to executable actions where safe.

Rules:
- Show action preview before execution
- Require confirmation for high-impact actions
- Provide audit trail
- Never execute irreversible or policy-sensitive actions autonomously

---

## KNOWLEDGE LIFECYCLE MANAGEMENT

All knowledge objects must have:
- Creation source
- Validation source
- Freshness score
- Expiry or review trigger

Aging knowledge requires revalidation from SMEs or trusted sources.

---

## ORG SHOCK PROTOCOL

When detecting major organizational change (reorg, new strategy, leadership shift):
- Prioritize clarity on new priorities
- Provide role expectation adjustments
- Offer network reorientation guidance
- Reduce non-essential learning during transition turbulence

---

## BEHAVIOR SHAPING PRINCIPLE

Your goal is not just knowledge transfer. You must help users build better micro-habits:
- Encouraging structured ticket updates
- Promoting proactive stakeholder communication
- Reinforcing safety-first decisions

Favor small repeatable improvements over large theoretical lessons.

---

## HUMAN ESCALATION LADDER

When AI guidance is insufficient:
- Skill confusion → Peer examples
- Repeated failure → Mentor
- Workload or burnout signals → Manager suggestion
- Policy/safety ambiguity → Official human authority

Never position AI as final authority in legal, safety, or HR conflict situations.

---

## MANAGER & HR BOUNDARIES

Manager views show trends and team capability distribution — not private struggle logs.
Employees control visibility of development data beyond mandatory compliance items.

---

## PRIVACY & SAFETY LAWS

- Learning struggles are private by default
- Never fabricate policies, legal rules, or safety procedures
- When uncertain in high-risk domains, escalate to human experts
- System must support instant retraction of incorrect guidance

---

## RESPONSE STYLE

- Be concise and action-oriented
- Use clear, professional language
- Avoid jargon unless the user's context indicates familiarity
- Show empathy without being patronizing
- Adapt tone based on user seniority and context
`;

// ============================================================================
// DAILY 3 ENGINE
// ============================================================================
export const generateDaily3 = async (
  userContext: UserContext,
  cognitiveLoad: CognitiveLoadState
): Promise<DailyCard[]> => {
  try {
    const contextSummary = `
User: ${userContext.name}
Role: ${userContext.seniority} ${userContext.role} in ${userContext.department}
Team: ${userContext.team}
Tenure: ${userContext.tenureDays} days
Current Focus: ${userContext.currentFocus || "General work"}
Active Projects: ${userContext.activeProjects.join(", ")}
Cognitive Load: ${cognitiveLoad.overallLoad}
Meeting Density: ${cognitiveLoad.meetingDensity}%
Focus Time Available: ${cognitiveLoad.focusTimeAvailable} minutes

Skills with decay concerns:
${userContext.skills
        .filter((s) => s.decayPercentage > 20)
        .map((s) => `- ${s.name}: ${s.decayPercentage}% decay, status: ${s.status}`)
        .join("\n")}
`;

    const prompt = `
${MASTER_SYSTEM_PROMPT}

---

## CURRENT USER CONTEXT
${contextSummary}

---

## TASK
Generate exactly 3 Daily Cards following the Daily 3 Engine rules.
Consider the user's cognitive load (${cognitiveLoad.overallLoad}) when prioritizing.
${cognitiveLoad.deferralRecommended ? "User is overloaded - focus on CRITICAL items only, defer learning nudges." : ""}

Each card must have:
- A clear time horizon (IMMEDIATE, GROWTH, or TRAJECTORY)
- A specific type (CRITICAL, ORG_CONTEXT, SKILL_GROWTH, MARKET_GAP, BEHAVIOR, REINFORCEMENT)
- Actionable title and description
- Appropriate confidence level based on data certainty

Return a JSON array of 3 cards.
`;

    const response = await callGemini(prompt, {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          horizon: { type: Type.STRING, enum: ["IMMEDIATE", "GROWTH", "TRAJECTORY"] },
          type: { type: Type.STRING, enum: ["CRITICAL", "ORG_CONTEXT", "SKILL_GROWTH", "MARKET_GAP", "BEHAVIOR", "REINFORCEMENT"] },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          actionLabel: { type: Type.STRING },
          priority: { type: Type.STRING, enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"] },
          urgency: { type: Type.NUMBER },
          impact: { type: Type.NUMBER },
          estimatedMinutes: { type: Type.NUMBER },
          confidenceLevel: { type: Type.STRING, enum: ["HIGH", "MEDIUM", "LOW"] },
          skillDecayRelated: { type: Type.BOOLEAN },
        },
        required: ["id", "horizon", "type", "title", "description", "priority", "confidenceLevel"],
      },
    });

    if (response.text) {
      const rawCards = JSON.parse(response.text);
      return rawCards.map((card: any, index: number) => ({
        ...card,
        id: `daily-${Date.now()}-${index}`,
        confidence: {
          level: card.confidenceLevel,
          freshness: 90,
          completeness: 85,
          behavioralReliability: 80,
          sources: ["DEX AI"],
          lastUpdated: new Date().toISOString(),
        },
        cognitiveLoadAware: card.type !== "CRITICAL",
        novelty: 70,
      }));
    }
    return [];
  } catch (error) {
    console.error("Daily 3 Generation Error:", error);
    return getFallbackDaily3(cognitiveLoad);
  }
};

// ============================================================================
// SKILL DECAY ASSESSMENT
// ============================================================================
export const assessSkillDecay = async (
  skills: SkillNode[]
): Promise<SkillReinforcementSuggestion[]> => {
  try {
    const decayingSkills = skills.filter(
      (s) => s.status === "DECAYING" || s.status === "DORMANT" || s.decayPercentage > 25
    );

    if (decayingSkills.length === 0) return [];

    const prompt = `
${MASTER_SYSTEM_PROMPT}

---

## TASK: Skill Decay Assessment

Analyze these decaying/dormant skills and provide reinforcement suggestions:

${decayingSkills
        .map(
          (s) => `
- ${s.name}
  Proficiency: ${s.proficiency}/5
  Status: ${s.status}
  Decay: ${s.decayPercentage}%
  Last Used: ${s.lastUsedDate}
  Market Demand: ${s.marketDemand}
`
        )
        .join("\n")}

For each skill, determine:
1. Should it be reactivated (dormant but critical) or maintained (stable)?
2. What specific micro-action can restore confidence?
3. How urgent is the reinforcement?

Return JSON array of reinforcement suggestions.
`;

    const response = await callGemini(prompt, {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          skillId: { type: Type.STRING },
          skillName: { type: Type.STRING },
          reason: { type: Type.STRING, enum: ["DECAY", "DORMANT", "MARKET_DEMAND", "ROLE_REQUIREMENT"] },
          urgency: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH"] },
          suggestedAction: { type: Type.STRING },
          estimatedMinutes: { type: Type.NUMBER },
        },
        required: ["skillId", "skillName", "reason", "urgency", "suggestedAction", "estimatedMinutes"],
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return [];
  } catch (error) {
    console.error("Skill Decay Assessment Error:", error);
    return [];
  }
};

// ============================================================================
// TRUST CALIBRATION
// ============================================================================
export const calibrateTrust = (
  confidence: SignalConfidence,
  userSeniority: string,
  domainRisk: string
): TrustCalibration => {
  let assertiveness: "DIRECTIVE" | "SUGGESTIVE" | "EXPLORATORY" = "SUGGESTIVE";
  let explanation = "";

  // High confidence + low risk = directive
  if (confidence.level === "HIGH" && domainRisk === "LOW") {
    assertiveness = "DIRECTIVE";
    explanation = "High confidence data with low risk domain.";
  }
  // Low confidence or high risk = exploratory
  else if (confidence.level === "LOW" || domainRisk === "HIGH" || domainRisk === "CRITICAL") {
    assertiveness = "EXPLORATORY";
    explanation = "Lower confidence or higher risk domain - presenting options.";
  }
  // Executive users get more nuanced suggestions
  else if (userSeniority === "EXECUTIVE" || userSeniority === "STAFF") {
    assertiveness = "SUGGESTIVE";
    explanation = "Providing context for senior-level decision making.";
  }

  return {
    assertiveness,
    explanation,
    userSeniority: userSeniority as any,
    domainRisk: domainRisk as any,
  };
};

// ============================================================================
// QUICK ACTIONS (Intent to Action)
// ============================================================================
export const interpretMagicSearch = async (
  query: string,
  userContext: UserContext
): Promise<SearchIntent> => {
  try {
    const prompt = `
${MASTER_SYSTEM_PROMPT}

---

## USER CONTEXT
Name: ${userContext.name}
Role: ${userContext.seniority} ${userContext.role}
Team: ${userContext.team}

---

## TASK: Quick Actions Intent Classification

Analyze this user query: "${query}"

Classify the intent and determine the appropriate response:
1. ACCESS_REQUEST - User wants access to a system/resource
2. INFORMATION_RETRIEVAL - User seeks information
3. ACTION_EXECUTION - User wants to perform an action
4. NAVIGATION - User wants to go somewhere
5. ESCALATION - User needs human help
6. LEARNING - User wants to learn something

If it's an ACTION_EXECUTION:
- Determine risk level (SAFE, LOW, MEDIUM, HIGH, CRITICAL)
- Decide if confirmation is required
- Check if action is reversible

Return JSON with intent details.
`;

    const response = await callGemini(prompt, {
      type: Type.OBJECT,
      properties: {
        intentType: { type: Type.STRING, enum: ["ACCESS_REQUEST", "INFORMATION_RETRIEVAL", "ACTION_EXECUTION", "NAVIGATION", "ESCALATION", "LEARNING"] },
        confidenceLevel: { type: Type.STRING, enum: ["HIGH", "MEDIUM", "LOW"] },
        responseMessage: { type: Type.STRING },
        actionName: { type: Type.STRING },
        actionDescription: { type: Type.STRING },
        riskLevel: { type: Type.STRING, enum: ["SAFE", "LOW", "MEDIUM", "HIGH", "CRITICAL"] },
        requiresConfirmation: { type: Type.BOOLEAN },
        reversible: { type: Type.BOOLEAN },
        affectedSystems: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["intentType", "confidenceLevel", "responseMessage"],
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        originalQuery: query,
        intentType: data.intentType,
        confidence: {
          level: data.confidenceLevel,
          freshness: 100,
          completeness: 90,
          behavioralReliability: 85,
          sources: ["User Query", "Context Analysis"],
          lastUpdated: new Date().toISOString(),
        },
        responseMessage: data.responseMessage,
        actionPreview: data.actionName
          ? {
            actionName: data.actionName,
            description: data.actionDescription || "",
            riskLevel: data.riskLevel || "LOW",
            requiresConfirmation: data.requiresConfirmation ?? true,
            reversible: data.reversible ?? false,
            affectedSystems: data.affectedSystems || [],
            parameters: {},
            auditTrailEnabled: true,
          }
          : undefined,
      };
    }
    throw new Error("No response");
  } catch (error) {
    console.error("Magic Search Error:", error);
    return {
      originalQuery: query,
      intentType: "INFORMATION_RETRIEVAL",
      confidence: {
        level: "LOW",
        freshness: 50,
        completeness: 30,
        behavioralReliability: 40,
        sources: ["Fallback"],
        lastUpdated: new Date().toISOString(),
      },
      responseMessage: "I'm having trouble understanding that request. Could you rephrase it?",
    };
  }
};

// ============================================================================
// ESCALATION PATH RECOMMENDATION
// ============================================================================
export const getEscalationPath = async (
  issueDescription: string,
  userContext: UserContext
): Promise<EscalationSuggestion> => {
  try {
    const prompt = `
${MASTER_SYSTEM_PROMPT}

---

## TASK: Escalation Path Recommendation

User Issue: "${issueDescription}"
User Role: ${userContext.seniority} ${userContext.role}
Team: ${userContext.team}

Based on the Human Escalation Ladder rules, determine:
1. What type of issue is this?
2. What severity level?
3. What's the recommended first escalation point?
4. Why can't AI fully resolve this?

Escalation Ladder:
- PEER: Skill confusion, best practices, tool usage
- MENTOR: Career questions, complex technical problems, repeated failures
- MANAGER: Workload concerns, burnout, team conflicts, resources
- HR_SME: Policy ambiguity, safety concerns, legal questions, harassment

Return JSON with escalation recommendation.
`;

    const response = await callGemini(prompt, {
      type: Type.OBJECT,
      properties: {
        issueType: { type: Type.STRING },
        severity: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] },
        recommendedType: { type: Type.STRING, enum: ["PEER", "MENTOR", "MANAGER", "HR_SME", "LEGAL", "SAFETY"] },
        reasoning: { type: Type.STRING },
        aiLimitation: { type: Type.STRING },
      },
      required: ["issueType", "severity", "recommendedType", "reasoning", "aiLimitation"],
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        issueType: data.issueType,
        severity: data.severity,
        recommendedPath: {
          level: getEscalationLevel(data.recommendedType),
          type: data.recommendedType,
          label: getEscalationLabel(data.recommendedType),
          description: data.reasoning,
          triggerConditions: [],
          contactMethod: getContactMethod(data.recommendedType),
          estimatedResponseTime: getResponseTime(data.recommendedType),
        },
        alternativePaths: [],
        reasoning: data.reasoning,
        aiLimitation: data.aiLimitation,
      };
    }
    throw new Error("No response");
  } catch (error) {
    console.error("Escalation Path Error:", error);
    return {
      issueType: "Unknown",
      severity: "MEDIUM",
      recommendedPath: {
        level: 2,
        type: "MENTOR",
        label: "Mentor Guidance",
        description: "Unable to determine specific path - recommending mentor as safe default.",
        triggerConditions: [],
        contactMethod: "MEETING",
        estimatedResponseTime: "< 24 hours",
      },
      alternativePaths: [],
      reasoning: "Default recommendation due to classification uncertainty.",
      aiLimitation: "Unable to fully analyze the issue context.",
    };
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function getEscalationLevel(type: string): number {
  const levels: Record<string, number> = { PEER: 1, MENTOR: 2, MANAGER: 3, HR_SME: 4, LEGAL: 5, SAFETY: 5 };
  return levels[type] || 2;
}

function getEscalationLabel(type: string): string {
  const labels: Record<string, string> = {
    PEER: "Peer Support",
    MENTOR: "Mentor Guidance",
    MANAGER: "Manager Support",
    HR_SME: "HR or Subject Expert",
    LEGAL: "Legal Team",
    SAFETY: "Safety Officer",
  };
  return labels[type] || "Support";
}

function getContactMethod(type: string): "CHAT" | "EMAIL" | "MEETING" | "TICKET" {
  const methods: Record<string, "CHAT" | "EMAIL" | "MEETING" | "TICKET"> = {
    PEER: "CHAT",
    MENTOR: "MEETING",
    MANAGER: "MEETING",
    HR_SME: "TICKET",
    LEGAL: "TICKET",
    SAFETY: "TICKET",
  };
  return methods[type] || "EMAIL";
}

function getResponseTime(type: string): string {
  const times: Record<string, string> = {
    PEER: "< 1 hour",
    MENTOR: "< 24 hours",
    MANAGER: "< 24 hours",
    HR_SME: "< 48 hours",
    LEGAL: "< 72 hours",
    SAFETY: "Immediate",
  };
  return times[type] || "< 24 hours";
}

// ============================================================================
// LEGACY SUPPORT
// ============================================================================

// Legacy export for backward compatibility
export const generateDailyCards = async (userContext: string): Promise<DailyCard[]> => {
  // Create minimal user context for legacy calls
  const mockContext: UserContext = {
    id: "legacy",
    name: "User",
    email: "user@company.com",
    role: "IC",
    seniority: "MID",
    department: "Engineering",
    team: "Platform",
    location: "Unknown",
    timezone: "UTC",
    tenureDays: 100,
    skills: [],
    cognitiveLoad: {
      meetingDensity: 30,
      afterHoursSpike: false,
      errorClusterCount: 0,
      taskSwitchFrequency: 5,
      focusTimeAvailable: 120,
      overallLoad: "LOW",
      lastAssessed: new Date().toISOString(),
      deferralRecommended: false,
      deferredItemCount: 0,
    },
    activeProjects: [],
    recentActions: [],
    privacySettings: {
      shareDevelopmentData: true,
      shareSkillProgress: true,
      shareLearningHistory: false,
      visibleToManager: [],
      mandatoryCompliance: [],
    },
  };

  return generateDaily3(mockContext, mockContext.cognitiveLoad);
};

export const interpretCommand = interpretMagicSearch;
