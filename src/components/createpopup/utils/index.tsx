/** @format */

import { ComponentStyle, ComponentType } from "@/types";
import { FaCss3 } from "react-icons/fa";
import { SiTailwindcss } from "react-icons/si";

const componentTypes = [
    { id: ComponentType.Button, label: "Button", icon: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" },
    { id: ComponentType.Switch, label: "Toggle switch", icon: "M8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0z" },
    { id: ComponentType.Checkbox, label: "Checkbox", icon: "M5 13l4 4L19 7" },
    { id: ComponentType.Card, label: "Card", icon: "M4 6h16M4 12h16M4 18h16" },
    { id: ComponentType.Loader, label: "Loader", icon: "M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" },
    { id: ComponentType.Input, label: "Input", icon: "M4 8h16M4 16h10" },
    { id: ComponentType.Form, label: "Form", icon: "M4 6h16M4 12h16M4 18h10" },
    { id: ComponentType.Radio, label: "Radio buttons", icon: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" },
    { id: ComponentType.Tooltip, label: "Tooltips", icon: "M8 12h8M12 8v8" },
];

const technologies = [
    { id: ComponentStyle.CSS, label: "CSS", icon: <FaCss3 fontSize={24} color={"#3b82f6"} /> },
    { id: ComponentStyle.Tailwind, label: "Tailwind CSS", icon: <SiTailwindcss fontSize={24} color={"#38bdf8"} /> },
];

export { componentTypes, technologies };
