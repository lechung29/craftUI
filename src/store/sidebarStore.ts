/** @format */

import { ComponentStyle, ComponentType } from "@/types/components";
import { create } from "zustand";
import { autoLogger } from "./middlewares/logger";

interface SidebarState {
    selectedType: ComponentType | undefined;
    selectedStyle: ComponentStyle | undefined;
    searchKey: string;
    setSelectedType: (type?: ComponentType) => void;
    setSelectedStyle: (style?: ComponentStyle) => void;
    setSearchKey: (search: string) => void;
}

export const useSidebarStore = create<SidebarState>(
    autoLogger((set) => ({
        selectedType: undefined,
        selectedStyle: ComponentStyle.CSS,
        searchKey: "",
        setSelectedType: (type?: ComponentType) => set({ selectedType: type }),
        setSelectedStyle: (style?: ComponentStyle) => set({ selectedStyle: style }),
        setSearchKey: (search: string) => set({ searchKey: search }),
    })),
);
