/** @format */

import React from "react";
import { useNavigate } from "react-router-dom";

const ComponentNotFound: React.FunctionComponent = () => {
    const navigate = useNavigate();

    const onGoBackMouseEnter = (e: React.MouseEvent) => {
        (e.currentTarget as HTMLButtonElement).style.background = "#2e2e2e";
        (e.currentTarget as HTMLButtonElement).style.color = "#fff";
    };

    const onGoBackMouseLeave = (e: React.MouseEvent) => {
        (e.currentTarget as HTMLButtonElement).style.background = "#252525";
        (e.currentTarget as HTMLButtonElement).style.color = "#aaa";
    };

    const onBrowseMouseEnter = (e: React.MouseEvent) => {
        (e.currentTarget as HTMLButtonElement).style.background = "#6d28d9";
    };
    const onBrowseMouseLeave = (e: React.MouseEvent) => {
        (e.currentTarget as HTMLButtonElement).style.background = "#7c3aed";
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-6 select-none rounded-xl min-h-80 bg-[#1a1a1a]">
            <div className="relative flex items-center justify-center w-20 h-20">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <rect x="8" y="8" width="28" height="28" rx="3" stroke="#3a3a3a" strokeWidth="2" strokeDasharray="6 3" />
                    <rect x="44" y="8" width="28" height="28" rx="3" stroke="#3a3a3a" strokeWidth="2" strokeDasharray="6 3" />
                    <rect x="8" y="44" width="28" height="28" rx="3" stroke="#3a3a3a" strokeWidth="2" strokeDasharray="6 3" />
                    <rect x="44" y="44" width="28" height="28" rx="3" stroke="#3a3a3a" strokeWidth="2" strokeDasharray="6 3" />
                    <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="#555" fontSize="22" fontWeight="700" fontFamily="monospace">
                        ?
                    </text>
                </svg>
            </div>

            <div className="flex flex-col items-center gap-2 text-center px-6">
                <h2 className="text-white font-semibold text-lg tracking-[0.01em]">Component not found</h2>
                <p className="text-sm text-[#666] max-w-xs leading-[1.6]">This component doesn't exist or may have been removed.</p>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#252525] border border-[#333]">
                <span className="w-1.5 h-1.5 rounded-[50%] bg-[#ef4444] inline-block shrink-0" />
                <code className="text-xs text-[#888] tracking-[0.05em]">ERROR: COMPONENT_NOT_FOUND</code>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-[#252525] text-[#aaa] border border-[#333] transition-colors"
                    onMouseEnter={onGoBackMouseEnter}
                    onMouseLeave={onGoBackMouseLeave}
                >
                    ← Go back
                </button>
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-[#7c3aed] text-white border border-[#6d28d9] transition-colors"
                    onMouseEnter={onBrowseMouseEnter}
                    onMouseLeave={onBrowseMouseLeave}
                >
                    Browse components
                </button>
            </div>
        </div>
    );
};

export { ComponentNotFound };
