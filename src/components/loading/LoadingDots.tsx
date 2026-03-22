/** @format */

import React from "react";

const LoadingDots: React.FunctionComponent = () => {
    return (
        <div className="flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
    );
};

export { LoadingDots };
