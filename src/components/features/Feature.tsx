/** @format */

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ComponentService } from "@/services/components/ComponentService";
import { IResponseStatus } from "@/types/requestbase";
import { isSessionExpired, showError } from "@/utils";
import { ComponentCard } from "../componentcard/ComponentCard";
import { IComponent } from "@/types/components";
import { ComponentCardLoading } from "../componentcardloading/ComponentCardLoading";
import { PrimaryButton } from "../button";
import { useAuthStore } from "@/store/authStore";
import { useSidebarStore } from "@/store";

const FeaturedComponents: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { setSearchKey, setSelectedStyle, setSelectedType } = useSidebarStore();
    const [components, setComponents] = React.useState<IComponent[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        loadLatestComponents();
    }, []);

    const loadLatestComponents = async () => {
        try {
            setIsLoading(true);
            const response = await ComponentService.getLatestComponents();

            if (response.status === IResponseStatus.Success) {
                setComponents(response.data || []);
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

    const handleGetCode = (component: IComponent) => {
        navigate(`/view/${component._id}`);
    };

    return (
        <section className="py-12 sm:py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4">Latest UI Components</h2>
                    <p className="text-xs sm:text-lg text-white/60">Explore the newest components from our community</p>
                </motion.div>
                {isLoading && <ComponentCardLoading />}
                {!isLoading && components.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-white/60 text-lg mb-4">No components found</p>
                    </div>
                )}
                {!isLoading && components.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
                            {components.map((component, index) => (
                                <ComponentCard key={component._id} isSaved={user?.savedIds?.includes(component._id)} component={component} index={index} onGetCode={handleGetCode} />
                            ))}
                        </div>
                        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex justify-center">
                            <PrimaryButton
                                onClick={() => {
                                    navigate("/elements");
                                    setSearchKey("");
                                    setSelectedStyle(undefined);
                                    setSelectedType(undefined);
                                }}
                                className="flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold rounded-xl transition-all shadow-xl shadow-purple-500/30 text-xs sm:text-base"
                            >
                                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                                Browse all components
                            </PrimaryButton>
                        </motion.div>
                    </>
                )}
            </div>
        </section>
    );
};

export { FeaturedComponents };
