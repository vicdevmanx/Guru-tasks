import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Plus, 
  MoreHorizontal, 
  ArrowLeft, 
  Users, 
  Calendar, 
  CheckCircle, 
  Clock,
  Target,
  TrendingUp
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProjects, TaskStatus, Task } from '@/hooks/useProjects';
import { TaskCard } from '@/components/TaskCard';
import { AddTaskDialog } from '@/components/AddTaskDialog';

const statusConfig = {
  'todo': { title: 'To Do', color: 'bg-slate-100', count: 0 },
  'in-progress': { title: 'In Progress', color: 'bg-blue-100', count: 0 },
  'in-review': { title: 'In Review', color: 'bg-yellow-100', count: 0 },
  'done': { title: 'Done', color: 'bg-green-100', count: 0 }
};

export const ProjectView = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, moveTask, updateTask, deleteTask } = useProjects();
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>('todo');
  
  const project = projects.find(p => p.id === projectId);
  
  if (!project) {
    return (
      <div className="p-4 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Project not found</h2>
          <Link to="/" className="text-primary hover:underline mt-2 inline-block">
            Go back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const taskCounts = project.tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<TaskStatus, number>);

  const completionRate = project.tasks.length > 0 
    ? Math.round((taskCounts['done'] || 0) / project.tasks.length * 100) 
    : 0;

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const { source, destination, draggableId } = result;
    
    if (source.droppableId !== destination.droppableId) {
      moveTask(
        projectId!,
        draggableId,
        destination.droppableId as TaskStatus
      );
    }
  };

  const handleAddTask = (status: TaskStatus) => {
    setSelectedStatus(status);
    setShowAddTask(true);
  };

  const handleStatusMenuAction = (status: TaskStatus, action: string) => {
    console.log(`${action} for ${status} column`);
    // Add your logic here for different actions
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return project.tasks.filter(task => task.status === status);
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    updateTask(projectId!, taskId, updates);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(projectId!, taskId);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-accent rounded-lg transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {project.description || 'No description provided'}
            </p>
          </div>
        </div>
        
        {/* Project Team Avatars */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {project.assignees.slice(0, 4).map((user) => (
              <DropdownMenu key={user.id}>
                <DropdownMenuTrigger asChild>
                  <Avatar className="border-2 border-background w-8 h-8 cursor-pointer hover:scale-110 transition-transform">
                    <AvatarFallback className="text-xs font-medium">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">{user.role}</p>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Send Message</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
            {project.assignees.length > 4 && (
              <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                +{project.assignees.length - 4}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">{project.tasks.length}</p>
              </div>
              <Target className="h-4 w-4 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{taskCounts['in-progress'] || 0}</p>
              </div>
              <Clock className="h-4 w-4 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{taskCounts['done'] || 0}</p>
              </div>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Progress</p>
                <p className="text-2xl font-bold">{completionRate}%</p>
              </div>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(statusConfig).map(([status, config]) => {
            const tasks = getTasksByStatus(status as TaskStatus);
            
            return (
              <div key={status} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{config.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {tasks.length}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleAddTask(status as TaskStatus)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleStatusMenuAction(status as TaskStatus, 'clear')}>
                          Clear All
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusMenuAction(status as TaskStatus, 'sort')}>
                          Sort Tasks
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusMenuAction(status as TaskStatus, 'archive')}>
                          Archive Done
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[200px] p-2 rounded-lg transition-colors ${
                        snapshot.isDraggingOver ? 'bg-accent/50' : 'bg-muted/30'
                      }`}
                    >
                      <div className="space-y-2">
                        {tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`${
                                  snapshot.isDragging ? 'rotate-2 scale-105' : ''
                                } transition-transform`}
                              >
                                <TaskCard 
                                  task={task} 
                                  onUpdateTask={(updates) => handleUpdateTask(task.id, updates)}
                                  onDeleteTask={() => handleDeleteTask(task.id)}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      <AddTaskDialog
        open={showAddTask}
        onOpenChange={setShowAddTask}
        projectId={projectId!}
        initialStatus={selectedStatus}
      />
    </div>
  );
};
