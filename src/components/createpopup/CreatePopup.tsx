/** @format */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ComponentStyle, ComponentType } from "@/types/components";
import { PrimaryButton } from "../button";
import { useNavigate } from "react-router-dom";
import { useCodeEditorStore } from "@/store/codeEditorStore";
import { componentTypes, technologies } from "./utils";
import { cx } from "@/utils";
import { useImmerState } from "@/hooks/useImmerState";

export interface ICreatePopupProps {
    isOpen: boolean;
    type?: ComponentType;
    tech?: ComponentStyle;
    onClose: () => void;
}

type ICreatePopupState = {
    selectedType: ComponentType;
    selectedStyle: ComponentStyle;
};

const CreatePopup: React.FunctionComponent<ICreatePopupProps> = (props) => {
    const { isOpen, onClose, tech = ComponentStyle.CSS, type = ComponentType.Button } = props;
    const [state, setState] = useImmerState<ICreatePopupState>({
        selectedType: type,
        selectedStyle: tech,
    });
    const { selectedType, selectedStyle } = state;
    const { initializeCode } = useCodeEditorStore();
    const navigate = useNavigate();

    const onSelectComponentType = (newType: ComponentType) => {
        setState({ selectedType: newType });
    };

    const onSelectComponentStyle = (newStyle: ComponentStyle) => {
        setState({ selectedStyle: newStyle });
    };

    const handleContinue = () => {
        initializeCode(selectedStyle, selectedType);
        navigate(`/create?type=${ComponentType[selectedType]}&tech=${selectedStyle}`);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
                        onClick={onClose}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-5xl bg-[#171717] rounded-xl sm:rounded-2xl shadow-2xl max-h-[95vh] overflow-y-auto relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                        >
                            <button onClick={onClose} className="absolute top-3 right-3 sm:top-5 sm:right-5 p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors z-10">
                                <X className="w-5 h-5 sm:w-6 sm:h-6 text-white/70 hover:text-white" />
                            </button>

                            <div className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 h-full flex flex-col">
                                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white text-center mb-4 sm:mb-6 md:mb-8 pr-8 sm:pr-0">What are you making?</h2>

                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 flex-1">
                                    {componentTypes.map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => onSelectComponentType(type.id)}
                                            className={cx(
                                                "relative p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-2 transition-all duration-200 group flex flex-col items-center justify-center min-h-[100px] sm:min-h-[120px]",
                                                selectedType === type.id ? "border-indigo-500 bg-indigo-500/10" : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10",
                                            )}
                                        >
                                            <div className="flex items-center justify-center mb-2 sm:mb-3">
                                                {type.id === ComponentType.Button && (
                                                    <div
                                                        className={cx(
                                                            "w-12 h-9 sm:w-14 sm:h-10 md:w-16 md:h-12 rounded-full flex items-center justify-center",
                                                            selectedType === type.id ? "bg-indigo-500" : "bg-white/20",
                                                        )}
                                                    >
                                                        <div className="w-6 h-1 sm:w-7 sm:h-1.5 md:w-8 md:h-1.5 bg-white rounded-full" />
                                                    </div>
                                                )}
                                                {type.id === ComponentType.Switch && (
                                                    <div
                                                        className={cx(
                                                            "w-12 h-6 sm:w-14 sm:h-7 md:w-16 md:h-8 rounded-full flex items-center px-1",
                                                            selectedType === type.id ? "bg-white/30" : "bg-white/20",
                                                        )}
                                                    >
                                                        <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-white/70 rounded-full" />
                                                    </div>
                                                )}
                                                {type.id === ComponentType.Checkbox && (
                                                    <div
                                                        className={cx(
                                                            "w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg flex items-center justify-center",
                                                            selectedType === type.id ? "bg-white/30" : "bg-white/20",
                                                        )}
                                                    >
                                                        <svg className="w-6 h-6 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={type.icon} />
                                                        </svg>
                                                    </div>
                                                )}
                                                {type.id === ComponentType.Card && (
                                                    <div
                                                        className={cx(
                                                            "w-12 h-14 sm:w-13 sm:h-15 md:w-14 md:h-16 rounded-lg flex flex-col justify-center gap-1.5 sm:gap-2 px-2 sm:px-3",
                                                            selectedType === type.id ? "bg-white/30" : "bg-white/20",
                                                        )}
                                                    >
                                                        <div className="w-full h-0.5 sm:h-1 bg-white/70 rounded-full" />
                                                        <div className="w-2/3 h-0.5 sm:h-1 bg-white/70 rounded-full" />
                                                    </div>
                                                )}
                                                {type.id === ComponentType.Loader && (
                                                    <div className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12">
                                                        <svg
                                                            className={cx("w-full h-full", selectedType === type.id ? "bg-white/30" : "bg-white/20")}
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={type.icon} />
                                                        </svg>
                                                    </div>
                                                )}
                                                {type.id === ComponentType.Input && (
                                                    <div
                                                        className={cx(
                                                            "w-12 h-8 sm:w-14 sm:h-9 md:w-16 md:h-10 rounded-lg border-2 flex items-center px-1.5 sm:px-2",
                                                            selectedType === type.id ? "bg-white/30" : "bg-white/20",
                                                        )}
                                                    >
                                                        <div className="flex gap-0.5">
                                                            <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white/50 rounded-full" />
                                                            <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white/50 rounded-full" />
                                                            <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white/50 rounded-full" />
                                                        </div>
                                                    </div>
                                                )}
                                                {type.id === ComponentType.Form && (
                                                    <div className="space-y-1 sm:space-y-1.5">
                                                        <div className="w-12 h-1.5 sm:w-14 sm:h-2 md:w-16 md:h-2 bg-white/30 rounded" />
                                                        <div className="w-12 h-1.5 sm:w-14 sm:h-2 md:w-16 md:h-2 bg-white/30 rounded" />
                                                        <div className="w-9 h-1.5 sm:w-11 sm:h-2 md:w-12 md:h-2 bg-white/30 rounded" />
                                                    </div>
                                                )}
                                                {type.id === ComponentType.Radio && (
                                                    <div className="flex gap-1.5 sm:gap-2">
                                                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white/60 flex items-center justify-center">
                                                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white" />
                                                        </div>
                                                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white/40" />
                                                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white/40" />
                                                    </div>
                                                )}
                                                {type.id === ComponentType.Tooltip && (
                                                    <div className="relative">
                                                        <div
                                                            className={cx(
                                                                "w-12 h-6 sm:w-14 sm:h-7 md:w-16 md:h-8 rounded-lg flex items-center justify-center",
                                                                selectedType === type.id ? "bg-white/30" : "bg-white/20",
                                                            )}
                                                        >
                                                            <div className="w-6 h-0.5 sm:w-7 sm:h-1 md:w-8 md:h-1 bg-white/70 rounded-full" />
                                                        </div>
                                                        <div className="absolute -top-1 sm:-top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 rotate-45 bg-white/30" />
                                                    </div>
                                                )}
                                            </div>

                                            <p className={cx("text-xs sm:text-sm font-medium text-center leading-tight", selectedType === type.id ? "text-white/80" : "text-white/40")}>{type.label}</p>
                                        </button>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-white/10">
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                                        <span className="text-white/60 font-medium text-xs sm:text-sm">Technology</span>
                                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                                            {technologies.map((tech, index) => (
                                                <button
                                                    key={tech.id}
                                                    onClick={() => onSelectComponentStyle(tech.id)}
                                                    className={cx(
                                                        "flex items-center justify-center gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 border-2 transition-all duration-200 text-xs sm:text-sm",
                                                        index === 0 ? "rounded-none sm:rounded-tl-lg sm:rounded-bl-lg" : "rounded-none sm:rounded-br-lg sm:rounded-tr-lg",
                                                        selectedStyle === tech.id
                                                            ? "border-indigo-500 bg-indigo-500/10 text-white"
                                                            : "border-white/20 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10",
                                                    )}
                                                >
                                                    {tech.icon}
                                                    <span className="font-medium">{tech.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <PrimaryButton
                                        onClick={handleContinue}
                                        className="w-full sm:w-auto sm:self-end px-6 sm:px-7 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 text-xs sm:text-sm"
                                    >
                                        Continue
                                    </PrimaryButton>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export { CreatePopup };
