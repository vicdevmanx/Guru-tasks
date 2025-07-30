import axios from "axios";
import Cookies from "js-cookie";
export const baseURL = "https://guru-tasks-api.vercel.app"
//http://localhost:5000
//https://guru-tasks-api.vercel.app
const API = axios.create({
  baseURL: "https://guru-tasks-api.vercel.app"
});

API.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
