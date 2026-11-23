import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggle: () => void;
  setCollapsed: (collapsed: boolean) => void;
  toggleMobile: () => void;
  setMobileOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isCollapsed: false,
      isMobileOpen: false,
      toggle: (): void => {
        set((state) => ({ isCollapsed: !state.isCollapsed }));
      },
      setCollapsed: (collapsed: boolean): void => {
        set({ isCollapsed: collapsed });
      },
      toggleMobile: (): void => {
        set((state) => ({ isMobileOpen: !state.isMobileOpen }));
      },
      setMobileOpen: (open: boolean): void => {
        set({ isMobileOpen: open });
      },
    }),
    {
      name: "mitrasova-sidebar-storage",
      partialize: (state) => ({ isCollapsed: state.isCollapsed }),
    }
  )
);
