/** @format */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { autoLogger } from "./middlewares/logger";
import { IResponseStatus } from "@/types/requestbase";
import { AuthService } from "@/services/auth/AuthService";
import { IUserInformation } from "@/types/auth";
import { UserService } from "@/services/users/UserService";
import { isSessionExpired, showError, showSuccess } from "@/utils";

export interface AuthState {
    user: IUserInformation | null;
    isAuthenticated: boolean;
    login: (email: string, password: string, navigate?: () => void) => Promise<void>;
    loginGoogle: (email: string, avatar: string, navigate?: () => void) => Promise<void>;
    register: (username: string, email: string, password: string, navigate?: () => void) => Promise<void>;
    logout: (navigate?: () => void) => Promise<void>;
    updateUser: (data: Partial<IUserInformation>) => Promise<void>;
    deleteAccount: () => Promise<void>;
    updateEmailSettings: (email: string, isReceiveEmailNotification: boolean) => Promise<void>;
    updateLocalUser: (data: Partial<IUserInformation>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        autoLogger(
            (set, get) => ({
                user: null,
                isAuthenticated: false,

                login: async (email: string, password: string, navigate?: () => void) => {
                    try {
                        const res = await AuthService.loginUser({ email, password });
                        const success = res?.status === IResponseStatus.Success;
                        if (!success) {
                            throw new Error(res?.message || "Login failed");
                        }
                        const accessToken = res?.data?.accessToken || null;
                        const user: IUserInformation = res?.data!;

                        if (accessToken) localStorage.setItem("accessToken", accessToken);

                        set({ user, isAuthenticated: !!user });
                        showSuccess(res?.message!);
                        if (navigate) navigate();
                    } catch (err: any) {
                        if (isSessionExpired(err)) return;
                        showError(err?.message || "Login failed");
                        throw err;
                    }
                },

                loginGoogle: async (email: string, avatar: string, navigate?: () => void) => {
                    try {
                        const res = await AuthService.loginGoogle(email, avatar);
                        const success = res?.status === IResponseStatus.Success;
                        if (!success) {
                            throw new Error(res?.message || "Login failed");
                        }
                        const accessToken = res?.data?.accessToken || null;
                        const user: IUserInformation = res?.data!;

                        if (accessToken) localStorage.setItem("accessToken", accessToken);

                        set({ user, isAuthenticated: !!user });
                        showSuccess(res?.message!);
                        if (navigate) navigate();
                    } catch (err: any) {
                        if (isSessionExpired(err)) return;
                        showError(err?.message || "Login failed");
                        throw err;
                    }
                },

                register: async (username: string, email: string, password: string, navigate?: () => void) => {
                    try {
                        const res = await AuthService.registerUser({ email, password, username });
                        if (res?.status !== IResponseStatus.Success) {
                            throw new Error(res?.message || "Register failed");
                        }
                        showSuccess(res?.message!);
                        if (navigate) navigate();
                    } catch (err: any) {
                        if (isSessionExpired(err)) return;
                        showError(err?.message || "Register failed");
                        throw err;
                    }
                },

                logout: async (navigate?: () => void) => {
                    set({ user: null, isAuthenticated: false });
                    localStorage.removeItem("accessToken");
                    try {
                        await AuthService.logoutUser();
                        if (navigate) navigate();
                    } catch (error: any) {
                        if (isSessionExpired(error)) return;
                        showError(error?.message || "Logout failed");
                        throw error;
                    }
                },

                updateUser: async (updateData: Partial<IUserInformation>) => {
                    const currentUser = get().user;
                    if (!currentUser?._id) {
                        showError("User ID missing. Please log in again.");
                        return;
                    }
                    try {
                        const res = await UserService.updateUser(updateData);
                        if (res?.status !== IResponseStatus.Success) {
                            throw new Error(res?.message || "Failed to update profile");
                        }
                        set((state) => ({
                            user: state.user ? { ...state.user, ...updateData } : null,
                        }));
                        showSuccess(res?.message!);
                    } catch (err: any) {
                        if (isSessionExpired(err)) return;
                        showError(err?.message || "Failed to update profile");
                        throw err;
                    }
                },
                updateLocalUser: (updateData: Partial<IUserInformation>) => {
                    const currentUser = get().user;
                    if (!currentUser?._id) {
                        showError("User ID missing. Please log in again.");
                        return;
                    }
                    set((state) => ({
                        user: state.user ? { ...state.user, ...updateData } : null,
                    }));
                },
                deleteAccount: async () => {
                    const currentUser = get().user;
                    if (!currentUser?._id) {
                        showError("User ID missing. Please log in again.");
                        return;
                    }
                    try {
                        const res = await UserService.deleteUser(currentUser._id);
                        if (res?.status !== IResponseStatus.Success) {
                            throw new Error(res?.message || "Failed to delete account");
                        }
                        showSuccess(res?.message!);
                    } catch (error: any) {
                        if (isSessionExpired(error)) return;
                        showError(error?.message || "Failed to delete account");
                        throw error;
                    }
                },
                updateEmailSettings: async (email: string, isReceiveEmailNotification: boolean) => {
                    const currentUser = get().user;
                    if (!currentUser?._id) {
                        showError("User ID missing. Please log in again.");
                        return;
                    }
                    try {
                        const res = await UserService.updateEmailSetting(currentUser._id, email, isReceiveEmailNotification);
                        if (res?.status !== IResponseStatus.Success) {
                            throw new Error(res?.message || "Failed to delete account");
                        }
                        set((state) => ({
                            user: state.user ? { ...state.user, email, settings: { ...state.user.settings, isReceiveEmailNotification } } : null,
                        }));
                        showSuccess(res?.message!);
                    } catch (error: any) {
                        if (isSessionExpired(error)) return;
                        showError(error?.message || "Failed to update email settings");
                        throw error;
                    }
                },
            }),
            "AuthStore",
        ),
        {
            name: "auth-storage",
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
        },
    ),
);
