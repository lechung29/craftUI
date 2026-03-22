/** @format */

import { cx } from "@/utils";
import { Minus, Plus } from "lucide-react";
import React from "react";

export type IVoteBlock = {
    votes: number;
    userVote?: 1 | -1 | null;
    onVote: (value: 1 | -1) => void;
};

const VoteBlock: React.FunctionComponent<IVoteBlock> = (props) => {
    const { votes, userVote, onVote } = props;
    return (
        <div className="flex flex-col items-center gap-0.5 select-none">
            <button
                onClick={() => onVote(1)}
                className={cx("w-6 h-6 flex items-center justify-center rounded text-sm transition-colors", userVote === 1 ? "text-indigo-400" : "text-white/30 hover:text-white/60")}
            >
                <Plus />
            </button>
            <span className={cx("text-xs font-medium tabular-nums", votes > 0 ? "text-indigo-400" : "text-white/40")}>{votes}</span>
            <button
                onClick={() => onVote(-1)}
                className={cx("w-6 h-6 flex items-center justify-center rounded text-sm transition-colors", userVote === -1 ? "text-rose-400" : "text-white/30 hover:text-white/60")}
            >
                <Minus />
            </button>
        </div>
    );
};

export { VoteBlock };
