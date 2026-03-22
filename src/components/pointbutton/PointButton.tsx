/** @format */

import { useAuthStore } from "@/store/authStore";
import { AnimatePresence, motion } from "framer-motion";
import { Hexagon } from "lucide-react";

export interface ITooltipMenuProps {
    show: boolean;
    setShow: (isShow: boolean) => void;
}

const PointsButton: React.FunctionComponent<ITooltipMenuProps> = (props) => {
    const { show, setShow } = props;
    const { user } = useAuthStore();
    return (
        <div className="relative hidden lg:block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
            <button className="flex items-center gap-2 min-h-10 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                <Hexagon className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-white/90">{user ? user.points : 0}</span>
            </button>

            <AnimatePresence>
                {show && (
                    <>
                        <div className="absolute top-full right-0 w-full h-2" />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full right-0 mt-2 w-[320px] bg-[#1a1a1a] rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50 p-5"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <Hexagon className="w-5 h-5 text-purple-400" />
                                <h3 className="text-base font-semibold text-white">Creator Points</h3>
                            </div>
                            <p className="text-sm text-white/70 mb-4 leading-relaxed">Join the ranks of top contributors by accumulating points for your published posts and popular content.</p>
                            <div className="space-y-3">
                                <p className="text-sm font-medium text-white/80 mb-2">You'll get:</p>

                                <div className="flex items-start gap-3">
                                    <div className="flex items-center gap-2 min-w-[60px]">
                                        <Hexagon className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                        <span className="text-sm font-bold text-white">50</span>
                                    </div>
                                    <p className="text-sm text-white/70">When your post gets published</p>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="flex items-center gap-2 min-w-[60px]">
                                        <Hexagon className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                        <span className="text-sm font-bold text-white">15</span>
                                    </div>
                                    <p className="text-sm text-white/70">When a comment is added to your post</p>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="flex items-center gap-2 min-w-[60px]">
                                        <Hexagon className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                        <span className="text-sm font-bold text-white">10</span>
                                    </div>
                                    <p className="text-sm text-white/70">For every person that adds your post to their favorites</p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export { PointsButton };
