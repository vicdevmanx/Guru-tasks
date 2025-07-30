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
import { X, Plus, Edit, Loader } from "lucide-react";
import { Project, useProjects } from "@/hooks/useProjects";
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
  project: Project | null;
}

export const EditProjectDialog: React.FC<EditProjectDialogProps> = ({
  open,
  onOpenChange,
  project,
}) => {
  const { updateProject } = useProjects();
  const users = useAuthStore((s) => s.users);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [assignees, setAssignees] = useState<User[]>([]);
  const [currentAssignee, setCurrentAssignee] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description || "");
      if (typeof project.image === "string") {
        setPreviewUrl(project.image);
      }
      if (project?.project_members)
        setAssignees(project.project_members.map((member: any) => member.user));
      console.log(project.project_members);
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    if (!project) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      toast("Please fill out all fields");
      return;
    }

    // Create project logic here
    const id = project.id;

    setLoading(true);
    await updateProject(
      name.trim(),
      description.trim() || undefined,
      assignees,
      image,
      id
    );
    toast.success(`Project "${name}" Saved successfully!`);
    setLoading(false);
    setName("");
    setDescription("");
    setAssignees([]);
    setCurrentAssignee("");
    onOpenChange(false);
    setImage(null);
    setPreviewUrl(null);
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
      <DialogContent className="sm:max-w-[500px] animate-in fade-in-0 zoom-in-95 duration-200 max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-left">Editing '{project && project.name}' Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <label htmlFor="image-upload" className="cursor-pointer relative">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-muted flex items-center justify-center border">
                {previewUrl ? (
                  <div className="relative w-full h-full">
                    <img
                      src={previewUrl}
                      alt="Project"
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity">
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
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
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
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || loading}>
              {loading && <Loader className="size-8 animate-spin" />}{" "}
              {loading ? "Updating..." : "Update Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
