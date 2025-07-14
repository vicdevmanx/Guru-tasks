import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { User } from "@/store/authstore";

export function AssigneeSelector({
  users,
  assignees,
  setAssignees,
}: {
  users: User[];
  assignees: User[];
  setAssignees: React.Dispatch<React.SetStateAction<User[]>>;
}) {
  const [query, setQuery] = useState("");

  const filteredUsers = query.length
    ? users.filter(
        (u) =>
          (u.name?.toLowerCase().includes(query.toLowerCase()) ||
            u.email?.toLowerCase().includes(query.toLowerCase())) &&
          !assignees.find((a) => a.id === u.id)
      )
    : [];

  const handleSelectUser = (user: User) => {
    setAssignees((prev) => [...prev, user]);
    setQuery("");
  };

  const removeAssignee = (userId: string) => {
    setAssignees((prev) => prev.filter((a) => a.id !== userId));
  };

  return (
    <div className="space-y-2">
      <label htmlFor="assignees">Assignees</label>
      <input
        id="assignees"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type name or email..."
        className="w-full border px-3 py-2 rounded"
      />
      {filteredUsers.length > 0 && (
        <ul className="border rounded bg-white shadow mt-1 max-h-40 overflow-y-auto">
          {filteredUsers.map((user) => (
            <li
              key={user.id}
              onClick={() => handleSelectUser(user)}
              className="px-3 py-2 hover:bg-muted cursor-pointer"
            >
              {user.name} <span className="text-xs text-gray-500">({user.email})</span>
            </li>
          ))}
        </ul>
      )}
      {assignees.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {assignees.map((user) => (
            <Badge
              key={user.id}
              variant="secondary"
              className="flex items-center gap-2 pr-1"
            >
              <Avatar className="w-4 h-4">
                <AvatarFallback className="text-xs">
                  {user.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              {user.name}
              <button
              title="remove assignee"
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
  );
}
