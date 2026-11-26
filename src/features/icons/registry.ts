/**
 * @fileOverview    Central single source of truth for all icon references.
 * @remarks         Enables type-safe icon resolution by string name without manual runtime imports.
 * @module          features/icons
 */

import CheckIcon from "@/components/icons/check-circle-fill.svg";
import AlertIcon from "@/components/icons/exclamation-triangle-fill.svg";
import InfoIcon from "@/components/icons/info-circle-fill.svg"
import QuestionIcon from "@/components/icons/question.svg";
import XCircleICon from "@/components/icons/x-circle-fill.svg";
import XIcon from "@/components/icons/x.svg";
import {clientLogger} from "@/features/alerts/client/logger";
import {UI_ICONS} from "@/features/icons/constants/groups";
import {ICON_ALERTS, ICON_SCOPES} from "@/features/icons/constants/observability";
import {type ComponentType, type SVGProps} from "react";

/**
 * Union type of all valid icon names in the application.
 */
export type IconName =
    | "success"
    | "warn"
    | "info"
    | "question"
    | "close"
    | "error";

export type SVGComponent = ComponentType<SVGProps<SVGSVGElement>>;

/**
 * Central mapping from string IconName identifiers to SVG React components.
 */
export const ICON_REGISTRY: Record<IconName, SVGComponent> = {
    success: CheckIcon,
    warn: AlertIcon,
    info: InfoIcon,
    question: QuestionIcon,
    close: XIcon,
    error: XCircleICon,
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
    fallback: IconName = UI_ICONS.QUESTION
): SVGComponent {
    if (!iconName || !(iconName in ICON_REGISTRY)) {
        if (iconName) {
            clientLogger.warn(
                ICON_ALERTS.ICON_NOT_FOUND.message(iconName, fallback),
                {scope: ICON_SCOPES.ICON_REGISTRY}
            );
        }
        return ICON_REGISTRY[fallback];
    }
    return ICON_REGISTRY[iconName as IconName];
}
