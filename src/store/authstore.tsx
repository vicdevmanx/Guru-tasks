import { create } from "zustand";
import Cookies from "js-cookie";
import API from "@/components/axios";

export const useAuthStore = create((set) => ({
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
  
  setCurrentPage: (currentPage) => set({ currentPage }),

  fetchProductDetails: async (id) => {
    try {
      const res = await API.get(`/products/${id}`)
      set({ productDetails: res.data })
    } catch (err) {
      console.log(err)
    }
  },
  allUsers: null,
  getAllUsers: async () => {
    try {
      const res = await API.get('/admin/users')
      // console.log(res.data)
      set({ allUsers: res.data })
    } catch (e) {
      console.log(e)
    }
  },
  myOrders: null,
  fetchMyOrders: async () => {
    try {
      const res = await API.get('/orders')
      // console.log(res.data)
      set({ myOrders: res.data })
    } catch (e) {
      console.log(e)
    }
  }
}));