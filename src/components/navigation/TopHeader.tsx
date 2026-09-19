import React from 'react';
import { UserProfile } from '../../types';
import { Bell, Search, Sun, Moon } from 'lucide-react';

interface TopHeaderProps {
  profile: UserProfile | null;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onProfileClick: () => void;
  onOpenNotifications: () => void;
  onOpenSearch: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  profile,
  isDarkMode,
  onToggleDarkMode,
  onProfileClick,
  onOpenNotifications,
  onOpenSearch
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold tracking-tight">
          Welcome back, {profile?.fullName ? profile.fullName.split(' ')[0] : 'Student'}! 👋
        </h2>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <button
          onClick={onOpenSearch}
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white transition w-64 text-left"
        >
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="truncate">Search classes, notes, memories...</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          aria-label="Toggle Theme"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-blue-900" />}
        </button>

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition relative"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500" />
        </button>

        {/* Avatar */}
        <button
          onClick={onProfileClick}
          className="w-9 h-9 rounded-xl overflow-hidden border border-amber-300 dark:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <img
            src={profile?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </header>
  );
};
