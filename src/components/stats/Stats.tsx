/** @format */

import React from "react";
import { motion } from "framer-motion";
import { Grid3x3, Gift, Users } from "lucide-react";
import { IStatsInfo, IResponseStatus } from "@/types";
import { ComponentService } from "@/services/components";
import { isSessionExpired } from "@/utils";

export interface StatCardProps {
    stat: {
        icon: React.ElementType;
        value: string;
        label: string;
    };
    id: number;
}

const StatCardShimmer: React.FunctionComponent<{ id: number }> = ({ id }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: id * 0.1 }} className="flex flex-col items-center gap-4 sm:gap-5">
        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-white/10 animate-pulse" style={{ animationDelay: `${id * 150}ms` }} />
        <div className="flex flex-col items-center gap-2.5">
            <div className="h-8 sm:h-12 md:h-14 w-28 sm:w-36 md:w-44 rounded-xl bg-white/10 animate-pulse" style={{ animationDelay: `${id * 150 + 100}ms` }} />
            <div className="h-2.5 sm:h-3 w-40 sm:w-48 rounded-full bg-white/10 animate-pulse" style={{ animationDelay: `${id * 150 + 200}ms` }} />
            <div className="h-2.5 sm:h-3 w-24 sm:w-32 rounded-full bg-white/[0.06] animate-pulse" style={{ animationDelay: `${id * 150 + 300}ms` }} />
        </div>
    </motion.div>
);

const StatCard: React.FC<StatCardProps> = ({ stat, id: index }) => {
    const Icon = stat.icon;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} className="text-center space-y-3 sm:space-y-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }} className="inline-block">
                <Icon className="w-8 h-8 sm:w-12 sm:h-12 text-white/80 mx-auto" strokeWidth={1.5} />
            </motion.div>
            <div>
                <motion.h3
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-1 sm:mb-2"
                >
                    {stat.value}
                </motion.h3>
                <p className="text-xs sm:text-base text-white/60 max-w-xs mx-auto">{stat.label}</p>
            </div>
        </motion.div>
    );
};

const StatsSection: React.FunctionComponent = () => {
    const [statsInfo, setStatsInfo] = React.useState<IStatsInfo>({
        elementsCount: 0,
        contributorsCount: 0,
    });
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        loadStatsInfo();
    }, []);

    const loadStatsInfo = async () => {
        try {
            setIsLoading(true);
            const response = await ComponentService.getStatsInfo();
            if (response.status === IResponseStatus.Success) {
                setStatsInfo(response.data!);
            }
        } catch (error: any) {
            console.error("Failed to load components:", error);
            if (isSessionExpired(error)) return;
        } finally {
            setIsLoading(false);
        }
    };

    const stats = React.useMemo(() => {
        return [
            {
                icon: Grid3x3,
                value: statsInfo.elementsCount.toString(),
                label: "Community-made UI elements",
            },
            {
                icon: Gift,
                value: "100%",
                label: "Free for personal and commercial use",
            },
            {
                icon: Users,
                value: statsInfo.contributorsCount.toString(),
                label: "Contributors to the community",
            },
        ];
    }, [statsInfo]);

    return (
        <section className="py-12 sm:py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
                    {isLoading ? Array.from({ length: 3 }).map((_, i) => <StatCardShimmer key={i} id={i} />) : stats.map((stat, index) => <StatCard key={`loaded-${index}`} stat={stat} id={index} />)}
                </div>
            </div>
        </section>
    );
};

export { StatsSection };
