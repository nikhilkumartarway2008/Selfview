import React, { useState } from 'react';
import { X, BookOpen, CheckSquare, Target, Smile, DollarSign, FileText, Camera, Mic, Calendar, Sparkles } from 'lucide-react';

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddRecordModal: React.FC<AddRecordModalProps> = ({ isOpen, onClose }) => {
  const [category, setCategory] = useState<'study' | 'task' | 'goal' | 'habit' | 'mood' | 'expense' | 'journal' | 'photo' | 'voice'>('study');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTitle('');
      setNotes('');
      onClose();
    }, 800);
  };

  const categories = [
    { id: 'study', label: 'Study Session', icon: BookOpen, color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400' },
    { id: 'task', label: 'Assignment / Task', icon: CheckSquare, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400' },
    { id: 'goal', label: 'Goal', icon: Target, color: 'bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400' },
    { id: 'habit', label: 'Habit Log', icon: Smile, color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400' },
    { id: 'mood', label: 'Mood & Health', icon: Sparkles, color: 'bg-pink-50 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400' },
    { id: 'expense', label: 'Expense', icon: DollarSign, color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400' },
    { id: 'journal', label: 'Journal Entry', icon: FileText, color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400' },
    { id: 'photo', label: 'Memory Photo', icon: Camera, color: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400' },
    { id: 'voice', label: 'Voice Note', icon: Mic, color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-[2.5rem] sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              +
            </div>
            <h3 className="text-xl font-extrabold tracking-tight">Add Record to DayVault</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ✓
            </div>
            <h4 className="text-lg font-bold">Record Saved Successfully!</h4>
            <p className="text-xs text-slate-500 mt-1">Database-ready architecture recorded your entry.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                Select Record Category
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id as any)}
                      className={`p-3 rounded-2xl border text-left transition flex flex-col items-center sm:items-start gap-2 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className={`p-2 rounded-xl ${cat.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-center sm:text-left">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Title / Subject
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Completed Algorithm Assignment 3"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Notes / Details (Optional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add details, reflections, or reminders..."
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
                Save to Vault
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
