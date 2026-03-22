/** @format */

import { API_BASE_URL } from "@/constants";
import { IResponseStatus } from "@/types";
import { useSessionExpiredStore } from "@/store";
import axios, { InternalAxiosRequestConfig } from "axios";
import { AuthService } from "@/services";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

// Sentinel error — dùng để nhận biết đây là session expired, không phải lỗi thường
class SessionExpiredError extends Error {
    readonly isSessionExpired = true;
    constructor() {
        super("SESSION_EXPIRED");
        this.name = "SessionExpiredError";
    }
}

const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        error ? prom.reject(error) : prom.resolve(token);
    });
    failedQueue = [];
};

export const handleSessionExpired = () => {
    localStorage.removeItem("accessToken");
    const { isOpen, openModal } = useSessionExpiredStore.getState();
    if (!isOpen) openModal();
    return new SessionExpiredError();
};

instance.interceptors.request.use(
    (config: any) => {
        const publicEndpoints = ["/login", "/register", "/forgot-password", "/refresh-token", ];
        const isPublicEndpoint = publicEndpoints.some((endpoint) => config.url?.includes(endpoint));

        if (!isPublicEndpoint) {
            const token = localStorage.getItem("accessToken");
            if (token) config.headers["x-token"] = token;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

instance.interceptors.response.use(
    async (response: any) => {
        const data = response.data;

        if (data?.code === 401) {
            const originalRequest = response.config as CustomAxiosRequestConfig;

            if (originalRequest.url?.includes("/refresh-token")) {
                return Promise.reject(handleSessionExpired());
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers["x-token"] = token;
                        return instance(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            if (originalRequest._retry) {
                return Promise.reject(handleSessionExpired());
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const res: any = await AuthService.refreshToken();
                const newToken = res?.data?.accessToken || res?.accessToken;

                if (newToken) {
                    localStorage.setItem("accessToken", newToken);
                    instance.defaults.headers.common["x-token"] = newToken;
                    processQueue(null, newToken);
                    originalRequest.headers["x-token"] = newToken;
                    return instance(originalRequest);
                } else {
                    throw new Error(res?.message);
                }
            } catch (err: any) {
                processQueue(err, null);
                return Promise.reject(handleSessionExpired());
            } finally {
                isRefreshing = false;
            }
        }

        return data;
    },
    (error) => {
        if (error.response?.status === 401) {
            return Promise.reject(handleSessionExpired());
        }
        return Promise.reject({
            status: error.response?.data?.status || IResponseStatus.Error,
            message: error.response?.data?.message || "Network Error",
        });
    },
);

export { instance, SessionExpiredError };
