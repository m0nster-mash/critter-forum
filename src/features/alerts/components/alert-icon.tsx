/**
 * @fileOverview    Handles the rendering of alert icons.
 * @module          features/alerts
 *
 * @status          Requires refactoring and documentation
 * @TODO            Replace SVGs with icons from `/components/icons` once the icon system is in place.
 * @TODO            Relocate `const PATHS`
 */

import type {AlertSeverity} from "@/features/alerts/types";
import {ALERT_ICONS} from "@/features/icons/constants/groups";
import type {JSX} from "react";

/**
 * Provides the PATHS functionality.
 * TODO:: relocate?
 * TODO:: replace with proper icons once icon handling is complete
 **/
const PATHS: Record<AlertSeverity, string> = {
    success: ALERT_ICONS.SUCCESS,
    info: ALERT_ICONS.INFO,
    warn: ALERT_ICONS.WARN,
    error: ALERT_ICONS.ERROR,
};

/**
 * Renders the decorative severity icon for the {@link AlertBanner}.
 *
 * @remarks     Hidden from assistive tech; the banner carries a screen-reader-only severity label.
 *
 * @TODO        Replace `PATHS` content with proper icons once the icon system is implemented
 *
 * @param       severity        Which icon to draw
 * @param       className       Optional; class applied to the SVG
 *
 * @returns     {JSX.Element}   The alert icon
 */
export function AlertIcon({severity, className}: {
    severity: AlertSeverity;
    className?: string
}): JSX.Element {

    return (
        <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
            <path d={PATHS[severity]}/>
        </svg>
    );
}
