
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Search, File, Users, FolderKanban } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useNavigate } from 'react-router-dom';

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  open,
  onOpenChange,
}) => {
  const { projects, users } = useProjects();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelect = (type: string, id: string) => {
    if (type === 'project') {
      navigate(`/project/${id}`);
    } else if (type === 'user') {
      navigate(`/profile/${id}`);
    } else if (type === 'team') {
      navigate('/team');
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search
          </DialogTitle>
        </DialogHeader>
        
        <Command>
          <CommandInput 
            placeholder="Search projects, people, tasks..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Projects">
            {projects.filter(project => 
              project.name.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((project) => (
              <CommandItem
                key={project.id}
                onSelect={() => handleSelect('project', project.id)}
                className="cursor-pointer"
              >
                <FolderKanban className="h-4 w-4 mr-2" />
                {project.name}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Team Members">
            {users.filter(user => 
              user.name.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((user) => (
              <CommandItem
                key={user.id}
                onSelect={() => handleSelect('user', user.id)}
                className="cursor-pointer"
              >
                <Users className="h-4 w-4 mr-2" />
                {user.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </DialogContent>
    </Dialog>
  );
};
