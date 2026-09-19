import React, { useState, useMemo } from 'react';
import { UserProfile } from '../../types';
import { analyticsService, DateRange } from '../../services/analytics';
import {
  BarChart3,
  TrendingUp,
  Sparkles,
  Award,
  CheckCircle,
  Flame,
  Droplets,
  Moon,
  Activity,
  Smile,
  Target,
  Plus,
  Check,
  X,
  Clock,
  Smartphone,
  Footprints,
  Compass,
  Edit3,
  Calendar,
  Heart,
  Zap,
  Download,
  FileText,
  BookOpen,
  GraduationCap,
  DollarSign,
  PieChart,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface InsightsViewProps {
  profile: UserProfile | null;
}

export const InsightsView: React.FC<InsightsViewProps> = ({ profile }) => {
  const userId = profile?.uid || 'default-user';
  const todayStr = new Date().toISOString().split('T')[0];

  // Date Range State
  const [dateRangeMode, setDateRangeMode] = useState<'today' | '7days' | '30days' | 'semester' | 'custom'>('30days');
  const [customFrom, setCustomFrom] = useState('2026-09-01');
  const [customTo, setCustomTo] = useState(todayStr);

  const activeDateRange: DateRange = useMemo(() => {
    const end = todayStr;
    if (dateRangeMode === 'today') {
      return { startDate: todayStr, endDate: todayStr, label: 'today' };
    }
    if (dateRangeMode === '7days') {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      return { startDate: d.toISOString().split('T')[0], endDate: end, label: '7days' };
    }
    if (dateRangeMode === '30days') {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      return { startDate: d.toISOString().split('T')[0], endDate: end, label: '30days' };
    }
    if (dateRangeMode === 'semester') {
      return { startDate: '2026-08-01', endDate: '2026-12-31', label: 'semester' };
    }
    return { startDate: customFrom, endDate: customTo, label: 'custom' };
  }, [dateRangeMode, customFrom, customTo, todayStr]);

  // Attendance Projection Calculator state
  const [attendNextX, setAttendNextX] = useState(5);
  const [missNextX, setMissNextX] = useState(3);

  // Computed Analytics Data
  const overview = analyticsService.getOverviewStats(userId, activeDateRange);
  const study = analyticsService.getStudyStats(userId, activeDateRange);
  const attendance = analyticsService.getAttendanceStats(userId, activeDateRange);
  const assignments = analyticsService.getAssignmentStats(userId, activeDateRange);
  const exams = analyticsService.getExamStats(userId, activeDateRange);
  const goals = analyticsService.getGoalStats(userId, activeDateRange);
  const habits = analyticsService.getHabitStats(userId, activeDateRange);
  const expenses = analyticsService.getExpenseStats(userId, activeDateRange);
  const recording = analyticsService.getRecordingAnalytics(userId, activeDateRange);
  const personal = analyticsService.getPersonalTrackingStats(userId, activeDateRange);

  // Attendance projection formulas
  const currentPresent = attendance.totalPresent;
  const currentTotal = attendance.totalClasses;
  const projectedAttendPct = currentTotal + attendNextX > 0
    ? +(((currentPresent + attendNextX) / (currentTotal + attendNextX)) * 100).toFixed(1)
    : 0;
  const projectedMissPct = currentTotal + missNextX > 0
    ? +((currentPresent / (currentTotal + missNextX)) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-8 pb-24 md:pb-12 animate-fadeIn max-w-7xl mx-auto">
      {/* Header & Date Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Factual Analytics & Student Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">📊 Your Insights Dashboard</h2>
          <p className="text-sm text-slate-500 mt-0.5">Comprehensive analytics calculated from actual persisted student records.</p>
        </div>

        {/* Date Selector Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
            {(['today', '7days', '30days', 'semester', 'custom'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setDateRangeMode(mode)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition capitalize ${
                  dateRangeMode === mode
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {mode === '7days' ? '7 Days' : mode === '30days' ? '30 Days' : mode}
              </button>
            ))}
          </div>

          <button
            onClick={() => analyticsService.exportReport(userId, activeDateRange, 'json')}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {dateRangeMode === 'custom' && (
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-500">Custom Date Range:</span>
          <div className="flex items-center gap-2 text-xs">
            <span>From:</span>
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="px-3 py-1.5 rounded-xl border bg-slate-50 dark:bg-slate-800 font-semibold"
            />
            <span>To:</span>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="px-3 py-1.5 rounded-xl border bg-slate-50 dark:bg-slate-800 font-semibold"
            />
          </div>
        </div>
      )}

      {/* 2. OVERVIEW */}
      <div className="space-y-4">
        <h3 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <span>📈 Overview</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <span className="text-xs text-slate-400 font-bold block mb-1">Study Time</span>
            <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{overview.studyTimeHours}h</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Total recorded</span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <span className="text-xs text-slate-400 font-bold block mb-1">Classes</span>
            <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{overview.classesCount}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Attended</span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <span className="text-xs text-slate-400 font-bold block mb-1">Attendance</span>
            <span className="text-xl font-extrabold text-emerald-600">{overview.attendancePercentage}%</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Overall rate</span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <span className="text-xs text-slate-400 font-bold block mb-1">Tasks Done</span>
            <span className="text-xl font-extrabold text-violet-600">{overview.tasksCompletedCount}/{overview.tasksTotalCount}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Completed</span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <span className="text-xs text-slate-400 font-bold block mb-1">Goals</span>
            <span className="text-xl font-extrabold text-amber-600">{overview.goalsCompletedCount}/{overview.goalsTotalCount}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Achieved</span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <span className="text-xs text-slate-400 font-bold block mb-1">Habit Rate</span>
            <span className="text-xl font-extrabold text-teal-600">{overview.habitCompletionPct}%</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Completion</span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <span className="text-xs text-slate-400 font-bold block mb-1">Expenses</span>
            <span className="text-xl font-extrabold text-rose-600">₹{overview.totalExpenses.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Total spent</span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <span className="text-xs text-slate-400 font-bold block mb-1">Days Recorded</span>
            <span className="text-xl font-extrabold text-blue-600">{overview.daysRecordedCount}/30</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Activity</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 3. STUDY ANALYTICS */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-extrabold tracking-tight">📚 Study Analytics</h3>
            </div>
            <span className="text-xs font-bold text-slate-400">{study.sessionsCount} sessions recorded</span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border">
              <span className="text-slate-400 block mb-1 font-semibold">Total Study Time</span>
              <strong className="text-base text-indigo-600">{study.totalStudyHours} hours</strong>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border">
              <span className="text-slate-400 block mb-1 font-semibold">Avg Daily Study</span>
              <strong className="text-base text-slate-800 dark:text-slate-100">{study.avgDailyStudy}h / day</strong>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border">
              <span className="text-slate-400 block mb-1 font-semibold">Current Streak</span>
              <strong className="text-base text-amber-500">{study.streak.current} days</strong>
            </div>
          </div>

          {/* Daily breakdown bar chart */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Study Time by Day</h4>
            <div className="space-y-2">
              {study.dailyBreakdown.slice(-7).map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <span className="w-16 text-slate-400 font-semibold">{item.dayOfWeek} ({item.date.slice(5)})</span>
                  <div className="flex-1 h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (item.hours / 6) * 100)}%` }}
                    />
                  </div>
                  <strong className="w-12 text-right">{item.hours}h</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. SUBJECT STUDY DISTRIBUTION */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-extrabold tracking-tight">📖 Subject Study Distribution</h3>
            </div>
            <span className="text-xs font-semibold text-slate-400">Recorded Hours Breakdown</span>
          </div>

          <p className="text-xs text-slate-500">Distribution of recorded study time across enrolled academic subjects.</p>

          <div className="space-y-4 pt-2">
            {Object.entries(study.subjectsMap).map(([subject, hours], idx) => {
              const total = study.totalStudyHours || 1;
              const pct = Math.round(((hours as number) / total) * 100);
              const colors = ['bg-indigo-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500'];
              return (
                <div key={subject} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{subject}</span>
                    <span>{hours}h ({pct}%)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${colors[idx % colors.length]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* 5. STUDY CONSISTENCY */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 space-y-2 mt-4">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <h4 className="font-bold text-xs text-indigo-900 dark:text-indigo-200">🔥 Study Consistency</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Studied on {study.streak.current} of the last 7 days. Longest recorded streak: {study.streak.longest} consecutive days.
            </p>
          </div>
        </div>
      </div>

      {/* 6. ATTENDANCE ANALYTICS & 7. ATTENDANCE PROJECTION */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-extrabold tracking-tight">🏫 Attendance & Projection Analytics</h3>
          </div>
          <span className="text-sm font-extrabold text-emerald-600">Overall: {attendance.overallPercentage}%</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {attendance.courses.map((course) => (
            <div key={course.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{course.code}</span>
                  <h4 className="font-extrabold text-sm">{course.name}</h4>
                </div>
                <span className="text-sm font-extrabold text-emerald-600">{course.percentage}%</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-slate-400 block text-[10px]">Present</span>
                  <strong className="text-emerald-600">{course.present}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Absent</span>
                  <strong className="text-rose-500">{course.absent}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Total</span>
                  <strong>{course.totalClasses}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 7. Attendance Calculator / Projection */}
        <div className="p-6 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-4">
          <h4 className="font-extrabold text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Attendance Projection Calculator</span>
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Current attendance: {attendance.overallPercentage}% ({currentPresent}/{currentTotal} classes). Calculate future scenarios mathematically:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span>If I attend the next</span>
                <input
                  type="number"
                  value={attendNextX}
                  onChange={(e) => setAttendNextX(parseInt(e.target.value) || 0)}
                  className="w-16 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-center font-bold"
                />
                <span>classes:</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">Projected Attendance:</span>
                <strong className="text-base text-emerald-600">{projectedAttendPct}%</strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span>If I miss the next</span>
                <input
                  type="number"
                  value={missNextX}
                  onChange={(e) => setMissNextX(parseInt(e.target.value) || 0)}
                  className="w-16 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-center font-bold"
                />
                <span>classes:</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">Projected Attendance:</span>
                <strong className="text-base text-rose-500">{projectedMissPct}%</strong>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 italic">Note: Projections are mathematical calculations and do not override official university attendance policies.</p>
        </div>
      </div>

      {/* 8. ASSIGNMENTS & 9. EXAMS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-violet-600" />
              <h3 className="text-lg font-extrabold tracking-tight">📝 Assignments Analytics</h3>
            </div>
            <span className="text-xs font-bold text-violet-600">{assignments.completed}/{assignments.total} Completed</span>
          </div>

          <div className="grid grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border text-center">
              <span className="text-slate-400 block text-[10px]">Completed</span>
              <strong className="text-emerald-600 text-sm">{assignments.completed}</strong>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border text-center">
              <span className="text-slate-400 block text-[10px]">Pending</span>
              <strong className="text-amber-500 text-sm">{assignments.pending}</strong>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border text-center">
              <span className="text-slate-400 block text-[10px]">In Progress</span>
              <strong className="text-blue-500 text-sm">{assignments.inProgress}</strong>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border text-center">
              <span className="text-slate-400 block text-[10px]">Overdue</span>
              <strong className="text-rose-500 text-sm">{assignments.overdue}</strong>
            </div>
          </div>

          <div className="space-y-2.5">
            {assignments.assignments.map((item) => (
              <div key={item.id} className="p-3.5 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40 border flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold">{item.title}</h4>
                  <span className="text-[10px] text-slate-400">{item.course} • Due: {item.dueDate}</span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                  item.status === 'completed' || item.status === 'submitted' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-extrabold tracking-tight">📝 Exam & Syllabus Progress</h3>
            </div>
            <span className="text-xs font-bold text-amber-500">{exams.upcomingCount} Upcoming</span>
          </div>

          <div className="space-y-4">
            {exams.exams.map((exam) => (
              <div key={exam.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-sm">{exam.subject}</h4>
                    <span className="text-xs text-slate-400">Exam Date: {exam.examDate}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    exam.status === 'upcoming' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {exam.status}
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span>Syllabus Covered</span>
                    <span>{exam.syllabusPercentage}% ({exam.topicsCompleted}/{exam.topicsTotal} topics)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${exam.syllabusPercentage}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 10. GOALS, 11. HABITS & 12. PERSONAL TRACKING */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-base">🎯 Goals Analytics</h3>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 space-y-2">
            <span className="text-xs text-slate-500 block">Active Goals: <strong>{goals.activeCount}</strong></span>
            <span className="text-xs text-slate-500 block">Completed: <strong>{goals.completedCount}</strong></span>
            <span className="text-xs text-slate-500 block">Average Progress: <strong>{goals.avgProgress}%</strong></span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-base">🔁 Habit Analytics</h3>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-100 space-y-2">
            <span className="text-xs text-slate-500 block">Overall Completion: <strong>{habits.overallCompletion}%</strong></span>
            <span className="text-xs text-slate-500 block">Active Habits: <strong>{habits.habits.length}</strong></span>
            <span className="text-xs text-slate-500 block">Streak Consistency: <strong>High</strong></span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            <h3 className="font-extrabold text-base">🌱 Personal Tracking</h3>
          </div>
          <div className="p-4 rounded-2xl bg-pink-50/50 dark:bg-pink-950/30 border border-pink-100 space-y-2 text-xs">
            <span className="block">Avg Sleep: <strong>{personal.avgSleep}</strong></span>
            <span className="block">Avg Water: <strong>{personal.avgWater}</strong></span>
            <span className="block">Total Steps: <strong>{personal.totalSteps.toLocaleString()}</strong></span>
            <span className="block">Avg Screen Time: <strong>{personal.avgScreenTime}</strong></span>
          </div>
        </div>
      </div>

      {/* 13. MOOD DISTRIBUTION & 14. EXPENSES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <Smile className="w-5 h-5 text-pink-500" />
            <h3 className="text-lg font-extrabold tracking-tight">😊 Mood Distribution</h3>
          </div>
          <p className="text-xs text-slate-500">Distribution of recorded mood entries across the selected date range.</p>

          <div className="space-y-3 pt-2">
            {Object.entries(personal.moodDistribution).map(([mood, count]) => (
              <div key={mood} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border text-xs">
                <span className="capitalize font-bold">{mood}</span>
                <span className="px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-950/60 text-pink-600 font-bold">{count} days</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-rose-600" />
              <h3 className="text-lg font-extrabold tracking-tight">💰 Expense Analytics</h3>
            </div>
            <span className="text-lg font-extrabold text-rose-600">₹{expenses.totalSpending.toLocaleString()}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border">
              <span className="text-slate-400 block mb-1">Average Daily Spending</span>
              <strong className="text-base text-slate-800 dark:text-slate-100">₹{expenses.avgDaily} / day</strong>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border">
              <span className="text-slate-400 block mb-1">Total Records</span>
              <strong className="text-base text-rose-600">{expenses.recordCount} entries</strong>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Spending by Category</h4>
            {Object.entries(expenses.categoryDistribution).map(([cat, amt]) => (
              <div key={cat} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border text-xs">
                <span className="font-semibold">{cat}</span>
                <strong className="text-rose-600">₹{(amt as number).toLocaleString()}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 15. DAILY RECORD CONSISTENCY & 16. PRODUCTIVITY SUMMARY */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-extrabold tracking-tight">📅 Daily Record Consistency & Productivity Summary</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 space-y-2">
            <h4 className="font-bold text-sm text-indigo-900 dark:text-indigo-200">Recording Activity</h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              You recorded <strong>{recording.daysRecorded} Daily Records</strong> during this period. Current recording streak: <strong>{recording.currentStreak} days</strong>.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 space-y-2">
            <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">Task & Goal Velocity</h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Completed <strong>{overview.tasksCompletedCount} tasks</strong> and achieved <strong>{overview.goalsCompletedCount} goals</strong> with consistent daily execution.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 space-y-2">
            <h4 className="font-bold text-sm text-blue-900 dark:text-blue-200">Academic & Study Volume</h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Accumulated <strong>{overview.studyTimeHours} hours</strong> of study across core subjects with <strong>{overview.attendancePercentage}%</strong> class attendance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
