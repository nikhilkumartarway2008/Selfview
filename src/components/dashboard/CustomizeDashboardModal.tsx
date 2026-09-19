import React from 'react';
import { DashboardCustomization } from '../../types';
import { X, Sliders, Check } from 'lucide-react';

interface CustomizeDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: DashboardCustomization;
  onSave: (newConfig: DashboardCustomization) => void;
}

export const CustomizeDashboardModal: React.FC<CustomizeDashboardModalProps> = ({ isOpen, onClose, config, onSave }) => {
  const [localConfig, setLocalConfig] = React.useState<DashboardCustomization>(config);

  React.useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  if (!isOpen) return null;

  const toggleKey = (key: keyof DashboardCustomization) => {
    if (key === 'userId') return;
    setLocalConfig(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    onSave(localConfig);
    onClose();
  };

  const sections = [
    { key: 'showSchedule' as const, label: "Today's Schedule" },
    { key: 'showStudy' as const, label: 'Study Summary & Tracker' },
    { key: 'showTasks' as const, label: "Today's Tasks & Assignments" },
    { key: 'showAttendance' as const, label: 'Attendance & Overview Stats' },
    { key: 'showExpenses' as const, label: 'Expenses & Budget' },
    { key: 'showMood' as const, label: 'Mood & Well-being' },
    { key: 'showJournal' as const, label: 'Daily Journal' },
    { key: 'showMemories' as const, label: 'Recent Memories' },
    { key: 'showGoals' as const, label: 'Goals & Streak' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              <Sliders className="w-4 h-4" />
            </div>
            <h3 className="text-xl font-extrabold tracking-tight">Customize Dashboard</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 mb-6">
          Enable or disable sections to personalize your DayVault home dashboard layout.
        </p>

        <div className="space-y-3 mb-6 max-h-[60vh] overflow-y-auto pr-1">
          {sections.map((sec) => {
            const isEnabled = Boolean(localConfig[sec.key]);
            return (
              <div
                key={sec.key}
                onClick={() => toggleKey(sec.key)}
                className={`p-3.5 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                  isEnabled
                    ? 'bg-indigo-50/50 dark:bg-indigo-950/40 border-indigo-500/50 text-indigo-900 dark:text-indigo-200'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400'
                }`}
              >
                <span className="text-xs font-bold">{sec.label}</span>
                <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition ${
                  isEnabled ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 dark:border-slate-700'
                }`}>
                  {isEnabled && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition"
          >
            Save Layout
          </button>
        </div>
      </div>
    </div>
  );
};
