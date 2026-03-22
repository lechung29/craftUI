/** @format */

import React from "react";
import { SpotlightTabType } from "../SpotlightPage";

type ISpotlightShimmerProps = { activeTab: SpotlightTabType };

const SpotlightSkeleton: React.FunctionComponent<ISpotlightShimmerProps> = (props) => {
    const { activeTab } = props;
    const isWeekly = activeTab === "weekly";

    return (
        <div className={`grid gap-4 sm:gap-6 ${isWeekly ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl"} mx-auto`}>
            {Array.from({ length: 9 }).map((_, index) =>
                isWeekly ? (
                    <div key={index} className="animate-pulse bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                        <div className="aspect-video bg-white/10" />
                        <div className="p-4 space-y-2">
                            <div className="h-4 bg-white/10 rounded w-3/4" />
                            <div className="h-3 bg-white/10 rounded w-1/2" />
                        </div>
                    </div>
                ) : (
                    <div key={index} className="animate-pulse flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[#0f0f0f] rounded-lg sm:rounded-xl border border-white/10">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-white/10 rounded w-2/3" />
                            <div className="h-3 bg-white/10 rounded w-1/3" />
                        </div>
                        <div className="h-4 bg-white/10 rounded w-12 flex-shrink-0" />
                    </div>
                ),
            )}
        </div>
    );
};

export { SpotlightSkeleton };
