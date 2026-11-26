/**
 * @fileOverview    Organizes icons by functional role and context.
 * @remarks         Improves discoverability, reduces string typos, and enforces visual consistency across modules.
 * @module          features/icons
 */

import type {IconSize, IconVariant} from "@/features/icons/types";

/** UI Chrome & Header Controls */
export const UI_ICONS = {
    CLOSE: "close" as const,
    QUESTION: "question" as const,
} as const;

/** Alert-System Controls */
export const ALERT_ICONS = {
    SUCCESS: "success" as const,
    INFO: "info" as const,
    WARN: "warn" as const,
    ERROR: "error" as const,
} as const;

/** Defines default icon size keys */
export const ICON_SIZE = {
    SMALL: "sm",
    MEDIUM: "md",
    LARGE: "lg",
    X_LARGE: "xl",
} as const;

/** Defines default icon sizes */
export const SIZE_MAP: Record<IconSize, number> = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
} as const;

/** Defines text colours for alert icon types */
export const VARIANT_CLASSES: Record<IconVariant, string> = {
    default: "text-primary",
    accent: "text-accent",
    danger: "text-danger",
    success: "text-success",
    muted: "text-muted",
} as const;
