/** @format */

import { SessionExpiredError } from "@/configs";
import { Breakpoint, Responsive } from "@/types";

export function isEnumValue<T extends Record<string, string | number>>(enumObj: T, value: unknown): value is T[keyof T] {
    const enumValues = Object.values(enumObj).filter((v) => typeof v === "string" || typeof v === "number");

    return enumValues.includes(value as any);
}

export const cx = (...classes: (string | undefined | null | false)[]): string => {
    return classes.filter(Boolean).join(" ");
};

const prefixMap: Record<Breakpoint, string> = {
    base: "",
    sm: "sm:",
    md: "md:",
    lg: "lg:",
    xl: "xl:",
    "2xl": "2xl:",
};

export const resolveResponsive = <T extends string | number | boolean>(value: Responsive<T> | undefined, map: Record<string, string>): string | null => {
    if (value == null) return null;

    if (typeof value !== "object") {
        return map[String(value)] ?? null;
    }

    return (
        (Object.entries(value) as [Breakpoint, T][])
            .map(([bp, val]) => {
                const cls = map[String(val)];
                if (!cls) return null;
                return prefixMap[bp] + cls;
            })
            .filter(Boolean)
            .join(" ") || null
    );
};

export const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

export const isSessionExpired = (err: unknown): err is SessionExpiredError => {
    return err instanceof SessionExpiredError;
};
