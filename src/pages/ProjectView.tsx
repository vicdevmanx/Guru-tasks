
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MessageCircle } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { TaskCard } from '@/components/TaskCard';
import { AddTaskDialog } from '@/components/AddTaskDialog';
import { ProjectChat } from '@/components/ProjectChat';

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
      title: 'To Do', 
      tasks: todoTasks,
      color: 'border-l-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950/20'
    },
    { 
      id: 'in-progress', 
      title: 'In Progress', 
      tasks: inProgressTasks,
      color: 'border-l-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/20'
    },
    { 
      id: 'done', 
      title: 'Done', 
      tasks: doneTasks,
      color: 'border-l-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950/20'
    },
  ];

  return (
    <div className="relative h-screen flex overflow-hidden">
      <div className="flex-1 p-6 space-y-6 overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowChat(!showChat)}
              className="gap-2 transition-smooth hover:scale-105"
            >
              <MessageCircle className="h-4 w-4" />
              Chat
            </Button>
            <Button 
              onClick={() => setShowAddTask(true)} 
              className="gap-2 transition-smooth hover:scale-105"
            >
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)] overflow-auto">
            {statusColumns.map(column => (
              <Card key={column.id} className={`flex flex-col ${column.color} border-l-4 transition-smooth hover:shadow-lg`}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-sm font-medium">
                    <span className="uppercase tracking-wide text-foreground">{column.title}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${column.bgColor} border`}>
                      {column.tasks.length}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto p-3">
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`space-y-3 min-h-32 p-2 rounded-lg transition-all duration-200 ${
                          snapshot.isDraggingOver 
                            ? `${column.bgColor} ring-2 ring-primary/30 scale-[1.02]` 
                            : ''
                        }`}
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
                                    : 'hover:scale-[1.02] hover:shadow-md'
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
                      </div>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            ))}
          </div>
        </DragDropContext>

        <AddTaskDialog
          open={showAddTask}
          onOpenChange={setShowAddTask}
          onAddTask={(task) => addTask(project.id, task)}
        />
      </div>

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
