
import { useState } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  department: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  tasks: Task[];
  assignees: User[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignees: User[];
  createdAt: Date;
  dueDate?: Date;
}

export interface ChatMessage {
  id: string;
  projectId: string;
  message: string;
  sender: string;
  timestamp: Date;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '',
    role: 'Project Manager',
    department: 'Engineering'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: '',
    role: 'Designer',
    department: 'Design'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    avatar: '',
    role: 'Developer',
    department: 'Engineering'
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    avatar: '',
    role: 'QA Engineer',
    department: 'Quality Assurance'
  }
];

const initialProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete redesign of company website',
    createdAt: new Date(),
    assignees: [mockUsers[0], mockUsers[1]],
    tasks: [
      {
        id: 'task-1',
        title: 'Design mockups',
        description: 'Create initial design mockups for the homepage',
        status: 'todo',
        priority: 'high',
        assignees: [mockUsers[1]],
        createdAt: new Date(),
      },
      {
        id: 'task-2',
        title: 'Implement header',
        description: 'Code the new header component',
        status: 'in-progress',
        priority: 'medium',
        assignees: [mockUsers[2]],
        createdAt: new Date(),
      },
      {
        id: 'task-3',
        title: 'Test on mobile',
        description: 'Ensure mobile responsiveness',
        status: 'done',
        priority: 'low',
        assignees: [mockUsers[3]],
        createdAt: new Date(),
      },
    ],
  },
];

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [users] = useState<User[]>(mockUsers);

  const addProject = (name: string, description?: string, assignees: User[] = []) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      description,
      createdAt: new Date(),
      tasks: [],
      assignees,
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === id ? { ...project, ...updates } : project
      )
    );
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  const addTask = (projectId: string, task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    setProjects(prev =>
      prev.map(project =>
        project.id === projectId
          ? { ...project, tasks: [...project.tasks, newTask] }
          : project
      )
    );
  };

  const updateTask = (projectId: string, taskId: string, updates: Partial<Task>) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.map(task =>
                task.id === taskId ? { ...task, ...updates } : task
              ),
            }
          : project
      )
    );
  };

  const deleteTask = (projectId: string, taskId: string) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.filter(task => task.id !== taskId),
            }
          : project
      )
    );
  };

  const moveTaskToStatus = (projectId: string, taskId: string, newStatus: Task['status']) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.map(task =>
                task.id === taskId ? { ...task, status: newStatus } : task
              ),
            }
          : project
      )
    );
  };

  const reorderTasks = (projectId: string, sourceIndex: number, destinationIndex: number) => {
    setProjects(prev =>
      prev.map(project => {
        if (project.id === projectId) {
          const newTasks = Array.from(project.tasks);
          const [reorderedTask] = newTasks.splice(sourceIndex, 1);
          newTasks.splice(destinationIndex, 0, reorderedTask);
          return { ...project, tasks: newTasks };
        }
        return project;
      })
    );
  };

  const addChatMessage = (projectId: string, message: string, sender: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      projectId,
      message,
      sender,
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const getProjectChatMessages = (projectId: string) => {
    return chatMessages.filter(msg => msg.projectId === projectId);
  };

  return {
    projects,
    users,
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    moveTaskToStatus,
    reorderTasks,
    chatMessages,
    addChatMessage,
    getProjectChatMessages,
  };
};
