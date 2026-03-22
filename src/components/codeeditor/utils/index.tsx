/** @format */

import { IFrameworkOptionProps } from "@/components/exportmodal";
import { convertToLit, convertToReact, convertToSvelte, convertToVue } from "@/utils";
import { FaCss3, FaHtml5 } from "react-icons/fa";
import { SiTailwindcss } from "react-icons/si";

const exportFramework: IFrameworkOptionProps[] = [
    {
        id: "React",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="sm:w-5 sm:h-5">
                <circle cx="12" cy="12" r="2.5" fill="#61DAFB" />
                <ellipse cx="12" cy="12" rx="10" ry="4.5" stroke="#61DAFB" strokeWidth="1.8" fill="none" />
                <ellipse cx="12" cy="12" rx="10" ry="4.5" stroke="#61DAFB" strokeWidth="1.8" fill="none" transform="rotate(60 12 12)" />
                <ellipse cx="12" cy="12" rx="10" ry="4.5" stroke="#61DAFB" strokeWidth="1.8" fill="none" transform="rotate(120 12 12)" />
            </svg>
        ),
        note: (
            <p className="text-xs sm:text-sm text-white/55 leading-relaxed">
                If you have a separate CSS file, place the styles in <code className="text-white/80 bg-white/10 px-1 sm:px-1.5 py-0.5 rounded text-xs">Component.css</code> and import it as shown.
                Otherwise the CSS block is included as a comment at the bottom.
            </p>
        ),
        convert: convertToReact,
    },
    {
        id: "Vue",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="sm:w-5 sm:h-5">
                <path d="M2 6l10 10L22 6" stroke="#42B883" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 6l6 6 6-6" stroke="#35495E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        note: (
            <p className="text-xs sm:text-sm text-white/55 leading-relaxed">
                Styles are scoped to this component via <code className="text-white/80 bg-white/10 px-1 sm:px-1.5 py-0.5 rounded text-xs">&lt;style scoped&gt;</code>. Place this in a{" "}
                <code className="text-white/80 bg-white/10 px-1 sm:px-1.5 py-0.5 rounded text-xs">.vue</code> single-file component.
            </p>
        ),
        convert: convertToVue,
    },
    {
        id: "Svelte",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="sm:w-5 sm:h-5">
                <path d="M18.7 3.1C16.8 1.5 13.8 1.8 12 3.6L4.5 12c-1.8 2-1.4 5 .5 6.6 1.8 1.5 4.8 1.2 6.6-.6l7.5-8.3c1.7-1.9 1.4-4.8-.4-6.6z" fill="#FF3E00" />
                <path d="M13.5 11.5c-.4-.3-1-.2-1.3.2l-3.5 4.6c-.3.4-.2.9.2 1.2.4.3 1 .2 1.3-.2l3.5-4.6c.3-.4.2-1-.2-1.2z" fill="white" />
            </svg>
        ),
        note: (
            <p className="text-xs sm:text-sm text-white/55 leading-relaxed">
                Styles are automatically scoped in Svelte. Place this in a <code className="text-white/80 bg-white/10 px-1 sm:px-1.5 py-0.5 rounded text-xs">.svelte</code> file.
            </p>
        ),
        convert: convertToSvelte,
    },
    {
        id: "Lit",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="sm:w-5 sm:h-5">
                <path d="M12 2C8 2 5 5 5 9c0 2 .8 3.5 2 4.5V18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2v-4.5c1.2-1 2-2.5 2-4.5 0-4-3-7-7-7z" fill="#FFC107" />
                <path d="M12 6c-1.5 0-3 1.2-3 3 0 .8.3 1.5.8 2V14h4.4v-3.2c.5-.5.8-1.2.8-2 0-1.8-1.5-3-3-3z" fill="#1565C0" />
            </svg>
        ),
        note: (
            <p className="text-xs sm:text-sm text-white/55 leading-relaxed">
                Install with <code className="text-white/80 bg-white/10 px-1 sm:px-1.5 py-0.5 rounded text-xs">npm i lit</code> or{" "}
                <code className="text-white/80 bg-white/10 px-1 sm:px-1.5 py-0.5 rounded text-xs">yarn add lit</code>. Styles are encapsulated via Shadow DOM.
            </p>
        ),
        convert: convertToLit,
    },
];

const cssTabTech = [
    {
        id: "html" as const,
        label: (
            <span className="flex gap-1 items-center font-bold text-base">
                <FaHtml5 fontSize={24} color={"#e74d4d"} />
                HTML
            </span>
        ),
        color: "#e74d4d",
    },
    {
        id: "css" as const,
        label: (
            <span className="flex gap-1 items-center font-bold text-base">
                <FaCss3 fontSize={24} color={"#3b82f6"} />
                CSS
            </span>
        ),
        color: "#3b82f6",
    },
];

const tailwindTabTech = [
    {
        id: "html" as const,
        label: (
            <span className="flex gap-1.5 items-center font-bold text-base">
                <FaHtml5 fontSize={24} color={"#e74d4d"} />
                HTML +
                <SiTailwindcss fontSize={24} color={"#38bdf8"} />
                TailwindCSS
            </span>
        ),
        color: "#ef4444",
    },
];

export { exportFramework, cssTabTech, tailwindTabTech };
