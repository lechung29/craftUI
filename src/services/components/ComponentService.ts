/** @format */

import { instance } from "@/configs";
import { API_ROUTE } from "@/constants";
import { ICreatorInfo } from "@/types";
import {
    ComponentStatus,
    ComponentStyle,
    ComponentType,
    IComponent,
    IComponentListResult,
    ICountPointInfo,
    ICreateComponentPayload,
    ISaveAsFavoriteData,
    IStatsInfo,
    ISubmitComponentResult,
    ITagListDataInfo,
} from "@/types/components";
import { IResponseAdvance, IResponseBase } from "@/types/requestbase";

class ComponentService {
    public static submitNewComponent(payload: ICreateComponentPayload): Promise<IResponseAdvance<ISubmitComponentResult>> {
        return instance.post(API_ROUTE.COMPONENTS, payload);
    }
    public static getComponentById(componentId: string, requesterId?: string): Promise<IResponseAdvance<IComponent>> {
        let queryString = "";
        if (requesterId) {
            queryString = queryString + `?requesterId=${requesterId}`;
        }
        return instance.get(`${API_ROUTE.COMPONENTS}/${componentId}${queryString}`);
    }

    public static getComponentList(
        type: ComponentType | undefined,
        style: ComponentStyle | undefined,
        page: number = 1,
        limit: number = 12,
        searchKey?: string,
    ): Promise<IResponseAdvance<IComponentListResult>> {
        return instance.get(`${API_ROUTE.COMPONENTS}/list?page=${page}&limit=${limit}&search=${searchKey}&type=${type}&style=${style}`);
    }

    public static getLatestComponents(): Promise<IResponseAdvance<IComponent[]>> {
        return instance.get(`${API_ROUTE.COMPONENTS}/latest`);
    }

    public static saveAsFavorite(componentId: string): Promise<IResponseAdvance<ISaveAsFavoriteData>> {
        return instance.post(`${API_ROUTE.COMPONENTS}/${componentId}/favorite`);
    }

    public static getUserFavoriteComponents(userId: string, page: number = 1, limit: number = 12): Promise<IResponseAdvance<IComponentListResult>> {
        return instance.get(`${API_ROUTE.COMPONENTS}/${userId}/favorite?page=${page}&limit=${limit}`);
    }

    public static getStatsInfo(): Promise<IResponseAdvance<IStatsInfo>> {
        return instance.get(`${API_ROUTE.COMPONENTS}/stats`);
    }

    public static getAllTags(): Promise<IResponseAdvance<ITagListDataInfo>> {
        return instance.get(`${API_ROUTE.COMPONENTS}/tags`);
    }

    public static getTopCreators(): Promise<IResponseAdvance<ICreatorInfo[]>> {
        return instance.get(`${API_ROUTE.COMPONENTS}/top-creators`);
    }

    public static getUserComponentList(
        userId: string | undefined,
        status: ComponentStatus,
        type: ComponentType | undefined,
        sort = "default",
        page: number = 1,
        limit: number = 12,
    ): Promise<IResponseAdvance<IComponentListResult>> {
        return instance.get(`${API_ROUTE.COMPONENTS}/my-components?userId=${userId}&status=${status}&type=${type}&sort=${sort}&page=${page}&limit=${limit}`);
    }

    public static deleteComponent(id: string): Promise<IResponseBase> {
        return instance.delete(`${API_ROUTE.COMPONENTS}/${id}`);
    }

    public static getUserComponentCount(id: string | undefined): Promise<IResponseAdvance<ICountPointInfo>> {
        return instance.get(`${API_ROUTE.COMPONENTS}/published/count?userId=${id}`);
    }

    public static getWeeklyComponentCount(): Promise<IResponseAdvance<number>> {
        return instance.get(`${API_ROUTE.COMPONENTS}/weekly/count`);
    }

    public static getWeeklyHighlightComponents(): Promise<IResponseAdvance<IComponent[]>> {
        return instance.get(`${API_ROUTE.COMPONENTS}/weekly/highlight`);
    }
}

export { ComponentService };
