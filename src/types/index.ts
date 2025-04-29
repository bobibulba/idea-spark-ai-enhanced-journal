export interface Entry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  mood?: string;
  tags: string[];
  aiQuestions: {
    question: string;
    answer: string;
  }[];
  actionableSteps: {
    task: string;
    completed: boolean;
  }[];
}

export interface User {
  streak: number;
  lastEntryDate: string | null;
  darkMode: boolean;
  notificationsEnabled: boolean;
  notificationTime: string;
}

export type Mood = 
  | 'Inspired'
  | 'Excited'
  | 'Focused'
  | 'Curious'
  | 'Neutral'
  | 'Confused'
  | 'Frustrated'
  | 'Tired';

export interface AppState {
  entries: Entry[];
  user: User;
  currentEntry: Entry | null;
  isProcessing: boolean;
  addEntry: (entry: Entry) => void;
  updateEntry: (id: string, updates: Partial<Entry>) => void;
  deleteEntry: (id: string) => void;
  setCurrentEntry: (entry: Entry | null) => void;
  updateUser: (updates: Partial<User>) => void;
  toggleDarkMode: () => void;
  toggleNotifications: () => void;
  setNotificationTime: (time: string) => void;
  updateStreak: () => void;
  setIsProcessing: (isProcessing: boolean) => void;
}
