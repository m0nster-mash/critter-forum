/**
 * @fileOverview    Handles the rendering of alert icons.
 * @module          features/alerts
 */

import {ICON_PATHS} from "@/features/alerts/constants/toast-ui";
import type {AlertSeverity} from "@/features/alerts/types";
import Icon from "@/features/icons/components/icon";
import type {JSX} from "react";


/**
 * Renders the decorative severity icon for the {@link AlertBanner}.
 *
 * @remarks     Hidden from assistive tech; the banner carries a screen-reader-only severity label.
 *
 * @param       severity        Which icon to draw
 * @param       className       Optional; class applied to the SVG
 *
 * @returns     {JSX.Element}   The alert icon
 */
export function AlertIcon({severity, className}: {
    severity: AlertSeverity;
    className?: string;
}): JSX.Element {

    return (
        <Icon name={ICON_PATHS[severity]}
              className={className}
              semantic={false}/>
    );
}
