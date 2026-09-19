import React from 'react';
import { TaskItem } from '../../types';
import { CheckSquare, Plus, ArrowRight, Clock, AlertCircle } from 'lucide-react';

interface TasksSectionProps {
  tasks: TaskItem[];
  onToggleTask: (id: string) => void;
  onOpenAddTask: () => void;
  onViewAllTasks: () => void;
}

export const TasksSection: React.FC<TasksSectionProps> = ({ tasks, onToggleTask, onOpenAddTask, onViewAllTasks }) => {
  const priorityColors = {
    high: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900',
    medium: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900',
    low: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900',
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-2">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Assignments & Todo</span>
          </div>
          <h3 className="text-xl font-extrabold tracking-tight">Today's Tasks</h3>
        </div>
        <button
          onClick={onOpenAddTask}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Task</span>
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-500">"No tasks for today."</p>
          <button
            onClick={onOpenAddTask}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
          >
            + Add Task
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className={`p-4 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                task.completed
                  ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-75'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-emerald-500/60 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleTask(task.id)}
                  className="w-5 h-5 rounded accent-emerald-600 cursor-pointer"
                />
                <div>
                  <h4 className={`font-bold text-sm ${task.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                    {task.time && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.time}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="pt-2 flex justify-end">
        <button
          onClick={onViewAllTasks}
          className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
        >
          <span>View All Tasks</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
