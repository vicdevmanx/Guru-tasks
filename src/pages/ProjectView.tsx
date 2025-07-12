
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, MessageCircle, MoreHorizontal, Filter, Search, Users, BarChart3, Calendar, Grid3X3, List } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProjects } from '@/hooks/useProjects';
import { TaskCard } from '@/components/TaskCard';
import { AddTaskDialog } from '@/components/AddTaskDialog';
import { ProjectChat } from '@/components/ProjectChat';
import { Input } from '@/components/ui/input';

export const ProjectView = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects, moveTaskToStatus, addTask, updateTask, deleteTask } = useProjects();
  const [showAddTask, setShowAddTask] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('board');

  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen animate-fade-in">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Project not found</h1>
          <p className="text-muted-foreground">The project you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceStatus = result.source.droppableId as 'todo' | 'in-progress' | 'done';
    const destinationStatus = result.destination.droppableId as 'todo' | 'in-progress' | 'done';

    if (sourceStatus !== destinationStatus) {
      moveTaskToStatus(project.id, result.draggableId, destinationStatus);
    }
  };

  const todoTasks = project.tasks.filter(task => task.status === 'todo');
  const inProgressTasks = project.tasks.filter(task => task.status === 'in-progress');
  const doneTasks = project.tasks.filter(task => task.status === 'done');

  const statusColumns = [
    { 
      id: 'todo', 
      title: 'TO DO', 
      tasks: todoTasks,
      count: todoTasks.length
    },
    { 
      id: 'in-progress', 
      title: 'IN PROGRESS', 
      tasks: inProgressTasks,
      count: inProgressTasks.length
    },
    { 
      id: 'done', 
      title: 'COMPLETE', 
      tasks: doneTasks,
      count: doneTasks.length
    },
  ];

  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter(task => task.status === 'done').length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const OverviewContent = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <List className="h-4 w-4 text-blue-500" />
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
            <p className="text-xs text-muted-foreground">{completionRate}% completion rate</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.assignees.length}</div>
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
            {project.assignees.map(user => (
              <div 
                key={user.id} 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                onClick={() => navigate(`/profile/${user.id}`)}
              >
                <Avatar>
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const BoardContent = () => (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 h-full overflow-x-auto pb-4">
        {statusColumns.map(column => (
          <div key={column.id} className="flex-shrink-0 w-80">
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  column.id === 'todo' ? 'bg-gray-400' :
                  column.id === 'in-progress' ? 'bg-blue-500' :
                  'bg-green-500'
                }`} />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {column.title}
                </span>
                <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {column.count}
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => {
                    setActiveColumn(column.id);
                    setShowAddTask(true);
                  }}>
                    Add Task
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Clear Column
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`space-y-3 min-h-96 p-3 rounded-lg transition-colors ${
                    snapshot.isDraggingOver 
                      ? 'bg-accent/50' 
                      : 'bg-muted/20'
                  }`}
                  style={{
                    overflowY: 'auto',
                    maxHeight: 'calc(100vh - 300px)',
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
                          className={`transition-all duration-200 ${
                            snapshot.isDragging 
                              ? 'rotate-1 scale-105 shadow-lg z-50' 
                              : ''
                          }`}
                        >
                          <TaskCard
                            task={task}
                            onUpdateTask={(updates) =>
                              updateTask(project.id, task.id, updates)
                            }
                            onDeleteTask={() => deleteTask(project.id, task.id)}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-muted-foreground hover:text-foreground h-10 border-2 border-dashed border-border hover:border-primary/50"
                    onClick={() => {
                      setActiveColumn(column.id);
                      setShowAddTask(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-border bg-background">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
              <p className="text-muted-foreground text-sm">{project.description}</p>
            </div>
            
            {/* Team Avatars */}
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {project.assignees.slice(0, 3).map((user) => (
                  <Avatar key={user.id} className="border-2 border-background w-8 h-8 cursor-pointer hover:z-10" onClick={() => navigate(`/profile/${user.id}`)}>
                    <AvatarFallback className="text-xs">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {project.assignees.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                    +{project.assignees.length - 3}
                  </div>
                )}
              </div>
            </div>
         

          <div className="flex items-center gap-2">
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
              className="gap-2"
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
      <div className="relative flex-1 p-4 overflow-hidden">
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <div className="relative flex gap-4 h-full overflow-x-auto overflow-y-hidden">
            {statusColumns.map((column) => (
              <div key={column.id} className="flex-shrink-0 w-80">
                <div className="flex items-center justify-between mb-3 px-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        column.id === "todo"
                          ? " bg-gray-400 "
                          : column.id === "in-progress"
                          ? "bg-blue-500"
                          : column.id === "done" ? "bg-green-500" : "bg-orange-500"
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
              </div>
            )}
          </div>
        </Tabs>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} className="h-full">
          <TabsContent value="overview" className="h-full p-6 overflow-auto">
            <OverviewContent />
          </TabsContent>
          <TabsContent value="board" className="h-full p-6 overflow-hidden">
            <BoardContent />
          </TabsContent>
        </Tabs>
      </div>

      <AddTaskDialog
        open={showAddTask}
        onOpenChange={(open) => {
          setShowAddTask(open);
          if (!open) setActiveColumn(null);
        }}
        onAddTask={(task) => {
          const taskWithStatus = activeColumn 
            ? { ...task, status: activeColumn as 'todo' | 'in-progress' | 'done' }
            : task;
          addTask(project.id, taskWithStatus);
        }}
        projectId={project.id}
        initialStatus={activeColumn as 'todo' | 'in-progress' | 'done' || 'todo'}
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
