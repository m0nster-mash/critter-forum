/**
 * @fileOverview    Defines the shared types used by the icon system.
 * @module          features/icons
 */

import {ICON_SIZE} from "@/features/icons/constants/groups";
import {IconName} from "@/features/icons/registry";
import {ComponentType, SVGProps} from "react";

/**
 * Icon accessibility properties.
 */
type IconAccessibilityProps =
    | {
    semantic?: false;
    label?: never;
}
    | {
    semantic: true;
    label: string;
};

/**
 * Properties accepted by the {@link Icon} component.
 */
export type IconProps =
    Omit<SVGProps<SVGSVGElement>, "width" | "height"> &
    IconAccessibilityProps & {

    icon?: ComponentType<SVGProps<SVGSVGElement>>;
    name?: IconName | string;
    size?: IconSize;
    variant?: IconVariant;
};

/**
 * Valid display size keys for an icon
 */
export type IconSize =
    typeof ICON_SIZE.SMALL |
    typeof ICON_SIZE.MEDIUM |
    typeof ICON_SIZE.LARGE |
    typeof ICON_SIZE.X_LARGE;

/**
 * Colour variant keys used to style an icon
 */
export type IconVariant = "default" | "accent" | "danger" | "success" | "muted";
