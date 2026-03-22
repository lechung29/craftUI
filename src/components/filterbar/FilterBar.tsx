/** @format */

import { ComponentStyle, IPaginationInfo } from "@/types";
import React from "react";
import { FaBorderAll, FaCss3 } from "react-icons/fa";
import { SiTailwindcss } from "react-icons/si";
import { Pagination, PaginationShimmer } from "../pagination";
import { Search } from "lucide-react";
import { cx } from "@/utils";

interface FilterBarProps {
    selectedFramework: ComponentStyle | undefined;
    onSelectFramework: (framework: ComponentStyle | undefined) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    currentPage: number;
    pagination: IPaginationInfo | null;
    handlePageChange: (page: number) => void | Promise<void>;
}

const FilterBar: React.FC<FilterBarProps> = (props) => {
    const { selectedFramework, searchQuery, currentPage, pagination, onSelectFramework, onSearchChange, handlePageChange } = props;
    const [searchText, setSearchText] = React.useState<string>(searchQuery);

    const frameworks = [
        { label: "All", value: undefined, icon: <FaBorderAll fontSize={24} color={"#3b82f6"} /> },
        { label: "CSS", value: ComponentStyle.CSS, icon: <FaCss3 fontSize={24} color={"#3b82f6"} /> },
        { label: "Tailwind", value: ComponentStyle.Tailwind, icon: <SiTailwindcss fontSize={24} color={"#38bdf8"} /> },
    ];

    return (
        <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
            <div className="hidden lg:flex items-center justify-around gap-2">
                <div className="flex items-center gap-1 px-1">
                    {frameworks.map((framework) => (
                        <button
                            key={framework.label}
                            onClick={() => onSelectFramework(framework.value)}
                            className={cx(
                                "flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all",
                                selectedFramework === framework.value ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/10",
                            )}
                        >
                            {framework.icon && <span>{framework.icon}</span>}
                            <span>{framework.label}</span>
                        </button>
                    ))}
                </div>
                <div className="h-7 w-0.5 bg-white/15" />
                {pagination ? <Pagination currentPage={currentPage} totalPages={pagination.totalPages} onPageChange={handlePageChange} /> : <PaginationShimmer />}
                <div className="h-7 w-0.5 bg-white/25" />
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search tags, users, posts..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") onSearchChange(searchText);
                        }}
                        className="w-auto pl-3 sm:pl-4 pr-8 sm:pr-10 py-1.5 sm:py-2 bg-white/5 border border-white/10 rounded-lg text-xs sm:text-sm text-white placeholder:text-white/40 outline-none focus:border-purple-500/50 transition-all"
                    />
                    <Search className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/40" />
                </div>
            </div>
            <div className="lg:hidden space-y-2 sm:space-y-3">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search tags, users..."
                        value={searchText}
                        onChange={(e) => {
                            e.preventDefault();
                            setSearchText(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") onSearchChange(searchText);
                        }}
                        className="w-full pl-3 sm:pl-4 pr-8 sm:pr-10 py-2 sm:py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs sm:text-sm text-white placeholder:text-white/40 outline-none focus:border-purple-500/50 transition-all"
                    />
                    <Search className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/40 cursor-pointer" />
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 bg-white/5 rounded-lg p-0.5 sm:p-1">
                    {frameworks.map((framework) => (
                        <button
                            key={framework.label}
                            onClick={() => onSelectFramework(framework.value)}
                            className={cx(
                                "flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all",
                                selectedFramework === framework.label ? "bg-white/10 text-white" : "text-white/60 hover:text-white",
                            )}
                        >
                            {framework.icon && <span className="text-sm sm:text-base">{framework.icon}</span>}
                            <span>{framework.label}</span>
                        </button>
                    ))}
                </div>
                <div className="flex justify-end">
                    {pagination ? <Pagination currentPage={currentPage} totalPages={pagination.totalPages} onPageChange={handlePageChange} /> : <PaginationShimmer />}
                </div>
            </div>
        </div>
    );
};

export { FilterBar };
