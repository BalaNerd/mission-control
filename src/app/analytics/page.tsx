"use client";

import { useState, useEffect } from "react";
import { useExamStore } from "@/store/useExamStore";
import { useTaskStore } from "@/store/useTaskStore";
import { useHabitStore } from "@/store/useHabitStore";
import { useUserStore } from "@/store/useUserStore";
import { useMistakeStore } from "@/store/useMistakeStore";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import { 
  TrendingUp, CheckCircle2, Activity, Target, Shield, BookOpen, Clock, BrainCircuit
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const COLORS = ['#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function Analytics2Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { mockTests, pyqs } = useExamStore();
  const { tasks } = useTaskStore();
  const { habits } = useHabitStore();
  const { xp, level, rank, studyStreak } = useUserStore();
  const { mistakes } = useMistakeStore();

  if (!mounted) return null;

  // --- 1. Exam Readiness (Radar Chart based on Mock Tests & PYQs) ---
  const subjectsSet = new Set<string>();
  mockTests.forEach(m => { m.strongAreas.forEach(s => subjectsSet.add(s)); m.weakAreas.forEach(s => subjectsSet.add(s)); });
  pyqs.forEach(p => subjectsSet.add(p.subject));
  
  const readinessData = Array.from(subjectsSet).map(subject => {
    // Calculate a pseudo-readiness score based on mock performance and PYQ completion
    const relatedMocks = mockTests.filter(m => m.strongAreas.includes(subject) || m.weakAreas.includes(subject));
    let score = 50; // Base score
    
    // Add points for being a strong area, subtract for weak
    relatedMocks.forEach(m => {
      if (m.strongAreas.includes(subject)) score += 10;
      if (m.weakAreas.includes(subject)) score -= 10;
    });

    // Add points for solved PYQs in this subject
    const solvedPYQs = pyqs.filter(p => p.subject === subject && p.isSolved).length;
    score += (solvedPYQs * 2);
    
    // Cap between 10 and 100
    score = Math.max(10, Math.min(100, score));
    
    return { subject, readiness: score };
  }).slice(0, 6); // Take top 6 subjects for radar chart clarity

  // --- 2. Mock Test Trends ---
  const mockTestData = mockTests
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((test, index) => ({
      name: `Test ${index + 1}`,
      score: test.score,
      accuracy: test.accuracyPercentage,
      date: new Date(test.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    }));

  // --- 3. Heatmap / Activity Data (Tasks + PYQs + Mocks) ---
  const last30Days = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split('T')[0];
  });

  const heatmapData = last30Days.map(dateStr => {
    // Find activities on this date
    let intensity = 0;
    // Task completions (assuming tasks have completedAt, but we'll approximate with updatedAt if status is Completed)
    const completedTasks = tasks.filter(t => t.status === "Completed" && new Date(t.updatedAt).toISOString().split('T')[0] === dateStr).length;
    intensity += completedTasks;
    
    // Mock tests on this date
    const tests = mockTests.filter(m => m.date === dateStr).length;
    intensity += (tests * 5); // heavily weight mock tests

    // Habit completions
    const habitsDone = habits.filter(h => h.completedDates.includes(dateStr)).length;
    intensity += habitsDone;

    return {
      date: dateStr,
      intensity: Math.min(4, intensity) // 0 to 4 scale for heatmap colors
    };
  });

  const getHeatmapColor = (intensity: number) => {
    switch (intensity) {
      case 0: return 'bg-accent/30 border-border/20';
      case 1: return 'bg-primary/20 border-primary/20';
      case 2: return 'bg-primary/40 border-primary/30';
      case 3: return 'bg-primary/70 border-primary/50';
      case 4: return 'bg-primary border-primary';
      default: return 'bg-primary border-primary';
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" /> Analytics OS
          </h1>
          <p className="text-muted-foreground mt-1">Deep insights into your Exam Readiness, consistency, and performance.</p>
        </div>
      </div>

      {/* Mini Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Current Rank</span>
          </div>
          <p className="text-2xl font-black uppercase tracking-wider">{rank}</p>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-warning/20 bg-gradient-to-br from-warning/5 to-transparent">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-warning" />
            <span className="text-sm font-medium text-muted-foreground">Study Streak</span>
          </div>
          <p className="text-2xl font-black">{studyStreak} <span className="text-base font-normal text-muted-foreground">Days</span></p>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-danger/20 bg-gradient-to-br from-danger/5 to-transparent">
          <div className="flex items-center gap-2 mb-2">
            <BrainCircuit className="h-4 w-4 text-danger" />
            <span className="text-sm font-medium text-muted-foreground">Mistakes Logged</span>
          </div>
          <p className="text-2xl font-black">{mistakes.length}</p>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-success/20 bg-gradient-to-br from-success/5 to-transparent">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span className="text-sm font-medium text-muted-foreground">PYQs Solved</span>
          </div>
          <p className="text-2xl font-black">{pyqs.filter(p => p.isSolved).length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. Exam Readiness Radar (Takes 1 column) */}
        <div className="glass-card rounded-2xl border border-border/50 p-6 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" /> Exam Readiness Matrix
            </h2>
          </div>
          <div className="h-[300px] w-full flex items-center justify-center">
            {readinessData.length < 3 ? (
              <div className="text-center text-sm text-muted-foreground border border-dashed border-border/50 rounded-xl p-8 bg-background/50">
                Log more Mock Tests and PYQs to generate your Readiness Matrix.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={readinessData}>
                  <PolarGrid stroke="#ffffff20" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Readiness %" dataKey="readiness" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.4} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 2. Mock Test Performance Area Chart (Takes 2 columns) */}
        <div className="glass-card rounded-2xl border border-border/50 p-6 flex flex-col gap-4 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" /> Mock Test Trajectory
            </h2>
          </div>
          <div className="h-[300px] w-full">
            {mockTestData.length < 2 ? (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground border border-dashed border-border/50 rounded-xl bg-background/50">
                Complete at least 2 mock tests to visualize your trajectory.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockTestData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="date" tick={{fontSize: 12, fill: '#888'}} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{fontSize: 12, fill: '#888'}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area type="monotone" dataKey="score" name="Score" stroke="#22C55E" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  <Area type="monotone" dataKey="accuracy" name="Accuracy %" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorAccuracy)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 3. Consistency Heatmap (Full Width) */}
        <div className="glass-card rounded-2xl border border-border/50 p-6 flex flex-col gap-4 shadow-sm lg:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-warning" /> 30-Day Consistency Heatmap
            </h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-accent/30 border border-border/20"></div>
                <div className="w-3 h-3 rounded-sm bg-primary/20 border border-primary/20"></div>
                <div className="w-3 h-3 rounded-sm bg-primary/40 border border-primary/30"></div>
                <div className="w-3 h-3 rounded-sm bg-primary/70 border border-primary/50"></div>
                <div className="w-3 h-3 rounded-sm bg-primary border border-primary"></div>
              </div>
              <span>More</span>
            </div>
          </div>
          
          <div className="bg-background/40 border border-border/30 rounded-xl p-6 overflow-x-auto custom-scrollbar">
            <div className="flex flex-wrap gap-1.5 min-w-[600px]">
              {heatmapData.map((day, i) => (
                <div 
                  key={day.date} 
                  className={cn(
                    "w-4 h-4 sm:w-6 sm:h-6 rounded-sm border transition-all hover:scale-125 hover:z-10 cursor-pointer",
                    getHeatmapColor(day.intensity)
                  )}
                  title={`${day.date}: ${day.intensity > 0 ? day.intensity + ' activity level' : 'No activity'}`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-3 text-xs text-muted-foreground font-medium min-w-[600px]">
              <span>30 Days Ago</span>
              <span>Today</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}