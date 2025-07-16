import React, { useState, KeyboardEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar"; // 👈 Make sure you have a Calendar or DatePicker
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { X, Plus, CalendarIcon } from "lucide-react";
import { format } from "date-fns"; // Install date-fns if you don’t have it
import { Task, useProjects } from "@/hooks/useProjects";
import { User } from "@/store/authstore";

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTask: (task: Omit<Task, "id" | "createdAt">) => void;
}

export const AddTaskDialog: React.FC<AddTaskDialogProps> = ({
  open,
  onOpenChange,
  onAddTask,
}) => {
  const { users } = useProjects();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo" as Task["status"],
    priority: "medium" as Task["priority"],
    assignee: null as User | null,
    due_date: null as Date | undefined | null,
  });

  const [currentAssignee, setCurrentAssignee] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onAddTask({
      title: formData.title,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      assignees: formData.assignee ? [formData.assignee] : [],
      due_date: formData.due_date || null,
    });

    // console.log(formData)

    setFormData({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      assignee: null,
      due_date: null,
    });
    setCurrentAssignee("");
    onOpenChange(false);
  };

  const handleSelectAssignee = (user: User) => {
    setFormData((prev) => ({ ...prev, assignee: user }));
    setCurrentAssignee("");
  };

  const removeAssignee = () => {
    setFormData((prev) => ({ ...prev, assignee: null }));
  };

  const filteredUsers =
    users?.filter(
      (u) =>
        u.name.toLowerCase().includes(currentAssignee.toLowerCase()) ||
        u.email.toLowerCase().includes(currentAssignee.toLowerCase())
    ) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-screen">
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
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Task["status"]) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: Task["priority"]) =>
                  setFormData((prev) => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* DUE DATE */}
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.due_date ? (
                    format(formData.due_date, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.due_date || undefined}
                  onSelect={(date) =>
                    setFormData((prev) => ({ ...prev, due_date: date }))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* ASSIGNEE */}
          <div className="space-y-2">
            <Label>Assignee</Label>
            {!formData.assignee ? (
              <>
                <Input
                  value={currentAssignee}
                  onChange={(e) => setCurrentAssignee(e.target.value)}
                  placeholder="Type name or email"
                />
                {currentAssignee.trim() && (
                  <div className="border rounded-md max-h-32 overflow-y-auto mt-1 bottom-32 absolute z-5 bg-background">
                    {filteredUsers.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleSelectAssignee(user)}
                        className="w-full text-left px-2 py-1 hover:bg-accent flex items-center gap-2"
                      >
                        <Avatar className="w-5 h-5">
                          {user && user.profile_pic ? (
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
                        <span>
                          {user.name} ({user.email})
                        </span>
                      </button>
                    ))}
                    {filteredUsers.length === 0 && (
                      <div className="px-2 py-1 text-muted-foreground text-xs">
                        No match found
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <Badge className="flex items-center text-sm gap-2 py-2 pr-1">
                <Avatar className="w-6 h-6">
                  {formData && formData.assignee.profile_pic ? (
                    <img
                      src={formData.assignee.profile_pic}
                      alt={formData.assignee.name}
                      className="object-cover w-full"
                    />
                  ) : (
                    <AvatarFallback className="text-sm">
                      {formData.assignee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  )}
                </Avatar>
                {formData.assignee.name}
                <button
                  title="Remove assignee"
                  type="button"
                  onClick={removeAssignee}
                  className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
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
