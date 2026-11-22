/**
 * @fileOverview    Defines the shared types used by the icon system.
 * @module          features/icons
 */

import {ICON_SIZE} from "@/features/icons/constants/groups";
import {IconName} from "@/features/icons/index";
import {ComponentType, SVGProps} from "react";

/**
 * Properties accepted by the `Icon` component.
 *
 * @property    [icon]      Direct SVG component to render; takes precedence over `name`
 * @property    [name]      String key looked up in the central icon registry when `icon` is not supplied
 * @property    [size]      Display size key; defaults to `ICON_SIZE.MEDIUM`
 * @property    [variant]   Colour variant key; defaults to `"default"`
 * @property    [semantic]  When true, exposes accessibility attributes (`aria-label`, `role="img"`)
 * @property    [label]     Accessible label for screen readers; required when `semantic` is true
 */
export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "width" | "height"> {
    icon?: ComponentType<SVGProps<SVGSVGElement>>;
    name?: IconName | string;
    size?: IconSize;
    variant?: IconVariant;
    semantic?: boolean;
    label?: string;
}

/**
 * Valid display size keys for an icon; one of `sm`, `md`, `lg` or `xl`.
 */
export type IconSize =
    typeof ICON_SIZE.SMALL |
    typeof ICON_SIZE.MEDIUM |
    typeof ICON_SIZE.LARGE |
    typeof ICON_SIZE.X_LARGE;

/**
 * Colour variant keys used to style an icon (`default`, `accent`, `danger`, `success`, `muted`).
 */
export type IconVariant = "default" | "accent" | "danger" | "success" | "muted";
