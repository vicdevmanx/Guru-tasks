import API, { baseURL } from "@/components/axios";
import { useAuthStore, User } from "@/store/authstore";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   avatar?: string;
//   role: string;
//   department: string;
// }

type Members = {
  access_role: string;
  created_at: string;
  user: { id: string; name: string; email: string; profile_pic: string };
  email: string;
  id: string;
  name: string;
  password: string;
  profile_pic?: string;
  reset_token?: string | null;
  reset_token_expires_at?: string | null;
  tasks?: [];
  user_roles?: { id: number; name: string };
  suspended?: boolean;
};

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  tasks: Task[];
  assignees?: User[];
  project_members: Members[] | [];
  image?: File | null;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: "low" | "medium" | "high";
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

// const mockUsers: User[] = [
//   {
//     id: '1',
//     name: 'John Doe',
//     email: 'john.doe@example.com',
//     avatar: '',
//     role: 'Project Manager',
//     department: 'Engineering'
//   },
//   {
//     id: '2',
//     name: 'Jane Smith',
//     email: 'jane.smith@example.com',
//     avatar: '',
//     role: 'Designer',
//     department: 'Design'
//   },
//   {
//     id: '3',
//     name: 'Mike Johnson',
//     email: 'mike.johnson@example.com',
//     avatar: '',
//     role: 'Developer',
//     department: 'Engineering'
//   },
//   {
//     id: '4',
//     name: 'Sarah Wilson',
//     email: 'sarah.wilson@example.com',
//     avatar: '',
//     role: 'QA Engineer',
//     department: 'Quality Assurance'
//   }
// ];

// const initialProjects: Project[] = [
//   {
//     id: '1',
//     name: 'Website Redesign',
//     description: 'Complete redesign of company website',
//     createdAt: new Date(),
//     assignees: [mockUsers[0], mockUsers[1]],
//     tasks: [
//       {
//         id: 'task-1',
//         title: 'Design mockups',
//         description: 'Create initial design mockups for the homepage',
//         status: 'todo',
//         priority: 'high',
//         assignees: [mockUsers[1]],
//         createdAt: new Date(),
//       },
//       {
//         id: 'task-2',
//         title: 'Implement header',
//         description: 'Code the new header component',
//         status: 'in-progress',
//         priority: 'medium',
//         assignees: [mockUsers[2]],
//         createdAt: new Date(),
//       },
//       {
//         id: 'task-3',
//         title: 'Test on mobile',
//         description: 'Ensure mobile responsiveness',
//         status: 'done',
//         priority: 'low',
//         assignees: [mockUsers[3]],
//         createdAt: new Date(),
//       },
//        {
//         id: 'task-4',
//         title: 'Test on mobile',
//         description: 'Ensure mobile responsiveness',
//         status: 'review',
//         priority: 'low',
//         assignees: [mockUsers[3]],
//         createdAt: new Date(),
//       },
//     ],
//   },

//    {
//     id: '2',
//     name: 'Guru Task system',
//     description: 'Complete redesign of company website',
//     createdAt: new Date(),
//     assignees: [mockUsers[0], mockUsers[1]],
//     tasks: [
//       {
//         id: 'task-1',
//         title: 'Design mockups',
//         description: 'Create initial design mockups for the homepage',
//         status: 'todo',
//         priority: 'high',
//         assignees: [mockUsers[1]],
//         createdAt: new Date(),
//       },
//       {
//         id: 'task-2',
//         title: 'Implement header',
//         description: 'Code the new header component',
//         status: 'in-progress',
//         priority: 'medium',
//         assignees: [mockUsers[2]],
//         createdAt: new Date(),
//       },
//       {
//         id: 'task-3',
//         title: 'Test on mobile',
//         description: 'Ensure mobile responsiveness',
//         status: 'done',
//         priority: 'low',
//         assignees: [mockUsers[3]],
//         createdAt: new Date(),
//       },
//        {
//         id: 'task-4',
//         title: 'Test on mobile',
//         description: 'Ensure mobile responsiveness',
//         status: 'review',
//         priority: 'low',
//         assignees: [mockUsers[3]],
//         createdAt: new Date(),
//       },
//     ],
//   },

// ];

export const useProjects = () => {
  const projects = useAuthStore((s) => s.projects);
  const setProjects = useAuthStore((s) => s.setProjects);
  
//  const storeProjects = []
//   const [ nice, setProjects] = useState<Project[]>(storeProjects || []);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  // const [users] = useState<User[]>(mockUsers);
  const users = useAuthStore((s) => s.users);

  const fetchProjects = useAuthStore((s) => s.fetchProjects);
  const fetchAllUsers = useAuthStore((s) => s.fetchAllUsers);
  useEffect(() => {
    if (!users) return;
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (!projects) return;
    fetchProjects();
  }, []);

  const addProject = async (
    name: string,
    description?: string,
    assignees: User[] = [],
    image: File | null = null
  ) => {
    // const newProject: Project = {
    //   id: Date.now().toString(),
    //   name,
    //   description,
    //   createdAt: new Date(),
    //   tasks: [],
    //   assignees,
    //   image,
    // };
    const formData = new FormData();
    formData.append("name", name);
    if (description) formData.append("description", description);
    if (image) formData.append("image", image);

    if (assignees.length) {
      const ids = assignees.map((a) => a.id);
      formData.append("member_ids", JSON.stringify(ids));
    }

    // console.log(newProject);
    try {
      const res = await fetch(`${baseURL}/api/projects`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: formData,
      });
      if (!res.ok) {
        console.log(res);
        return;
      }
      const result = await res.json();
      console.log(result);
      setProjects((prev) => [...prev, result.project]);
    } catch (e) {
      console.log(e);
    }
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id ? { ...project, ...updates } : project
      )
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== id));
  };

  const addTask = (projectId: string, task: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? { ...project, tasks: [...project.tasks, newTask] }
          : project
      )
    );
  };

  const updateTask = (
    projectId: string,
    taskId: string,
    updates: Partial<Task>
  ) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId ? { ...task, ...updates } : task
              ),
            }
          : project
      )
    );
  };

  const deleteTask = (projectId: string, taskId: string) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.filter((task) => task.id !== taskId),
            }
          : project
      )
    );
  };

  const moveTaskToStatus = (
    projectId: string,
    taskId: string,
    newStatus: Task["status"]
  ) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId ? { ...task, status: newStatus } : task
              ),
            }
          : project
      )
    );
  };

  const reorderTasks = (
    projectId: string,
    sourceIndex: number,
    destinationIndex: number
  ) => {
    setProjects((prev) =>
      prev.map((project) => {
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

  const addChatMessage = (
    projectId: string,
    message: string,
    sender: string
  ) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      projectId,
      message,
      sender,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, newMessage]);
  };

  const getProjectChatMessages = (projectId: string) => {
    return chatMessages.filter((msg) => msg.projectId === projectId);
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
