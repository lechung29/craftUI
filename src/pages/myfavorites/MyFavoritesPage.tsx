/** @format */

import React, { useEffect, useState } from "react";
import { IComponent, IResponseStatus, IPaginationInfo } from "@/types";
import { ComponentService } from "@/services";
import { useAuthStore } from "@/store";
import { ComponentCardLoading, ComponentCard, Pagination, NoComponentFound } from "@/components";
import { useNavigate } from "react-router-dom";
import { isSessionExpired, showError } from "@/utils";

const MyFavoritesPage: React.FunctionComponent = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [components, setComponents] = useState<IComponent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState<IPaginationInfo | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        loadUserFavoriteComponents(currentPage);
    }, [currentPage]);

    const loadUserFavoriteComponents = async (page: number) => {
        try {
            setIsLoading(true);
            const response = await ComponentService.getUserFavoriteComponents(user?._id!, page, 6);

            if (response.status === IResponseStatus.Success) {
                setComponents(response.data?.components || []);
                setPagination(response.data?.pagination || null);
            } else {
                showError(response.message || "Failed to load components");
            }
        } catch (error: any) {
            if (isSessionExpired(error)) return;
            console.error("Failed to load components:", error);
            showError(error?.message || "Failed to load components");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGetCode = (component: IComponent) => {
        navigate(`/view/${component._id}`);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <React.Fragment>
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">My Favorites</h1>
            </div>

            {isLoading && <ComponentCardLoading />}

            {!isLoading && components.length === 0 && <NoComponentFound />}

            {!isLoading && components.length > 0 && (
                <React.Fragment>
                    <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 sm:gap-6 min-[400px]:gap-3 mb-8 sm:mb-12">
                        {components.map((component, index) => (
                            <ComponentCard
                                isSaved={true}
                                key={component._id}
                                component={component}
                                index={index}
                                onGetCode={handleGetCode}
                                onReloadList={() => loadUserFavoriteComponents(currentPage)}
                            />
                        ))}
                    </div>

                    {pagination && pagination.totalPages > 1 && <Pagination currentPage={currentPage} totalPages={pagination.totalPages} onPageChange={handlePageChange} />}
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export { MyFavoritesPage };
