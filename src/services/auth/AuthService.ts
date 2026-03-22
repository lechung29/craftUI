/** @format */

import { instance } from "@/configs";
import { API_ROUTE } from "@/constants";
import { ILoginPayload, IRegisterPayload, IUserInformation, IResponseAdvance, IResponseBase } from "@/types";

class AuthService {
    public static registerUser(payload: IRegisterPayload): Promise<IResponseBase> {
        return instance.post(API_ROUTE.SIGNUP, payload);
    }

    public static loginUser(payload: ILoginPayload): Promise<IResponseAdvance<IUserInformation & { accessToken: string }>> {
        return instance.post(API_ROUTE.LOGIN, payload);
    }

    public static loginGoogle(email: string, avatar: string): Promise<IResponseAdvance<IUserInformation & { accessToken: string }>> {
        return instance.post(`${API_ROUTE.LOGIN}/google`, { email, avatar });
    }

    public static forgotPasswordRequest(email: string): Promise<IResponseBase> {
        return instance.post(API_ROUTE.FORGOT_PASSWORD, { email });
    }

    public static verifyRecoveryPasswordToken(email: string, token: string): Promise<IResponseBase> {
        return instance.get(`${API_ROUTE.FORGOT_PASSWORD}/validate?token=${token}&email=${email}`);
    }

    public static resetPasswordByRPToken(email: string, password: string): Promise<IResponseBase> {
        return instance.put(`${API_ROUTE.FORGOT_PASSWORD}/reset`, { email, password });
    }

    public static refreshToken(): Promise<any> {
        return instance.get(API_ROUTE.REFRESH_TOKEN);
    }

    public static logoutUser(): Promise<IResponseBase> {
        return instance.post(API_ROUTE.LOGOUT);
    }

    public static verifyToken(): Promise<IResponseBase> {
        return instance.get(API_ROUTE.VERIFY_TOKEN);
    }
}

export { AuthService };
