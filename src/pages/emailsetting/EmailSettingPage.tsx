/** @format */

import { Input, PrimaryButton, Toggle } from "@/components";
import { useAuthStore } from "@/store/authStore";
import { cx } from "@/utils";
import React, { useState } from "react";

const EmailSettingPage: React.FunctionComponent = () => {
    const { user, updateEmailSettings } = useAuthStore();
    const [email, setEmail] = useState(user?.email);
    const [receiveNotifications, setReceiveNotifications] = useState(user?.settings.isReceiveEmailNotification || false);
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailChange = (value: string) => {
        setEmail(value);
    };

    const toggleNotifications = () => {
        setReceiveNotifications(!receiveNotifications);
    };

    const noChanges = user?.email === email && user?.settings.isReceiveEmailNotification === receiveNotifications;

    const handleSave = async () => {
        setIsLoading(true);
        await updateEmailSettings(email!, receiveNotifications).then(() => setIsLoading(false));
    };

    const notificationItems = [
        { title: "Post published", desc: "Get notified when your posts are published" },
        { title: "Comments", desc: "Stay updated when someone comments on your posts" },
        { title: "Social media features", desc: "Know when we share your amazing work on our social media" },
    ];

    return (
        <React.Fragment>
            <div className="mb-4 md:mb-5">
                <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-white mb-1">Email Settings</h1>
                <p className="text-white/50 text-xs">Manage your email and notification preferences</p>
            </div>
            <div className="space-y-4 md:space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 max-w-2xl">
                    <h3 className="text-xs md:text-sm lg:text-base font-semibold text-white mb-3 md:mb-4">Email notifications include:</h3>
                    <ul className="space-y-2 md:space-y-3">
                        {notificationItems.map((item, index) => (
                            <li key={index} className="flex items-start gap-2 md:gap-3">
                                <div className="mt-1 md:mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                                <p className="text-xs text-white/90">
                                    <span className="font-bold">{item.title}</span>
                                    <span className="text-white/50"> — {item.desc}</span>
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-1.5 md:space-y-2">
                    <p className="text-xs !text-white/80">Email address</p>
                    <Input type="email" value={email} onChange={handleEmailChange} disabled={isLoading} />
                    <p className="text-[10px] md:text-xs text-white/40">We respect your privacy and will never share your email with third parties or send you marketing emails.</p>
                </div>
                <div>
                    <Toggle checked={receiveNotifications} onChange={toggleNotifications} label="Receive email notifications" />
                </div>
                <div className="pt-3 md:pt-4">
                    <PrimaryButton
                        onClick={handleSave}
                        disabled={noChanges || isLoading}
                        isLoading={isLoading}
                        className={cx(
                            "px-6 md:px-8 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all",
                            !noChanges && !isLoading ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700" : "bg-white/5 text-white/30 cursor-not-allowed",
                        )}
                    >
                        Save changes
                    </PrimaryButton>
                </div>
            </div>
        </React.Fragment>
    );
};

export { EmailSettingPage };
