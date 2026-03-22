/** @format */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CornerDownRight, Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cx, formatDate, showError } from "@/utils";
import { Avatar } from "../avatar";
import { VoteBlock } from "../voteblock";
import { useNavigate } from "react-router-dom";
import { LoadingDots } from "../loading";
import { ConfirmDialog } from "../confirmdialog";
import { PrimaryButton } from "../button";

export interface ICommentInfo {
    _id: string;
    authorId: {
        _id: string;
        username: string;
        avatar?: string;
    };
    content: string;
    votes: number;
    userVote?: 1 | -1 | null;
    createdAt: string;
    replies?: ICommentInfo[];
}

export interface CommentSectionProps {
    componentId: string;
    comments: ICommentInfo[];
    totalCount: number;
    onAddComment: (content: string, parentId?: string) => Promise<void>;
    onVote: (commentId: string, value: 1 | -1) => Promise<void>;
    onDelete: (commentId: string) => Promise<void>;
}

export type ICommentItemProps = {
    comment: ICommentInfo;
    isReply?: boolean;
    onVote: (commentId: string, value: 1 | -1) => Promise<void>;
    onReply: (parentId: string, username: string) => void;
    onDelete: (commentId: string) => Promise<void>;
    isLoggedIn: boolean;
    currentUserId?: string;
};

const CommentItem: React.FunctionComponent<ICommentItemProps> = (props) => {
    const { comment, isReply = false, isLoggedIn, currentUserId, onVote, onReply, onDelete } = props;
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [showConfirm, setShowConfirm] = React.useState(false);
    const isOwner = !!currentUserId && currentUserId === comment.authorId._id;

    const handleDeleteConfirm = async () => {
        try {
            setIsDeleting(true);
            await onDelete(comment._id);
        } finally {
            setIsDeleting(false);
            setShowConfirm(false);
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className={cx(
                    "flex gap-3 p-4 rounded-xl",
                    isReply ? "bg-white/[0.03] border border-white/[0.06]" : "bg-white/[0.04] border border-white/[0.07]",
                    isDeleting && "opacity-50 pointer-events-none",
                )}
            >
                <VoteBlock votes={comment.votes} userVote={comment.userVote} onVote={(v) => onVote(comment._id, v)} />

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <Avatar src={comment.authorId.avatar} username={comment.authorId.username} size={28} />
                        <span className="text-sm font-semibold text-white/90">{comment.authorId.username}</span>
                        <span className="text-xs text-white/30">{formatDate(comment.createdAt)}</span>

                        <div className="ml-auto flex items-center gap-2">
                            {isLoggedIn && !isReply && (
                                <button
                                    onClick={() => onReply(comment._id, comment.authorId.username)}
                                    className="flex items-center gap-1 text-xs text-white/30 hover:text-indigo-400 transition-colors"
                                >
                                    <CornerDownRight size={12} />
                                    Reply
                                </button>
                            )}

                            {isOwner && (
                                <button onClick={() => setShowConfirm(true)} className="flex items-center gap-1 text-xs text-white/25 hover:text-rose-400 transition-colors">
                                    <Trash2 size={12} />
                                </button>
                            )}
                        </div>
                    </div>
                    <p className="text-sm text-white/65 leading-relaxed break-words">{comment.content}</p>
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-3 flex flex-col gap-2 pl-1 border-l-2 border-white/[0.07]">
                            {comment.replies.map((reply) => (
                                <div key={reply._id} className="pl-3">
                                    <CommentItem comment={reply} isReply onVote={onVote} onReply={onReply} onDelete={onDelete} isLoggedIn={isLoggedIn} currentUserId={currentUserId} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
            <ConfirmDialog
                isOpen={showConfirm}
                title="Delete comment?"
                description="This comment will be permanently removed and cannot be recovered."
                confirmLabel="Delete"
                variant="danger"
                isLoading={isDeleting}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setShowConfirm(false)}
            />
        </>
    );
};

const CommentSection: React.FC<CommentSectionProps> = (props) => {
    const { comments, totalCount, onAddComment, onVote, onDelete } = props;
    const { user } = useAuthStore();
    const [text, setText] = React.useState("");
    const [replyTo, setReplyTo] = React.useState<{ id: string; username: string } | null>(null);
    const [isSending, setIsSending] = React.useState(false);
    const inputRef = React.useRef<HTMLTextAreaElement>(null);
    const navigate = useNavigate();

    const handleReply = (parentId: string, username: string) => {
        setReplyTo({ id: parentId, username });
        setText(`@${username} `);
        setTimeout(() => inputRef.current?.focus(), 50);
    };

    const handleCancelReply = () => {
        setReplyTo(null);
        setText("");
    };

    const handleSend = async () => {
        const trimmed = text.trim();
        if (!trimmed) return;
        if (!user) {
            showError("Please log in to comment.");
            return;
        }
        try {
            setIsSending(true);
            await onAddComment(trimmed, replyTo?.id);
            setText("");
            setReplyTo(null);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="w-full mt-6 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white/80">
                    Comments
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-white/[0.06] text-white/40 text-xs font-normal">{totalCount}</span>
                </h3>
                {!user && (
                    <span className="text-xs text-white/35">
                        <span onClick={() => navigate("/auth")} className="text-indigo-400 font-medium cursor-pointer hover:text-indigo-300">
                            Log in
                        </span>{" "}
                        to add comments
                    </span>
                )}
            </div>
            <div className="rounded-xl bg-white/[0.04] border border-white/[0.08] overflow-hidden">
                <AnimatePresence>
                    {replyTo && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="flex items-center justify-between px-4 pt-2.5 pb-0"
                        >
                            <span className="text-xs text-indigo-400 flex items-center gap-1">
                                <CornerDownRight size={11} />
                                Replying to <strong>@{replyTo.username}</strong>
                            </span>
                            <button onClick={handleCancelReply} className="text-xs text-white/30 hover:text-white/60 transition-colors">
                                Cancel
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-end gap-3 p-3">
                    {user && <Avatar src={user.avatar} username={user.username} size={32} />}
                    <textarea
                        ref={inputRef}
                        rows={1}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={!user}
                        placeholder="Add a comment… (Enter to send)"
                        className={cx(
                            "flex-1 resize-none bg-transparent text-sm text-white/80 placeholder:text-white/25",
                            "outline-none border-none min-h-[36px] max-h-[120px] py-2 leading-relaxed",
                            !user && "cursor-not-allowed opacity-40",
                        )}
                        style={{ fieldSizing: "content" } as React.CSSProperties}
                    />
                    <PrimaryButton
                        onClick={handleSend}
                        disabled={!user || !text.trim() || isSending}
                    >
                        {isSending ? <LoadingDots /> : "Send"}
                    </PrimaryButton>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <AnimatePresence initial={false}>
                    {comments.length === 0 ? (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-sm text-white/25 py-8">
                            No comments yet. Be the first!
                        </motion.p>
                    ) : (
                        comments.map((c) => <CommentItem key={c._id} comment={c} onVote={onVote} onReply={handleReply} onDelete={onDelete} isLoggedIn={!!user} currentUserId={user?._id} />)
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export { CommentSection };
