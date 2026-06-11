"use client";

import { useState, useEffect } from "react";
import { useFlashcardStore } from "@/store/useFlashcardStore";
import { 
  Plus, Play, Layers, X, Edit3, Trash2, BrainCircuit, RotateCcw,
  CheckCircle2, AlertCircle, RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Difficulty } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

export default function FlashcardsPage() {
  const { flashcards, addCard, updateCard, deleteCard, reviewCard, getDueCards } = useFlashcardStore();
  const [mounted, setMounted] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [studyMode, setStudyMode] = useState(false);
  const [flipped, setFlipped] = useState(false);
  
  const dueCards = getDueCards();
  const [currentStudyIndex, setCurrentStudyIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Group cards by Subject
  const subjects = Array.from(new Set(flashcards.map(c => c.subject)));

  const handleAddSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    addCard({
      question: formData.get("question") as string,
      answer: formData.get("answer") as string,
      subject: formData.get("subject") as string,
      topic: formData.get("topic") as string,
      tags: (formData.get("tags") as string).split(",").map(t => t.trim()).filter(Boolean),
      difficulty: formData.get("difficulty") as Difficulty,
    });
    
    setIsAddMode(false);
  };

  const handleReview = (rating: 0 | 1 | 2 | 3 | 4 | 5) => {
    const card = dueCards[currentStudyIndex];
    if (card) {
      reviewCard(card.id, rating);
      setFlipped(false);
      if (currentStudyIndex < dueCards.length - 1) {
        setCurrentStudyIndex(prev => prev + 1);
      } else {
        setStudyMode(false);
        setCurrentStudyIndex(0);
      }
    }
  };

  if (studyMode) {
    const card = dueCards[currentStudyIndex];
    if (!card) {
      setStudyMode(false);
      return null;
    }

    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] max-w-3xl mx-auto p-4 relative">
        <button 
          onClick={() => setStudyMode(false)}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:bg-accent rounded-full transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="w-full mb-8 flex items-center justify-between text-sm font-medium text-muted-foreground">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">{card.subject}</span>
          <span>Card {currentStudyIndex + 1} of {dueCards.length}</span>
        </div>

        <div className="relative w-full aspect-[4/3] md:aspect-[16/9] perspective-1000">
          <motion.div
            initial={false}
            animate={{ rotateX: flipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
            className="w-full h-full relative preserve-3d cursor-pointer"
            onClick={() => !flipped && setFlipped(true)}
          >
            {/* Front of Card */}
            <div className="absolute inset-0 backface-hidden glass-card rounded-3xl border border-primary/20 flex flex-col items-center justify-center p-8 md:p-12 text-center shadow-xl">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">{card.question}</h2>
              {!flipped && (
                <p className="absolute bottom-8 text-muted-foreground text-sm flex items-center gap-2 animate-pulse">
                  <RotateCcw className="h-4 w-4" /> Tap to reveal answer
                </p>
              )}
            </div>

            {/* Back of Card */}
            <div className="absolute inset-0 backface-hidden glass-card rounded-3xl border border-success/30 flex flex-col items-center justify-center p-8 md:p-12 text-center shadow-xl rotate-x-180 bg-success/5">
              <div className="flex-1 flex items-center justify-center overflow-y-auto">
                <p className="text-2xl md:text-3xl font-medium leading-relaxed">{card.answer}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {flipped && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mt-10 grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            <button onClick={() => handleReview(0)} className="glass-card bg-danger/10 border-danger/30 hover:bg-danger/20 text-danger p-4 rounded-xl flex flex-col items-center gap-2 transition-colors">
              <span className="text-lg font-bold">Again</span>
              <span className="text-xs opacity-80">&lt; 1m</span>
            </button>
            <button onClick={() => handleReview(3)} className="glass-card bg-warning/10 border-warning/30 hover:bg-warning/20 text-warning p-4 rounded-xl flex flex-col items-center gap-2 transition-colors">
              <span className="text-lg font-bold">Hard</span>
              <span className="text-xs opacity-80">1.2x</span>
            </button>
            <button onClick={() => handleReview(4)} className="glass-card bg-success/10 border-success/30 hover:bg-success/20 text-success p-4 rounded-xl flex flex-col items-center gap-2 transition-colors">
              <span className="text-lg font-bold">Good</span>
              <span className="text-xs opacity-80">2.5x</span>
            </button>
            <button onClick={() => handleReview(5)} className="glass-card bg-primary/10 border-primary/30 hover:bg-primary/20 text-primary p-4 rounded-xl flex flex-col items-center gap-2 transition-colors">
              <span className="text-lg font-bold">Easy</span>
              <span className="text-xs opacity-80">3.5x</span>
            </button>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <BrainCircuit className="h-8 w-8 text-primary" /> Flashcards
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Master definitions and facts using active recall and the SM-2 Spaced Repetition Algorithm.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsAddMode(true)}
            className="glass-card hover:bg-accent px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-border/50 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> New Card
          </button>
          {dueCards.length > 0 && (
            <button 
              onClick={() => {
                setCurrentStudyIndex(0);
                setFlipped(false);
                setStudyMode(true);
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <Play className="h-4 w-4 fill-current" /> Study Due ({dueCards.length})
            </button>
          )}
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
            <div className="glass-card p-6 md:p-8 rounded-2xl border border-primary/30 relative mb-4">
              <button onClick={() => setIsAddMode(false)} className="absolute right-4 top-4 p-2 hover:bg-accent rounded-full text-muted-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
              <h3 className="text-xl font-bold mb-6">Create Flashcard</h3>
              <form onSubmit={handleAddSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Front (Question)</label>
                      <textarea 
                        name="question" 
                        required 
                        rows={4}
                        className="w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary resize-none" 
                        placeholder="e.g. What is the capital of France?"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Subject</label>
                        <input name="subject" required className="w-full rounded-xl border border-border/50 bg-background/50 px-4 py-2.5 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary" placeholder="e.g. Geography" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Difficulty</label>
                        <select name="difficulty" className="w-full rounded-xl border border-border/50 bg-background/50 px-4 py-2.5 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary">
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Back (Answer)</label>
                      <textarea 
                        name="answer" 
                        required 
                        rows={4}
                        className="w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary resize-none" 
                        placeholder="e.g. Paris"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Topic (Optional)</label>
                        <input name="topic" className="w-full rounded-xl border border-border/50 bg-background/50 px-4 py-2.5 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary" placeholder="e.g. European Cities" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Tags (Comma separated)</label>
                        <input name="tags" className="w-full rounded-xl border border-border/50 bg-background/50 px-4 py-2.5 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary" placeholder="e.g. capitals, europe" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-border/50">
                  <button type="submit" className="bg-primary text-primary-foreground px-8 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-md">
                    Add Card
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decks / Subjects */}
      <div className="space-y-8">
        {subjects.length === 0 && !isAddMode ? (
          <div className="text-center py-20 glass-card rounded-3xl border border-border/50 border-dashed">
            <Layers className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Your deck is empty</h3>
            <p className="text-muted-foreground mb-6">Create your first flashcard to start learning.</p>
            <button 
              onClick={() => setIsAddMode(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md inline-flex items-center gap-2"
            >
              <Plus className="h-5 w-5" /> Create Card
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map(subject => {
              const subjectCards = flashcards.filter(c => c.subject === subject);
              const dueCount = subjectCards.filter(c => c.nextReviewDate <= Date.now()).length;
              
              return (
                <div key={subject} className="glass-card rounded-2xl p-6 border border-border/50 flex flex-col relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                    <Layers className="h-24 w-24" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 z-10">{subject}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 z-10">
                    <span>{subjectCards.length} total cards</span>
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between z-10 pt-4 border-t border-border/30">
                    <div className="flex items-center gap-2">
                      {dueCount > 0 ? (
                        <span className="flex items-center gap-1.5 text-warning font-bold bg-warning/10 px-3 py-1 rounded-full text-xs">
                          <RefreshCw className="h-3 w-3" /> {dueCount} Due
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-success font-bold bg-success/10 px-3 py-1 rounded-full text-xs">
                          <CheckCircle2 className="h-3 w-3" /> Up to date
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Card Management List (Preview) */}
      {flashcards.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-bold border-b border-border/50 pb-2">Manage Cards</h3>
          <div className="glass-card rounded-2xl border border-border/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-background/50 border-b border-border/50">
                  <tr>
                    <th className="px-6 py-4 font-medium">Question</th>
                    <th className="px-6 py-4 font-medium">Subject</th>
                    <th className="px-6 py-4 font-medium">Ease</th>
                    <th className="px-6 py-4 font-medium">Reviews</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {flashcards.map(card => (
                    <tr key={card.id} className="hover:bg-accent/30 transition-colors">
                      <td className="px-6 py-4 font-medium max-w-[300px] truncate">{card.question}</td>
                      <td className="px-6 py-4">
                        <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-md text-xs font-bold">{card.subject}</span>
                      </td>
                      <td className="px-6 py-4">{card.easeFactor.toFixed(2)}</td>
                      <td className="px-6 py-4">{card.revisionCount}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => deleteCard(card.id)} className="p-1.5 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-md transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
