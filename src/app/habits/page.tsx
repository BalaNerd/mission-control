"use client";

import { useState } from "react";
import { useHabitStore } from "@/store/useHabitStore";
import { Plus, Check, Flame, Calendar, Trophy, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HabitsPage() {
  const { habits, addHabit, toggleHabitCompletion, deleteHabit } = useHabitStore();
  const [isAddMode, setIsAddMode] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Generate last 7 days for the quick tracker
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const handleAddSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    addHabit({
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      frequency: "Daily", // Keeping it simple for now
    });
    
    setIsAddMode(false);
  };

  const handlePrevWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 7);
    setCurrentDate(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 7);
    if (next > new Date()) setCurrentDate(new Date());
    else setCurrentDate(next);
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Habit Tracker</h1>
          <p className="text-muted-foreground mt-1">Build good habits and track your daily streaks.</p>
        </div>
        <button 
          onClick={() => setIsAddMode(!isAddMode)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" /> Add Habit
        </button>
      </div>

      {isAddMode && (
        <div className="glass-card p-6 rounded-xl border border-primary/50 animate-in fade-in slide-in-from-top-4">
          <h3 className="font-semibold mb-4">Create New Habit</h3>
          <form onSubmit={handleAddSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Habit Name</label>
                <input name="name" placeholder="e.g. Read for 30 minutes" required className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Category</label>
                <input name="category" placeholder="e.g. Health, Learning" required className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Description (Optional)</label>
              <input name="description" placeholder="Why are you building this habit?" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary" />
            </div>
            <div className="flex items-end justify-end gap-2 mt-2">
              <button type="button" onClick={() => setIsAddMode(false)} className="px-4 py-2 text-sm rounded-lg hover:bg-accent transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm">Save Habit</button>
            </div>
          </form>
        </div>
      )}

      {/* Habits Grid */}
      <div className="glass-card rounded-xl border border-border overflow-hidden">
        {/* Date Header Row */}
        <div className="flex items-center border-b border-border/50 bg-background/50 p-4">
          <div className="w-48 sm:w-64 flex-shrink-0 font-medium text-sm flex items-center gap-2">
            <button onClick={handlePrevWeek} className="p-1 hover:bg-accent rounded-md"><ChevronLeft className="h-4 w-4" /></button>
            <span className="flex-1 text-center truncate">Habits</span>
            <button onClick={handleNextWeek} disabled={currentDate.toDateString() === new Date().toDateString()} className="p-1 hover:bg-accent rounded-md disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button>
          </div>
          <div className="flex-1 flex justify-between gap-1 overflow-x-auto min-w-0 pr-4">
            {last7Days.map(date => (
              <div key={date.toISOString()} className="flex flex-col items-center justify-center flex-1 min-w-[40px]">
                <span className="text-[10px] text-muted-foreground uppercase">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                <span className={cn(
                  "text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full mt-1",
                  date.toDateString() === new Date().toDateString() ? "bg-primary text-primary-foreground" : ""
                )}>
                  {date.getDate()}
                </span>
              </div>
            ))}
          </div>
          <div className="w-20 hidden md:block text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Streak
          </div>
        </div>

        {/* Habits List */}
        <div className="divide-y divide-border/50">
          {habits.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <Calendar className="h-10 w-10 mx-auto mb-3 opacity-20" />
              <p>No habits tracked yet.</p>
              <p className="text-sm mt-1">Add a habit to start building your streak!</p>
            </div>
          ) : (
            habits.map(habit => (
              <div key={habit.id} className="flex items-center p-4 group hover:bg-accent/20 transition-colors">
                <div className="w-48 sm:w-64 flex-shrink-0 pr-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-sm line-clamp-1">{habit.name}</h3>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider bg-accent px-1.5 py-0.5 rounded mt-1 inline-block">{habit.category}</span>
                  </div>
                  <button 
                    onClick={() => deleteHabit(habit.id)}
                    className="p-1.5 text-muted-foreground hover:text-danger rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    &times;
                  </button>
                </div>
                
                <div className="flex-1 flex justify-between gap-1 overflow-x-auto min-w-0 pr-4">
                  {last7Days.map(date => {
                    const dateStr = date.toISOString().split('T')[0];
                    const isCompleted = habit.completedDates.includes(dateStr);
                    const isFuture = date > new Date();

                    return (
                      <div key={dateStr} className="flex items-center justify-center flex-1 min-w-[40px]">
                        <button
                          disabled={isFuture}
                          onClick={() => toggleHabitCompletion(habit.id, dateStr)}
                          className={cn(
                            "w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all",
                            isCompleted 
                              ? "bg-success/20 text-success border-2 border-success/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]" 
                              : isFuture 
                                ? "bg-accent/30 border border-border/30 opacity-50 cursor-not-allowed" 
                                : "bg-accent border border-border hover:border-primary/50"
                          )}
                        >
                          {isCompleted && <Check className="h-4 w-4 sm:h-5 sm:w-5" />}
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="w-20 hidden md:flex items-center justify-center">
                  <div className="flex items-center gap-1.5 bg-orange-500/10 text-orange-500 px-2 py-1 rounded-lg">
                    <Flame className={cn("h-4 w-4", habit.currentStreak > 0 && "fill-orange-500")} />
                    <span className="font-bold text-sm">{habit.currentStreak}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Habit Stats */}
      {habits.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="glass-card rounded-xl p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Best Current Streak</p>
              <h4 className="text-2xl font-bold">{Math.max(...habits.map(h => h.currentStreak), 0)} <span className="text-sm font-normal text-muted-foreground">days</span></h4>
            </div>
          </div>
          <div className="glass-card rounded-xl p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">All-Time Longest</p>
              <h4 className="text-2xl font-bold">{Math.max(...habits.map(h => h.longestStreak), 0)} <span className="text-sm font-normal text-muted-foreground">days</span></h4>
            </div>
          </div>
          <div className="glass-card rounded-xl p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center text-success">
              <Check className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Completions</p>
              <h4 className="text-2xl font-bold">{habits.reduce((acc, h) => acc + h.completedDates.length, 0)}</h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}