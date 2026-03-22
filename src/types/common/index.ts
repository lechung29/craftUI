/** @format */

import { Draft, produce } from "immer";
import * as _ from "lodash";

export type DeepPartial<T> = T extends object
    ? {
          [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;

export type DeepPartialObject<T> = T extends object
    ? {
          [P in keyof T]?: DeepPartialObject<T[P]> | OperationWrapper<T[P], any>;
      }
    : T | OperationWrapper<T, any>;

export type RecipeFunction<T> = (draft: Draft<T>) => void | T | undefined;
export type Recipe<T> = DeepPartialObject<T> | RecipeFunction<T> | OperationWrapper<T, any>;

interface Operation<T, R = T> {
    apply: (baseValue: T) => R;
}

export class OperationWrapper<T, R = T> {
    constructor(public operation: Operation<T, R>) {}
}

class ReplaceOperation<T, R = T> implements Operation<T, R> {
    constructor(private newValue: R) {}
    apply(): R {
        return this.newValue;
    }
}

class ToggleOperation implements Operation<boolean> {
    constructor() {}
    apply(baseValue: boolean) {
        return !baseValue;
    }
}

/**
 * **Note:** This function does **not** work if `undefined` is passed as the `value`.
 * Lodash's merge behavior ignores `undefined`, which may result in the original value being retained.
 */
export function replace<T, R = T>(value: R): OperationWrapper<T, R> {
    return new OperationWrapper<T, R>(new ReplaceOperation<T, R>(value));
}

export function toggle(): OperationWrapper<boolean> {
    return new OperationWrapper<boolean>(new ToggleOperation());
}

function customMerge(objValue: any, srcValue: any) {
    if (srcValue instanceof OperationWrapper) {
        return srcValue.operation.apply(objValue);
    }

    if (_.isArray(objValue)) {
        return srcValue;
    }
    return undefined;
}

function mergeActionCreator<T>(recipe: Recipe<T>) {
    if (recipe instanceof OperationWrapper) {
        return produce((draft) => {
            return recipe.operation.apply(draft);
        });
    } else if (recipe instanceof Function) {
        return produce(recipe);
    } else {
        return produce((draft) => {
            _.mergeWith(draft, recipe, customMerge);
        });
    }
}

function merge<T>(base: T, ...recipes: Recipe<T>[]): T {
    return recipes.reduce((result, recipe) => mergeActionCreator(recipe)(result as any), base);
}

export const MergeUtils = {
    merge,
    replace,
    toggle,
};
