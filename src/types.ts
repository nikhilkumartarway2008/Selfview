export type AuthMode = 'landing' | 'login' | 'signup' | 'forgot' | 'profile_setup' | 'app';

export interface UserProfile {
  uid: string;
  email?: string;
  phone?: string;
  fullName: string;
  profilePhoto?: string;
  university: string;
  course: string;
  branch: string;
  semester: string;
  graduationYear: string;
  createdAt: string;
}

export type NavTab = 'home' | 'calendar' | 'career' | 'community' | 'ai' | 'add' | 'insights' | 'memories' | 'profile';

export interface MemoryVaultItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  date: string; // 'YYYY-MM-DD'
  time: string; // 'HH:MM AM/PM'
  category: 'College' | 'Academic' | 'Project' | 'Achievement' | 'Presentation' | 'Event' | 'Friends' | 'Personal' | 'General' | string;
  type: 'photo' | 'document' | 'voice' | 'event' | 'note' | string;
  imageUrls?: string[];
  fileUrl?: string;
  fileName?: string;
  voiceNoteUrl?: string;
  voiceTranscription?: string;
  voiceDuration?: string;
  location?: string;
  tags?: string[];
  linkedDate?: string; // 'YYYY-MM-DD'
  createdAt: string;
}

export interface DailyRecordPlaceholder {
  id: string;
  userId: string;
  date: string; // 'YYYY-MM-DD'
  studyHours: number;
  studyGoalHours: number;
  mood: 'excellent' | 'good' | 'okay' | 'low' | 'stressed' | string;
  energyLevel?: number; // 0-100
  attendancePercentage: number;
  expenses: number;
  notesCount: number;
  classesAttended?: number;
  classesTotal?: number;
  tasksCompleted?: number;
  tasksTotal?: number;
  memoriesCount?: number;
  journalTitle?: string;
  journalContent?: string;
  studyTopics?: string[];
  achievements?: string[];
  isFavorite?: boolean;
}

export interface AcademicCoursePlaceholder {
  id: string;
  userId: string;
  code: string;
  name: string;
  instructor: string;
  room: string;
  schedule: string;
  time?: string;
  status?: 'upcoming' | 'ongoing' | 'completed';
  type?: string;
  presentCount?: number;
  absentCount?: number;
}

export interface TaskItem {
  id: string;
  userId: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  time?: string;
}

export interface AssignmentItem {
  id: string;
  userId: string;
  title: string;
  course: string;
  dueDate: string;
  status: 'completed' | 'pending' | 'in-progress' | 'overdue' | 'submitted';
  priority: 'low' | 'medium' | 'high';
}

export interface ExamItem {
  id: string;
  userId: string;
  subject: string;
  examDate: string;
  syllabusPercentage: number;
  topicsTotal: number;
  topicsCompleted: number;
  revisionPercentage: number;
  status: 'upcoming' | 'completed';
}

export interface ExpenseItem {
  id: string;
  userId: string;
  title: string;
  amount: number;
  category: 'Food' | 'Travel' | 'College' | 'Study' | 'Shopping' | 'Entertainment' | 'Other' | string;
  date: string; // 'YYYY-MM-DD'
}

export interface JournalEntry {
  id: string;
  userId: string;
  date: string;
  title: string;
  content: string;
}

export interface MemoryItem {
  id: string;
  userId: string;
  date: string;
  imageUrl: string;
  caption: string;
}

export interface UserGoal {
  id: string;
  userId: string;
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
}

export interface DashboardCustomization {
  userId: string;
  showStudy: boolean;
  showTasks: boolean;
  showAttendance: boolean;
  showExpenses: boolean;
  showMood: boolean;
  showJournal: boolean;
  showHabits: boolean;
  showGoals: boolean;
  showMemories: boolean;
  showSchedule: boolean;
}

export interface HabitItem {
  id: string;
  userId: string;
  name: string;
  icon: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'custom';
  target: string;
  startDate: string;
  reminderTime?: string;
  active: boolean;
}

export interface HabitRecord {
  id: string;
  userId: string;
  habitId: string;
  date: string; // 'YYYY-MM-DD'
  completed: boolean;
  value?: number;
  note?: string;
}

export interface PersonalGoal {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'Academic' | 'Career' | 'Fitness' | 'Financial' | 'Learning' | 'Personal' | 'Projects' | 'Reading' | string;
  startDate: string;
  deadline: string;
  target: number;
  currentProgress: number;
  unit: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
}

export interface GoalProgress {
  id: string;
  userId: string;
  goalId: string;
  date: string;
  value: number;
  note?: string;
}

export interface SleepRecord {
  id: string;
  userId: string;
  date: string;
  sleepTime: string;
  wakeTime: string;
  duration: string; // e.g. '7h 30m'
  quality: number; // 1-5
  note?: string;
}

export interface WaterRecord {
  id: string;
  userId: string;
  date: string;
  amount: number; // in liters or ml
  timestamp: string;
}

export interface ActivityRecord {
  id: string;
  userId: string;
  date: string;
  type: 'Walking' | 'Running' | 'Cycling' | 'Gym' | 'Sports' | 'Yoga' | string;
  duration: number; // minutes
  distance?: number; // km
  calories?: number;
  note?: string;
}

export interface StepRecord {
  id: string;
  userId: string;
  date: string;
  steps: number;
}

export interface ScreenTimeRecord {
  id: string;
  userId: string;
  date: string;
  total: string; // e.g. '5h 20m'
  study: string;
  entertainment: string;
  social: string;
  other: string;
}

export interface DetailedMoodRecord {
  id: string;
  userId: string;
  date: string;
  mood: 'excellent' | 'good' | 'okay' | 'low' | 'stressed' | 'tired' | 'angry' | string;
  energy: number; // 0-100
  motivation: number; // 0-100
  stress: number; // 0-100
  note?: string;
}

export interface Routine {
  id: string;
  userId: string;
  name: string;
  active: boolean;
}

export interface RoutineItem {
  id: string;
  userId: string;
  routineId: string;
  title: string;
  time: string;
  order: number;
}

