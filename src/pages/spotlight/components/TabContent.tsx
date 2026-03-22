/** @format */

import { ComponentCard } from "@/components";
import { useAuthStore } from "@/store";
import { IComponent, ITopCreatorListInfo } from "@/types";
import { Bookmark, Hexagon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

interface WeeklyHighlightsProps {
    components: IComponent[];
}

interface CreatorsListProps {
    creators: ITopCreatorListInfo[];
    type: "points" | "favorites" | "views";
}

interface CreatorCardProps {
    creator: ITopCreatorListInfo;
    type: "points" | "favorites" | "views";
}

const TabButton: React.FunctionComponent<TabButtonProps> = (props) => {
    const { active, onClick, children } = props;
    return (
        <button
            onClick={onClick}
            className={`
                px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap
                ${active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25" : "text-white/70 hover:text-white hover:bg-white/5"}
            `}
        >
            {children}
        </button>
    );
};

const WeeklyHighlights: React.FunctionComponent<WeeklyHighlightsProps> = (props) => {
    const { components } = props;
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const handleGetCode = (component: IComponent) => {
        navigate(`/view/${component._id}`);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {components.map((post, index) => (
                <ComponentCard key={post._id} component={post} index={index} isSaved={user?.savedIds.includes(post._id)} onGetCode={handleGetCode} />
            ))}
        </div>
    );
};

const CreatorsList: React.FunctionComponent<CreatorsListProps> = (props) => {
    const { creators, type } = props;
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-7xl mx-auto">
            {creators.map((creator) => (
                <CreatorCard key={creator._id} creator={creator} type={type} />
            ))}
        </div>
    );
};

const CreatorCard: React.FunctionComponent<CreatorCardProps> = (props) => {
    const { creator, type } = props;
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const formatNumber = (num: number): string => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + "M";
        }
        if (num >= 1000) {
            return Math.floor(num / 1000) + "K";
        }
        return num.toString();
    };

    const getMetricValue = () => {
        switch (type) {
            case "points":
                return creator.points;
            case "favorites":
                return creator.totalSaves;
            case "views":
                return creator.totalViews;
        }
    };

    const getMetricLabel = () => {
        switch (type) {
            case "points":
                return "";
            case "favorites":
                return "";
            case "views":
                return "views";
        }
    };

    const getIcon = () => {
        switch (type) {
            case "points":
                return <Hexagon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />;
            case "favorites":
                return <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />;
            case "views":
                return null;
        }
    };

    return (
        <button
            onClick={() => navigate(user?._id === creator._id ? "/my-profile" : `/profile/${creator._id}`)}
            className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[#0f0f0f] rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all group text-left w-full"
        >
            <img src={creator.avatar} alt={creator.username} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-white/20 flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-white truncate">{creator.username}</h3>
                <p className="text-xs sm:text-sm text-white/50">{creator.postCount} posts</p>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
                {getIcon()}
                <span className="text-xs sm:text-sm font-medium text-white/90">
                    {formatNumber(getMetricValue()!)} {getMetricLabel()}
                </span>
            </div>
        </button>
    );
};

export { CreatorCard, CreatorsList, TabButton, WeeklyHighlights };
