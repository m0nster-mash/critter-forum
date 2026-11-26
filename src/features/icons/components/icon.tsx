/**
 * @fileOverview    Standardized Icon Component Wrapper.
 * @module          features/icons
 */

import {ICON_SIZE, SIZE_MAP, VARIANT_CLASSES} from "@/features/icons/constants/groups";
import {resolveIcon} from "@/features/icons/registry";
import {ICON_VARIANT, IconProps} from "@/features/icons/types";
import React, {JSX} from "react";

/**
 * Renders a named or directly-supplied SVG icon with consistent sizing, variant styling, and optional accessibility
 * labelling.
 *
 * @remarks     The icon component is resolved from the `icon` prop when supplied, otherwise looked up by `name` in the
 *              central registry (`resolveIcon`) with a question-mark fallback.
 * @remarks     When `semantic` is true, `aria-label` and `role="img"` are exposed for screen readers; a `label` is
 *              required in that case and a warning is emitted if it is missing.
 *
 * @param       icon        Direct SVG component to render; takes precedence over `name`
 * @param       name        String key looked up in the central icon registry when `icon` is not supplied
 * @param       size        Display size key; defaults to `ICON_SIZE.MEDIUM`
 * @param       variant     Colour variant key; defaults to `"default"`
 * @param       semantic    When true, exposes accessibility attributes; defaults to `false`
 * @param       label       Accessible label for screen readers; required when `semantic` is true
 * @param       className   Extra CSS classes appended to the variant class; defaults to `""`
 * @param       props       Additional SVG element props spread onto the rendered icon
 *
 * @returns     {JSX.Element}   The rendered SVG icon element.
 */
export function Icon({
                         icon,
                         name,
                         size = ICON_SIZE.MEDIUM,
                         variant = ICON_VARIANT.DEFAULT,
                         semantic = false,
                         label,
                         className = "",
                         ...props
                     }: IconProps): JSX.Element {

    const IconComponent = icon ?? resolveIcon(name);
    const pixelSize = SIZE_MAP[size] ?? SIZE_MAP.md;
    const variantClass = VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.default;

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
