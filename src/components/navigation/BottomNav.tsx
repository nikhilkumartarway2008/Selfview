import React from 'react';
import { NavTab } from '../../types';
import { Home, Calendar, Plus, GraduationCap, User } from 'lucide-react';

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenAddModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange, onOpenAddModal }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800 z-40 md:hidden pb-safe">
      <div className="max-w-md mx-auto px-2 h-16 flex items-center justify-between relative">
        {/* Home */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition ${
            currentTab === 'home'
              ? 'text-amber-600 dark:text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-1">Home</span>
        </button>

        {/* Calendar */}
        <button
          onClick={() => onTabChange('calendar')}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition ${
            currentTab === 'calendar'
              ? 'text-amber-600 dark:text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] mt-1">Calendar</span>
        </button>

        {/* Center Prominent + Add Button */}
        <div className="relative -top-3">
          <button
            onClick={onOpenAddModal}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/40 hover:scale-105 active:scale-95 transition transform ring-4 ring-white dark:ring-slate-900"
            aria-label="Add record"
          >
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </button>
        </div>

        {/* Community */}
        <button
          onClick={() => onTabChange('community')}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition ${
            currentTab === 'community'
              ? 'text-amber-600 dark:text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <GraduationCap className="w-5 h-5" />
          <span className="text-[10px] mt-1">Community</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition ${
            currentTab === 'profile'
              ? 'text-amber-600 dark:text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
};
