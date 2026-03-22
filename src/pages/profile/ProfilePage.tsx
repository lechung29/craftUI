/** @format */

import React from "react";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft, Settings, ChevronDown, Hexagon, Eye, LayoutGrid, Bookmark, Camera, Loader2, Shapes } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store";
import { cx, isSessionExpired, showError } from "@/utils";
import { uploadToCloudinary } from "@/configs";
import { ComponentService } from "@/services";
import { ComponentStatus, ComponentType, IComponent, IPaginationInfo, IResponseStatus } from "@/types";
import { ComponentCard, ComponentCardLoading, Pagination, PaginationShimmer, CreatePopup } from "@/components";
import { DropdownItem, DropdownMenu, StatItem, TabButton, EmptyList } from "./components";

export type ProfileTabType = "posts" | "drafts";
export type SortType = "default" | "most_viewed" | "most_saved";

export const SORT_OPTIONS: { label: string; value: SortType; icon: React.ReactNode }[] = [
    { label: "Default", value: "default", icon: <LayoutGrid size={14} /> },
    { label: "Most viewed", value: "most_viewed", icon: <Eye size={14} /> },
    { label: "Most saved", value: "most_saved", icon: <Bookmark size={14} /> },
];

export const TYPE_OPTIONS: { label: string; value: ComponentType | undefined }[] = [
    { label: "All", value: undefined },
    { label: "Button", value: ComponentType.Button },
    { label: "Switch", value: ComponentType.Switch },
    { label: "Checkbox", value: ComponentType.Checkbox },
    { label: "Card", value: ComponentType.Card },
    { label: "Loader", value: ComponentType.Loader },
    { label: "Input", value: ComponentType.Input },
    { label: "Form", value: ComponentType.Form },
    { label: "Radio", value: ComponentType.Radio },
    { label: "Tooltip", value: ComponentType.Tooltip },
];

