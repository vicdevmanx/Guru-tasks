import { create } from "zustand";
import Cookies from "js-cookie";
import API from "@/components/axios";
import { Project } from "@/hooks/useProjects";

export type User = {
  access_role: string;
  created_at: string;
  // user?: {id: string, name: string, email: string, profile_pic: string};
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

export type Profile = {
  name: string;
  email: string;
  access_role: string;
  role: string | undefined;
  profile_pic: string | undefined | File; // <- if you allow uploaded files
};

interface AuthState {
  user: User | null;
  users: User[] | null;
  logout: () => void;
  token: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  fetchUser: () => void;
  fetchAllUsers: () => void;
  fetchProjects: () => void;
  projects: Project[] | [];
  setProjects: (projects: Project[] | ((prev: Project[]) => Project[])) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: Cookies.get("token") || null,

  setUser: (user) => set({ user }),
  setToken: (token) => {
    Cookies.set("token", token);
    set({ token });
  },
  logout: () => {
    Cookies.remove("token");
    set({ user: null, token: null });
  },
  fetchUser: async (id = "me") => {
    try {
      const res = await API.get(`api/users/${id}`);
      // console.log(res);
      set({ user: res.data });
    } catch (e) {
      console.log(e);
    }
  },
  users: null,
  fetchAllUsers: async () => {
    try {
      const res = await API.get("api/users");
      // console.log(res.data)
      set({ users: res.data });
    } catch (e) {
      console.log(e);
    }
  },
  projects: [],
 setProjects: (updater) =>
  set((state) => ({
    projects: typeof updater === 'function' ? updater(state.projects) : updater,
  })),
  fetchProjects: async () => {
    try {
      const res = await API.get("/api/projects");
      console.log('projectsss', res.data)
      set({ projects: res.data });
    } catch (e) {
      console.log(e);
    }
  },
}));
