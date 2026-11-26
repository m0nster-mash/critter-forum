/**
 * @fileOverview    Defines the public type contracts for the shared SVG icon component.
 * @module          features/icons
 *
 * @remarks         Icon names are sourced from the icon registry and size values from the icon constants. Keep
 *                  accessibility semantics explicit so decorative icons do not accidentally receive redundant labels.
 */

import {ICON_SIZE} from "@/features/icons/constants/groups";
import type {IconName} from "@/features/icons/registry";
import type {ComponentType, SVGProps} from "react";

/**
 * Mutually exclusive accessibility settings for an icon.
 *
 * @remarks     Decorative icons use the default `semantic: false` branch and must not receive a label. Icons that
 *              convey meaning set `semantic: true` and provide a non-empty accessible label.
 */
export type IconAccessibilityProps =
    | {
    semantic?: false;
    label?: never;
}
    | {
    semantic: true;
    label: string;
};

/**
 * Props accepted by the shared SVG `Icon` component.
 *
 * @remarks     Inherits standard SVG attributes except explicit width/height, which are controlled by `size`. Prefer a
 *              registered `name`; use `icon` only when a caller supplies a custom SVG component.
 *              The string fallback in `name` is retained for compatibility with existing dynamic call sites; new code
 *              should use `IconName`.
 *
 * @property    [icon]      Optional custom SVG component.
 * @property    [name]      Optional registered icon name; legacy arbitrary strings remain accepted.
 * @property    [size]      Optional size token from `ICON_SIZE`.
 * @property    [variant]   Optional semantic colour treatment.
 * @property    semantic    Whether the icon conveys meaning to assistive technology.
 * @property    [label]     Required when `semantic` is true; prohibited for decorative icons.
 */
export type IconProps =
    Omit<SVGProps<SVGSVGElement>, "width" | "height"> &
    IconAccessibilityProps & {
    icon?: ComponentType<SVGProps<SVGSVGElement>>;
    name?: IconName | (string & {});
    size?: IconSize;
    variant?: IconVariant;
};

/**
 * Supported icon display-size tokens.
 *
 * @remarks     Use the constants from `ICON_SIZE` rather than raw dimensions. The icon component maps these tokens to
 *              its rendered SVG dimensions.
 */
export type IconSize =
    | typeof ICON_SIZE.SMALL
    | typeof ICON_SIZE.MEDIUM
    | typeof ICON_SIZE.LARGE
    | typeof ICON_SIZE.X_LARGE;

/**
 * Semantic colour treatments supported by the icon component.
 *
 * @remarks     This is a visual treatment, not an accessibility role or alert severity. Use `danger` for destructive
 *              context, `success` for positive context, and `muted` for secondary decoration.
 */
export type IconVariant = "default" | "accent" | "danger" | "success" | "muted";
