/** @format */

import { useAuthStore } from "@/store";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, ChevronDown, X } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const MobileMenu: React.FunctionComponent<MobileMenuProps> = (props) => {
    const { onClose } = props;
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [showCategories, setShowCategories] = React.useState(false);

    const categories = [
        { label: "Browse all", path: "/elements" },
        { label: "Buttons", path: "/elements/buttons" },
        { label: "Checkboxes", path: "/elements/checkboxes" },
        { label: "Toggle switches", path: "/elements/toggle-switches" },
        { label: "Cards", path: "/elements/cards" },
        { label: "Loaders", path: "/elements/loaders" },
        { label: "Inputs", path: "/elements/inputs" },
        { label: "Radio buttons", path: "/elements/radio-buttons" },
        { label: "Forms", path: "/elements/forms" },
        { label: "Patterns", path: "/elements/patterns" },
        { label: "Tooltips", path: "/elements/tooltips" },
        { label: "My favorites", path: "/favorites" },
    ];

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 h-14 border-b border-white/10">
                <button onClick={onClose} className="flex items-center gap-0.5">
                    <span className="text-xl font-bold text-white">Craft</span>
                    <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent relative inline-block">
                        UI
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full" />
                    </span>
                </button>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <X className="w-6 h-6 text-white/90" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="px-4 py-6">
                    <button
                        onClick={() => setShowCategories(!showCategories)}
                        className="flex items-center justify-between w-full text-left px-4 py-3 rounded-lg text-sm text-white/70 hover:text-white hover:bg-[#212121] transition-colors"
                    >
                        <span>Elements</span>
                        <ChevronDown className={`w-5 h-5 transition-transform ${showCategories ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                        {showCategories && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-1 mt-1 overflow-hidden"
                            >
                                {categories.map((category) => (
                                    <button
                                        key={category.label}
                                        onClick={() => {
                                            navigate(category.path);
                                            onClose();
                                        }}
                                        className="w-full text-left pl-8 pr-4 py-3 rounded-lg text-sm text-white/70 hover:text-white hover:bg-[#212121] transition-colors"
                                    >
                                        {category.label}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div className="space-y-1 mt-1">
                        <button
                            onClick={() => {
                                navigate("/spotlight");
                                onClose();
                            }}
                            className="w-full text-left px-4 py-3 rounded-lg text-sm text-white/70 hover:text-white hover:bg-[#212121] transition-colors"
                        >
                            Spotlight
                        </button>
                    </div>
                </div>

                <div className="px-4 py-4 border-t border-white/10">
                    {user && (
                        <div className="flex items-center gap-3 mb-4 px-4 py-3">
                            <img
                                src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"}
                                alt={user?.username || "User"}
                                className="w-10 h-10 rounded-full border border-white/20"
                            />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-white">{user?.username || "lkimquc_9692"}</p>
                            </div>
                            <Bell className="w-5 h-5 text-white/70" />
                        </div>
                    )}
                    <div className="space-y-1">
                        {user && (
                            <React.Fragment>
                                <button
                                    onClick={() => {
                                        navigate("/my-profile");
                                        onClose();
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/70 hover:text-white hover:bg-[#212121] transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>Your Profile</span>
                                </button>
                                <button
                                    onClick={() => {
                                        navigate("/favorites");
                                        onClose();
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/70 hover:text-white hover:bg-[#212121] transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                    <span>Your Favorites</span>
                                </button>
                                <button
                                    onClick={() => {
                                        navigate("/settings/profile");
                                        onClose();
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/70 hover:text-white hover:bg-[#212121] transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                        />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>Settings</span>
                                </button>
                            </React.Fragment>
                        )}
                        <button
                            onClick={() => {
                                navigate("/feedback");
                                onClose();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/70 hover:text-white hover:bg-[#212121] transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                            </svg>
                            <span>Give feedback</span>
                        </button>
                        <button
                            onClick={() => {
                                navigate("/report-bug");
                                onClose();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-white/90 hover:bg-[#212121] transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Report bug</span>
                        </button>
                        <button
                            onClick={() => {
                                window.open("https://discord.com", "_blank");
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/70 hover:text-white hover:bg-[#212121] transition-colors"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                            </svg>
                            <span>Join Discord</span>
                        </button>
                    </div>

                    <div className="border-t border-white/10 my-4" />

                    {user ? (
                        <button
                            onClick={() => {
                                logout();
                                navigate("/auth");
                                onClose();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/70 hover:text-white hover:bg-[#212121] transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Log out</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                navigate("/auth");
                                onClose();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/70 hover:text-white hover:bg-[#212121] transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Log in</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export { MobileMenu };
