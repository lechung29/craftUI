/** @format */

import { ICodeProps } from "@/store/codeEditorStore";
import { ComponentStyle } from "@/types/components";

const htmlToJsx = (html: string): string => {
    let out = html;
    out = out.replace(/\bclass=/g, "className=");
    out = out.replace(/\bfor=/g, "htmlFor=");
    // void elements self-close
    out = out.replace(/<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)(\s[^>]*)?\s*>/gi, "<$1$2 />");
    return out;
};

const convertToReact = (html: string, css: string): string => {
    const jsx = htmlToJsx(html.trim());
    const lines = jsx
        ? [
              `import React from 'react';`,
              css.trim() ? `import './Component.css';` : "",
              "",
              "const Component = () => {",
              "  return (",
              ...jsx.split("\n").map((l) => "    " + l),
              "  );",
              "};",
              "",
              "export default Component;",
          ]
        : [`import React from 'react';`, css.trim() ? `import './Component.css';` : "", "", "const Component = () => {", "  return (", "  <></>", "  );", "};", "", "export default Component;"];
    const code = lines.filter((l, i) => !(l === "" && i === 1 && !css.trim())).join("\n");
    if (!css.trim()) return code;
    return code + "\n\n/* ── Component.css ── */\n" + css.trim();
};

const convertToVue = (html: string, css: string): string => {
    const lines = [
        "<template>",
        ...html
            .trim()
            .split("\n")
            .map((l) => "  " + l),
        "</template>",
        "",
        "<script>",
        "export default {",
        '  name: "Component",',
        "};",
        "</script>",
    ];
    if (css.trim()) {
        lines.push("", "<style scoped>", css.trim(), "</style>");
    }
    return lines.join("\n");
};

const convertToSvelte = (html: string, css: string): string => {
    const lines = [...html.trim().split("\n")];
    if (css.trim()) {
        lines.push("", "<style>", css.trim(), "</style>");
    }
    return lines.join("\n");
};

const convertToLit = (html: string, css: string): string => {
    const htmlIndented = html
        .trim()
        .split("\n")
        .map((l) => "      " + l)
        .join("\n");
    const cssIndented = css
        .trim()
        .split("\n")
        .map((l) => "      " + l)
        .join("\n");
    return [
        `import { LitElement, html, css } from 'lit';`,
        "",
        "class MyComponent extends LitElement {",
        css.trim() ? `  static styles = css\`\n${cssIndented}\n  \`;` : "",
        "",
        "  render() {",
        "    return html`",
        htmlIndented,
        "    `;",
        "  }",
        "}",
        "",
        "customElements.define('my-component', MyComponent);",
    ]
        .filter((l, i, a) => !(l === "" && a[i + 1] === ""))
        .join("\n");
};

const initialButtonComponent = (techStyle: ComponentStyle) => {
    let initCode: ICodeProps = {
        html: "",
        css: "",
    };
    if (techStyle === ComponentStyle.Tailwind) {
        initCode = {
            html: `<button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Button</button>`,
            css: "",
        };
    } else {
        initCode = {
            html: `<button class="button">Button</button>`,
            css: `.button {
    cursor: pointer;
    padding: 8px 16px;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 4px;
    transition: background-color 0.2s;
}
.button:hover {
    background-color: #2563eb;
}`,
        };
    }
    return initCode;
};

const initialSwitchComponent = (techStyle: ComponentStyle) => {
    let initCode: ICodeProps = {
        html: "",
        css: "",
    };
    if (techStyle === ComponentStyle.Tailwind) {
        initCode = {
            html: `<label class="relative inline-flex items-center cursor-pointer">
  <input type="checkbox" class="sr-only peer">
  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
</label>`,
            css: "",
        };
    } else {
        initCode = {
            html: `<label class="switch">
  <input type="checkbox">
  <span class="slider"></span>
</label>`,
            css: `/* The switch - the box around the slider */
.switch {
  font-size: 17px;
  position: relative;
  display: inline-block;
  width: 3.5em;
  height: 2em;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 30px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 1.4em;
  width: 1.4em;
  border-radius: 20px;
  left: 0.3em;
  bottom: 0.3em;
  background-color: white;
  transition: .4s;
}

.switch input:checked + .slider {
  background-color: #2196F3;
}

.switch input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

.switch input:checked + .slider:before {
  transform: translateX(1.5em);
}`,
        };
    }
    return initCode;
};

