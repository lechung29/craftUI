/** @format */

import { IUserInformation } from "../auth";

export enum ComponentType {
    Button = 1,
    Switch,
    Checkbox,
    Card,
    Loader,
    Input,
    Form,
    Radio,
    Tooltip,
}

export enum ComponentStyle {
    CSS = "css",
    Tailwind = "tailwind",
}

export enum ComponentStatus {
    Draft = 1,
    Published,
}

export interface IComponentCode {
    html: string;
    css: string;
}

export interface IComponentBase {
    type: ComponentType;
    style: ComponentStyle;
    code: IComponentCode;
    tags?: string[];
    thumbnail?: string;
}

export interface IComponent extends IComponentBase {
    _id: string;
    authorId: IUserInformation;
    status: ComponentStatus;
    views: number;
    saves: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateComponentPayload {
    componentId?: string;
    type: ComponentType;
    style: ComponentStyle;
    html: string;
    css: string;
    isDraft: boolean;
    tags: string[];
}

export interface ISaveAsFavoriteData {
    isFavorite: boolean;
    savedIds: string[];
}

export interface IPaginationInfo {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface IComponentListResult {
    components: IComponent[];
    pagination: IPaginationInfo;
}

export interface ISubmitComponentResult {
    requesterPoint: number;
}

export interface IStatsInfo {
    elementsCount: number;
    contributorsCount: number;
}

export interface ITagListDataInfo {
    tags: string[];
    highlightTags: string[];
}

export interface ICountPointInfo {
    count: number;
    points: number;
}
