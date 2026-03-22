/** @format */

import { DeepPartial } from "@/types";
import { produce, Draft, freeze } from "immer";
import * as _ from "lodash";
import { useCallback, useState } from "react";

export type DraftFunction<S> = (draft: Draft<S>) => void;
export type UpdateOptions = {
    merge?: boolean;
    arrayAppend?: boolean;
};

export interface Updater<S> {
    (arg: DraftFunction<S>): void;
    (arg: S, options: { merge: false }): void;
    (arg: DeepPartial<S>, options?: { merge?: true; arrayAppend?: boolean }): void;
}

export type ImmerHookReturn<S> = [S, Updater<S>];

function checkArgPartial<S>(arg: S | DeepPartial<S>, options?: UpdateOptions): arg is DeepPartial<S> {
    return _.isEmpty(arg) || options?.merge === true;
}

export function useImmerState<S = any>(initialValue: S | (() => S)): ImmerHookReturn<S> {
    const [value, updateValue] = useState(() => freeze(initialValue instanceof Function ? initialValue() : initialValue, true));
    return [
        value,
        useCallback((arg: DraftFunction<S> | S | DeepPartial<S>, options: { merge?: boolean; arrayAppend?: boolean } = { merge: true }) => {
            if (arg instanceof Function) {
                updateValue(produce(arg));
            } else if (checkArgPartial(arg, options)) {
                updateValue(
                    produce((draft: any) => {
                        _.mergeWith(draft, arg, (objValue: any, srcValue: any) => {
                            if (_.isArray(objValue)) {
                                return options.arrayAppend ? objValue.concat(srcValue) : srcValue;
                            }
                        });
                    }),
                );
            } else {
                updateValue(freeze(arg));
            }
        }, []),
    ];
}
