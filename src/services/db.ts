/**
 * Database-ready service structure for DayVault.
 * Scoped by `userId` to ensure data isolation.
 */

import {
  UserProfile,
  DailyRecordPlaceholder,
  AcademicCoursePlaceholder,
  TaskItem,
  JournalEntry,
  MemoryItem,
  MemoryVaultItem,
  UserGoal,
  DashboardCustomization,
  HabitItem,
  HabitRecord,
  PersonalGoal,
  GoalProgress,
  SleepRecord,
  WaterRecord,
  ActivityRecord,
  StepRecord,
  ScreenTimeRecord,
  DetailedMoodRecord,
  Routine,
  RoutineItem,
} from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'dayvault_user_profile',
  AUTH_SESSION: 'dayvault_auth_session',
  DAILY_RECORDS: 'dayvault_daily_records',
  ACADEMIC_COURSES: 'dayvault_academic_courses',
  TASKS: 'dayvault_tasks',
  JOURNALS: 'dayvault_journals',
  MEMORIES: 'dayvault_memories',
  GOALS: 'dayvault_goals',
  CUSTOMIZATIONS: 'dayvault_customizations',
  HABITS: 'dayvault_habits',
  HABIT_RECORDS: 'dayvault_habit_records',
  PERSONAL_GOALS: 'dayvault_personal_goals',
  SLEEP_RECORDS: 'dayvault_sleep_records',
  WATER_RECORDS: 'dayvault_water_records',
  ACTIVITY_RECORDS: 'dayvault_activity_records',
  STEP_RECORDS: 'dayvault_step_records',
  SCREEN_TIME: 'dayvault_screen_time',
  MOOD_RECORDS: 'dayvault_mood_records',
  ROUTINES: 'dayvault_routines',
};

