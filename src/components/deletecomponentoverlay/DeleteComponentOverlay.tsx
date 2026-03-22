/** @format */

import React from "react";
import { motion } from "framer-motion";
import { Loader2, Trash2 } from "lucide-react";

export interface IDeleteComponentOverlayProps {
    isShow: boolean;
    onCancelOverlay: (e: React.MouseEvent) => void;
    onDelete: () => Promise<void>;
}

const DeleteComponentOverlay: React.FunctionComponent<IDeleteComponentOverlayProps> = (props) => {
    const { isShow, onDelete, onCancelOverlay } = props;
    const [isDeleting, setIsDeleting] = React.useState<boolean>(false);
    
    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        if (onDelete() instanceof Promise) {
            return onDelete().finally(() => setIsDeleting(false));
        } else {
            setIsDeleting(false);
            return Promise.resolve();
        }
    };
    if (!isShow) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-20 p-4"
            onClick={(e) => e.stopPropagation()}
        >
            <Trash2 className="w-6 h-6 text-red-400" />
            <p className="text-white text-xs sm:text-sm font-medium text-center">Delete this component?</p>
            <p className="text-white/40 text-[11px] text-center">This action cannot be undone.</p>
            <div className="flex gap-2 mt-1">
                <button onClick={onCancelOverlay} className="px-4 py-1.5 text-xs text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all">
                    Cancel
                </button>
                <button
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs text-white bg-red-600 hover:bg-red-500 rounded-lg transition-all disabled:opacity-50"
                >
                    {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                    Delete
                </button>
            </div>
        </motion.div>
    );
};

export { DeleteComponentOverlay };
