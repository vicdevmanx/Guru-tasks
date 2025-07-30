import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Clock, 
  PlayCircle,
  Copy,
  Archive
} from 'lucide-react';
import { Task } from '@/hooks/useProjects';

interface TaskMenuProps {
  task: Task;
  onUpdateTask: (updates: Partial<Task>) => void;
  onDeleteTask: () => void;
}

export const TaskMenu: React.FC<TaskMenuProps> = ({ 
  task, 
  onUpdateTask, 
  onDeleteTask 
}) => {
  const handleStatusChange = (status: Task['status']) => {
    onUpdateTask({ status });
  };

  const handlePriorityChange = (priority: Task['priority']) => {
    onUpdateTask({ priority });
  };

  const handleMarkDone = () => {
    onUpdateTask({ status: 'done' });
  };

  const handleDuplicate = () => {
    console.log('Duplicate task:', task.title);
  };

  const handleArchive = () => {
    console.log('Archive task:', task.title);
  };

  const statusItems = [
    { value: 'todo', label: 'To Do', icon: Clock },
    { value: 'in-progress', label: 'In Progress', icon: PlayCircle },
    { value: 'done', label: 'Done', icon: CheckCircle },
  ] as const;

  const priorityItems = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-red-600' },
  ] as const;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='p-0'>
        <Button variant="ghost" size="sm" className="h-5 w-5 p-2">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleMarkDone}>
          <CheckCircle className="mr-2 h-4 w-4" />
          Mark as Done
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Clock className="mr-2 h-4 w-4" />
            Set Status
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {statusItems.map((status) => (
              <DropdownMenuItem
                key={status.value}
                onClick={() => handleStatusChange(status.value)}
                className={task.status === status.value ? 'bg-accent' : ''}
              >
                <status.icon className="mr-2 h-4 w-4" />
                {status.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <div className="mr-2 h-2 w-2 rounded-full bg-current" />
            Set Priority
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {priorityItems.map((priority) => (
              <DropdownMenuItem
                key={priority.value}
                onClick={() => handlePriorityChange(priority.value)}
                className={task.priority === priority.value ? 'bg-accent' : ''}
              >
                <div className={`mr-2 h-2 w-2 rounded-full ${priority.color}`} />
                {priority.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Edit className="mr-2 h-4 w-4" />
          Edit Task
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem 
          onClick={onDeleteTask}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Task
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
