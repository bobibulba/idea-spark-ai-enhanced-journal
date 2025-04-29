import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Entry } from '../types';
import { isToday, parseISO, isSameDay, isYesterday } from 'date-fns';

const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      entries: [],
      user: {
        streak: 0,
        lastEntryDate: null,
        darkMode: false,
        notificationsEnabled: true,
        notificationTime: '08:00',
      },
      currentEntry: null,
      isProcessing: false,
      
      addEntry: (entry: Entry) => {
        set((state) => ({
          entries: [entry, ...state.entries],
        }));
        get().updateStreak();
      },
      
      updateEntry: (id: string, updates: Partial<Entry>) => {
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id ? { ...entry, ...updates, updatedAt: new Date().toISOString() } : entry
          ),
        }));
      },
      
      deleteEntry: (id: string) => {
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        }));
      },
      
      setCurrentEntry: (entry: Entry | null) => {
        set({ currentEntry: entry });
      },
      
      updateUser: (updates: Partial<User>) => {
        set((state) => ({
          user: { ...state.user, ...updates },
        }));
      },
      
      toggleDarkMode: () => {
        set((state) => ({
          user: { ...state.user, darkMode: !state.user.darkMode },
        }));
      },
      
      toggleNotifications: () => {
        set((state) => ({
          user: { ...state.user, notificationsEnabled: !state.user.notificationsEnabled },
        }));
      },
      
      setNotificationTime: (time: string) => {
        set((state) => ({
          user: { ...state.user, notificationTime: time },
        }));
      },
      
      updateStreak: () => {
        set((state) => {
          const { lastEntryDate, streak } = state.user;
          const today = new Date();
          
          // If no previous entry, start streak at 1
          if (!lastEntryDate) {
            return {
              user: {
                ...state.user,
                streak: 1,
                lastEntryDate: today.toISOString(),
              },
            };
          }
          
          const lastDate = parseISO(lastEntryDate);
          
          // If already journaled today, keep streak the same
          if (isToday(lastDate)) {
            return state;
          }
          
          // If journaled yesterday, increment streak
          if (isYesterday(lastDate)) {
            return {
              user: {
                ...state.user,
                streak: streak + 1,
                lastEntryDate: today.toISOString(),
              },
            };
          }
          
          // Otherwise, reset streak to 1
          return {
            user: {
              ...state.user,
              streak: 1,
              lastEntryDate: today.toISOString(),
            },
          };
        });
      },
      
      setIsProcessing: (isProcessing: boolean) => {
        set({ isProcessing });
      },
    }),
    {
      name: 'ideaspark-storage',
    }
  )
);

export default useStore;
