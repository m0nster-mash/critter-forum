/**
 * @fileOverview    Defines shared types for alerts, logging, action results, and toast notifications.
 * @module          features/alerts
 *
 * @status          Requires documentation
 */

import type {AlertVariant} from "@/features/alerts/constants/alert-types";
import {ALERT_PRESENTATIONS, ALERT_SEVERITIES} from "@/features/alerts/constants/alert-types";
import {LOG_FORMATS, LOG_LEVELS} from "@/features/alerts/constants/logger";
import type {TOAST_ACTION_TYPES} from "@/features/alerts/constants/toast";
import type {ReactNode} from "react";

/** Permissible severity levels for an alert. Covers failures, cautions, and positive outcomes alike. */
export type AlertSeverity = (typeof ALERT_SEVERITIES)[number];

/**
 * Where an alert is shown on-page.
 *
 * @remarks     `toast`:  transient, non-blocking snackbar
 *              `inline`: persistent banner rendered in context (page, form, or field level)
 *              `none`:   not shown to the user (logging only)
 */
export type AlertPresentation = (typeof ALERT_PRESENTATIONS)[number];

/** Log levels shared by the server and client loggers. */
export type AlertLogLevel = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS];

/** Provides the logFormat functionality. */
export type LogFormat = (typeof LOG_FORMATS)[keyof typeof LOG_FORMATS];

/** Free-form structured data attached to a log entry. */
export type LogContext = Record<string, unknown>;

/** The logging interface shared by the server and client loggers, so calling code reads the same on both sides. */
export interface Logger {

    /**
     * Defines shared types for alerts, logging, action results, and toast notifications.
     *
     * @param   message     Human-readable event message written at the selected log level.
     * @param   [context]   Optional structured data attached to this log entry.
     */
    debug(message: string, context?: LogContext): void;

    /**
     * Defines shared types for alerts, logging, action results, and toast notifications.
     *
     * @param   message     Human-readable event message written at the selected log level.
     * @param   [context]   Optional structured data attached to this log entry.
     */
    info(message: string, context?: LogContext): void;

    /**
     * Defines shared types for alerts, logging, action results, and toast notifications.
     *
     * @param   message     Human-readable event message written at the selected log level.
     * @param   [context]   Optional structured data attached to this log entry.
     */
    warn(message: string, context?: LogContext): void;

    /**
     * Defines shared types for alerts, logging, action results, and toast notifications.
     *
     * @param   message     Human-readable event message written at the selected log level.
     * @param   [context]   Optional structured data attached to this log entry.
     */
    error(message: string, context?: LogContext): void;

    /**
     * Creates a logger that adds the given bindings (ex. `{scope: "seed"}`) to every entry it writes.
     *
     * @param   bindings    Structured key-value data included with every log entry.
     *
     * @returns A logger that includes the supplied bindings in every entry.
     */
    child(bindings: LogContext): Logger;
}

/**
 * Per-environment logging rules for an alert.
 *
 * @remarks     `false` means the alert is never logged in that environment.
 *
 * @property    server  Level written to the terminal / server logs
 * @property    client  Level written to the browser console (production output is sanitized)
 */
export interface AlertLogPolicy {
    server: AlertLogLevel | false;
    client: AlertLogLevel | false;
}

/**
 * A registry entry: the single source of truth for what an alert says, how it looks, and how it is logged.
 *
 * @property    severity        Default severity
 * @property    message         User-safe text. May contain `{name}` tokens filled via `params`.
 * @property    presentation    Default on-page presentation
 * @property    log             Default logging rules
 * @property    [field]         Optional; form field this alert belongs to by default
 */
export interface AlertDefinition {
    severity: AlertSeverity;
    message: string;
    presentation: AlertPresentation;
    log: AlertLogPolicy;
    field?: string;
}

/**
 * The alert as it crosses the server/client boundary.
 *
 * @remarks     Primitives only, so it serializes cleanly out of server actions.
 * @remarks     Never holds internal detail (causes, stacks, request context).
 *
 * @property    code            Registry key (ex. `AUTH_LOGIN_INVALID_CREDENTIALS`)
 * @property    severity        Severity used for styling and live-region role
 * @property    message         Final, user-safe text
 * @property    presentation    Where the alert should be rendered
 * @property    [field]         Optional; form field name for field-level inline components
 * @property    [ref]           Optional; reference ID matching a server log entry
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
 * Per-call adjustments when creating an alert.
 *
 * @remarks     There is deliberately no `message` override: user-facing text lives in the registry, and dynamic values go through `params`.
 *
 * @property    severity        Override the registry severity
 * @property    presentation    Override the registry presentation
 * @property    [field]         Form field name for field-level components
 * @property    [ref]           Reference ID matching a server log entry
 * @property    [params]        Values substituted for `{name}` tokens in the message
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
 * @property    alert       The alert to render; renders nothing if absent
 * @property    [id]        Optional; element id, so an input can reference it via `aria-describedby`
 * @property    [variant]   Optional; `banner` (default, page or form level), `field` (compact, under an input) or
 *                          `toast` (floating)
 * @property    [count]     Optional; how many identical components this represents
 * @property    [action]        Optional; trailing content such as a dismiss button
 */
export interface AlertBannerProps {
    alert: PublicAlert | null | undefined;
    id?: string;
    variant?: AlertVariant;
    count?: number;
    action?: ReactNode;
}


/**
 * A toast currently displayed in the notification stack.
 *
 * @property    id          Unique identifier of the toast or element.
 * @property    alert       Public alert represented by this toast.
 * @property    count       Number of occurrences represented by this alert.
 * @property    version     Incremented whenever the toast is updated, allowing its dismissal timer to restart.
 */
export interface ToastItem {
    id: string;
    alert: PublicAlert;
    count: number;
    version: number;
}

/** Actions accepted by the toast stack reducer. */
export type ToastAction =
    | { type: typeof TOAST_ACTION_TYPES.ADD; id: string; alert: PublicAlert }
    | { type: typeof TOAST_ACTION_TYPES.DISMISS; id: string }
    | { type: typeof TOAST_ACTION_TYPES.CLEAR };

/**
 * Options for an {@link AlertError}.
 *
 * @property    [cause]     Optional; Underlying error that caused this expected failure.
 * @property    [detail]    Optional; Additional structured diagnostic context for server logging.
 *
 */
export interface AlertErrorOptions extends AlertOverrides {
    cause?: unknown;
    detail?: LogContext;
}

/**
 * Normalized representation of an Error used by the server logger.
 *
 * @property    name        Name identifying the error or property.
 * @property    message     Error message retained for diagnostic logging.
 * @property    [stack]     Optional;   Optional stack trace captured for diagnostics.
 * @property    [cause]     Optional; nested cause associated with the error.
 * @property    extra       Additional enumerable error properties retained for logging.
 */
export interface SerializedError {
    name: string;
    message: string;
    stack?: string;
    cause?: unknown;

    [extra: string]: unknown;
}

/**
 * Properties for the {@link ToastViewport} component.
 *
 * @property    toasts      The toasts to show, oldest first
 * @property    onDismiss   Called when a toast is dismissed or times out
 */
export interface ToastViewportProps {
    toasts: ToastItem[];
    onDismiss: (id: string) => void;
}
