import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  // General
  username: string;
  email: string;
  timeFormat: '12h' | '24h';
  
  // Appearance
  theme: 'dark' | 'light' | 'system';
  accentColor: string;
  
  // Notifications
  dailyReminders: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  
  // Study
  pomodoroWorkDuration: number;
  pomodoroBreakDuration: number;
  dailyStudyGoal: number; // hours
  
  // Actions
  updateSettings: (updates: Partial<Omit<SettingsState, 'updateSettings'>>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      username: 'User',
      email: '',
      timeFormat: '12h',
      theme: 'dark',
      accentColor: '#3B82F6',
      dailyReminders: true,
      pushNotifications: true,
      emailNotifications: false,
      pomodoroWorkDuration: 25,
      pomodoroBreakDuration: 5,
      dailyStudyGoal: 6,
      
      updateSettings: (updates) => set((state) => ({ ...state, ...updates })),
    }),
    {
      name: 'mission-control-settings',
    }
  )
);
