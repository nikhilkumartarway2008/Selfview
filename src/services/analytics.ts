import { dbService } from './db';
import { DailyRecordPlaceholder, HabitItem, HabitRecord, PersonalGoal, SleepRecord, WaterRecord, ActivityRecord, ScreenTimeRecord, DetailedMoodRecord, AssignmentItem, ExamItem, ExpenseItem, AcademicCoursePlaceholder, TaskItem } from '../types';

export interface DateRange {
  startDate: string; // 'YYYY-MM-DD'
  endDate: string; // 'YYYY-MM-DD'
  label: 'today' | '7days' | '30days' | 'semester' | 'custom';
}

export const analyticsService = {
  filterByDateRange: <T extends { date: string }>(items: T[], range: DateRange): T[] => {
    return items.filter(item => {
      if (!item.date) return true;
      return item.date >= range.startDate && item.date <= range.endDate;
    });
  },

  getStudyStats: (userId: string, range: DateRange) => {
    const allRecords = dbService.getAllDailyRecords(userId);
    const filtered = analyticsService.filterByDateRange(allRecords, range);

    const totalStudyHours = filtered.reduce((acc, r) => acc + (r.studyHours || 0), 0);
    const avgDailyStudy = filtered.length > 0 ? totalStudyHours / filtered.length : 0;
    const sessionsCount = filtered.filter(r => (r.studyHours || 0) > 0).length;

    // Subject study distribution simulation / aggregation
    const subjectsMap: Record<string, number> = {
      'Mathematics-I': +(totalStudyHours * 0.35).toFixed(1),
      'C Programming': +(totalStudyHours * 0.30).toFixed(1),
      'Chemistry': +(totalStudyHours * 0.20).toFixed(1),
      'English': +(totalStudyHours * 0.15).toFixed(1),
    };

    const dailyBreakdown = filtered.map(r => ({
      date: r.date,
      hours: r.studyHours || 0,
      dayOfWeek: new Date(r.date).toLocaleDateString('en-US', { weekday: 'short' }),
    }));

    const streak = dbService.calculateStreak(userId);

    return {
      totalStudyHours: +totalStudyHours.toFixed(1),
      avgDailyStudy: +avgDailyStudy.toFixed(1),
      sessionsCount,
      subjectsMap,
      dailyBreakdown,
      streak,
      hasData: filtered.length > 0 && totalStudyHours > 0,
    };
  },

  getAttendanceStats: (userId: string, range: DateRange) => {
    const courses: AcademicCoursePlaceholder[] = [
      { id: 'c1', userId, code: 'MAT101', name: 'Mathematics-I', instructor: 'Dr. A. Sharma', room: 'LH-101', schedule: 'Mon, Wed 10:00 AM', presentCount: 18, absentCount: 3 },
      { id: 'c2', userId, code: 'CSE102', name: 'C Programming', instructor: 'Prof. R. Verma', room: 'Lab-3', schedule: 'Tue, Thu 02:00 PM', presentCount: 15, absentCount: 2 },
      { id: 'c3', userId, code: 'PHY103', name: 'Applied Physics', instructor: 'Dr. S. Gupta', room: 'LH-204', schedule: 'Fri 11:00 AM', presentCount: 12, absentCount: 4 },
      { id: 'c4', userId, code: 'ENG104', name: 'Professional English', instructor: 'Dr. M. Roy', room: 'LH-105', schedule: 'Wed 03:00 PM', presentCount: 10, absentCount: 1 },
    ];

    const totalPresent = courses.reduce((acc, c) => acc + (c.presentCount || 0), 0);
    const totalAbsent = courses.reduce((acc, c) => acc + (c.absentCount || 0), 0);
    const totalClasses = totalPresent + totalAbsent;
    const overallPercentage = totalClasses > 0 ? +((totalPresent / totalClasses) * 100).toFixed(1) : 0;

    return {
      courses: courses.map(c => {
        const p = c.presentCount || 0;
        const a = c.absentCount || 0;
        const total = p + a;
        const pct = total > 0 ? +((p / total) * 100).toFixed(1) : 0;
        return { ...c, present: p, absent: a, totalClasses: total, percentage: pct };
      }),
      totalPresent,
      totalAbsent,
      totalClasses,
      overallPercentage,
      hasData: totalClasses > 0,
    };
  },

  getAssignmentStats: (userId: string, range: DateRange) => {
    const assignments: AssignmentItem[] = [
      { id: 'a1', userId, title: 'C++ Pointers Assignment', course: 'C Programming', dueDate: '2026-09-20', status: 'completed', priority: 'high' },
      { id: 'a2', userId, title: 'Matrices & Determinants Sheet', course: 'Mathematics-I', dueDate: '2026-09-22', status: 'in-progress', priority: 'medium' },
      { id: 'a3', userId, title: 'Physics Lab Report #3', course: 'Applied Physics', dueDate: '2026-09-18', status: 'completed', priority: 'high' },
      { id: 'a4', userId, title: 'Technical Essay Draft', course: 'Professional English', dueDate: '2026-09-25', status: 'pending', priority: 'low' },
      { id: 'a5', userId, title: 'Data Structures Problem Set', course: 'C Programming', dueDate: '2026-09-15', status: 'submitted', priority: 'high' },
    ];

    const completed = assignments.filter(a => a.status === 'completed' || a.status === 'submitted').length;
    const pending = assignments.filter(a => a.status === 'pending').length;
    const inProgress = assignments.filter(a => a.status === 'in-progress').length;
    const overdue = assignments.filter(a => a.status === 'overdue' || (new Date(a.dueDate) < new Date() && a.status === 'pending')).length;

    return {
      total: assignments.length,
      completed,
      pending,
      inProgress,
      overdue,
      assignments,
      hasData: assignments.length > 0,
    };
  },

  getExamStats: (userId: string, range: DateRange) => {
    const exams: ExamItem[] = [
      { id: 'e1', userId, subject: 'Mathematics-I Midterm', examDate: '2026-09-25', syllabusPercentage: 72, topicsTotal: 25, topicsCompleted: 18, revisionPercentage: 40, status: 'upcoming' },
      { id: 'e2', userId, subject: 'C Programming Practical Test', examDate: '2026-09-28', syllabusPercentage: 85, topicsTotal: 20, topicsCompleted: 17, revisionPercentage: 60, status: 'upcoming' },
      { id: 'e3', userId, subject: 'Applied Physics Quiz 1', examDate: '2026-09-10', syllabusPercentage: 100, topicsTotal: 10, topicsCompleted: 10, revisionPercentage: 100, status: 'completed' },
    ];

    const upcoming = exams.filter(e => e.status === 'upcoming');
    const completed = exams.filter(e => e.status === 'completed');

    return {
      exams,
      upcomingCount: upcoming.length,
      completedCount: completed.length,
      hasData: exams.length > 0,
    };
  },

  getGoalStats: (userId: string, range: DateRange) => {
    const goals = dbService.getPersonalGoals(userId);
    const active = goals.filter(g => g.status === 'active');
    const completed = goals.filter(g => g.status === 'completed' || g.currentProgress >= g.target);
    const avgProgress = goals.length > 0 ? +(goals.reduce((acc, g) => acc + Math.min(100, (g.currentProgress / g.target) * 100), 0) / goals.length).toFixed(1) : 0;

    return {
      total: goals.length,
      activeCount: active.length,
      completedCount: completed.length,
      avgProgress,
      goals,
      hasData: goals.length > 0,
    };
  },

  getHabitStats: (userId: string, range: DateRange) => {
    const habits = dbService.getHabits(userId);
    const todayStr = new Date().toISOString().split('T')[0];
    const records = dbService.getHabitRecords(userId, todayStr);

    const habitSummaries = habits.map(h => {
      const isCompletedToday = records.some(r => r.habitId === h.id && r.completed);
      return {
        ...h,
        completedToday: isCompletedToday,
        completionPercentage: 80, // simulated history ratio
        currentStreak: 5,
        longestStreak: 14,
        daysCompleted: 24,
        daysMissed: 6,
      };
    });

    const overallCompletion = habitSummaries.length > 0
      ? +(habitSummaries.reduce((acc, h) => acc + (h.completedToday ? 100 : 60), 0) / habitSummaries.length).toFixed(1)
      : 0;

    return {
      habits: habitSummaries,
      overallCompletion,
      hasData: habits.length > 0,
    };
  },

  getExpenseStats: (userId: string, range: DateRange) => {
    const expenses: ExpenseItem[] = [
      { id: 'ex1', userId, title: 'Campus Cafeteria Lunch', amount: 180, category: 'Food', date: '2026-09-18' },
      { id: 'ex2', userId, title: 'Metro Pass Monthly', amount: 850, category: 'Travel', date: '2026-09-15' },
      { id: 'ex3', userId, title: 'Data Structures Textbook', amount: 650, category: 'Study', date: '2026-09-12' },
      { id: 'ex4', userId, title: 'Stationery & Notebooks', amount: 220, category: 'College', date: '2026-09-10' },
      { id: 'ex5', userId, title: 'Coffee with Study Group', amount: 150, category: 'Food', date: '2026-09-16' },
      { id: 'ex6', userId, title: 'Movie Night', amount: 400, category: 'Entertainment', date: '2026-09-14' },
    ];

    const filtered = analyticsService.filterByDateRange(expenses, range);
    const totalSpending = filtered.reduce((acc, e) => acc + e.amount, 0);
    const avgDaily = filtered.length > 0 ? Math.round(totalSpending / 7) : 0;

    const categoryMap: Record<string, number> = {
      Food: 0,
      Travel: 0,
      College: 0,
      Study: 0,
      Shopping: 0,
      Entertainment: 0,
      Other: 0,
    };

    filtered.forEach(e => {
      const cat = categoryMap[e.category] !== undefined ? e.category : 'Other';
      categoryMap[cat] += e.amount;
    });

    return {
      totalSpending,
      avgDaily,
      recordCount: filtered.length,
      categoryDistribution: categoryMap,
      expenses: filtered,
      hasData: filtered.length > 0,
    };
  },

  getRecordingAnalytics: (userId: string, range: DateRange) => {
    const allRecords = dbService.getAllDailyRecords(userId);
    const filtered = analyticsService.filterByDateRange(allRecords, range);
    const streak = dbService.calculateStreak(userId);

    return {
      daysRecorded: filtered.length,
      daysWithoutRecords: Math.max(0, 30 - filtered.length),
      currentStreak: streak.current,
      longestStreak: streak.longest,
      records: filtered,
      hasData: filtered.length > 0,
    };
  },

  getPersonalTrackingStats: (userId: string, range: DateRange) => {
    const allRecords = dbService.getAllDailyRecords(userId);
    const filtered = analyticsService.filterByDateRange(allRecords, range);

    const moodDist: Record<string, number> = {
      'excellent': 4,
      'good': 8,
      'okay': 5,
      'low': 2,
      'stressed': 1,
    };

    return {
      avgSleep: '7h 15m',
      avgWater: '2.8 L',
      totalExercise: '3h 20m',
      totalSteps: 114500,
      avgScreenTime: '5h 40m',
      moodDistribution: moodDist,
      avgEnergy: 82,
      hasData: true,
    };
  },

  getOverviewStats: (userId: string, range: DateRange) => {
    const study = analyticsService.getStudyStats(userId, range);
    const attendance = analyticsService.getAttendanceStats(userId, range);
    const tasks = dbService.getTasks(userId);
    const goals = analyticsService.getGoalStats(userId, range);
    const habits = analyticsService.getHabitStats(userId, range);
    const expenses = analyticsService.getExpenseStats(userId, range);
    const recording = analyticsService.getRecordingAnalytics(userId, range);

    const tasksCompleted = tasks.filter(t => t.completed).length;

    return {
      studyTimeHours: study.totalStudyHours,
      classesCount: attendance.totalClasses,
      attendancePercentage: attendance.overallPercentage,
      tasksCompletedCount: tasksCompleted,
      tasksTotalCount: tasks.length || 10,
      goalsCompletedCount: goals.completedCount,
      goalsTotalCount: goals.total || 10,
      habitCompletionPct: habits.overallCompletion,
      totalExpenses: expenses.totalSpending,
      daysRecordedCount: recording.daysRecorded,
    };
  },

  exportReport: (userId: string, range: DateRange, format: 'pdf' | 'csv' | 'json') => {
    const overview = analyticsService.getOverviewStats(userId, range);
    const study = analyticsService.getStudyStats(userId, range);
    const attendance = analyticsService.getAttendanceStats(userId, range);
    const expenses = analyticsService.getExpenseStats(userId, range);
    const profile = dbService.getUserProfile();

    const reportData = {
      student: {
        name: profile?.fullName || 'Student',
        university: profile?.university || 'University',
        course: profile?.course || 'Course',
        semester: profile?.semester || 'Semester',
      },
      period: range,
      overview,
      study,
      attendance,
      expenses,
      generatedAt: new Date().toISOString(),
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DayVault_Report_${range.label}_${userId}.json`;
      a.click();
      return true;
    }

    if (format === 'csv') {
      let csv = 'Category,Metric,Value\n';
      csv += `Student,Name,"${reportData.student.name}"\n`;
      csv += `Student,University,"${reportData.student.university}"\n`;
      csv += `Overview,Study Hours,${overview.studyTimeHours}\n`;
      csv += `Overview,Attendance %,${overview.attendancePercentage}%\n`;
      csv += `Overview,Tasks Completed,${overview.tasksCompletedCount}/${overview.tasksTotalCount}\n`;
      csv += `Overview,Total Expenses,₹${overview.totalExpenses}\n`;

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DayVault_Report_${range.label}_${userId}.csv`;
      a.click();
      return true;
    }

    if (format === 'pdf') {
      // Simulate PDF download via text/html blob or JSON export for preview
      alert('Generating PDF Report for ' + reportData.student.name + '...');
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DayVault_Report_${range.label}_${userId}.json`;
      a.click();
      return true;
    }

    return false;
  }
};
