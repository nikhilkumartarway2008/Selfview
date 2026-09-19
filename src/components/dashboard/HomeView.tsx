import React, { useState, useEffect } from 'react';
import { UserProfile, AcademicCoursePlaceholder, DailyRecordPlaceholder, TaskItem, JournalEntry, MemoryItem, MemoryVaultItem, UserGoal, DashboardCustomization } from '../../types';
import { dbService } from '../../services/db';

// Subcomponents
import { StatCard } from './StatCard';
import { QuickAddGrid } from './QuickAddGrid';
import { ProgressCard } from './ProgressCard';
import { ScheduleSection } from './ScheduleSection';
import { TasksSection } from './TasksSection';
import { StudySummaryCard } from './StudySummaryCard';
import { MoodCardComponent } from './MoodCardComponent';
import { JournalPreviewCard } from './JournalPreviewCard';
import { MemoriesCard } from './MemoriesCard';
import { GoalsStreakCard } from './GoalsStreakCard';
import { CustomizeDashboardModal } from './CustomizeDashboardModal';
import { RecordModal } from './RecordModal';

import { BookOpen, CheckCircle, Clock, DollarSign, Sliders, Calendar as CalendarIcon } from 'lucide-react';

interface HomeViewProps {
  profile: UserProfile | null;
  onNavigateTab: (tab: any) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ profile, onNavigateTab }) => {
  const userId = profile?.uid || 'default-user';

  const [record, setRecord] = useState<DailyRecordPlaceholder>(dbService.getDailyRecord(userId));
  const [courses, setCourses] = useState<AcademicCoursePlaceholder[]>(dbService.getAcademicCourses(userId));
  const [tasks, setTasks] = useState<TaskItem[]>(dbService.getTasks(userId));
  const [journal, setJournal] = useState<JournalEntry | null>(dbService.getJournal(userId));
  const loadMemories = (): MemoryItem[] => {
    const raw = dbService.getMemories(userId);
    return raw.map(m => ({
      id: m.id,
      userId: m.userId,
      date: m.date,
      imageUrl: m.imageUrls?.[0] || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      caption: m.title
    }));
  };

  const [memories, setMemories] = useState<MemoryItem[]>(loadMemories());
  const [goal, setGoal] = useState<UserGoal>(dbService.getGoal(userId));
  const [customization, setCustomization] = useState<DashboardCustomization>(dbService.getCustomization(userId));

  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [activeModalType, setActiveModalType] = useState<'study' | 'task' | 'class' | 'expense' | 'mood' | 'journal' | 'memory' | 'goal' | null>(null);

  useEffect(() => {
    setRecord(dbService.getDailyRecord(userId));
    setCourses(dbService.getAcademicCourses(userId));
    setTasks(dbService.getTasks(userId));
    setJournal(dbService.getJournal(userId));
    setMemories(loadMemories());
    setGoal(dbService.getGoal(userId));
    setCustomization(dbService.getCustomization(userId));
  }, [userId]);

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const completedTasksCount = tasks.filter(t => t.completed).length;

  const handleToggleTask = (taskId: string) => {
    dbService.toggleTaskCompletion(taskId);
    setTasks(dbService.getTasks(userId));
  };

  const handleUpdateMood = (mood: string, energy: number) => {
    const updated = { ...record, mood, energyLevel: energy };
    dbService.saveDailyRecord(updated);
    setRecord(updated);
  };

  const handleSaveCustomization = (newConfig: DashboardCustomization) => {
    dbService.saveCustomization(newConfig);
    setCustomization(newConfig);
  };

  const handleRecordSubmit = (type: string, data: any) => {
    if (type === 'study') {
      const hours = parseFloat(data.value) || 2.0;
      const updated = { ...record, studyHours: record.studyHours + hours };
      dbService.saveDailyRecord(updated);
      setRecord(updated);
    } else if (type === 'task') {
      const newTask: TaskItem = {
        id: 'task-' + Math.random().toString(36).substring(2, 9),
        userId,
        title: data.title || 'New Student Task',
        completed: false,
        priority: data.priority || 'medium',
        dueDate: 'Today',
        time: '6:00 PM',
      };
      dbService.saveTask(newTask);
      setTasks(dbService.getTasks(userId));
    } else if (type === 'expense') {
      const amt = parseFloat(data.value) || 50;
      const updated = { ...record, expenses: record.expenses + amt };
      dbService.saveDailyRecord(updated);
      setRecord(updated);
    } else if (type === 'journal') {
      const newEntry: JournalEntry = {
        id: 'journal-' + Math.random().toString(36).substring(2, 9),
        userId,
        date: new Date().toISOString().split('T')[0],
        title: data.title || 'Reflection of the day',
        content: data.notes || data.title || 'Productive day at university.',
      };
      dbService.saveJournal(newEntry);
      setJournal(newEntry);
    } else if (type === 'memory') {
      const newMem: MemoryVaultItem = {
        id: 'mem-' + Math.random().toString(36).substring(2, 9),
        userId,
        title: data.title || 'Student life memory snapshot',
        description: data.notes || 'Quick captured memory from dashboard',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: 'General',
        type: 'photo',
        imageUrls: ['https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80'],
        tags: ['#college', '#snapshot'],
        createdAt: new Date().toISOString(),
      };
      dbService.saveMemory(newMem);
      setMemories(loadMemories());
    } else if (type === 'goal') {
      const target = parseFloat(data.value) || 4;
      const updatedGoal: UserGoal = {
        ...goal,
        title: data.title || goal.title,
        targetValue: target,
      };
      dbService.saveGoal(updatedGoal);
      setGoal(updatedGoal);
    } else if (type === 'class') {
      const newCourse: AcademicCoursePlaceholder = {
        id: 'c-' + Math.random().toString(36).substring(2, 9),
        userId,
        code: 'GEN101',
        name: data.title || 'New Class Session',
        instructor: 'Faculty Member',
        room: 'Hall A',
        schedule: '11:00 AM',
        status: 'upcoming',
        type: 'Lecture',
      };
      dbService.addAcademicCourse(newCourse);
      setCourses(dbService.getAcademicCourses(userId));
    }
  };

  const studentName = profile?.fullName ? profile.fullName.split(' ')[0] : 'Student';

  return (
    <div className="space-y-8 pb-24 md:pb-12">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>{currentDateFormatted}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Good Morning, {studentName} 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            "Ready to make today count?"
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsCustomizeOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Customize Dashboard</span>
          </button>

          <button
            onClick={() => onNavigateTab('profile')}
            className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-indigo-600 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <img
              src={profile?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={profile?.fullName || 'Profile'}
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>

      {/* 2. Today's Overview (4 Stat Cards) */}
      {customization.showAttendance && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Study Time"
            value={`${record.studyHours}h 00m`}
            subtitle="Today's study"
            icon={Clock}
            iconBgColor="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400"
          />
          <StatCard
            title="Attendance"
            value={`${record.attendancePercentage}%`}
            subtitle="Overall attendance"
            icon={CheckCircle}
            iconBgColor="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
          />
          <StatCard
            title="Tasks"
            value={`${completedTasksCount}/${tasks.length}`}
            subtitle="Completed today"
            icon={BookOpen}
            iconBgColor="bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400"
          />
          <StatCard
            title="Spent Today"
            value={`₹${record.expenses}`}
            subtitle="Today's expenses"
            icon={DollarSign}
            iconBgColor="bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
          />
        </div>
      )}

      {/* 🌱 Today's Wellness Compact Card */}
      <div 
        onClick={() => onNavigateTab('insights')}
        className="bg-gradient-to-r from-emerald-600/10 via-teal-600/10 to-indigo-600/10 dark:from-emerald-950/40 dark:to-indigo-950/40 p-6 rounded-3xl border border-emerald-200/60 dark:border-emerald-900/40 cursor-pointer hover:border-emerald-400 transition shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-md shrink-0">
            🌱
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-1">
              <span>Today's Wellness & Personal Tracking</span>
            </div>
            <h3 className="text-lg font-extrabold tracking-tight">Water, Sleep, Exercise & Habits</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Click to open full Personal Life Tracker & Weekly Review.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
          <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-1">
            💧 2.4L
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-1">
            😴 7h
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-1">
            🏃 30m
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-1">
            🔥 4/4 Habits
          </span>
        </div>
      </div>

      {/* 3. Daily Progress Card */}
      {customization.showGoals && (
        <ProgressCard
          record={record}
          totalTasks={tasks.length}
          completedTasks={completedTasksCount}
          onOpenAdd={(t) => setActiveModalType(t as any)}
        />
      )}

      {/* 4. Quick Add Section */}
      <QuickAddGrid onOpenAction={(type) => setActiveModalType(type)} />

      {/* 5. Today's Schedule */}
      {customization.showSchedule && (
        <ScheduleSection
          courses={courses}
          onOpenAddSchedule={() => setActiveModalType('class')}
        />
      )}

      {/* 6. Today's Tasks */}
      {customization.showTasks && (
        <TasksSection
          tasks={tasks}
          onToggleTask={handleToggleTask}
          onOpenAddTask={() => setActiveModalType('task')}
          onViewAllTasks={() => onNavigateTab('calendar')}
        />
      )}

      {/* 7. Study Summary */}
      {customization.showStudy && (
        <StudySummaryCard
          record={record}
          onStartStudy={() => setActiveModalType('study')}
        />
      )}

      {/* 8. Mood Card */}
      {customization.showMood && (
        <MoodCardComponent
          record={record}
          onUpdateMood={handleUpdateMood}
        />
      )}

      {/* 9. Daily Journal Preview */}
      {customization.showJournal && (
        <JournalPreviewCard
          journal={journal}
          onOpenJournalModal={() => setActiveModalType('journal')}
        />
      )}

      {/* 10. Recent Memories */}
      {customization.showMemories && (
        <MemoriesCard
          memories={memories}
          onOpenAddMemory={() => setActiveModalType('memory')}
        />
      )}

      {/* 11. Goals & Streak */}
      <GoalsStreakCard goal={goal} streakDays={12} />

      {/* Modals */}
      <CustomizeDashboardModal
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        config={customization}
        onSave={handleSaveCustomization}
      />

      <RecordModal
        isOpen={Boolean(activeModalType)}
        type={activeModalType}
        onClose={() => setActiveModalType(null)}
        onSubmitRecord={handleRecordSubmit}
      />
    </div>
  );
};
