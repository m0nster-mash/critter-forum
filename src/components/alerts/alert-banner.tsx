import {AlertIcon} from "@/components/alerts/alert-icon";
import styles from "@/components/alerts/alerts.module.css";
import {AlertVariant, SEVERITY_LABELS} from "@/lib/alerts/constants/alert-codes";
import type {PublicAlert} from "@/lib/alerts/types";
import type {JSX, ReactNode} from "react";

/**
 * Properties for the AlertBanner component.
 *
 * @property    {PublicAlert | null}    [alert]     The alert to render; renders nothing if absent
 * @property    {string}                [id]        Optional; element id, so an input can reference it via
 *                                                  `aria-describedby`
 * @property    {string}                [variant]   Optional; `banner` (default, page or form level), `field` (compact,
 *                                                  under an input) or `toast` (floating)
 * @property    {number}                [count]     Optional; how many identical alerts this represents
 * @property    {ReactNode}             [action]    Optional; trailing content such as a dismiss button
 */
export interface AlertBannerProps {
    alert: PublicAlert | null | undefined;
    id?: string;
    variant?: AlertVariant;
    count?: number;
    action?: ReactNode;
}

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
                                variant = "banner",
                                count = 1,
                                action
}: AlertBannerProps): JSX.Element | null {

    if (!alert) return null;

    const role = alert.severity === "error" || alert.severity === "warning" ? "alert" : "status";
    const className = [styles.alert, styles[alert.severity], variant !== "banner" && styles[variant]]
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
