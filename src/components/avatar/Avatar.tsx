/** @format */

import React from "react";

export type IAvatarProps = {
    src?: string;
    username: string;
    size?: number;
};

const Avatar: React.FunctionComponent<IAvatarProps> = (props) => {
    const { src, username, size = 36 } = props;
    const initials = username.slice(0, 2).toUpperCase();
    return src ? (
        <img src={src} alt={username} style={{ width: size, height: size }} className="rounded-full object-cover shrink-0 ring-1 ring-white/10" />
    ) : (
        <div style={{ width: size, height: size }} className="rounded-full shrink-0 flex items-center justify-center text-xs font-semibold bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/30">
            {initials}
        </div>
    );
};

export { Avatar };
