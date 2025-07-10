
import React, { useState, KeyboardEvent } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { X, Plus } from 'lucide-react';
import { useProjects, User } from '@/hooks/useProjects';

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { addProject, users } = useProjects();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [assignees, setAssignees] = useState<User[]>([]);
  const [currentAssignee, setCurrentAssignee] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addProject(name.trim(), description.trim() || undefined, assignees);
    setName('');
    setDescription('');
    setAssignees([]);
    setCurrentAssignee('');
    onOpenChange(false);
  };

  const handleAddAssignee = () => {
    if (!currentAssignee.trim()) return;
    
    const user = users.find(u => 
      u.name.toLowerCase().includes(currentAssignee.toLowerCase()) ||
      u.email.toLowerCase().includes(currentAssignee.toLowerCase())
    );
    
    if (user && !assignees.find(a => a.id === user.id)) {
      setAssignees(prev => [...prev, user]);
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
    setAssignees(prev => prev.filter(a => a.id !== userId));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] animate-in fade-in-0 zoom-in-95 duration-200">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name..."
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description..."
              rows={3}
            />
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
            {assignees.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {assignees.map((user) => (
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
            <div className="text-xs text-muted-foreground">
              Available users: {users.map(u => u.name).join(', ')}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Create Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
