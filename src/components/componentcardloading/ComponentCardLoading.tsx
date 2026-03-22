/** @format */

import React from "react";
import { motion } from "framer-motion";
import { Code2 } from "lucide-react";

const ComponentCardLoading: React.FunctionComponent = () => {
    return (
        <div className="py-20">
            <div className="flex flex-col items-center justify-center gap-6">
                <motion.div
                    className="relative"
                    animate={{
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <motion.div className="absolute inset-0 -m-8" animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                        <div className="w-full h-full border-2 border-purple-500/20 border-t-purple-500 rounded-full" />
                    </motion.div>

                    <motion.div className="absolute inset-0 -m-12" animate={{ rotate: -360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                        <div className="w-full h-full border-2 border-blue-500/20 border-t-blue-500 rounded-full" />
                    </motion.div>

                    <motion.div
                        className="relative z-10 w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/50"
                        animate={{
                            boxShadow: ["0 0 20px rgba(168, 85, 247, 0.5)", "0 0 40px rgba(168, 85, 247, 0.8)", "0 0 20px rgba(168, 85, 247, 0.5)"],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <Code2 className="w-10 h-10 text-white" />
                    </motion.div>

                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute top-1/2 left-1/2 w-2 h-2 bg-purple-400 rounded-full"
                            style={{
                                x: -4,
                                y: -4,
                            }}
                            animate={{
                                x: [-4, Math.cos((i * Math.PI * 2) / 6) * 60 - 4, -4],
                                y: [-4, Math.sin((i * Math.PI * 2) / 6) * 60 - 4, -4],
                                opacity: [0, 1, 0],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.5,
                            }}
                        />
                    ))}
                </motion.div>
                <div className="flex flex-col items-center gap-3">
                    <div className="flex gap-2">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-2 h-2 bg-purple-500 rounded-full"
                                animate={{
                                    y: [0, -10, 0],
                                    opacity: [0.3, 1, 0.3],
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: i * 0.2,
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-full"
                        animate={{
                            x: ["-100%", "100%"],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export { ComponentCardLoading };
