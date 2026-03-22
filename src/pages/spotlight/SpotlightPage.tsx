/** @format */

import React from "react";
import { motion } from "framer-motion";
import { IComponent, IResponseStatus, ITopCreatorListInfo } from "@/types";
import { ComponentService, UserService } from "@/services";
import { isSessionExpired, showError } from "@/utils";
import { CreatorsList, SpotlightSkeleton, TabButton, WeeklyHighlights } from "./components";

export type SpotlightTabType = "weekly" | "creators" | "favorites" | "views";

const SpotlightPage: React.FunctionComponent = () => {
    const [activeTab, setActiveTab] = React.useState<SpotlightTabType>("weekly");
    const [isLoading, setIsLoading] = React.useState(false);
    const [components, setComponents] = React.useState<IComponent[]>([]);
    const [creators, setCreators] = React.useState<ITopCreatorListInfo[]>([]);

    React.useEffect(() => {
        setIsLoading(true);
        Promise.all([ComponentService.getWeeklyHighlightComponents(), UserService.getTopUsers()])
            .then(([res1, res2]) => {
                if (res1.status === IResponseStatus.Success) {
                    setComponents(res1.data || []);
                } else {
                    showError(res1.message || "Failed to load components");
                }
                if (res2.status === IResponseStatus.Success) {
                    setCreators(res2.data || []);
                } else {
                    showError(res2.message || "Failed to load creators");
                }
            })
            .catch((error) => {
                console.error("Failed to load:", error);
                if (isSessionExpired(error)) return;
                showError(error?.message);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const getTabContent = () => {
        switch (activeTab) {
            case "weekly":
                return {
                    title: "The most appreciated posts this week",
                    content: <WeeklyHighlights components={components} />,
                };
            case "creators":
                return {
                    title: "Our most active contributors",
                    content: <CreatorsList creators={creators} type="points" />,
                };
            case "favorites":
                return {
                    title: "Creators with the most favorited elements",
                    content: <CreatorsList creators={creators} type="favorites" />,
                };
            case "views":
                return {
                    title: "Creators with the most viewed elements",
                    content: <CreatorsList creators={creators} type="views" />,
                };
        }
    };

    const tabContent = getTabContent();

    return (
        <div className="max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-12 sm:pt-16 pb-8 sm:pb-12">
            <div className="text-center mb-8 sm:mb-12">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-4">Spotlight</h1>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/60">Celebrating our community's finest creators and their work</p>
            </div>

            <div className="flex justify-center mb-8 sm:mb-12 overflow-x-auto px-2">
                <div className="inline-flex items-center gap-1 sm:gap-2 p-0.5 sm:p-1 bg-white/5 rounded-lg sm:rounded-xl border border-white/10">
                    <TabButton active={activeTab === "weekly"} onClick={() => setActiveTab("weekly")}>
                        Weekly Highlights
                    </TabButton>
                    <TabButton active={activeTab === "creators"} onClick={() => setActiveTab("creators")}>
                        Top Creators
                    </TabButton>
                    <TabButton active={activeTab === "favorites"} onClick={() => setActiveTab("favorites")}>
                        Most Favorites
                    </TabButton>
                    <TabButton active={activeTab === "views"} onClick={() => setActiveTab("views")}>
                        Most Views
                    </TabButton>
                </div>
            </div>

            <div className="text-center mb-6 sm:mb-8">
                <p className="text-xs sm:text-sm md:text-base text-white/60">{tabContent.title}</p>
            </div>

            <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                {isLoading ? <SpotlightSkeleton activeTab={activeTab} /> : tabContent.content}
            </motion.div>
        </div>
    );
};

export { SpotlightPage };
