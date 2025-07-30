import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  MessageCircle,
  MoreHorizontal,
  Filter,
  Search,
  Users,
  BarChart3,
  Calendar,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProjects } from "@/hooks/useProjects";
import { TaskCard } from "@/components/TaskCard";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { ProjectChat } from "@/components/ProjectChat";
import { Input } from "@/components/ui/input";

export const ProjectView = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, moveTaskToStatus, addTask, updateTask, deleteTask } =
    useProjects();
  const [showAddTask, setShowAddTask] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [showOverview, setShowOverview] = useState(false);

  const project = projects && projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen animate-fade-in">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Project not found
          </h1>
          <p className="text-muted-foreground">
            The project you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const onDragStart = () => {
    document.body.style.overflow = "hidden";
  };

  const onDragEnd = (result: DropResult) => {
    document.body.style.overflow = "";

    if (!result.destination) return;

    const sourceStatus = result.source.droppableId as
      | "todo"
      | "in-progress"
      | "done";
    const destinationStatus = result.destination.droppableId as
      | "todo"
      | "in-progress"
      | "done";

    if (sourceStatus !== destinationStatus) {
      moveTaskToStatus(project.id, result.draggableId, destinationStatus);
    }
  };

  const todoTasks = project.tasks.filter((task) => task.status === "todo");
  const inProgressTasks = project.tasks.filter(
    (task) => task.status === "in-progress"
  );
  const doneTasks = project.tasks.filter((task) => task.status === "done");
  const reviewTasks = project.tasks.filter((task) => task.status === "review");

  const statusColumns = [
    {
      id: "todo",
      title: "TO DO",
      tasks: todoTasks,
      count: todoTasks.length,
    },
    {
      id: "in-progress",
      title: "IN PROGRESS",
      tasks: inProgressTasks,
      count: inProgressTasks.length,
    },
    {
      id: "review",
      title: "REVIEW",
      tasks: reviewTasks,
      count: reviewTasks.length,
    },
    {
      id: "done",
      title: "COMPLETE",
      tasks: doneTasks,
      count: doneTasks.length,
    },
  ];

  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter(
    (task) => task.status === "done"
  ).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (showOverview) {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {project.name} Overview
            </h1>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
          <Button onClick={() => setShowOverview(false)} variant="outline">
            Back to Board
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTasks}</div>
              <p className="text-xs text-muted-foreground">Tasks in project</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Calendar className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTasks}</div>
              <p className="text-xs text-muted-foreground">Tasks in progress</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <BarChart3 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTasks}</div>
              <p className="text-xs text-muted-foreground">
                {completionRate}% completion rate
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Team Members
              </CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {project?.project_members.length}
              </div>
              <p className="text-xs text-muted-foreground">Active members</p>
            </CardContent>
          </Card>
        </div>

        {/* Team Section */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {project?.project_members.map((user) => (
                <Link
                to={`/profile/${user.user.id}`}
                  key={user.user.id}
                  className="flex items-center gap-3 p-0 rounded-lg hover:bg-accent"
                >
                  <Avatar>
                    {user && user?.user.profile_pic ? (
                      <img
                        src={user.user.profile_pic}
                        alt={user.user.name}
                        className="object-cover w-full"
                      />
                    ) : (
                      <AvatarFallback className="text-xs">
                        {user.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{user.user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.user.email}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {user.user?.user_roles?.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-border bg-background">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {project.name}
              </h1>
              {/* <p className="text-muted-foreground text-sm">
                {project.description}
              </p> */}
            </div>

            {/* Team Avatars */}
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {project &&
                  project?.project_members.slice(0, 3).map((user, index) => (
                    <Avatar
                      key={user?.user.id}
                      className="border-2 border-background w-8 h-8"
                    >
                      {user && user?.user.profile_pic ? (
                      <img
                        src={user.user.profile_pic}
                        alt={user.user.name}
                        className="object-cover w-full"
                      />
                    ) : (
                      <AvatarFallback className="text-xs">
                        {user.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    )}
                    </Avatar>
                  ))}
                {project?.project_members.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                    +{project?.project_members.length - 3}
                  </div>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="ml-2">
                    <Users className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  <div className="p-2">
                    <h4 className="font-medium mb-2">Team Members</h4>
                    {project?.project_members.map((user) => (
                      <Link
                        key={user?.user.id}
                        to={`/profile/${user.user.id}`}
                        className="flex items-center gap-2 p-2 rounded hover:bg-accent"
                      >
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {user && user?.user.profile_pic ? (
                      <img
                        src={user.user.profile_pic}
                        alt={user.user.name}
                        className="object-cover w-full"
                      />
                    ) : (
                      <AvatarFallback className="text-xs">
                        {user.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    )}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {user?.user.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user?.user.email}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setShowOverview(true)}
              >
                <BarChart3 className="h-4 w-4" />
                Overview
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowChat(!showChat)}
                className="gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Chat
              </Button>
              <Button
                size="sm"
                onClick={() => setShowAddTask(true)}
                className="gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        {/* <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-xs">
              Group: Status
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-xs">
              <Filter className="h-3 w-3" />
              Filter
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              Sort
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input 
                placeholder="Search tasks..." 
                className="pl-7 h-7 w-48 text-xs"
              />
            </div>
            <Button variant="ghost" size="sm" className="text-xs">
              Customize
            </Button>
          </div>
        </div> */}
      </div>

      {/* Board */}
      <div className="relative flex-1 p-2">
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <div className="relative flex gap-4 h-full overflow-x-auto overflow-y-hidden">
            {statusColumns.map((column) => (
              <div key={column.id} className="flex-shrink-0 w-64">
                <div className="flex items-center justify-between mb-3 px-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        column.id === "todo"
                          ? " bg-gray-400 "
                          : column.id === "in-progress"
                          ? "bg-blue-500"
                          : column.id === "done"
                          ? "bg-green-500"
                          : "bg-orange-500"
                      }`}
                    />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {column.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {column.count}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => {
                        setActiveColumn(column.id);
                        setShowAddTask(true);
                      }}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setShowAddTask(true)}>
                          Add Task
                        </DropdownMenuItem>
                        <DropdownMenuItem>Clear Column</DropdownMenuItem>
                        <DropdownMenuItem>Archive Tasks</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`space-y-2 p-2 rounded-lg transition-colors flex flex-col ${
                        snapshot.isDraggingOver ? "bg-accent/50" : ""
                      }`}
                      style={{
                        overflowY: "auto",
                        maxHeight: "calc(100vh - 200px)",
                        overscrollBehavior: "contain",
                      }}
                    >
                      {column.tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                              }}
                              className={`transition-all duration-200 ${
                                snapshot.isDragging
                                  ? "rotate-1 scale-105 shadow-2xl z-50"
                                  : ""
                              }`}
                            >
                              <TaskCard
                                task={task}
                                onUpdateTask={(updates) =>
                                  updateTask(project.id, task.id, updates)
                                }
                                onDeleteTask={() =>
                                  deleteTask(project.id, task.id)
                                }
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      <Button
                        variant="ghost"
                        className="w-full justify-start text-muted-foreground hover:text-foreground h-8 text-xs"
                        onClick={() => {
                          setActiveColumn(column.id);
                          setShowAddTask(true);
                        }}
                      >
                        <Plus className="h-3 w-3 mr-2" />
                        Add Task
                      </Button>
                    </div>
                  )}
                </Droppable>
              </div>
            ))}

            {/* <div className="flex-shrink-0 w-80">
              <Button
                variant="ghost"
                className="w-full h-12 border-2 border-dashed border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add group
              </Button>
            </div> */}
          </div>
        </DragDropContext>
      </div>

      <AddTaskDialog
        open={showAddTask}
        onOpenChange={(open) => {
          setShowAddTask(open);
          if (!open) setActiveColumn(null);
        }}
        onAddTask={(task) => {
          const taskWithStatus = activeColumn
            ? {
                ...task,
                status: activeColumn as "todo" | "review" | "in-progress" | "done",
              }
            : task;
          addTask(project.id, taskWithStatus);
        }}
      />

      {showChat && (
        <ProjectChat
          projectId={project.id}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
};
