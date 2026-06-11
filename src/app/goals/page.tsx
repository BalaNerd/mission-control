"use client";

import { useState } from "react";
import { useGoalStore } from "@/store/useGoalStore";
import { Plus, Target, CheckCircle2, Circle, MoreHorizontal, Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Priority } from "@/types";

export default function GoalsPage() {
  const { goals, addGoal, deleteGoal, addMilestone, toggleMilestone, deleteMilestone } = useGoalStore();
  const [isAddMode, setIsAddMode] = useState(false);
  const [expandedGoals, setExpandedGoals] = useState<Record<string, boolean>>({});

  const toggleGoalExpanded = (id: string) => {
    setExpandedGoals(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    addGoal({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      priority: formData.get("priority") as Priority,
      targetDate: formData.get("targetDate") as string,
    });
    
    setIsAddMode(false);
  };

  const handleAddMilestone = (e: React.FormEvent<HTMLFormElement>, goalId: string) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("milestoneTitle") as HTMLInputElement;
    if (input.value.trim()) {
      addMilestone(goalId, input.value.trim());
      input.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Goal Tracker</h1>
          <p className="text-muted-foreground mt-1">Set long-term goals and break them down into actionable milestones.</p>
        </div>
        <button 
          onClick={() => setIsAddMode(!isAddMode)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" /> Add Goal
        </button>
      </div>

      {isAddMode && (
        <div className="glass-card p-6 rounded-xl border border-primary/50 animate-in fade-in slide-in-from-top-4">
          <h3 className="font-semibold mb-4">Set New Goal</h3>
          <form onSubmit={handleAddSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Goal Title</label>
                <input name="title" placeholder="e.g. Clear CDS Exam" required className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Category</label>
                <input name="category" placeholder="e.g. Career, Education" required className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Target Date</label>
                <input name="targetDate" type="date" required className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Priority</label>
                <select name="priority" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary">
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Description / Why</label>
              <textarea name="description" placeholder="Why is this goal important to you?" className="w-full h-20 resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary" />
            </div>
            <div className="flex items-end justify-end gap-2 mt-2">
              <button type="button" onClick={() => setIsAddMode(false)} className="px-4 py-2 text-sm rounded-lg hover:bg-accent transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm">Save Goal</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {goals.length === 0 ? (
          <div className="col-span-full p-12 text-center border border-dashed border-border rounded-xl">
            <Target className="h-10 w-10 mx-auto text-muted-foreground opacity-50 mb-4" />
            <p className="text-muted-foreground font-medium">No goals set yet.</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Setting goals is the first step in turning the invisible into the visible.</p>
          </div>
        ) : (
          goals.sort((a, b) => {
            if (a.status === 'Completed' && b.status !== 'Completed') return 1;
            if (a.status !== 'Completed' && b.status === 'Completed') return -1;
            return new Date(a.targetDate || 0).getTime() - new Date(b.targetDate || 0).getTime();
          }).map(goal => {
            const isExpanded = expandedGoals[goal.id];
            
            return (
              <div key={goal.id} className={cn(
                "glass-card rounded-xl border transition-all flex flex-col",
                goal.status === 'Completed' ? "border-success/50 bg-success/5" : "border-border hover:border-primary/50"
              )}>
                <div className="p-5 flex flex-col gap-4">
                  {/* Goal Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider bg-accent px-2 py-0.5 rounded text-muted-foreground">{goal.category}</span>
                        <span className={cn(
                          "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded",
                          goal.priority === 'Critical' ? "bg-danger/10 text-danger" :
                          goal.priority === 'High' ? "bg-orange-500/10 text-orange-500" :
                          goal.priority === 'Medium' ? "bg-warning/10 text-warning" : "bg-blue-500/10 text-blue-500"
                        )}>{goal.priority}</span>
                        {goal.status === 'Completed' && (
                          <span className="text-[10px] uppercase font-bold tracking-wider bg-success/10 text-success px-2 py-0.5 rounded flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Done
                          </span>
                        )}
                      </div>
                      <h3 className={cn("text-xl font-bold line-clamp-2", goal.status === 'Completed' && "text-muted-foreground")}>
                        {goal.title}
                      </h3>
                      {goal.targetDate && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2 font-medium">
                          <CalendarIcon className="h-3.5 w-3.5" />
                          Target: {new Date(goal.targetDate).toLocaleDateString()}
                          {goal.status !== 'Completed' && new Date(goal.targetDate) < new Date() && (
                            <span className="text-danger ml-2 flex items-center gap-1"><Clock className="h-3 w-3" /> Overdue</span>
                          )}
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => deleteGoal(goal.id)}
                      className="p-1.5 text-muted-foreground hover:text-danger rounded hover:bg-danger/10 transition-colors"
                    >
                      &times;
                    </button>
                  </div>

                  {goal.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{goal.description}</p>
                  )}

                  {/* Progress Bar */}
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>Progress</span>
                      <span>{goal.progressPercentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-accent rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full transition-all duration-500", goal.status === 'Completed' ? "bg-success" : "bg-primary")}
                        style={{ width: `${goal.progressPercentage}%` }} 
                      />
                    </div>
                  </div>

                  {/* Milestones Toggle */}
                  <button 
                    onClick={() => toggleGoalExpanded(goal.id)}
                    className="mt-2 text-xs font-medium text-primary hover:underline flex items-center gap-1 self-start"
                  >
                    {isExpanded ? "Hide Milestones" : `Show Milestones (${goal.milestones.filter(m => m.isCompleted).length}/${goal.milestones.length})`}
                  </button>
                </div>

                {/* Milestones Section */}
                {isExpanded && (
                  <div className="border-t border-border/50 bg-background/30 p-5 rounded-b-xl flex flex-col gap-3">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Milestones</h4>
                    
                    {goal.milestones.length === 0 ? (
                      <p className="text-xs text-muted-foreground">Break your goal down into smaller milestones.</p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {goal.milestones.map(milestone => (
                          <div key={milestone.id} className="flex items-center gap-3 group">
                            <button 
                              onClick={() => toggleMilestone(goal.id, milestone.id)}
                              className="focus:outline-none flex-shrink-0"
                            >
                              {milestone.isCompleted ? (
                                <CheckCircle2 className="h-5 w-5 text-success" />
                              ) : (
                                <Circle className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                              )}
                            </button>
                            <span className={cn(
                              "text-sm flex-1 transition-colors",
                              milestone.isCompleted ? "text-muted-foreground line-through" : "text-foreground font-medium"
                            )}>
                              {milestone.title}
                            </span>
                            <button 
                              onClick={() => deleteMilestone(goal.id, milestone.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-danger rounded transition-all flex-shrink-0"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <form onSubmit={(e) => handleAddMilestone(e, goal.id)} className="flex items-center gap-2 mt-2">
                      <input 
                        name="milestoneTitle"
                        placeholder="Add a new milestone..."
                        className="flex-1 bg-background border border-border rounded-md px-3 py-1.5 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary"
                      />
                      <button type="submit" className="bg-primary text-primary-foreground p-1.5 rounded-md hover:bg-primary/90">
                        <Plus className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}