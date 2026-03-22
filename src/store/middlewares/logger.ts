/** @format */

import { StateCreator, StoreMutatorIdentifier } from "zustand";

type AutoLogger = <T, Mps extends [StoreMutatorIdentifier, unknown][] = [], Mcs extends [StoreMutatorIdentifier, unknown][] = []>(
    f: StateCreator<T, Mps, Mcs>,
    name?: string,
) => StateCreator<T, Mps, Mcs>;

type AutoLoggerImpl = <T>(f: StateCreator<T, [], []>, name?: string) => StateCreator<T, [], []>;

const autoLoggerImpl: AutoLoggerImpl = (f, name) => (set, get, store) => {
    const loggedSet = (partial: any, replace?: boolean) => {
        const prevState = get();
        const timestamp = new Date().toLocaleTimeString();

        if (replace === true) {
            set(partial, true);
        } else {
            set(partial as any);
        }

        const nextState = get();

        const changedKeys = Object.keys(nextState as any).filter((key) => (prevState as any)[key] !== (nextState as any)[key]);

        if (changedKeys.length > 0) {
            console.group(`%c ${name || "Store"} action @ ${timestamp}`, "color: gray; font-weight: lighter;");
            console.log("%c prev state", "color: #9E9E9E; font-weight: bold;", prevState);
            console.log("%c action", "color: #03A9F4; font-weight: bold;", { type: replace === true ? "replace" : "setState", payload: partial });
            console.log("%c next state", "color: #4CAF50; font-weight: bold;", nextState);
            console.log(
                "%c changed",
                "color: #FF9800; font-weight: bold;",
                changedKeys.reduce(
                    (acc, key) => {
                        acc[key] = {
                            from: (prevState as any)[key],
                            to: (nextState as any)[key],
                        };
                        return acc;
                    },
                    {} as Record<string, any>,
                ),
            );
            console.groupEnd();
        }
    };

    store.setState = loggedSet as unknown as typeof store.setState;

    return f(loggedSet, get, store);
};

export const autoLogger = autoLoggerImpl as AutoLogger;
