import React from 'react';
import { DailyRecordPlaceholder } from '../../types';
import { Smile, Sparkles } from 'lucide-react';

interface MoodCardComponentProps {
  record: DailyRecordPlaceholder;
  onUpdateMood: (mood: string, energy: number) => void;
}

export const MoodCardComponent: React.FC<MoodCardComponentProps> = ({ record, onUpdateMood }) => {
  const moods = [
    { id: 'excellent', label: 'Excellent', emoji: '😀' },
    { id: 'good', label: 'Good', emoji: '🙂' },
    { id: 'okay', label: 'Okay', emoji: '😐' },
    { id: 'low', label: 'Low', emoji: '😔' },
    { id: 'stressed', label: 'Stressed', emoji: '😫' },
  ];

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 text-xs font-semibold mb-2">
          <Smile className="w-3.5 h-3.5" />
          <span>Mood & Well-being</span>
        </div>
        <h3 className="text-xl font-extrabold tracking-tight">How are you feeling today?</h3>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {moods.map((m) => {
          const isSelected = record.mood === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onUpdateMood(m.id, record.energyLevel || 75)}
              className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                isSelected
                  ? 'border-pink-600 bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 shadow-sm ring-2 ring-pink-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className="text-[11px] font-bold truncate w-full">{m.label}</span>
            </button>
          );
        })}
      </div>

      {record.mood && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span>Today's mood: <strong className="capitalize text-pink-600">{record.mood}</strong></span>
            <span>Energy: {record.energyLevel || 75}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={record.energyLevel || 75}
            onChange={(e) => onUpdateMood(record.mood, parseInt(e.target.value))}
            className="w-full accent-pink-600 cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};
