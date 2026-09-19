import React, { useState, useMemo } from 'react';
import { UserProfile, DailyRecordPlaceholder, AcademicCoursePlaceholder } from '../../types';
import { dbService } from '../../services/db';
import {
  Calendar as CalendarIcon,
  Clock,
  Search,
  Filter,
  Flame,
  Award,
  Star,
  BookOpen,
  CheckCircle,
  DollarSign,
  FileText,
  Camera,
  ChevronLeft,
  ChevronRight,
  Eye,
  Plus,
  Sparkles,
  X
} from 'lucide-react';

interface CalendarViewProps {
  profile: UserProfile | null;
  courses: AcademicCoursePlaceholder[];
  onOpenAddModal: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ profile, courses, onOpenAddModal }) => {
  const userId = profile?.uid || 'default-user';

  // Sub-tabs: 'calendar' | 'timeline' | 'search'
  const [activeSubTab, setActiveSubTab] = useState<'calendar' | 'timeline' | 'search'>('calendar');

  // Calendar State
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 8, 1)); // September 2026
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-09-19');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  // Timeline Filter State
  const [timelineFilter, setTimelineFilter] = useState<string>('All');
  const [dateRangeFilter, setDateRangeFilter] = useState<string>('This Month');
  const [customStartDate, setCustomStartDate] = useState<string>('2026-09-01');
  const [customEndDate, setCustomEndDate] = useState<string>('2026-09-19');

  // Search State
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Data
  const allRecords = useMemo(() => dbService.getAllDailyRecords(userId), [userId]);
  const streak = useMemo(() => dbService.calculateStreak(userId), [userId]);
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed (8 = September)
  const monthlyStats = useMemo(() => dbService.calculateMonthlyStats(userId, year, month), [userId, year, month]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Selected date record
  const selectedRecord = useMemo(() => {
    return allRecords.find(r => r.date === selectedDateStr) || {
      id: 'empty-' + selectedDateStr,
      userId,
      date: selectedDateStr,
      studyHours: 0,
      studyGoalHours: 4,
      mood: 'Not recorded',
      energyLevel: 0,
      attendancePercentage: 0,
      expenses: 0,
      notesCount: 0,
      classesAttended: 0,
      classesTotal: 5,
      tasksCompleted: 0,
      tasksTotal: 5,
      memoriesCount: 0,
      journalTitle: 'No journal for this day',
      journalContent: 'No record added yet for this date.',
      studyTopics: [],
      achievements: [],
      isFavorite: false,
    };
  }, [allRecords, selectedDateStr, userId]);

  // Calendar Grid Calculations
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDateStr(now.toISOString().split('T')[0]);
  };

  const toggleFavorite = (dateStr: string) => {
    const rec = allRecords.find(r => r.date === dateStr);
    if (rec) {
      rec.isFavorite = !rec.isFavorite;
      dbService.saveDailyRecord(rec);
    } else {
      const newRec: DailyRecordPlaceholder = {
        id: 'rec-' + dateStr,
        userId,
        date: dateStr,
        studyHours: 2.0,
        studyGoalHours: 4,
        mood: 'good',
        energyLevel: 80,
        attendancePercentage: 90,
        expenses: 150,
        notesCount: 1,
        classesAttended: 4,
        classesTotal: 5,
        tasksCompleted: 3,
        tasksTotal: 5,
        memoriesCount: 1,
        journalTitle: 'Wonderful day',
        journalContent: 'Marked as favorite day.',
        studyTopics: ['Self Study'],
        achievements: ['Favorite Day Marker'],
        isFavorite: true,
      };
      dbService.saveDailyRecord(newRec);
    }
  };

  // Search Results
  const searchResults = useMemo(() => {
    return dbService.searchDayVault(userId, searchQuery);
  }, [userId, searchQuery]);

  // Filtered Timeline
  const timelineRecords = useMemo(() => {
    let list = [...allRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (timelineFilter === 'Study') {
      list = list.filter(r => r.studyHours > 0 || (r.studyTopics && r.studyTopics.length > 0));
    } else if (timelineFilter === 'College') {
      list = list.filter(r => (r.classesAttended || 0) > 0);
    } else if (timelineFilter === 'Tasks') {
      list = list.filter(r => (r.tasksCompleted || 0) > 0);
    } else if (timelineFilter === 'Goals') {
      list = list.filter(r => (r.studyHours || 0) >= (r.studyGoalHours || 4));
    } else if (timelineFilter === 'Journal') {
      list = list.filter(r => Boolean(r.journalContent && r.journalContent.length > 5));
    } else if (timelineFilter === 'Memories') {
      list = list.filter(r => (r.memoriesCount || 0) > 0);
    } else if (timelineFilter === 'Achievements') {
      list = list.filter(r => r.achievements && r.achievements.length > 0);
    } else if (timelineFilter === 'Expenses') {
      list = list.filter(r => (r.expenses || 0) > 0);
    }

    return list;
  }, [allRecords, timelineFilter]);

  // Important & Favorite days
  const importantAndFavoriteDays = useMemo(() => {
    return allRecords.filter(r => r.isFavorite || (r.achievements && r.achievements.length > 0));
  }, [allRecords]);

  return (
    <div className="space-y-8 pb-24 md:pb-12 animate-fadeIn">
      {/* Header & Sub-tab Navigation */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Calendar, History & Timeline</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Your Student Journey</h2>
          <p className="text-sm text-slate-500 mt-0.5">Browse your complete recorded life by date, timeline, and search.</p>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
          <button
            onClick={() => setActiveSubTab('calendar')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'calendar'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => setActiveSubTab('timeline')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'timeline'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setActiveSubTab('search')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'search'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: CALENDAR */}
      {activeSubTab === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Monthly Calendar */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              {/* Month Controls */}
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-extrabold tracking-tight">
                  {monthNames[month]} {year}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    title="Previous Month"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleToday}
                    className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition"
                  >
                    Today
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    title="Next Month"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Empty padding for first week */}
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <div key={'empty-' + i} className="h-24 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 opacity-40" />
                ))}

                {/* Days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                  const rec = allRecords.find(r => r.date === dateString);
                  const isSelected = selectedDateStr === dateString;
                  const isToday = dateString === new Date().toISOString().split('T')[0];

                  return (
                    <div
                      key={dateString}
                      onClick={() => setSelectedDateStr(dateString)}
                      className={`h-24 rounded-2xl border p-2 flex flex-col justify-between transition cursor-pointer relative group ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20 shadow-sm'
                          : isToday
                          ? 'border-indigo-400 bg-white dark:bg-slate-900'
                          : rec
                          ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                          : 'border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isToday ? 'w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-sm' : ''}`}>
                          {dayNum}
                        </span>
                        {rec?.isFavorite && (
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        )}
                      </div>

                      {/* Indicators */}
                      {rec && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Daily Record exists" />
                            {rec.studyHours > 0 && <span className="text-[10px]" title="Study">📚</span>}
                            {rec.classesAttended && rec.classesAttended > 0 && <span className="text-[10px]" title="Classes">🏫</span>}
                            {rec.journalContent && <span className="text-[10px]" title="Journal">📝</span>}
                            {rec.memoriesCount && rec.memoriesCount > 0 && <span className="text-[10px]" title="Memory">📸</span>}
                          </div>
                          <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                            {rec.studyHours}h study
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Monthly Overview Stats */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{monthNames[month]} Overview</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold">
                  <span className="text-amber-600 flex items-center gap-1"><Flame className="w-3.5 h-3.5 fill-current" /> {streak.current} Days Streak</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-xs text-slate-400 font-semibold block mb-1">Days Recorded</span>
                  <span className="text-xl font-extrabold">{monthlyStats.daysRecorded}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-xs text-slate-400 font-semibold block mb-1">Study Hours</span>
                  <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{monthlyStats.studyHours}h</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-xs text-slate-400 font-semibold block mb-1">Tasks Completed</span>
                  <span className="text-xl font-extrabold text-emerald-600">{monthlyStats.tasksCompleted}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-xs text-slate-400 font-semibold block mb-1">Total Expenses</span>
                  <span className="text-xl font-extrabold text-blue-600">₹{monthlyStats.totalExpenses}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Selected Date Summary & Important Days */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 sticky top-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Selected Date</span>
                  <h3 className="text-lg font-extrabold tracking-tight mt-0.5">{selectedDateStr}</h3>
                </div>
                <button
                  onClick={() => toggleFavorite(selectedDateStr)}
                  className={`p-2 rounded-xl border transition ${
                    selectedRecord.isFavorite
                      ? 'bg-amber-50 border-amber-500 text-amber-500 dark:bg-amber-950/60'
                      : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-500'
                  }`}
                  title="Mark as Favorite Day"
                >
                  <Star className={`w-4 h-4 ${selectedRecord.isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              {selectedRecord.studyHours === 0 && !selectedRecord.journalContent ? (
                <div className="text-center py-8 space-y-4">
                  <p className="text-sm font-semibold text-slate-500">No record for this day</p>
                  <button
                    onClick={onOpenAddModal}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition mx-auto block"
                  >
                    + Create Daily Record
                  </button>
                </div>
              ) : (
                <div className="space-y-4 text-xs font-medium">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <BookOpen className="w-4 h-4 text-indigo-600" />
                      <span>Study</span>
                    </span>
                    <strong className="text-slate-900 dark:text-white">{selectedRecord.studyHours}h ({selectedRecord.studyTopics?.join(', ') || 'General'})</strong>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Tasks</span>
                    </span>
                    <strong className="text-slate-900 dark:text-white">{selectedRecord.tasksCompleted || 3}/{selectedRecord.tasksTotal || 5} completed</strong>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                      <span>Expenses</span>
                    </span>
                    <strong className="text-slate-900 dark:text-white">₹{selectedRecord.expenses}</strong>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Sparkles className="w-4 h-4 text-pink-600" />
                      <span>Mood</span>
                    </span>
                    <strong className="capitalize text-slate-900 dark:text-white">{selectedRecord.mood || 'Good'}</strong>
                  </div>

                  {selectedRecord.journalContent && (
                    <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 space-y-2">
                      <span className="font-bold text-indigo-900 dark:text-indigo-200 block">{selectedRecord.journalTitle}</span>
                      <p className="text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">{selectedRecord.journalContent}</p>
                    </div>
                  )}

                  <button
                    onClick={onOpenAddModal}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 mt-4"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Full Record</span>
                  </button>
                </div>
              )}
            </div>

            {/* ⭐ Important & Favorite Days */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold text-amber-600 uppercase tracking-wider">
                <Star className="w-4 h-4 fill-current" />
                <span>Important & Favorite Days</span>
              </div>
              <div className="space-y-3">
                {importantAndFavoriteDays.slice(0, 3).map((fav) => (
                  <div
                    key={'fav-' + fav.date}
                    onClick={() => setSelectedDateStr(fav.date)}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer hover:border-amber-500 transition"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
                      <span>{fav.date}</span>
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    </div>
                    <h4 className="font-bold text-xs">{fav.journalTitle || fav.achievements?.[0] || 'Favorite Day'}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: TIMELINE */}
      {activeSubTab === 'timeline' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            {['All', 'Study', 'College', 'Tasks', 'Goals', 'Journal', 'Memories', 'Achievements', 'Expenses'].map((f) => (
              <button
                key={f}
                onClick={() => setTimelineFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  timelineFilter === f
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Timeline Feed */}
          <div className="space-y-4">
            {timelineRecords.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
                <p className="text-sm font-semibold text-slate-500">Your story starts here.</p>
                <p className="text-xs text-slate-400">Create your first Daily Record and start building your student timeline.</p>
                <button
                  onClick={onOpenAddModal}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md transition mx-auto block"
                >
                  + Create Today's Record
                </button>
              </div>
            ) : (
              timelineRecords.map((item) => (
                <div
                  key={'time-' + item.date}
                  className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 hover:border-indigo-500/50 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60">
                      {item.date}
                    </span>
                    {item.isFavorite && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Study Session</span>
                        <strong className="text-xs">{item.studyHours}h recorded</strong>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Tasks Done</span>
                        <strong className="text-xs">{item.tasksCompleted || 3} completed</strong>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Expenses</span>
                        <strong className="text-xs">₹{item.expenses}</strong>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Memories</span>
                        <strong className="text-xs">{item.memoriesCount || 1} photos</strong>
                      </div>
                    </div>
                  </div>

                  {item.journalContent && (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                      <h4 className="font-bold text-xs">{item.journalTitle}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2">{item.journalContent}</p>
                    </div>
                  )}

                  {item.achievements && item.achievements.length > 0 && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-xs font-bold">
                      <Award className="w-4 h-4" />
                      <span>{item.achievements[0]}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SEARCH */}
      {activeSubTab === 'search' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your DayVault (journals, study topics, achievements, tasks...)"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div className="space-y-4 pt-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Search Results ({searchResults.length})</h4>

              {searchResults.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs font-medium">
                  {searchQuery ? 'No records match your search query.' : 'Type a keyword above to search through your student life records.'}
                </div>
              ) : (
                <div className="space-y-3">
                  {searchResults.map((res, i) => (
                    <div
                      key={'search-' + i}
                      onClick={() => {
                        setSelectedDateStr(res.date);
                        setActiveSubTab('calendar');
                      }}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-500 cursor-pointer transition space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{res.date}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 font-bold text-[10px]">{res.category}</span>
                      </div>
                      <h4 className="font-bold text-sm">{res.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2">{res.preview}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
