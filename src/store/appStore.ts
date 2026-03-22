/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { autoLogger } from "./middlewares/logger";

interface AppState {
    count: number;
    user: {
        name: string;
        email: string;
    } | null;
    increase: () => void;
    decrease: () => void;
    setUser: (user: { name: string; email: string }) => void;
    clearUser: () => void;
}

export const useAppStore = create<AppState>()(
    devtools(
        autoLogger((set) => ({
            count: 0,
            user: null,

            increase: () => set((state) => ({ count: state.count + 1 }), false, "increase"),

            decrease: () => set((state) => ({ count: state.count - 1 }), false, "decrease"),

            setUser: (user) => set({ user }, false, "setUser"),

            clearUser: () => set({ user: null }, false, "clearUser"),
        }), "AppStore"),
        {
            name: "AppStore",
        },
    ),
);