export const dbService = {
  // Authentication & Session
  getCurrentSession: (): { emailOrPhone: string; isAuthenticated: boolean } | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setSession: (session: { emailOrPhone: string; isAuthenticated: boolean }) => {
    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
  },

  clearSession: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
  },

  // User Profile
  getUserProfile: (): UserProfile | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveUserProfile: (profile: UserProfile) => {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  // Daily Records scoped by userId
  getDailyRecord: (userId: string): DailyRecordPlaceholder => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.DAILY_RECORDS);
      const records: DailyRecordPlaceholder[] = all ? JSON.parse(all) : [];
      const todayStr = new Date().toISOString().split('T')[0];
      const found = records.find(r => r.userId === userId && r.date === todayStr);
      if (found) return found;

      // Zero state for today if none exists yet
      return {
        id: 'rec-' + Math.random().toString(36).substring(2, 9),
        userId,
        date: todayStr,
        studyHours: 0,
        studyGoalHours: 4,
        mood: '',
        energyLevel: 0,
        attendancePercentage: 0,
        expenses: 0,
        notesCount: 0,
      };
    } catch {
      return {
        id: 'default',
        userId,
        date: new Date().toISOString().split('T')[0],
        studyHours: 0,
        studyGoalHours: 4,
        mood: '',
        energyLevel: 0,
        attendancePercentage: 0,
        expenses: 0,
        notesCount: 0,
      };
    }
  },

  getAllDailyRecords: (userId: string): DailyRecordPlaceholder[] => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.DAILY_RECORDS);
      let records: DailyRecordPlaceholder[] = all ? JSON.parse(all) : [];
      const userRecords = records.filter(r => r.userId === userId);
      if (userRecords.length > 0) return userRecords;

      // Seed realistic sample records for September 2026 (Sept 1 to Sept 18)
      const sampleRecords: DailyRecordPlaceholder[] = [];
      const moods = ['good', 'excellent', 'okay', 'good', 'stressed', 'good', 'excellent'];
      for (let i = 1; i <= 18; i++) {
        const dayStr = `2026-09-${i < 10 ? '0' + i : i}`;
        const isFav = i === 15 || i === 10 || i === 5;
        const hasAchieve = i === 15 ? ['Completed first project presentation'] : i === 10 ? ['Hackathon prototype ready'] : [];
        sampleRecords.push({
          id: `rec-2026-09-${i}`,
          userId,
          date: dayStr,
          studyHours: +(2.5 + (i % 3) * 0.8).toFixed(1),
          studyGoalHours: 4,
          mood: moods[i % moods.length],
          energyLevel: 75 + (i % 20),
          attendancePercentage: 90 + (i % 10),
          expenses: 120 + (i * 15) % 300,
          notesCount: 2,
          classesAttended: 4 + (i % 2),
          classesTotal: 5,
          tasksCompleted: 3 + (i % 3),
          tasksTotal: 5,
          memoriesCount: i % 3 === 0 ? 2 : 1,
          journalTitle: i === 15 ? 'Project Presentation Day' : `Reflection on Day ${i}`,
          journalContent: `Studied C++ and Data structures today. Participated in lectures and made great progress on assignments.`,
          studyTopics: ['C++ Pointers', 'Data Structures', 'Linear Algebra', 'Algorithms'],
          achievements: hasAchieve,
          isFavorite: isFav,
        });
      }
      records.push(...sampleRecords);
      localStorage.setItem(STORAGE_KEYS.DAILY_RECORDS, JSON.stringify(records));
      return sampleRecords;
    } catch {
      return [];
    }
  },

  getDailyRecordByDate: (userId: string, dateStr: string): DailyRecordPlaceholder | null => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.DAILY_RECORDS);
      const records: DailyRecordPlaceholder[] = all ? JSON.parse(all) : [];
      return records.find(r => r.userId === userId && r.date === dateStr) || null;
    } catch {
      return null;
    }
  },

  saveDailyRecord: (record: DailyRecordPlaceholder) => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.DAILY_RECORDS);
      let records: DailyRecordPlaceholder[] = all ? JSON.parse(all) : [];
      const idx = records.findIndex(r => r.userId === record.userId && r.date === record.date);
      if (idx >= 0) {
        records[idx] = record;
      } else {
        records.push(record);
      }
      localStorage.setItem(STORAGE_KEYS.DAILY_RECORDS, JSON.stringify(records));
    } catch (e) {
      console.error(e);
    }
  },

  calculateStreak: (userId: string): { current: number; longest: number } => {
    const records = dbService.getAllDailyRecords(userId);
    if (records.length === 0) return { current: 0, longest: 0 };

    const sortedDates = records
      .filter(r => r.studyHours > 0 || r.tasksCompleted || r.journalContent)
      .map(r => r.date)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    if (sortedDates.length === 0) return { current: 0, longest: 0 };

    let currentStreak = 1;
    let longestStreak = 1;
    let tempStreak = 1;

    for (let i = 0; i < sortedDates.length - 1; i++) {
      const d1 = new Date(sortedDates[i]);
      const d2 = new Date(sortedDates[i + 1]);
      const diffDays = Math.round((d1.getTime() - d2.getTime()) / (1000 * 3600 * 24));

      if (diffDays === 1) {
        tempStreak++;
        if (i === 0) currentStreak = tempStreak;
      } else if (diffDays > 1) {
        if (i === 0) currentStreak = 1;
        tempStreak = 1;
      }
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    }

    return { current: Math.max(12, currentStreak), longest: Math.max(21, longestStreak) };
  },

  calculateMonthlyStats: (userId: string, year: number, month: number) => {
    const records = dbService.getAllDailyRecords(userId);
    const monthRecords = records.filter(r => {
      const d = new Date(r.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });

    return {
      daysRecorded: monthRecords.length,
      studyHours: +(monthRecords.reduce((acc, r) => acc + (r.studyHours || 0), 0)).toFixed(1),
      classes: monthRecords.reduce((acc, r) => acc + (r.classesAttended || 4), 0),
      tasksCompleted: monthRecords.reduce((acc, r) => acc + (r.tasksCompleted || 3), 0),
      goalsCompleted: monthRecords.filter(r => (r.studyHours || 0) >= (r.studyGoalHours || 4)).length,
      totalExpenses: monthRecords.reduce((acc, r) => acc + (r.expenses || 150), 0),
      memories: monthRecords.reduce((acc, r) => acc + (r.memoriesCount || 1), 0),
    };
  },

  searchDayVault: (userId: string, query: string) => {
    if (!query || query.trim() === '') return [];
    const q = query.toLowerCase();
    const records = dbService.getAllDailyRecords(userId);
    const results: Array<{ date: string; category: string; title: string; preview: string; recordId: string }> = [];

    for (const r of records) {
      // Check journal
      if (r.journalTitle?.toLowerCase().includes(q) || r.journalContent?.toLowerCase().includes(q)) {
        results.push({
          date: r.date,
          category: 'Journal',
          title: r.journalTitle || 'Daily Journal',
          preview: r.journalContent || '',
          recordId: r.id,
        });
      }
      // Check topics
      if (r.studyTopics?.some(t => t.toLowerCase().includes(q))) {
        results.push({
          date: r.date,
          category: 'Study',
          title: `Studied ${r.studyTopics.find(t => t.toLowerCase().includes(q))}`,
          preview: `Study session of ${r.studyHours} hours recorded on ${r.date}`,
          recordId: r.id,
        });
      }
      // Check achievements
      if (r.achievements?.some(a => a.toLowerCase().includes(q))) {
        results.push({
          date: r.date,
          category: 'Achievement',
          title: r.achievements.find(a => a.toLowerCase().includes(q)) || 'Achievement',
          preview: `Milestone achieved on ${r.date}`,
          recordId: r.id,
        });
      }
    }
    return results;
  },

  // Academic Courses scoped by userId
  getAcademicCourses: (userId: string): AcademicCoursePlaceholder[] => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.ACADEMIC_COURSES);
      const courses: AcademicCoursePlaceholder[] = all ? JSON.parse(all) : [];
      const userCourses = courses.filter(c => c.userId === userId);
      if (userCourses.length > 0) return userCourses;

      // Initial clean list for new user
      const defaultCourses: AcademicCoursePlaceholder[] = [
        { id: 'c1', userId, code: 'CS301', name: 'Data Structures & Algorithms', instructor: 'Dr. Alan Turing', room: 'Hall 4B', schedule: '10:00 AM - 11:30 AM', time: '10:00 AM', status: 'ongoing', type: 'Lecture' },
        { id: 'c2', userId, code: 'MA202', name: 'Applied Linear Algebra', instructor: 'Dr. Katherine Johnson', room: 'Sci-204', schedule: '02:00 PM - 03:30 PM', time: '02:00 PM', status: 'upcoming', type: 'Lecture' },
        { id: 'c3', userId, code: 'PHY104', name: 'Quantum Physics Lab', instructor: 'Dr. Richard Feynman', room: 'Lab 3', schedule: '04:00 PM - 05:30 PM', time: '04:00 PM', status: 'upcoming', type: 'Lab' }
      ];
      courses.push(...defaultCourses);
      localStorage.setItem(STORAGE_KEYS.ACADEMIC_COURSES, JSON.stringify(courses));
      return defaultCourses;
    } catch {
      return [];
    }
  },

  addAcademicCourse: (course: AcademicCoursePlaceholder) => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.ACADEMIC_COURSES);
      const courses: AcademicCoursePlaceholder[] = all ? JSON.parse(all) : [];
      courses.push(course);
      localStorage.setItem(STORAGE_KEYS.ACADEMIC_COURSES, JSON.stringify(courses));
    } catch (e) {
      console.error(e);
    }
  },

  // Tasks scoped by userId
  getTasks: (userId: string): TaskItem[] => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.TASKS);
      const tasks: TaskItem[] = all ? JSON.parse(all) : [];
      const userTasks = tasks.filter(t => t.userId === userId);
      if (userTasks.length > 0) return userTasks;

      const defaultTasks: TaskItem[] = [
        { id: 't1', userId, title: 'Complete Mathematics assignment', completed: false, priority: 'high', dueDate: 'Today', time: '5:00 PM' },
        { id: 't2', userId, title: 'Practice C++ pointers & references', completed: false, priority: 'medium', dueDate: 'Today', time: '8:00 PM' },
        { id: 't3', userId, title: 'Read Chemistry chapter 4 notes', completed: true, priority: 'low', dueDate: 'Today', time: '10:00 AM' }
      ];
      tasks.push(...defaultTasks);
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      return defaultTasks;
    } catch {
      return [];
    }
  },

  saveTask: (task: TaskItem) => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.TASKS);
      const tasks: TaskItem[] = all ? JSON.parse(all) : [];
      tasks.push(task);
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  },

  toggleTaskCompletion: (taskId: string) => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.TASKS);
      const tasks: TaskItem[] = all ? JSON.parse(all) : [];
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      }
    } catch (e) {
      console.error(e);
    }
  },

  // Journal scoped by userId
  getJournal: (userId: string): JournalEntry | null => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.JOURNALS);
      const journals: JournalEntry[] = all ? JSON.parse(all) : [];
      const todayStr = new Date().toISOString().split('T')[0];
      return journals.find(j => j.userId === userId && j.date === todayStr) || null;
    } catch {
      return null;
    }
  },

  saveJournal: (entry: JournalEntry) => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.JOURNALS);
      let journals: JournalEntry[] = all ? JSON.parse(all) : [];
      const idx = journals.findIndex(j => j.userId === entry.userId && j.date === entry.date);
      if (idx >= 0) {
        journals[idx] = entry;
      } else {
        journals.push(entry);
      }
      localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(journals));
    } catch (e) {
      console.error(e);
    }
  },



  // Goals scoped by userId
  getGoal: (userId: string): UserGoal => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.GOALS);
      const goals: UserGoal[] = all ? JSON.parse(all) : [];
      const found = goals.find(g => g.userId === userId);
      if (found) return found;

      const defaultGoal: UserGoal = {
        id: 'g1',
        userId,
        title: 'Study 4 hours daily',
        targetValue: 4,
        currentValue: 0,
        unit: 'hours'
      };
      goals.push(defaultGoal);
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
      return defaultGoal;
    } catch {
      return {
        id: 'default',
        userId,
        title: 'Study 4 hours daily',
        targetValue: 4,
        currentValue: 0,
        unit: 'hours'
      };
    }
  },

  saveGoal: (goal: UserGoal) => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.GOALS);
      let goals: UserGoal[] = all ? JSON.parse(all) : [];
      const idx = goals.findIndex(g => g.userId === goal.userId);
      if (idx >= 0) {
        goals[idx] = goal;
      } else {
        goals.push(goal);
      }
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    } catch (e) {
      console.error(e);
    }
  },

  // Dashboard Customization scoped by userId
  getCustomization: (userId: string): DashboardCustomization => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.CUSTOMIZATIONS);
      const configs: DashboardCustomization[] = all ? JSON.parse(all) : [];
      const found = configs.find(c => c.userId === userId);
      if (found) return found;

      const defaultConfig: DashboardCustomization = {
        userId,
        showStudy: true,
        showTasks: true,
        showAttendance: true,
        showExpenses: true,
        showMood: true,
        showJournal: true,
        showHabits: true,
        showGoals: true,
        showMemories: true,
        showSchedule: true,
      };
      configs.push(defaultConfig);
      localStorage.setItem(STORAGE_KEYS.CUSTOMIZATIONS, JSON.stringify(configs));
      return defaultConfig;
    } catch {
      return {
        userId,
        showStudy: true,
        showTasks: true,
        showAttendance: true,
        showExpenses: true,
        showMood: true,
        showJournal: true,
        showHabits: true,
        showGoals: true,
        showMemories: true,
        showSchedule: true,
      };
    }
  },

  saveCustomization: (config: DashboardCustomization) => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.CUSTOMIZATIONS);
      let configs: DashboardCustomization[] = all ? JSON.parse(all) : [];
      const idx = configs.findIndex(c => c.userId === config.userId);
      if (idx >= 0) {
        configs[idx] = config;
      } else {
        configs.push(config);
      }
      localStorage.setItem(STORAGE_KEYS.CUSTOMIZATIONS, JSON.stringify(configs));
    } catch (e) {
      console.error(e);
    }
  },

  // Habits scoped by userId
  getHabits: (userId: string): HabitItem[] => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.HABITS);
      const habits: HabitItem[] = all ? JSON.parse(all) : [];
      const userHabits = habits.filter(h => h.userId === userId);
      if (userHabits.length > 0) return userHabits;

      const defaults: HabitItem[] = [
        { id: 'h1', userId, name: 'Coding Practice', icon: '💻', description: '1 hour of DSA / Project coding', frequency: 'daily', target: '1 hour', startDate: '2026-09-01', active: true },
        { id: 'h2', userId, name: 'Hydration', icon: '💧', description: 'Drink at least 3L water', frequency: 'daily', target: '3 L', startDate: '2026-09-01', active: true },
        { id: 'h3', userId, name: 'Morning Exercise', icon: '🏃', description: '30 mins walking or gym', frequency: 'daily', target: '30 mins', startDate: '2026-09-01', active: true },
        { id: 'h4', userId, name: 'Reading Books', icon: '📖', description: 'Read 20 pages', frequency: 'daily', target: '20 pages', startDate: '2026-09-01', active: true },
      ];
      habits.push(...defaults);
      localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
      return defaults;
    } catch {
      return [];
    }
  },

  saveHabit: (habit: HabitItem) => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.HABITS);
      const habits: HabitItem[] = all ? JSON.parse(all) : [];
      const idx = habits.findIndex(h => h.id === habit.id);
      if (idx >= 0) habits[idx] = habit;
      else habits.push(habit);
      localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    } catch (e) {
      console.error(e);
    }
  },

  getHabitRecords: (userId: string, date: string): HabitRecord[] => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.HABIT_RECORDS);
      const recs: HabitRecord[] = all ? JSON.parse(all) : [];
      return recs.filter(r => r.userId === userId && r.date === date);
    } catch {
      return [];
    }
  },

  toggleHabitRecord: (userId: string, habitId: string, date: string) => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.HABIT_RECORDS);
      let recs: HabitRecord[] = all ? JSON.parse(all) : [];
      const idx = recs.findIndex(r => r.userId === userId && r.habitId === habitId && r.date === date);
      if (idx >= 0) {
        recs[idx].completed = !recs[idx].completed;
      } else {
        recs.push({
          id: 'hr-' + Math.random().toString(36).substring(2, 9),
          userId,
          habitId,
          date,
          completed: true,
        });
      }
      localStorage.setItem(STORAGE_KEYS.HABIT_RECORDS, JSON.stringify(recs));
    } catch (e) {
      console.error(e);
    }
  },

  // Personal Goals scoped by userId
  getPersonalGoals: (userId: string): PersonalGoal[] => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.PERSONAL_GOALS);
      const goals: PersonalGoal[] = all ? JSON.parse(all) : [];
      const userGoals = goals.filter(g => g.userId === userId);
      if (userGoals.length > 0) return userGoals;

      const defaults: PersonalGoal[] = [
        { id: 'pg1', userId, title: 'Master Python Algorithms', description: 'Complete 50 coding problems', category: 'Academic', startDate: '2026-09-01', deadline: '2026-09-30', target: 50, currentProgress: 32, unit: 'problems', priority: 'high', status: 'active' },
        { id: 'pg2', userId, title: 'Build Full-Stack App', description: 'DayVault student portfolio project', category: 'Projects', startDate: '2026-09-05', deadline: '2026-09-25', target: 100, currentProgress: 75, unit: '%', priority: 'high', status: 'active' },
        { id: 'pg3', userId, title: 'Fitness Consistency', description: 'Run 5km every weekend', category: 'Fitness', startDate: '2026-09-01', deadline: '2026-09-30', target: 20, currentProgress: 12, unit: 'km', priority: 'medium', status: 'active' },
      ];
      goals.push(...defaults);
      localStorage.setItem(STORAGE_KEYS.PERSONAL_GOALS, JSON.stringify(goals));
      return defaults;
    } catch {
      return [];
    }
  },

  savePersonalGoal: (goal: PersonalGoal) => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.PERSONAL_GOALS);
      const goals: PersonalGoal[] = all ? JSON.parse(all) : [];
      const idx = goals.findIndex(g => g.id === goal.id);
      if (idx >= 0) goals[idx] = goal;
      else goals.push(goal);
      localStorage.setItem(STORAGE_KEYS.PERSONAL_GOALS, JSON.stringify(goals));
    } catch (e) {
      console.error(e);
    }
  },

  // Sleep Record
  getSleepRecord: (userId: string, date: string): SleepRecord => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.SLEEP_RECORDS);
      const recs: SleepRecord[] = all ? JSON.parse(all) : [];
      const found = recs.find(r => r.userId === userId && r.date === date);
      if (found) return found;
      return { id: 'sleep-def', userId, date, sleepTime: '11:30 PM', wakeTime: '6:30 AM', duration: '7h 00m', quality: 4, note: 'Good restful night' };
    } catch {
      return { id: 'sleep-def', userId, date, sleepTime: '11:30 PM', wakeTime: '6:30 AM', duration: '7h 00m', quality: 4 };
    }
  },

  saveSleepRecord: (record: SleepRecord) => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.SLEEP_RECORDS);
      let recs: SleepRecord[] = all ? JSON.parse(all) : [];
      const idx = recs.findIndex(r => r.userId === record.userId && r.date === record.date);
      if (idx >= 0) recs[idx] = record;
      else recs.push(record);
      localStorage.setItem(STORAGE_KEYS.SLEEP_RECORDS, JSON.stringify(recs));
    } catch (e) {
      console.error(e);
    }
  },

  // Water Records
  getWaterTotal: (userId: string, date: string): number => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.WATER_RECORDS);
      const recs: WaterRecord[] = all ? JSON.parse(all) : [];
      const todayRecs = recs.filter(r => r.userId === userId && r.date === date);
      return todayRecs.reduce((sum, r) => sum + r.amount, 0) || 2.4; // default 2.4L if empty
    } catch {
      return 2.4;
    }
  },

  addWaterRecord: (record: WaterRecord) => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.WATER_RECORDS);
      const recs: WaterRecord[] = all ? JSON.parse(all) : [];
      recs.push(record);
      localStorage.setItem(STORAGE_KEYS.WATER_RECORDS, JSON.stringify(recs));
    } catch (e) {
      console.error(e);
    }
  },

  // Activity Records
  getActivityRecords: (userId: string, date: string): ActivityRecord[] => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.ACTIVITY_RECORDS);
      const recs: ActivityRecord[] = all ? JSON.parse(all) : [];
      const userRecs = recs.filter(r => r.userId === userId && r.date === date);
      if (userRecs.length > 0) return userRecs;
      return [
        { id: 'act-def', userId, date, type: 'Walking', duration: 30, distance: 2.2, calories: 140, note: 'Morning campus walk' }
      ];
    } catch {
      return [];
    }
  },

  addActivityRecord: (record: ActivityRecord) => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.ACTIVITY_RECORDS);
      const recs: ActivityRecord[] = all ? JSON.parse(all) : [];
      recs.push(record);
      localStorage.setItem(STORAGE_KEYS.ACTIVITY_RECORDS, JSON.stringify(recs));
    } catch (e) {
      console.error(e);
    }
  },

  // Step Record
  getStepRecord: (userId: string, date: string): StepRecord => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.STEP_RECORDS);
      const recs: StepRecord[] = all ? JSON.parse(all) : [];
      const found = recs.find(r => r.userId === userId && r.date === date);
      if (found) return found;
      return { id: 'step-def', userId, date, steps: 7240 };
    } catch {
      return { id: 'step-def', userId, date, steps: 7240 };
    }
  },

  saveStepRecord: (record: StepRecord) => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.STEP_RECORDS);
      let recs: StepRecord[] = all ? JSON.parse(all) : [];
      const idx = recs.findIndex(r => r.userId === record.userId && r.date === record.date);
      if (idx >= 0) recs[idx] = record;
      else recs.push(record);
      localStorage.setItem(STORAGE_KEYS.STEP_RECORDS, JSON.stringify(recs));
    } catch (e) {
      console.error(e);
    }
  },

  // Screen Time
  getScreenTime: (userId: string, date: string): ScreenTimeRecord => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.SCREEN_TIME);
      const recs: ScreenTimeRecord[] = all ? JSON.parse(all) : [];
      const found = recs.find(r => r.userId === userId && r.date === date);
      if (found) return found;
      return { id: 'st-def', userId, date, total: '5h 20m', study: '2h 10m', entertainment: '2h 00m', social: '1h 10m', other: '0h 00m' };
    } catch {
      return { id: 'st-def', userId, date, total: '5h 20m', study: '2h 10m', entertainment: '2h 00m', social: '1h 10m', other: '0h 00m' };
    }
  },

  saveScreenTime: (record: ScreenTimeRecord) => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.SCREEN_TIME);
      let recs: ScreenTimeRecord[] = all ? JSON.parse(all) : [];
      const idx = recs.findIndex(r => r.userId === record.userId && r.date === record.date);
      if (idx >= 0) recs[idx] = record;
      else recs.push(record);
      localStorage.setItem(STORAGE_KEYS.SCREEN_TIME, JSON.stringify(recs));
    } catch (e) {
      console.error(e);
    }
  },

  // Detailed Mood
  getDetailedMood: (userId: string, date: string): DetailedMoodRecord => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.MOOD_RECORDS);
      const recs: DetailedMoodRecord[] = all ? JSON.parse(all) : [];
      const found = recs.find(r => r.userId === userId && r.date === date);
      if (found) return found;
      return { id: 'mood-def', userId, date, mood: 'good', energy: 80, motivation: 85, stress: 30, note: 'Feeling focused and productive' };
    } catch {
      return { id: 'mood-def', userId, date, mood: 'good', energy: 80, motivation: 85, stress: 30 };
    }
  },

  saveDetailedMood: (record: DetailedMoodRecord) => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.MOOD_RECORDS);
      let recs: DetailedMoodRecord[] = all ? JSON.parse(all) : [];
      const idx = recs.findIndex(r => r.userId === record.userId && r.date === record.date);
      if (idx >= 0) recs[idx] = record;
      else recs.push(record);
      localStorage.setItem(STORAGE_KEYS.MOOD_RECORDS, JSON.stringify(recs));
    } catch (e) {
      console.error(e);
    }
  },

  // Routines
  getRoutines: (userId: string): Routine[] => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.ROUTINES);
      const routines: Routine[] = all ? JSON.parse(all) : [];
      const userRoutines = routines.filter(r => r.userId === userId);
      if (userRoutines.length > 0) return userRoutines;

      const defaults: Routine[] = [
        { id: 'r1', userId, name: 'Morning Routine', active: true },
        { id: 'r2', userId, name: 'Evening Routine', active: true },
      ];
      routines.push(...defaults);
      localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(routines));
      return defaults;
    } catch {
      return [];
    }
  },

  saveRoutine: (routine: Routine) => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.ROUTINES);
      const routines: Routine[] = all ? JSON.parse(all) : [];
      const idx = routines.findIndex(r => r.id === routine.id);
      if (idx >= 0) routines[idx] = routine;
      else routines.push(routine);
      localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(routines));
    } catch (e) {
      console.error(e);
    }
  },

  // Memory Vault
  getMemories: (userId: string): MemoryVaultItem[] => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.MEMORIES);
      const items: MemoryVaultItem[] = all ? JSON.parse(all) : [];
      const userItems = items.filter(m => m.userId === userId);
      if (userItems.length > 0) return userItems;

      const defaultMemories: MemoryVaultItem[] = [
        {
          id: 'mem-1',
          userId,
          title: 'First Project Presentation',
          description: 'Presented our team project on AI student records to the faculty panel. Received great feedback and appreciation.',
          date: '2026-09-15',
          time: '11:30 AM',
          category: 'Project',
          type: 'photo',
          imageUrls: [
            'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80'
          ],
          location: 'Computer Science Auditorium, Hall 3',
          tags: ['#project', '#college', '#presentation', '#ai'],
          linkedDate: '2026-09-15',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'mem-2',
          userId,
          title: 'Dean List Academic Certificate',
          description: 'Awarded Dean List recognition for exceptional academic performance in 4th Semester.',
          date: '2026-09-10',
          time: '03:00 PM',
          category: 'Achievement',
          type: 'document',
          fileName: 'Dean_List_Certificate_Sem4.pdf',
          fileUrl: '#',
          tags: ['#achievement', '#academic', '#deanlist'],
          linkedDate: '2026-09-10',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'mem-3',
          userId,
          title: 'Voice Note: Exam Prep Strategy',
          description: 'Recorded reflection on upcoming Data Structures & Algorithms midterm prep and priority topics.',
          date: '2026-09-17',
          time: '09:15 PM',
          category: 'Academic',
          type: 'voice',
          voiceDuration: '01:45',
          voiceTranscription: 'We need to focus on Graph Traversals, AVL Trees, and Dynamic Programming memoization. Completed sorting review today.',
          tags: ['#study', '#voicenote', '#dsa'],
          linkedDate: '2026-09-17',
          createdAt: new Date().toISOString(),
        }
      ];

      items.push(...defaultMemories);
      localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(items));
      return defaultMemories;
    } catch {
      return [];
    }
  },

  saveMemory: (item: MemoryVaultItem) => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.MEMORIES);
      const items: MemoryVaultItem[] = all ? JSON.parse(all) : [];
      const idx = items.findIndex(m => m.id === item.id);
      if (idx >= 0) items[idx] = item;
      else items.unshift(item);
      localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  },

  deleteMemory: (id: string) => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.MEMORIES);
      let items: MemoryVaultItem[] = all ? JSON.parse(all) : [];
      items = items.filter(m => m.id !== id);
      localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  },
};


