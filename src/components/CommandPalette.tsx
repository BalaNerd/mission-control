"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, LayoutDashboard, CheckSquare, BookOpen, Target, Activity, Calendar, Trophy, GraduationCap, Layers, BookMarked, History, FileText, BrainCircuit, AlertOctagon, Shield, Timer, FileUp } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useTaskStore } from "@/store/useTaskStore";
import { useNoteStore } from "@/store/useNoteStore";
import { useExamStore } from "@/store/useExamStore";

export function CommandPalette() {
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const router = useRouter();
  
  const { tasks } = useTaskStore();
  const { notes } = useNoteStore();
  const { pyqs } = useExamStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  const runCommand = (command: () => void) => {
    setCommandPaletteOpen(false);
    command();
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] sm:pt-[10vh]">
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity" 
        onClick={() => setCommandPaletteOpen(false)}
      />
      <Command 
        className="relative z-50 w-full max-w-[600px] overflow-hidden rounded-xl border border-border bg-card shadow-2xl mx-4"
        loop
      >
        <div className="flex items-center border-b border-border px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
          <Command.Input 
            autoFocus
            className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Search tasks, notes, exams, or type a command..." 
          />
        </div>
        
        <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2 custom-scrollbar">
          <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
            No results found.
          </Command.Empty>

          <Command.Group heading="Navigation" className="text-xs font-medium text-muted-foreground p-1">
            <Command.Item onSelect={() => runCommand(() => router.push("/"))} className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground">
              <LayoutDashboard className="h-4 w-4 text-primary" /> Dashboard
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push("/tasks"))} className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground">
              <CheckSquare className="h-4 w-4 text-blue-500" /> My Tasks
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push("/notes"))} className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground">
              <BookOpen className="h-4 w-4 text-yellow-500" /> Knowledge Vault
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push("/habits"))} className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground">
              <Activity className="h-4 w-4 text-orange-500" /> Habits
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push("/analytics"))} className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground">
              <Trophy className="h-4 w-4 text-primary" /> Analytics
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push("/profile"))} className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground">
              <Shield className="h-4 w-4 text-purple-500" /> OS Profile
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Quick Actions" className="text-xs font-medium text-muted-foreground p-1 mt-2">
            <Command.Item onSelect={() => runCommand(() => alert("Pomodoro Timer Started!"))} className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground">
              <Timer className="h-4 w-4 text-danger" /> Start Pomodoro Timer
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push("/mistakes"))} className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground">
              <AlertOctagon className="h-4 w-4 text-danger" /> Log a Mistake
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push("/exams/pyq"))} className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground">
              <FileUp className="h-4 w-4 text-success" /> Upload to Vault
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Exams & Study" className="text-xs font-medium text-muted-foreground p-1 mt-2">
            <Command.Item onSelect={() => runCommand(() => router.push("/exams/pyq"))} className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground">
              <History className="h-4 w-4 text-muted-foreground" /> PYQ Vault
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push("/flashcards"))} className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground">
              <BrainCircuit className="h-4 w-4 text-muted-foreground" /> Flashcards
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push("/mistakes"))} className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground">
              <AlertOctagon className="h-4 w-4 text-muted-foreground" /> Mistake Notebook
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push("/exams/cds"))} className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground">
              <GraduationCap className="h-4 w-4 text-muted-foreground" /> CDS Tracker
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push("/exams/afcat"))} className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground">
              <Layers className="h-4 w-4 text-muted-foreground" /> AFCAT Tracker
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => router.push("/exams/mocks"))} className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground">
              <FileText className="h-4 w-4 text-muted-foreground" /> Mock Tests
            </Command.Item>
          </Command.Group>

          {tasks.length > 0 && (
            <Command.Group heading="Active Tasks" className="text-xs font-medium text-muted-foreground p-1 mt-2">
              {tasks.filter(t => t.status !== "Completed").slice(0, 5).map(task => (
                <Command.Item 
                  key={task.id} 
                  value={`task ${task.title}`}
                  onSelect={() => runCommand(() => router.push("/tasks"))} 
                  className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                >
                  <CheckSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{task.title}</span>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {notes.length > 0 && (
            <Command.Group heading="Recent Notes" className="text-xs font-medium text-muted-foreground p-1 mt-2">
              {notes.slice(0, 5).map(note => (
                <Command.Item 
                  key={note.id} 
                  value={`note ${note.title}`}
                  onSelect={() => runCommand(() => router.push(`/notes/${note.id}`))} 
                  className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                >
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{note.title}</span>
                </Command.Item>
              ))}
            </Command.Group>
          )}
        </Command.List>
      </Command>
    </div>
  );
}
