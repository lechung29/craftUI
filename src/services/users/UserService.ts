/** @format */

import { instance } from "@/configs";
import { API_ROUTE } from "@/constants";
import { ITopCreatorListInfo, IUserInformation, IUserStats } from "@/types/auth";
import { IResponseAdvance, IResponseBase } from "@/types/requestbase";

class UserService {
    public static updateUser(payload: Partial<IUserInformation>): Promise<IResponseBase> {
        const { _id, ...rest } = payload;
        return instance.patch(`${API_ROUTE.USER_INFO}/${_id}`, rest);
    }

    public static deleteUser(id: string): Promise<IResponseBase> {
        return instance.delete(`${API_ROUTE.USER_INFO}/${id}`);
    }

    public static getUserById(id: string): Promise<IResponseAdvance<IUserInformation>> {
        return instance.get(`${API_ROUTE.USER_INFO}/${id}`);
    }

    public static updateEmailSetting(id: string, email: string, isReceiveEmailNotification: boolean): Promise<IResponseBase> {
        return instance.patch(`${API_ROUTE.USER_INFO}/${id}/settings/email`, { email, isReceiveEmailNotification });
    }

    public static getTopUsers(): Promise<IResponseAdvance<ITopCreatorListInfo[]>> {
        return instance.get(`${API_ROUTE.USER_INFO}/top-creators`);
    }

    public static getUserStats(): Promise<IResponseAdvance<IUserStats>> {
        return instance.get(`${API_ROUTE.USER_INFO}/stats`);
    }
}

export { UserService };
