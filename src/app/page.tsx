"use client";

import { useTaskStore } from "@/store/useTaskStore";
import { useHabitStore } from "@/store/useHabitStore";
import { useGoalStore } from "@/store/useGoalStore";
import { useExamStore } from "@/store/useExamStore";
import { CheckCircle2, Circle, Flame, Target, Trophy, Clock, Zap, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { tasks } = useTaskStore();
  const { habits } = useHabitStore();
  const { goals } = useGoalStore();
  const { mockTests, topics } = useExamStore();

  if (!mounted) return null;

  // Task Stats
  const pendingTasks = tasks.filter(t => t.status === "Pending" || t.status === "In Progress");
  const completedTasks = tasks.filter(t => t.status === "Completed");
  const urgentTasks = pendingTasks.filter(t => t.priority === "Critical" || t.priority === "High").slice(0, 3);

  // Habit Stats
  const activeHabits = habits.length;
  const bestStreak = Math.max(...habits.map(h => h.currentStreak), 0);

  // Goal Stats
  const inProgressGoals = goals.filter(g => g.status !== "Completed");

  // Exam Stats
  const avgMockScore = mockTests.length > 0 ? Math.round(mockTests.reduce((acc, m) => acc + m.score, 0) / mockTests.length) : 0;
  const totalSubtopics = topics.reduce((acc, t) => acc + t.subtopics.length, 0);
  const completedSubtopics = topics.reduce((acc, t) => acc + t.subtopics.filter(st => st.isCompleted).length, 0);
  const syllabusProgress = totalSubtopics > 0 ? Math.round((completedSubtopics / totalSubtopics) * 100) : 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const habitsForToday = habits.filter(h => h.frequency === 'Daily');

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your mission overview.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium">
          <div className="bg-card border border-border px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm">
            <CalendarIcon className="h-4 w-4 text-primary" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-primary flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Active Tasks</span>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"><CheckCircle2 className="h-4 w-4" /></div>
          </div>
          <div className="flex items-end gap-2">
            <h2 className="text-3xl font-bold">{pendingTasks.length}</h2>
            <span className="text-xs text-muted-foreground mb-1">pending</span>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-orange-500 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Best Streak</span>
            <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500"><Flame className="h-4 w-4" /></div>
          </div>
          <div className="flex items-end gap-2">
            <h2 className="text-3xl font-bold">{bestStreak}</h2>
            <span className="text-xs text-muted-foreground mb-1">days</span>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border-l-4 border-l-success flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Syllabus Progress</span>
            <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center text-success"><BookOpen className="h-4 w-4" /></div>
          </div>
          <div className="flex items-end gap-2">
            <h2 className="text-3xl font-bold">{syllabusProgress}%</h2>
            <span className="text-xs text-muted-foreground mb-1">completed</span>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border-l-4 border-l-blue-500 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Avg Mock Score</span>
            <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500"><Trophy className="h-4 w-4" /></div>
          </div>
          <div className="flex items-end gap-2">
            <h2 className="text-3xl font-bold">{avgMockScore}</h2>
            <span className="text-xs text-muted-foreground mb-1">points</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Active Goals */}
          <div className="glass-card rounded-xl border border-border p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> Active Goals</h2>
              <Link href="/goals" className="text-xs font-medium text-primary hover:underline">View All</Link>
            </div>
            <div className="flex flex-col gap-3">
              {inProgressGoals.length === 0 ? (
                <div className="text-center py-6 text-sm text-muted-foreground border border-dashed rounded-lg">No active goals. Time to set some!</div>
              ) : (
                inProgressGoals.slice(0, 3).map(goal => (
                  <div key={goal.id} className="bg-background/50 border border-border/50 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-sm line-clamp-1">{goal.title}</h3>
                      <span className="text-xs font-bold text-muted-foreground">{goal.progressPercentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-accent rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-500" style={{ width: `${goal.progressPercentage}%` }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Urgent Tasks */}
          <div className="glass-card rounded-xl border border-border p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2"><Zap className="h-5 w-5 text-warning" /> Urgent Tasks</h2>
              <Link href="/tasks" className="text-xs font-medium text-primary hover:underline">Go to Tasks</Link>
            </div>
            <div className="flex flex-col gap-2">
              {urgentTasks.length === 0 ? (
                <div className="text-center py-6 text-sm text-muted-foreground border border-dashed rounded-lg">No urgent tasks. You're chilling!</div>
              ) : (
                urgentTasks.map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-3 bg-background/50 border border-border/50 rounded-lg hover:border-border transition-colors">
                    <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{task.title}</h4>
                      {task.dueDate && <span className="text-xs text-danger flex items-center gap-1 mt-0.5"><Clock className="h-3 w-3" /> Due: {task.dueDate}</span>}
                    </div>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex-shrink-0",
                      task.priority === 'Critical' ? "bg-danger/10 text-danger" : "bg-orange-500/10 text-orange-500"
                    )}>
                      {task.priority}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Today's Habits */}
          <div className="glass-card rounded-xl border border-border p-5 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2"><Flame className="h-5 w-5 text-orange-500" /> Today's Habits</h2>
              <Link href="/habits" className="text-xs font-medium text-primary hover:underline">Manage</Link>
            </div>
            
            <div className="flex-1 flex flex-col gap-3">
              {habitsForToday.length === 0 ? (
                <div className="text-center py-10 text-sm text-muted-foreground flex-1 flex flex-col items-center justify-center">
                  <Flame className="h-8 w-8 text-muted-foreground/30 mb-2" />
                  No habits tracked for today.
                </div>
              ) : (
                habitsForToday.map(habit => {
                  const isCompleted = habit.completedDates.includes(todayStr);
                  return (
                    <div key={habit.id} className="flex items-center justify-between p-3 bg-background/50 border border-border/50 rounded-lg">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium line-clamp-1">{habit.name}</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Flame className={cn("h-3 w-3", habit.currentStreak > 0 && "fill-orange-500 text-orange-500")} /> {habit.currentStreak} day streak
                        </span>
                      </div>
                      <div className={cn(
                        "w-6 h-6 rounded-md flex items-center justify-center",
                        isCompleted ? "bg-success/20 text-success" : "bg-accent text-muted-foreground"
                      )}>
                        {isCompleted && <CheckCircle2 className="h-4 w-4" />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}
