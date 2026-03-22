/** @format */

import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 6 + 4,
    delay: Math.random() * 4,
}));

const GLITCH_CHARS = "!@#$%^&*[]{}|<>?/\\~`";

function useGlitchText(original: string, active: boolean) {
    const [text, setText] = React.useState(original);

    React.useEffect(() => {
        if (!active) {
            setText(original);
            return;
        }
        let iterations = 0;
        const interval = setInterval(() => {
            setText(
                original
                    .split("")
                    .map((char, i) => {
                        if (i < iterations) return original[i];
                        if (char === " ") return " ";
                        return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
                    })
                    .join(""),
            );
            if (iterations >= original.length) clearInterval(interval);
            iterations += 0.4;
        }, 40);
        return () => clearInterval(interval);
    }, [active, original]);

    return text;
}

const NotFoundPage: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const [glitchActive, setGlitchActive] = React.useState(false);
    const [hoverBtn, setHoverBtn] = React.useState<string | null>(null);
    const glitchText = useGlitchText("PAGE NOT FOUND", glitchActive);

    React.useEffect(() => {
        const trigger = () => {
            setGlitchActive(true);
            setTimeout(() => setGlitchActive(false), 1200);
        };
        trigger();
        const interval = setInterval(trigger, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative min-h-screen bg-[#080808] overflow-hidden flex flex-col items-center justify-center px-4">
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(168,85,247,0.6) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(168,85,247,0.6) 1px, transparent 1px)
                    `,
                    backgroundSize: "60px 60px",
                }}
            />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                    className="w-[600px] h-[600px] rounded-full opacity-10"
                    style={{
                        background: "radial-gradient(circle, #a855f7 0%, transparent 70%)",
                        filter: "blur(60px)",
                    }}
                />
            </div>
            {PARTICLES.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full bg-purple-400 opacity-20 pointer-events-none"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.1, 0.4, 0.1],
                    }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}

            <div className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full">
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="relative mb-4 select-none">
                    <span
                        className="absolute inset-0 text-[10rem] sm:text-[14rem] font-black leading-none text-purple-600 opacity-30"
                        style={{ transform: "translate(4px, -3px)", filter: "blur(1px)" }}
                        aria-hidden
                    >
                        404
                    </span>
                    <span
                        className="absolute inset-0 text-[10rem] sm:text-[14rem] font-black leading-none text-pink-500 opacity-20"
                        style={{ transform: "translate(-4px, 3px)", filter: "blur(1px)" }}
                        aria-hidden
                    >
                        404
                    </span>
                    <motion.span
                        className="relative text-[10rem] sm:text-[14rem] font-black leading-none text-white"
                        style={{
                            WebkitTextStroke: "1px rgba(168,85,247,0.4)",
                        }}
                        animate={glitchActive ? { x: [0, -3, 3, -2, 0] } : { x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        404
                    </motion.span>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-3">
                    <span className="font-mono text-xs sm:text-sm tracking-[0.3em] text-purple-400 uppercase" style={{ fontVariantNumeric: "tabular-nums" }}>
                        {glitchText}
                    </span>
                </motion.div>

                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="w-24 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mb-6"
                />

                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-white/40 text-sm sm:text-base leading-relaxed mb-10 max-w-md">
                    Looks like this component got lost in the void.
                    <br />
                    The page you're looking for doesn't exist.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs sm:max-w-none sm:w-auto"
                >
                    <button
                        onClick={() => navigate("/")}
                        onMouseEnter={() => setHoverBtn("home")}
                        onMouseLeave={() => setHoverBtn(null)}
                        className="relative w-full sm:w-auto px-7 py-2.5 rounded-lg text-sm font-semibold text-white overflow-hidden transition-all"
                        style={{
                            background: hoverBtn === "home" ? "linear-gradient(135deg, #9333ea, #7c3aed)" : "linear-gradient(135deg, #a855f7, #8b5cf6)",
                            boxShadow: hoverBtn === "home" ? "0 0 24px rgba(168,85,247,0.5)" : "0 0 12px rgba(168,85,247,0.2)",
                        }}
                    >
                        Go Home
                    </button>

                    <button
                        onClick={() => navigate(-1)}
                        onMouseEnter={() => setHoverBtn("back")}
                        onMouseLeave={() => setHoverBtn(null)}
                        className="w-full sm:w-auto px-7 py-2.5 rounded-lg text-sm font-semibold transition-all"
                        style={{
                            background: "transparent",
                            border: `1px solid ${hoverBtn === "back" ? "rgba(168,85,247,0.6)" : "rgba(255,255,255,0.1)"}`,
                            color: hoverBtn === "back" ? "rgba(168,85,247,1)" : "rgba(255,255,255,0.5)",
                        }}
                    >
                        Go Back
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export { NotFoundPage };
