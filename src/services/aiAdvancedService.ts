import { dbService } from './db';
import { communityService } from './communityService';
import { careerService } from './careerService';

export interface AIPlanItem {
  id: string;
  userId: string;
  subject: string;
  examDate: string;
  topics: string[];
  durationHours: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  schedule: {
    date: string;
    topic: string;
    duration: string;
    revision: string;
    practice: string;
  }[];
  status: 'Active' | 'Completed' | 'Draft';
  createdAt: string;
}

export interface AIFlashcardItem {
  id: string;
  userId: string;
  topic: string;
  question: string;
  answer: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  mastered?: boolean;
}

export interface AIQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AIQuizItem {
  id: string;
  userId: string;
  title: string;
  subject: string;
  questions: AIQuizQuestion[];
  score?: number;
  completed?: boolean;
}

export interface AIInterviewSession {
  id: string;
  userId: string;
  mode: 'Technical' | 'HR' | 'Project' | 'Behavioral' | 'Resume' | 'Mock';
  question: string;
  userAnswer?: string;
  feedback?: string;
  date: string;
}

export interface AIMemoryItem {
  id: string;
  userId: string;
  category: 'Study Style' | 'Career Goal' | 'Revision Preference' | 'Note';
  content: string;
  createdAt: string;
}

export interface AISettingsState {
  userId: string;
  aiEnabled: boolean;
  aiMemoryEnabled: boolean;
  voiceInputEnabled: boolean;
  suggestionsEnabled: boolean;
  communityDataAccess: boolean;
  careerDataAccess: boolean;
  academicDataAccess: boolean;
  documentProcessing: boolean;
}

const STORAGE_KEYS = {
  PLANS: 'dayvault_ai_plans',
  FLASHCARDS: 'dayvault_ai_flashcards',
  QUIZZES: 'dayvault_ai_quizzes',
  INTERVIEWS: 'dayvault_ai_interviews',
  MEMORIES: 'dayvault_ai_memories',
  SETTINGS: 'dayvault_ai_settings',
};

