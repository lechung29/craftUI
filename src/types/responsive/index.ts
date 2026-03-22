/** @format */

type Breakpoint = "base" | "sm" | "md" | "lg" | "xl" | "2xl";

type Responsive<T> = T | Partial<Record<Breakpoint, T>>;

export type { Breakpoint, Responsive };
