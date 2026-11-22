/**
 * @fileOverview    Organizes icons by functional role and context.
 * @remarks         Improves discoverability, reduces string typos, and enforces visual consistency across modules.
 * @module          features/icons
 *
 * @TODO            Complete documentation
 */

import {IconSize, IconVariant} from "@/features/icons/types";

/** Navigation & Directional Icons */
export const NAVIGATION_ICONS = {
    CHEVRON_DOWN: "chevron-down" as const,
    CHEVRON_EXPAND: "chevron-expand" as const,
    ARROW_UP: "arrow-up" as const,
    ARROW_DOWN: "arrow-down" as const,
    ARROWS_VERTICAL: "arrows-vertical" as const,
    CARET_UP: "caret-up-fill" as const,
    CARET_DOWN: "caret-down-fill" as const,
} as const;

/** User & Data Action Icons */
export const ACTION_ICONS = {
    EDIT: "pencil-square" as const,
    CLOSE: "x" as const,
    VIEW: "eye" as const,
    MORE: "three-dots-vertical" as const,
} as const;

/** Status & Indicator Icons */
export const STATUS_ICONS = {
    CLOSE: "x" as const,
    EXPAND: "chevron-expand" as const,
} as const;

/** UI Chrome & Header Controls */
export const UI_ICONS = {
    SEARCH: "search" as const,
    BELL: "bell" as const,
    CHAT: "chat" as const,
    SUN: "sun" as const,
    MOON: "moon" as const,
} as const;

/** TODO:: document */
export const ICON_SIZE = {
    SMALL: "sm",
    MEDIUM: "md",
    LARGE: "lg",
    X_LARGE: "xl",
} as const;

/** TODO:: document */
export const SIZE_MAP: Record<IconSize, number> = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
} as const;

/** TODO:: document */
export const VARIANT_CLASSES: Record<IconVariant, string> = {
    default: "text-primary",
    accent: "text-accent",
    danger: "text-danger",
    success: "text-success",
    muted: "text-muted",
} as const;
