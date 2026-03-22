/** @format */

import React from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { CodeEditor, CodeEditorSkeleton, ComponentNotFound } from "@/components";
import { useCodeEditorStore, useAuthStore } from "@/store";
import { ComponentStatus, ComponentStyle, ComponentType, IComponent, IResponseStatus, IComment } from "@/types";
import { ComponentService, CommentService } from "@/services";
import { isEnumValue, isSessionExpired, showError, showSuccess } from "@/utils";
import { CommentSection } from "@/components";

const CreateComponentPage: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isCreate = location.pathname === "/create";
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const typeParam = searchParams.get("type");
    const techParam = searchParams.get("tech");
    const { tags, submitNewComponent, setInfo, resetCode, initializeCode, saveAsFavorite, setTags } = useCodeEditorStore();
    const { user } = useAuthStore();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [componentInfo, setComponentInfo] = React.useState<IComponent | null>(null);
    const [notFound, setNotFound] = React.useState<boolean>(false);
    const [comments, setComments] = React.useState<IComment[]>([]);
    const [commentCount, setCommentCount] = React.useState<number>(0);

    const onSaveNewComponent = (isDraft: boolean) => {
        if (tags.length === 0) {
            showError("Please add at least 1 tag")
            return Promise.resolve()
        }
        return submitNewComponent(isDraft ? ComponentStatus.Draft : ComponentStatus.Published, componentInfo ? componentInfo?._id : undefined, () => {
            setTimeout(() => navigate("/"), 1000);
        });
    };

    const onSaveAsFavorite = () => saveAsFavorite(id!);

    const isDraftMode = React.useMemo(() => {
        return componentInfo?.status === ComponentStatus.Draft && user?._id === componentInfo.authorId._id;
    }, [componentInfo, user]);

    const isCreateMode = isCreate || isDraftMode;

    const handleAddComment = async (content: string, parentId?: string) => {
        if (!id) return;
        try {
            const res = await CommentService.addComment({ componentId: id, content, parentId });
            let newComment: IComment | null = null;
            if (res.status === IResponseStatus.Success) {
                showSuccess(res.message!);
                newComment = res.data!;
            } else {
                throw new Error(res.message);
            }

            if (newComment) {
                if (parentId) {
                    setComments((prev) => prev.map((c) => (c._id === parentId ? { ...c, replies: [...(c.replies || []), newComment] } : c)));
                } else {
                    setComments((prev) => [newComment, ...prev]);
                    setCommentCount((n) => n + 1);
                }
            }
        } catch (err: any) {
            console.log(err);
            if (isSessionExpired(err)) return;
            showError(err?.message || "Failed to post comment.");
        }
    };

    const handleVote = async (commentId: string, value: 1 | -1) => {
        try {
            await CommentService.voteComment(commentId, { value });
            const updateVote = (list: IComment[]): IComment[] =>
                list.map((c) => {
                    if (c._id === commentId) {
                        const prev = c.userVote ?? 0;
                        const delta = prev === value ? -value : value - prev;
                        return {
                            ...c,
                            votes: c.votes + delta,
                            userVote: prev === value ? null : value,
                        };
                    }
                    if (c.replies?.length) return { ...c, replies: updateVote(c.replies) };
                    return c;
                });

            setComments((prev) => updateVote(prev));
        } catch (err: any) {
            if (isSessionExpired(err)) return;
            showError(err?.message || "Failed to vote.");
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            await CommentService.deleteComment(commentId);
            const removeComment = (list: IComment[]): IComment[] =>
                list
                    .filter((c) => c._id !== commentId)
                    .map((c) => ({
                        ...c,
                        replies: c.replies ? removeComment(c.replies) : [],
                    }));

            setComments((prev) => removeComment(prev));
            setCommentCount((n) => Math.max(0, n - 1));
        } catch (err: any) {
            if (isSessionExpired(err)) return;
            showError(err?.message || "Failed to delete comment.");
        }
    };

    React.useEffect(() => {
        const getComponentInfo = async () => {
            try {
                setIsLoading(true);
                setNotFound(false);
                const res = await ComponentService.getComponentById(id || "", user ? user._id : undefined);
                if (res?.status !== IResponseStatus.Success) {
                    throw new Error(res?.message || "Component not found");
                }
                showSuccess(res?.message!);
                setInfo(res.data?.code.html!, res.data?.code.css!, res.data?.style!, res.data?.type!);
                setTags(res.data?.tags || []);
                setComponentInfo(res.data || null);
            } catch (error: any) {
                if (isSessionExpired(error)) return;
                showError(error?.message || "Component not found");
                resetCode();
                setComponentInfo(null);
                setNotFound(true);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) getComponentInfo();
    }, [id]);

    React.useEffect(() => {
        const getComments = async () => {
            if (!id) return;
            try {
                const res = await CommentService.getComments(id, user?._id);
                if (res?.status === IResponseStatus.Success) {
                    setComments(res.data?.comments || []);
                    setCommentCount(res.data?.total || 0);
                }
            } catch {
                setComments([]);
                setCommentCount(0);
            }
        };

        if (id && !isCreate) getComments();
    }, [id, isCreate]);

    React.useEffect(() => {
        if (isCreate && (!techParam || !typeParam)) {
            let tech = techParam as ComponentStyle;
            let type = Number(typeParam) as ComponentType;
            if (!techParam || !isEnumValue(ComponentStyle, tech)) tech = ComponentStyle.CSS;
            if (!typeParam || !isEnumValue(ComponentType, type)) type = ComponentType.Button;
            setSearchParams({ type: ComponentType[type], tech });
            initializeCode(tech, type);
        }
    }, [techParam, typeParam, isCreate]);

    React.useEffect(() => {
        return () => resetCode();
    }, []);

    return (
        <div className="w-full shrink-0">
            <div className="md:h-[520px] h-[640px]">
                {isLoading ? (
                    <CodeEditorSkeleton />
                ) : notFound ? (
                    <ComponentNotFound />
                ) : (
                    <CodeEditor
                        onSave={onSaveNewComponent}
                        onSaveAsFavorite={onSaveAsFavorite}
                        mode={isCreateMode ? "create" : "detail"}
                        id={!isCreateMode ? componentInfo?._id : undefined}
                        componentInfo={
                            !isCreateMode && componentInfo
                                ? {
                                      title: ComponentType[componentInfo?.type!] as string,
                                      author: componentInfo?.authorId!,
                                      views: componentInfo.views,
                                      saves: componentInfo.saves,
                                      tags: componentInfo.tags,
                                  }
                                : undefined
                        }
                        onGoBack={() => navigate(-1)}
                    />
                )}
            </div>

            {!isCreateMode && !notFound && !isLoading && (
                <div className="px-1 pb-8">
                    <CommentSection componentId={id!} comments={comments} totalCount={commentCount} onAddComment={handleAddComment} onVote={handleVote} onDelete={handleDeleteComment} />
                </div>
            )}
        </div>
    );
};

export { CreateComponentPage };
