import React from 'react';
import { BookOpen, CheckSquare, GraduationCap, DollarSign, Smile, FileText, Camera, Target, Plus } from 'lucide-react';

interface QuickAddGridProps {
  onOpenAction: (actionType: 'study' | 'task' | 'class' | 'expense' | 'mood' | 'journal' | 'memory' | 'goal') => void;
}

export const QuickAddGrid: React.FC<QuickAddGridProps> = ({ onOpenAction }) => {
  const items = [
    { type: 'study' as const, label: 'Study', desc: 'Add study session', icon: BookOpen, color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400' },
    { type: 'task' as const, label: 'Task', desc: 'Add new task', icon: CheckSquare, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400' },
    { type: 'class' as const, label: 'Class', desc: 'Record a class', icon: GraduationCap, color: 'bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400' },
    { type: 'expense' as const, label: 'Expense', desc: 'Record expense', icon: DollarSign, color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400' },
    { type: 'mood' as const, label: 'Mood', desc: 'Record today mood', icon: Smile, color: 'bg-pink-50 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400' },
    { type: 'journal' as const, label: 'Journal', desc: 'Write journal', icon: FileText, color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400' },
    { type: 'memory' as const, label: 'Memory', desc: 'Add photo/memory', icon: Camera, color: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400' },
    { type: 'goal' as const, label: 'Goal', desc: 'Add daily goal', icon: Target, color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold tracking-tight">Quick Add</h3>
        <span className="text-xs text-slate-400">Fast day recording</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.type}
              onClick={() => onOpenAction(item.type)}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/60 dark:hover:border-indigo-500/60 text-left transition group shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <Plus className="w-4 h-4 text-slate-300 dark:text-slate-700 group-hover:text-indigo-600 transition" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{item.label}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
