/** @format */

import React, { useState, useEffect, useCallback } from "react";
import { twMerge } from "tailwind-merge";
import { LoadingDots } from "@/components/loading";

export interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    isLoading?: boolean;
    setLoading?: (loading: boolean) => void;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<any>;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>((props, ref) => {
    const { children, className = "", disabled, isLoading, setLoading, onClick, leftIcon, rightIcon, ...rest } = props;

    const [internalLoading, setInternalLoading] = useState<boolean>(Boolean(isLoading));

    useEffect(() => {
        setInternalLoading(Boolean(isLoading));
    }, [isLoading]);

    const setLoadingState = useCallback(
        (v: boolean) => {
            setInternalLoading(v);
            setLoading?.(v);
        },
        [setLoading],
    );

    const handleClick = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            if (!onClick) return;

            try {
                setLoadingState(true);
                const result = onClick(event);

                if (result && typeof (result as Promise<any>).finally === "function") {
                    (result as Promise<any>).finally(() => setLoadingState(false));
                } else {
                    setLoadingState(false);
                }
            } catch (err) {
                setLoadingState(false);
                throw err;
            }
        },
        [onClick, setLoadingState],
    );

    const isDisabled = Boolean(disabled) || internalLoading;

    const baseClass = "flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 min-h-10 min-w-20 rounded-lg transition-all text-sm font-medium text-white";
    const enabledBg = "bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:via-purple-600 hover:to-pink-600";
    const disabledClass = "opacity-60 cursor-not-allowed";

    const classNames = twMerge(baseClass, enabledBg, isDisabled ? disabledClass : "", className);

    return (
        <button {...rest} ref={ref} type={rest.type || "button"} onClick={handleClick} disabled={isDisabled} className={classNames}>
            {internalLoading ? (
                <LoadingDots />
            ) : (
                <>
                    {leftIcon && <span className="inline-flex">{leftIcon}</span>}
                    {children}
                    {rightIcon && <span className="inline-flex">{rightIcon}</span>}
                </>
            )}
        </button>
    );
});

export { PrimaryButton };