const ProfilePage: React.FunctionComponent = () => {
    const { user, updateUser, updateLocalUser } = useAuthStore();
    const [activeTab, setActiveTab] = React.useState<ProfileTabType>("posts");
    const [sort, setSort] = React.useState<SortType>("default");
    const [selectedType, setSelectedType] = React.useState<ComponentType | undefined>(undefined);
    const [components, setComponents] = React.useState<IComponent[]>([]);
    const [pagination, setPagination] = React.useState<IPaginationInfo | null>(null);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [isLoading, setIsLoading] = React.useState(true);
    const [_isLoadingCount, setIsLoadingCount] = React.useState(true);
    const [componentCount, setComponentCount] = React.useState(0);
    const [isUploadingAvatar, setIsUploadingAvatar] = React.useState(false);
    const [isUploadingThumbnail, setIsUploadingThumbnail] = React.useState(false);
    const [showCreatePopup, setShowCreatePopup] = React.useState(false);
    const avatarInputRef = React.useRef<HTMLInputElement>(null);
    const thumbnailInputRef = React.useRef<HTMLInputElement>(null);
    const filterContainerRef = React.useRef<HTMLDivElement>(null);
    const finishLoadUserRef = React.useRef<boolean>(false);
    const [showSortDropdown, setShowSortDropdown] = React.useState(false);
    const [showTypeDropdown, setShowTypeDropdown] = React.useState(false);
    const [openUpward, setOpenUpward] = React.useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        setCurrentPage(1);
        loadComponents(1);
    }, [activeTab, sort, selectedType]);

    React.useEffect(() => {
        if (finishLoadUserRef.current === false) {
            loadUserComponentCount();
        }
    }, [finishLoadUserRef.current]);

    const loadComponents = async (page: number) => {
        try {
            setIsLoading(true);
            const status = activeTab === "posts" ? ComponentStatus.Published : ComponentStatus.Draft;
            const response = await ComponentService.getUserComponentList(user?._id, status, selectedType, sort, page, 9);
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

    const loadUserComponentCount = async () => {
        try {
            setIsLoadingCount(true);
            const res = await ComponentService.getUserComponentCount(user?._id);
            if (res.status === IResponseStatus.Success) {
                setComponentCount(res.data?.count!);
                updateLocalUser({ points: res.data?.points });
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

    const handleUploadImage = async (file: File, type: "avatar" | "thumbnail") => {
        try {
            if (type === "avatar") setIsUploadingAvatar(true);
            else setIsUploadingThumbnail(true);
            const uploaded = await uploadToCloudinary(file, type === "avatar" ? "avatars" : "thumbnails");
            await updateUser({ _id: user?._id, [type]: uploaded.url });
        } catch (error: any) {
            if (isSessionExpired(error)) return;
            showError(error?.message || "Upload failed");
        } finally {
            if (type === "avatar") setIsUploadingAvatar(false);
            else setIsUploadingThumbnail(false);
        }
    };

    const handleDelete = async (id: string) => {
        await ComponentService.deleteComponent(id);
        await loadComponents(currentPage);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "thumbnail") => {
        const file = e.target.files?.[0];
        if (!file) return;
        handleUploadImage(file, type);
        e.target.value = "";
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
                        backgroundImage: user?.thumbnail ? `url(${user?.thumbnail})` : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    {isUploadingThumbnail && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                        </div>
                    )}
                    <button
                        onClick={() => thumbnailInputRef.current?.click()}
                        disabled={isUploadingThumbnail}
                        className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-medium text-white transition-all z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span className="hidden sm:inline">Customize Cover</span>
                        <span className="sm:hidden">Customize</span>
                    </button>
                    <input ref={thumbnailInputRef} type="file" accept="image/*" onChange={(e) => handleFileChange(e, "thumbnail")} className="hidden" />
                </div>

                <div className="px-0 mt-0">
                    <div className="flex flex-col sm:flex-row gap-6 items-start justify-between">
                        <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                            <div className="flex flex-row items-end gap-3 sm:gap-5 w-full sm:w-auto">
                                <div className="relative -mt-14 sm:-mt-20 ml-3 sm:ml-4 lg:ml-6 flex-shrink-0 z-20">
                                    <img
                                        src={user?.avatar}
                                        alt={user?.username}
                                        className="w-28 sm:w-40 lg:w-44 h-28 sm:h-40 lg:h-44 rounded-2xl sm:rounded-3xl border-[5px] sm:border-[6px] border-white/10 bg-[#1a1a1a] shadow-2xl object-cover"
                                    />
                                    {isUploadingAvatar && (
                                        <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-black/60 flex items-center justify-center">
                                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                                        </div>
                                    )}
                                    <button
                                        onClick={() => avatarInputRef.current?.click()}
                                        disabled={isUploadingAvatar}
                                        className="absolute bottom-2 right-2 w-7 h-7 sm:w-8 sm:h-8 bg-black/70 hover:bg-black/90 border border-white/20 rounded-lg flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                                    </button>
                                    <input ref={avatarInputRef} type="file" accept="image/*" onChange={(e) => handleFileChange(e, "avatar")} className="hidden" />
                                </div>
                                <div className="flex flex-col items-start justify-end pb-1 sm:pb-2">
                                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-0.5 sm:mb-1">{user?.username}</h1>
                                    <p className="text-white/40 text-xs sm:text-sm font-normal">@{user?.username}</p>
                                </div>
                            </div>
                            <div className="pl-3 sm:pl-8 w-full mt-2">
                                <p className="text-white/70 text-xs sm:text-sm max-w-2xl leading-relaxed font-normal text-left">
                                    {user?.biography || "No bio given. Click settings to update your profile description."}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col items-start sm:items-end gap-4 w-full sm:w-auto pt-2 sm:pt-8 px-3 sm:px-0">
                            <div className="flex items-center justify-around sm:justify-start gap-4 sm:gap-6 py-2.5 sm:py-2 px-3 sm:px-4 bg-white/5 rounded-xl sm:rounded-2xl border border-white/5 w-full sm:w-auto">
                                <StatItem value={componentCount} label="posts" />
                                <StatItem value={user?.points || 0} label="points" icon={<Hexagon className="w-3 sm:w-3.5 sm:h-3.5 h-3 text-purple-400" />} />
                            </div>
                            <button
                                onClick={() => navigate("/settings/profile")}
                                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-white transition-all w-full sm:w-auto"
                            >
                                <Settings className="w-3.5 sm:w-4 sm:h-4 h-3.5" />
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mb-6 sm:mb-8">
                <div className="flex flex-row items-center justify-between border-b border-white/5 px-1 sm:px-2 gap-4">
                    <div className="flex gap-0 sm:gap-1 overflow-x-auto overflow-y-hidden -mb-[1px] flex-1 min-w-0 custom-scrollbar">
                        {(["posts", "drafts"] as ProfileTabType[]).map((tab) => (
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
                            <>
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
                            </>
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
                    <EmptyList activeTab={activeTab} onCreate={() => setShowCreatePopup(true)} />
                ) : (
                    <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 sm:gap-6 min-[400px]:gap-3 mb-8 sm:mb-12">
                        {components.map((component, index) => (
                            <ComponentCard
                                isDraft={activeTab === "drafts"}
                                isSaved={user?.savedIds?.includes(component._id)}
                                key={component._id}
                                component={component}
                                index={index}
                                onGetCode={() => navigate(`/view/${component._id}`)}
                                onDelete={user?._id === component.authorId._id ? handleDelete : undefined}
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

export { ProfilePage };
