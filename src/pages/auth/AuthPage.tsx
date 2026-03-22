/** @format */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { validateLoginForm, validateRegisterForm, validateForgotPasswordForm, sanitizeEmail, sanitizeUsername, getFirstError, validatePassword } from "@/utils/auth";
import { DecorButton, DecorCard, DecorCheckbox, DecorDropdown, DecorSlider, DecorToggle, FloatingItem, GoogleAuthButton, PrimaryButton } from "@/components";
import { Input } from "@/components/input";
import { cx, isSessionExpired, showError, showSuccess } from "@/utils";
import { useImmerState } from "@/hooks";
import { useGoogleLogin } from "@react-oauth/google";
import { AuthService } from "@/services";
import { IResponseStatus } from "@/types";

type AuthTabType = "Login" | "Register" | "Forgot";

interface IAuthPageState {
    currentTab: AuthTabType;
    loginForm: {
        email: string;
        password: string;
    };
    registerForm: {
        email: string;
        password: string;
        username: string;
    };
    forgotForm: {
        email: string;
        code: string;
        password: string;
    };
    isLoading: boolean;
    isLoadingGoogle: boolean;
    isShowLoginPassword: boolean;
    isShowRegisterPassword: boolean;
    isShowResetPassword: boolean;
    isSendEmailSuccess: boolean;
    isVerifyCodeSuccess: boolean;
}

const initialState: IAuthPageState = {
    currentTab: "Login",
    loginForm: {
        email: "",
        password: "",
    },
    registerForm: {
        email: "",
        password: "",
        username: "",
    },
    forgotForm: {
        email: "",
        code: "",
        password: "",
    },
    isLoading: false,
    isLoadingGoogle: false,
    isShowLoginPassword: false,
    isShowRegisterPassword: false,
    isShowResetPassword: false,
    isSendEmailSuccess: false,
    isVerifyCodeSuccess: false,
};

