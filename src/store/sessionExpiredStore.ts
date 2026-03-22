/** @format */

import { create } from "zustand";

interface SessionExpiredState {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}

export const useSessionExpiredStore = create<SessionExpiredState>((set) => ({
    isOpen: false,
    openModal: () => set({ isOpen: true }),
    closeModal: () => set({ isOpen: false }),
}));
