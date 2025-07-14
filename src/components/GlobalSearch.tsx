import React, { useState } from "react";
import { Search, File, Users, Calendar, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useProjects } from "@/hooks/useProjects";
import { useNavigate } from "react-router-dom";

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  open,
  onOpenChange,
}) => {
  const { projects, users } = useProjects();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSelect = (value: string) => {
    const [type, id] = value.split(":");

    switch (type) {
      case "project":
        navigate(`/project/${id}`);
        break;
      case "user":
        navigate(`/profile/${id}`);
        break;
      case "task":
        // Find project containing this task
        const project = projects.find((p) => p.tasks.some((t) => t.id === id));
        if (project) {
          navigate(`/project/${project.id}`);
        }
        break;
    }

    onOpenChange(false);
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(query.toLowerCase()) ||
      project.description?.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTasks = projects.flatMap((project) =>
    project.tasks
      .filter(
        (task) =>
          task.title.toLowerCase().includes(query.toLowerCase()) ||
          task.description?.toLowerCase().includes(query.toLowerCase())
      )
      .map((task) => ({
        ...task,
        projectName: project.name,
        projectId: project.id,
      }))
  );

  const filteredUsers =
    users &&
    users.filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.user_roles?.name.toLowerCase().includes(query.toLowerCase())
    );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search projects, tasks, and people..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {filteredProjects.length > 0 && (
          <CommandGroup heading="Projects">
            {filteredProjects.slice(0, 5).map((project) => (
              <CommandItem
                key={project.id}
                value={`project:${project.id}`}
                onSelect={handleSelect}
                className="flex items-center gap-2"
              >
                <File className="h-4 w-4" />
                <div className="flex-1">
                  <p className="font-medium">{project.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {project.description || "No description"}
                  </p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {filteredTasks.length > 0 && (
          <CommandGroup heading="Tasks">
            {filteredTasks.slice(0, 5).map((task) => (
              <CommandItem
                key={task.id}
                value={`task:${task.id}`}
                onSelect={handleSelect}
                className="flex items-center gap-2"
              >
                <Hash className="h-4 w-4" />
                <div className="flex-1">
                  <p className="font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground">
                    in {task.projectName}
                  </p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {filteredUsers && filteredUsers.length > 0 && (
          <CommandGroup heading="People">
            {filteredUsers.map((user) => (
              <CommandItem
                key={user.id}
                value={`user:${user.id}`}
                onSelect={handleSelect}
                className="flex items-center gap-2"
              >
                <Avatar className="w-6 h-6">
                  {user && user?.profile_pic ? (
                    <img
                      src={user.profile_pic}
                      alt={user.name}
                      className="object-cover w-full"
                    />
                  ) : (
                    <AvatarFallback className="text-xs">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.user_roles?.name}
                  </p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
};
