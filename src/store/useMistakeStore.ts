import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MistakeNote, Difficulty } from '@/types';
import { useUserStore } from './useUserStore';

interface MistakeState {
  mistakes: MistakeNote[];
  addMistake: (mistake: Omit<MistakeNote, 'id' | 'revisionCount' | 'createdAt' | 'updatedAt'>) => void;
  updateMistake: (id: string, updates: Partial<MistakeNote>) => void;
  deleteMistake: (id: string) => void;
  incrementRevision: (id: string) => void;
}

export const useMistakeStore = create<MistakeState>()(
  persist(
    (set) => ({
      mistakes: [],

      addMistake: (mistakeData) => set((state) => ({
        mistakes: [...state.mistakes, {
          ...mistakeData,
          id: crypto.randomUUID(),
          revisionCount: 0,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }]
      })),

      updateMistake: (id, updates) => set((state) => ({
        mistakes: state.mistakes.map(m => m.id === id ? { ...m, ...updates, updatedAt: Date.now() } : m)
      })),

      deleteMistake: (id) => set((state) => ({
        mistakes: state.mistakes.filter(m => m.id !== id)
      })),

      incrementRevision: (id) => set((state) => {
        const mistake = state.mistakes.find(m => m.id === id);
        if (mistake) {
          useUserStore.getState().addXP(5, 'Revised Mistake: ' + mistake.topic);
        }
        return {
          mistakes: state.mistakes.map(m => m.id === id ? { 
            ...m, 
            revisionCount: m.revisionCount + 1,
            updatedAt: Date.now() 
          } : m)
        };
      }),
    }),
    {
      name: 'mission-control-mistakes',
    }
  )
);
