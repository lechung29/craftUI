/** @format */

import React, { KeyboardEvent } from "react";
import Editor from "@monaco-editor/react";
import { ArrowLeft, Bookmark, LayoutDashboard, Folder, Rocket, X, Eye } from "lucide-react";
import { DefaultButton, PrimaryButton } from "../button";
import { LivePreview } from "../livepreview";
import { ExportModal, IFrameworkOptionProps } from "../exportmodal";
import { ComponentStyle } from "@/types/components";
import { useCodeEditorStore } from "@/store/codeEditorStore";
import { CreatePopup } from "../createpopup";
import { IUserInformation } from "@/types/auth";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { cssTabTech, exportFramework, tailwindTabTech } from "./utils";
import { useImmerState } from "@/hooks/useImmerState";

export interface ICodeEditorProps {
    onSave: (isDraft: boolean) => Promise<void> | void;
    onSaveAsFavorite?: () => Promise<void> | void;
    mode?: "detail" | "create";
    id?: string;
    componentInfo?: {
        title: string;
        author: IUserInformation;
        views: number;
        saves: number;
        tags?: string[];
    };
    onGoBack?: () => void;
}

type ICodeEditorState = {
    isOpenChangeTypeDialog: boolean;
    isSavedComponent: boolean;
    componentSavedCount: number;
    isOpenExportDropdown: boolean;
    tagInput: string;
};

