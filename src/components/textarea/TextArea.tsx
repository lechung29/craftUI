/** @format */

import React, { useState, useCallback, useEffect } from "react";
import { cx } from "@/utils";

interface IBaseTextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
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
     * Callback fired when textarea value changes (uncontrolled mode helper)
     * Receives both the string value and the change event
     * @param value - Current textarea value
     * @param event - React change event
     */
    onChange?: (value: string, event?: React.ChangeEvent<HTMLTextAreaElement>) => void;

    /**
     * Callback for standard HTML onChange event
     * Use this for direct event handling
     */
    onChangeEvent?: React.ChangeEventHandler<HTMLTextAreaElement>;

    /**
     * Number of visible text rows
     * @default 4
     */
    rows?: number;

    /**
     * Maximum character count to display (optional)
     * Shows character counter if provided
     */
    maxChars?: number;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, IBaseTextAreaProps>(
    ({ className = "", isError = false, withoutBorder = true, leftIcon, rightIcon, value, onChange, onChangeEvent, style, rows = 4, maxChars, ...rest }, ref) => {
        const isControlled = value !== undefined;
        const [internalValue, setInternalValue] = useState<string>(typeof value === "string" ? value : "");

        useEffect(() => {
            if (isControlled && typeof value === "string") {
                setInternalValue(value);
            }
        }, [value, isControlled]);

        const currentValue = isControlled ? value : internalValue;

        const handleChange = useCallback(
            (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "focus:outline-none",
            "resize-none",
            "bg-white/5",
            "text-white/90",
            "scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20",
            isError
                ? "border-2 border-red-500 focus:border-red-600 focus:bg-white/10 focus:ring-1 focus:ring-red-500"
                : withoutBorder
                  ? "border border-white/10 focus:border-indigo-500 focus:bg-white/10"
                  : "border-0 focus:bg-white/10",
            className,
        );

        if (leftIcon || rightIcon) {
            return (
                <div className="w-full" style={style}>
                    <div className="relative w-full">
                        {leftIcon && <div className="absolute left-2.5 sm:left-3 top-3.5 text-white/50 pointer-events-none flex items-center">{leftIcon}</div>}
                        <textarea {...rest} ref={ref} value={currentValue} onChange={handleChange} rows={rows} className={cx(baseStyles, leftIcon ? "pl-9 sm:pl-10" : null, rightIcon ? "pr-9 sm:pr-10" : null)} />

                        {rightIcon && <div className="absolute right-2.5 sm:right-3 top-3.5 text-white/50 flex items-center">{rightIcon}</div>}
                    </div>
                    {maxChars && (
                        <div className="flex justify-end mt-1.5 md:mt-2 text-[10px] md:text-xs text-white/40">
                            {String(currentValue).length}/{maxChars} characters
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div className="w-full" style={style}>
                <textarea {...rest} ref={ref} value={currentValue} onChange={handleChange} rows={rows} className={baseStyles} />
                {maxChars && (
                    <div className="flex justify-end mt-1.5 md:mt-2 text-[10px] md:text-xs text-white/40">
                        {String(currentValue).length}/{maxChars} characters
                    </div>
                )}
            </div>
        );
    },
);

TextArea.displayName = "BaseTextArea";

export { TextArea as BaseTextArea, type IBaseTextAreaProps };
