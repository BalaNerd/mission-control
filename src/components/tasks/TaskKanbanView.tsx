import { Task, TaskStatus } from "@/types";
import { useTaskStore } from "@/store/useTaskStore";
import { Clock, MessageSquare, MoreHorizontal, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: "Pending", title: "To Do", color: "bg-slate-500/10 text-slate-500" },
  { id: "In Progress", title: "In Progress", color: "bg-blue-500/10 text-blue-500" },
  { id: "Completed", title: "Done", color: "bg-success/10 text-success" },
];

export function TaskKanbanView({ tasks }: { tasks: Task[] }) {
  const { moveTask } = useTaskStore();

  const priorityColors = {
    Low: "bg-blue-500",
    Medium: "bg-yellow-500",
    High: "bg-orange-500",
    Critical: "bg-red-500"
  };

  return (
    <div className="flex h-full gap-4 p-4 overflow-x-auto overflow-y-hidden">
      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.id);
        
        return (
          <div key={column.id} className="flex flex-col w-80 min-w-80 h-full flex-shrink-0">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold", column.color)}>
                  {column.title}
                </span>
                <span className="text-xs font-medium text-muted-foreground bg-accent px-2 py-0.5 rounded-full">
                  {columnTasks.length}
                </span>
              </div>
              <button className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-accent transition-colors">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 pb-4 custom-scrollbar">
              {columnTasks.map((task) => (
                <div 
                  key={task.id} 
                  className="bg-card border border-border/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex gap-2 flex-wrap">
                      {task.category && (
                        <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground">
                          {task.category}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Interactive move buttons for quick switching without drag & drop yet */}
                      {column.id !== "Pending" && (
                        <button 
                          onClick={() => moveTask(task.id, "Pending")}
                          className="h-5 w-5 flex items-center justify-center rounded hover:bg-accent text-xs"
                          title="Move to Pending"
                        >
                          &lt;
                        </button>
                      )}
                      {column.id !== "Completed" && (
                        <button 
                          onClick={() => moveTask(task.id, column.id === "Pending" ? "In Progress" : "Completed")}
                          className="h-5 w-5 flex items-center justify-center rounded hover:bg-accent text-xs"
                          title="Move forward"
                        >
                          &gt;
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <h4 className="text-sm font-medium mb-1 line-clamp-2">{task.title}</h4>
                  
                  {task.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      {task.dueDate && (
                        <div className={cn(
                          "flex items-center gap-1 text-[11px] font-medium",
                          task.status === "Completed" ? "text-muted-foreground" : 
                          (new Date(task.dueDate) < new Date() ? "text-danger" : "text-muted-foreground")
                        )}>
                          <Clock className="h-3 w-3" />
                          <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </div>
                      )}
                      {(task.subtasks?.length ?? 0) > 0 && (
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <CheckSquare className="h-3 w-3" />
                          <span>{task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <div className={cn("h-2 w-2 rounded-full", priorityColors[task.priority])} title={`Priority: ${task.priority}`} />
                    </div>
                  </div>
                </div>
              ))}
              
              {columnTasks.length === 0 && (
                <div className="h-24 border-2 border-dashed border-border/50 rounded-xl flex items-center justify-center text-xs text-muted-foreground">
                  No tasks
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Inline definition for missing icon
function CheckSquare(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}
