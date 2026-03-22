/** @format */

import React from "react";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown, Hexagon, Shapes } from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ComponentService, UserService } from "@/services";
import { ComponentStatus, ComponentType, IComponent, IPaginationInfo, IResponseStatus, IUserInformation } from "@/types";
import { Pagination, PaginationShimmer, CreatePopup, ComponentCard, ComponentCardLoading } from "@/components";
import { cx, isSessionExpired, showError, showSuccess } from "@/utils";
import { ProfileTabType, SORT_OPTIONS, SortType, TYPE_OPTIONS } from "./ProfilePage";
import { DropdownItem, DropdownMenu, EmptyList, StatItem, TabButton } from "./components";
import { useAuthStore } from "@/store";

const UserProfilePage: React.FunctionComponent = () => {
    const { id } = useParams();
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = React.useState<ProfileTabType>("posts");
    const [sort, setSort] = React.useState<SortType>("default");
    const [selectedType, setSelectedType] = React.useState<ComponentType | undefined>(undefined);
    const [components, setComponents] = React.useState<IComponent[]>([]);
    const [pagination, setPagination] = React.useState<IPaginationInfo | null>(null);
    const [userInfo, setUserInfo] = React.useState<IUserInformation | null>(null);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [isLoading, setIsLoading] = React.useState(true);
    const [_isLoadingUserInfo, setIsLoadingUserInfo] = React.useState(true);
    const [_isLoadingCount, setIsLoadingCount] = React.useState(true);
    const [componentCount, setComponentCount] = React.useState(0);
    const [showCreatePopup, setShowCreatePopup] = React.useState(false);
    const [showSortDropdown, setShowSortDropdown] = React.useState(false);
    const [showTypeDropdown, setShowTypeDropdown] = React.useState(false);
    const [openUpward, setOpenUpward] = React.useState(false);
    const [trigger, setTrigger] = React.useState(false);
    const filterContainerRef = React.useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (id) {
            getUserInfo(id);
        }
    }, [id]);

    React.useEffect(() => {
        if (trigger) {
            setCurrentPage(1);
            loadComponents(1);
        }
    }, [activeTab, sort, selectedType, trigger]);

    React.useEffect(() => {
        if (trigger) {
            loadUserComponentCount();
        }
    }, [trigger]);

    const loadComponents = async (page: number) => {
        try {
            setIsLoading(true);
            const status = activeTab === "posts" ? ComponentStatus.Published : ComponentStatus.Draft;
            const response = await ComponentService.getUserComponentList(userInfo?._id, status, selectedType, sort, page, 9);
            if (response.status === IResponseStatus.Success) {
                setComponents(response.data?.components || []);
                setPagination(response.data?.pagination || null);
            }
        } catch (error: any) {
            if (isSessionExpired(error)) return;
            showError(error?.message || "Failed to load components");
        } finally {
            setIsLoading(false);
        }
    };

    const getUserInfo = async (id: string) => {
        try {
            setIsLoadingUserInfo(true);
            const res = await UserService.getUserById(id);
            if (res.status === IResponseStatus.Success) {
                setUserInfo(res.data!);
                showSuccess(res.message!);
            }
        } catch (error: any) {
            if (isSessionExpired(error)) return;
            showError(error.message);
        } finally {
            setIsLoadingUserInfo(false);
            setTrigger(true);
        }
    };

    const loadUserComponentCount = async () => {
        try {
            setIsLoadingCount(true);
            const res = await ComponentService.getUserComponentCount(userInfo?._id);
            if (res.status === IResponseStatus.Success) {
                setComponentCount(res.data?.count!);
            }
        } catch (error: any) {
            if (isSessionExpired(error)) return;
            showError(error?.message || "Failed to load component counts");
        } finally {
            setIsLoadingCount(true);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        loadComponents(page);
    };

    const currentSort = SORT_OPTIONS.find((o) => o.value === sort) ?? SORT_OPTIONS[0];
    const currentType = TYPE_OPTIONS.find((o) => o.value === selectedType) ?? TYPE_OPTIONS[0];

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterContainerRef.current && !filterContainerRef.current.contains(event.target as Node)) {
                setShowSortDropdown(false);
                setShowTypeDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = (e: React.MouseEvent, type: "sort" | "type") => {
        const rect = e.currentTarget.getBoundingClientRect();
        setOpenUpward(window.innerHeight - rect.bottom < 280);
        if (type === "sort") {
            setShowSortDropdown((prev) => !prev);
            setShowTypeDropdown(false);
        } else {
            setShowTypeDropdown((prev) => !prev);
            setShowSortDropdown(false);
        }
    };

    if (id === user?._id) {
        return <Navigate to="/my-profile" replace />
    }

    return (
        <React.Fragment>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4 sm:mb-6 group">
                <ArrowLeft className="w-4 sm:w-5 sm:h-5 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs sm:text-sm font-medium">Go back</span>
            </button>

            <div className="mb-6 sm:mb-8">
                <div
                    className="relative h-28 sm:h-40 lg:h-52 rounded-xl sm:rounded-2xl overflow-hidden bg-white/5 border border-white/10"
                    style={{
                        backgroundImage: userInfo?.thumbnail ? `url(${userInfo?.thumbnail})` : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />

                <div className="px-0 mt-0">
                    <div className="flex flex-col sm:flex-row gap-6 items-start justify-between">
                        <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                            <div className="flex flex-row items-end gap-3 sm:gap-5 w-full sm:w-auto">
                                <div className="relative -mt-14 sm:-mt-20 ml-3 sm:ml-4 lg:ml-6 flex-shrink-0 z-20">
                                    <img
                                        src={userInfo?.avatar}
                                        alt={userInfo?.username}
                                        className="w-28 sm:w-40 lg:w-44 h-28 sm:h-40 lg:h-44 rounded-2xl sm:rounded-3xl border-[5px] sm:border-[6px] border-white/10 bg-[#1a1a1a] shadow-2xl object-cover"
                                    />
                                </div>
                                <div className="flex flex-col items-start justify-end pb-1 sm:pb-2">
                                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-0.5 sm:mb-1">{userInfo?.username}</h1>
                                    <p className="text-white/40 text-xs sm:text-sm font-normal">@{userInfo?.username}</p>
                                </div>
                            </div>
                            <div className="pl-3 sm:pl-8 w-full mt-2">
                                <p className="text-white/70 text-xs sm:text-sm max-w-2xl leading-relaxed font-normal text-left">
                                    {userInfo?.biography || "No bio given. Click settings to update your profile description."}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col items-start sm:items-end gap-4 w-full sm:w-auto pt-2 sm:pt-8 px-3 sm:px-0">
                            <div className="flex items-center justify-around sm:justify-start gap-4 sm:gap-6 py-2.5 sm:py-2 px-3 sm:px-4 bg-white/5 rounded-xl sm:rounded-2xl border border-white/5 w-full sm:w-auto">
                                <StatItem value={componentCount} label="posts" />
                                <StatItem value={userInfo?.points || 0} label="points" icon={<Hexagon className="w-3 sm:w-3.5 sm:h-3.5 h-3 text-purple-400" />} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-6 sm:mb-8">
                <div className="flex flex-row items-center justify-between border-b border-white/5 px-1 sm:px-2 gap-4">
                    <div className="flex gap-0 sm:gap-1 overflow-x-auto overflow-y-hidden -mb-[1px] flex-1 min-w-0 custom-scrollbar">
                        {(["posts"] as ProfileTabType[]).map((tab) => (
                            <TabButton key={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)}>
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </TabButton>
                        ))}
                    </div>

                    <div ref={filterContainerRef} className="flex items-center gap-1 flex-shrink-0">
                        <div className="relative">
                            <button
                                onClick={(e) => toggleDropdown(e, "type")}
                                className={cx(
                                    "flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-[13px] transition-colors font-medium whitespace-nowrap",
                                    selectedType !== undefined ? "text-purple-400" : "text-white/60 hover:text-white",
                                )}
                            >
                                <Shapes className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">{currentType.label}</span>
                                <ChevronDown className={cx("w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform", showTypeDropdown ? "rotate-180" : "")} />
                            </button>
                            <AnimatePresence>
                                {showTypeDropdown && (
                                    <DropdownMenu upward={openUpward}>
                                        {TYPE_OPTIONS.map((option) => (
                                            <DropdownItem
                                                key={String(option.value)}
                                                label={option.label}
                                                active={selectedType === option.value}
                                                onClick={() => {
                                                    setSelectedType(option.value);
                                                    setShowTypeDropdown(false);
                                                }}
                                            />
                                        ))}
                                    </DropdownMenu>
                                )}
                            </AnimatePresence>
                        </div>

                        {activeTab === "posts" && (
                            <React.Fragment>
                                <div className="h-4 w-px bg-white/10 mx-1" />
                                <div className="relative">
                                    <button
                                        onClick={(e) => toggleDropdown(e, "sort")}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-[13px] text-white/60 hover:text-white transition-colors font-medium whitespace-nowrap"
                                    >
                                        {currentSort.icon}
                                        <span className="hidden sm:inline">{currentSort.label}</span>
                                        <ChevronDown className={cx("w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform", showTypeDropdown ? "rotate-180" : "")} />
                                    </button>
                                    <AnimatePresence>
                                        {showSortDropdown && (
                                            <DropdownMenu upward={openUpward}>
                                                {SORT_OPTIONS.map((option) => (
                                                    <DropdownItem
                                                        key={option.value}
                                                        icon={option.icon}
                                                        label={option.label}
                                                        active={sort === option.value}
                                                        onClick={() => {
                                                            setSort(option.value);
                                                            setShowSortDropdown(false);
                                                        }}
                                                    />
                                                ))}
                                            </DropdownMenu>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </React.Fragment>
                        )}
                        <div className="h-4 w-px bg-white/10 mx-1" />
                        {pagination ? <Pagination currentPage={currentPage} totalPages={pagination.totalPages} onPageChange={handlePageChange} /> : <PaginationShimmer />}
                    </div>
                </div>
            </div>
            <div className="min-h-[300px] px-1 sm:px-2">
                {isLoading ? (
                    <ComponentCardLoading />
                ) : components.length === 0 ? (
                    <EmptyList activeTab={activeTab} />
                ) : (
                    <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 sm:gap-6 min-[400px]:gap-3 mb-8 sm:mb-12">
                        {components.map((component, index) => (
                            <ComponentCard
                                isDraft={false}
                                isSaved={user?.savedIds?.includes(component._id)}
                                key={component._id}
                                component={component}
                                index={index}
                                onGetCode={() => navigate(`/view/${component._id}`)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {showCreatePopup && <CreatePopup isOpen={showCreatePopup} onClose={() => setShowCreatePopup(false)} />}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: transparent; }
                .custom-scrollbar { scrollbar-width: none; }
            `}</style>
        </React.Fragment>
    );
};

export { UserProfilePage };
