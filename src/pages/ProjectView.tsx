
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
  const { projects, reorderTasks, addTask, updateTask, deleteTask } = useProjects();
  const [showAddTask, setShowAddTask] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Project not found</h1>
          <p className="text-muted-foreground">The project you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    reorderTasks(
      project.id,
      result.source.index,
      result.destination.index
    );
  };

  const todoTasks = project.tasks.filter(task => task.status === 'todo');
  const inProgressTasks = project.tasks.filter(task => task.status === 'in-progress');
  const doneTasks = project.tasks.filter(task => task.status === 'done');

  const tasksByStatus = {
    todo: todoTasks,
    'in-progress': inProgressTasks,
    done: doneTasks,
  };

  const statusColumns = [
    { id: 'todo', title: 'To Do', tasks: todoTasks },
    { id: 'in-progress', title: 'In Progress', tasks: inProgressTasks },
    { id: 'done', title: 'Done', tasks: doneTasks },
  ];

  return (
    <div className="h-screen flex">
      <div className={`flex-1 p-6 space-y-6 ${showChat ? 'pr-3' : ''}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowChat(!showChat)}
              className="gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Chat
            </Button>
            <Button onClick={() => setShowAddTask(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            {statusColumns.map(column => (
              <Card key={column.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {column.title}
                    <span className="text-sm bg-muted px-2 py-1 rounded">
                      {column.tasks.length}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto">
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`space-y-3 min-h-32 p-2 rounded-lg transition-colors ${
                          snapshot.isDraggingOver ? 'bg-accent/50' : ''
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
                                className={`transition-transform ${
                                  snapshot.isDragging ? 'rotate-3 scale-105' : ''
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

      {showChat && (
        <div className="w-80 border-l bg-card">
          <ProjectChat projectId={project.id} />
        </div>
      )}
    </div>
  );
};
