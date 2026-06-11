"use client";

import { useState, useEffect } from "react";
import { usePlannerStore } from "@/store/usePlannerStore";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Target, Sun, Sunset, Moon, Star, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PlannerPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const dateStr = currentDate.toISOString().split('T')[0];
  
  const { getPlanByDate, updatePlan, updateNightReview, addTimeBlock, removeTimeBlock } = usePlannerStore();
  
  // To avoid hydration mismatch for Date objects, use a mounted flag or use effect to load data
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const plan = getPlanByDate(dateStr);

  const handlePrevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    setCurrentDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const updatePriority = (index: number, value: string) => {
    const newPriorities = [...plan.priorities];
    newPriorities[index] = value;
    updatePlan(dateStr, { priorities: newPriorities });
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-10">
      {/* Header & Date Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-xl shadow-sm border border-border">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center text-primary">
            <span className="text-xs font-bold uppercase">{currentDate.toLocaleDateString('en-US', { month: 'short' })}</span>
            <span className="text-lg font-black leading-none">{currentDate.getDate()}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Daily Planner</h1>
            <p className="text-sm text-muted-foreground">{currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleToday} className="px-3 py-1.5 text-sm font-medium hover:bg-accent rounded-md transition-colors border border-border">
            Today
          </button>
          <div className="flex items-center bg-accent/50 rounded-md border border-border overflow-hidden">
            <button onClick={handlePrevDay} className="p-1.5 hover:bg-accent transition-colors"><ChevronLeft className="h-4 w-4" /></button>
            <div className="px-3 py-1.5 text-sm font-medium border-x border-border flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" /> Date
            </div>
            <button onClick={handleNextDay} className="p-1.5 hover:bg-accent transition-colors"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Priorities & Sections */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Top 3 Priorities */}
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4 text-warning">
              <Target className="h-5 w-5" />
              <h2 className="text-lg font-bold text-foreground">Top 3 Priorities</h2>
            </div>
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full border-2 border-warning/50 flex items-center justify-center text-xs font-bold text-warning/70">
                    {i + 1}
                  </div>
                  <input
                    type="text"
                    placeholder={`Priority ${i + 1}...`}
                    value={plan.priorities[i]}
                    onChange={(e) => updatePriority(i, e.target.value)}
                    className="flex-1 bg-transparent border-b border-border/50 focus:border-warning/50 px-2 py-1 outline-none transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Day Sections */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="glass-card rounded-xl p-5 border-t-4 border-t-blue-400">
              <div className="flex items-center gap-2 mb-3 text-blue-400">
                <Sun className="h-4 w-4" />
                <h3 className="font-semibold text-foreground">Morning Plan</h3>
              </div>
              <textarea
                value={plan.morningPlan}
                onChange={(e) => updatePlan(dateStr, { morningPlan: e.target.value })}
                placeholder="What's the plan for this morning?"
                className="w-full h-32 bg-transparent resize-none outline-none text-sm placeholder:text-muted-foreground/50"
              />
            </div>
            
            <div className="glass-card rounded-xl p-5 border-t-4 border-t-orange-400">
              <div className="flex items-center gap-2 mb-3 text-orange-400">
                <Sun className="h-4 w-4 fill-orange-400" />
                <h3 className="font-semibold text-foreground">Afternoon Plan</h3>
              </div>
              <textarea
                value={plan.afternoonPlan}
                onChange={(e) => updatePlan(dateStr, { afternoonPlan: e.target.value })}
                placeholder="What's the plan for the afternoon?"
                className="w-full h-32 bg-transparent resize-none outline-none text-sm placeholder:text-muted-foreground/50"
              />
            </div>

            <div className="glass-card rounded-xl p-5 border-t-4 border-t-indigo-400">
              <div className="flex items-center gap-2 mb-3 text-indigo-400">
                <Sunset className="h-4 w-4" />
                <h3 className="font-semibold text-foreground">Evening Plan</h3>
              </div>
              <textarea
                value={plan.eveningPlan}
                onChange={(e) => updatePlan(dateStr, { eveningPlan: e.target.value })}
                placeholder="What's the plan for the evening?"
                className="w-full h-32 bg-transparent resize-none outline-none text-sm placeholder:text-muted-foreground/50"
              />
            </div>

            <div className="glass-card rounded-xl p-5 border-t-4 border-t-purple-500 bg-purple-500/5 dark:bg-purple-500/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-purple-500">
                  <Moon className="h-4 w-4" />
                  <h3 className="font-semibold text-foreground">Night Review</h3>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium">
                  <span className="text-muted-foreground">Score:</span>
                  <select 
                    value={plan.nightReview.productivityScore}
                    onChange={(e) => updateNightReview(dateStr, { productivityScore: parseInt(e.target.value) })}
                    className="bg-transparent font-bold outline-none cursor-pointer"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}/10</option>)}
                  </select>
                </div>
              </div>
              <textarea
                value={plan.nightReview.reflection}
                onChange={(e) => updateNightReview(dateStr, { reflection: e.target.value })}
                placeholder="How did today go? What could be improved?"
                className="w-full h-32 bg-transparent resize-none outline-none text-sm placeholder:text-muted-foreground/50"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Time Blocking */}
        <div className="glass-card rounded-xl p-5 flex flex-col h-full min-h-[500px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-primary">
              <Clock className="h-5 w-5" />
              <h2 className="text-lg font-bold text-foreground">Time Blocking</h2>
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-4 bg-accent/30 p-3 rounded-lg border border-border/50">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Add Block</h4>
            <form className="flex flex-col gap-2" onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const formData = new FormData(form);
              if (!formData.get('activity')) return;
              
              addTimeBlock(dateStr, {
                startTime: formData.get('startTime') as string,
                endTime: formData.get('endTime') as string,
                activity: formData.get('activity') as string,
                type: formData.get('type') as any
              });
              form.reset();
              // set defaults
              (form.elements.namedItem('startTime') as HTMLInputElement).value = '09:00';
              (form.elements.namedItem('endTime') as HTMLInputElement).value = '10:00';
            }}>
              <div className="flex gap-2">
                <input type="time" name="startTime" defaultValue="09:00" required className="w-full text-xs p-1.5 rounded border border-border bg-background" />
                <span className="text-muted-foreground flex items-center">-</span>
                <input type="time" name="endTime" defaultValue="10:00" required className="w-full text-xs p-1.5 rounded border border-border bg-background" />
              </div>
              <input type="text" name="activity" placeholder="Activity description..." required className="w-full text-sm p-1.5 rounded border border-border bg-background" />
              <div className="flex gap-2">
                <select name="type" className="w-full text-xs p-1.5 rounded border border-border bg-background">
                  <option value="Focus">Focus</option>
                  <option value="Study">Study</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Break">Break</option>
                  <option value="Other">Other</option>
                </select>
                <button type="submit" className="bg-primary text-primary-foreground p-1.5 rounded flex-shrink-0 hover:bg-primary/90">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {plan.timeBlocks.length === 0 ? (
              <div className="text-center py-10 text-sm text-muted-foreground">
                No time blocks scheduled for today.
              </div>
            ) : (
              plan.timeBlocks.map((block) => (
                <div key={block.id} className="group flex gap-3 p-2 hover:bg-accent/50 rounded-lg border border-transparent hover:border-border transition-colors">
                  <div className="flex flex-col items-end w-16 flex-shrink-0 pt-0.5">
                    <span className="text-xs font-bold">{block.startTime}</span>
                    <span className="text-[10px] text-muted-foreground">{block.endTime}</span>
                  </div>
                  <div className={cn(
                    "flex-1 border-l-2 pl-3 py-1",
                    block.type === 'Focus' ? 'border-l-blue-500' :
                    block.type === 'Study' ? 'border-l-indigo-500' :
                    block.type === 'Meeting' ? 'border-l-orange-500' :
                    block.type === 'Break' ? 'border-l-success' : 'border-l-muted-foreground'
                  )}>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{block.activity}</div>
                      <button 
                        onClick={() => removeTimeBlock(dateStr, block.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-danger rounded transition-all"
                      >
                        &times;
                      </button>
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                      {block.type}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}