/** @format */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { MainLayout, ProtectedRoute, ScrollToTop, SessionExpiredModal, SettingLayout, WithSidebarLayout } from "./components";
import {
    AccountSettingPage,
    AuthPage,
    CreateComponentPage,
    ElementsPage,
    EmailSettingPage,
    FeedbackPage,
    HomePage,
    MyFavoritesPage,
    NotFoundPage,
    ProfilePage,
    ProfileSettingPage,
    ReportBugPage,
    SpotlightPage,
    StatsSettingPage,
    UserProfilePage,
} from "./pages";
import React from "react";
import { useAuthStore } from "./store";
import { AuthService } from "./services";

function App() {
    const { user } = useAuthStore();
    React.useEffect(() => {
        if (!user) return;

        AuthService.verifyToken();
    }, []);
    return (
        <BrowserRouter>
            <Toaster
                position="top-right"
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                    duration: 5000,
                    style: {
                        background: "#1f1f1f",
                        color: "#ffffff",
                        padding: "16px",
                        borderRadius: "12px",
                        fontSize: "14px",
                        fontWeight: "500",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        maxWidth: "400px",
                    },
                    success: {
                        duration: 4000,
                        style: {
                            background: "#1f1f1f",
                            color: "#ffffff",
                            border: "1px solid rgba(16, 185, 129, 0.3)",
                        },
                        iconTheme: {
                            primary: "#10b981",
                            secondary: "#ffffff",
                        },
                    },
                    error: {
                        duration: 5000,
                        style: {
                            background: "#1f1f1f",
                            color: "#ffffff",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                        },
                        iconTheme: {
                            primary: "#ef4444",
                            secondary: "#ffffff",
                        },
                    },
                    loading: {
                        style: {
                            background: "#1f1f1f",
                            color: "#ffffff",
                            border: "1px solid rgba(99, 102, 241, 0.3)",
                        },
                        iconTheme: {
                            primary: "#6366f1",
                            secondary: "#ffffff",
                        },
                    },
                    blank: {
                        style: {
                            background: "#1f1f1f",
                            color: "#ffffff",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                        },
                    },
                }}
            />

            <SessionExpiredModal />
            <ScrollToTop />

            <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/spotlight" element={<SpotlightPage />} />
                    <Route
                        path="/feedback"
                        element={
                            <ProtectedRoute>
                                <FeedbackPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/report-bug"
                        element={
                            <ProtectedRoute>
                                <ReportBugPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/create" element={<CreateComponentPage />} />
                    <Route element={<WithSidebarLayout />}>
                        <Route path="/view/:id" element={<CreateComponentPage />} />
                        <Route path="/elements" element={<ElementsPage />} />
                        <Route path="/favorites" element={<MyFavoritesPage />} />
                        <Route path="/my-profile" element={<ProfilePage />} />
                        <Route path="/profile/:id" element={<UserProfilePage />} />
                    </Route>
                    <Route
                        element={
                            <ProtectedRoute>
                                <SettingLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/settings/profile" element={<ProfileSettingPage />} />
                        <Route path="/settings/email" element={<EmailSettingPage />} />
                        <Route path="/settings/account" element={<AccountSettingPage />} />
                        <Route path="/settings/stats" element={<StatsSettingPage />} />
                    </Route>

                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
