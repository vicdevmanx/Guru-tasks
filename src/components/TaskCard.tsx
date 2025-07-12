
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Task } from '@/hooks/useProjects';
import { TaskMenu } from './TaskMenu';

interface TaskCardProps {
  task: Task;
  onUpdateTask: (updates: Partial<Task>) => void;
  onDeleteTask: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onUpdateTask, 
  onDeleteTask 
}) => {
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'todo': return <Clock className="h-3 w-3 text-muted-foreground" />;
      case 'in-progress': return <AlertCircle className="h-3 w-3 text-yellow-600" />;
      case 'done': return <CheckCircle className="h-3 w-3 text-green-600" />;
    }
  };

  return (
    <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {getStatusIcon(task.status)}
            <h3 className="font-medium text-sm leading-tight">{task.title}</h3>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
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
          <Badge 
            variant="outline" 
            className={`text-xs ${getPriorityColor(task.priority)}`}
          >
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>
          
          {task.dueDate && (
            <span className="text-xs text-muted-foreground">
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>

        {task.assignees && task.assignees.length > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-medium">
                {task.assignees[0].name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {task.assignees.length === 1 
                ? task.assignees[0].name 
                : `${task.assignees[0].name} +${task.assignees.length - 1}`
              }
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
