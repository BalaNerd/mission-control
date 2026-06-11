import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Goal, Milestone, TaskStatus } from '@/types';

interface GoalState {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'milestones' | 'progressPercentage' | 'status' | 'createdAt' | 'updatedAt'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addMilestone: (goalId: string, title: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  deleteMilestone: (goalId: string, milestoneId: string) => void;
}

export const useGoalStore = create<GoalState>()(
  persist(
    (set) => ({
      goals: [],
      
      addGoal: (goalData) => set((state) => ({
        goals: [...state.goals, {
          ...goalData,
          id: crypto.randomUUID(),
          milestones: [],
          progressPercentage: 0,
          status: 'Pending',
          createdAt: Date.now(),
          updatedAt: Date.now()
        }]
      })),

      updateGoal: (id, updates) => set((state) => ({
        goals: state.goals.map((g) => g.id === id ? { ...g, ...updates, updatedAt: Date.now() } : g)
      })),

      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter((g) => g.id !== id)
      })),

      addMilestone: (goalId, title) => set((state) => ({
        goals: state.goals.map((g) => {
          if (g.id === goalId) {
            const newMilestones = [...g.milestones, { id: crypto.randomUUID(), title, isCompleted: false }];
            const completedCount = newMilestones.filter(m => m.isCompleted).length;
            const progressPercentage = Math.round((completedCount / newMilestones.length) * 100);
            
            return {
              ...g,
              milestones: newMilestones,
              progressPercentage,
              status: progressPercentage === 100 ? 'Completed' : g.status === 'Completed' ? 'In Progress' : g.status,
              updatedAt: Date.now()
            };
          }
          return g;
        })
      })),

      toggleMilestone: (goalId, milestoneId) => set((state) => ({
        goals: state.goals.map((g) => {
          if (g.id === goalId) {
            const newMilestones = g.milestones.map(m => m.id === milestoneId ? { ...m, isCompleted: !m.isCompleted } : m);
            const completedCount = newMilestones.filter(m => m.isCompleted).length;
            const progressPercentage = Math.round((completedCount / newMilestones.length) * 100);
            
            return {
              ...g,
              milestones: newMilestones,
              progressPercentage,
              status: progressPercentage === 100 ? 'Completed' : progressPercentage > 0 ? 'In Progress' : 'Pending',
              updatedAt: Date.now()
            };
          }
          return g;
        })
      })),

      deleteMilestone: (goalId, milestoneId) => set((state) => ({
        goals: state.goals.map((g) => {
          if (g.id === goalId) {
            const newMilestones = g.milestones.filter(m => m.id !== milestoneId);
            const completedCount = newMilestones.filter(m => m.isCompleted).length;
            const progressPercentage = newMilestones.length > 0 ? Math.round((completedCount / newMilestones.length) * 100) : 0;
            
            return {
              ...g,
              milestones: newMilestones,
              progressPercentage,
              status: progressPercentage === 100 && newMilestones.length > 0 ? 'Completed' : progressPercentage > 0 ? 'In Progress' : 'Pending',
              updatedAt: Date.now()
            };
          }
          return g;
        })
      })),
    }),
    {
      name: 'mission-control-goals',
    }
  )
);
