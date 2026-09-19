import React from 'react';
import { AcademicCoursePlaceholder } from '../../types';
import { Calendar as CalendarIcon, Clock, MapPin, User, Plus } from 'lucide-react';

interface ScheduleSectionProps {
  courses: AcademicCoursePlaceholder[];
  onOpenAddSchedule: () => void;
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({ courses, onOpenAddSchedule }) => {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Today's Classes & Events</span>
          </div>
          <h3 className="text-xl font-extrabold tracking-tight">Today's Schedule</h3>
        </div>
        <button
          onClick={onOpenAddSchedule}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Schedule</span>
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-500">No schedule added</p>
          <button
            onClick={onOpenAddSchedule}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition"
          >
            + Add Schedule
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map((c) => {
            const status = c.status || 'upcoming';
            const statusColors = {
              ongoing: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900',
              upcoming: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900',
              completed: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
            };

            return (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-500/50 transition"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">
                    {c.code}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm">{c.name}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${statusColors[status]}`}>
                        {status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {c.schedule}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {c.instructor}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {c.room}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
