/** @format */

import React from "react";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import { useSidebarStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { ComponentService } from "@/services";
import { IResponseStatus } from "@/types";
import { isSessionExpired } from "@/utils";
const Hero: React.FunctionComponent = () => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [componentCount, setComponentCount] = React.useState(0);
    const { setSearchKey, setSelectedStyle, setSelectedType } = useSidebarStore();
    const navigate = useNavigate();

    React.useEffect(() => {
        getNewElementCount();
    }, []);

    const getNewElementCount = async () => {
        try {
            const res = await ComponentService.getWeeklyComponentCount();
            if (res.status === IResponseStatus.Success) {
                setComponentCount(res.data!);
            }
        } catch (error) {
            console.log(error);
            if (isSessionExpired(error)) return;
        }
    };

    const onHandleSearch = () => {
        if (searchQuery) {
            setSearchKey(searchQuery);
            setSelectedStyle(undefined);
            setSelectedType(undefined);
            navigate("/elements");
        }
    };

    return (
        <section className="relative min-h-[80vh] flex items-center justify-center px-4 py-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/5 to-black/50" />
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6 sm:space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-green-500/10 border border-green-500/20 rounded-full"
                >
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                    <span className="text-xs sm:text-sm font-medium text-green-400">{componentCount} NEW ELEMENTS THIS WEEK!</span>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="space-y-3 sm:space-y-4">
                    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                        The Largest Library
                        <br />
                        of Open-Source UI
                    </h1>
                    <div className="space-y-1 sm:space-y-2">
                        <p className="text-xs sm:text-lg md:text-xl text-white/70">Community-built library of UI elements.</p>
                        <p className="text-xs sm:text-lg md:text-xl text-white/70">Copy as HTML/CSS, Tailwind, React and Figma.</p>
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-2xl mx-auto">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-xl sm:rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                        <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl overflow-hidden">
                            <div className="pl-3 sm:pl-6 pr-2 sm:pr-4">
                                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white/50" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search for components, styles, creators..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        onHandleSearch();
                                    }
                                }}
                                className="flex-1 py-3 sm:py-4 bg-transparent text-white placeholder:text-white/50 outline-none text-xs sm:text-base"
                            />
                            <button
                                onClick={onHandleSearch}
                                className="mx-1.5 sm:mx-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-medium rounded-lg sm:rounded-xl transition-all shadow-lg shadow-purple-500/20 text-xs sm:text-base"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export { Hero as HeroSection };
