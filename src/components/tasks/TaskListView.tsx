import { Task } from "@/types";
import { useTaskStore } from "@/store/useTaskStore";
import { CheckCircle2, Circle, Clock, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function TaskListView({ tasks }: { tasks: Task[] }) {
  const { moveTask, toggleTaskStarred, deleteTask } = useTaskStore();

  const priorityColors = {
    Low: "text-blue-500 bg-blue-500/10",
    Medium: "text-yellow-500 bg-yellow-500/10",
    High: "text-orange-500 bg-orange-500/10",
    Critical: "text-red-500 bg-red-500/10"
  };

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="h-20 w-20 bg-accent rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No tasks found</h3>
        <p className="text-muted-foreground mt-1 max-w-sm">
          You're all caught up! Enjoy your free time or add a new task to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-border/50">
      {tasks.map((task) => (
        <div 
          key={task.id} 
          className="group flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors"
        >
          <button 
            onClick={() => moveTask(task.id, task.status === "Completed" ? "Pending" : "Completed")}
            className="flex-shrink-0 focus:outline-none"
          >
            {task.status === "Completed" ? (
              <CheckCircle2 className="h-5 w-5 text-success" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
            )}
          </button>
          
          <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <div className="flex-1 min-w-0">
              <span className={cn(
                "block text-sm font-medium truncate transition-all",
                task.status === "Completed" ? "text-muted-foreground line-through" : "text-foreground"
              )}>
                {task.title}
              </span>
              {task.description && (
                <span className="block text-xs text-muted-foreground truncate mt-0.5">
                  {task.description}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3 mt-2 sm:mt-0">
              {task.dueDate && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{task.dueDate}</span>
                </div>
              )}
              <span className={cn("px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap", priorityColors[task.priority])}>
                {task.priority}
              </span>
              {task.category && (
                <span className="px-2 py-0.5 rounded bg-secondary text-secondary-foreground text-[10px] font-medium whitespace-nowrap">
                  {task.category}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => toggleTaskStarred(task.id)}
              className="p-1.5 rounded hover:bg-background text-muted-foreground hover:text-warning transition-colors"
            >
              <Star className={cn("h-4 w-4", task.isStarred && "fill-warning text-warning")} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
