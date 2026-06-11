"use client";

import { useState } from "react";
import { useRevisionStore } from "@/store/useRevisionStore";
import { Plus, RotateCw, CheckCircle2, Circle, AlertCircle, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RevisionsPage() {
  const { items, addItem, markRevisionComplete, deleteItem } = useRevisionStore();
  const [isAddMode, setIsAddMode] = useState(false);

  const handleAddSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    addItem(
      formData.get("title") as string,
      formData.get("category") as string
    );
    
    setIsAddMode(false);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueRevisions = items.filter(item => item.nextRevisionDate > 0 && item.nextRevisionDate <= Date.now());
  const upcomingRevisions = items.filter(item => item.nextRevisionDate > Date.now());
  const completedRevisions = items.filter(item => item.revisionsCompleted === 5);

  const renderRevisionCircles = (completedCount: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((num) => (
          <div 
            key={num}
            className={cn(
              "h-2.5 w-2.5 rounded-full transition-colors",
              num <= completedCount ? "bg-success" : "bg-accent border border-border"
            )}
            title={`Revision ${num}`}
          />
        ))}
      </div>
    );
  };

  const renderItemCard = (item: any, isDue: boolean) => (
    <div key={item.id} className={cn(
      "glass-card rounded-xl p-4 border transition-all relative group flex flex-col gap-3",
      isDue ? "border-warning/50 bg-warning/5" : "border-border"
    )}>
      <button 
        onClick={() => deleteItem(item.id)}
        className="absolute top-3 right-3 p-1.5 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded transition-colors opacity-0 group-hover:opacity-100"
      >
        &times;
      </button>

      <div>
        <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold tracking-wider mb-2 inline-block">
          {item.category}
        </span>
        <h3 className="font-semibold text-sm line-clamp-2 pr-6">{item.title}</h3>
      </div>

      <div className="flex items-center justify-between mt-auto pt-2">
        {renderRevisionCircles(item.revisionsCompleted)}
        
        {item.revisionsCompleted < 5 ? (
          <div className="flex items-center gap-2">
            {!isDue && (
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                {new Date(item.nextRevisionDate).toLocaleDateString()}
              </span>
            )}
            <button
              onClick={() => markRevisionComplete(item.id)}
              className={cn(
                "p-1.5 rounded-md transition-colors flex items-center gap-1 text-xs font-medium",
                isDue ? "bg-success text-success-foreground hover:bg-success/90" : "bg-accent text-foreground hover:bg-accent/80"
              )}
            >
              <RotateCw className="h-3.5 w-3.5" />
              {isDue ? "Review Now" : "Mark Done"}
            </button>
          </div>
        ) : (
          <span className="text-xs font-bold text-success flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" /> Mastered
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Revision Tracker</h1>
          <p className="text-muted-foreground mt-1">Spaced repetition system to permanently retain information.</p>
        </div>
        <button 
          onClick={() => setIsAddMode(!isAddMode)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" /> Add Topic
        </button>
      </div>

      {isAddMode && (
        <div className="glass-card p-6 rounded-xl border border-primary/50 animate-in fade-in slide-in-from-top-4">
          <form onSubmit={handleAddSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-medium text-muted-foreground">Topic Title</label>
              <input name="title" placeholder="e.g. Fundamental Rights" required className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary" />
            </div>
            <div className="flex flex-col gap-1.5 w-full sm:w-64 flex-shrink-0">
              <label className="text-xs font-medium text-muted-foreground">Category</label>
              <input name="category" placeholder="e.g. Polity" required className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary" />
            </div>
            <div className="flex gap-2 w-full sm:w-auto flex-shrink-0">
              <button type="button" onClick={() => setIsAddMode(false)} className="px-4 py-2 text-sm rounded-lg hover:bg-accent transition-colors flex-1">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm flex-1">Add</button>
            </div>
          </form>
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-warning">
          <div className="text-warning mb-2"><AlertCircle className="h-5 w-5" /></div>
          <h3 className="text-sm font-medium text-muted-foreground">Due for Revision</h3>
          <div className="text-2xl font-bold mt-1">{dueRevisions.length}</div>
        </div>
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-primary">
          <div className="text-primary mb-2"><RotateCw className="h-5 w-5" /></div>
          <h3 className="text-sm font-medium text-muted-foreground">Upcoming</h3>
          <div className="text-2xl font-bold mt-1">{upcomingRevisions.length}</div>
        </div>
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-success">
          <div className="text-success mb-2"><CheckCircle2 className="h-5 w-5" /></div>
          <h3 className="text-sm font-medium text-muted-foreground">Mastered (5/5)</h3>
          <div className="text-2xl font-bold mt-1">{completedRevisions.length}</div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning" /> Due Today
          </h2>
          <div className="flex flex-col gap-3">
            {dueRevisions.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-border rounded-xl text-muted-foreground text-sm">
                You're all caught up for today!
              </div>
            ) : (
              dueRevisions.map(item => renderItemCard(item, true))
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-muted-foreground" /> Upcoming
          </h2>
          <div className="flex flex-col gap-3">
            {upcomingRevisions.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-border rounded-xl text-muted-foreground text-sm">
                No upcoming revisions scheduled.
              </div>
            ) : (
              upcomingRevisions.sort((a, b) => a.nextRevisionDate - b.nextRevisionDate).slice(0, 5).map(item => renderItemCard(item, false))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
