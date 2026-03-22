/** @format */

import React from "react";
import { motion } from "framer-motion";

type IDropdownMenuProps = {
    children: React.ReactNode;
    upward: boolean;
};

type IDropdownItemProps = {
    icon?: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
};

const DropdownMenu: React.FunctionComponent<IDropdownMenuProps> = (props) => {
    const { children, upward } = props;
    return (
        <motion.div
            initial={{ opacity: 0, y: upward ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: upward ? 10 : -10 }}
            className={`absolute right-0 w-44 bg-[#0d0d0d] border border-white/10 rounded-xl py-2 z-50 shadow-2xl ${upward ? "bottom-full mb-2" : "top-full mt-2"}`}
        >
            {children}
        </motion.div>
    );
};

const DropdownItem: React.FunctionComponent<IDropdownItemProps> = (props) => {
    const { icon, label, active, onClick } = props;
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-2 text-xs sm:text-[13px] hover:bg-white/5 transition-colors group ${active ? "text-white" : "text-white/60 hover:text-white"}`}
        >
            {icon && <span className={`transition-colors ${active ? "text-purple-400" : "text-white/40 group-hover:text-white"}`}>{icon}</span>}
            {label}
            {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />}
        </button>
    );
};

export { DropdownItem, DropdownMenu };
