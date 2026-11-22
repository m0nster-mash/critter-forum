/**
 * @fileOverview    Organizes icons by functional role and context.
 * @remarks         Improves discoverability, reduces string typos, and enforces visual consistency across modules.
 * @module          features/icons
 *
 * @TODO            Complete documentation
 */

import {IconSize, IconVariant} from "@/features/icons/types";

/** UI Chrome & Header Controls */
export const UI_ICONS = {
    CLOSE: "x" as const,
    QUESTION: "question" as const,
} as const;

/** Alert-System Controls */
export const ALERT_ICONS = {
    SUCCESS: "check-circle-fill" as const,
    INFO: "info-circle-fill" as const,
    WARN: "exclamation-triangle-fill" as const,
    ERROR: "x-circle-fill" as const,
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
