/** @format */

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ComponentService } from "@/services";
import { IResponseStatus } from "@/types";
import { useSidebarStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { cx, isSessionExpired } from "@/utils";

export type RowDirection = "left" | "right";
type TagRowProps = {
    items: string[];
    highLightItems: string[];
    direction: RowDirection;
    speed: number;
    onClickTag: (tagName: string) => void;
};

const TagsShimmer: React.FunctionComponent = () => (
    <div className="flex flex-col gap-3 sm:gap-5">
        {[80, 60, 70].map((opacity, i) => (
            <div key={i} className="flex gap-2 sm:gap-3 overflow-hidden py-1">
                {Array.from({ length: 10 }).map((_, j) => (
                    <div key={j} className="h-8 sm:h-10 rounded-full bg-white/5 animate-pulse flex-shrink-0" style={{ width: `${60 + Math.random() * 60}px`, opacity: opacity / 100 }} />
                ))}
            </div>
        ))}
    </div>
);

const TagRow: React.FunctionComponent<TagRowProps> = (props) => {
    const { items, highLightItems, direction, speed, onClickTag } = props;
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const [duplicated, setDuplicated] = useState<string[]>(items);

    useEffect(() => {
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

    const animationClass = shouldAnimate ? (direction === "left" ? "tag-marquee-left" : "tag-marquee-right") : "";

    return (
        <div ref={containerRef} className="tag-row-container flex overflow-hidden py-1" style={{ "--duration": `${speed}s` } as React.CSSProperties}>
            <div ref={contentRef} className={`flex gap-2 sm:gap-3 flex-nowrap ${animationClass} ${!shouldAnimate ? "flex-wrap justify-center w-full" : ""}`}>
                {duplicated.map((tag, index) => (
                    <button
                        key={`${tag}-${index}`}
                        onClick={() => onClickTag(tag)}
                        className={cx(
                            "px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-300",
                            highLightItems.includes(tag)
                                ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                                : "bg-[#111] text-white/50 border border-white/5 hover:border-white/20 hover:text-white",
                        )}
                    >
                        #{tag}
                    </button>
                ))}
            </div>
        </div>
    );
};

const TagsSection: React.FunctionComponent = () => {
    const [tags, setTags] = useState<string[]>([]);
    const [highlightTags, setHighlightTags] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { setSearchKey, setSelectedStyle, setSelectedType } = useSidebarStore();
    const navigate = useNavigate();

    const onHandleSelectTag = (tagName: string) => {
        if (tagName) {
            setSearchKey(tagName);
            setSelectedStyle(undefined);
            setSelectedType(undefined);
            navigate("/elements");
        }
    };

    useEffect(() => {
        loadTags();
    }, []);

    const loadTags = async () => {
        try {
            setIsLoading(true);
            const response = await ComponentService.getAllTags();
            if (response.status === IResponseStatus.Success) {
                setTags(response.data?.tags ?? []);
                setHighlightTags(response.data?.highlightTags ?? []);
            }
        } catch (error: any) {
            console.error("Failed to load tags:", error);
            if (isSessionExpired(error)) return;
        } finally {
            setIsLoading(false);
        }
    };

    const buildRows = (tags: string[]): string[][] => {
        if (tags.length === 0) return [];
        if (tags.length <= 10) return [tags];
        if (tags.length <= 20) return [tags.slice(0, Math.ceil(tags.length / 2)), tags.slice(Math.ceil(tags.length / 2))];
        const third = Math.ceil(tags.length / 3);
        return [tags.slice(0, third), tags.slice(third, third * 2), tags.slice(third * 2)];
    };

    const rows = buildRows(tags);
    const directions: RowDirection[] = ["left", "right", "left"];

    return (
        <section className="py-12 sm:py-20 bg-black overflow-hidden relative">
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                        @keyframes tagScrollLeft {
                            from { transform: translateX(0); }
                            to { transform: translateX(-50%); }
                        }
                        @keyframes tagScrollRight {
                            from { transform: translateX(-50%); }
                            to { transform: translateX(0); }
                        }
                        .tag-marquee-left { animation: tagScrollLeft var(--duration, 40s) linear infinite; }
                        .tag-marquee-right { animation: tagScrollRight var(--duration, 40s) linear infinite; }
                        .tag-row-container:hover .tag-marquee-left,
                        .tag-row-container:hover .tag-marquee-right { animation-play-state: paused; }
                    `,
                }}
            />

            <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 mb-8 sm:mb-12 text-center">
                <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                    Browse by Tags
                </motion.h2>
            </div>

            {isLoading ? (
                <TagsShimmer />
            ) : tags.length === 0 ? null : (
                <div className="flex flex-col gap-3 sm:gap-5">
                    {rows.map((row, i) => (
                        <TagRow key={i} items={row} highLightItems={highlightTags} direction={directions[i]} speed={100} onClickTag={onHandleSelectTag} />
                    ))}
                </div>
            )}
        </section>
    );
};

export { TagsSection };
