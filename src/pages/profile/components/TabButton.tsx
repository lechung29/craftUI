/** @format */

import React from "react";
import { motion } from "framer-motion";

type ITabButtonProps = {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
};

const TabButton: React.FunctionComponent<ITabButtonProps> = (props) => {
    const { active, children, onClick } = props;
    return (
        <button
            onClick={onClick}
            className={`px-3 sm:px-5 py-2 sm:py-3 text-[11px] sm:text-sm font-medium transition-all relative whitespace-nowrap ${active ? "text-white" : "text-white/50 hover:text-white"}`}
        >
            {children}
            {active && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" initial={false} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
            )}
        </button>
    );
};

export { TabButton };
