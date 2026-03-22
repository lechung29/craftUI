/** @format */

import React from "react";
import { motion } from "framer-motion";
import { Instagram, Twitter } from "lucide-react";

const Footer: React.FunctionComponent = () => {
    const footerLinks = {
        resources: [
            { label: "Pixelrepo.com", href: "#" },
            { label: "Cssbuttons.io", href: "#" },
            { label: "Neumorphism.io", href: "#" },
            { label: "Browsergames.gg", href: "#" },
        ],
        information: [
            { label: "Blog", href: "#" },
            { label: "Post Guidelines", href: "#" },
            { label: "Give feedback", href: "/feedback" },
            { label: "Report bug", href: "/report-bug" },
        ],
        legal: [
            { label: "Terms and Conditions", href: "#" },
            { label: "Privacy policy", href: "#" },
            { label: "Cookie policy", href: "#" },
            { label: "Disclaimer", href: "#" },
        ],
    };

    return (
        <footer className="bg-[#0a0a0a] py-12 sm:py-20 px-4 sm:px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-10 sm:mb-16">
                    <div className="col-span-1">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-4 sm:space-y-6">
                            <div className="flex flex-col gap-1.5 sm:gap-2">
                                <div className="flex items-center gap-0">
                                    <span className="text-2xl font-bold text-white">Craft</span>
                                    <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent relative inline-block">
                                        UI
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full"></span>
                                    </span>
                                </div>

                                <div className="flex items-center text-white/60 text-xs sm:text-sm">
                                    <span>The universe of UI</span>
                                </div>
                            </div>

                            <div className="space-y-1.5 sm:space-y-2">
                                <div className="flex items-center gap-2 text-white">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                                        />
                                    </svg>
                                    <span className="font-bold text-xs sm:text-base">MIT License</span>
                                </div>
                                <p className="text-white/50 text-xs sm:text-sm leading-relaxed">
                                    All content (UI elements) on this site are published under the{" "}
                                    <a href="#" className="text-white/70 hover:text-white underline decoration-white/30 underline-offset-2 transition-colors">
                                        MIT License
                                    </a>
                                    .
                                </p>
                            </div>

                            <div className="flex items-center gap-3 sm:gap-4">
                                <a href="#" className="text-white/60 hover:text-white transition-colors">
                                    <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
                                </a>
                                <a href="#" className="text-white/60 hover:text-white transition-colors">
                                    <Twitter className="w-5 h-5 sm:w-6 sm:h-6" />
                                </a>
                                <a href="#" className="text-white/60 hover:text-white transition-colors">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                                    </svg>
                                </a>
                            </div>
                        </motion.div>
                    </div>

                    <div className="col-span-1 sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                            <h3 className="text-white font-bold mb-3 sm:mb-4 text-sm">Resources</h3>
                            <ul className="space-y-2 sm:space-y-3">
                                {footerLinks.resources.map((link) => (
                                    <li key={link.label}>
                                        <a href={link.href} className="text-white/60 hover:text-white transition-colors text-xs sm:text-sm">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
                            <h3 className="text-white font-bold mb-3 sm:mb-4 text-sm">Information</h3>
                            <ul className="space-y-2 sm:space-y-3">
                                {footerLinks.information.map((link) => (
                                    <li key={link.label}>
                                        <a href={link.href} className="text-white/60 hover:text-white transition-colors text-xs sm:text-sm">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                            <h3 className="text-white font-bold mb-3 sm:mb-4 text-sm">Legal</h3>
                            <ul className="space-y-2 sm:space-y-3">
                                {footerLinks.legal.map((link) => (
                                    <li key={link.label}>
                                        <a href={link.href} className="text-white/60 hover:text-white transition-colors text-xs sm:text-sm">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>

                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="border-t border-white/10 pt-6 text-left">
                    <p className="text-xs sm:text-sm text-white/40">2026 Pixel Galaxies. All rights reserved. - CraftUI</p>
                </motion.div>
            </div>
        </footer>
    );
};

export { Footer };
