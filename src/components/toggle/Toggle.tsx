/** @format */

import { cx } from "@/utils";
import React from "react";

export interface ToggleProps {
    checked: boolean;
    onChange: () => void;
    label?: string;
    disabled?: boolean;
    className?: string;
}

const Toggle: React.FunctionComponent<ToggleProps> = (props) => {
    const { checked, onChange, label, disabled = false, className = "" } = props;
    return (
        <div className={cx("flex items-center gap-2.5 md:gap-3", className)}>
            <button
                onClick={onChange}
                disabled={disabled}
                className={cx(
                    "relative inline-flex h-5 w-9 md:h-6 md:w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0a]",
                    checked ? "bg-indigo-600 focus:ring-indigo-500" : "bg-white/10 focus:ring-white/30",
                    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                )}
                aria-checked={checked}
                role="switch"
                aria-label={label || "Toggle"}
            >
                <span
                    className={cx(
                        "inline-block h-3.5 w-3.5 md:h-4 md:w-4 transform rounded-full bg-white transition-transform",
                        checked ? "translate-x-[1.15rem] md:translate-x-6" : "translate-x-0.5 md:translate-x-1",
                    )}
                />
            </button>
            {label && <span className="text-xs md:text-sm font-medium text-white">{label}</span>}
        </div>
    );
};

export { Toggle };
