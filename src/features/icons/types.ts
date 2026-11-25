
/**
 * @fileOverview    Defines the shared types used by the icon system.
 * @module          features/icons
 */

import {ICON_SIZE} from "@/features/icons/constants/groups";
import type {IconName} from "@/features/icons/registry";
import type {ComponentType, SVGProps} from "react";

/**
 * Defines the accessibility properties required by an icon.
 *
 * @remarks     Non-semantic icons must not receive an accessible label through this property.
 * @remarks     Semantic icons require a descriptive label.
 *
 * @property    semantic    Whether the icon conveys meaningful information to assistive technology.
 * @property    label       Accessible description required for semantic icons.
 *
 * @see         {@link IconProps} in this file
 * @see         {@link Icon} in `src/features/icons/components/icon.tsx`
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
 * Properties accepted by the Icon component.
 *
 * @remarks     Extends native SVG properties while providing icon registry, size, variant, and accessibility options.
 *
 * @property    icon        Optional; custom SVG component rendered instead of a registry icon.
 * @property    name        Optional; registered icon name to resolve.
 * @property    size        Optional; configured display size.
 * @property    variant     Optional; visual style applied to the icon.
 *
 * @see         {@link Icon} in `src/features/icons/components/icon.tsx`
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
 * Defines the supported display sizes for icons.
 *
 * @remarks     Derived from the canonical icon size constants.
 *
 * @see         {@link SIZE_MAP} in `src/features/icons/constants/groups.ts`
 * @see         {@link Icon} in `src/features/icons/components/icon.tsx`
 */
export type IconSize =
    typeof ICON_SIZE.SMALL |
    typeof ICON_SIZE.MEDIUM |
    typeof ICON_SIZE.LARGE |
    typeof ICON_SIZE.X_LARGE;

/**
 * Defines the supported visual variants for icons.
 *
 * @remarks     Used as the key contract for icon variant styling.
 *
 * @see         {@link VARIANT_CLASSES} in `src/features/icons/constants/groups.ts`
 * @see         {@link Icon} in `src/features/icons/components/icon.tsx`
 */
export type IconVariant = "default" | "accent" | "danger" | "success" | "muted";
