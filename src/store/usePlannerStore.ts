import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TimeBlock {
  id: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  activity: string;
  type: 'Focus' | 'Break' | 'Meeting' | 'Study' | 'Other';
}

export interface DailyPlan {
  date: string; // YYYY-MM-DD
  priorities: string[]; // Max 3
  morningPlan: string;
  afternoonPlan: string;
  eveningPlan: string;
  nightReview: {
    reflection: string;
    productivityScore: number; // 1-10
  };
  timeBlocks: TimeBlock[];
}

interface PlannerState {
  plans: Record<string, DailyPlan>;
  getPlanByDate: (date: string) => DailyPlan;
  updatePlan: (date: string, updates: Partial<DailyPlan>) => void;
  updateNightReview: (date: string, updates: Partial<DailyPlan['nightReview']>) => void;
  addTimeBlock: (date: string, block: Omit<TimeBlock, 'id'>) => void;
  removeTimeBlock: (date: string, blockId: string) => void;
}

const getDefaultPlan = (date: string): DailyPlan => ({
  date,
  priorities: ['', '', ''],
  morningPlan: '',
  afternoonPlan: '',
  eveningPlan: '',
  nightReview: {
    reflection: '',
    productivityScore: 5,
  },
  timeBlocks: [],
});

export const usePlannerStore = create<PlannerState>()(
  persist(
    (set, get) => ({
      plans: {},
      
      getPlanByDate: (date) => {
        return get().plans[date] || getDefaultPlan(date);
      },
      
      updatePlan: (date, updates) => set((state) => ({
        plans: {
          ...state.plans,
          [date]: {
            ...(state.plans[date] || getDefaultPlan(date)),
            ...updates,
          }
        }
      })),

      updateNightReview: (date, updates) => set((state) => {
        const plan = state.plans[date] || getDefaultPlan(date);
        return {
          plans: {
            ...state.plans,
            [date]: {
              ...plan,
              nightReview: {
                ...plan.nightReview,
                ...updates,
              }
            }
          }
        };
      }),

      addTimeBlock: (date, blockData) => set((state) => {
        const plan = state.plans[date] || getDefaultPlan(date);
        const newBlock: TimeBlock = {
          ...blockData,
          id: crypto.randomUUID(),
        };
        return {
          plans: {
            ...state.plans,
            [date]: {
              ...plan,
              timeBlocks: [...plan.timeBlocks, newBlock].sort((a, b) => a.startTime.localeCompare(b.startTime)),
            }
          }
        };
      }),

      removeTimeBlock: (date, blockId) => set((state) => {
        const plan = state.plans[date];
        if (!plan) return state;
        return {
          plans: {
            ...state.plans,
            [date]: {
              ...plan,
              timeBlocks: plan.timeBlocks.filter(b => b.id !== blockId),
            }
          }
        };
      }),
    }),
    {
      name: 'mission-control-planner',
    }
  )
);
