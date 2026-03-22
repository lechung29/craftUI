/** @format */

import { SetStateAction, useCallback, useRef, useState } from "react";

type IUseControllableStateOptions<T, C = T> = {
    value?: T;
    defaultValue?: T;
    onChange?: (v: C, ...args: any[]) => void;
};

export function useControllableState<T, C = T>(options: {
    value: Exclude<T, undefined>;
    defaultValue?: Exclude<T, undefined> | undefined;
    onChange?: (v: C, ...args: any[]) => void;
}): [Exclude<T, undefined>, (value: SetStateAction<T>, ...args: any[]) => void, boolean];
export function useControllableState<T, C = T>(options: {
    value?: Exclude<T, undefined> | undefined;
    defaultValue: Exclude<T, undefined>;
    onChange?: (v: C, ...args: any[]) => void;
}): [Exclude<T, undefined>, (value: SetStateAction<T>, ...args: any[]) => void, boolean];
export function useControllableState<T, C = T>(options?: {
    value?: T;
    defaultValue?: T;
    onChange?: (v: C, ...args: any[]) => void;
}): [Exclude<T, undefined> | undefined, (value: SetStateAction<Exclude<T, undefined> | undefined>, ...args: any[]) => void, boolean];
export function useControllableState<T, C extends T = T>(options: IUseControllableStateOptions<T, C> = {}): [T | undefined, (value: SetStateAction<T | undefined>, ...args: any[]) => void, boolean] {
    const { value, defaultValue, onChange } = options;
    let [stateValue, setStateValue] = useState(value || defaultValue);
    const currentValue = useRef<T | undefined>(stateValue);

    let isControlled = value !== undefined;

    currentValue.current = isControlled ? value : stateValue;
    let setValue: (state: SetStateAction<T | undefined>, ...arg: any[]) => void = useCallback(
        (value, ...args: any[]) => {
            let onChangeCaller = (value: T | undefined, ...onChangeArgs: any[]) => {
                if (onChange) {
                    if (!Object.is(currentValue, value)) {
                        onChange(value as C, ...onChangeArgs);
                    }
                }
                if (!isControlled) {
                    currentValue.current = value;
                }
            };

            if (typeof value === "function") {
                const valueFunction = value as (value: T | undefined, ...args: any[]) => T;
                let updateFunction = (oldValue: T | undefined, ...functionArgs: any[]) => {
                    let interceptedValue = valueFunction(isControlled ? currentValue.current : oldValue, ...functionArgs);
                    onChangeCaller(interceptedValue, ...args);
                    if (!isControlled) {
                        return interceptedValue;
                    }
                    return oldValue;
                };
                setStateValue(updateFunction);
            } else {
                if (!isControlled) {
                    setStateValue(value);
                }
                onChangeCaller(value, ...args);
            }
        },
        [isControlled, currentValue, onChange],
    );

    return [currentValue.current, setValue, isControlled];
}
