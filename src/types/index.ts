export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Missed' | 'Cancelled' | 'Archived' | 'Deferred';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  category?: string;
  tags: string[];
  dueDate?: string; // ISO format YYYY-MM-DD
  dueTime?: string; // HH:mm format
  estimatedDuration?: number; // in minutes
  status: TaskStatus;
  subtasks: Subtask[];
  progressPercentage: number;
  isRecurring: boolean;
  color?: string;
  isStarred: boolean;
  isPinned: boolean;
  createdAt: number;
  updatedAt: number;
  completedAt?: number; // For completion history
  dependencies?: string[]; // Array of Task IDs that must be completed first
  timelineEvents?: { date: number, description: string }[];
}

export interface Note {
  id: string;
  title: string;
  content: string; // HTML or Markdown
  tags: string[];
  category?: string;
  folderId?: string; // Supports nested folders
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
  fileIds?: string[]; // References to stored files via idb-keyval
}

export interface NoteFolder {
  id: string;
  name: string;
  parentId?: string; // For nested hierarchy
  createdAt: number;
}

// Goal Tracking Types

export interface Milestone {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: Priority;
  targetDate?: string;
  milestones: Milestone[];
  progressPercentage: number;
  status: TaskStatus;
  createdAt: number;
  updatedAt: number;
}

// Habit Tracking Types

export type HabitFrequency = 'Daily' | 'Weekly' | 'Specific Days';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: string;
  frequency: HabitFrequency;
  specificDays?: number[]; // 0 for Sunday, 1 for Monday, etc.
  completedDates: string[]; // Array of YYYY-MM-DD strings
  currentStreak: number;
  longestStreak: number;
  createdAt: number;
}

// Exam Preparation Types

export interface Subtopic {
  id: string;
  name: string;
  isCompleted: boolean;
}

export interface ExamTopic {
  id: string;
  subjectId: string;
  name: string;
  difficulty: Difficulty;
  isBookmarked: boolean;
  subtopics: Subtopic[];
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface ExamSubject {
  id: string;
  examId: string;
  name: string;
}
// --- Flashcard System ---
export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  subject: string;
  topic?: string;
  tags: string[];
  difficulty: Difficulty;
  nextReviewDate: number;
  interval: number; // in days
  easeFactor: number;
  revisionCount: number;
  createdAt: number;
}

// --- Mistake Notebook ---
export interface MistakeNote {
  id: string;
  question: string;
  mistakeMade: string;
  correctMethod: string;
  subject: string;
  topic?: string;
  source: string; // e.g., "Mock Test 1", "PYQ 2023"
  difficulty: Difficulty;
  revisionCount: number;
  createdAt: number;
  updatedAt: number;
}

// --- Current Affairs ---
export type CurrentAffairsCategory = 'Daily' | 'Weekly' | 'Monthly';
export type CurrentAffairsTag = 'Defence' | 'National' | 'International' | 'Economy' | 'Science';

export interface CurrentAffairsArticle {
  id: string;
  title: string;
  content: string;
  date: string; // YYYY-MM-DD
  category: CurrentAffairsCategory;
  tags: CurrentAffairsTag[];
  isBookmarked: boolean;
  notes?: string;
  createdAt: number;
}
export interface Exam {
  id: string;
  name: string; // e.g., 'CDS', 'AFCAT', 'CAPF'
  targetDate?: string;
}

export interface PYQ {
  id: string;
  examName: string;
  year: string;
  subject: string;
  topic: string;
  subtopic?: string;
  difficulty: Difficulty;
  isSolved: boolean;
  mistakesMade?: string;
  notes?: string;
  revisionRequired: boolean;
  revisionCount: number;
  fileIds?: string[]; // References to stored files via idb-keyval
}

export interface MockTest {
  id: string;
  testName: string;
  examType: string;
  date: string;
  score: number;
  totalScore: number;
  accuracyPercentage: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeTaken: number; // in minutes
  rank?: number;
  weakAreas: string[];
  strongAreas: string[];
  remarks?: string;
}
