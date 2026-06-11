"use client";

import { useState } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { Plus, List as ListIcon, LayoutGrid, Search, Filter } from "lucide-react";
import { TaskListView } from "@/components/tasks/TaskListView";
import { TaskKanbanView } from "@/components/tasks/TaskKanbanView";
import { TaskDialog } from "@/components/tasks/TaskDialog";

export default function TasksPage() {
  const [view, setView] = useState<"list" | "kanban">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { tasks } = useTaskStore();

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage your tasks, projects, and to-dos.</p>
        </div>
        <button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" /> Add Task
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-2 rounded-lg">
        <div className="flex items-center w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border-0 bg-background/50 px-9 py-2 text-sm outline-none ring-1 ring-border transition-colors focus-visible:ring-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md hover:bg-accent text-muted-foreground transition-colors">
            <Filter className="h-4 w-4" /> Filter
          </button>
          <div className="h-6 w-px bg-border mx-1"></div>
          <div className="flex bg-background/50 rounded-md p-1 ring-1 ring-border">
            <button
              onClick={() => setView("list")}
              className={`p-1.5 rounded-sm transition-colors ${view === "list" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <ListIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("kanban")}
              className={`p-1.5 rounded-sm transition-colors ${view === "kanban" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto rounded-lg border border-border/50 bg-card/30 backdrop-blur-md">
        {view === "list" ? (
          <TaskListView tasks={filteredTasks} />
        ) : (
          <TaskKanbanView tasks={filteredTasks} />
        )}
      </div>

      <TaskDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </div>
  );
}