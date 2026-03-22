/** @format */

import React from "react";
import { MapPin, Building2, Twitter, Link as LinkIcon, Pencil, User } from "lucide-react";
import { useAuthStore } from "@/store";
import { BaseTextArea, DefaultButton, Input, PrimaryButton } from "@/components";
import { IUserInformation } from "@/types";
import { cx } from "@/utils";

const ProfileSettingPage: React.FunctionComponent = () => {
    const { user, updateUser } = useAuthStore();
    const initInputState: Partial<IUserInformation> = {
        username: user?.username,
        location: user?.location,
        company: user?.company,
        twitter: user?.twitter,
        websiteURL: user?.websiteURL,
        biography: user?.biography,
    };
    const [formData, setFormData] = React.useState(initInputState);
    const [hasChanges, setHasChanges] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSave = async () => {
        if (!user?._id) return;

        setIsLoading(true);
        try {
            const updatePayload = {
                _id: user._id,
                username: formData.username,
                location: formData.location,
                company: formData.company,
                twitter: formData.twitter,
                websiteURL: formData.websiteURL,
                biography: formData.biography,
            };
            updateUser(updatePayload);
            setHasChanges(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData(initInputState);
        setHasChanges(false);
    };

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    return (
        <React.Fragment>
            <div className="mb-4 md:mb-5">
                <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-white mb-1">Personal Information</h1>
                <p className="text-white/50 text-xs">Update your public profile details.</p>
            </div>
            <div className="space-y-3 md:space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-x-8 md:gap-y-4">
                    <div>
                        <label className="flex items-center gap-1.5 md:gap-2 text-xs font-medium text-white/80 mb-1 md:mb-1.5">
                            <User className="w-3 h-3 md:w-4 md:h-4" /> <span>Name</span>
                        </label>
                        <Input type="text" value={formData.username} onChange={(value) => handleChange("username", value)} disabled={isLoading} />
                    </div>
                    <div>
                        <label className="flex items-center gap-1.5 md:gap-2 text-xs font-medium text-white/80 mb-1 md:mb-1.5">
                            <MapPin className="w-3 h-3 md:w-4 md:h-4" /> <span>Location</span>
                        </label>
                        <Input type="text" value={formData.location} onChange={(value) => handleChange("location", value)} disabled={isLoading} />
                    </div>

                    <div>
                        <label className="flex items-center gap-1.5 md:gap-2 text-xs font-medium text-white/80 mb-1 md:mb-1.5">
                            <Building2 className="w-3 h-3 md:w-4 md:h-4" /> <span>Company</span>
                        </label>
                        <Input type="text" value={formData.company} onChange={(value) => handleChange("company", value)} disabled={isLoading} />
                    </div>

                    <div>
                        <label className="flex items-center gap-1.5 md:gap-2 text-xs font-medium text-white/80 mb-1 md:mb-1.5">
                            <Twitter className="w-3 h-3 md:w-4 md:h-4" /> <span>Twitter Handle</span>
                        </label>
                        <Input type="text" value={formData.twitter} onChange={(value) => handleChange("twitter", value)} disabled={isLoading} placeholder="Your Twitter handle" />
                    </div>
                </div>

                <div>
                    <label className="flex items-center gap-1.5 md:gap-2 text-xs font-medium text-white/80 mb-1 md:mb-1.5">
                        <LinkIcon className="w-3 h-3 md:w-4 md:h-4" /> <span>Website</span>
                    </label>
                    <Input type="url" value={formData.websiteURL} onChange={(value) => handleChange("websiteURL", value)} disabled={isLoading} placeholder="https://..." />
                </div>

                <div>
                    <label className="flex items-center gap-1.5 md:gap-2 text-xs font-medium text-white/80 mb-1 md:mb-1.5">
                        <Pencil className="w-3 h-3 md:w-4 md:h-4" /> <span>Bio</span>
                    </label>
                    <BaseTextArea value={formData.biography} onChange={(value) => handleChange("biography", value)} disabled={isLoading} rows={4} />
                </div>

                <div className="flex items-center justify-end gap-2 md:gap-3 pt-3 md:pt-4 border-t border-white/5">
                    <DefaultButton className="px-3 md:px-5 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium text-white/60 hover:text-white transition-colors" onClick={handleCancel}>
                        Cancel
                    </DefaultButton>
                    <PrimaryButton
                        disabled={!hasChanges || isLoading}
                        isLoading={isLoading}
                        className={cx(
                            "px-4 md:px-6 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all",
                            hasChanges && !isLoading ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "bg-white/5 text-white/30 cursor-not-allowed",
                        )}
                        onClick={handleSave}
                    >
                        Save changes
                    </PrimaryButton>
                </div>
            </div>
        </React.Fragment>
    );
};

export { ProfileSettingPage };