export const aiAdvancedService = {
  // Controlled Data Access Layer (Strict userId scope & authorization)
  getTodayData: (userId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const courses = dbService.getAcademicCourses(userId);
    const tasks = dbService.getTasks(userId).filter(t => t.dueDate === today || !t.completed);
    const goal = dbService.getGoal(userId);
    const habits = dbService.getHabits(userId);
    const events = communityService.getEvents(userId).filter(e => e.date === today || e.rsvpd);
    const career = careerService.getProfile(userId);

    return {
      date: today,
      classes: courses,
      tasks: tasks.slice(0, 5),
      goal,
      habits,
      events,
      careerGoal: career.targetRole,
      attendanceSummary: '100% On-Track'
    };
  },

  getStudyStats: (userId: string) => {
    const courses = dbService.getAcademicCourses(userId);
    const tasks = dbService.getTasks(userId);
    return { courses, tasks };
  },

  getCareerData: (userId: string) => {
    return careerService.getProfile(userId);
  },

  getUniversityEvents: (userId: string) => {
    return communityService.getEvents(userId);
  },

  getSavedResources: (userId: string) => {
    return communityService.getResources(userId).filter(r => r.bookmarked);
  },

  // AI Plans
  getPlans: (userId: string): AIPlanItem[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PLANS);
      const all: AIPlanItem[] = raw ? JSON.parse(raw) : [];
      const userPlans = all.filter(p => p.userId === userId);
      if (userPlans.length > 0) return userPlans;

      const defaultPlan: AIPlanItem = {
        id: 'plan-1',
        userId,
        subject: 'Advanced Algorithms',
        examDate: '2026-10-15',
        topics: ['Graph Traversal', 'Dynamic Programming', 'Greedy Algorithms'],
        durationHours: 15,
        difficulty: 'Hard',
        schedule: [
          { date: '2026-09-19', topic: 'Graph Theory & BFS/DFS', duration: '3 hrs', revision: 'Review notes', practice: 'Solve 3 LeetCode Medium' },
          { date: '2026-09-20', topic: 'Dijkstra & Bellman-Ford', duration: '3 hrs', revision: 'Quick Quiz', practice: 'Solve 2 Shortest Path problems' },
          { date: '2026-09-21', topic: 'Dynamic Programming Memoization', duration: '4 hrs', revision: 'Flashcards', practice: 'Knapsack & LCS' }
        ],
        status: 'Active',
        createdAt: new Date().toISOString().split('T')[0]
      };
      all.push(defaultPlan);
      localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(all));
      return [defaultPlan];
    } catch {
      return [];
    }
  },

  savePlan: (plan: AIPlanItem) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PLANS);
      const all: AIPlanItem[] = raw ? JSON.parse(raw) : [];
      const idx = all.findIndex(p => p.id === plan.id);
      if (idx >= 0) all[idx] = plan;
      else all.unshift(plan);
      localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  },

  // Flashcards
  getFlashcards: (userId: string): AIFlashcardItem[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.FLASHCARDS);
      const all: AIFlashcardItem[] = raw ? JSON.parse(raw) : [];
      const userCards = all.filter(f => f.userId === userId);
      if (userCards.length > 0) return userCards;

      const defaults: AIFlashcardItem[] = [
        { id: 'fc-1', userId, topic: 'Operating Systems', question: 'What is a semaphore?', answer: 'A synchronization variable used to control access to a common resource in a concurrent system.', difficulty: 'Medium', mastered: true },
        { id: 'fc-2', userId, topic: 'Data Structures', question: 'What is the worst-case time complexity of QuickSort?', answer: 'O(n^2) when the pivot chosen is consistently the smallest or largest element.', difficulty: 'Hard', mastered: false },
        { id: 'fc-3', userId, topic: 'Database Systems', question: 'What does ACID stand for in DBMS?', answer: 'Atomicity, Consistency, Isolation, Durability.', difficulty: 'Easy', mastered: true },
      ];
      all.push(...defaults);
      localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(all));
      return defaults;
    } catch {
      return [];
    }
  },

  saveFlashcard: (card: AIFlashcardItem) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.FLASHCARDS);
      const all: AIFlashcardItem[] = raw ? JSON.parse(raw) : [];
      const idx = all.findIndex(c => c.id === card.id);
      if (idx >= 0) all[idx] = card;
      else all.unshift(card);
      localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  },

  // Quizzes
  getQuizzes: (userId: string): AIQuizItem[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.QUIZZES);
      const all: AIQuizItem[] = raw ? JSON.parse(raw) : [];
      const userQuizzes = all.filter(q => q.userId === userId);
      if (userQuizzes.length > 0) return userQuizzes;

      const defaultQuiz: AIQuizItem = {
        id: 'quiz-1',
        userId,
        title: 'Algorithms & Concurrency Quick Test',
        subject: 'Computer Science',
        questions: [
          {
            id: 'q-1',
            question: 'Which scheduling algorithm may cause starvation?',
            options: ['Round Robin', 'First Come First Serve', 'Shortest Job First (SJF)', 'Multilevel Feedback Queue'],
            correctIndex: 2,
            explanation: 'Shortest Job First can starve long processes if short processes keep arriving.'
          },
          {
            id: 'q-2',
            question: 'What is the time complexity of searching in a balanced Binary Search Tree (BST)?',
            options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
            correctIndex: 1,
            explanation: 'Balanced BSTs maintain height logarithmic to the number of nodes.'
          }
        ],
        completed: false
      };
      all.push(defaultQuiz);
      localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(all));
      return [defaultQuiz];
    } catch {
      return [];
    }
  },

  saveQuiz: (quiz: AIQuizItem) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.QUIZZES);
      const all: AIQuizItem[] = raw ? JSON.parse(raw) : [];
      const idx = all.findIndex(q => q.id === quiz.id);
      if (idx >= 0) all[idx] = quiz;
      else all.unshift(quiz);
      localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  },

  // AI Memories
  getMemories: (userId: string): AIMemoryItem[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.MEMORIES);
      const all: AIMemoryItem[] = raw ? JSON.parse(raw) : [];
      return all.filter(m => m.userId === userId);
    } catch {
      return [];
    }
  },

  saveMemory: (memory: AIMemoryItem) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.MEMORIES);
      const all: AIMemoryItem[] = raw ? JSON.parse(raw) : [];
      all.unshift(memory);
      localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  },

  deleteMemory: (id: string) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.MEMORIES);
      const all: AIMemoryItem[] = raw ? JSON.parse(raw) : [];
      const filtered = all.filter(m => m.id !== id);
      localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(filtered));
    } catch (e) {
      console.error(e);
    }
  },

  // AI Settings
  getSettings: (userId: string): AISettingsState => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      const map: Record<string, AISettingsState> = raw ? JSON.parse(raw) : {};
      if (map[userId]) return map[userId];

      const defaultSettings: AISettingsState = {
        userId,
        aiEnabled: true,
        aiMemoryEnabled: true,
        voiceInputEnabled: true,
        suggestionsEnabled: true,
        communityDataAccess: true,
        careerDataAccess: true,
        academicDataAccess: true,
        documentProcessing: true,
      };
      map[userId] = defaultSettings;
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(map));
      return defaultSettings;
    } catch {
      return {
        userId,
        aiEnabled: true,
        aiMemoryEnabled: true,
        voiceInputEnabled: true,
        suggestionsEnabled: true,
        communityDataAccess: true,
        careerDataAccess: true,
        academicDataAccess: true,
        documentProcessing: true,
      };
    }
  },

  saveSettings: (settings: AISettingsState) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      const map: Record<string, AISettingsState> = raw ? JSON.parse(raw) : {};
      map[settings.userId] = settings;
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(map));
    } catch (e) {
      console.error(e);
    }
  }
};
