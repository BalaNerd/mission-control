import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface RevisionItem {
  id: string;
  title: string; // What is being revised (Topic name, PYQ, Note)
  category: string; // 'CDS', 'AFCAT', 'Notes', etc.
  revisionsCompleted: number; // 0 to 5
  lastRevisionDate?: number;
  nextRevisionDate: number;
  createdAt: number;
}

interface RevisionState {
  items: RevisionItem[];
  addItem: (title: string, category: string) => void;
  markRevisionComplete: (id: string) => void;
  deleteItem: (id: string) => void;
}

// Spaced repetition intervals in days: 1, 3, 7, 14, 30
const SPACING = [1, 3, 7, 14, 30];

export const useRevisionStore = create<RevisionState>()(
  persist(
    (set) => ({
      items: [],
      
      addItem: (title, category) => set((state) => ({
        items: [...state.items, {
          id: crypto.randomUUID(),
          title,
          category,
          revisionsCompleted: 0,
          nextRevisionDate: Date.now() + (1000 * 60 * 60 * 24 * SPACING[0]), // Next day
          createdAt: Date.now()
        }]
      })),

      markRevisionComplete: (id) => set((state) => ({
        items: state.items.map(item => {
          if (item.id === id) {
            const nextCount = Math.min(item.revisionsCompleted + 1, 5);
            const intervalDays = nextCount < 5 ? SPACING[nextCount] : 0;
            
            return {
              ...item,
              revisionsCompleted: nextCount,
              lastRevisionDate: Date.now(),
              nextRevisionDate: intervalDays > 0 ? Date.now() + (1000 * 60 * 60 * 24 * intervalDays) : 0,
            };
          }
          return item;
        })
      })),

      deleteItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),
    }),
    {
      name: 'mission-control-revisions',
    }
  )
);
