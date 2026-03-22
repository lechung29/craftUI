/** @format */

import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, ChevronDown, Info, LogOut, Menu, MessageCircleMore, Settings, User } from "lucide-react";
import { ITooltipMenuProps } from "../pointbutton";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { FaDiscord } from "react-icons/fa";
import React from "react";

const UserMenu: React.FunctionComponent<ITooltipMenuProps> = (props) => {
    const { show, setShow } = props;
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    return (
        <div className="relative hidden lg:block">
            {user ? (
                <button onClick={() => setShow(!show)} className="flex items-center gap-2 px-2 lg:px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
                    <ChevronDown className="w-4 h-4 text-white/70" />
                    <span className="hidden lg:inline text-sm font-medium text-white/90">{user?.username}</span>
                    <img src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"} alt={user?.username || "User"} className="w-7 h-7 rounded-full border border-white/20" />
                </button>
            ) : (
                <button onClick={() => setShow(!show)} className="flex items-center gap-2 px-2 lg:px-3 py-1.5 rounded-lg transition-colors">
                    <Menu className="w-5 h-5 text-white/90" />
                </button>
            )}

            <AnimatePresence>
                {show && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setShow(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-2 w-56 bg-[#1a1a1a] rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50"
                        >
                            {!user ? (
                                <button
                                    onClick={() => {
                                        navigate("/auth");
                                        setShow(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-white/90 hover:bg-[#212121] transition-colors"
                                >
                                    <LogOut className="w-4 h-5" />
                                    <span>Log in</span>
                                </button>
                            ) : (
                                <React.Fragment>
                                    <button
                                        onClick={() => {
                                            navigate("/my-profile");
                                            setShow(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-white/90 hover:bg-[#212121] transition-colors"
                                    >
                                        <User className="w-4 h-5" />
                                        <span>Your Profile</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            navigate("/favorites");
                                            setShow(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-white/90 hover:bg-[#212121] transition-colors"
                                    >
                                        <Bookmark className="w-4 h-5" />
                                        <span>Your Favorites</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            navigate("/settings/profile");
                                            setShow(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-white/90 hover:bg-[#212121] transition-colors"
                                    >
                                        <Settings className="w-4 h-5" />
                                        <span>Settings</span>
                                    </button>
                                </React.Fragment>
                            )}

                            <div className="border-t border-white/10" />

                            <button
                                onClick={() => {
                                    navigate("/feedback");
                                    setShow(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-white/90 hover:bg-[#212121] transition-colors"
                            >
                                <MessageCircleMore className="w-4 h-5" />
                                <span>Give feedback</span>
                            </button>

                            <button
                                onClick={() => {
                                    navigate("/report-bug");
                                    setShow(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-white/90 hover:bg-[#212121] transition-colors"
                            >
                                <Info className="w-4 h-5" />
                                <span>Report bug</span>
                            </button>

                            <div className="border-t border-white/10" />

                            <button
                                onClick={() => {
                                    window.open("https://discord.com", "_blank");
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-white/90 hover:bg-[#212121] transition-colors bg-[#5865f2]"
                            >
                                <FaDiscord className="w-4 h-5 text-white" />
                                <span>Join Discord</span>
                            </button>

                            <div className="border-t border-white/10" />

                            {user && (
                                <button
                                    onClick={() => {
                                        logout(() => navigate("/auth"));
                                        setShow(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-white/90 hover:bg-[#212121] transition-colors"
                                >
                                    <LogOut className="w-4 h-5" />
                                    <span>Log out</span>
                                </button>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export { UserMenu };
