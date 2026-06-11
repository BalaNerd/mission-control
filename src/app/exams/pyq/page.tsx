"use client";

import { useState, useRef, useEffect } from "react";
import { useExamStore } from "@/store/useExamStore";
import { useFileStore } from "@/store/useFileStore";
import { useMistakeStore } from "@/store/useMistakeStore";
import { 
  Plus, Search, Filter, CheckCircle2, Circle, AlertCircle, Bookmark, 
  Upload, FileText, FileImage, FileArchive, X, BarChart2, List, Grid,
  MoreVertical, FileUp, File, BookX, Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Difficulty, PYQ } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

export default function PYQVaultPage() {
  const { pyqs, addPYQ, updatePYQ, deletePYQ, addFileToPYQ, removeFileFromPYQ } = useExamStore();
  const { saveFile, getFile, files } = useFileStore();
  const { addMistake } = useMistakeStore();

  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddMode, setIsAddMode] = useState(false);
  
  // Filters
  const [filterExam, setFilterExam] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All"); // All, Solved, Unsolved, Revision
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filteredPYQs = pyqs.filter(p => {
    const matchesSearch = 
      p.topic.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.year.includes(searchQuery);
    
    const matchesExam = filterExam === "All" || p.examName === filterExam;
    
    const matchesStatus = 
      filterStatus === "All" || 
      (filterStatus === "Solved" && p.isSolved) ||
      (filterStatus === "Unsolved" && !p.isSolved) ||
      (filterStatus === "Revision" && p.revisionRequired);

    return matchesSearch && matchesExam && matchesStatus;
  });

  const handleAddSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    addPYQ({
      examName: formData.get("examName") as string,
      year: formData.get("year") as string,
      subject: formData.get("subject") as string,
      topic: formData.get("topic") as string,
      subtopic: formData.get("subtopic") as string,
      difficulty: formData.get("difficulty") as Difficulty,
      isSolved: false,
      revisionRequired: formData.get("revisionRequired") === "on",
      mistakesMade: "",
      notes: ""
    });
    
    setIsAddMode(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingFor) return;

    try {
      const fileId = await saveFile(file, uploadingFor);
      addFileToPYQ(uploadingFor, fileId);
    } catch (error) {
      alert("Failed to upload file. Please try again.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
      setUploadingFor(null);
    }
  };

  const openFileViewer = async (fileId: string, fileName: string, fileType: string) => {
    const blob = await getFile(fileId);
    if (!blob) {
      alert("File not found in local vault.");
      return;
    }
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 60000); // cleanup
  };

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return <FileText className="h-4 w-4 text-red-400" />;
    if (type.includes("image")) return <FileImage className="h-4 w-4 text-blue-400" />;
    if (type.includes("zip") || type.includes("rar")) return <FileArchive className="h-4 w-4 text-yellow-500" />;
    return <File className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-24 lg:pb-10 min-h-full">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip"
      />

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">PYQ Vault</h1>
          <p className="text-muted-foreground mt-1">Manage, analyze, and master Previous Year Questions with full file support.</p>
        </div>
        <div className="flex gap-2">
          <button className="glass-card flex items-center justify-center h-10 w-10 rounded-lg hover:bg-accent transition-colors border border-border">
            <BarChart2 className="h-5 w-5 text-muted-foreground" />
          </button>
          <button 
            onClick={() => setIsAddMode(!isAddMode)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 h-10 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2 flex-1 md:flex-none"
          >
            <Plus className="h-4 w-4" /> Add Record
          </button>
        </div>
      </div>

      {/* Analytics Dashboard Mini */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 border border-border/50 bg-card/30">
          <p className="text-sm text-muted-foreground">Total PYQs</p>
          <p className="text-2xl font-bold mt-1">{pyqs.length}</p>
        </div>
        <div className="glass-card rounded-xl p-4 border border-border/50 bg-card/30">
          <p className="text-sm text-muted-foreground">Solved</p>
          <p className="text-2xl font-bold mt-1 text-success">{pyqs.filter(p => p.isSolved).length}</p>
        </div>
        <div className="glass-card rounded-xl p-4 border border-border/50 bg-card/30">
          <p className="text-sm text-muted-foreground">Need Revision</p>
          <p className="text-2xl font-bold mt-1 text-warning">{pyqs.filter(p => p.revisionRequired).length}</p>
        </div>
        <div className="glass-card rounded-xl p-4 border border-border/50 bg-card/30">
          <p className="text-sm text-muted-foreground">Files Attached</p>
          <p className="text-2xl font-bold mt-1 text-primary">{pyqs.reduce((acc, curr) => acc + (curr.fileIds?.length || 0), 0)}</p>
        </div>
      </div>

      {/* Tool Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 glass-card p-2 rounded-xl border border-border/50">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search topics, subjects, or years..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border/50 bg-background/50 px-10 py-2.5 text-sm outline-none transition-colors focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto custom-scrollbar pb-1 md:pb-0">
          <select 
            value={filterExam}
            onChange={(e) => setFilterExam(e.target.value)}
            className="rounded-lg border border-border/50 bg-card px-3 py-2 text-sm outline-none shrink-0"
          >
            <option value="All">All Exams</option>
            <option value="CDS">CDS</option>
            <option value="AFCAT">AFCAT</option>
            <option value="CAPF">CAPF</option>
          </select>
          
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-border/50 bg-card px-3 py-2 text-sm outline-none shrink-0"
          >
            <option value="All">All Status</option>
            <option value="Solved">Solved</option>
            <option value="Unsolved">Unsolved</option>
            <option value="Revision">Revision Req.</option>
          </select>

          <div className="h-6 w-px bg-border/50 mx-1 shrink-0"></div>

          <div className="flex bg-background rounded-lg border border-border/50 shrink-0">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn("p-2 rounded-l-md transition-colors", viewMode === 'grid' ? "bg-accent text-foreground" : "text-muted-foreground")}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn("p-2 rounded-r-md transition-colors border-l border-border/50", viewMode === 'list' ? "bg-accent text-foreground" : "text-muted-foreground")}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isAddMode && (
          <motion.div 
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-6 rounded-xl border border-primary/50 mb-2 relative">
              <button 
                onClick={() => setIsAddMode(false)}
                className="absolute right-4 top-4 p-1 hover:bg-accent rounded-md text-muted-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FileUp className="h-5 w-5 text-primary" /> New PYQ Entry
              </h3>
              <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Exam Type</label>
                  <select name="examName" className="w-full rounded-md border border-border/50 bg-background/50 px-3 py-2.5 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary transition-all">
                    <option value="CDS">CDS</option>
                    <option value="AFCAT">AFCAT</option>
                    <option value="CAPF">CAPF</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Year & Paper</label>
                  <input name="year" placeholder="e.g. 2023 (1)" required className="w-full rounded-md border border-border/50 bg-background/50 px-3 py-2.5 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary transition-all" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subject</label>
                  <input name="subject" placeholder="e.g. English" required className="w-full rounded-md border border-border/50 bg-background/50 px-3 py-2.5 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary transition-all" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Topic</label>
                  <input name="topic" placeholder="e.g. Spotting Errors" required className="w-full rounded-md border border-border/50 bg-background/50 px-3 py-2.5 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary transition-all" />
                </div>
                <div className="flex flex-col gap-1.5 lg:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subtopic (Optional)</label>
                  <input name="subtopic" placeholder="e.g. Prepositions" className="w-full rounded-md border border-border/50 bg-background/50 px-3 py-2.5 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary transition-all" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Difficulty</label>
                  <select name="difficulty" className="w-full rounded-md border border-border/50 bg-background/50 px-3 py-2.5 text-sm outline-none focus-visible:ring-1 focus-visible:ring-primary transition-all">
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-6 lg:pl-4">
                  <input type="checkbox" id="revisionRequired" name="revisionRequired" className="rounded-sm border-border/50 bg-background/50 text-primary focus:ring-primary w-4 h-4" />
                  <label htmlFor="revisionRequired" className="text-sm font-medium">Needs Revision?</label>
                </div>
                <div className="lg:col-span-4 flex items-end justify-end gap-3 mt-2 pt-4 border-t border-border/30">
                  <button type="button" onClick={() => setIsAddMode(false)} className="px-5 py-2.5 text-sm rounded-lg hover:bg-accent transition-colors font-medium">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-md font-medium">Save Record</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn(
        "gap-4 w-full",
        viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "flex flex-col"
      )}>
        {filteredPYQs.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 border border-dashed border-border/60 rounded-2xl bg-card/10">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <BookX className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold mb-1">No PYQs Found</h3>
            <p className="text-muted-foreground text-sm text-center max-w-sm">
              Your vault is empty for these filters. Add a new Previous Year Question to start building your knowledge base.
            </p>
          </div>
        ) : (
          filteredPYQs.map(pyq => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={pyq.id} 
              className={cn(
                "glass-card rounded-xl border transition-all duration-300 relative group hover:shadow-md",
                pyq.isSolved ? "border-success/30 bg-success/5" : "border-border/50 bg-card/40",
                viewMode === 'list' ? "flex flex-col sm:flex-row sm:items-center p-4 gap-4" : "p-5 flex flex-col h-full"
              )}
            >
              {/* Card Header (Tags & Actions) */}
              <div className={cn(
                "flex items-start justify-between",
                viewMode === 'list' ? "sm:w-48 shrink-0 flex-col gap-2" : "mb-4"
              )}>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold tracking-wider uppercase border border-primary/20">
                    {pyq.examName} {pyq.year}
                  </span>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border",
                    pyq.difficulty === "Easy" ? "bg-success/10 text-success border-success/20" :
                    pyq.difficulty === "Medium" ? "bg-warning/10 text-warning border-warning/20" : "bg-danger/10 text-danger border-danger/20"
                  )}>{pyq.difficulty}</span>
                </div>
                
                {viewMode === 'grid' && (
                  <button 
                    onClick={() => updatePYQ(pyq.id, { revisionRequired: !pyq.revisionRequired })}
                    className={cn("p-1.5 rounded-full transition-colors", pyq.revisionRequired ? "bg-warning/20 text-warning hover:bg-warning/30" : "text-muted-foreground hover:bg-accent")}
                    title={pyq.revisionRequired ? "Revision required" : "Mark for revision"}
                  >
                    <Bookmark className={cn("h-4 w-4", pyq.revisionRequired && "fill-warning")} />
                  </button>
                )}
              </div>

              {/* Card Body (Title & Meta) */}
              <div className={cn("flex-1", viewMode === 'list' && "min-w-0")}>
                <h3 className="font-bold text-base leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2" title={pyq.topic}>{pyq.topic}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground/80">{pyq.subject}</span>
                  {pyq.subtopic && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-border"></span>
                      <span>{pyq.subtopic}</span>
                    </>
                  )}
                </div>

                {pyq.mistakesMade && (
                  <div className={cn("bg-danger/10 text-danger/90 p-2 rounded-lg text-xs flex gap-2 items-start", viewMode === 'grid' ? "mt-4" : "mt-2")}>
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed line-clamp-2" title={pyq.mistakesMade}>{pyq.mistakesMade}</p>
                  </div>
                )}

                {/* File Attachments */}
                {(pyq.fileIds && pyq.fileIds.length > 0) && (
                  <div className={cn("flex flex-wrap gap-2", viewMode === 'grid' ? "mt-4" : "mt-2")}>
                    {pyq.fileIds.map(fileId => {
                      const fMeta = files.find(f => f.id === fileId);
                      if (!fMeta) return null;
                      return (
                        <div key={fileId} className="flex items-center gap-1.5 bg-background/50 border border-border/50 rounded-md px-2 py-1 text-xs hover:bg-accent transition-colors cursor-pointer group/file" onClick={() => openFileViewer(fileId, fMeta.name, fMeta.type)}>
                          {getFileIcon(fMeta.type)}
                          <span className="truncate max-w-[100px]">{fMeta.name}</span>
                          <button 
                            className="opacity-0 group-hover/file:opacity-100 ml-1 text-muted-foreground hover:text-danger transition-opacity"
                            onClick={(e) => { e.stopPropagation(); removeFileFromPYQ(pyq.id, fileId); }}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className={cn(
                "flex items-center gap-2",
                viewMode === 'grid' ? "mt-6 pt-4 border-t border-border/30 justify-between" : "shrink-0 ml-4 flex-col sm:flex-row"
              )}>
                <button 
                  onClick={() => updatePYQ(pyq.id, { isSolved: !pyq.isSolved })}
                  className={cn(
                    "flex items-center gap-2 text-xs font-bold transition-all px-3 py-2 rounded-lg border",
                    pyq.isSolved 
                      ? "text-success bg-success/10 border-success/20 hover:bg-success/20" 
                      : "text-muted-foreground bg-background hover:bg-accent border-border/50 hover:text-foreground"
                  )}
                >
                  {pyq.isSolved ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                  {pyq.isSolved ? "SOLVED" : "MARK SOLVED"}
                </button>
                
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => {
                      setUploadingFor(pyq.id);
                      fileInputRef.current?.click();
                    }}
                    className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    title="Upload File"
                  >
                    <Upload className="h-4 w-4" />
                  </button>
                  <div className="relative group/menu">
                    <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    <div className="absolute right-0 bottom-full mb-2 w-48 glass-card border border-border/50 rounded-xl shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10 overflow-hidden flex flex-col">
                      <button 
                        onClick={() => {
                          const mistake = prompt("Log mistake details:", pyq.mistakesMade || "");
                          if (mistake !== null) {
                            updatePYQ(pyq.id, { mistakesMade: mistake });
                            if (mistake.trim() !== "") {
                              if (confirm("Would you like to add this to your Mistake Notebook?")) {
                                addMistake({
                                  question: pyq.topic,
                                  mistakeMade: mistake,
                                  correctMethod: "To be added...",
                                  subject: pyq.subject,
                                  topic: pyq.subtopic || pyq.topic,
                                  source: `${pyq.examName} ${pyq.year}`,
                                  difficulty: pyq.difficulty,
                                });
                              }
                            }
                          }
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium hover:bg-accent text-left transition-colors"
                      >
                        <AlertCircle className="h-4 w-4" /> Log Mistake
                      </button>
                      {viewMode === 'list' && (
                        <button 
                          onClick={() => updatePYQ(pyq.id, { revisionRequired: !pyq.revisionRequired })}
                          className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium hover:bg-accent text-left transition-colors"
                        >
                          <Bookmark className="h-4 w-4" /> Toggle Revision
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this PYQ record? Attached files will remain in vault.")) {
                            deletePYQ(pyq.id);
                          }
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium hover:bg-danger/10 text-danger text-left transition-colors border-t border-border/50"
                      >
                        <Trash2 className="h-4 w-4" /> Delete Record
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}