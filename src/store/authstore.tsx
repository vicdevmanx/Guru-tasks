import { create } from "zustand";
import Cookies from "js-cookie";
import API from "@/components/axios";

type User = {
  access_role: string;
  created_at: string;
  email: string;
  id: string;
  name: string;
  password: string;
  profile_pic: string;
  reset_token: string | null;
  reset_token_expires_at: string | null;
  role_id: number;
  suspended: boolean;
};

interface AuthState {
  user: User | null;
  allUsers: User[] | null
  logout: () => void,
  token: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
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

  allUsers: null,
  getAllUsers: async () => {
    try {
      const res = await API.get("/admin/users");
      // console.log(res.data)
      set({ allUsers: res.data });
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
