/** @format */

import { Check, ChevronDown, Sliders } from "lucide-react";
import React from "react";

export interface DecorItemProps {
    gradient: string;
    label?: string;
}

const DecorWrapper: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => (
    <div className="px-3 py-2.5 rounded-xl border border-white/10 backdrop-blur-md shadow-lg bg-white/5">{children}</div>
);

const DecorButton: React.FunctionComponent<DecorItemProps> = ({ label, gradient }) => (
    <DecorWrapper>
        <button className={`px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r ${gradient} shadow-md`}>{label}</button>
    </DecorWrapper>
);

const DecorCheckbox: React.FunctionComponent<DecorItemProps> = ({ label, gradient }) => (
    <DecorWrapper>
        <div className={`flex items-center gap-2 text-sm font-medium bg-gradient-to-r ${gradient} px-3 py-1.5 rounded-lg`}>
            <Check size={14} />
            {label}
        </div>
    </DecorWrapper>
);

const DecorDropdown: React.FunctionComponent<DecorItemProps> = ({ label, gradient }) => (
    <DecorWrapper>
        <div className={`flex justify-between items-center bg-gradient-to-r ${gradient} px-3 py-2 rounded-lg text-sm font-medium w-36`}>
            {label}
            <ChevronDown size={14} />
        </div>
    </DecorWrapper>
);

const DecorCard: React.FunctionComponent<DecorItemProps> = ({ label, gradient }) => (
    <DecorWrapper>
        <div className={`bg-gradient-to-r ${gradient} p-3 rounded-lg text-sm font-medium w-40`}>
            {label}
            <p className="text-xs text-black/60 mt-1 font-normal">Clean & reusable</p>
        </div>
    </DecorWrapper>
);

const DecorToggle: React.FunctionComponent<DecorItemProps> = ({ gradient }) => (
    <DecorWrapper>
        <div className={`w-12 h-6 rounded-full bg-gradient-to-r ${gradient} relative shadow-inner`}>
            <div className="absolute right-1 top-1 w-4 h-4 bg-white/90 rounded-full shadow-md" />
        </div>
    </DecorWrapper>
);

const DecorSlider: React.FunctionComponent<DecorItemProps> = ({ gradient }) => (
    <DecorWrapper>
        <div className="w-36">
            <div className="flex items-center gap-2 mb-1.5 text-xs">
                <Sliders size={14} />
                <span className="font-medium">Level</span>
            </div>
            <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                <div className={`h-full w-2/3 bg-gradient-to-r ${gradient}`} />
            </div>
        </div>
    </DecorWrapper>
);

export { DecorWrapper, DecorButton, DecorCheckbox, DecorDropdown, DecorCard, DecorToggle, DecorSlider };
