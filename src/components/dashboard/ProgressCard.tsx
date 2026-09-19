import React from 'react';
import { DailyRecordPlaceholder } from '../../types';
import { Sparkles, CheckCircle2, BookOpen, Smile, Calendar } from 'lucide-react';

interface ProgressCardProps {
  record: DailyRecordPlaceholder;
  totalTasks: number;
  completedTasks: number;
  onOpenAdd: (type: string) => void;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ record, totalTasks, completedTasks, onOpenAdd }) => {
  const studyGoal = record.studyGoalHours || 4;
  const studyProgress = Math.min(100, Math.round((record.studyHours / studyGoal) * 100));
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const attendanceProgress = record.attendancePercentage || 0;
  const moodComplete = record.mood ? 100 : 0;

  const overallProgress = Math.round((studyProgress + taskProgress + attendanceProgress + moodComplete) / 4);
  const hasData = record.studyHours > 0 || completedTasks > 0 || record.attendancePercentage > 0 || Boolean(record.mood);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Daily Progress</span>
          </div>
          <h3 className="text-xl font-extrabold tracking-tight">Today's Progress Overview</h3>
        </div>
        <div className="text-right">
          <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            {overallProgress}%
          </span>
          <p className="text-[11px] text-slate-400 font-medium">Complete</p>
        </div>
      </div>

      {!hasData ? (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            "Start your day by adding your first record."
          </p>
          <button
            onClick={() => onOpenAdd('study')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition"
          >
            Add First Record
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Study Goal Item */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Study Goal ({record.studyHours}h / {studyGoal}h)</span>
              </span>
              <span>{studyProgress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: `${studyProgress}%` }} />
            </div>
          </div>

          {/* Tasks Item */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tasks Completed ({completedTasks}/{totalTasks})</span>
              </span>
              <span>{taskProgress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full transition-all duration-500" style={{ width: `${taskProgress}%` }} />
            </div>
          </div>

          {/* Attendance Item */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-violet-600" />
                <span>Attendance Logged</span>
              </span>
              <span>{attendanceProgress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-violet-600 rounded-full transition-all duration-500" style={{ width: `${attendanceProgress}%` }} />
            </div>
          </div>

          {/* Habits / Mood Item */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="flex items-center gap-2">
                <Smile className="w-3.5 h-3.5 text-pink-600" />
                <span>Mood & Health Status</span>
              </span>
              <span>{moodComplete}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-pink-600 rounded-full transition-all duration-500" style={{ width: `${moodComplete}%` }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
