/** @format */

import { Outlet } from "react-router-dom";
import { Header } from "../header";
import { Footer } from "../footer";

interface IMainLayoutProps {
    children?: React.ReactNode;
}
const MainLayout: React.FunctionComponent<IMainLayoutProps> = (_props) => {
    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export { MainLayout };
