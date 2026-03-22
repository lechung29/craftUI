/** @format */

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, Mail, Settings as SettingsIcon, BarChart3 } from "lucide-react";
import { cx } from "@/utils";

export interface SettingsSidebarProps {
    className?: string;
}

const SettingSidebar: React.FC<SettingsSidebarProps> = (props) => {
    const { className = "" } = props;
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { icon: User, label: "Profile", path: "/settings/profile" },
        { icon: Mail, label: "Email", path: "/settings/email" },
        { icon: SettingsIcon, label: "Account", path: "/settings/account" },
        { icon: BarChart3, label: "Stats", path: "/settings/stats" },
    ];

    const isActive = (path: string) => {
        return location.pathname === path || (path === "/settings/profile" && location.pathname === "/settings");
    };

    return (
        <aside className={cx("w-full md:w-[240px] md:flex-shrink-0 md:border-r md:border-white/10 md:pr-8", className)}>
            <div className="md:relative">
                <h2 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6">Settings</h2>
                <nav className="flex flex-wrap md:flex-col items-center md:items-stretch gap-1.5 md:gap-2 pb-4 md:pb-0">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);

                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={cx(
                                    "flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                    active ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/5 hover:text-white",
                                )}
                            >
                                <Icon className="w-4 h-4 md:w-5 md:h-5" />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
};

export { SettingSidebar };
