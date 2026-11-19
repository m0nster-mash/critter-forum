import {
    ALERT_ARIA_LIVE,
    ALERT_BANNER_CLASSES,
    ALERT_FIELD_ID_PREFIX,
    ALERT_REF_LABEL,
    ALERT_ROLES,
    ALERT_SEVERITY_ERROR,
} from "@/lib/alerts/constants/alerts";
import {AlertBannerProps} from "@/lib/alerts/types";
import {JSX} from "react";

/**
 * Renders a persistent, accessible alert banner.
 *
 * @param   {AlertBannerProps}  props   The alert to display
 *
 * @return  {JSX.Element}               The rendered alert banner
 */
export function AlertBanner({alert}: AlertBannerProps): JSX.Element {
    const role = alert.severity === ALERT_SEVERITY_ERROR
        ? ALERT_ROLES.ERROR
        : ALERT_ROLES.STATUS;

    const fieldId = alert.field
        ? `${ALERT_FIELD_ID_PREFIX}${alert.field}`
        : undefined;

    return (
        <div id={fieldId}
             className={`${ALERT_BANNER_CLASSES.BASE} ${ALERT_BANNER_CLASSES.SEVERITY_PREFIX}${alert.severity}`}
             role={role}
             aria-live={role === ALERT_ROLES.ERROR
                 ? ALERT_ARIA_LIVE.ASSERTIVE
                 : ALERT_ARIA_LIVE.POLITE}>
            <p>{alert.message}</p>
            {alert.ref && <small>{ALERT_REF_LABEL}{alert.ref}</small>}
        </div>
    );
}
