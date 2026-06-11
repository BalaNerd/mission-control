"use client";

import { useState } from "react";
import { useExamStore } from "@/store/useExamStore";
import { Plus, Search, Trophy, Target, Clock, TrendingUp, AlertTriangle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MockTestsPage() {
  const { mockTests, addMockTest, deleteMockTest } = useExamStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddMode, setIsAddMode] = useState(false);

  const filteredMocks = mockTests.filter(m => 
    m.testName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.examType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const correctAnswers = parseInt(formData.get("correctAnswers") as string);
    const wrongAnswers = parseInt(formData.get("wrongAnswers") as string);
    const totalScore = parseInt(formData.get("totalScore") as string);
    const score = parseInt(formData.get("score") as string);
    
    const accuracyPercentage = Math.round((correctAnswers / (correctAnswers + wrongAnswers)) * 100) || 0;

    addMockTest({
      testName: formData.get("testName") as string,
      examType: formData.get("examType") as string,
      date: formData.get("date") as string,
      score,
      totalScore,
      accuracyPercentage,
      correctAnswers,
      wrongAnswers,
      timeTaken: parseInt(formData.get("timeTaken") as string),
      weakAreas: (formData.get("weakAreas") as string).split(',').map(s => s.trim()).filter(Boolean),
      strongAreas: (formData.get("strongAreas") as string).split(',').map(s => s.trim()).filter(Boolean),
      remarks: formData.get("remarks") as string
    });
    
    setIsAddMode(false);
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mock Tests</h1>
          <p className="text-muted-foreground mt-1">Track your performance and analyze your progress.</p>
        </div>
        <button 
          onClick={() => setIsAddMode(!isAddMode)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" /> Log Mock Test
        </button>
      </div>

      {isAddMode && (
        <div className="glass-card p-6 rounded-xl border border-primary/50 animate-in fade-in slide-in-from-top-4">
          <h3 className="font-semibold mb-4">Log New Mock Test</h3>
          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5 lg:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Test Name</label>
              <input name="testName" placeholder="e.g. CDS Full Mock 1" required className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Exam Type</label>
              <select name="examType" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary">
                <option value="CDS">CDS</option>
                <option value="AFCAT">AFCAT</option>
                <option value="CAPF">CAPF</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Date</label>
              <input name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary" />
            </div>

            {/* Scores & Stats */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Score</label>
              <input name="score" type="number" step="0.5" placeholder="Your score" required className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Total Score</label>
              <input name="totalScore" type="number" defaultValue="100" required className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Correct Answers</label>
              <input name="correctAnswers" type="number" required className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Wrong Answers</label>
              <input name="wrongAnswers" type="number" required className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary" />
            </div>

            {/* Time & Areas */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Time Taken (mins)</label>
              <input name="timeTaken" type="number" defaultValue="120" required className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary" />
            </div>
            <div className="flex flex-col gap-1.5 lg:col-span-3">
              <label className="text-xs font-medium text-muted-foreground">Remarks</label>
              <input name="remarks" placeholder="General thoughts..." className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary" />
            </div>

            <div className="flex flex-col gap-1.5 lg:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Weak Areas (comma separated)</label>
              <input name="weakAreas" placeholder="e.g. Geometry, Synonyms" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary" />
            </div>
            <div className="flex flex-col gap-1.5 lg:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Strong Areas (comma separated)</label>
              <input name="strongAreas" placeholder="e.g. History, Reasoning" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary" />
            </div>

            <div className="lg:col-span-4 flex items-end justify-end gap-2 mt-2 border-t border-border/50 pt-4">
              <button type="button" onClick={() => setIsAddMode(false)} className="px-4 py-2 text-sm rounded-lg hover:bg-accent transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm">Save Mock Test</button>
            </div>
          </form>
        </div>
      )}

      {/* Stats Overview */}
      {mockTests.length > 0 && (
        <div className="grid gap-4 md:grid-cols-4">
          <div className="glass-card rounded-xl p-5 flex flex-col gap-2">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Trophy className="h-4 w-4 text-primary" /> Average Score</h3>
            <div className="text-2xl font-bold">
              {Math.round(mockTests.reduce((acc, m) => acc + m.score, 0) / mockTests.length)}
            </div>
          </div>
          <div className="glass-card rounded-xl p-5 flex flex-col gap-2">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Target className="h-4 w-4 text-success" /> Avg Accuracy</h3>
            <div className="text-2xl font-bold">
              {Math.round(mockTests.reduce((acc, m) => acc + m.accuracyPercentage, 0) / mockTests.length)}%
            </div>
          </div>
          <div className="glass-card rounded-xl p-5 flex flex-col gap-2">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2"><TrendingUp className="h-4 w-4 text-warning" /> Tests Taken</h3>
            <div className="text-2xl font-bold">{mockTests.length}</div>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {filteredMocks.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-xl">
            <p className="text-muted-foreground">No mock tests recorded yet.</p>
          </div>
        ) : (
          filteredMocks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(mock => (
            <div key={mock.id} className="glass-card rounded-xl p-5 border border-border group relative">
              <button 
                onClick={() => deleteMockTest(mock.id)}
                className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded transition-colors opacity-0 group-hover:opacity-100"
              >
                &times;
              </button>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold tracking-wider">{mock.examType}</span>
                    <span className="text-xs text-muted-foreground">{new Date(mock.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{mock.testName}</h3>
                  {mock.remarks && <p className="text-sm text-muted-foreground mb-4">{mock.remarks}</p>}

                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm">
                    {mock.weakAreas.length > 0 && (
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-danger mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-xs text-muted-foreground block mb-1">Weak Areas</span>
                          <div className="flex flex-wrap gap-1">
                            {mock.weakAreas.map(area => <span key={area} className="px-2 py-0.5 bg-danger/10 text-danger text-[10px] rounded-md">{area}</span>)}
                          </div>
                        </div>
                      </div>
                    )}
                    {mock.strongAreas.length > 0 && (
                      <div className="flex items-start gap-2">
                        <Zap className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-xs text-muted-foreground block mb-1">Strong Areas</span>
                          <div className="flex flex-wrap gap-1">
                            {mock.strongAreas.map(area => <span key={area} className="px-2 py-0.5 bg-success/10 text-success text-[10px] rounded-md">{area}</span>)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 lg:border-l lg:border-border/50 lg:pl-6">
                  <div className="flex flex-col items-center justify-center w-24 h-24 rounded-full border-4 border-primary/20 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-primary" style={{ clipPath: `inset(${100 - (mock.score / mock.totalScore) * 100}% 0 0 0)` }} />
                    <span className="text-xl font-bold">{mock.score}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">/{mock.totalScore}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="bg-accent/50 rounded-lg px-3 py-2 min-w-[120px]">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-0.5">Accuracy</span>
                      <span className={cn("font-bold", mock.accuracyPercentage > 80 ? "text-success" : mock.accuracyPercentage > 60 ? "text-warning" : "text-danger")}>
                        {mock.accuracyPercentage}%
                      </span>
                    </div>
                    <div className="bg-accent/50 rounded-lg px-3 py-2 min-w-[120px] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-0.5">Correct</span>
                        <span className="font-bold text-success">{mock.correctAnswers}</span>
                      </div>
                      <div className="w-px h-6 bg-border mx-2" />
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-0.5">Wrong</span>
                        <span className="font-bold text-danger">{mock.wrongAnswers}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}