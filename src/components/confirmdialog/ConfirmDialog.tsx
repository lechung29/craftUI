/** @format */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { cx } from "@/utils";
import { DefaultButton, PrimaryButton } from "../button";

export interface IConfirmDialogProps {
    isOpen: boolean;
    title?: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "danger" | "warning" | "info";
    isLoading?: boolean;
    onConfirm: () => void | Promise<void>;
    onCancel: () => void;
}

const variantConfig = {
    danger: {
        icon: "text-rose-400",
        iconBg: "bg-rose-500/10",
        confirmBtn: "bg-rose-500 hover:bg-rose-600 text-white",
    },
    warning: {
        icon: "text-amber-400",
        iconBg: "bg-amber-500/10",
        confirmBtn: "bg-amber-500 hover:bg-amber-600 text-white",
    },
    info: {
        icon: "text-indigo-400",
        iconBg: "bg-indigo-500/10",
        confirmBtn: "bg-gradient-to-r from-indigo-600 to-cyan-500 text-white",
    },
};

const ConfirmDialog: React.FunctionComponent<IConfirmDialogProps> = (props) => {
    const {
        isOpen,
        title = "Are you sure?",
        description = "This action cannot be undone.",
        confirmLabel = "Confirm",
        cancelLabel = "Cancel",
        variant = "danger",
        isLoading = false,
        onConfirm,
        onCancel,
    } = props;

    const config = variantConfig[variant];
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) onCancel();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onCancel]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 z-50"
                        style={{ background: "rgba(0,0,0,0.6)" }}
                        onClick={onCancel}
                    />

                    <motion.div
                        key="dialog"
                        initial={{ opacity: 0, scale: 0.95, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 8 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none"
                    >
                        <div
                            className="w-full max-w-sm pointer-events-auto rounded-2xl border border-white/[0.08] shadow-2xl p-6 flex flex-col gap-4"
                            style={{ background: "#141414" }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cx("p-2 rounded-xl shrink-0", config.iconBg)}>
                                    <AlertTriangle className={cx("w-5 h-5", config.icon)} />
                                </div>
                                <h3 className="text-base font-semibold text-white">{title}</h3>
                            </div>
                            <p className="text-sm text-white/50 leading-relaxed">{description}</p>

                            <div className="flex items-center justify-end gap-2 pt-1">
                                <DefaultButton
                                    onClick={onCancel}
                                    disabled={isLoading}
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors disabled:opacity-40"
                                >
                                    {cancelLabel}
                                </DefaultButton>
                                <PrimaryButton
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className={cx(
                                        "px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px] flex items-center justify-center gap-2",
                                        config.confirmBtn,
                                    )}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                                            </svg>
                                        </>
                                    ) : (
                                        confirmLabel
                                    )}
                                </PrimaryButton>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export { ConfirmDialog };
