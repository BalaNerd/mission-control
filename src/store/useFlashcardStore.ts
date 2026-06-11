import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Flashcard, Difficulty } from '@/types';
import { useUserStore } from './useUserStore';

interface FlashcardState {
  flashcards: Flashcard[];
  addCard: (card: Omit<Flashcard, 'id' | 'nextReviewDate' | 'interval' | 'easeFactor' | 'revisionCount' | 'createdAt'>) => void;
  updateCard: (id: string, updates: Partial<Flashcard>) => void;
  deleteCard: (id: string) => void;
  reviewCard: (id: string, performanceRating: 0 | 1 | 2 | 3 | 4 | 5) => void;
  getDueCards: () => Flashcard[];
}

export const useFlashcardStore = create<FlashcardState>()(
  persist(
    (set, get) => ({
      flashcards: [],

      addCard: (cardData) => set((state) => ({
        flashcards: [...state.flashcards, {
          ...cardData,
          id: crypto.randomUUID(),
          nextReviewDate: Date.now(),
          interval: 0,
          easeFactor: 2.5,
          revisionCount: 0,
          createdAt: Date.now(),
        }]
      })),

      updateCard: (id, updates) => set((state) => ({
        flashcards: state.flashcards.map(c => c.id === id ? { ...c, ...updates } : c)
      })),

      deleteCard: (id) => set((state) => ({
        flashcards: state.flashcards.filter(c => c.id !== id)
      })),

      // Anki-style SM-2 Algorithm implementation
      reviewCard: (id, rating) => set((state) => {
        const card = state.flashcards.find(c => c.id === id);
        if (!card) return state;

        let interval = card.interval;
        let easeFactor = card.easeFactor;
        let revisionCount = card.revisionCount;

        if (rating >= 3) {
          if (revisionCount === 0) {
            interval = 1;
          } else if (revisionCount === 1) {
            interval = 6;
          } else {
            interval = Math.round(interval * easeFactor);
          }
          revisionCount++;
          // Give XP for successful review
          useUserStore.getState().addXP(2, 'Reviewed Flashcard: ' + card.subject);
        } else {
          revisionCount = 0;
          interval = 1;
        }

        easeFactor = easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
        if (easeFactor < 1.3) easeFactor = 1.3;

        const nextReviewDate = Date.now() + interval * 24 * 60 * 60 * 1000;

        return {
          flashcards: state.flashcards.map(c => c.id === id ? {
            ...c,
            interval,
            easeFactor,
            revisionCount,
            nextReviewDate
          } : c)
        };
      }),

      getDueCards: () => {
        const now = Date.now();
        return get().flashcards.filter(c => c.nextReviewDate <= now);
      }
    }),
    {
      name: 'mission-control-flashcards',
    }
  )
);
