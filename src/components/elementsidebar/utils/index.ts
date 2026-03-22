/** @format */

import { ComponentType } from "@/types";
import { Book, CheckSquare, Circle, FileEdit, FileText, HelpCircle, LoaderIcon, Radio, RefreshCw, Type } from "lucide-react";

const categories = [
    { icon: Book, label: "All", value: undefined },
    { icon: Circle, label: "Buttons", value: ComponentType.Button },
    { icon: CheckSquare, label: "Checkboxes", value: ComponentType.Checkbox },
    { icon: RefreshCw, label: "Toggle switches", value: ComponentType.Switch },
    { icon: FileText, label: "Cards", value: ComponentType.Card },
    { icon: LoaderIcon, label: "Loaders", value: ComponentType.Loader },
    { icon: Type, label: "Inputs", value: ComponentType.Input },
    { icon: Radio, label: "Radio buttons", value: ComponentType.Radio },
    { icon: FileEdit, label: "Forms", value: ComponentType.Form },
    { icon: HelpCircle, label: "Tooltips", value: ComponentType.Tooltip },
];

export { categories };
