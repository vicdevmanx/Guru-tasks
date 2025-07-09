
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Calendar, User, CheckCircle, Clock, Circle } from 'lucide-react';
import { Task } from '@/hooks/useProjects';

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
  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  const statusIcons = {
    todo: Circle,
    'in-progress': Clock,
    done: CheckCircle,
  };

  const StatusIcon = statusIcons[task.status];

  const handleStatusChange = (status: Task['status']) => {
    onUpdateTask({ status });
  };

  const handlePriorityChange = (priority: Task['priority']) => {
    onUpdateTask({ priority });
  };

  const handleMarkDone = () => {
    onUpdateTask({ status: 'done' });
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-sm line-clamp-2">{task.title}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleMarkDone}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Done
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => handleStatusChange('todo')}>
                <Circle className="mr-2 h-4 w-4" />
                Set as To Do
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('in-progress')}>
                <Clock className="mr-2 h-4 w-4" />
                Set as In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('done')}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Set as Done
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => handlePriorityChange('low')}>
                Set Priority: Low
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePriorityChange('medium')}>
                Set Priority: Medium
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePriorityChange('high')}>
                Set Priority: High
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={onDeleteTask} className="text-destructive">
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3">
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-3">
            {task.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusIcon className="h-4 w-4 text-muted-foreground" />
            <Badge
              variant="secondary"
              className={`text-xs ${priorityColors[task.priority]}`}
            >
              {task.priority}
            </Badge>
          </div>
          
          {task.assignee && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span>{task.assignee}</span>
            </div>
          )}
        </div>
        
        {task.dueDate && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{task.dueDate.toLocaleDateString()}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
