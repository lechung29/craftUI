/** @format */

import { Outlet } from "react-router-dom";
import { ElementSidebar } from "../elementsidebar";
import { useSidebarStore } from "@/store/sidebarStore";

interface IWithSidebarLayoutProps {
    children?: React.ReactNode;
}
const WithSidebarLayout: React.FunctionComponent<IWithSidebarLayoutProps> = (_props) => {
    const { selectedType, setSelectedType } = useSidebarStore();
    return (
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 px-4 sm:px-6 lg:pr-8">
            <div className="w-full lg:w-auto">
                <ElementSidebar selectedCategory={selectedType} onSelectCategory={setSelectedType} />
            </div>
            <div className="flex-1 min-w-0 py-3 sm:py-6">
                <Outlet />
            </div>
        </div>
    );
};

export { WithSidebarLayout };
