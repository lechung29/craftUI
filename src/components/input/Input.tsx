/** @format */

import { cx } from "@/utils";
import React, { useState, useCallback, useEffect } from "react";

interface IBaseInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    /**
     * Error state - shows red border and error styling
     * @default false
     */
    isError?: boolean;

    /**
     * Hide/remove border when false
     * @default true
     */
    withoutBorder?: boolean;

    /**
     * Icon element to display on the left side
     */
    leftIcon?: React.ReactNode;

    /**
     * Icon element to display on the right side
     */
    rightIcon?: React.ReactNode;

    /**
     * Callback fired when input value changes (uncontrolled mode helper)
     * Receives both the string value and the change event
     * @param value - Current input value
     * @param event - React change event
     */
    onChange?: (value: string, event?: React.ChangeEvent<HTMLInputElement>) => void;

    /**
     * Callback for standard HTML onChange event
     * Use this for direct event handling
     */
    onChangeEvent?: React.ChangeEventHandler<HTMLInputElement>;
}

const Input = React.forwardRef<HTMLInputElement, IBaseInputProps>(
    ({ className = "", isError = false, withoutBorder = true, leftIcon, rightIcon, value, onChange, onChangeEvent, style, ...rest }, ref) => {
        const isControlled = value !== undefined;
        const [internalValue, setInternalValue] = useState<string>(typeof value === "string" ? value : "");

        useEffect(() => {
            if (isControlled && typeof value === "string") {
                setInternalValue(value);
            }
        }, [value, isControlled]);

        const currentValue = isControlled ? value : internalValue;

        const handleChange = useCallback(
            (event: React.ChangeEvent<HTMLInputElement>) => {
                const newValue = event.target.value;

                if (!isControlled) {
                    setInternalValue(newValue);
                }

                onChange?.(newValue, event);
                onChangeEvent?.(event);
            },
            [isControlled, onChange, onChangeEvent],
        );

        const baseStyles = cx(
            "w-full",
            "px-4 py-2.5 sm:py-3",
            "text-xs sm:text-sm",
            "rounded-lg",
            "transition-all duration-200",
            "placeholder:text-white/40",
            "text-white/90",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "focus:outline-none",
            "bg-white/5",
            isError
                ? "border-2 border-red-500 focus:border-red-600 focus:bg-white/10 focus:ring-1 focus:ring-red-500"
                : withoutBorder
                  ? "border border-white/10 focus:border-indigo-500 focus:bg-white/10"
                  : "border-0 focus:bg-white/10",
            className,
        );

        if (leftIcon || rightIcon) {
            return (
                <div className="relative w-full" style={style}>
                    {leftIcon && <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none flex items-center">{leftIcon}</div>}
                    <input
                        {...rest}
                        ref={ref}
                        type={rest.type || "text"}
                        value={currentValue}
                        onChange={handleChange}
                        className={cx(baseStyles, leftIcon ? "pl-9 sm:pl-10" : null, rightIcon ? "pr-9 sm:pr-10" : null)}
                    />

                    {rightIcon && <div className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-white/50 flex items-center">{rightIcon}</div>}
                </div>
            );
        }
        return <input {...rest} ref={ref} type={rest.type || "text"} value={currentValue} onChange={handleChange} className={baseStyles} style={style} />;
    },
);

export { Input, type IBaseInputProps };
