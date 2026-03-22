/** @format */

import { Plus } from "lucide-react";
import React from "react";
import { ProfileTabType } from "../ProfilePage";

type IEmptyListProps = {
    activeTab: ProfileTabType;
    onCreate?: () => void;
};

const EmptyList: React.FunctionComponent<IEmptyListProps> = (props) => {
    const { activeTab, onCreate } = props;
    return (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 px-4">
            <div className="mb-5 sm:mb-6 w-20 sm:w-24 h-20 sm:h-24 flex items-center justify-center text-white/5">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2">{activeTab === "posts" ? "No Posts Found" : "No Drafts Found"}</h2>
            <p className="text-white/30 text-center max-w-sm mb-6 sm:mb-8 text-xs sm:text-sm font-normal">
                {activeTab === "posts" ? "Your creations will appear here once you've published them." : "Your saved drafts will appear here."}
            </p>
            {activeTab === "posts" && (
                <button
                    onClick={onCreate}
                    className="flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 rounded-lg sm:rounded-xl text-xs sm:text-sm text-white transition-all shadow-lg shadow-purple-500/25"
                >
                    <Plus className="w-3.5 sm:w-4 sm:h-4 h-3.5" /> Create
                </button>
            )}
        </div>
    );
};

export { EmptyList };
