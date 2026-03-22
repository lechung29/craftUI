/** @format */

import React from "react";
import { useAuthStore, useSidebarStore } from "@/store";
import { IComponent, IPaginationInfo, IResponseStatus } from "@/types";
import { ComponentCardLoading, ComponentCard, NoComponentFound, FilterBar } from "@/components";
import { ComponentService } from "@/services";
import { useNavigate } from "react-router-dom";
import { isSessionExpired, showError } from "@/utils";

const ElementsPage: React.FunctionComponent = () => {
    const { selectedType, selectedStyle, searchKey, setSearchKey, setSelectedStyle } = useSidebarStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [components, setComponents] = React.useState<IComponent[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [pagination, setPagination] = React.useState<IPaginationInfo | null>(null);
    const [currentPage, setCurrentPage] = React.useState(1);

    React.useEffect(() => {
        setCurrentPage(1);
        loadComponentByType(1);
    }, [selectedType, selectedStyle, searchKey]);

    const loadComponentByType = async (page: number) => {
        try {
            setIsLoading(true);
            const response = await ComponentService.getComponentList(selectedType, selectedStyle, page, 9, searchKey);

            if (response.status === IResponseStatus.Success) {
                setComponents(response.data?.components || []);
                setPagination(response.data?.pagination || null);
            } else {
                showError(response.message || "Failed to load components");
            }
        } catch (error: any) {
            console.error("Failed to load components:", error);
            if (isSessionExpired(error)) return;
            showError(error?.message || "Failed to load components");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return loadComponentByType(page);
    };

    const handleGetCode = (component: IComponent) => {
        navigate(`/view/${component._id}`);
    };

    return (
        <React.Fragment>
            <FilterBar
                currentPage={currentPage}
                pagination={isLoading ? null : pagination}
                handlePageChange={handlePageChange}
                selectedFramework={selectedStyle}
                onSelectFramework={setSelectedStyle}
                searchQuery={searchKey}
                onSearchChange={setSearchKey}
            />
            {isLoading && <ComponentCardLoading />}
            {!isLoading && components.length === 0 && <NoComponentFound />}

            {!isLoading && components.length > 0 && (
                <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 sm:gap-6 min-[400px]:gap-3 mb-8 sm:mb-12">
                    {components.map((component, index) => (
                        <ComponentCard
                            isSaved={user?.savedIds?.includes(component._id)}
                            key={component._id}
                            component={component}
                            index={index}
                            onGetCode={handleGetCode}
                        />
                    ))}
                </div>
            )}
        </React.Fragment>
    );
};

export { ElementsPage };
