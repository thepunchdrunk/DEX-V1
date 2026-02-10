# DEX: Digital Employee Experience
## Enterprise Context Engine

**DEX** is a "Zero-Search" employee experience platform that proactively delivers context, tools, and insights to employees based on their role, tenure, and daily rhythm.

## Core Pillars

1. **5-Day Onboarding Sprint**: A structured, role-aware journey from Day 1 (Automated Setup) through Day 5 (Graduation), covering IT provisioning, company culture, tools & workflows, network building, and celebration.
2. **Daily Dashboard**: A role-specific dashboard (Manager/Employee) focusing on 3 AI-curated daily priorities via the "Daily 3 Engine."
3. **Manager Hub**: Team Command Center for squad health, resource planning, mentorship, and new-hire tracking.
4. **Quick Actions**: Intent-based navigation (e.g., "I need a sandbox") executed via AI.

## Role-Specific Experiences
- **Employee**: Focus on skill growth, daily focus, insights, and performance analytics.
- **Manager**: Servant-leadership tools for unblocking and enabling the team.

## Privacy & Trust
- Clear boundaries between "Safe Mode" learning and Manager visibility.
- User control over development data sharing.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Run Application**
   ```bash
   npm run dev
   ```

## Tech Stack
- React 19 + Vite 6
- TypeScript 5.8
- Tailwind CSS (CDN) + CSS Custom Properties Design System
- Lucide React (Icons)
- Recharts + D3 (Visualizations)
- Google Gemini AI (Intelligence Layer)
