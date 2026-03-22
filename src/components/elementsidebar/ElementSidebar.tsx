/** @format */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ComponentType } from "@/types/components";
import { useNavigate } from "react-router-dom";
import { categories } from "./utils";
import { cx } from "@/utils";

export interface ISidebarProps {
    selectedCategory?: ComponentType;
    onSelectCategory: (category?: ComponentType) => void;
}

const ElementSidebar: React.FunctionComponent<ISidebarProps> = (props) => {
    const { selectedCategory, onSelectCategory } = props;
    const navigate = useNavigate();
    const [showTopIndicator, setShowTopIndicator] = React.useState(false);
    const [showBottomIndicator, setShowBottomIndicator] = React.useState(true);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
            setShowTopIndicator(scrollTop > 10);
            setShowBottomIndicator(scrollTop < scrollHeight - clientHeight - 10);
        }
    };

    React.useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
            handleScroll();
            return () => container.removeEventListener("scroll", handleScroll);
        }
    }, []);

    return (
        <aside className="hidden lg:block w-56 sticky top-2 mt-4 self-start">
            <div className="relative h-[500px]">
                <AnimatePresence>
                    {showTopIndicator && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center py-2 bg-gradient-to-b from-black/80 to-transparent pointer-events-none rounded-t-lg"
                        >
                            <ChevronDown className="w-4 h-4 text-white/60 rotate-180" />
                        </motion.div>
                    )}
                </AnimatePresence>
                <div
                    ref={scrollContainerRef}
                    className="h-full overflow-y-auto p-3 space-y-1 scrollbar-hide bg-black/40 rounded-lg"
                    style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                    }}
                >
                    {categories.map((category) => {
                        const Icon = category.icon;
                        const isActive = selectedCategory === category.value;

                        return (
                            <button
                                key={category.label}
                                onClick={() => {
                                    onSelectCategory(category.value);
                                    navigate("/elements");
                                }}
                                className={cx(
                                    "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all",
                                    isActive ? "bg-white/10 text-white shadow-lg" : "text-white/70 hover:text-white hover:bg-white/5",
                                )}
                            >
                                <div className="flex items-center gap-2.5">
                                    <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                                    <span className="font-normal">{category.label}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <AnimatePresence>
                    {showBottomIndicator && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center py-2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none rounded-b-lg"
                        >
                            <ChevronDown className="w-4 h-4 text-white/60" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </aside>
    );
};

export { ElementSidebar };
