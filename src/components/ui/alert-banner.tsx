import type {PublicAlert} from "@/lib/alerts/types";
import {JSX} from "react";

interface AlertBannerProps {
    alert: PublicAlert;
}

/**
 * Renders a persistent, accessible alert banner.
 *
 * @param   {AlertBannerProps} props   The alert to display
 * @return  {JSX.Element}              The rendered alert banner
 */
export function AlertBanner({alert}: AlertBannerProps): JSX.Element {
    const role = alert.severity === "error" ? "alert" : "status";
    const fieldId = alert.field ? `alert-${alert.field}` : undefined;

    return (
        <div id={fieldId}
             className={`alert-banner alert-banner-${alert.severity}`}
             role={role}
             aria-live={role === "alert" ? "assertive" : "polite"}>
            <p>{alert.message}</p>
            {alert.ref && <small>Reference: {alert.ref}</small>}
        </div>
    );
}
