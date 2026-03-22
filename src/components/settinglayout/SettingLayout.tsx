/** @format */

import { Outlet } from "react-router-dom";
import { SettingSidebar } from "../settingsidebar";

interface ISettingLayoutProps {
    children?: React.ReactNode;
}
const SettingLayout: React.FunctionComponent<ISettingLayoutProps> = (_props) => {
    return (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-6">
            <div className="flex flex-col md:flex-row md:gap-10">
                <SettingSidebar />
                <main className="flex-1 w-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export { SettingLayout };
