/**
 * @fileOverview    TODO: document
 * @module          features/alerts
 *
 * @status          Requires documentation
 */

import type {AlertVariant} from "@/features/alerts/constants/alert-types";
import {ALERT_PRESENTATIONS, ALERT_SEVERITIES} from "@/features/alerts/constants/alert-types";
import {LOG_FORMATS, LOG_LEVELS} from "@/features/alerts/constants/logger";
import type {TOAST_ACTION_TYPES} from "@/features/alerts/constants/toast";
import {TOAST_LABELS} from "@/features/alerts/constants/toast-ui";
import styles from "@/features/alerts/styles/alerts.module.css";
import type {JSX, ReactNode} from "react";

/**
 * Permissible severity levels for an alert. Covers failures, cautions, and positive outcomes alike.
 */
export type AlertSeverity = (typeof ALERT_SEVERITIES)[number];

/**
 * Where an alert is shown on-page.
 *
 * - `toast`:  transient, non-blocking snackbar
 * - `inline`: persistent banner rendered in context (page, form, or field level)
 * - `none`:   not shown to the user (logging only)
 */
export type AlertPresentation = (typeof ALERT_PRESENTATIONS)[number];

/**
 * Log levels shared by the server and client loggers.
 */
export type AlertLogLevel = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS];
/**
 * TODO: document
 *
 * @status Requires documentation
 */
export type LogFormat = (typeof LOG_FORMATS)[keyof typeof LOG_FORMATS];

/**
 * Free-form structured data attached to a log entry.
 */
export type LogContext = Record<string, unknown>;

/**
 * The logging interface shared by the server and client loggers, so calling code reads the same on both sides.
 */
export interface Logger {
    /**
     * TODO: document
     *
     * @param message - TODO: document
     * @param context - TODO: document
     */
    debug(message: string, context?: LogContext): void;

    /**
     * TODO: document
     *
     * @param message - TODO: document
     * @param context - TODO: document
     */
    info(message: string, context?: LogContext): void;

    /**
     * TODO: document
     *
     * @param message - TODO: document
     * @param context - TODO: document
     */
    warn(message: string, context?: LogContext): void;

    /**
     * TODO: document
     *
     * @param message - TODO: document
     * @param context - TODO: document
     */
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
    /** TODO: document */
    server: AlertLogLevel | false;
    /** TODO: document */
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
    /** TODO: document */
    severity: AlertSeverity;
    /** TODO: document */
    message: string;
    /** TODO: document */
    presentation: AlertPresentation;
    /** TODO: document */
    log: AlertLogPolicy;
    /** TODO: document */
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
 * @property    {string}            [field]         Optional; form field name for field-level inline components
 * @property    {string}            [ref]           Optional; reference ID matching a server log entry
 */
export interface PublicAlert {
    /** TODO: document */
    code: string;
    /** TODO: document */
    severity: AlertSeverity;
    /** TODO: document */
    message: string;
    /** TODO: document */
    presentation: AlertPresentation;
    /** TODO: document */
    field?: string;
    /** TODO: document */
    ref?: string;
}

/**
 * Per-call adjustments when creating an alert. There is deliberately no `message` override: user-facing text lives
 * in the registry, and dynamic values go through `params`.
 *
 * @property    {AlertSeverity}                     [severity]      Override the registry severity
 * @property    {AlertPresentation}                 [presentation]  Override the registry presentation
 * @property    {string}                            [field]         Form field name for field-level components
 * @property    {string}                            [ref]           Reference ID matching a server log entry
 * @property    {Record<string, string | number>}   [params]        Values substituted for `{name}` tokens in the message
 */
export interface AlertOverrides {
    /** TODO: document */
    severity?: AlertSeverity;
    /** TODO: document */
    presentation?: AlertPresentation;
    /** TODO: document */
    field?: string;
    /** TODO: document */
    ref?: string;
    /** TODO: document */
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
 * @property    {number}                [count]     Optional; how many identical components this represents
 * @property    {ReactNode}             [action]    Optional; trailing content such as a dismiss button
 */
export interface AlertBannerProps {
    /** TODO: document */
    alert: PublicAlert | null | undefined;
    /** TODO: document */
    id?: string;
    /** TODO: document */
    variant?: AlertVariant;
    /** TODO: document */
    count?: number;
    /** TODO: document */
    action?: ReactNode;
}


/** A toast currently displayed in the notification stack. */
export interface ToastItem {
    /** TODO: document */
    id: string;
    /** TODO: document */
    alert: PublicAlert;
    /** TODO: document */
    count: number;
    /** TODO: document */
    version: number;
}

/** Actions accepted by the toast stack reducer. */
export type ToastAction =
    | { type: typeof TOAST_ACTION_TYPES.ADD; id: string; alert: PublicAlert }
    | { type: typeof TOAST_ACTION_TYPES.DISMISS; id: string }
    | { type: typeof TOAST_ACTION_TYPES.CLEAR };

/** Options for an AlertError. */
export interface AlertErrorOptions extends AlertOverrides {
    /** TODO: document */
    cause?: unknown;
    /** TODO: document */
    detail?: LogContext;
}

/** Normalized representation of an Error used by the server logger. */
export interface SerializedError {
    /** TODO: document */
    name: string;
    /** TODO: document */
    message: string;
    /** TODO: document */
    stack?: string;
    /** TODO: document */
    cause?: unknown;

    [extra: string]: unknown;
}


/**
 * @fileOverview    Properties for the {@link ToastViewport} component.
 *
 * @property        {ToastItem[]}           toasts      The toasts to show, oldest first
 * @property        {(id: string) => void}  onDismiss   Called when a toast is dismissed or times out
 */
export interface ToastViewportProps {
    /** TODO: document */
    toasts: ToastItem[];
    /** TODO: document */
    onDismiss: (id: string) => void;
}
