/** @format */

import React, { useState } from "react";
import { User, Trash2, ShieldAlert, X, Trash } from "lucide-react";
import { DefaultButton, PrimaryButton } from "@/components";
import { useAuthStore } from "@/store";
import { isSessionExpired } from "@/utils";

type IDialogBaseProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
};

const DeleteAccountDialog: React.FunctionComponent<IDialogBaseProps> = (props) => {
    const { isOpen, onClose, onConfirm } = props;
    return (
        isOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-[#1a1a1a] rounded-2xl max-w-md w-full border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-200">
                    <div className="flex items-start justify-between p-6 pb-4">
                        <div className="flex items-center gap-3">
                            <Trash className="w-4 h-4.5 text-white" />
                            <h2 className="text-md md:text-md font-medium text-white">Delete Account</h2>
                        </div>
                        <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-colors p-1 rounded-lg hover:bg-white/5">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="px-6 pb-6 space-y-4">
                        <p className="text-white/70 text-sm">Are you absolutely sure you want to delete your account?</p>
                        <div className="bg-red-800/10 rounded-lg py-2 px-3">
                            <p className="text-red-400 text-sm font-medium">This action cannot be undone.</p>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <DefaultButton onClick={onClose} className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg text-sm font-medium transition-all">
                                Cancel
                            </DefaultButton>
                            <PrimaryButton
                                onClick={onConfirm}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                                Yes, Delete My Account
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

const AccountSettingPage: React.FunctionComponent = () => {
    const { user, deleteAccount, logout } = useAuthStore();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDeleteAccount = () => {
        setShowDeleteModal(true);
    };

    const confirmDeleteAccount = async () => {
        return deleteAccount()
            .then(() => {
                setShowDeleteModal(false);
                setTimeout(() => {
                    logout();
                }, 2000);
            })
            .catch((error: any) => {
                if (isSessionExpired(error)) return;
                setShowDeleteModal(false);
            });
    };

    return (
        <React.Fragment>
            <div className="mb-4 md:mb-6 lg:mb-8">
                <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-white mb-1">Account Settings</h1>
                <p className="text-white/50 text-xs">Manage your account preferences and data</p>
            </div>
            <div className="space-y-5 md:space-y-8">
                <section>
                    <div className="flex items-center gap-1.5 md:gap-2 mb-3 md:mb-4">
                        <User className="w-4 h-4 md:w-5 md:h-5 text-white/80" />
                        <h2 className="text-sm md:text-base lg:text-lg font-semibold text-white">Account Information</h2>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 space-y-4 md:space-y-6">
                        <div>
                            <p className="text-xs !text-white/40">Username</p>
                            <p className="text-xs md:text-sm lg:text-base text-white font-medium">{user?.username}</p>
                        </div>
                        <div>
                            <p className="text-xs !text-white/40">Email</p>
                            <p className="text-xs md:text-sm lg:text-base text-white font-medium">{user?.email}</p>
                        </div>
                    </div>
                </section>
                <section>
                    <div className="flex items-center gap-1.5 md:gap-2 mb-3 md:mb-4">
                        <ShieldAlert className="w-4 h-4 md:w-5 md:h-5 text-red-500/80" />
                        <h2 className="text-sm md:text-base lg:text-lg font-semibold text-white">Danger Zone</h2>
                    </div>
                    <p className="text-xs text-white/40 mb-3 md:mb-4">Irreversible and destructive actions</p>
                    <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                        <div>
                            <h3 className="text-xs md:text-sm lg:text-base font-bold text-white mb-1">Delete Account</h3>
                            <p className="text-xs text-white/50">Permanently delete your account and all associated data.</p>
                        </div>
                        <PrimaryButton
                            onClick={handleDeleteAccount}
                            className="flex items-center justify-center gap-1.5 md:gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg text-xs md:text-sm font-semibold transition-all whitespace-nowrap"
                        >
                            <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            Delete Account
                        </PrimaryButton>
                    </div>
                </section>
            </div>
            {showDeleteModal && <DeleteAccountDialog isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={confirmDeleteAccount} />}
        </React.Fragment>
    );
};

export { AccountSettingPage };
