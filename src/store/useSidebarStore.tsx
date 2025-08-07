import { create } from "zustand";
import useMailStore from "./useMailStore";

interface SidebarState {
  isOpen: boolean;
  sidebarMenu: string;
  setSidebarMenu: (menu: string) => void;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true,

  sidebarMenu: "inbox",
  setSidebarMenu: (menu) => {
    useMailStore.getState().closeMail();
    set({ sidebarMenu: menu });
  },
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),

  open: () => set({ isOpen: true }),

  close: () => set({ isOpen: false }),
}));

export default useSidebarStore;
