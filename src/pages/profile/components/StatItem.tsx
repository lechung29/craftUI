/** @format */

import React from "react";

type IStatItemProps = {
    value: number;
    label: string;
    icon?: React.ReactNode;
};

const StatItem: React.FunctionComponent<IStatItemProps> = (props) => {
    const { value, label, icon } = props;
    return (
        <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 sm:gap-1.5">
                {icon}
                <span className="text-sm sm:text-lg font-bold text-white">{value}</span>
            </div>
            <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-white/30 font-semibold">{label}</span>
        </div>
    );
};

export { StatItem };
