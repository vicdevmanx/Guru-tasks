
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MessageCircle, MoreHorizontal, Filter, Search, Users } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { TaskCard } from '@/components/TaskCard';
import { AddTaskDialog } from '@/components/AddTaskDialog';
import { ProjectChat } from '@/components/ProjectChat';
import { Input } from '@/components/ui/input';

export const ProjectView = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, moveTaskToStatus, addTask, updateTask, deleteTask } = useProjects();
  const [showAddTask, setShowAddTask] = useState(false);
  const [showChat, setShowChat] = useState(false);

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

    // If dropped in different column, update status
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

  return (
    <div className="relative h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-border bg-background">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
            <p className="text-muted-foreground text-sm">{project.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Users className="h-4 w-4" />
              Share
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

        {/* Toolbar */}
        <div className="flex items-center justify-between">
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
            <Button variant="ghost" size="sm" className="text-xs">
              Closed
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              Assignee
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                className="pl-7 h-7 w-48 text-xs"
              />
            </div>
            <Button variant="ghost" size="sm" className="text-xs">
              Customize
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-xs bg-blue-600 text-white hover:bg-blue-700">
              <Plus className="h-3 w-3" />
              Add Task
            </Button>
          </div>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 p-4 overflow-hidden">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 h-full overflow-x-auto">
            {statusColumns.map(column => (
              <div key={column.id} className="flex-shrink-0 w-80">
                <div className="flex items-center justify-between mb-3 px-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      column.id === 'todo' ? 'bg-gray-400' :
                      column.id === 'in-progress' ? 'bg-blue-500' :
                      'bg-green-500'
                    }`} />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {column.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {column.count}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`space-y-2 min-h-96 p-2 rounded-lg transition-colors ${
                        snapshot.isDraggingOver 
                          ? 'bg-accent/50' 
                          : ''
                      }`}
                      style={{
                        overflowY: 'auto',
                        maxHeight: 'calc(100vh - 200px)',
                        scrollbarWidth: 'thin'
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
                                  ? 'rotate-2 scale-105 shadow-2xl z-50' 
                                  : ''
                              }`}
                              style={{
                                ...provided.draggableProps.style,
                                // Fix for scroll issue during drag
                                position: snapshot.isDragging ? 'fixed' : 'relative'
                              }}
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
                      
                      {/* Add Task Button */}
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-muted-foreground hover:text-foreground h-8 text-xs"
                        onClick={() => setShowAddTask(true)}
                      >
                        <Plus className="h-3 w-3 mr-2" />
                        Add Task
                      </Button>
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
            
            {/* Add Group Button */}
            <div className="flex-shrink-0 w-80">
              <Button 
                variant="ghost" 
                className="w-full h-12 border-2 border-dashed border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add group
              </Button>
            </div>
          </div>
        </DragDropContext>
      </div>

      <AddTaskDialog
        open={showAddTask}
        onOpenChange={setShowAddTask}
        onAddTask={(task) => addTask(project.id, task)}
      />

      {/* Chat Overlay */}
      {showChat && (
        <ProjectChat 
          projectId={project.id} 
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
};
