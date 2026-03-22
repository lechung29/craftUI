/** @format */

import { useSidebarStore } from "@/store/sidebarStore";
import { ComponentType } from "@/types";
import { Bookmark, Check, CircleDot, ClipboardMinus, Form, IdCard, Info, List, Loader, SquareMinus, ToggleLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type IElementsDropdown = {
    isOpen: boolean;
    onClose: () => void;
};

const ElementsDropdown: React.FunctionComponent<IElementsDropdown> = (props) => {
    const { isOpen, onClose } = props;
    const navigate = useNavigate();
    const { setSelectedStyle, setSelectedType, setSearchKey } = useSidebarStore();

    const categories = [
        { icon: List, label: "All", value: undefined },
        { icon: SquareMinus, label: "Buttons", value: ComponentType.Button },
        { icon: Check, label: "Checkboxes", value: ComponentType.Checkbox },
        { icon: ToggleLeft, label: "Toggle switches", value: ComponentType.Switch },
        { icon: IdCard, label: "Cards", value: ComponentType.Card },
        { icon: Loader, label: "Loaders", value: ComponentType.Loader },
        { icon: ClipboardMinus, label: "Inputs", value: ComponentType.Input },
        { icon: CircleDot, label: "Radio buttons", value: ComponentType.Radio },
        { icon: Form, label: "Forms", value: ComponentType.Form },
        { icon: Info, label: "Tooltips", value: ComponentType.Tooltip },
        { icon: Bookmark, label: "My favorites", value: undefined },
    ];

    if (!isOpen) return null;

    return (
        <div className="grid grid-cols-2 gap-1">
            {categories.map((category) => (
                <button
                    key={category.label}
                    onClick={() => {
                        const isFavorites = category.label === "My favorites";
                        if (isFavorites) {
                            navigate("/favorites");
                        } else {
                            navigate("/elements");
                            setSearchKey("");
                            setSelectedStyle(undefined);
                            setSelectedType(category.value);
                        }
                        onClose();
                    }}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs sm:text-sm text-white/90 hover:bg-[#212121] transition-colors text-left group"
                >
                    <span className="flex items-center gap-2 sm:gap-2.5">
                        <category.icon className="text-sm sm:text-base" />
                        <span className="font-medium">{category.label}</span>
                    </span>
                </button>
            ))}
        </div>
    );
};

export { ElementsDropdown };
