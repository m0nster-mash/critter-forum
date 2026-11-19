import styles from "@/components/styles/alerts.module.css";
import {AlertVariant} from "@/lib/alerts/constants/alert-codes";
import type {JSX, ReactNode} from "react";

/**
 * Permissible severity levels for an alert. Covers failures, cautions, and positive outcomes alike.
 */
export const ALERT_SEVERITIES = ["success", "info", "warning", "error"] as const;
export type AlertSeverity = (typeof ALERT_SEVERITIES)[number];

/**
 * Where an alert is shown on-page.
 *
 * - `toast`:  transient, non-blocking snackbar
 * - `inline`: persistent banner rendered in context (page, form, or field level)
 * - `none`:   not shown to the user (logging only)
 */
export const ALERT_PRESENTATIONS = ["toast", "inline", "none"] as const;
export type AlertPresentation = (typeof ALERT_PRESENTATIONS)[number];

/**
 * Log levels shared by the server and client loggers.
 */
export type AlertLogLevel = "debug" | "info" | "warn" | "error";

/**
 * Free-form structured data attached to a log entry.
 */
export type LogContext = Record<string, unknown>;

/**
 * The logging interface shared by the server and client loggers, so calling code reads the same on both sides.
 */
export interface Logger {
    debug(message: string, context?: LogContext): void;

    info(message: string, context?: LogContext): void;

    warn(message: string, context?: LogContext): void;

    error(message: string, context?: LogContext): void;

    /**
     * Creates a logger that adds the given bindings (e.g. `{scope: "seed"}`) to every entry it writes.
     */
    child(bindings: LogContext): Logger;
}

/**
 * Per-environment logging rules for an alert. `false` means the alert is never logged in that environment.
 *
 * @property    {AlertLogLevel | false} server  Level written to the terminal / server logs
 * @property    {AlertLogLevel | false} client  Level written to the browser console (production output is sanitized)
 */
export interface AlertLogPolicy {
    server: AlertLogLevel | false;
    client: AlertLogLevel | false;
}

/**
 * A registry entry: the single source of truth for what an alert says, how it looks, and how it is logged.
 *
 * @property    {AlertSeverity}     severity        Default severity
 * @property    {string}            message         User-safe text. May contain `{name}` tokens filled via `params`.
 * @property    {AlertPresentation} presentation    Default on-page presentation
 * @property    {AlertLogPolicy}    log             Default logging rules
 * @property    {string}            [field]         Optional; form field this alert belongs to by default
 */
export interface AlertDefinition {
    severity: AlertSeverity;
    message: string;
    presentation: AlertPresentation;
    log: AlertLogPolicy;
    field?: string;
}

/**
 * The alert as it crosses the server/client boundary. Primitives only, so it serializes cleanly out of server
 * actions. Never holds internal detail (causes, stacks, request context).
 *
 * @property    {string}            code            Registry key, e.g. `AUTH_LOGIN_INVALID_CREDENTIALS`
 * @property    {AlertSeverity}     severity        Severity used for styling and live-region role
 * @property    {string}            message         Final, user-safe text
 * @property    {AlertPresentation} presentation    Where the alert should be rendered
 * @property    {string}            [field]         Optional; form field name for field-level inline alerts
 * @property    {string}            [ref]           Optional; reference ID matching a server log entry
 */
export interface PublicAlert {
    code: string;
    severity: AlertSeverity;
    message: string;
    presentation: AlertPresentation;
    field?: string;
    ref?: string;
}

/**
 * Per-call adjustments when creating an alert. There is deliberately no `message` override: user-facing text lives
 * in the registry, and dynamic values go through `params`.
 *
 * @property    {AlertSeverity}                     [severity]      Override the registry severity
 * @property    {AlertPresentation}                 [presentation]  Override the registry presentation
 * @property    {string}                            [field]         Form field name for field-level alerts
 * @property    {string}                            [ref]           Reference ID matching a server log entry
 * @property    {Record<string, string | number>}   [params]        Values substituted for `{name}` tokens in the message
 */
export interface AlertOverrides {
    severity?: AlertSeverity;
    presentation?: AlertPresentation;
    field?: string;
    ref?: string;
    params?: Record<string, string | number>;
}

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
