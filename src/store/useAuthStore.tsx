import { create } from "zustand";
import { toast } from "react-toastify";
import axiosInstance from "../lib/axios";
import { io, Socket } from "socket.io-client";

interface User {
  id: string;
  username: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAuthenticatedLoading: boolean;
  authButtonLoader: boolean;
  socket: Socket | null;
  signin: (formData: { username: string; password: string }) => Promise<number>;
  register: (formData: {
    username: string;
    password: string;
  }) => Promise<number>;
  verify: () => void;
  logout: () => void;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isAuthenticatedLoading: true,
  authButtonLoader: false,
  socket: null,

  register: async (formData) => {
    try {
      set({ authButtonLoader: true });
      const response = await axiosInstance.post(
        "/api/v1/auth/register",
        formData
      );
      toast.success("Successfully registered");

      const user = response.data.user;
      set({
        user,
        isAuthenticated: true,
      });

      get().connectSocket(); // connect socket after register
      set({ authButtonLoader: false });
      return 1;
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Signup failed");
      set({ authButtonLoader: false });
      return 0;
    }
  },

  signin: async (formData) => {
    try {
      set({ authButtonLoader: true });
      const response = await axiosInstance.post("/api/v1/auth/login", formData);

      const user = response.data.user;
      set({
        user,
        isAuthenticated: true,
      });

      toast.success(response.data.msg);
      get().connectSocket(); // connect socket after login
      set({ authButtonLoader: false });
      return 1;
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Login failed");
      set({ authButtonLoader: false });
      return 0;
    }
  },

  verify: async () => {
    try {
      const response = await axiosInstance.get("/api/v1/auth/verify");
      const user = response.data.user;
      set({
        user,
        isAuthenticated: true,
        isAuthenticatedLoading: false,
      });

      get().connectSocket(); // auto connect socket on verify
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isAuthenticatedLoading: false,
      });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.get("/api/v1/auth/logout");
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Logout failed");
    } finally {
      get().disconnectSocket();
      set({ user: null, isAuthenticated: false });
    }
  },

  connectSocket: () => {
    const { user, socket } = get();

    if (!user || !user.id || socket) return;

    const newSocket = io(import.meta.env.VITE_API_URL, {
      query: { userId: user.id },
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("🟢 Socket connected:", newSocket.id);
    });

    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));

export default useAuthStore;
