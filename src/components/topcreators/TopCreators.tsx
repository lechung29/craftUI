/** @format */

import React from "react";
import { Hexagon } from "lucide-react";
import { ComponentService } from "@/services";
import { ICreatorInfo, IResponseStatus } from "@/types";
import { RowDirection } from "../tags";
import { cx, isSessionExpired } from "@/utils";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store";

type ICreatorCardProps = {
    creator: ICreatorInfo;
};

type ICreatorRowProps = {
    items: ICreatorInfo[];
    direction: RowDirection;
    speed: number;
};

const CreatorsShimmer: React.FunctionComponent = () => (
    <div className="flex flex-col gap-4 sm:gap-8">
        {[1, 2, 3].map((_, i) => (
            <div key={i} className="flex gap-3 sm:gap-6 overflow-hidden">
                {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="bg-white/5 animate-pulse rounded-lg sm:rounded-xl w-[240px] sm:w-[320px] h-[60px] sm:h-[72px] flex-shrink-0" />
                ))}
            </div>
        ))}
    </div>
);

const CreatorCard: React.FunctionComponent<ICreatorCardProps> = (props) => {
    const { creator } = props;
    const { user } = useAuthStore();
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate(user?._id === creator._id ? "/my-profile" : `/profile/${creator._id}`)} className="bg-[#111] border border-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 w-[240px] sm:w-[320px] transition-all duration-300 hover:bg-gray-900/60 hover:border-purple-500/50 flex-shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-4">
                <img src={creator.avatar} alt={creator.username} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 object-cover" />
                <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate text-xs sm:text-sm">{creator.username}</h3>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 bg-purple-600/10 rounded-lg border border-purple-500/20">
                    <Hexagon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-400 flex-shrink-0" />
                    <span className="text-xs font-medium text-white/90">{creator.points.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};

const CreatorRow: React.FunctionComponent<ICreatorRowProps> = (props) => {
    const { items, direction, speed } = props;
    const containerRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const [shouldAnimate, setShouldAnimate] = React.useState(false);
    const [duplicated, setDuplicated] = React.useState<ICreatorInfo[]>(items);

    React.useEffect(() => {
        const container = containerRef.current;
        const content = contentRef.current;
        if (!container || !content) return;

        const containerWidth = container.offsetWidth;
        const contentWidth = content.scrollWidth;

        if (contentWidth > containerWidth) {
            const minRepeat = Math.ceil((containerWidth * 2) / contentWidth) + 1;
            const base = Array.from({ length: minRepeat }, () => items).flat();
            setDuplicated([...base, ...base]);
            setShouldAnimate(true);
        } else {
            setDuplicated(items);
            setShouldAnimate(false);
        }
    }, [items]);

    return (
        <>
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes creatorScrollLeft {
                        from { transform: translateX(0); }
                        to { transform: translateX(-50%); }
                    }
                    @keyframes creatorScrollRight {
                        from { transform: translateX(-50%); }
                        to { transform: translateX(0); }
                    }
                    .creator-marquee-left { animation: creatorScrollLeft var(--creator-duration, 100s) linear infinite; }
                    .creator-marquee-right { animation: creatorScrollRight var(--creator-duration, 100s) linear infinite; }
                    .creator-row-container:hover .creator-marquee-left,
                    .creator-row-container:hover .creator-marquee-right { animation-play-state: paused; }
                `,
                }}
            />
            <div ref={containerRef} className="creator-row-container flex overflow-hidden" style={{ "--creator-duration": `${speed}s` } as React.CSSProperties}>
                <div
                    ref={contentRef}
                    className={cx("flex gap-3 sm:gap-6 flex-nowrap", shouldAnimate ? (direction === "left" ? "creator-marquee-left" : "creator-marquee-right") : "flex-wrap justify-center w-full")}
                >
                    {duplicated.map((creator, index) => (
                        <CreatorCard key={`${creator._id}-${index}`} creator={creator} />
                    ))}
                </div>
            </div>
        </>
    );
};

const TopCreators: React.FunctionComponent = () => {
    const [creators, setCreators] = React.useState<ICreatorInfo[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        loadTopCreators();
    }, []);

    const loadTopCreators = async () => {
        try {
            setIsLoading(true);
            const response = await ComponentService.getTopCreators();
            if (response.status === IResponseStatus.Success) {
                setCreators(response.data ?? []);
            }
        } catch (error: any) {
            console.error("Failed to load top creators:", error);
            if (isSessionExpired(error)) return;
        } finally {
            setIsLoading(false);
        }
    };

    const buildRows = (creators: ICreatorInfo[]): ICreatorInfo[][] => {
        if (creators.length === 0) return [];
        if (creators.length <= 8) return [creators];
        if (creators.length <= 16) {
            const half = Math.ceil(creators.length / 2);
            return [creators.slice(0, half), creators.slice(half)];
        }
        const third = Math.ceil(creators.length / 3);
        return [creators.slice(0, third), creators.slice(third, third * 2), creators.slice(third * 2)];
    };

    const rows = buildRows(creators);
    const directions: ("left" | "right")[] = ["left", "right", "left"];

    return (
        <section className="py-12 sm:py-20 bg-black overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 mb-10 sm:mb-16 text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4">Top Creators</h2>
                <p className="text-xs sm:text-base text-white/60">Meet the amazing developers shaping our community</p>
            </div>

            {isLoading ? (
                <CreatorsShimmer />
            ) : creators.length === 0 ? null : (
                <div className="flex flex-col gap-4 sm:gap-8">
                    {rows.map((row, i) => (
                        <CreatorRow key={i} items={row} direction={directions[i]} speed={100} />
                    ))}
                </div>
            )}
        </section>
    );
};

export { TopCreators };
