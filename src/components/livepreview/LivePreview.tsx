/** @format */

import React from "react";

export interface ILivePreviewProps {
    htmlCode: string;
    cssCode: string;
    theme: "light" | "dark";
    backgroundColor?: string;
    isTailwindStyle?: boolean;
    scale?: number;
    className?: string;
    autoScale?: boolean;
}

const preventNavigationScript = `
<script>
    document.addEventListener('click', function(e) {
        const anchor = e.target.closest('a');
        if (anchor) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);

    document.addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();
    }, true);

    try {
        Object.defineProperty(window, 'location', {
            get: function() {
                return {
                    href: '#',
                    assign: function() {},
                    replace: function() {},
                    reload: function() {},
                    hash: '#',
                    host: '',
                    hostname: '',
                    origin: '',
                    pathname: '/',
                    port: '',
                    protocol: 'https:',
                    search: ''
                };
            },
            set: function() {}
        });
    } catch(e) {
        window.location.assign = function() {};
        window.location.replace = function() {};
        window.location.reload = function() {};
    }

    window.open = function() { return null; };
    window.history.pushState = function() {};
    window.history.replaceState = function() {};
<\/script>
`;

const LivePreview: React.FunctionComponent<ILivePreviewProps> = (props) => {
    const { cssCode, htmlCode, theme, backgroundColor, isTailwindStyle = false, scale = 1, className = "", autoScale = false } = props;
    const [srcDoc, setSrcDoc] = React.useState<string>("");

    React.useEffect(() => {
        const content = `
            <!DOCTYPE html>
            <html class="${theme}">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                ${preventNavigationScript}
                ${
                    isTailwindStyle
                        ? `<script src="https://cdn.tailwindcss.com"><\/script>
                    <script>
                        tailwind.config = { darkMode: "class" }
                    <\/script>`
                        : ""
                }
                <style>
                    *,
                    *::before,
                    *::after {
                        box-sizing: border-box;
                    }

                    * {
                        margin: 0;
                    }

                    html,
                    body {
                        height: 100%;
                        ${autoScale ? "overflow: hidden;" : ""}
                    }

                    body {
                        line-height: 1.5;
                        -webkit-font-smoothing: antialiased;
                    }

                    img,
                    picture,
                    video,
                    canvas,
                    svg {
                        display: block;
                        max-width: 100%;
                    }

                    input,
                    button,
                    textarea,
                    select {
                        font: inherit;
                    }
                    body { 
                        ${backgroundColor ? `background: ${backgroundColor} !important;` : ""}
                        color: ${theme === "dark" ? "#FFFFFF" : "#000000"};
                        transition: background .3s; 
                        margin: 0;
                        padding: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        ${!autoScale ? `transform: scale(${scale}); transform-origin: center;` : ""}
                    }
                    ${
                        autoScale
                            ? `
                    /* Auto-scale wrapper */
                    body > * {
                        transform-origin: center center;
                    }
                    `
                            : ""
                    }
                    /* Đảm bảo cursor vẫn pointer cho UX nhưng link không navigate */
                    a[href] {
                        cursor: pointer;
                    }
                    ${cssCode}
                </style>
                ${
                    autoScale
                        ? `
                <script>
                    // Auto-scale content to fit container
                    window.addEventListener('load', function() {
                        setTimeout(function() {
                            const body = document.body;
                            const firstChild = body.firstElementChild;
                            
                            if (!firstChild) return;
                            
                            // Get the actual size of the content
                            const rect = firstChild.getBoundingClientRect();
                            const contentWidth = rect.width;
                            const contentHeight = rect.height;
                            
                            // Get the container size (with padding consideration)
                            const containerWidth = window.innerWidth - 40; // 20px padding on each side
                            const containerHeight = window.innerHeight - 40;
                            
                            // Calculate scale to fit
                            const scaleX = containerWidth / contentWidth;
                            const scaleY = containerHeight / contentHeight;
                            const scale = Math.min(scaleX, scaleY, 1); // Don't scale up, only down
                            
                            // Apply scale if needed
                            if (scale < 1) {
                                firstChild.style.transform = 'scale(' + scale + ')';
                                firstChild.style.transformOrigin = 'center center';
                            }
                        }, 100); // Small delay to ensure content is rendered
                    });
                <\/script>
                `
                        : ""
                }
            </head>
            <body>
                ${htmlCode}
            </body>
            </html>`;
        setSrcDoc(content);
    }, [cssCode, htmlCode, theme, backgroundColor, isTailwindStyle, scale, autoScale]);

    return (
        <iframe
            title="Live Preview"
            className={`w-full h-full border-0 ${className}`}
            sandbox="allow-scripts allow-forms allow-same-origin"
            srcDoc={srcDoc}
            style={{ overflow: "hidden" }}
        />
    );
};

export { LivePreview };