const AuthPage: React.FunctionComponent = () => {
    const [state, setState] = useImmerState<IAuthPageState>(initialState);
    const { currentTab, isLoading, isShowLoginPassword, isShowRegisterPassword, isShowResetPassword, loginForm, registerForm, forgotForm, isLoadingGoogle, isSendEmailSuccess, isVerifyCodeSuccess } =
        state;
    const { login, register, loginGoogle } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (currentTab === "Forgot") {
            try {
                setState({ isLoading: true });
                if (!isSendEmailSuccess && !isVerifyCodeSuccess) {
                    const validationResult = validateForgotPasswordForm(forgotForm.email);
                    if (!validationResult.isValid) {
                        const errorMessage = getFirstError(validationResult);
                        if (errorMessage) {
                            showError(errorMessage);
                        }
                        return;
                    }

                    const res = await AuthService.forgotPasswordRequest(sanitizeEmail(forgotForm.email));
                    if (res.status === IResponseStatus.Success) {
                        setState({
                            isSendEmailSuccess: true,
                        });
                        showSuccess(res.message!);
                    } else {
                        showError(res.message!);
                    }
                } else if (isSendEmailSuccess && !isVerifyCodeSuccess) {
                    const res = await AuthService.verifyRecoveryPasswordToken(sanitizeEmail(forgotForm.email), forgotForm.code);
                    if (res.status === IResponseStatus.Success) {
                        setState({ isVerifyCodeSuccess: true });
                        showSuccess(res.message!);
                    } else {
                        showError(res.message!);
                    }
                } else if (isSendEmailSuccess && isVerifyCodeSuccess) {
                    const newPasswordError = validatePassword(forgotForm.password);
                    if (newPasswordError) {
                        showError(newPasswordError.message);
                        return;
                    }
                    const res = await AuthService.resetPasswordByRPToken(sanitizeEmail(forgotForm.email), forgotForm.password);
                    if (res.status === IResponseStatus.Success) {
                        setState({ currentTab: "Login", forgotForm: initialState.forgotForm, isSendEmailSuccess: false, isVerifyCodeSuccess: false });
                        showSuccess(res.message!);
                    } else {
                        showError(res.message!);
                    }
                }
            } catch (error: any) {
                if (isSessionExpired(error)) return;
                const errorMessage = error?.response?.data?.message || "An error occurred. Please try again!";
                showError(errorMessage);
            } finally {
                setState({ isLoading: false });
            }
        } else if (currentTab === "Login") {
            const validationResult = validateLoginForm(loginForm.email, loginForm.password);
            if (!validationResult.isValid) {
                const errorMessage = getFirstError(validationResult);
                if (errorMessage) {
                    showError(errorMessage);
                }
                return;
            }
            setState({ isLoading: true });
            try {
                const sanitizedEmail = sanitizeEmail(loginForm.email);
                await login(sanitizedEmail, loginForm.password, () => navigate("/dashboard"));
            } finally {
                setState({ isLoading: false });
            }
        } else if (currentTab === "Register") {
            const validationResult = validateRegisterForm(registerForm.username, registerForm.email, registerForm.password);

            if (!validationResult.isValid) {
                const errorMessage = getFirstError(validationResult);
                if (errorMessage) {
                    showError(errorMessage);
                }
                return;
            }

            setState({ isLoading: true });
            try {
                const sanitizedUsername = sanitizeUsername(registerForm.username);
                const sanitizedEmail = sanitizeEmail(registerForm.email);
                await register(sanitizedUsername, sanitizedEmail, registerForm.password, () => {
                    setState({ currentTab: "Login", loginForm: initialState.loginForm, registerForm: initialState.registerForm });
                });
            } finally {
                setState({ isLoading: false });
            }
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setState({ isLoadingGoogle: true });

            const userInfo = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            }).then((res) => res.json());

            await loginGoogle(userInfo.email, userInfo.picture, () => navigate("/")).finally(() => {
                setState({ isLoadingGoogle: false });
            });
        },
        onError: () => {
            showError("Login by Google failed. Please try again ");
        },
    });

    const OrDivider = () => (
        <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[11px] text-white/30 font-medium">or</span>
            <div className="flex-1 h-px bg-white/10" />
        </div>
    );

    return (
        <div className="relative min-h-screen overflow-hidden flex items-center justify-center text-white p-3 sm:p-4">
            <motion.div
                className="absolute inset-0"
                style={{
                    background: `
                        radial-gradient(1200px circle at 50% -200px,
                            rgba(99,102,241,0.45),
                            transparent 60%
                        ),
                        radial-gradient(800px circle at 20% 30%,
                            rgba(79,70,229,0.35),
                            transparent 55%
                        ),
                        linear-gradient(to bottom, #0b0e14, #0b0e14)
                    `,
                }}
                animate={{ opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 12, repeat: Infinity }}
            />

            {/* === Desktop View Only === */}

            <FloatingItem delay={0} className="absolute top-[8%] left-[5%] z-0 hidden xl:block">
                <DecorButton label="Primary" gradient="from-indigo-400 to-purple-500" />
            </FloatingItem>

            <FloatingItem delay={1.6} className="absolute top-[30%] left-[3%] z-0 hidden xl:block">
                <DecorToggle gradient="from-orange-400 to-amber-500" />
            </FloatingItem>
            <FloatingItem delay={0.8} className="absolute top-[55%] left-[6%] z-0 hidden lg:block">
                <DecorDropdown label="Options" gradient="from-pink-400 to-fuchsia-500" />
            </FloatingItem>

            <FloatingItem delay={2.2} className="absolute top-[78%] left-[4%] z-0 hidden xl:block">
                <div className="scale-75">
                    <DecorCheckbox label="Active" gradient="from-teal-400 to-emerald-500" />
                </div>
            </FloatingItem>

            <FloatingItem delay={0.4} className="absolute top-[12%] right-[4%] z-0 hidden xl:block">
                <DecorCheckbox label="Remember" gradient="from-cyan-400 to-sky-500" />
            </FloatingItem>

            <FloatingItem delay={2} className="absolute top-[38%] right-[6%] z-0 hidden xl:block">
                <DecorSlider gradient="from-violet-400 to-indigo-500" />
            </FloatingItem>

            <FloatingItem delay={1.2} className="absolute top-[62%] right-[3%] z-0 hidden lg:block">
                <DecorCard label="Reusable UI" gradient="from-emerald-400 to-green-500" />
            </FloatingItem>

            <FloatingItem delay={2.6} className="absolute top-[82%] right-[5%] z-0 hidden xl:block">
                <div className="scale-75">
                    <DecorButton label="Secondary" gradient="from-rose-400 to-pink-500" />
                </div>
            </FloatingItem>

            {/* === Tablet View Only === */}
            <FloatingItem delay={0.5} className="absolute top-[15%] left-[2%] z-0 hidden lg:block xl:hidden">
                <div className="scale-90">
                    <DecorButton label="Primary" gradient="from-indigo-400 to-purple-500" />
                </div>
            </FloatingItem>

            <FloatingItem delay={1.5} className="absolute bottom-[15%] left-[2%] z-0 hidden lg:block xl:hidden">
                <div className="scale-90">
                    <DecorToggle gradient="from-orange-400 to-amber-500" />
                </div>
            </FloatingItem>

            <FloatingItem delay={1.0} className="absolute top-[15%] right-[2%] z-0 hidden lg:block xl:hidden">
                <div className="scale-90">
                    <DecorCheckbox label="Remember" gradient="from-cyan-400 to-sky-500" />
                </div>
            </FloatingItem>

            <FloatingItem delay={2.0} className="absolute bottom-[15%] right-[2%] z-0 hidden lg:block xl:hidden">
                <div className="scale-90">
                    <DecorSlider gradient="from-violet-400 to-indigo-500" />
                </div>
            </FloatingItem>

            {/* === Mobile View Only === */}

            <FloatingItem delay={0.6} className="absolute top-3 left-2 z-0 block lg:hidden">
                <div className="scale-[0.65]">
                    <DecorToggle gradient="from-orange-400 to-amber-500" />
                </div>
            </FloatingItem>

            <FloatingItem delay={1.0} className="absolute top-3 right-2 z-0 block lg:hidden">
                <div className="scale-[0.65]">
                    <DecorCheckbox label="On" gradient="from-cyan-400 to-sky-500" />
                </div>
            </FloatingItem>

            <FloatingItem delay={1.4} className="absolute bottom-3 left-2 z-0 block lg:hidden">
                <div className="scale-75">
                    <DecorButton label="UI" gradient="from-indigo-400 to-purple-500" />
                </div>
            </FloatingItem>

            <FloatingItem delay={1.8} className="absolute bottom-3 right-2 z-0 block lg:hidden">
                <div className="scale-75">
                    <DecorCard label="Component" gradient="from-emerald-400 to-green-500" />
                </div>
            </FloatingItem>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="
                    relative z-10 w-full max-w-md
                    rounded-2xl
                    bg-[#12141B]/90
                    backdrop-blur-xl
                    border border-white/10
                    shadow-[0_0_90px_rgba(99,102,241,0.18)]
                    p-5 sm:p-6 md:p-8
                "
            >
                <div className="text-center mb-5 sm:mb-6">
                    <div className="mx-auto mb-3 sm:mb-4 flex items-center justify-center gap-0.5">
                        <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Craft</span>
                        <span className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent relative inline-block">
                            UI
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full"></span>
                        </span>
                    </div>
                    <h1 className="text-lg sm:text-xl md:text-2xl font-semibold">{currentTab === "Forgot" ? "Reset Password" : "Join the Community"}</h1>
                    <p className="text-xs sm:text-sm text-white/60 mt-1">{currentTab === "Forgot" ? "Enter email to receive password recovery link" : "Create & share reusable React components"}</p>
                </div>

                {currentTab !== "Forgot" && (
                    <div className="relative flex bg-white/5 rounded-lg p-0.5 sm:p-1 mb-5 sm:mb-6">
                        {["Login", "Register"].map((label) => {
                            const active = label === currentTab;
                            return (
                                <button
                                    key={label}
                                    onClick={() => setState({ currentTab: label as AuthTabType })}
                                    className={cx(
                                        "relative flex-1 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors z-10",
                                        active ? "text-white" : "text-white/50 hover:text-white/70",
                                    )}
                                >
                                    {label}
                                </button>
                            );
                        })}
                        <motion.div
                            className="absolute inset-y-0.5 sm:inset-y-1 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-md shadow-lg"
                            initial={false}
                            animate={{
                                left: currentTab === "Login" ? "2px" : "50%",
                                right: currentTab === "Login" ? "50%" : "2px",
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                            }}
                        />
                    </div>
                )}
                <div className="relative overflow-hidden">
                    <AnimatePresence initial={false} mode="wait">
                        <motion.form
                            key={currentTab}
                            initial={{
                                x: currentTab === "Forgot" ? -100 : currentTab === "Login" ? -100 : 100,
                                opacity: 0,
                            }}
                            animate={{
                                x: 0,
                                opacity: 1,
                            }}
                            exit={{
                                x: currentTab === "Forgot" ? 100 : currentTab === "Login" ? 100 : -100,
                                opacity: 0,
                            }}
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 },
                            }}
                            onSubmit={handleSubmit}
                            className="space-y-3 sm:space-y-4"
                        >
                            {currentTab === "Forgot" ? (
                                <>
                                    <Input
                                        leftIcon={<Mail size={16} className="sm:w-[18px] sm:h-[18px]" />}
                                        type="email"
                                        placeholder="Email"
                                        value={forgotForm.email}
                                        disabled={isSendEmailSuccess || isVerifyCodeSuccess}
                                        onChange={(value: string) => setState({ forgotForm: { ...forgotForm, email: value } })}
                                    />
                                    {isSendEmailSuccess && (
                                        <Input
                                            leftIcon={<ShieldCheck size={16} className="sm:w-[18px] sm:h-[18px]" />}
                                            type="text"
                                            placeholder="OTP code"
                                            disabled={isVerifyCodeSuccess}
                                            value={forgotForm.code}
                                            onChange={(value: string) => setState({ forgotForm: { ...forgotForm, code: value } })}
                                        />
                                    )}
                                    {isSendEmailSuccess && isVerifyCodeSuccess && (
                                        <Input
                                            leftIcon={<Lock size={16} className="sm:w-[18px] sm:h-[18px]" />}
                                            rightIcon={
                                                isShowResetPassword ? (
                                                    <EyeOff size={16} className="sm:w-[18px] sm:h-[18px] cursor-pointer" onClick={() => setState({ isShowResetPassword: !isShowResetPassword })} />
                                                ) : (
                                                    <Eye size={16} className="sm:w-[18px] sm:h-[18px] cursor-pointer" onClick={() => setState({ isShowResetPassword: !isShowResetPassword })} />
                                                )
                                            }
                                            type={isShowResetPassword ? "text" : "password"}
                                            placeholder="New password"
                                            value={forgotForm.password}
                                            onChange={(value: string) => setState({ forgotForm: { ...forgotForm, password: value } })}
                                        />
                                    )}

                                    <PrimaryButton type="submit" isLoading={isLoading} className="w-full justify-center">
                                        {isSendEmailSuccess && isVerifyCodeSuccess ? "Submit to new password" : isSendEmailSuccess ? "Verify OTP code" : "Send recovery email"}
                                    </PrimaryButton>
                                    <button type="button" onClick={() => setState({ currentTab: "Login" })} className="w-full text-xs sm:text-sm text-white/60 hover:text-white transition-colors mt-3">
                                        ← Back to Login
                                    </button>
                                </>
                            ) : currentTab === "Login" ? (
                                <>
                                    <Input
                                        leftIcon={<Mail size={16} className="sm:w-[18px] sm:h-[18px]" />}
                                        type="email"
                                        placeholder="Email"
                                        value={loginForm.email}
                                        onChange={(value: string) => setState({ loginForm: { ...loginForm, email: value } })}
                                    />

                                    <Input
                                        leftIcon={<Lock size={16} className="sm:w-[18px] sm:h-[18px]" />}
                                        rightIcon={
                                            isShowLoginPassword ? (
                                                <EyeOff size={16} className="sm:w-[18px] sm:h-[18px] cursor-pointer" onClick={() => setState({ isShowLoginPassword: !isShowLoginPassword })} />
                                            ) : (
                                                <Eye size={16} className="sm:w-[18px] sm:h-[18px] cursor-pointer" onClick={() => setState({ isShowLoginPassword: !isShowLoginPassword })} />
                                            )
                                        }
                                        type={isShowLoginPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={loginForm.password}
                                        onChange={(value: string) => setState({ loginForm: { ...loginForm, password: value } })}
                                    />

                                    <div className="flex justify-end">
                                        <button type="button" onClick={() => setState({ currentTab: "Forgot" })} className="text-xs sm:text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                                            Forgot password?
                                        </button>
                                    </div>

                                    <PrimaryButton type="submit" isLoading={isLoading} className="w-full justify-center">
                                        Login
                                    </PrimaryButton>
                                    <OrDivider />
                                    <GoogleAuthButton isLoading={isLoadingGoogle} label="Continue with Google" onLogin={async () => handleGoogleLogin()} />
                                </>
                            ) : (
                                <>
                                    <Input
                                        leftIcon={<User size={16} className="sm:w-[18px] sm:h-[18px]" />}
                                        placeholder="Username"
                                        value={registerForm.username}
                                        onChange={(value: string) => setState({ registerForm: { ...registerForm, username: value } })}
                                    />

                                    <Input
                                        leftIcon={<Mail size={16} className="sm:w-[18px] sm:h-[18px]" />}
                                        type="email"
                                        placeholder="Email"
                                        value={registerForm.email}
                                        onChange={(value: string) => setState({ registerForm: { ...registerForm, email: value } })}
                                    />

                                    <Input
                                        leftIcon={<Lock size={16} className="sm:w-[18px] sm:h-[18px]" />}
                                        rightIcon={
                                            isShowRegisterPassword ? (
                                                <EyeOff size={16} className="sm:w-[18px] sm:h-[18px] cursor-pointer" onClick={() => setState({ isShowRegisterPassword: !isShowRegisterPassword })} />
                                            ) : (
                                                <Eye size={16} className="sm:w-[18px] sm:h-[18px] cursor-pointer" onClick={() => setState({ isShowRegisterPassword: !isShowRegisterPassword })} />
                                            )
                                        }
                                        type={isShowRegisterPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={registerForm.password}
                                        onChange={(value: string) => setState({ registerForm: { ...registerForm, password: value } })}
                                    />

                                    <PrimaryButton type="submit" isLoading={isLoading} className="w-full justify-center">
                                        Register
                                    </PrimaryButton>
                                    <OrDivider />
                                    <GoogleAuthButton isLoading={isLoadingGoogle} label="Sign up with Google" onLogin={async () => handleGoogleLogin()} />
                                </>
                            )}
                        </motion.form>
                    </AnimatePresence>
                </div>
                <p className="mt-5 sm:mt-6 text-center text-[10px] sm:text-xs text-white/40">By continuing, you agree to the Terms & Privacy Policy</p>
            </motion.div>
        </div>
    );
};

export { AuthPage };
