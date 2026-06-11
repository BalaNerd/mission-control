import { create } from 'zustand';
import { set, get, del, keys } from 'idb-keyval';

export interface StoredFile {
  id: string;
  name: string;
  type: string;
  size: number;
  createdAt: number;
  relatedEntityId?: string; // e.g. Note ID or PYQ ID
}

interface FileState {
  files: StoredFile[];
  isLoading: boolean;
  loadFiles: () => Promise<void>;
  saveFile: (file: File, relatedEntityId?: string) => Promise<string>;
  getFile: (id: string) => Promise<Blob | undefined>;
  deleteFile: (id: string) => Promise<void>;
}

export const useFileStore = create<FileState>((setFn, getFn) => ({
  files: [],
  isLoading: true,

  loadFiles: async () => {
    try {
      const fileKeys = await keys();
      const metadataList: StoredFile[] = [];
      
      for (const key of fileKeys) {
        if (typeof key === 'string' && key.startsWith('file_meta_')) {
          const meta = await get(key);
          if (meta) metadataList.push(meta);
        }
      }
      
      setFn({ files: metadataList.sort((a, b) => b.createdAt - a.createdAt), isLoading: false });
    } catch (error) {
      console.error("Failed to load files from IndexedDB", error);
      setFn({ isLoading: false });
    }
  },

  saveFile: async (file: File, relatedEntityId?: string) => {
    const id = crypto.randomUUID();
    const meta: StoredFile = {
      id,
      name: file.name,
      type: file.type,
      size: file.size,
      createdAt: Date.now(),
      relatedEntityId,
    };

    try {
      await set(`file_data_${id}`, file);
      await set(`file_meta_${id}`, meta);
      
      setFn(state => ({ files: [meta, ...state.files] }));
      return id;
    } catch (error) {
      console.error("Failed to save file to IndexedDB", error);
      throw error;
    }
  },

  getFile: async (id: string) => {
    try {
      return await get<Blob>(`file_data_${id}`);
    } catch (error) {
      console.error("Failed to retrieve file from IndexedDB", id, error);
      return undefined;
    }
  },

  deleteFile: async (id: string) => {
    try {
      await del(`file_data_${id}`);
      await del(`file_meta_${id}`);
      
      setFn(state => ({
        files: state.files.filter(f => f.id !== id)
      }));
    } catch (error) {
      console.error("Failed to delete file from IndexedDB", id, error);
    }
  }
}));
