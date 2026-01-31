# DEX: Digital Employee Experience
## Enterprise Context Engine

**DEX** is a "Zero-Search" employee experience platform that proactively delivers context, tools, and insights to employees based on their role, tenure, and daily rhythm.

## Core Pillars
1. **Automated Setup (Day 1)**: Automated provisioning of hardware, identity, and access.
2. **Company Culture**: Interactive scenarios to learn unwritten rules and cultural norms.
3. **Daily Dashboard**: A role-specific dashboard (Manager/Employee) focusing on 3 daily priorities.
4. **Quick Actions**: Intent-based navigation (e.g., "I need a sandbox") executed via AI.

3. **Role-Specific Dashboards**
   - **Employee**: Focus on skill growth, daily focus, and insights.
   - **Manager**: "Team Command Center" for unblocking and enabling the team (Servant Leadership structure).

4. **Privacy & Trust**
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
- React 18 + Vite
- TypeScript
- Tailwind CSS
- Lucide React (Icons)
- Google Gemini AI (Intelligence Layer)
