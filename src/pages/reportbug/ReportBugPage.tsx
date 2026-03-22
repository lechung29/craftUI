/** @format */

import { PrimaryButton } from "@/components";
import { cx, showError, showSuccess } from "@/utils";
import React from "react";

const ReportBugPage: React.FunctionComponent = () => {
    const [bugDescription, setBugDescription] = React.useState("");
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const maxChars = 5000;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            if (bugDescription.trim()) {
                showSuccess("Report submitted successfully!");
            } else {
                showError("An error occurred. Please try again!");
            }
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="flex-1 w-full max-w-3xl px-4 sm:px-6 mx-auto py-6 md:py-12 lg:py-16">
            <div className="mb-5 md:mb-8">
                <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-white mb-1">Report a Bug</h1>
                <p className="text-white/50 text-xs md:text-sm">Help us improve by reporting any issues or bugs you encounter.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="space-y-1.5 md:space-y-2">
                    <label className="block text-xs md:text-sm font-medium text-white/90">Bug Description</label>

                    <div className="relative">
                        <textarea
                            value={bugDescription}
                            rows={6}
                            maxLength={maxChars}
                            onChange={(e) => setBugDescription(e.target.value)}
                            placeholder="Please describe the bug you encountered, including steps to reproduce if possible"
                            className="w-full px-3 py-2 md:px-4 md:py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-xs md:text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-indigo-500/50 transition-all resize-none shadow-sm
                                       scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20"
                            style={{
                                scrollbarWidth: "thin",
                                scrollbarColor: "rgba(255, 255, 255, 0.1) transparent",
                            }}
                        />

                        <style
                            dangerouslySetInnerHTML={{
                                __html: `
                            textarea::-webkit-scrollbar {
                                width: 6px;
                            }
                            textarea::-webkit-scrollbar-track {
                                background: transparent;
                            }
                            textarea::-webkit-scrollbar-thumb {
                                background: rgba(255, 255, 255, 0.1);
                                border-radius: 10px;
                            }
                            textarea::-webkit-scrollbar-thumb:hover {
                                background: rgba(255, 255, 255, 0.2);
                            }
                        `,
                            }}
                        />
                        <div className="flex justify-end mt-1.5 md:mt-2 text-[10px] md:text-xs text-white/40">
                            {bugDescription.length}/{maxChars} characters
                        </div>
                    </div>
                </div>

                <div className="pt-0.5">
                    <PrimaryButton
                        type="submit"
                        disabled={!bugDescription.trim() || isLoading}
                        isLoading={isLoading}
                        className={cx(
                            "px-5 md:px-6 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-semibold transition-all w-44",
                            bugDescription.trim() ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 active:scale-95" : "bg-white/5 text-white/20 cursor-not-allowed",
                        )}
                    >
                        Submit Bug Report
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
};

export { ReportBugPage };
