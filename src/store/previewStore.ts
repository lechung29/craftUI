/** @format */

import { create } from "zustand";
import { autoLogger } from "./middlewares/logger";

export type PreviewTheme = "light" | "dark";

interface PreviewStore {
    theme: PreviewTheme;
    toggleTheme: () => void;
    setTheme: (theme: PreviewTheme) => void;
}

export const usePreviewStore = create<PreviewStore>(
    autoLogger((set) => ({
        theme: "light",
        toggleTheme: () =>
            set((state) => ({
                theme: state.theme === "light" ? "dark" : "light",
            })),
        setTheme: (theme) => set({ theme }),
    }), "PreviewStore"),
);