const CodeEditor: React.FunctionComponent<ICodeEditorProps> = (props) => {
    const { id, mode = "create", componentInfo, onGoBack, onSave, onSaveAsFavorite } = props;
    const { user } = useAuthStore();
    const { htmlCode, cssCode, cssTech, type, editorTab, previewTheme, tags, setTags, setHtmlCode, setCssCode, setPreviewTheme, setEditorTab } = useCodeEditorStore();
    const [state, setState] = useImmerState<ICodeEditorState>({
        isOpenChangeTypeDialog: false,
        isSavedComponent: user?.savedIds?.includes(id!) || false,
        componentSavedCount: componentInfo?.saves || 0,
        isOpenExportDropdown: false,
        tagInput: "",
    });
    const { isOpenChangeTypeDialog, isSavedComponent, componentSavedCount, isOpenExportDropdown, tagInput } = state;
    const [exportModal, setExportModal] = React.useState<IFrameworkOptionProps | null>(null);
    const tagInputRef = React.useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (typeof window !== "undefined" && (window as any).monaco) {
                (window as any).monaco.languages.html?.htmlDefaults?.setOptions({
                    format: { tabSize: 2, insertSpaces: true },
                });
            }
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const bgColor = previewTheme === "dark" ? "#212121" : "#f8f8f8";
    const codeTabs = cssTech === ComponentStyle.Tailwind ? tailwindTabTech : cssTabTech;

    const addTag = (value: string) => {
        const trimmed = value.trim().toLowerCase().replace(/\s+/g, "-");
        if (!trimmed || tags.includes(trimmed) || tags.length >= 8) return;
        setTags([...tags, trimmed]);
        setState({ tagInput: "" });
    };

    const removeTag = (index: number) => {
        const restTags = tags.filter((_, i) => i !== index);
        setTags(restTags);
    };

    const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(tagInput);
        } else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
            removeTag(tags.length - 1);
        }
    };

    return (
        <div className="h-full flex flex-col text-white">
            {mode === "detail" && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-5 py-2 sm:py-3 gap-2 sm:gap-0 shrink-0">
                    <DefaultButton className="gap-1.5 sm:gap-2 text-xs sm:text-sm text-white/60 hover:text-white transition-colors" onClick={onGoBack}>
                        <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Go back
                    </DefaultButton>
                    {componentInfo && (
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 md:gap-3 text-xs text-white/55">
                            <span className="hidden sm:inline text-xs sm:text-sm">{componentInfo?.title || "Component"} by</span>
                            <span className="inline sm:hidden font-medium text-white">{componentInfo?.title || "Component"}</span>
                            <DefaultButton
                                onClick={() => navigate(user?._id === componentInfo.author._id ? "/my-profile" : `/profile/${componentInfo.author._id}`)}
                                className="gap-1.5 sm:gap-2 rounded-md bg-transparent hover:bg-white/15 !px-1.5 !py-[1px] transition-colors"
                            >
                                <img src={componentInfo?.author?.avatar} alt={componentInfo?.author?.username} className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full" />
                                <span className="text-xs sm:text-sm font-medium text-white">{componentInfo?.author?.username}</span>
                            </DefaultButton>
                            <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                                {(componentInfo?.views || 0).toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1">
                                <Bookmark className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                                {componentSavedCount.toLocaleString()}
                            </div>
                        </div>
                    )}
                </div>
            )}
            <div className="flex-1 flex flex-col mx-2 sm:mx-3 md:mx-5 gap-2 sm:gap-3 pb-2 sm:pb-3 md:pb-4 min-h-0">
                <div className="flex-1 rounded-lg sm:rounded-xl overflow-hidden min-h-0">
                    <div className="flex flex-col md:flex-row h-full">
                        <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col relative shrink-0" style={{ background: bgColor }}>
                            <div className="flex items-center justify-end gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 shrink-0 z-10">
                                <span className={`text-xs sm:text-sm ${previewTheme === "dark" ? "text-white" : "text-black/80"}`}>{bgColor.toUpperCase()}</span>
                                <div
                                    className="relative rounded-full cursor-pointer"
                                    style={{ width: 38, height: 20, background: previewTheme === "dark" ? "#3a3a3a" : "#cecece" }}
                                    onClick={() => setPreviewTheme(previewTheme === "dark" ? "light" : "dark")}
                                >
                                    <div className="absolute top-0.5 rounded-full bg-white shadow transition-all" style={{ width: 16, height: 16, left: previewTheme === "dark" ? 2 : 20 }} />
                                </div>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <LivePreview isTailwindStyle={cssTech === ComponentStyle.Tailwind} cssCode={cssCode} htmlCode={htmlCode} theme={previewTheme} backgroundColor={bgColor} autoScale />
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 flex-1 flex flex-col" style={{ background: "#212121" }}>
                            <div className="flex items-center gap-2 sm:gap-3 md:gap-5 px-2 sm:px-3 md:px-4 pt-2 sm:pt-3 pb-1.5 sm:pb-2 shrink-0">
                                {codeTabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setEditorTab(tab.id)}
                                        className="relative flex items-center gap-1 sm:gap-1.5 md:gap-2 text-xs sm:text-sm font-medium transition-colors pb-1.5 sm:pb-2"
                                        style={{ color: editorTab === tab.id ? "#e5e7eb" : "#999999" }}
                                    >
                                        {tab.label}
                                        {codeTabs.length > 1 && editorTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: tab.color }} />}
                                    </button>
                                ))}
                            </div>
                            <div className="flex-1 overflow-hidden" style={{ display: editorTab === "html" ? "block" : "none" }}>
                                <Editor
                                    height="100%"
                                    theme="vs-dark"
                                    language="html"
                                    value={htmlCode}
                                    onChange={(value) => setHtmlCode(value || "")}
                                    onMount={(editor) => {
                                        editor.onDidChangeModelContent((e) => {
                                            for (const change of e.changes) {
                                                if (change.text !== ">") continue;
                                                const position = editor.getPosition();
                                                if (!position) continue;
                                                const model = editor.getModel();
                                                if (!model) continue;
                                                const lineContent = model.getLineContent(position.lineNumber);
                                                const textBeforeCursor = lineContent.substring(0, position.column - 1);
                                                const tagMatch = textBeforeCursor.match(/<(\w+)(?:\s[^>]*)?$/);
                                                if (tagMatch) {
                                                    const tagName = tagMatch[1];
                                                    const selfClosing = ["img", "br", "hr", "input", "meta", "link", "area", "base", "col", "embed", "source", "track", "wbr"];
                                                    if (!selfClosing.includes(tagName.toLowerCase())) {
                                                        editor.executeEdits("auto-close", [
                                                            {
                                                                range: {
                                                                    startLineNumber: position.lineNumber,
                                                                    startColumn: position.column,
                                                                    endLineNumber: position.lineNumber,
                                                                    endColumn: position.column,
                                                                },
                                                                text: `</${tagName}>`,
                                                            },
                                                        ]);
                                                        editor.setPosition({ lineNumber: position.lineNumber, column: position.column });
                                                    }
                                                }
                                            }
                                        });
                                    }}
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: window.innerWidth < 640 ? 11 : window.innerWidth < 768 ? 12 : 14,
                                        wordWrap: "on",
                                        automaticLayout: true,
                                        lineNumbers: "on",
                                        tabSize: 2,
                                        scrollBeyondLastLine: false,
                                        autoClosingBrackets: "always",
                                        autoClosingQuotes: "always",
                                        formatOnPaste: true,
                                        formatOnType: true,
                                    }}
                                />
                            </div>
                            <div className="flex-1 overflow-hidden" style={{ display: editorTab === "css" ? "block" : "none" }}>
                                <Editor
                                    height="100%"
                                    theme="vs-dark"
                                    language="css"
                                    value={cssCode}
                                    onChange={(value) => setCssCode(value || "")}
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: window.innerWidth < 640 ? 11 : window.innerWidth < 768 ? 12 : 14,
                                        wordWrap: "on",
                                        automaticLayout: true,
                                        lineNumbers: "on",
                                        tabSize: 2,
                                        scrollBeyondLastLine: false,
                                        autoClosingBrackets: "always",
                                        autoClosingQuotes: "always",
                                        formatOnPaste: true,
                                        formatOnType: true,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg sm:rounded-xl shrink-0 min-h-[40px]" style={{ background: "#292929" }}>
                    <span className="text-sm text-white/70 shrink-0">Tags</span>
                    <div className="flex flex-wrap items-center gap-1.5 flex-1">
                        {(mode === "detail" ? (componentInfo?.tags ?? []) : tags).map((tag, i) => (
                            <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs text-white/80 bg-white/10">
                                #{tag}
                                {mode === "create" && (
                                    <button onClick={() => removeTag(i)} className="text-white/40 hover:text-white/80 transition-colors">
                                        <X className="w-2.5 h-2.5" />
                                    </button>
                                )}
                            </span>
                        ))}
                        {mode === "create" && tags.length < 8 && (
                            <input
                                ref={tagInputRef}
                                value={tagInput}
                                onChange={(e) => setState({ tagInput: e.target.value })}
                                onKeyDown={handleTagKeyDown}
                                onBlur={() => addTag(tagInput)}
                                placeholder={tags.length === 0 ? "Add tags (Enter or comma to add)..." : ""}
                                className="flex-1 min-w-[140px] bg-transparent text-xs text-white/80 placeholder:text-white/25 outline-none"
                            />
                        )}
                        {mode === "create" && (
                            <span className="ml-auto text-xs text-white/25 shrink-0">
                                {tags.length}/{8}
                            </span>
                        )}
                    </div>
                </div>

                <div
                    className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-1.5 sm:p-2 rounded-lg sm:rounded-xl gap-1.5 sm:gap-0 shrink-0"
                    style={{ background: "#292929" }}
                >
                    {mode === "detail" ? (
                        <div className="flex flex-wrap items-center gap-0.5 sm:gap-1">
                            <button
                                onClick={() => {
                                    onSaveAsFavorite?.();
                                    setState({
                                        isSavedComponent: !isSavedComponent,
                                        componentSavedCount: !isSavedComponent ? componentSavedCount + 1 : componentSavedCount - 1,
                                    });
                                }}
                                className="flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white/70 hover:text-white hover:bg-[#171717] transition-colors rounded-md"
                            >
                                <Bookmark className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" fill={isSavedComponent ? "currentColor" : "none"} />
                                <span className="hidden sm:inline">Save to favorites</span>
                                <span className="sm:hidden">Save</span>
                            </button>
                            <div className="relative">
                                <button
                                    onClick={() => setState({ isOpenExportDropdown: !isOpenExportDropdown })}
                                    className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white/70 hover:text-white hover:bg-[#171717] transition-colors rounded-md"
                                >
                                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
                                        <polyline points="7 10 12 15 17 10" strokeLinecap="round" strokeLinejoin="round" />
                                        <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round" />
                                    </svg>
                                    Export
                                    <svg
                                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white/40 transition-transform"
                                        style={{ transform: isOpenExportDropdown ? "rotate(180deg)" : "rotate(0deg)" }}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                            fillRule="evenodd"
                                        />
                                    </svg>
                                </button>

                                {isOpenExportDropdown && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setState({ isOpenExportDropdown: false })} />
                                        <div
                                            className="absolute bottom-8 left-0 mb-2 rounded-md shadow-2xl overflow-hidden z-50 py-1 sm:py-1.5 px-0.5 border border-white/10"
                                            style={{ background: "#141414", minWidth: 140 }}
                                        >
                                            {exportFramework.map((framework) => (
                                                <button
                                                    key={framework.id}
                                                    onClick={() => {
                                                        setState({ isOpenExportDropdown: !isOpenExportDropdown });
                                                        setExportModal(framework);
                                                    }}
                                                    className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-white/75 hover:text-white hover:bg-white/10 transition-colors text-left rounded-md"
                                                >
                                                    {framework.icon}
                                                    <span className="font-medium">{framework.id}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-wrap items-center justify-between gap-0.5 sm:gap-1 w-full">
                            <button
                                className="flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white/70 hover:text-white hover:bg-[#171717] transition-colors rounded-md"
                                onClick={() => setState({ isOpenChangeTypeDialog: true })}
                            >
                                <LayoutDashboard className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" fill={isSavedComponent ? "currentColor" : "none"} />
                                <span className="hidden sm:inline">Change type</span>
                            </button>
                            <div className="inline-flex items-center gap-2">
                                <button
                                    onClick={() => onSave(true)}
                                    className="flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white/70 hover:text-white hover:bg-[#171717] transition-colors rounded-md"
                                >
                                    <Folder className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" fill={isSavedComponent ? "currentColor" : "none"} />
                                    <span className="hidden sm:inline">Save as draft</span>
                                </button>
                                <PrimaryButton className="!min-h-9" onClick={() => onSave(false)}>
                                    <Rocket className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" fill={isSavedComponent ? "currentColor" : "none"} />
                                    <span className="hidden sm:inline">Submit</span>
                                </PrimaryButton>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {isOpenChangeTypeDialog && <CreatePopup isOpen={isOpenChangeTypeDialog} onClose={() => setState({ isOpenChangeTypeDialog: false })} tech={cssTech} type={type} />}
            {exportModal && <ExportModal framework={exportModal} code={exportModal.convert(htmlCode, cssCode)} onClose={() => setExportModal(null)} />}
        </div>
    );
};

export { CodeEditor };