const initialCheckboxComponent = (techStyle: ComponentStyle) => {
    let initCode: ICodeProps = {
        html: "",
        css: "",
    };
    if (techStyle === ComponentStyle.Tailwind) {
        initCode = {
            html: `<label class="relative flex items-center cursor-pointer">
  <input type="checkbox" class="sr-only peer">
  <div class="w-5 h-5 bg-gray-200 rounded border border-gray-300 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors">
  </div>
</label>`,
            css: "",
        };
    } else {
        initCode = {
            html: `<label class="container">
  <input type="checkbox" checked="checked">
  <div class="checkmark"></div>
</label>`,
            css: `/* Hide the default checkbox */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.container {
  display: block;
  position: relative;
  cursor: pointer;
  font-size: 20px;
  user-select: none;
}

/* Create a custom checkbox */
.checkmark {
  position: relative;
  top: 0;
  left: 0;
  height: 1.3em;
  width: 1.3em;
  background-color: #ccc;
}

/* When the checkbox is checked, add a blue background */
.container input:checked ~ .checkmark {
  background-color: #2196F3;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
  left: 0.45em;
  top: 0.25em;
  width: 0.25em;
  height: 0.5em;
  border: solid white;
  border-width: 0 0.15em 0.15em 0;
  transform: rotate(45deg);
}`,
        };
    }
    return initCode;
};

const initialCardComponent = (techStyle: ComponentStyle) => {
    let initCode: ICodeProps = {
        html: "",
        css: "",
    };
    if (techStyle === ComponentStyle.Tailwind) {
        initCode = {
            html: `<div class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow">
  <div class="mb-2 text-2xl font-bold tracking-tight text-gray-900">Card title</div>
  <p class="mb-3 font-normal text-gray-700">Card content goes here.</p>
</div>`,
            css: "",
        };
    } else {
        initCode = {
            html: `<div class="card"></div>`,
            css: `.card {
  width: 190px;
  height: 254px;
  background: lightgrey;
}`,
        };
    }
    return initCode;
};

const initialLoaderComponent = (techStyle: ComponentStyle) => {
    let initCode: ICodeProps = {
        html: "",
        css: "",
    };
    if (techStyle === ComponentStyle.Tailwind) {
        initCode = {
            html: `<div class="flex items-center justify-center">
  <div class="w-8 h-8 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
</div>`,
            css: "",
        };
    } else {
        initCode = {
            html: `<div class="container">
  <div class="spinner"></div>
</div>`,
            css: `.container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 32px;            
  height: 32px;
  border: 4px solid #bfdbfe; 
  border-top: 4px solid #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}`,
        };
    }
    return initCode;
};

const initialInputComponent = (techStyle: ComponentStyle) => {
    let initCode: ICodeProps = {
        html: "",
        css: "",
    };
    if (techStyle === ComponentStyle.Tailwind) {
        initCode = {
            html: `<input type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 max-w-xs" placeholder="Input text">`,
            css: "",
        };
    } else {
        initCode = {
            html: `<input type="text" name="text" class="input">`,
            css: `.input {
  max-width: 190px;
}`,
        };
    }
    return initCode;
};

const initialFormComponent = (techStyle: ComponentStyle) => {
    let initCode: ICodeProps = {
        html: "",
        css: "",
    };
    if (techStyle === ComponentStyle.Tailwind) {
        initCode = {
            html: `<form class="max-w-sm mx-auto space-y-4">
  <div>
    <label class="block mb-2 text-sm font-medium text-gray-900">Email</label>
    <input type="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="name@example.com">
  </div>
  <div>
    <label class="block mb-2 text-sm font-medium text-gray-900">Password</label>
    <input type="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
  </div>`,
            css: "",
        };
    } else {
        initCode = {
            html: `<form class="form">
    <input type="text" class="input">
    <input type="text" class="input"> 
    <button>Submit</button>
</form>`,
            css: `.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form button {
  align-self: flex-end;
}`,
        };
    }
    return initCode;
};

