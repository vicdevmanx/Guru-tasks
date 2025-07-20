import React, { useState, KeyboardEvent, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { X, Plus, Edit, Loader} from "lucide-react";
import { useProjects, Project } from "@/hooks/useProjects";
import { useAuthStore, User } from "@/store/authstore";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import { toast } from "sonner";

interface EditProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
}

export const EditProjectDialog: React.FC<EditProjectDialogProps> = ({
  open,
  onOpenChange,
  project,
}) => {
  const { addProject, updateProject } = useProjects();
  const users = useAuthStore((s) => s.users);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [assignees, setAssignees] = useState<User[]>([]);
  const [currentAssignee, setCurrentAssignee] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)

  // Initialize form with project data when editing
  useEffect(() => {
    if (open) {
      if (project) {
        setName(project.name);
        setDescription(project.description || '');
        setAssignees(project.project_members?.map(member => member.user) || []);
        if (typeof project.image === 'string' && project.image) {
          setPreviewUrl(project.image);
        }
      } else {
        setName("");
        setDescription("");
        setAssignees([]);
        setCurrentAssignee("");
        setImage(null);
        setPreviewUrl(null);
      }
    }
  }, [project, open]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setName("");
      setDescription("");
      setAssignees([]);
      setCurrentAssignee("");
      setImage(null);
      setPreviewUrl(null);
      setLoading(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      toast("Please fill out all fields");
      return;
    }

    setLoading(true);
    
    try {
      if (project) {
        // Update existing project
        updateProject(project.id, {
          name: name.trim(),
          description: description.trim(),
          project_members: assignees.map(user => ({
            access_role: 'member',
            created_at: new Date().toISOString(),
            user: {
              ...user,
              profile_pic: user.profile_pic || ''
            },
            email: user.email,
            id: user.id,
            name: user.name,
            password: '',
          })),
          image,
        });
        toast.success(`Project "${name}" updated successfully!`);
      } else {
        // Create new project
        await addProject(
          name.trim(),
          description.trim() || undefined,
          assignees,
          image
        );
        toast.success(`Project "${name}" created successfully!`);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      onOpenChange(false);
    }
  };

  const handleAddAssignee = () => {
    if (!currentAssignee.trim()) return;

    const user =
      users &&
      users.find(
        (u) =>
          u.name.toLowerCase().includes(currentAssignee.toLowerCase()) ||
          u.email.toLowerCase().includes(currentAssignee.toLowerCase())
      );

    if (user && !assignees.find((a) => a.id === user.id)) {
      setAssignees((prev) => [...prev, user]);
      setCurrentAssignee("");
    }
  };

  const handleAssigneeKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddAssignee();
    }
  };

  const removeAssignee = (userId: string) => {
    setAssignees((prev) => prev.filter((a) => a.id !== userId));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] animate-in fade-in-0 zoom-in-95 data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out duration-200 max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-left">
            {project ? 'Edit Project' : 'Create New Project'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <label htmlFor="image-upload" className="cursor-pointer relative">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-muted flex items-center justify-center border hover:border-primary/50 transition-colors">
                {previewUrl ? (
                  <div className="relative w-full h-full">
                    <img
                      src={previewUrl}
                      alt="Project"
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity hover:bg-black/60">
                      <span className="text-white">
                        <Edit className="size-6" />
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className=" text-muted-foreground">
                    <Plus className="size-6" />
                  </span>
                )}
              </div>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                disabled={loading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImage(file);
                    setPreviewUrl(URL.createObjectURL(file));
                  } else {
                    setImage(null);
                    setPreviewUrl(null);
                  }
                }}
              />
            </label>
            <div className="space-y-2 flex-1">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={name}
                disabled={loading}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter project name..."
                autoFocus
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
               disabled={loading}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description..."
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assignees">Assignees</Label>
            <Command className="w-full border rounded-md">
              <div className="relative">
                <Input
                  placeholder="Type name or email..."
                  value={currentAssignee}
                   disabled={loading}
                  onChange={(e) => {
                    setCurrentAssignee(e.target.value);
                  }}
                  className="border-0 outline-0 focus:border-transparent focus:outline-transparent rounded-none"
                />
                {currentAssignee && (
                  <div className="absolute z-50 w-full border rounded-md bg-background text-sm max-h-32 overflow-y-auto">
                    {users
                      ?.filter(
                        (u) =>
                          (u.name
                            ?.toLowerCase()
                            .includes(currentAssignee.toLowerCase()) ||
                            u.email
                              ?.toLowerCase()
                              .includes(currentAssignee.toLowerCase())) &&
                          !assignees.find((a) => a.id === u.id)
                      )
                      .map((user) => (
                        <div
                          key={user.id}
                          className="px-3 py-2 hover:bg-muted cursor-pointer"
                          onClick={() => {
                            setAssignees((prev) => [...prev, user]);
                            setCurrentAssignee("");
                          }}
                        >
                          {user.name}{" "}
                          <span className="text-xs text-muted-foreground">
                            ({user.email})
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <CommandList
                key={currentAssignee} // 🔑 force refresh when input changes
                className="h-28 overflow-y-auto"
              >
                {users
                  ?.filter(
                    (u) =>
                      (u.name
                        ?.toLowerCase()
                        .includes(currentAssignee.toLowerCase()) ||
                        u.email
                          ?.toLowerCase()
                          .includes(currentAssignee.toLowerCase())) &&
                      !assignees.find((a) => a.id === u.id)
                  )
                  .map((user) => (
                    <CommandItem
                      key={user.id}
                      onSelect={() => {
                        setAssignees((prev) => [...prev, user]);
                        setCurrentAssignee("");
                      }}
                    >
                      {user.name}{" "}
                      <span className="text-xs text-muted-foreground">
                        ({user.email})
                      </span>
                    </CommandItem>
                  ))}
              </CommandList>
            </Command>
            <div
              className={`${assignees.length > 0 && "h-16"} overflow-y-auto`}
            >
              {assignees.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 ">
                  {assignees.map((user) => (
                    <Badge
                      key={user.id}
                      variant="secondary"
                      className="flex items-center gap-1.5 p-1.5"
                    >
                      <Avatar className="w-4 h-4">
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
                      {user.name}
                      <button
                        title="remove assigned user"
                        type="button"
                        onClick={() => removeAssignee(user.id)}
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="transition-all duration-200 hover:scale-105"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!name.trim() || loading}
              className="transition-all duration-200 hover:scale-105"
            >
              {loading && <Loader className='size-4 animate-spin mr-2'/>} 
              {loading ? (project ? "Updating..." : "Creating...") : (project ? "Update Project" : "Create Project")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};


