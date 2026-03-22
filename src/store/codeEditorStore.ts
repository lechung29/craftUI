/** @format */

import { create } from "zustand";
import { ComponentStatus, ComponentStyle, ComponentType } from "@/types/components";
import {
    initialButtonComponent,
    initialCardComponent,
    initialCheckboxComponent,
    initialFormComponent,
    initialInputComponent,
    initialLoaderComponent,
    initialRadioComponent,
    initialSwitchComponent,
    initialTooltipComponent,
    isSessionExpired,
} from "@/utils";
import { persist } from "zustand/middleware";
import { autoLogger } from "./middlewares/logger";
import { ComponentService } from "@/services/components/ComponentService";
import { IResponseStatus } from "@/types/requestbase";
import { showError, showSuccess } from "@/utils";
import { useAuthStore } from "./authStore";

export interface ICodeProps {
    html: string;
    css: string;
}

interface CodeEditorState {
    htmlCode: string;
    cssCode: string;
    cssTech?: ComponentStyle;
    type?: ComponentType;
    editorTab: "html" | "css";
    previewTheme: "light" | "dark";
    tags: string[];
    setHtmlCode: (html: string) => void;
    setCssCode: (css: string) => void;
    setCssTech: (tech: ComponentStyle) => void;
    setEditorTab: (tab: "html" | "css") => void;
    setPreviewTheme: (theme: "light" | "dark") => void;
    setTags: (tags: string[]) => void;
    initializeCode: (tech: ComponentStyle, type: ComponentType) => void;
    setInfo: (html: string, css: string, tech: ComponentStyle, type: ComponentType) => void;
    submitNewComponent: (status: ComponentStatus, componentId: string | undefined, navigate?: () => void) => Promise<void>;
    saveAsFavorite: (componentId: string) => Promise<void>;
    resetCode: () => void;
}

const getInitialComponent = (tech: ComponentStyle, type: ComponentType): ICodeProps => {
    switch (type) {
        case ComponentType.Button:
            return initialButtonComponent(tech);
        case ComponentType.Switch:
            return initialSwitchComponent(tech);
        case ComponentType.Checkbox:
            return initialCheckboxComponent(tech);
        case ComponentType.Card:
            return initialCardComponent(tech);
        case ComponentType.Loader:
            return initialLoaderComponent(tech);
        case ComponentType.Input:
            return initialInputComponent(tech);
        case ComponentType.Form:
            return initialFormComponent(tech);
        case ComponentType.Radio:
            return initialRadioComponent(tech);
        case ComponentType.Tooltip:
            return initialTooltipComponent(tech);
        default:
            return initialButtonComponent(tech);
    }
};

export const useCodeEditorStore = create<CodeEditorState>()(
    persist(
        autoLogger((set, get) => ({
            htmlCode: "",
            cssCode: "",
            cssTech: ComponentStyle.CSS,
            type: ComponentType.Button,
            editorTab: "html",
            previewTheme: "dark",
            tags: [],
            setPreviewTheme: (theme: "light" | "dark") => set({ previewTheme: theme }),
            setEditorTab: (tab: "html" | "css") => set({ editorTab: tab }),
            setHtmlCode: (html: string) => set({ htmlCode: html }),
            setTags: (tagsList: string[]) => {
                set({ tags: tagsList });
            },
            setCssCode: (css: string) => set({ cssCode: css }),

            setCssTech: (tech: ComponentStyle) => set({ cssTech: tech }),

            setInfo: (html: string, css: string, tech: ComponentStyle, type: ComponentType) => {
                set({
                    htmlCode: html,
                    cssCode: css,
                    cssTech: tech,
                    type: type,
                });
                if (tech === ComponentStyle.Tailwind) {
                    set({ editorTab: "html" });
                }
            },
            initializeCode: (tech: ComponentStyle, type: ComponentType) => {
                const initialCode = getInitialComponent(tech, type);
                set({
                    htmlCode: initialCode.html,
                    cssCode: initialCode.css,
                    cssTech: tech,
                    type: type,
                    tags: [],
                });
                if (tech === ComponentStyle.Tailwind) {
                    set({ editorTab: "html" });
                }
            },

            resetCode: () => {
                set({
                    htmlCode: "",
                    cssCode: "",
                    cssTech: undefined,
                    type: undefined,
                    tags: [],
                });
            },
            submitNewComponent: async (status: ComponentStatus, componentId: string | undefined, navigate?: () => void) => {
                const { htmlCode, cssCode, cssTech, type, tags } = get();
                try {
                    const res = await ComponentService.submitNewComponent({ html: htmlCode, css: cssCode, style: cssTech!, type: type!, isDraft: status === ComponentStatus.Draft, tags, componentId });
                    if (res?.status !== IResponseStatus.Success) {
                        throw new Error(res?.message || "Create component failed");
                    }
                    const { updateLocalUser } = useAuthStore.getState();
                    updateLocalUser({
                        points: res.data?.requesterPoint,
                    });
                    showSuccess(res?.message!);
                    if (navigate) navigate();
                } catch (err: any) {
                    if (isSessionExpired(err)) return;
                    showError(err?.message || "Submit failed");
                    throw err;
                }
            },
            saveAsFavorite: async (componentId: string) => {
                try {
                    const res = await ComponentService.saveAsFavorite(componentId);
                    if (res?.status !== IResponseStatus.Success) {
                        throw new Error(res?.message || "Save as favorite failed");
                    }
                    showSuccess(res?.message!);
                    const { updateLocalUser } = useAuthStore.getState();
                    updateLocalUser({
                        savedIds: res.data?.savedIds,
                    });
                } catch (err: any) {
                    if (isSessionExpired(err)) return;
                    showError(err?.message || "Save failed");
                    throw err;
                }
            },
        })),
        {
            name: "code-editor-storage",
            partialize: (state) => ({
                htmlCode: state.htmlCode,
                cssCode: state.cssCode,
                cssTech: state.cssTech,
                type: state.type,
                editorTab: state.editorTab,
                previewTheme: state.previewTheme,
            }),
        },
    ),
);
