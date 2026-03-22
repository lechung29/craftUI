/** @format */

import { MergeUtils, Recipe } from "@/types";
import { freeze } from "immer";
import { useCallback, useState } from "react";

export type UpdaterV2<S> = (recipe: Recipe<S>) => void;
export type DeferUpdater<S> = (recipe: Recipe<S>) => VoidFunction;
export type ImmerHookReturnV2<S> = {
    state: S;
    update: UpdaterV2<S>;
    deferUpdate: DeferUpdater<S>;
};

export function useImmerStateV2<S = any>(initialValue: S | (() => S)): ImmerHookReturnV2<S> {
    const [state, setState] = useState(() => {
        const value = initialValue instanceof Function ? initialValue() : initialValue;
        return freeze(value); // Ensure the initial state is frozen
    });

    const update: UpdaterV2<S> = useCallback((recipe: Recipe<S>) => {
        setState((currentState) => MergeUtils.merge(currentState, recipe));
    }, []);

    const deferUpdate = useCallback(
        (recipe: Recipe<S>) => {
            let isUpdateApplied = false;

            const deferredUpdate = () => {
                if (!isUpdateApplied) {
                    update(recipe);
                    isUpdateApplied = true;
                }
            };

            return deferredUpdate;
        },
        [update],
    );

    return { state, update, deferUpdate };
}
