/** @format */

export interface ICommentAuthor {
    _id: string;
    username: string;
    avatar?: string;
}

export interface IComment {
    _id: string;
    componentId: string;
    authorId: ICommentAuthor;
    content: string;
    parentId?: string | null;
    votes: number;
    userVote?: 1 | -1 | null;
    isDeleted: boolean;
    replies?: IComment[];
    createdAt: string;
    updatedAt: string;
}

export interface ICommentListResult {
    comments: IComment[];
    total: number;
}

export interface IAddCommentPayload {
    componentId: string;
    content: string;
    parentId?: string;
}

export interface IVoteCommentPayload {
    value: 1 | -1;
}

export interface IVoteCommentResult {
    votes: number;
}
