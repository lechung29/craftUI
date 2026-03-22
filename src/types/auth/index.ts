/** @format */

export enum IUserStatus {
    Activated = 1,
    Deleted,
}

export interface IRegisterPayload {
    username: string;
    email: string;
    password: string;
}

export type ILoginPayload = Pick<IRegisterPayload, "email" | "password">;

export interface IUserSettings {
    isReceiveEmailNotification?: boolean;
}

export interface IUserInformation {
    _id: string;
    username: string;
    email: string;
    password: string;
    avatar: string;
    thumbnail?: string;
    location?: string;
    company?: string;
    twitter?: string;
    websiteURL?: string;
    biography?: string;
    settings: IUserSettings;
    savedIds: string[];
    createdAt?: string;
    updatedAt?: string;
    status: IUserStatus;
    points: number;
}
export interface ICreatorInfo {
    _id: string;
    username: string;
    avatar: string;
    points: number;
}

export interface ITopCreatorListInfo extends Omit<IUserInformation, "password"> {
    postCount: number;
    totalSaves: number;
    totalViews: number;
}

export interface IFavoriteTrendItem {
    date: string;
    favorites: number;
}

export interface IUserStats {
    totalPosts: number;
    totalFavorites: number;
    score: number;
    favoriteTrend: IFavoriteTrendItem[];
}
