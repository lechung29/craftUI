/** @format */

import { cx } from "@/utils";
import { Check, Copy, X } from "lucide-react";
import React from "react";

export interface IFrameworkOptionProps {
    id: string;
    icon: React.ReactNode;
    note: React.ReactNode | null;
    convert: (html: string, css: string) => string;
}

export interface IExportModalProps {
    framework: IFrameworkOptionProps;
    code: string;
    onClose: () => void;
}

const ExportModal: React.FunctionComponent<IExportModalProps> = (props) => {
    const { framework, code, onClose } = props;
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const lines = code.split("\n");

    if (!framework) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-4" style={{ background: "rgba(0,0,0,0.62)" }} onClick={onClose}>
            <div className="relative w-full rounded-lg sm:rounded-xl overflow-hidden shadow-2xl bg-[#16161a] max-w-[720px] max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-3 sm:px-4 md:px-5 pt-3 sm:pt-4 md:pt-5 pb-2 sm:pb-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                        {framework.icon}
                        <h2 className="text-base sm:text-lg font-semibold text-white">{framework.id}</h2>
                    </div>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors p-1">
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>
                {framework.note && <div className="px-3 sm:px-4 md:px-5 pb-3 sm:pb-4">{framework.note}</div>}
                <div className="mx-3 sm:mx-4 md:mx-5 mb-3 sm:mb-4 md:mb-5 rounded-lg overflow-hidden relative bg-[#1e1e2e]">
                    <button
                        onClick={handleCopy}
                        className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs font-medium text-white/80 hover:text-white transition-colors"
                        style={{ background: "rgba(255,255,255,0.1)" }}
                    >
                        {copied ? <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-400" /> : <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                        {copied ? "Copied!" : "Copy"}
                    </button>
                    <div className="overflow-auto max-h-64 sm:max-h-80 md:max-h-96 p-3 pl-0">
                        <table className={cx("w-full leading-[1.6] border-collapse font-mono", window.innerWidth < 640 ? "text-[11px]" : "text-[13px]")}>
                            <tbody>
                                {lines.map((line, index) => (
                                    <tr key={index}>
                                        <td className="text-right pr-2 sm:pr-3 md:pr-4 text-white/25 w-7 min-w-7 select-none">{index + 1}</td>
                                        <td className="text-white/85 whitespace-pre">{line || " "}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { ExportModal };
