export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  category: 'academic' | 'productivity' | 'daily';
  timestamp: string;
  read: boolean;
  type: string;
}

export interface NotificationPreferences {
  dailyRecordReminder: boolean;
  dailyRecordTime: string;
  assignmentReminders: boolean;
  examReminders: boolean;
  taskReminders: boolean;
  habitReminders: boolean;
  goalReminders: boolean;
  studyReminders: boolean;
  journalReminders: boolean;
  weeklyReviewReminder: boolean;
  weeklyReviewDay: string;
  weeklyReviewTime: string;
  autoBackup: boolean;
}

const STORAGE_KEYS = {
  NOTIFICATIONS: 'dayvault_notifications',
  NOTIF_PREFS: 'dayvault_notif_prefs',
};

export const notificationService = {
  getNotifications: (userId: string): NotificationItem[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const all: NotificationItem[] = raw ? JSON.parse(raw) : [];
      const userNotifs = all.filter(n => n.userId === userId);
      if (userNotifs.length > 0) return userNotifs;

      // Default initial notifications if empty
      const defaults: NotificationItem[] = [
        {
          id: 'notif-1',
          userId,
          title: 'Assignment Due Tomorrow',
          message: 'C++ Pointers Assignment is due tomorrow at 11:59 PM.',
          category: 'academic',
          timestamp: '2 hours ago',
          read: false,
          type: 'assignment'
        },
        {
          id: 'notif-2',
          userId,
          title: 'Daily Record Reminder',
          message: 'Take 2 minutes to record your progress and mood for today.',
          category: 'daily',
          timestamp: '4 hours ago',
          read: false,
          type: 'daily'
        },
        {
          id: 'notif-3',
          userId,
          title: 'Study Streak Milestone',
          message: 'You have maintained a 5-day study streak! Keep up the dedication.',
          category: 'productivity',
          timestamp: '1 day ago',
          read: true,
          type: 'streak'
        }
      ];
      all.push(...defaults);
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
      return defaults;
    } catch {
      return [];
    }
  },

  markAsRead: (userId: string, notificationId: string) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const all: NotificationItem[] = raw ? JSON.parse(raw) : [];
      const updated = all.map(n => n.id === notificationId && n.userId === userId ? { ...n, read: true } : n);
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  },

  markAllAsRead: (userId: string) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const all: NotificationItem[] = raw ? JSON.parse(raw) : [];
      const updated = all.map(n => n.userId === userId ? { ...n, read: true } : n);
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  },

  clearNotifications: (userId: string) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const all: NotificationItem[] = raw ? JSON.parse(raw) : [];
      const filtered = all.filter(n => n.userId !== userId);
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(filtered));
    } catch (e) {
      console.error(e);
    }
  },

  getPreferences: (userId: string): NotificationPreferences => {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEYS.NOTIF_PREFS}_${userId}`);
      if (raw) return JSON.parse(raw);
      return {
        dailyRecordReminder: true,
        dailyRecordTime: '21:30',
        assignmentReminders: true,
        examReminders: true,
        taskReminders: true,
        habitReminders: true,
        goalReminders: true,
        studyReminders: true,
        journalReminders: true,
        weeklyReviewReminder: true,
        weeklyReviewDay: 'Sunday',
        weeklyReviewTime: '19:00',
        autoBackup: true,
      };
    } catch {
      return {
        dailyRecordReminder: true,
        dailyRecordTime: '21:30',
        assignmentReminders: true,
        examReminders: true,
        taskReminders: true,
        habitReminders: true,
        goalReminders: true,
        studyReminders: true,
        journalReminders: true,
        weeklyReviewReminder: true,
        weeklyReviewDay: 'Sunday',
        weeklyReviewTime: '19:00',
        autoBackup: true,
      };
    }
  },

  savePreferences: (userId: string, prefs: NotificationPreferences) => {
    try {
      localStorage.setItem(`${STORAGE_KEYS.NOTIF_PREFS}_${userId}`, JSON.stringify(prefs));
    } catch (e) {
      console.error(e);
    }
  }
};
