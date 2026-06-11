"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { 
  Trophy, Star, Flame, Target, Zap, Shield, Crown, Medal,
  CheckCircle2, Clock, PlayCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function GamificationProfilePage() {
  const { 
    xp, level, rank, studyStreak, achievements, dailyChallenges, 
    generateDailyChallenges, progressChallenge 
  } = useUserStore();
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    generateDailyChallenges();
  }, [generateDailyChallenges]);

  if (!mounted) return null;

  // Calculate XP needed for next level
  // level = Math.floor(Math.sqrt(xp / 50)) + 1
  // => (level - 1) = sqrt(xp/50) => (level-1)^2 * 50 = xp for CURRENT level
  // nextLevel XP = (level)^2 * 50
  const currentLevelXP = Math.pow(level - 1, 2) * 50;
  const nextLevelXP = Math.pow(level, 2) * 50;
  const xpIntoLevel = xp - currentLevelXP;
  const xpRequiredForLevel = nextLevelXP - currentLevelXP;
  const progressPercentage = Math.min(100, Math.max(0, (xpIntoLevel / xpRequiredForLevel) * 100));

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-24">
      
      {/* OS Profile Header Card */}
      <div className="glass-card rounded-3xl p-6 md:p-10 border border-primary/20 relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute -right-20 -top-20 opacity-5 pointer-events-none">
          <Shield className="w-96 h-96" />
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-primary bg-card flex items-center justify-center shadow-xl shadow-primary/20">
              <Crown className="w-16 h-16 text-primary" />
            </div>
            <div className="absolute -bottom-3 -right-3 bg-accent text-foreground px-4 py-1 rounded-full text-xs font-bold border border-border shadow-md flex items-center gap-1">
              <Flame className="w-3 h-3 text-warning" /> {studyStreak} Day Streak
            </div>
          </div>

          <div className="flex-1 text-center md:text-left w-full">
            <h1 className="text-3xl md:text-4xl font-black mb-1 flex items-center justify-center md:justify-start gap-3">
              Commander
              <span className="text-xl bg-primary/10 text-primary px-3 py-1 rounded-lg border border-primary/20 font-bold tracking-widest uppercase">
                {rank}
              </span>
            </h1>
            <p className="text-muted-foreground mb-6">OS Operator Level {level}</p>

            <div className="space-y-2 max-w-md mx-auto md:mx-0">
              <div className="flex items-center justify-between text-sm font-bold">
                <span>{xpIntoLevel} XP</span>
                <span className="text-muted-foreground">Next Level: {xpRequiredForLevel} XP</span>
              </div>
              <div className="h-4 w-full bg-accent rounded-full overflow-hidden border border-border/50 p-0.5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full"
                />
              </div>
              <p className="text-xs text-muted-foreground text-right mt-1">Total Lifetime XP: {xp}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Daily Challenges */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-6 h-6 text-warning" />
            <h2 className="text-2xl font-bold tracking-tight">Daily Ops</h2>
          </div>
          
          <div className="grid gap-3">
            {dailyChallenges.map(challenge => (
              <div key={challenge.id} className={cn(
                "glass-card rounded-2xl p-4 border transition-all flex flex-col gap-3",
                challenge.isCompleted ? "border-success/30 bg-success/5" : "border-border/50 bg-card/30"
              )}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      challenge.isCompleted ? "bg-success/20 text-success" : "bg-accent text-muted-foreground"
                    )}>
                      {challenge.isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{challenge.description}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wider font-semibold">
                        Reward: <span className="text-primary">+{challenge.xpReward} XP</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-xs font-bold bg-background border border-border px-2 py-1 rounded text-muted-foreground">
                      {challenge.currentCount} / {challenge.targetCount}
                    </span>
                  </div>
                </div>

                {/* Progress Bar Mini */}
                <div className="h-1.5 w-full bg-accent rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(challenge.currentCount / challenge.targetCount) * 100}%` }}
                    className={cn(
                      "h-full rounded-full",
                      challenge.isCompleted ? "bg-success" : "bg-primary"
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Showcase */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">Service Medals</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {achievements.map(achievement => (
              <div 
                key={achievement.id}
                className={cn(
                  "glass-card rounded-2xl p-4 border transition-all flex flex-col items-center text-center gap-2",
                  achievement.isUnlocked 
                    ? "border-primary/30 bg-gradient-to-b from-primary/5 to-transparent shadow-sm" 
                    : "border-border/50 bg-card/10 opacity-60 grayscale"
                )}
              >
                <div className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center mb-1",
                  achievement.isUnlocked ? "bg-primary/20 text-primary shadow-inner" : "bg-accent text-muted-foreground"
                )}>
                  {achievement.icon === 'droplet' && <Zap className="w-6 h-6" />}
                  {achievement.icon === 'book' && <Star className="w-6 h-6" />}
                  {achievement.icon === 'target' && <Target className="w-6 h-6" />}
                  {achievement.icon === 'flame' && <Flame className="w-6 h-6" />}
                  {!['droplet', 'book', 'target', 'flame'].includes(achievement.icon) && <Medal className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight">{achievement.name}</h4>
                  <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
