/**
 * @fileOverview    Renders an accessible alert as a banner, field message, or toast.
 * @module          features/alerts
 */

import {AlertIcon} from "@/features/alerts/components/alert-icon";
import {ALERT_ROLES, SEVERITY_LABELS, VARIANT_TYPES} from "@/features/alerts/constants/alert-types";
import {LOG_LEVELS} from "@/features/alerts/constants/logger";
import styles from "@/features/alerts/styles/alerts.module.css";
import type {AlertBannerProps} from "@/features/alerts/types";
import type {JSX} from "react";

/**
 * Renders one alert in a visible banner.
 *
 * @remark      Stateless and free of client-only code, so it works in Server Components, Client Components, and error
 *              boundaries alike.
 * @remark      Errors and warnings use {@code role="alert"} (announced immediately);
 *              Success and info use {@code role="status"} (announced politely).
 *
 *
 * @param       alert       Optional public alert associated with the successful result.
 * @param       id          Unique identifier of the toast or element.
 * @param       variant     Presentation variant that controls the alert layout.
 * @param       count       Number of occurrences represented by this alert.
 * @param       action      Optional content rendered alongside the alert.
 *
 * @returns     {JSX.Element | null}    The alert, or null when there is nothing to show.
 */
export function AlertBanner({
                                alert,
                                id,
                                variant = VARIANT_TYPES.BANNER,
                                count = 1,
                                action
                            }: AlertBannerProps): JSX.Element | null {

    if (!alert) return null;

    const role = (alert.severity === LOG_LEVELS.ERROR || alert.severity === LOG_LEVELS.WARN)
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
