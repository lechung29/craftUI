/** @format */

import React from "react";
import { useNavigate } from "react-router-dom";
import { useSessionExpiredStore } from "@/store/sessionExpiredStore";
import { useAuthStore } from "@/store/authStore";
import { ConfirmDialog } from "@/components/confirmdialog";

const SessionExpiredModal: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const { isOpen, closeModal } = useSessionExpiredStore();

    const handleOk = () => {
        closeModal();
        useAuthStore.setState({ user: null, isAuthenticated: false });
        navigate("/auth");
    };

    return (
        <ConfirmDialog
            isOpen={isOpen}
            title="Session Expired"
            description="Your session has expired. Please log in again to continue."
            confirmLabel="Log in"
            cancelLabel="Dismiss"
            variant="warning"
            onConfirm={handleOk}
            onCancel={closeModal}
        />
    );
};

export { SessionExpiredModal };
