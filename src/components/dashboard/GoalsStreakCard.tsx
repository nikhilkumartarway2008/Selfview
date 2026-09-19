import React from 'react';
import { UserGoal } from '../../types';
import { Flame, Target } from 'lucide-react';

interface GoalsStreakCardProps {
  goal: UserGoal;
  streakDays?: number;
}

export const GoalsStreakCard: React.FC<GoalsStreakCardProps> = ({ goal, streakDays = 12 }) => {
  const goalProgress = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* Current Streak */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
          <Flame className="w-7 h-7 fill-current" />
        </div>
        <div>
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Current Streak</span>
          <h3 className="text-2xl font-extrabold tracking-tight mt-0.5">{streakDays} Days</h3>
          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">Keep recording your days!</p>
        </div>
      </div>

      {/* Today's Goal */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Today's Goal</span>
          </div>
          <span className="text-xs font-bold text-violet-600 dark:text-violet-400">{goalProgress}%</span>
        </div>

        <div>
          <h4 className="font-bold text-base mb-1">{goal.title}</h4>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-3">
            <div className="h-full bg-violet-600 rounded-full transition-all duration-500" style={{ width: `${goalProgress}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};
