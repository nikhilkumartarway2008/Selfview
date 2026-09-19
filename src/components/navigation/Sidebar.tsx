import React from 'react';
import { NavTab, UserProfile } from '../../types';
import { Home, Calendar, Plus, BarChart3, FolderArchive, Briefcase, GraduationCap, User, LogOut, Sparkles } from 'lucide-react';

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenAddModal: () => void;
  profile: UserProfile | null;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange, onOpenAddModal, profile, onLogout }) => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-white to-emerald-600 text-blue-900 flex items-center justify-center font-extrabold text-xl shadow-lg border border-amber-300">
            🇮🇳
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight flex items-center gap-1.5">
              <span>Selfview</span>
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            </h1>
            <p className="text-[10px] text-slate-400">Student Life Record</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-6 space-y-2">
        <button
          onClick={() => onTabChange('home')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition ${
            currentTab === 'home'
              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
          }`}
        >
          <Home className="w-5 h-5 text-amber-600" />
          <span>Home</span>
        </button>

        <button
          onClick={() => onTabChange('calendar')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition ${
            currentTab === 'calendar'
              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
          }`}
        >
          <Calendar className="w-5 h-5 text-amber-600" />
          <span>Calendar</span>
        </button>

        <button
          onClick={onOpenAddModal}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-600 text-white shadow-md shadow-amber-500/20 hover:opacity-95 transition"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Add Record</span>
        </button>

        <button
          onClick={() => onTabChange('insights')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition ${
            currentTab === 'insights'
              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
          }`}
        >
          <BarChart3 className="w-5 h-5 text-amber-600" />
          <span>Insights</span>
        </button>

        <button
          onClick={() => onTabChange('memories')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition ${
            currentTab === 'memories'
              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
          }`}
        >
          <FolderArchive className="w-5 h-5 text-amber-600" />
          <span>Memory Vault</span>
        </button>

        <button
          onClick={() => onTabChange('career')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition ${
            currentTab === 'career'
              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
          }`}
        >
          <Briefcase className="w-5 h-5 text-amber-600" />
          <span>Career & Placement</span>
        </button>

        <button
          onClick={() => onTabChange('community')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition ${
            currentTab === 'community'
              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
          }`}
        >
          <GraduationCap className="w-5 h-5 text-amber-600" />
          <span>University & Community</span>
        </button>

        <button
          onClick={() => onTabChange('ai')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition ${
            currentTab === 'ai'
              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-5 h-5 text-amber-600 animate-pulse" />
          <span>DayVault AI Intelligence</span>
        </button>

        <button
          onClick={() => onTabChange('profile')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition ${
            currentTab === 'profile'
              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
          }`}
        >
          <User className="w-5 h-5 text-amber-600" />
          <span>Profile</span>
        </button>
      </div>

      {/* User Card & Logout Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        {profile && (
          <div className="flex items-center gap-3 mb-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <img
              src={profile.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={profile.fullName}
              className="w-9 h-9 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{profile.fullName}</p>
              <p className="text-[10px] text-slate-400 truncate">{profile.university}</p>
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
