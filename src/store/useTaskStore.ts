import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, TaskStatus } from '@/types';
import { useUserStore } from './useUserStore';

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'progressPercentage' | 'createdAt' | 'updatedAt' | 'timelineEvents'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, newStatus: TaskStatus) => void;
  toggleTaskStarred: (id: string) => void;
  addTimelineEvent: (id: string, description: string) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      
      addTask: (taskData) => set((state) => ({
        tasks: [...state.tasks, {
          ...taskData,
          id: crypto.randomUUID(),
          progressPercentage: taskData.status === 'Completed' ? 100 : 0,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          timelineEvents: [{ date: Date.now(), description: 'Task created' }],
          completedAt: taskData.status === 'Completed' ? Date.now() : undefined,
        }]
      })),

      updateTask: (id, updates) => set((state) => {
        return {
          tasks: state.tasks.map((task) => {
            if (task.id === id) {
              const updatedTask = { ...task, ...updates, updatedAt: Date.now() };
              
              // Handle completion specific logic
              if (updates.status === 'Completed' && task.status !== 'Completed') {
                updatedTask.progressPercentage = 100;
                updatedTask.completedAt = Date.now();
                updatedTask.timelineEvents = [
                  ...(task.timelineEvents || []), 
                  { date: Date.now(), description: 'Task marked as Completed' }
                ];
                useUserStore.getState().addXP(10, 'Completed Task: ' + task.title);
              } else if (updates.status && updates.status !== 'Completed' && task.status === 'Completed') {
                // Task was uncompleted
                updatedTask.completedAt = undefined;
                updatedTask.timelineEvents = [
                  ...(task.timelineEvents || []), 
                  { date: Date.now(), description: `Task status changed to ${updates.status}` }
                ];
              }

              return updatedTask;
            }
            return task;
          })
        };
      }),

      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id)
      })),

      moveTask: (id, newStatus) => set((state) => {
        const task = state.tasks.find(t => t.id === id);
        
        if (task && task.status !== 'Completed' && newStatus === 'Completed') {
          useUserStore.getState().addXP(10, 'Completed Task: ' + task.title);
        }
        
        return {
          tasks: state.tasks.map((task) => {
            if (task.id === id) {
              return { 
                ...task, 
                status: newStatus, 
                progressPercentage: newStatus === 'Completed' ? 100 : task.progressPercentage,
                updatedAt: Date.now(),
                completedAt: newStatus === 'Completed' ? Date.now() : undefined,
                timelineEvents: [
                  ...(task.timelineEvents || []),
                  { date: Date.now(), description: `Moved to ${newStatus}` }
                ]
              };
            }
            return task;
          })
        };
      }),

      toggleTaskStarred: (id) => set((state) => ({
        tasks: state.tasks.map((task) => 
          task.id === id ? { ...task, isStarred: !task.isStarred, updatedAt: Date.now() } : task
        )
      })),

      addTimelineEvent: (id, description) => set((state) => ({
        tasks: state.tasks.map((task) => 
          task.id === id ? { 
            ...task, 
            timelineEvents: [...(task.timelineEvents || []), { date: Date.now(), description }]
          } : task
        )
      })),
    }),
    {
      name: 'mission-control-tasks',
    }
  )
);
