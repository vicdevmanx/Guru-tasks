
import React, { useState, KeyboardEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Plus } from 'lucide-react';
import { Task, User, useProjects } from '@/hooks/useProjects';

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

export const AddTaskDialog: React.FC<AddTaskDialogProps> = ({
  open,
  onOpenChange,
  onAddTask,
}) => {
  const { users } = useProjects();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as Task['status'],
    priority: 'medium' as Task['priority'],
    assignees: [] as User[],
  });
  const [currentAssignee, setCurrentAssignee] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onAddTask({
      title: formData.title,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      assignees: formData.assignees,
    });

    setFormData({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      assignees: [],
    });
    setCurrentAssignee('');
    onOpenChange(false);
  };

  const handleAddAssignee = () => {
    if (!currentAssignee.trim()) return;
    
    const user = users.find(u => 
      u.name.toLowerCase().includes(currentAssignee.toLowerCase()) ||
      u.email.toLowerCase().includes(currentAssignee.toLowerCase())
    );
    
    if (user && !formData.assignees.find(a => a.id === user.id)) {
      setFormData(prev => ({
        ...prev,
        assignees: [...prev.assignees, user]
      }));
      setCurrentAssignee('');
    }
  };

  const handleAssigneeKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddAssignee();
    }
  };

  const removeAssignee = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      assignees: prev.assignees.filter(a => a.id !== userId)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Create a new task for this project.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Task['status']) =>
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: Task['priority']) =>
                  setFormData(prev => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignees">Assignees</Label>
            <div className="flex gap-2">
              <Input
                id="assignees"
                value={currentAssignee}
                onChange={(e) => setCurrentAssignee(e.target.value)}
                onKeyPress={handleAssigneeKeyPress}
                placeholder="Type name or email and press Enter"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddAssignee}
                disabled={!currentAssignee.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.assignees.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.assignees.map((user) => (
                  <Badge key={user.id} variant="secondary" className="flex items-center gap-2 pr-1">
                    <Avatar className="w-4 h-4">
                      <AvatarFallback className="text-xs">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {user.name}
                    <button
                      type="button"
                      onClick={() => removeAssignee(user.id)}
                      className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Add Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
