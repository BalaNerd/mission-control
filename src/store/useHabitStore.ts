import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Habit, HabitFrequency } from '@/types';
import { useUserStore } from './useUserStore';

interface HabitState {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'completedDates' | 'currentStreak' | 'longestStreak' | 'createdAt'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCompletion: (id: string, dateStr: string) => void;
  getHabitsForDate: (dateStr: string) => Habit[];
}

// Utility to calculate streak (very basic implementation for daily habits)
const calculateStreak = (completedDates: string[]): { current: number, longest: number } => {
  if (completedDates.length === 0) return { current: 0, longest: 0 };
  
  // Sort dates descending
  const sorted = [...completedDates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  let current = 0;
  let longest = 0;
  let tempStreak = 1;
  
  // Very simplistic longest streak calculation
  for (let i = 0; i < sorted.length - 1; i++) {
    const d1 = new Date(sorted[i]);
    const d2 = new Date(sorted[i+1]);
    const diffDays = Math.floor((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      tempStreak++;
    } else if (diffDays > 1) {
      longest = Math.max(longest, tempStreak);
      tempStreak = 1;
    }
  }
  longest = Math.max(longest, tempStreak, 1);

  // Check current streak (is today or yesterday in the list?)
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  if (sorted[0] === today || sorted[0] === yesterday) {
    current = tempStreak; // This is a simplification. Real streak needs accurate daily traversal from today backwards.
    // For a better current streak:
    current = 1;
    let checkDate = new Date(sorted[0]);
    for (let i = 1; i < sorted.length; i++) {
      const prevDate = new Date(checkDate.getTime() - 86400000).toISOString().split('T')[0];
      if (sorted[i] === prevDate) {
        current++;
        checkDate = new Date(prevDate);
      } else {
        break;
      }
    }
  }

  return { current, longest: Math.max(current, longest) };
};

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: [],
      
      addHabit: (habitData) => set((state) => ({
        habits: [...state.habits, {
          ...habitData,
          id: crypto.randomUUID(),
          completedDates: [],
          currentStreak: 0,
          longestStreak: 0,
          createdAt: Date.now()
        }]
      })),

      updateHabit: (id, updates) => set((state) => ({
        habits: state.habits.map((h) => h.id === id ? { ...h, ...updates } : h)
      })),

      deleteHabit: (id) => set((state) => ({
        habits: state.habits.filter((h) => h.id !== id)
      })),

      toggleHabitCompletion: (id, dateStr) => set((state) => {
        const habit = state.habits.find(h => h.id === id);
        if (habit && !habit.completedDates.includes(dateStr)) {
          useUserStore.getState().addXP(15, 'Completed Habit: ' + habit.name);
        }

        return {
          habits: state.habits.map((habit) => {
            if (habit.id === id) {
              const dates = habit.completedDates.includes(dateStr)
                ? habit.completedDates.filter(d => d !== dateStr)
                : [...habit.completedDates, dateStr];
                
              const streaks = calculateStreak(dates);
              
              return {
                ...habit,
                completedDates: dates,
                currentStreak: streaks.current,
                longestStreak: streaks.longest
              };
            }
            return habit;
          })
        };
      }),
      
      getHabitsForDate: (dateStr) => {
        const date = new Date(dateStr);
        const dayOfWeek = date.getDay(); // 0 is Sunday
        
        return get().habits.filter(habit => {
          if (habit.frequency === 'Daily') return true;
          if (habit.frequency === 'Specific Days' && habit.specificDays?.includes(dayOfWeek)) return true;
          return false;
        });
      }
    }),
    {
      name: 'mission-control-habits',
    }
  )
);
