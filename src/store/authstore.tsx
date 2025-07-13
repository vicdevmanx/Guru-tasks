import { create } from "zustand";
import Cookies from "js-cookie";
import API from "@/components/axios";

export type User = {
  access_role: string;
  created_at: string;
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
      console.log(res);
      set({ user: res.data });
    } catch (e) {
      console.log(e);
    }
  },
  users: null,
  fetchAllUsers: async () => {
    try {
      const res = await API.get("api/users");
      console.log(res.data)
      set({ users: res.data });
    } catch (e) {
      console.log(e);
    }
  },
  // myOrders: null,
  // fetchMyOrders: async () => {
  //   try {
  //     const res = await API.get("/orders");
  //     // console.log(res.data)
  //     set({ myOrders: res.data });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // },
}));
