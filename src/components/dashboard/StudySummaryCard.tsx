import React from 'react';
import { DailyRecordPlaceholder } from '../../types';
import { BookOpen, Play, CheckCircle } from 'lucide-react';

interface StudySummaryCardProps {
  record: DailyRecordPlaceholder;
  onStartStudy: () => void;
}

export const StudySummaryCard: React.FC<StudySummaryCardProps> = ({ record, onStartStudy }) => {
  const goal = record.studyGoalHours || 4;
  const current = record.studyHours || 0;
  const progress = Math.min(100, Math.round((current / goal) * 100));

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic Study Tracker</span>
          </div>
          <h3 className="text-xl font-extrabold tracking-tight">Study Today</h3>
        </div>
        <div className="text-right">
          <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {current}h 00m
          </span>
          <p className="text-[11px] text-slate-400">/ {goal}h daily goal</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
          <span>Goal Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-2">
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Subjects</span>
          <span className="font-extrabold text-base">3</span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Sessions</span>
          <span className="font-extrabold text-base">2</span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Topics</span>
          <span className="font-extrabold text-base">5</span>
        </div>
      </div>

      <button
        onClick={onStartStudy}
        className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition"
      >
        <Play className="w-4 h-4 fill-current" />
        <span>Start Study Session</span>
      </button>
    </div>
  );
};
