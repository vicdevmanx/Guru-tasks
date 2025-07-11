import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, User } from 'lucide-react';
import { Task } from '@/hooks/useProjects';

interface TaskCardProps {
  task: Task;
  onUpdateTask?: (updates: Partial<Task>) => void;
  onDeleteTask?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-sm line-clamp-2 flex gap-2 items-center">
              <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
              {task.title}
            </h4>
            {task.description && (
              <p className="text-xs text-muted-foreground mt-1 h-8 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDeleteTask}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Move to</DropdownMenuLabel>
              {['todo', 'in-progress', 'done'].map((status) => (
                <DropdownMenuItem
                  key={status}
                  disabled={task.status === status}
                  onClick={() => {
                    if (onUpdateTask) {
                      onUpdateTask({ status });
                    }
                  }}
                  className='text-xs'
                >
                  {status === 'todo' && 'TO DO'}
                  {status === 'in-progress' && 'IN PROGRESS'}
                  {status === 'done' && 'COMPLETE'}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Optional: Add a status badge back if you want */}
            {/* <Badge variant="secondary" className="text-xs">
              {task.status.replace('-', ' ')}
            </Badge> */}
          </div>

          <div className="flex items-center">
            {task.assignees?.slice(0, 2).map((assignee) => (
              <Avatar
                key={assignee.id}
                className="w-6 h-6 first:ml-0 border-2 border-background"
              >
                <AvatarFallback className="text-xs">
                  {assignee.name.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            ))}
            {(task.assignees?.length || 0) > 2 && (
              <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                <span className="text-xs">
                  +{(task.assignees?.length || 0) - 2}
                </span>
              </div>
            )}
            {!task.assignees?.length && (
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                <User className="h-3 w-3 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
