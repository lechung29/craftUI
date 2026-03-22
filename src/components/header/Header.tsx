/** @format */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Menu, X } from "lucide-react";
import { PrimaryButton } from "@/components";
import { CreatePopup } from "../createpopup";
import { PointsButton } from "../pointbutton";
import { UserMenu } from "../usermenu";
import { MobileMenu } from "../mobilemenu";
import { NavItem } from "./components";

const Header: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = React.useState(false);
    const [showMobileMenu, setShowMobileMenu] = React.useState(false);
    const [showCreatePopup, setShowCreatePopup] = React.useState(false);
    const [showPointsTooltip, setShowPointsTooltip] = React.useState(false);

    const navItems = [
        { label: "Elements", hasDropdown: true },
        { label: "Spotlight", path: "/spotlight" },
    ];

    return (
        <header className="relative bg-[#0a0a0a]">
            <div className="max-w-[1920px] mx-auto py-[5px] px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    <div className="flex items-center gap-6 lg:gap-10">
                        <button onClick={() => navigate("/")} className="flex items-center gap-0.5 group">
                            <div className="hidden sm:flex items-center gap-0.5">
                                <span className="text-2xl font-bold text-white">Craft</span>
                                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent relative inline-block">
                                    UI
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full"></span>
                                </span>
                            </div>
                            <div className="sm:hidden flex items-center gap-0.5">
                                <span className="text-xl font-bold text-white">Craft</span>
                                <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent relative inline-block">
                                    UI
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full"></span>
                                </span>
                            </div>
                        </button>
                        <nav className="hidden lg:flex items-center gap-0">
                            {navItems.map((item) => (
                                <NavItem key={item.label} {...item} />
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <PointsButton show={showPointsTooltip} setShow={setShowPointsTooltip} />
                        <PrimaryButton onClick={() => setShowCreatePopup(true)} leftIcon={<Plus className="w-4 h-4" />}>
                            Create
                        </PrimaryButton>
                        <UserMenu show={showUserMenu} setShow={setShowUserMenu} />
                        <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors">
                            {showMobileMenu ? <X className="w-5 h-5 text-white/90" /> : <Menu className="w-5 h-5 text-white/90" />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showMobileMenu && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="lg:hidden fixed inset-0 z-50 bg-[#0a0a0a]">
                        <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
                    </motion.div>
                )}
            </AnimatePresence>
            {showCreatePopup && <CreatePopup isOpen={showCreatePopup} onClose={() => setShowCreatePopup(false)} />}
        </header>
    );
};

export { Header };
