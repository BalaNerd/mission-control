import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import confetti from 'canvas-confetti';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: number;
}

export interface DailyChallenge {
  id: string;
  description: string;
  xpReward: number;
  isCompleted: boolean;
  type: 'TASK' | 'MOCK' | 'PYQ' | 'HABIT';
  targetCount: number;
  currentCount: number;
}

interface UserState {
  xp: number;
  level: number;
  rank: string;
  studyStreak: number;
  lastStudyDate?: string;
  achievements: Achievement[];
  dailyChallenges: DailyChallenge[];
  lastChallengeDate?: string;
  
  addXP: (amount: number, reason: string) => void;
  unlockAchievement: (id: string) => void;
  updateStudyStreak: () => void;
  progressChallenge: (type: DailyChallenge['type'], amount?: number) => void;
  generateDailyChallenges: () => void;
}

const RANKS = [
  { maxLevel: 5, name: "Recruit" },
  { maxLevel: 10, name: "Cadet" },
  { maxLevel: 20, name: "Officer" },
  { maxLevel: 35, name: "Captain" },
  { maxLevel: 50, name: "Major" },
  { maxLevel: 75, name: "Commander" },
  { maxLevel: 100, name: "General" },
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_blood', name: 'First Blood', description: 'Complete your first task', icon: 'droplet', isUnlocked: false },
  { id: 'bookworm', name: 'Bookworm', description: 'Create 10 Notes', icon: 'book', isUnlocked: false },
  { id: 'sharp_shooter', name: 'Sharp Shooter', description: 'Score > 80% on a Mock Test', icon: 'target', isUnlocked: false },
  { id: 'streak_week', name: 'Consistent Soldier', description: 'Achieve a 7-day study streak', icon: 'flame', isUnlocked: false },
];

const calculateLevel = (xp: number) => {
  return Math.floor(Math.sqrt(xp / 50)) + 1;
};

const getRank = (level: number) => {
  for (const rank of RANKS) {
    if (level <= rank.maxLevel) return rank.name;
  }
  return "Legend";
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      rank: "Recruit",
      studyStreak: 0,
      achievements: INITIAL_ACHIEVEMENTS,
      dailyChallenges: [],
      
      addXP: (amount, reason) => {
        const currentXP = get().xp;
        const newXP = currentXP + amount;
        const newLevel = calculateLevel(newXP);
        const oldLevel = get().level;
        
        if (newLevel > oldLevel) {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#3B82F6', '#22C55E', '#F59E0B']
          });
        }
        
        set({
          xp: newXP,
          level: newLevel,
          rank: getRank(newLevel)
        });
        
        get().updateStudyStreak();
      },

      unlockAchievement: (id) => set((state) => {
        const achievement = state.achievements.find(a => a.id === id);
        if (achievement && !achievement.isUnlocked) {
          confetti({ particleCount: 100, spread: 60, origin: { y: 0.8 }, colors: ['#F59E0B'] });
          return {
            achievements: state.achievements.map(a => 
              a.id === id ? { ...a, isUnlocked: true, unlockedAt: Date.now() } : a
            )
          };
        }
        return state;
      }),

      updateStudyStreak: () => set((state) => {
        const today = new Date().toISOString().split('T')[0];
        if (state.lastStudyDate === today) return state; // Already studied today

        let newStreak = state.studyStreak;
        if (state.lastStudyDate) {
          const lastDate = new Date(state.lastStudyDate);
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (lastDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
            newStreak++;
          } else {
            newStreak = 1; // Streak broken
          }
        } else {
          newStreak = 1;
        }

        // Check for streak achievement
        if (newStreak === 7) get().unlockAchievement('streak_week');

        return { studyStreak: newStreak, lastStudyDate: today };
      }),

      generateDailyChallenges: () => set((state) => {
        const today = new Date().toISOString().split('T')[0];
        if (state.lastChallengeDate === today && state.dailyChallenges.length > 0) return state;

        const newChallenges: DailyChallenge[] = [
          { id: crypto.randomUUID(), description: 'Complete 3 Tasks', type: 'TASK', targetCount: 3, currentCount: 0, xpReward: 50, isCompleted: false },
          { id: crypto.randomUUID(), description: 'Solve 5 PYQs', type: 'PYQ', targetCount: 5, currentCount: 0, xpReward: 75, isCompleted: false },
          { id: crypto.randomUUID(), description: 'Check off 2 Habits', type: 'HABIT', targetCount: 2, currentCount: 0, xpReward: 40, isCompleted: false },
        ];

        return { dailyChallenges: newChallenges, lastChallengeDate: today };
      }),

      progressChallenge: (type, amount = 1) => set((state) => {
        let changed = false;
        let bonusXP = 0;

        const newChallenges = state.dailyChallenges.map(c => {
          if (c.type === type && !c.isCompleted) {
            changed = true;
            const newCount = c.currentCount + amount;
            if (newCount >= c.targetCount) {
              bonusXP += c.xpReward;
              return { ...c, currentCount: c.targetCount, isCompleted: true };
            }
            return { ...c, currentCount: newCount };
          }
          return c;
        });

        if (bonusXP > 0) {
           setTimeout(() => get().addXP(bonusXP, 'Completed Daily Challenge'), 0);
        }

        return changed ? { dailyChallenges: newChallenges } : state;
      })
    }),
    {
      name: 'mission-control-user-v2',
    }
  )
);
