/** @format */

import { motion } from "framer-motion";

interface FloatingItemProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}
const FloatingItem: React.FunctionComponent<FloatingItemProps> = (props) => {
    const { children, className, delay = 0 } = props;
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, -16, 0] }}
            transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay,
            }}
        >
            {children}
        </motion.div>
    );
};

export { FloatingItem };
