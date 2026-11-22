/**
 * @fileOverview    Standardized Icon Component Wrapper.
 * @module          features/icons
 *
 * @TODO            Document `Icon` function
 * @TODO            Update alert-handling
 */

import {ICON_SIZE, SIZE_MAP, VARIANT_CLASSES} from "@/features/icons/constants/groups";
import {resolveIcon} from "@/features/icons";
import {IconProps} from "@/features/icons/types";
import React from "react";

/**
 * <one-line description>
 *
 * @remarks     <details>
 * @remarks     <details>
 *
 * @TODO        <something to do>
 * @TODO        <something to do>
 *
 * @param param0
 * @param param0.icon
 * @param param0.name
 * @param param0.size
 * @param param0.variant
 * @param param0.semantic
 * @param param0.label
 * @param param0.className
 * @param param0.props
 *
 * @returns     {<type>}    <return statement>
 */
export function Icon({
                         icon,
                         name,
                         size = ICON_SIZE.MEDIUM,
                         variant = "default",
                         semantic = false,
                         label,
                         className = "",
                         ...props
                     }: IconProps) {
    // Resolve component from direct prop or string name registry lookup
    const IconComponent = icon ?? resolveIcon(name);
    const pixelSize = SIZE_MAP[size] ?? SIZE_MAP.md;
    const variantClass = VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.default;

    if (semantic && !label) {
        // TODO:: convert to correct alert-handling system
        console.warn("[Icon] Semantic icons require a descriptive 'label' prop for screen readers.");
    }

    return React.createElement(IconComponent, {
        width: pixelSize,
        height: pixelSize,
        "aria-hidden": !semantic,
        "aria-label": semantic ? label : undefined,
        role: semantic ? "img" : undefined,
        className: `${variantClass}${className ? ` ${className}` : ""}`,
        ...props,
    });
}

export default Icon;
