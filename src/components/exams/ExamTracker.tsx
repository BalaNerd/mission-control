"use client";

import { useState } from "react";
import { useExamStore, EXAM_SUBJECTS } from "@/store/useExamStore";
import { ChevronDown, ChevronRight, Plus, CheckCircle2, Circle, BookOpen, Star, MoreHorizontal, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { Difficulty } from "@/types";

export function ExamTracker({ examName }: { examName: "CDS" | "AFCAT" | "CAPF" }) {
  const subjects = EXAM_SUBJECTS[examName];
  const [activeSubject, setActiveSubject] = useState(subjects[0]);
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  
  const { topics, addTopic, toggleSubtopic, addSubtopic } = useExamStore();
  
  const subjectId = `${examName}-${activeSubject}`;
  const subjectTopics = topics.filter(t => t.subjectId === subjectId);

  const toggleTopic = (id: string) => {
    setExpandedTopics(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddTopic = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("topicName") as HTMLInputElement;
    const difficulty = form.elements.namedItem("difficulty") as HTMLSelectElement;
    if (input.value.trim()) {
      addTopic(examName, activeSubject, input.value, difficulty.value as Difficulty);
      input.value = "";
    }
  };

  const handleAddSubtopic = (e: React.FormEvent<HTMLFormElement>, topicId: string) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("subtopicName") as HTMLInputElement;
    if (input.value.trim()) {
      addSubtopic(topicId, input.value);
      input.value = "";
      if (!expandedTopics[topicId]) {
        toggleTopic(topicId);
      }
    }
  };

  // Calculate subject progress
  const totalSubtopics = subjectTopics.reduce((acc, t) => acc + t.subtopics.length, 0) || 1; // avoid / 0
  const completedSubtopics = subjectTopics.reduce((acc, t) => acc + t.subtopics.filter(st => st.isCompleted).length, 0);
  const progressPercent = subjectTopics.reduce((acc, t) => acc + t.subtopics.length, 0) === 0 ? 0 : Math.round((completedSubtopics / totalSubtopics) * 100);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{examName} Tracker</h1>
          <p className="text-muted-foreground mt-1">Track your syllabus completion, topics, and progress.</p>
        </div>
        <div className="flex items-center gap-4 bg-card px-4 py-2 rounded-xl shadow-sm border border-border">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-semibold uppercase">Overall Progress</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-accent rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progressPercent}%` }} />
              </div>
              <span className="text-sm font-bold">{progressPercent}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-6 flex-col md:flex-row">
        {/* Subjects Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-2">
          {subjects.map(subject => {
            const subjId = `${examName}-${subject}`;
            const t = topics.filter(t => t.subjectId === subjId);
            const tSub = t.reduce((acc, t) => acc + t.subtopics.length, 0);
            const cSub = t.reduce((acc, t) => acc + t.subtopics.filter(st => st.isCompleted).length, 0);
            const perc = tSub === 0 ? 0 : Math.round((cSub / tSub) * 100);
            
            return (
              <button
                key={subject}
                onClick={() => setActiveSubject(subject)}
                className={cn(
                  "flex flex-col gap-2 p-3 rounded-lg text-left transition-all border",
                  activeSubject === subject 
                    ? "bg-card border-primary/50 shadow-sm" 
                    : "bg-transparent border-transparent hover:bg-accent hover:border-border"
                )}
              >
                <span className={cn("font-medium text-sm", activeSubject === subject ? "text-primary" : "text-foreground")}>
                  {subject}
                </span>
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs text-muted-foreground">{t.length} Topics</span>
                  <span className="text-xs font-semibold">{perc}%</span>
                </div>
                <div className="w-full h-1 bg-accent rounded-full overflow-hidden">
                  <div className="h-full bg-primary/70 transition-all duration-300" style={{ width: `${perc}%` }} />
                </div>
              </button>
            )
          })}
        </div>

        {/* Topics Area */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="glass-card rounded-xl p-4 flex flex-col gap-4 border border-border">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" /> {activeSubject}
            </h2>
            
            {/* Add Topic Form */}
            <form onSubmit={handleAddTopic} className="flex gap-2 items-center">
              <input
                name="topicName"
                placeholder="Add new topic..."
                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary"
                required
              />
              <select name="difficulty" className="bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary">
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <button type="submit" className="bg-primary text-primary-foreground p-2 rounded-lg hover:bg-primary/90 transition-colors">
                <Plus className="h-5 w-5" />
              </button>
            </form>

            {/* Topics List */}
            <div className="flex flex-col gap-3 mt-4">
              {subjectTopics.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm border border-dashed rounded-xl">
                  No topics added yet. Start building your syllabus!
                </div>
              ) : (
                subjectTopics.map(topic => {
                  const isExpanded = expandedTopics[topic.id];
                  const tTotal = topic.subtopics.length;
                  const tComp = topic.subtopics.filter(st => st.isCompleted).length;
                  const tPerc = tTotal === 0 ? 0 : Math.round((tComp / tTotal) * 100);
                  const isTopicComplete = tTotal > 0 && tTotal === tComp;

                  return (
                    <div key={topic.id} className="border border-border/50 rounded-xl overflow-hidden bg-card/50 transition-all hover:border-border">
                      {/* Topic Header */}
                      <div 
                        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-accent/50"
                        onClick={() => toggleTopic(topic.id)}
                      >
                        <button className="p-0.5 text-muted-foreground hover:text-foreground transition-colors">
                          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </button>
                        
                        <div className="flex-1 font-medium text-sm flex items-center gap-2">
                          <span className={cn(isTopicComplete && "line-through text-muted-foreground")}>{topic.name}</span>
                          {isTopicComplete && <CheckCircle2 className="h-4 w-4 text-success" />}
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-semibold uppercase",
                            topic.difficulty === "Easy" ? "bg-success/10 text-success" :
                            topic.difficulty === "Medium" ? "bg-warning/10 text-warning" : "bg-danger/10 text-danger"
                          )}>
                            {topic.difficulty}
                          </span>
                          <span className="text-xs font-semibold text-muted-foreground w-8 text-right">{tPerc}%</span>
                          <button className="text-muted-foreground hover:text-foreground p-1 transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Topic Content / Subtopics */}
                      {isExpanded && (
                        <div className="p-3 pt-0 border-t border-border/30 bg-background/30 flex flex-col gap-2">
                          {/* Subtopics List */}
                          {topic.subtopics.map(subtopic => (
                            <div key={subtopic.id} className="flex items-center gap-3 pl-8 py-1.5 group">
                              <button 
                                onClick={() => toggleSubtopic(topic.id, subtopic.id)}
                                className="flex-shrink-0 focus:outline-none"
                              >
                                {subtopic.isCompleted ? (
                                  <CheckCircle2 className="h-4 w-4 text-success" />
                                ) : (
                                  <Circle className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                )}
                              </button>
                              <span className={cn(
                                "text-sm transition-all",
                                subtopic.isCompleted ? "text-muted-foreground line-through" : "text-foreground"
                              )}>
                                {subtopic.name}
                              </span>
                            </div>
                          ))}

                          {/* Add Subtopic */}
                          <form onSubmit={(e) => handleAddSubtopic(e, topic.id)} className="flex items-center pl-8 pt-2 mt-1">
                            <div className="flex-shrink-0 h-4 w-4 mr-3 flex items-center justify-center">
                              <Plus className="h-3 w-3 text-muted-foreground" />
                            </div>
                            <input
                              name="subtopicName"
                              placeholder="Add subtopic..."
                              className="flex-1 bg-transparent border-b border-border/50 focus:border-primary px-1 py-1 text-sm outline-none transition-colors text-muted-foreground focus:text-foreground"
                            />
                            <button type="submit" className="hidden">Add</button>
                          </form>
                        </div>
                      )}
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