const initialRadioComponent = (techStyle: ComponentStyle) => {
    let initCode: ICodeProps = {
        html: "",
        css: "",
    };
    if (techStyle === ComponentStyle.Tailwind) {
        initCode = {
            html: `<div class="space-y-2">
  <label class="relative flex items-center cursor-pointer">
    <input type="radio" name="radio" class="sr-only peer">
    <div class="w-5 h-5 bg-gray-200 rounded-full border border-gray-300 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors">
      <div class="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100">
        <div class="w-2 h-2 bg-white rounded-full"></div>
      </div>
    </div>
    <span class="ml-2 text-sm font-medium dark:text-white text-gray-900">Option 1</span>
  </label>
  <label class="relative flex items-center cursor-pointer">
    <input type="radio" name="radio" class="sr-only peer">
    <div class="w-5 h-5 bg-gray-200 rounded-full border border-gray-300 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors">
      <div class="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100">
        <div class="w-2 h-2 bg-white rounded-full"></div>
      </div>
    </div>
    <span class="ml-2 text-sm font-medium dark:text-white text-gray-900">Option 2</span>
  </label>
</div>`,
            css: "",
        };
    } else {
        initCode = {
            html: `<div class="radio-group">
  <label class="radio-wrapper">
    <input type="radio" name="radio" class="radio-input">
    <span class="custom-radio">
      <span class="radio-dot"></span>
    </span>
    <span class="radio-label">Option 1</span>
  </label>

  <label class="radio-wrapper">
    <input type="radio" name="radio" class="radio-input">
    <span class="custom-radio">
      <span class="radio-dot"></span>
    </span>
    <span class="radio-label">Option 2</span>
  </label>
</div>`,
            css: `/* Container spacing (space-y-2) */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px; /* equivalent to space-y-2 */
}

/* Label wrapper */
.radio-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
}

/* Hide original radio (sr-only) */
.radio-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

/* Custom radio outer circle */
.custom-radio {
  width: 20px;
  height: 20px;
  background-color: #e5e7eb; /* gray-200 */
  border: 1px solid #d1d5db; /* gray-300 */
  border-radius: 50%;
  position: relative;
  transition: background-color 0.2s, border-color 0.2s;
}

/* Inner white dot */
.radio-dot {
  width: 8px;
  height: 8px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.2s;
}

/* Checked state */
.radio-input:checked + .custom-radio {
  background-color: #2563eb; /* blue-600 */
  border-color: #2563eb;
}

.radio-input:checked + .custom-radio .radio-dot {
  opacity: 1;
}

/* Label text */
.radio-label {
  margin-left: 8px; /* ml-2 */
  font-size: 14px;  /* text-sm */
  font-weight: 500; /* font-medium */
  color: #111827;   /* gray-900 */
}
  
.dark .radio-label{
 color: white;
}`,
        };
    }
    return initCode;
};

const initialTooltipComponent = (techStyle: ComponentStyle) => {
    let initCode: ICodeProps = {
        html: "",
        css: "",
    };
    if (techStyle === ComponentStyle.Tailwind) {
        initCode = {
            html: `<div class="group relative">
  <button class="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>
  <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity">
    Tooltip text
  </div>
</div>`,
            css: "",
        };
    } else {
        initCode = {
            html: `<div class="tooltip-container">
  <span class="tooltip">Uiverse.io</span>
  <span class="text">Tooltip</span>
</div>`,
            css: `/* This is an example, feel free to delete this code */
.tooltip-container {
  --background: #22d3ee;
  position: relative;
  background: var(--background);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 17px;
  padding: 0.7em 1.8em;
}

.tooltip {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.3em 0.6em;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s;
  background: var(--background);
}

.tooltip::before {
  position: absolute;
  content: "";
  height: 0.6em;
  width: 0.6em;
  bottom: -0.2em;
  left: 50%;
  transform: translate(-50%) rotate(45deg);
  background: var(--background);
}

.tooltip-container:hover .tooltip {
  top: -100%;
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}`,
        };
    }
    return initCode;
};

export {
    convertToReact,
    convertToLit,
    convertToSvelte,
    convertToVue,
    htmlToJsx,
    initialButtonComponent,
    initialSwitchComponent,
    initialCheckboxComponent,
    initialCardComponent,
    initialLoaderComponent,
    initialInputComponent,
    initialFormComponent,
    initialRadioComponent,
    initialTooltipComponent,
};
