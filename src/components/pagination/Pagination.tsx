/** @format */

import { cx } from "@/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FunctionComponent<PaginationProps> = (props) => {
    const { currentPage, totalPages, onPageChange } = props;
    const getPages = (): (number | "...")[] => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages: (number | "...")[] = [1];

        if (currentPage > 3) pages.push("...");

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) pages.push(i);

        if (currentPage < totalPages - 2) pages.push("...");

        pages.push(totalPages);

        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2.5">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || totalPages === 0}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-white/90 hover:text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft className="w-4 h-4" />
                Prev
            </button>
            {getPages().map((page, index) =>
                page === "..." ? (
                    <span key={`ellipsis-${index}`} className="px-2 py-2 text-white/50 text-sm select-none">
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={cx(
                            "min-w-[36px] h-9 rounded-lg text-sm font-medium transition-colors",
                            currentPage === page ? "bg-white text-black font-semibold" : "text-white/90 hover:text-white hover:bg-white/20 bg-white/10",
                        )}
                    >
                        {page}
                    </button>
                ),
            )}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-white/90 hover:text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                Next
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};

/** @format */

const PaginationShimmer: React.FunctionComponent = () => {
    return (
        <div className="flex items-center justify-center gap-2.5">
            <div className="w-16 h-9 rounded-lg bg-white/10 animate-pulse" />
            {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="min-w-[36px] h-9 rounded-lg bg-white/10 animate-pulse" style={{ animationDelay: `${i * 60}ms` }} />
            ))}
            <div className="w-16 h-9 rounded-lg bg-white/10 animate-pulse" />
        </div>
    );
};

export { Pagination, PaginationShimmer };
