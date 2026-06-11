"use client";

import { useState, useEffect } from "react";
import { useMistakeStore } from "@/store/useMistakeStore";
import { 
  Plus, AlertOctagon, Search, Trash2, Edit3, BookmarkX,
  CheckCircle2, AlertTriangle, ArrowRight, X, Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Difficulty } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

export default function MistakeNotebookPage() {
  const { mistakes, addMistake, deleteMistake, incrementRevision } = useMistakeStore();
  const [mounted, setMounted] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState("All");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subjects = ["All", ...Array.from(new Set(mistakes.map(m => m.subject)))];

  const filteredMistakes = mistakes.filter(m => {
    const matchesSearch = 
      m.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.mistakeMade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.topic?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === "All" || m.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const handleAddSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    addMistake({
      question: formData.get("question") as string,
      mistakeMade: formData.get("mistakeMade") as string,
      correctMethod: formData.get("correctMethod") as string,
      subject: formData.get("subject") as string,
      topic: formData.get("topic") as string,
      source: formData.get("source") as string,
      difficulty: formData.get("difficulty") as Difficulty,
    });
    
    setIsAddMode(false);
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <AlertOctagon className="h-8 w-8 text-danger" /> Mistake Notebook
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Log your errors from Mock Tests and PYQs. Reviewing mistakes is the fastest path to improvement.
          </p>
        </div>
        <button 
          onClick={() => setIsAddMode(true)}
          className="bg-danger text-danger-foreground hover:bg-danger/90 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5" /> Log Mistake
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 glass-card p-2 rounded-xl border border-border/50">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search questions or mistakes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border/50 bg-background/50 px-10 py-2.5 text-sm outline-none transition-colors focus-visible:ring-1 focus-visible:ring-danger"
          />
        </div>
        <div className="flex w-full sm:w-auto items-center gap-2 ml-auto">
          <Filter className="h-4 w-4 text-muted-foreground ml-2 hidden sm:block" />
          <select 
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="w-full sm:w-auto rounded-lg border border-border/50 bg-card px-4 py-2.5 text-sm outline-none shrink-0 cursor-pointer"
          >
            {subjects.map(s => <option key={s} value={s}>{s === "All" ? "All Subjects" : s}</option>)}
          </select>
        </div>
      </div>

      <AnimatePresence>
        {isAddMode && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-6 md:p-8 rounded-2xl border border-danger/30 relative mb-4 bg-danger/5">
              <button onClick={() => setIsAddMode(false)} className="absolute right-4 top-4 p-2 hover:bg-danger/10 rounded-full text-danger transition-colors">
                <X className="h-5 w-5" />
              </button>
              <h3 className="text-xl font-bold mb-6 text-danger flex items-center gap-2">
                <BookmarkX className="h-5 w-5" /> Log a New Mistake
              </h3>
              <form onSubmit={handleAddSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">The Question</label>
                      <textarea 
                        name="question" required rows={3}
                        className="w-full rounded-xl border border-border/50 bg-background/80 px-4 py-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-danger resize-none" 
                        placeholder="What was the question you got wrong?"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-danger uppercase tracking-wider mb-1.5 block flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> The Mistake You Made
                      </label>
                      <textarea 
                        name="mistakeMade" required rows={3}
                        className="w-full rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-danger resize-none text-danger-foreground placeholder:text-danger/50" 
                        placeholder="Why did you get it wrong? Silly mistake? Concept gap?"
                      />
                    </div>
                  </div>
                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-success uppercase tracking-wider mb-1.5 block flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Correct Method / Concept
                      </label>
                      <textarea 
                        name="correctMethod" required rows={3}
                        className="w-full rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-success resize-none text-success-foreground placeholder:text-success/50" 
                        placeholder="What is the correct way to solve this?"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Subject</label>
                        <input name="subject" required className="w-full rounded-xl border border-border/50 bg-background/80 px-4 py-2.5 text-sm outline-none focus-visible:ring-1 focus-visible:ring-danger" placeholder="e.g. Physics" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Topic (Optional)</label>
                        <input name="topic" className="w-full rounded-xl border border-border/50 bg-background/80 px-4 py-2.5 text-sm outline-none focus-visible:ring-1 focus-visible:ring-danger" placeholder="e.g. Optics" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Source</label>
                        <input name="source" required className="w-full rounded-xl border border-border/50 bg-background/80 px-4 py-2.5 text-sm outline-none focus-visible:ring-1 focus-visible:ring-danger" placeholder="e.g. Mock Test 3" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Difficulty</label>
                        <select name="difficulty" className="w-full rounded-xl border border-border/50 bg-background/80 px-4 py-2.5 text-sm outline-none focus-visible:ring-1 focus-visible:ring-danger">
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-danger/20">
                  <button type="submit" className="bg-danger text-danger-foreground px-8 py-2.5 rounded-xl font-bold hover:bg-danger/90 transition-all shadow-md">
                    Save to Notebook
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMistakes.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 border border-dashed border-border/60 rounded-3xl bg-card/10">
            <div className="h-16 w-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-xl font-bold mb-1">No mistakes logged!</h3>
            <p className="text-muted-foreground text-sm text-center max-w-sm">
              You haven't logged any mistakes yet. Keep up the good work, or add one if you just messed up a mock test.
            </p>
          </div>
        ) : (
          filteredMistakes.map(mistake => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={mistake.id} 
              className="glass-card rounded-2xl border border-border/50 overflow-hidden flex flex-col group hover:shadow-lg transition-shadow"
            >
              {/* Card Header */}
              <div className="bg-background/50 p-4 border-b border-border/50 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{mistake.subject}</span>
                    <span className="bg-accent text-foreground px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{mistake.source}</span>
                  </div>
                  <h3 className="font-bold text-base leading-snug">{mistake.question}</h3>
                </div>
                <button onClick={() => deleteMistake(mistake.id)} className="p-1.5 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-md transition-colors shrink-0">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-4 flex flex-col gap-4 flex-1">
                <div className="bg-danger/10 border border-danger/20 rounded-xl p-3 relative">
                  <div className="absolute -top-2.5 left-4 bg-danger text-danger-foreground text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> My Mistake
                  </div>
                  <p className="text-sm mt-1 text-danger-foreground leading-relaxed">{mistake.mistakeMade}</p>
                </div>
                
                <div className="bg-success/10 border border-success/20 rounded-xl p-3 relative">
                  <div className="absolute -top-2.5 left-4 bg-success text-success-foreground text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Correct Method
                  </div>
                  <p className="text-sm mt-1 text-success-foreground leading-relaxed">{mistake.correctMethod}</p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="bg-background/30 p-3 px-4 border-t border-border/50 flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">
                  Revised: <strong className="text-foreground">{mistake.revisionCount}</strong> times
                </span>
                <button 
                  onClick={() => incrementRevision(mistake.id)}
                  className="text-xs font-bold bg-accent hover:bg-primary hover:text-primary-foreground transition-colors px-4 py-1.5 rounded-lg flex items-center gap-2"
                >
                  Mark Revised <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
