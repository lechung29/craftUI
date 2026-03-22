/** @format */

import React from "react";

const CodeEditorSkeleton: React.FunctionComponent = () => {
    return (
        <div className="flex flex-col h-full text-white animate-pulse">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-5 py-2 sm:py-3 gap-2 sm:gap-0 shrink-0">
                <div className="h-8 w-24 bg-white/10 rounded-md" />
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-white/10 rounded-full" />
                    <div className="h-4 w-32 bg-white/10 rounded" />
                    <div className="h-4 w-16 bg-white/10 rounded" />
                    <div className="h-4 w-16 bg-white/10 rounded" />
                </div>
            </div>

            <div className="flex-1 flex flex-col mx-2 sm:mx-3 md:mx-5 gap-2 sm:gap-3 pb-2 sm:pb-3 md:pb-4 min-h-0">
                <div className="flex-1 rounded-lg sm:rounded-xl overflow-hidden min-h-0">
                    <div className="flex flex-col md:flex-row h-full">
                        <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col relative shrink-0 bg-[#212121]">
                            <div className="flex items-center justify-end gap-2 px-4 py-2 shrink-0">
                                <div className="h-4 w-20 bg-white/10 rounded" />
                                <div className="w-10 h-5 bg-white/10 rounded-full" />
                            </div>
                            <div className="flex-1 flex items-center justify-center">
                                <div className="w-48 h-48 bg-white/5 rounded-lg" />
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 flex-1 flex flex-col bg-[#212121]">
                            <div className="flex items-center gap-5 px-4 pt-3 pb-2 shrink-0">
                                <div className="h-6 w-24 bg-white/10 rounded" />
                                <div className="h-6 w-16 bg-white/10 rounded" />
                            </div>

                            <div className="flex-1 p-4 space-y-2">
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className="flex gap-2">
                                        <div className="h-4 w-8 bg-white/5 rounded" />
                                        <div className="h-4 bg-white/10 rounded" style={{ width: `${Math.random() * 40 + 40}%` }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg sm:rounded-xl gap-2 shrink-0 bg-[#292929]">
                    <div className="flex gap-2">
                        <div className="h-8 w-32 bg-white/10 rounded-md" />
                        <div className="h-8 w-28 bg-white/10 rounded-md" />
                        <div className="h-8 w-24 bg-white/10 rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export { CodeEditorSkeleton };
