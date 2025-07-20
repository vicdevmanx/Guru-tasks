import React, { useState } from "react";
import {
  MoreVertical,
  Edit3,
  Trash2,
  Archive,
  Copy,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Project } from "@/hooks/useProjects";

interface ProjectMenuProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
}

export const ProjectMenu: React.FC<ProjectMenuProps> = ({
  project,
  onEdit,
  onDelete,
  onDuplicate,
  onArchive,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-accent"
          // onClick={(e) => e.preventDefault()}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => {
            setOpen(false);
            onEdit();
          }}
          className="cursor-pointer"
        >
          <Edit3 className="mr-2 h-4 w-4" />
          Edit Project
        </DropdownMenuItem>
        {/* <DropdownMenuItem onClick={onDuplicate} className="cursor-pointer">
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem> */}
        <DropdownMenuItem className="cursor-pointer">
          <Users className="mr-2 h-4 w-4" />
          Manage Members
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem onClick={onArchive} className="cursor-pointer">
          <Archive className="mr-2 h-4 w-4" />
          Archive
        </DropdownMenuItem> */}
        <DropdownMenuItem
          onClick={() => {
            onDelete();
            setOpen(false);
          }}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
