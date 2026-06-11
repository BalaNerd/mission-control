import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Note, NoteFolder } from '@/types';

interface NoteState {
  notes: Note[];
  folders: NoteFolder[];
  activeNoteId: string | null;
  activeFolderId: string | null;
  
  // Note actions
  addNote: (folderId?: string) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setActiveNote: (id: string | null) => void;
  toggleFavorite: (id: string) => void;
  addFileToNote: (noteId: string, fileId: string) => void;
  removeFileFromNote: (noteId: string, fileId: string) => void;

  // Folder actions
  addFolder: (name: string, parentId?: string) => void;
  updateFolder: (id: string, name: string) => void;
  deleteFolder: (id: string) => void;
  setActiveFolder: (id: string | null) => void;
}

export const useNoteStore = create<NoteState>()(
  persist(
    (set) => ({
      notes: [],
      folders: [],
      activeNoteId: null,
      activeFolderId: null,
      
      addNote: (folderId) => set((state) => {
        const newNote: Note = {
          id: crypto.randomUUID(),
          title: 'Untitled Note',
          content: '',
          tags: [],
          isFavorite: false,
          folderId: folderId || state.activeFolderId || undefined,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          fileIds: [],
        };
        return { 
          notes: [newNote, ...state.notes],
          activeNoteId: newNote.id
        };
      }),

      updateNote: (id, updates) => set((state) => ({
        notes: state.notes.map((note) => 
          note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note
        )
      })),

      deleteNote: (id) => set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
        activeNoteId: state.activeNoteId === id ? null : state.activeNoteId
      })),

      setActiveNote: (id) => set({ activeNoteId: id }),

      toggleFavorite: (id) => set((state) => ({
        notes: state.notes.map((note) => 
          note.id === id ? { ...note, isFavorite: !note.isFavorite, updatedAt: Date.now() } : note
        )
      })),

      addFileToNote: (noteId, fileId) => set((state) => ({
        notes: state.notes.map((note) => 
          note.id === noteId ? { 
            ...note, 
            fileIds: [...(note.fileIds || []), fileId], 
            updatedAt: Date.now() 
          } : note
        )
      })),

      removeFileFromNote: (noteId, fileId) => set((state) => ({
        notes: state.notes.map((note) => 
          note.id === noteId ? { 
            ...note, 
            fileIds: (note.fileIds || []).filter(id => id !== fileId), 
            updatedAt: Date.now() 
          } : note
        )
      })),

      addFolder: (name, parentId) => set((state) => ({
        folders: [...state.folders, {
          id: crypto.randomUUID(),
          name,
          parentId,
          createdAt: Date.now()
        }]
      })),

      updateFolder: (id, name) => set((state) => ({
        folders: state.folders.map(f => f.id === id ? { ...f, name } : f)
      })),

      deleteFolder: (id) => set((state) => ({
        folders: state.folders.filter(f => f.id !== id),
        // If we delete a folder, its notes get moved to root
        notes: state.notes.map(n => n.folderId === id ? { ...n, folderId: undefined } : n),
        activeFolderId: state.activeFolderId === id ? null : state.activeFolderId
      })),

      setActiveFolder: (id) => set({ activeFolderId: id }),
    }),
    {
      name: 'mission-control-notes-v2',
    }
  )
);
