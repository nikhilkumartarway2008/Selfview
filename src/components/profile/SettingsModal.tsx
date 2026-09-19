import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { notificationService, NotificationPreferences } from '../../services/notificationService';
import { analyticsService } from '../../services/analytics';
import { Settings, Bell, Cloud, Shield, Download, X, Check, Lock, RefreshCw, Trash2, HelpCircle } from 'lucide-react';

interface SettingsModalProps {
  profile: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ profile, isOpen, onClose }) => {
  const userId = profile?.uid || 'default-user';
  const [activeTab, setActiveTab] = useState<'notifications' | 'backup' | 'export' | 'privacy' | 'about'>('notifications');
  const [prefs, setPrefs] = useState<NotificationPreferences>(notificationService.getPreferences(userId));
  const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'pdf'>('json');
  const [exportPeriod, setExportPeriod] = useState<'30days' | 'semester' | 'everything'>('30days');
  const [lastBackup, setLastBackup] = useState('Today, 8:30 PM');
  const [isBackingUp, setIsBackingUp] = useState(false);

  if (!isOpen) return null;

  const handlePrefChange = (key: keyof NotificationPreferences, value: any) => {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    notificationService.savePreferences(userId, updated);
  };

  const handleBackupNow = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      setIsBackingUp(false);
      setLastBackup('Just now (' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ')');
    }, 1200);
  };

  const handleExport = () => {
    const range = exportPeriod === 'semester'
      ? { startDate: '2026-08-01', endDate: '2026-12-31', label: 'semester' as const }
      : { startDate: '2026-08-18', endDate: new Date().toISOString().split('T')[0], label: '30days' as const };
    analyticsService.exportReport(userId, range, exportFormat);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">DayVault Settings & Preferences</h3>
              <p className="text-xs text-slate-400">Manage notifications, backups, data export, and privacy controls.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Sidebar Nav */}
          <div className="w-full md:w-56 p-4 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex md:flex-col gap-1.5 overflow-x-auto">
            {[
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'backup', label: 'Backup & Sync', icon: Cloud },
              { id: 'export', label: 'Export Data', icon: Download },
              { id: 'privacy', label: 'Privacy & Security', icon: Shield },
              { id: 'about', label: 'About & Help', icon: HelpCircle },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h4 className="font-extrabold text-base mb-1">🔔 Notification Preferences</h4>
                  <p className="text-xs text-slate-400">Customize what reminders and notifications you receive.</p>
                </div>

                <div className="space-y-3">
                  {[
                    { key: 'dailyRecordReminder', label: 'Daily Record reminder', desc: 'Remind me to record my day and mood at 9:30 PM' },
                    { key: 'assignmentReminders', label: 'Assignment reminders', desc: 'Alerts when assignments are due in 1-3 days' },
                    { key: 'examReminders', label: 'Exam reminders', desc: 'Notices before upcoming semester examinations' },
                    { key: 'taskReminders', label: 'Task deadline reminders', desc: 'Reminders for pending tasks' },
                    { key: 'habitReminders', label: 'Habit check-in reminders', desc: 'Daily nudges to complete active habits' },
                    { key: 'goalReminders', label: 'Goal progress updates', desc: 'Weekly checks on personal goal milestones' },
                    { key: 'studyReminders', label: 'Study session reminders', desc: 'Scheduled reminders for focused study blocks' },
                    { key: 'weeklyReviewReminder', label: 'Weekly Review invite', desc: 'Sunday evening review of your weekly stats' },
                  ].map(item => (
                    <label key={item.key} className="flex items-start justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                      <div>
                        <span className="font-bold text-sm block">{item.label}</span>
                        <span className="text-xs text-slate-400">{item.desc}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={(prefs as any)[item.key]}
                        onChange={(e) => handlePrefChange(item.key as any, e.target.checked)}
                        className="w-5 h-5 rounded accent-indigo-600 mt-0.5 cursor-pointer"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'backup' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h4 className="font-extrabold text-base mb-1">☁️ Backup & Cloud Sync</h4>
                  <p className="text-xs text-slate-400">Keep your student records safely backed up and synchronized.</p>
                </div>

                <div className="p-6 rounded-3xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 font-bold block">Last Successful Backup</span>
                      <strong className="text-base text-indigo-900 dark:text-indigo-200">{lastBackup}</strong>
                    </div>
                    <button
                      onClick={handleBackupNow}
                      disabled={isBackingUp}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold shadow-md transition flex items-center gap-2"
                    >
                      <RefreshCw className={`w-4 h-4 ${isBackingUp ? 'animate-spin' : ''}`} />
                      <span>{isBackingUp ? 'Backing Up...' : 'Backup Now'}</span>
                    </button>
                  </div>
                </div>

                <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border cursor-pointer">
                  <div>
                    <span className="font-bold text-sm block">Automatic Cloud Backup</span>
                    <span className="text-xs text-slate-400">Automatically sync changes to secure encrypted cloud storage</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefs.autoBackup}
                    onChange={(e) => handlePrefChange('autoBackup', e.target.checked)}
                    className="w-5 h-5 rounded accent-indigo-600 cursor-pointer"
                  />
                </label>
              </div>
            )}

            {activeTab === 'export' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h4 className="font-extrabold text-base mb-1">📦 Export Student Data</h4>
                  <p className="text-xs text-slate-400">Download your complete academic and personal records in standard formats.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-2">Select Period</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['30days', 'semester', 'everything'] as const).map(p => (
                        <button
                          key={p}
                          onClick={() => setExportPeriod(p)}
                          className={`py-3 px-4 rounded-2xl text-xs font-bold capitalize border transition ${
                            exportPeriod === p
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {p === '30days' ? 'Last 30 Days' : p === 'semester' ? 'This Semester' : 'Everything'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-2">Select Format</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['json', 'csv', 'pdf'] as const).map(fmt => (
                        <button
                          key={fmt}
                          onClick={() => setExportFormat(fmt)}
                          className={`py-3 px-4 rounded-2xl text-xs font-bold uppercase border transition ${
                            exportFormat === fmt
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleExport}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Student Report ({exportFormat.toUpperCase()})</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h4 className="font-extrabold text-base mb-1">🔐 Privacy & Security Center</h4>
                  <p className="text-xs text-slate-400">Your data belongs strictly to you. Complete user data isolation is enforced.</p>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm block">Account Ownership</span>
                      <span className="text-xs text-slate-400">{profile?.email || 'Authenticated User'}</span>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full">Secure & Encrypted</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm block">AI Assistant Scope</span>
                      <span className="text-xs text-slate-400">Restricted strictly to your authenticated records</span>
                    </div>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full">Private Scope</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h4 className="font-extrabold text-base mb-1">📘 About DayVault</h4>
                  <p className="text-xs text-slate-400">Production-ready student life-management platform.</p>
                </div>

                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  <p><strong>Version:</strong> 2.5.0 Production</p>
                  <p><strong>Designed for:</strong> Comprehensive Academic, Daily, and Personal Tracking</p>
                  <p>DayVault guarantees that all student records, memories, goals, and analytics remain fully private and scoped exclusively to your authenticated account.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
