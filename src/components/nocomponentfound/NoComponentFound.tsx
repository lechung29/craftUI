/** @format */

import React from "react";

const NoComponentFound: React.FunctionComponent = () => {
    return (
        <div className="flex flex-col items-center justify-center py-24 px-6">
            <div className="relative mb-6">
                <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                        <rect x="4" y="4" width="12" height="12" rx="3" fill="white" fillOpacity="0.15" />
                        <rect x="20" y="4" width="12" height="12" rx="3" fill="white" fillOpacity="0.08" />
                        <rect x="4" y="20" width="12" height="12" rx="3" fill="white" fillOpacity="0.08" />
                        <rect x="20" y="20" width="12" height="12" rx="3" fill="white" fillOpacity="0.04" />
                        <line x1="14" y1="18" x2="22" y2="18" stroke="white" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="2 2" />
                        <line x1="18" y1="14" x2="18" y2="22" stroke="white" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="2 2" />
                    </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M5 2v6M2 5h6" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </div>
            </div>
            <p className="text-white font-medium text-base mb-1">No components found</p>
            <p className="text-white/40 text-sm text-center max-w-xs">Try adjusting your search or switching the style filter</p>
        </div>
    );
};

export { NoComponentFound };
