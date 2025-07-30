import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle, CheckCircle } from "lucide-react";
import { Task } from "@/hooks/useProjects";
import { TaskMenu } from "./TaskMenu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TaskCardProps {
  task: Task;
  onUpdateTask: (updates: Partial<Task>) => void;
  onDeleteTask: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onUpdateTask,
  onDeleteTask,
}) => {
  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "todo":
        return <Clock className="h-3 w-3 text-muted-foreground" />;
      case "in-progress":
        return <AlertCircle className="h-3 w-3 text-yellow-600" />;
      case "done":
        return <CheckCircle className="h-3 w-3 text-green-600" />;
    }
  };

  const formatDueDate = (dueDate: string | Date) => {
    const date = typeof dueDate === "string" ? new Date(dueDate) : dueDate;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const inputDate = new Date(date);
    inputDate.setHours(0, 0, 0, 0);

    const diffMs = inputDate.getTime() - today.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays > 1 && diffDays <= 6) return `In ${diffDays} days`;
    if (diffDays < -1 && diffDays >= -6) return `${Math.abs(diffDays)} days ago`;

    const day = inputDate.getDate();
    const month = inputDate.toLocaleString("en-US", { month: "short" });
    const year = inputDate.getFullYear();

    return `${day} ${month} ${year}`;
  };

  return (
    <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer">
      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {getStatusIcon(task.status)}
            <h3 className="font-medium text-sm leading-tight">{task.title}</h3>
          </div>
          <div className="">
            <TaskMenu
              task={task}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
            />
          </div>
        </div>

        {task.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
          <Badge
            variant="outline"
            className={`text-[0.65rem] ${getPriorityColor(task.priority)}`}
          >
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>
          {task?.due_date && (
            <span className="text-xs text-muted-foreground">
              {formatDueDate(task?.due_date)}
            </span>
          )}
          </div>
          {task.assignees && task.assignees.length > 0 && (
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6 ring-2 ring-border">
                {task && task?.assignees[0].profile_pic ? (
                  <img
                    src={task.assignees[0].profile_pic}
                    alt={task.assignees[0].name}
                    className="object-cover w-full"
                  />
                ) : (
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                    {task.assignees[0].name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              {/* <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-medium">
                  {task.assignees[0].name.charAt(0).toUpperCase()}
                </span>
              </div> */}
              {/* <span className="text-xs text-muted-foreground">
              {task.assignees.length === 1 
                ? task.assignees[0].name 
                : `${task.assignees[0].name} +${task.assignees.length - 1}`
              }
            </span> */}
            </div>
          )}{" "}
        </div>
      </CardContent>
    </Card>
  );
};
