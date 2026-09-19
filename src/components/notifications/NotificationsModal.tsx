import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { notificationService, NotificationItem } from '../../services/notificationService';
import { Bell, Check, CheckCheck, Trash2, X, BookOpen, Target, Calendar } from 'lucide-react';

interface NotificationsModalProps {
  profile: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ profile, isOpen, onClose }) => {
  const userId = profile?.uid || 'default-user';
  const [notifications, setNotifications] = useState<NotificationItem[]>(notificationService.getNotifications(userId));
  const [filter, setFilter] = useState<'all' | 'academic' | 'productivity' | 'daily'>('all');

  if (!isOpen) return null;

  const handleMarkAsRead = (id: string) => {
    notificationService.markAsRead(userId, id);
    setNotifications(notificationService.getNotifications(userId));
  };

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead(userId);
    setNotifications(notificationService.getNotifications(userId));
  };

  const handleClear = () => {
    notificationService.clearNotifications(userId);
    setNotifications([]);
  };

  const filtered = notifications.filter(n => filter === 'all' || n.category === filter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">Notifications Center</h3>
              <p className="text-xs text-slate-400">Stay updated on academics, productivity, and daily reminders.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs & Actions */}
        <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-1.5">
            {(['all', 'academic', 'productivity', 'daily'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                  filter === cat
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllRead}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark Read</span>
            </button>
            <button
              onClick={handleClear}
              className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Bell className="w-10 h-10 mx-auto opacity-40" />
              <p className="text-sm font-semibold">No notifications right now.</p>
              <p className="text-xs">You're all caught up!</p>
            </div>
          ) : (
            filtered.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleMarkAsRead(notif.id)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3.5 ${
                  notif.read
                    ? 'bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 opacity-75'
                    : 'bg-amber-50/30 dark:bg-amber-950/10 border-amber-200 dark:border-amber-900/40 shadow-sm'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  notif.category === 'academic' ? 'bg-indigo-100 text-indigo-600' :
                  notif.category === 'productivity' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {notif.category === 'academic' ? <BookOpen className="w-4 h-4" /> :
                   notif.category === 'productivity' ? <Target className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-sm">{notif.title}</h4>
                    <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{notif.message}</p>
                </div>

                {!notif.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
