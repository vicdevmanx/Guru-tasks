
import React, { useState, KeyboardEvent } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { X, Plus, Users } from 'lucide-react';
import { useProjects, User } from '@/hooks/useProjects';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

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
  const [showUserSelector, setShowUserSelector] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addProject(name.trim(), description.trim() || undefined, assignees);
    setName('');
    setDescription('');
    setAssignees([]);
    onOpenChange(false);
  };

  const handleAddAssignee = (user: User) => {
    if (!assignees.find(a => a.id === user.id)) {
      setAssignees(prev => [...prev, user]);
    }
    setShowUserSelector(false);
  };

  const removeAssignee = (userId: string) => {
    setAssignees(prev => prev.filter(a => a.id !== userId));
  };

  const availableUsers = users.filter(user => 
    !assignees.find(assignee => assignee.id === user.id)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] animate-in fade-in-0 zoom-in-95 duration-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Create New Project
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name..."
              autoFocus
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description..."
              rows={3}
            />
          </div>
          
          <div className="space-y-3">
            <Label>Team Members</Label>
            
            <Popover open={showUserSelector} onOpenChange={setShowUserSelector}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-muted-foreground"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add team members...
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput placeholder="Search team members..." />
                  <CommandEmpty>No team members found.</CommandEmpty>
                  <CommandGroup>
                    {availableUsers.map((user) => (
                      <CommandItem
                        key={user.id}
                        onSelect={() => handleAddAssignee(user)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                          <Badge variant="secondary">{user.role}</Badge>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            {assignees.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected Members ({assignees.length})</p>
                <div className="flex flex-wrap gap-2">
                  {assignees.map((user) => (
                    <Badge key={user.id} variant="secondary" className="flex items-center gap-2 pr-1 py-1">
                      <Avatar className="w-4 h-4">
                        <AvatarFallback className="text-xs">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {user.name}
                      <button
                        type="button"
                        onClick={() => removeAssignee(user.id)}
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
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
