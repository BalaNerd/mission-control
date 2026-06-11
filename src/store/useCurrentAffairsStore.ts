import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CurrentAffairsArticle } from '@/types';
import { useUserStore } from './useUserStore';

interface CurrentAffairsState {
  articles: CurrentAffairsArticle[];
  addArticle: (article: Omit<CurrentAffairsArticle, 'id' | 'createdAt'>) => void;
  updateArticle: (id: string, updates: Partial<CurrentAffairsArticle>) => void;
  deleteArticle: (id: string) => void;
  toggleBookmark: (id: string) => void;
}

export const useCurrentAffairsStore = create<CurrentAffairsState>()(
  persist(
    (set) => ({
      articles: [],

      addArticle: (articleData) => set((state) => ({
        articles: [...state.articles, {
          ...articleData,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
        }]
      })),

      updateArticle: (id, updates) => set((state) => ({
        articles: state.articles.map(a => a.id === id ? { ...a, ...updates } : a)
      })),

      deleteArticle: (id) => set((state) => ({
        articles: state.articles.filter(a => a.id !== id)
      })),

      toggleBookmark: (id) => set((state) => ({
        articles: state.articles.map(a => a.id === id ? { ...a, isBookmarked: !a.isBookmarked } : a)
      })),
    }),
    {
      name: 'mission-control-current-affairs',
    }
  )
);
