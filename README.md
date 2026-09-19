# Selfview 📚✨

Selfview is a comprehensive, production-ready student life-management and productivity platform designed to keep your academic records, daily habits, assignments, study sessions, goals, personal tracking, and memories organized in one secure place.

## Features

- **Daily Records & Journal**: Log your daily mood, sleep, water intake, screen time, and reflections.
- **Academic Management**: Track subjects, syllabus progress, study sessions, and timetables.
- **Attendance Tracker**: Calculate attendance percentages in real-time with an interactive projection calculator.
- **Assignments & Exams**: Monitor pending/completed assignments and upcoming exam countdowns.
- **Goals & Habits**: Stay consistent with streak counters, completion percentages, and milestone tracking.
- **Personal Wellness & Expenses**: Log daily expenses, exercise, water, and sleep.
- **Memories & Vault**: Capture photo memories, documents, certificates, and voice notes.
- **Analytics & Insights**: Comprehensive overview dashboards with custom date ranges and report exports (JSON, CSV, PDF).
- **DayVault AI Assistant**: AI-powered student assistant utilizing isolated analytics and records.
- **Notifications & Settings**: Granular notification preferences, cloud backups, and data privacy controls.

## Tech Stack

- **Frontend**: React 18+, TypeScript, Vite, Tailwind CSS, Lucide React icons, Recharts.
- **State & Storage**: Local & Cloud-ready architecture with strict user data isolation by `userId`.

## Installation & Running Locally

1. Clone the repository or open in your workspace.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## Environment Variables

Copy `.env.example` to `.env` and configure required keys (e.g. Gemini API key for server-side AI features).

## License

MIT License
