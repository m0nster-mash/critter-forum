/**
 * @fileOverview    Central single source of truth for all icon references.
 * @remarks         Enables type-safe icon resolution by string name without manual runtime imports.
 * @module          features/icons
 */

import ArrowDownIcon from "@/components/icons/arrow-down.svg";
import ArrowUpIcon from "@/components/icons/arrow-up.svg";
import ArrowsVerticalIcon from "@/components/icons/arrows-vertical.svg";
import BellIcon from "@/components/icons/bell.svg";
import CaretDownFillIcon from "@/components/icons/caret-down-fill.svg";
import CaretUpFillIcon from "@/components/icons/caret-up-fill.svg";
import ChatDotsIcon from "@/components/icons/chat-dots.svg";
import ChevronDownIcon from "@/components/icons/chevron-down.svg";
import ChevronExpandIcon from "@/components/icons/chevron-expand.svg";
import EyeIcon from "@/components/icons/eye.svg";
import MoonIcon from "@/components/icons/moon.svg";
import PencilSquareIcon from "@/components/icons/pencil-square.svg";
import SearchIcon from "@/components/icons/search.svg";
import SunIcon from "@/components/icons/sun.svg";
import ThreeDotsVerticalIcon from "@/components/icons/three-dots-vertical.svg";
import XIcon from "@/components/icons/x.svg";
import {type ComponentType, type SVGProps} from "react";

/**
 * Union type of all valid icon names in the application.
 */
export type IconName =
    | "arrow-down"
    | "arrow-up"
    | "arrows-vertical"
    | "bell"
    | "caret-down-fill"
    | "caret-up-fill"
    | "chat"
    | "chat-dots"
    | "chevron-down"
    | "chevron-expand"
    | "eye"
    | "moon"
    | "pencil-square"
    | "search"
    | "sun"
    | "three-dots-vertical"
    | "x";

export type SVGComponent = ComponentType<SVGProps<SVGSVGElement>>;

/**
 * Central mapping from string IconName identifiers to SVG React components.
 */
export const ICON_REGISTRY: Record<IconName, SVGComponent> = {
    "arrow-down": ArrowDownIcon,
    "arrow-up": ArrowUpIcon,
    "arrows-vertical": ArrowsVerticalIcon,
    bell: BellIcon,
    "caret-down-fill": CaretDownFillIcon,
    "caret-up-fill": CaretUpFillIcon,
    chat: ChatDotsIcon,
    "chat-dots": ChatDotsIcon,
    "chevron-down": ChevronDownIcon,
    "chevron-expand": ChevronExpandIcon,
    eye: EyeIcon,
    moon: MoonIcon,
    "pencil-square": PencilSquareIcon,
    search: SearchIcon,
    sun: SunIcon,
    "three-dots-vertical": ThreeDotsVerticalIcon,
    x: XIcon,
};

/**
 * Safely resolves an icon component by name string with automatic fallback.
 *
 * @param iconName - String key matching an IconName registry entry
 * @param fallback - Fallback icon to render if key is invalid or undefined
 *
 * @returns The resolved React SVG Component
 */
export function resolveIcon(
    iconName: string | undefined | null,
    fallback: IconName = "three-dots-vertical"
): SVGComponent {
    if (!iconName || !(iconName in ICON_REGISTRY)) {
        if (iconName) {
            console.warn(`[IconRegistry] Icon name "${iconName}" not found in registry. Using fallback "${fallback}".`);
        }
        return ICON_REGISTRY[fallback];
    }
    return ICON_REGISTRY[iconName as IconName];
}

/**
 * Utility to retrieve an array of all registered icon names.
 */
export function getAvailableIcons(): IconName[] {
    return Object.keys(ICON_REGISTRY) as IconName[];
}
