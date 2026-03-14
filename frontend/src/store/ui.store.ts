import { create } from "zustand";

interface ModalState {
  isOpen: boolean;
  data?: unknown;
}

interface UIState {
  sidebarOpen: boolean;
  isLoading: boolean;
  modals: Record<string, ModalState>;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setLoading: (loading: boolean) => void;
  openModal: (id: string, data?: unknown) => void;
  closeModal: (id: string) => void;
  isModalOpen: (id: string) => boolean;
  getModalData: (id: string) => unknown;
}

export const useUIStore = create<UIState>((set, get) => ({
  sidebarOpen: true,
  isLoading: false,
  modals: {},

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setLoading: (isLoading) => set({ isLoading }),

  openModal: (id, data) =>
    set((state) => ({
      modals: { ...state.modals, [id]: { isOpen: true, data } },
    })),

  closeModal: (id) =>
    set((state) => ({
      modals: { ...state.modals, [id]: { isOpen: false } },
    })),

  isModalOpen: (id) => get().modals[id]?.isOpen ?? false,

  getModalData: (id) => get().modals[id]?.data,
}));
