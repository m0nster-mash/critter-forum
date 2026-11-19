import {AlertIcon} from "@/components/alerts/alert-icon";
import styles from "@/components/alerts/alerts.module.css";
import {ALERT_ROLES, SEVERITY_LABELS, SEVERITY_TYPES, VARIANT_TYPES} from "@/lib/alerts/constants/alert-codes";
import {AlertBannerProps} from "@/lib/alerts/types";
import type {JSX} from "react";


/**
 * Renders one alert. Stateless and free of client-only code, so it works in Server Components, Client Components,
 * and error boundaries alike. Errors and warnings use `role="alert"` (announced immediately); success and info use
 * `role="status"` (announced politely).
 *
 * @param   {AlertBannerProps}  props   Component properties
 *
 * @return  {JSX.Element | null}    The alert, or null when there is nothing to show.
 */
export function AlertBanner({
                                alert,
                                id,
                                variant = VARIANT_TYPES.BANNER,
                                count = 1,
                                action
                            }: AlertBannerProps): JSX.Element | null {

    if (!alert) return null;

    const role = alert.severity === SEVERITY_TYPES.ERROR || alert.severity === SEVERITY_TYPES.WARNING
        ? ALERT_ROLES.ALERT
        : ALERT_ROLES.STATUS;

    const className = [styles.alert, styles[alert.severity], variant !== VARIANT_TYPES.BANNER && styles[variant]]
        .filter(Boolean)
        .join(" ");

    return (
        <div id={id} role={role} className={className}>
            <AlertIcon severity={alert.severity} className={styles.icon}/>
            <div className={styles.body}>
                <span className={styles.srOnly}>{SEVERITY_LABELS[alert.severity]}: </span>
                <span className={styles.message}>{alert.message}</span>
                {count > 1 && <span className={styles.count} aria-label={`${count} times`}>×{count}</span>}
                {alert.ref && <span className={styles.ref}>Reference: <code>{alert.ref}</code></span>}
            </div>
            {action}
        </div>
    );
}
