import {ClientLogContext} from "@/lib/alerts/client/logger";
import {number} from "better-auth";

/**
 * Alert severity levels.
 */
export const ALERT_SEVERITIES = [
    "success",
    "info",
    "warning",
    "error",
] as const;
export type AlertSeverity = (typeof ALERT_SEVERITIES)[number];

/**
 * How an alert is displayed on-page. `none` indicates backend logging only.
 */
export const ALERT_PRESENTATIONS = [
    "toast",
    "inline",
    "none",
] as const;
export type AlertPresentation = (typeof ALERT_PRESENTATIONS)[number];

/**
 * Log levels shared by the server and client loggers.
 */
export type AlertLogLevel = "debug" | "info" | "warn" | "error";

/**
 * Per-env logging rules. 'false' indicates that the alert is never logged.
 *
 * @property    {AlertLogLevel | false} server  Terminal / server logs
 * @property    {AlertLogLevel | false} client  Browser console (sanitized)
 */
export interface AlertLogPolicy {
    server: AlertLogLevel | false;
    client: AlertLogLevel | false;
}

/**
 * Registry of the single source of truth for an alert's content.
 *
 * @property    {AlertSeverity}     severity        Default severity
 * @property    {string}            message         User-safe text
 * @property    {AlertPresentation} presentation    Default on-page presentation
 * @property    {AlertLogPolicy}    log             Default logging rules
 *
 */
export interface AlertDefinition {
    severity: AlertSeverity;
    message: string;
    presentation: AlertPresentation;
    log: AlertLogPolicy;
}

/**
 * The alert as it crosses the server/client boundary. Primitives only, so it serializes cleanly out of server actions.
 * Never holds internal detail (causes, stacks, request context).
 *
 * @property    {string}            code            Registry key
 * @property    {AlertSeverity}     severity        Default severity
 * @property    {string}            message         User-safe text
 * @property    {AlertPresentation} presentation    Default on-page presentation
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
 * @property    {Record<string, string | number>}   [params]        Values substituted for `{name}` tokens in message
 */
export interface AlertOverrides {
    severity?: AlertSeverity;
    presentation?: AlertPresentation;
    field?: string;
    ref?: string;
    params?: Record<string, string | number>;
}


/**
 * Client-side logging interface with severity-specific methods and support for child loggers.
 * Each method accepts a message and optional structured context; child loggers inherit fixed bindings.
 *
 * @property {} debug TODO::document
 * @property {} info TODO::document
 * @property {} warn TODO::document
 * @property {} error TODO::document
 * @property {} child TODO::document
 */
export interface ClientLogger {
    debug(message: string, context?: ClientLogContext): void;
    info(message: string, context?: ClientLogContext): void;
    warn(message: string, context?: ClientLogContext): void;
    error(message: string, context?: ClientLogContext): void;
    child(bindings: ClientLogContext): ClientLogger;
}


/**
 * Toast notification enriched with a stable per-instance identifier for rendering and dismissal.
 *
 * @property    {string}    id  TODO:: document
 */
export interface Toast extends PublicAlert {
    id: string;
}

/**
 * Operations exposed by the shared toast context to descendant components.
 *
 * @property    {(alert: PublicAlert) => void}  notify  TODO:: document
 * @property    {(id: string) => void}          dismiss TODO:: document
 */
export interface ToastContextValue {
    notify: (alert: PublicAlert) => void;
    dismiss: (id: string) => void;
}

/**
 * Discriminated actions consumed by the toast reducer.
 */
export type ToastAction =
    | { type: "add"; toast: Toast }
    | { type: "dismiss"; id: string };

/**
 * Properties required to render an alert banner.
 *
 * @property    {PublicAlert}   alert   Public, user-safe alert data to display in the banner
 */
export interface AlertBannerProps {
    alert: PublicAlert;
}
