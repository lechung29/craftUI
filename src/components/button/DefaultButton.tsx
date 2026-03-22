/** @format */

import React, { useCallback } from "react";
import { twMerge } from "tailwind-merge";

export interface DefaultButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    variant?: "white" | "dark";
}

const DefaultButton = React.forwardRef<HTMLButtonElement, DefaultButtonProps>((props, ref) => {
    const { children, className = "", disabled, onClick, leftIcon, rightIcon, variant = "dark", ...rest } = props;

    const handleClick = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            if (onClick && !disabled) {
                onClick(event);
            }
        },
        [onClick, disabled],
    );

    const baseClass = "flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 h-10 rounded-lg transition-all text-sm font-medium text-white/90";
    const variantBg = variant === "white" ? "bg-white/10 hover:bg-white/20" : "bg-white/5 hover:bg-white/10";
    const disabledClass = "opacity-50 cursor-not-allowed";

    const classNames = twMerge(baseClass, variantBg, disabled ? disabledClass : "", className);

    return (
        <button {...rest} ref={ref} type={rest.type || "button"} onClick={handleClick} disabled={disabled} className={classNames}>
            <>
                {leftIcon && <span className="inline-flex">{leftIcon}</span>}
                {children}
                {rightIcon && <span className="inline-flex">{rightIcon}</span>}
            </>
        </button>
    );
});

export { DefaultButton };
