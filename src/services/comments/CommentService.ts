/** @format */

import { instance } from "@/configs";
import { API_ROUTE } from "@/constants";
import { IAddCommentPayload, IComment, ICommentListResult, IResponseAdvance, IResponseBase, IVoteCommentPayload, IVoteCommentResult } from "@/types";

class CommentService {
    public static getComments(componentId: string, requesterId?: string): Promise<IResponseAdvance<ICommentListResult>> {
        let queryString = "";
        if (requesterId) {
            queryString = `?userId=${requesterId}`;
        }
        return instance.get(`${API_ROUTE.COMMENTS}/${componentId}${queryString}`);
    }

    public static addComment(payload: IAddCommentPayload): Promise<IResponseAdvance<IComment>> {
        return instance.post(API_ROUTE.COMMENTS, payload);
    }
    public static voteComment(commentId: string, payload: IVoteCommentPayload): Promise<IResponseAdvance<IVoteCommentResult>> {
        return instance.post(`${API_ROUTE.COMMENTS}/${commentId}/vote`, payload);
    }
    public static deleteComment(commentId: string): Promise<IResponseBase> {
        return instance.delete(`${API_ROUTE.COMMENTS}/${commentId}`);
    }
}

export { CommentService };
