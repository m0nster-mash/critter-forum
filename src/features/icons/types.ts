/**
 * @fileOverview    TODO:: document
 * @module          features/icons
 *
 * @TODO            Complete documentation
 */

import {ICON_SIZE} from "@/features/icons/constants/groups";
import {IconName} from "@/features/icons/index";
import {ComponentType, SVGProps} from "react";

/**
 * <one-line description>
 *
 * @remarks     <additional details>
 * @remarks     <additional details>
 *
 * @TODO        <something to do>
 * @TODO        <something to do>
 *
 * @param       param1      <A simple param>
 * @param       [param2]    Optional; <an optional param>
 *
 * @property    property    <A simple param>
 * @property    [property]  Optional; <an optional param>
 *
 * @returns     {<type>}    <return statement>
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
 * <one-line description>
 *
 * @remarks     <additional details>
 * @remarks     <additional details>
 *
 * @TODO        <something to do>
 * @TODO        <something to do>
 *
 * @param       param1      <A simple param>
 * @param       [param2]    Optional; <an optional param>
 *
 * @property    property    <A simple param>
 * @property    [property]  Optional; <an optional param>
 *
 * @returns     {<type>}    <return statement>
 */
export type IconSize =
    typeof ICON_SIZE.SMALL |
    typeof ICON_SIZE.MEDIUM |
    typeof ICON_SIZE.LARGE |
    typeof ICON_SIZE.X_LARGE;

/**
 * <one-line description>
 *
 * @remarks     <additional details>
 * @remarks     <additional details>
 *
 * @TODO        <something to do>
 * @TODO        <something to do>
 *
 * @param       param1      <A simple param>
 * @param       [param2]    Optional; <an optional param>
 *
 * @property    property    <A simple param>
 * @property    [property]  Optional; <an optional param>
 *
 * @returns     {<type>}    <return statement>
 */
export type IconVariant = "default" | "accent" | "danger" | "success" | "muted";

