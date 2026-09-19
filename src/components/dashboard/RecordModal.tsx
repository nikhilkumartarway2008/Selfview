import React, { useState } from 'react';
import { X, BookOpen, CheckSquare, GraduationCap, DollarSign, Smile, FileText, Camera, Target } from 'lucide-react';

interface RecordModalProps {
  isOpen: boolean;
  type: 'study' | 'task' | 'class' | 'expense' | 'mood' | 'journal' | 'memory' | 'goal' | null;
  onClose: () => void;
  onSubmitRecord: (type: string, data: any) => void;
}

export const RecordModal: React.FC<RecordModalProps> = ({ isOpen, type, onClose, onSubmitRecord }) => {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [notes, setNotes] = useState('');

  if (!isOpen || !type) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitRecord(type, { title, value, priority, notes });
    setTitle('');
    setValue('');
    setNotes('');
    onClose();
  };

  const titles: Record<string, { title: string; desc: string; icon: any }> = {
    study: { title: 'Add Study Session', desc: 'Record study hours and focus topics.', icon: BookOpen },
    task: { title: 'Add New Task', desc: 'Add an assignment or todo item.', icon: CheckSquare },
    class: { title: 'Record Class / Schedule', desc: 'Add a class session to your timetable.', icon: GraduationCap },
    expense: { title: 'Record Expense', desc: 'Log today spending or student expenses.', icon: DollarSign },
    mood: { title: 'Record Mood', desc: 'Update how you are feeling today.', icon: Smile },
    journal: { title: 'Write Daily Journal', desc: 'Record your thoughts and daily memories.', icon: FileText },
    memory: { title: 'Add Memory Photo', desc: 'Upload a photo moment from your student life.', icon: Camera },
    goal: { title: 'Add Daily Goal', desc: 'Set your primary academic or personal goal.', icon: Target },
  };

  const current = titles[type] || titles.study;
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold tracking-tight">{current.title}</h3>
              <p className="text-xs text-slate-500">{current.desc}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              {type === 'expense' ? 'Expense Title / Description' : type === 'study' ? 'Study Topic / Subject' : 'Title'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={type === 'expense' ? 'e.g. Campus Cafeteria Lunch' : type === 'study' ? 'e.g. Data Structures Graph theory' : 'Enter title...'}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {(type === 'study' || type === 'expense' || type === 'goal') && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                {type === 'study' ? 'Study Hours (e.g. 2.0)' : type === 'expense' ? 'Amount (₹ / $)' : 'Target Value'}
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={type === 'study' ? '2.0' : type === 'expense' ? '250' : '4'}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          )}

          {type === 'task' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Priority Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2.5 text-xs font-bold rounded-xl border capitalize transition ${
                      priority === p
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              {type === 'journal' ? 'Journal Content' : 'Notes / Details'}
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={type === 'journal' ? 'Write your thoughts, reflections, and memories of the day...' : 'Add any additional notes...'}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
