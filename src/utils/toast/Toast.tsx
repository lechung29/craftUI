/** @format */

import toast from "react-hot-toast";

export const showSuccess = (message: string) => {
    toast.success(message, {
        style: {
            background: "#1f1f1f",
            color: "#ffffff",
            padding: "16px 20px",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            backdropFilter: "blur(10px)",
        },
        iconTheme: {
            primary: "#10b981",
            secondary: "#ffffff",
        },
        duration: 4000,
    });
};

export const showError = (message: string) => {
    toast.error(message, {
        style: {
            background: "#1f1f1f",
            color: "#ffffff",
            padding: "16px 20px",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            backdropFilter: "blur(10px)",
        },
        iconTheme: {
            primary: "#ef4444",
            secondary: "#ffffff",
        },
        duration: 5000,
    });
};

export const showWarning = (message: string) => {
    toast(message, {
        icon: "⚠️",
        style: {
            background: "#1f1f1f",
            color: "#ffffff",
            padding: "16px 20px",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
            border: "1px solid rgba(251, 191, 36, 0.3)",
            backdropFilter: "blur(10px)",
        },
        duration: 4500,
    });
};

export const showInfo = (message: string) => {
    toast(message, {
        icon: "ℹ️",
        style: {
            background: "#1f1f1f",
            color: "#ffffff",
            padding: "16px 20px",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            backdropFilter: "blur(10px)",
        },
        duration: 4000,
    });
};

export const showLoading = (message: string) => {
    return toast.loading(message, {
        style: {
            background: "#1f1f1f",
            color: "#ffffff",
            padding: "16px 20px",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            backdropFilter: "blur(10px)",
        },
    });
};

export const showPromise = <T,>(
    promise: Promise<T>,
    messages: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((error: any) => string);
    },
) => {
    return toast.promise(
        promise,
        {
            loading: messages.loading,
            success: messages.success,
            error: messages.error,
        },
        {
            style: {
                background: "#1f1f1f",
                color: "#ffffff",
                padding: "16px 20px",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "500",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
                backdropFilter: "blur(10px)",
            },
            success: {
                duration: 4000,
                icon: "✅",
                style: {
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                },
            },
            error: {
                duration: 5000,
                icon: "❌",
                style: {
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                },
            },
            loading: {
                style: {
                    border: "1px solid rgba(99, 102, 241, 0.3)",
                },
            },
        },
    );
};

export const showCustom = (content: React.ReactNode, options?: any) => {
    toast.custom(
        (t) => (
            <div className={`${t.visible ? "animate-enter" : "animate-leave"} max-w-md w-full bg-[#1f1f1f] shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-white/10 backdrop-blur-lg`}>
                <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                        <div className="ml-3 flex-1">{content}</div>
                    </div>
                </div>
                <div className="flex border-l border-white/10">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="w-full border border-transparent rounded-none rounded-r-xl p-4 flex items-center justify-center text-sm font-medium text-white/60 hover:text-white/80 focus:outline-none transition-colors"
                    >
                        ✕
                    </button>
                </div>
            </div>
        ),
        options,
    );
};

export const dismissAll = () => {
    toast.dismiss();
};

export const dismiss = (toastId: string) => {
    toast.dismiss(toastId);
};
