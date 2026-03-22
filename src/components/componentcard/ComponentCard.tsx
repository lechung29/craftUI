/** @format */

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Eye, Bookmark, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LivePreview } from "../livepreview";
import { IComponent } from "@/types";
import { useCodeEditorStore } from "@/store";
import { DeleteComponentOverlay } from "../deletecomponentoverlay";

export interface IComponentCardProps {
    component: IComponent;
    index?: number;
    isSaved?: boolean;
    isDraft?: boolean;
    onGetCode?: (component: IComponent) => void;
    onReloadList?: () => Promise<void>;
    onDelete?: (componentId: string) => Promise<void>;
}

const ComponentCard: React.FunctionComponent<IComponentCardProps> = (props) => {
    const { component, index = 0, isSaved = false, isDraft = false, onGetCode, onReloadList, onDelete } = props;
    const navigate = useNavigate();
    const { saveAsFavorite } = useCodeEditorStore();
    const isTailwind = component.style.toLowerCase() === "tailwind";
    const [showConfirm, setShowConfirm] = useState(false);

    const componentInfo: JSX.Element = useMemo(() => {
        return (
            <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-black/70 backdrop-blur-md rounded-md text-white/90 text-xs max-w-[45%]">
                    <img src={component.authorId?.avatar} alt={component.authorId?.username} className="w-3.5 h-3.5 rounded-full shrink-0 object-cover" />
                    <span className="font-medium truncate">{component.authorId?.username}</span>
                </div>
                <div className="flex gap-1.5">
                    <div className="flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-md rounded-md text-white/90 text-xs">
                        <Eye className="w-3 h-3" />
                        <span className="font-medium">{component.views}</span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-md rounded-md text-white/90 text-xs">
                        <Bookmark className="w-3 h-3" />
                        <span className="font-medium">{component.saves}</span>
                    </div>
                </div>
            </div>
        );
    }, [component]);

    const renderActionButtonList = () => {
        const initActionItems = [
            {
                className:
                    "flex items-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-500 backdrop-blur-md text-white text-xs font-semibold rounded-lg transition-all hover:scale-105 shadow-lg shadow-purple-500/30",
                title: "Get component code",
                children: (
                    <React.Fragment>
                        <Code className="w-3.5 h-3.5" />
                        <span className="inline">Get code</span>
                    </React.Fragment>
                ),
                onClick: handleGetCode,
            },
        ];
        if (!isDraft) {
            initActionItems.unshift({
                className: "flex items-center justify-center w-9 h-9 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-lg text-white transition-all hover:scale-110",
                title: "Save component",
                children: <Bookmark className="w-4 h-4" fill={isSaved ? "white" : undefined} />,
                onClick: handleSave,
            });
        }
        if (onDelete) {
            initActionItems.unshift({
                className:
                    "flex items-center justify-center w-9 h-9 bg-red-500/10 hover:bg-red-500/25 backdrop-blur-md border border-red-500/30 rounded-lg text-red-400 transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed",
                title: "Delete component",
                children: <Trash2 className="w-4 h-4" />,
                onClick: handleDeleteClick,
            });
        }

        return initActionItems;
    };

    const handleGetCode = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onGetCode) onGetCode(component);
        else navigate(`/component/${component._id}`);
    };

    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        return saveAsFavorite(component._id).then(() => {
            if (onReloadList) onReloadList?.();
        });
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowConfirm(true);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.05 }} className="group relative">
            <motion.div
                whileHover={{ y: -4 }}
                className="relative h-48 sm:h-64 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl sm:rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-colors"
            >
                <div className="absolute inset-0">
                    <LivePreview htmlCode={component.code.html} cssCode={component.code.css} isTailwindStyle={isTailwind} theme="dark" backgroundColor="#1f1f1f" autoScale />
                </div>

                {!isDraft && componentInfo}
                <div className="absolute bottom-0 right-0 p-3 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
                    {renderActionButtonList().map((action) => {
                        const { children, ...rest } = action;
                        return <button {...rest}>{children}</button>;
                    })}
                </div>
                <AnimatePresence>
                    {showConfirm && (
                        <DeleteComponentOverlay
                            isShow={showConfirm}
                            onCancelOverlay={(e) => {
                                e.stopPropagation();
                                setShowConfirm(false);
                            }}
                            onDelete={async () => {
                                if (!onDelete) return Promise.resolve();
                                return onDelete(component._id);
                            }}
                        />
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

export { ComponentCard };
