import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ExamTopic, PYQ, MockTest, Difficulty } from '@/types';
import { useUserStore } from './useUserStore';

// Pre-defined subjects for exams
export const EXAM_SUBJECTS = {
  CDS: ['English', 'General Knowledge', 'Elementary Mathematics'],
  AFCAT: ['General Awareness', 'Verbal Ability in English', 'Numerical Ability', 'Reasoning and Military Aptitude'],
  CAPF: ['General Ability and Intelligence', 'General Studies, Essay and Comprehension']
};

interface ExamState {
  topics: ExamTopic[];
  pyqs: PYQ[];
  mockTests: MockTest[];
  
  // Topic Actions
  addTopic: (examId: string, subjectId: string, name: string, difficulty?: Difficulty) => void;
  updateTopic: (id: string, updates: Partial<ExamTopic>) => void;
  deleteTopic: (id: string) => void;
  toggleSubtopic: (topicId: string, subtopicId: string) => void;
  addSubtopic: (topicId: string, name: string) => void;
  
  // PYQ Actions
  addPYQ: (pyq: Omit<PYQ, 'id' | 'revisionCount' | 'fileIds'>) => void;
  updatePYQ: (id: string, updates: Partial<PYQ>) => void;
  deletePYQ: (id: string) => void;
  addFileToPYQ: (pyqId: string, fileId: string) => void;
  removeFileFromPYQ: (pyqId: string, fileId: string) => void;
  
  // Mock Test Actions
  addMockTest: (mockTest: Omit<MockTest, 'id'>) => void;
  updateMockTest: (id: string, updates: Partial<MockTest>) => void;
  deleteMockTest: (id: string) => void;
}

export const useExamStore = create<ExamState>()(
  persist(
    (set) => ({
      topics: [],
      pyqs: [],
      mockTests: [],
      
      // Topic Actions
      addTopic: (examId, subjectId, name, difficulty = 'Medium') => set((state) => {
        const newTopic: ExamTopic = {
          id: crypto.randomUUID(),
          subjectId: `${examId}-${subjectId}`,
          name,
          difficulty,
          isBookmarked: false,
          subtopics: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        return { topics: [...state.topics, newTopic] };
      }),
      
      updateTopic: (id, updates) => set((state) => ({
        topics: state.topics.map((t) => t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t)
      })),
      
      deleteTopic: (id) => set((state) => ({
        topics: state.topics.filter((t) => t.id !== id)
      })),
      
      toggleSubtopic: (topicId, subtopicId) => set((state) => ({
        topics: state.topics.map((t) => {
          if (t.id === topicId) {
            return {
              ...t,
              subtopics: t.subtopics.map(st => st.id === subtopicId ? { ...st, isCompleted: !st.isCompleted } : st),
              updatedAt: Date.now()
            };
          }
          return t;
        })
      })),
      
      addSubtopic: (topicId, name) => set((state) => ({
        topics: state.topics.map((t) => {
          if (t.id === topicId) {
            return {
              ...t,
              subtopics: [...t.subtopics, { id: crypto.randomUUID(), name, isCompleted: false }],
              updatedAt: Date.now()
            };
          }
          return t;
        })
      })),

      // PYQ Actions
      addPYQ: (pyqData) => set((state) => {
        if (pyqData.isSolved) {
          useUserStore.getState().addXP(5, 'Solved PYQ: ' + pyqData.topic);
        }
        return {
          pyqs: [...state.pyqs, { 
            ...pyqData, 
            id: crypto.randomUUID(),
            revisionCount: 0,
            fileIds: []
          }]
        };
      }),
      
      updatePYQ: (id, updates) => set((state) => {
        const pyq = state.pyqs.find(p => p.id === id);
        if (pyq && !pyq.isSolved && updates.isSolved) {
          useUserStore.getState().addXP(5, 'Solved PYQ: ' + pyq.topic);
        }
        return {
          pyqs: state.pyqs.map((p) => p.id === id ? { ...p, ...updates } : p)
        };
      }),
      
      deletePYQ: (id) => set((state) => ({
        pyqs: state.pyqs.filter((p) => p.id !== id)
      })),

      addFileToPYQ: (pyqId, fileId) => set((state) => ({
        pyqs: state.pyqs.map((p) => 
          p.id === pyqId ? { ...p, fileIds: [...(p.fileIds || []), fileId] } : p
        )
      })),

      removeFileFromPYQ: (pyqId, fileId) => set((state) => ({
        pyqs: state.pyqs.map((p) => 
          p.id === pyqId ? { ...p, fileIds: (p.fileIds || []).filter(id => id !== fileId) } : p
        )
      })),

      // Mock Test Actions
      addMockTest: (mockTestData) => set((state) => {
        useUserStore.getState().addXP(50, 'Completed Mock Test: ' + mockTestData.testName);
        return {
          mockTests: [...state.mockTests, { ...mockTestData, id: crypto.randomUUID() }]
        };
      }),
      
      updateMockTest: (id, updates) => set((state) => ({
        mockTests: state.mockTests.map((m) => m.id === id ? { ...m, ...updates } : m)
      })),
      
      deleteMockTest: (id) => set((state) => ({
        mockTests: state.mockTests.filter((m) => m.id !== id)
      })),
    }),
    {
      name: 'mission-control-exams',
    }
  )
);
