
/**
 * @fileOverview    Defines shared types for alerts, logging, action results, and toast notifications.
 * @module          features/alerts
 */

import type {AlertVariant} from "@/features/alerts/constants/alert-types";
import {ALERT_PRESENTATIONS, ALERT_SEVERITIES} from "@/features/alerts/constants/alert-types";
import {LOG_FORMATS, LOG_LEVELS} from "@/features/alerts/constants/logger";
import type {TOAST_ACTION_TYPES} from "@/features/alerts/constants/toast";
import type {ReactNode} from "react";

/**
 * Permissible severity levels for an alert.
 *
 * @remarks     Derived from the canonical alert severity constants.
 *
 * @see         {@link createAlert} in `src/features/alerts/create-alert.ts`
 * @see         {@link AlertIcon} in `src/features/alerts/components/alert-icon.tsx`
 */
export type AlertSeverity = (typeof ALERT_SEVERITIES)[number];

/**
 * Defines where an alert is presented to the user.
 *
 * @remarks     `toast`: transient, non-blocking notification.
 * @remarks     `inline`: persistent alert rendered in page, form, or field context.
 * @remarks     `none`: alert is not presented to the user.
 *
 * @see         {@link createAlert} in `src/features/alerts/create-alert.ts`
 * @see         {@link useAlerts} in `src/features/alerts/hooks/use-alerts.ts`
 */
export type AlertPresentation = (typeof ALERT_PRESENTATIONS)[number];

/**
 * Permissible log levels shared by the server and client loggers.
 *
 * @remarks     Derived from the canonical logging level constants.
 *
 * @see         {@link createClientLogger} in `src/features/alerts/client/logger.ts`
 * @see         {@link createServerLogger} in `src/features/alerts/server/logger.ts`
 */
export type AlertLogLevel = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS];

/**
 * Supported output formats for structured logging.
 *
 * @remarks     Derived from the canonical logging format constants.
 *
 * @see         {@link createServerLogger} in `src/features/alerts/server/logger.ts`
 */
export type LogFormat = (typeof LOG_FORMATS)[keyof typeof LOG_FORMATS];

/**
 * Free-form structured data attached to a log entry.
 *
 * @remarks     Used to provide contextual information to alert and logging operations.
 *
 * @see         {@link Logger} in this file
 * @see         {@link logClientAlert} in `src/features/alerts/client/log-alert.ts`
 * @see         {@link logServerAlert} in `src/features/alerts/server/log-alert.ts`
 */
export type LogContext = Record<string, unknown>;

/**
 * Logging interface shared by the server and client loggers.
 *
 * @remarks     Provides a consistent logging API across runtime environments.
 *
 * @property    debug       Writes a debug-level message.
 * @property    info        Writes an informational message.
 * @property    warn        Writes a warning message.
 * @property    error       Writes an error message.
 * @property    child       Creates a logger with persistent contextual bindings.
 *
 * @see         {@link createClientLogger} in `src/features/alerts/client/logger.ts`
 * @see         {@link createServerLogger} in `src/features/alerts/server/logger.ts`
 */
export interface Logger {

    /**
     * Writes a debug-level message.
     *
     * @param       message     Human-readable event message.
     * @param       [context]   Optional; structured data attached to the log entry.
     */
    debug(message: string, context?: LogContext): void;

    /**
     * Writes an informational message.
     *
     * @param       message     Human-readable event message.
     * @param       [context]   Optional; structured data attached to the log entry.
     */
    info(message: string, context?: LogContext): void;

    /**
     * Writes a warning message.
     *
     * @param       message     Human-readable event message.
     * @param       [context]   Optional; structured data attached to the log entry.
     */
    warn(message: string, context?: LogContext): void;

    /**
     * Writes an error message.
     *
     * @param       message     Human-readable event message.
     * @param       [context]   Optional; structured data attached to the log entry.
     */
    error(message: string, context?: LogContext): void;

    /**
     * Creates a logger that includes the supplied bindings in every entry.
     *
     * @param       bindings    Structured key-value data included with every log entry.
     *
     * @returns     A logger with the supplied persistent bindings.
     */
    child(bindings: LogContext): Logger;
}

/**
 * Defines environment-specific logging rules for an alert.
 *
 * @remarks     A value of `false` means the alert is not logged in that environment.
 *
 * @property    server  Log level used for terminal and server output.
 * @property    client  Log level used for browser console output.
 *
 * @see         {@link AlertDefinition} in this file
 */
export interface AlertLogPolicy {
    server: AlertLogLevel | false;
    client: AlertLogLevel | false;
}

/**
 * Defines the canonical configuration for a registered alert.
 *
 * @remarks     Acts as the source of truth for alert messaging, presentation, severity, and logging policy.
 *
 * @property    severity        Default severity assigned to the alert.
 * @property    message         User-safe message. May contain tokens substituted through `params`.
 * @property    presentation    Default presentation mode.
 * @property    log             Default environment-specific logging policy.
 * @property    [field]         Optional; default form field associated with the alert.
 *
 * @see         Alert registry in `src/features/alerts/registry.ts`
 */
export interface AlertDefinition {
    severity: AlertSeverity;
    message: string;
    presentation: AlertPresentation;
    log: AlertLogPolicy;
    field?: string;
}

/**
 * Defines the serializable alert representation passed between server and client.
 *
 * @remarks     Contains only public, user-safe information.
 * @remarks     Must not contain internal diagnostic details such as error causes, stack traces, or request context.
 *
 * @property    code            Registered alert identifier.
 * @property    severity        Severity used for styling and live-region behavior.
 * @property    message         Final user-safe message.
 * @property    presentation    Presentation mode for the alert.
 * @property    [field]         Optional; form field associated with a field-level alert.
 * @property    [ref]           Optional; reference identifier associated with a server log entry.
 *
 * @see         {@link createAlert} in `src/features/alerts/create-alert.ts`
 * @see         {@link AlertBanner} in `src/features/alerts/components/alert-banner.tsx`
 * @see         {@link useAlerts} in `src/features/alerts/hooks/use-alerts.ts`
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
 * Defines optional adjustments applied when creating an alert.
 *
 * @remarks     Message overrides are intentionally excluded. User-facing messages are maintained in the alert registry,
 *              with dynamic values supplied through `params`.
 *
 * @property    [severity]       Optional; overrides the registered severity.
 * @property    [presentation]  Optional; overrides the registered presentation mode.
 * @property    [field]          Optional; form field associated with the alert.
 * @property    [ref]            Optional; reference identifier associated with a server log entry.
 * @property    [params]         Optional; values substituted for message tokens.
 *
 * @see         {@link createAlert} in `src/features/alerts/create-alert.ts`
 * @see         {@link AlertErrorOptions} in this file
 */
export interface AlertOverrides {
    severity?: AlertSeverity;
    presentation?: AlertPresentation;
    field?: string;
    ref?: string;
    params?: Record<string, string | number>;
}

/**
 * Properties accepted by the AlertBanner component.
 *
 * @property    alert       Alert to render; renders nothing if absent.
 * @property    [id]        Optional; element ID for accessibility references such as `aria-describedby`.
 * @property    [variant]   Optional; visual presentation variant.
 * @property    [count]     Optional; number of occurrences represented by the alert.
 * @property    [action]    Optional; trailing content such as a dismiss button.
 *
 * @see         {@link AlertBanner} in `src/features/alerts/components/alert-banner.tsx`
 */
export interface AlertBannerProps {
    alert: PublicAlert | null | undefined;
    id?: string;
    variant?: AlertVariant;
    count?: number;
    action?: ReactNode;
}

/**
 * Represents a toast currently displayed in the notification stack.
 *
 * @property    id          Unique identifier of the toast.
 * @property    alert       Public alert represented by the toast.
 * @property    count       Number of occurrences represented by the toast.
 * @property    version     Incremented when the toast is updated, allowing its dismissal timer to restart.
 *
 * @see         {@link toastReducer} in `src/features/alerts/toast-reducer.ts`
 * @see         {@link ToastViewport} in `src/features/alerts/components/toast-viewport.tsx`
 */
export interface ToastItem {
    id: string;
    alert: PublicAlert;
    count: number;
    version: number;
}

/**
 * Defines the actions accepted by the toast stack reducer.
 *
 * @remarks     Action types are derived from the canonical toast action constants.
 *
 * @property    ADD       Adds a toast to the notification stack.
 * @property    DISMISS   Removes a toast by its identifier.
 * @property    CLEAR     Removes every toast from the notification stack.
 *
 * @see         {@link toastReducer} in `src/features/alerts/toast-reducer.ts`
 */
export type ToastAction =
    | { type: typeof TOAST_ACTION_TYPES.ADD; id: string; alert: PublicAlert }
    | { type: typeof TOAST_ACTION_TYPES.DISMISS; id: string }
    | { type: typeof TOAST_ACTION_TYPES.CLEAR };

/**
 * Options accepted by the AlertError class.
 *
 * @remarks     Extends alert presentation overrides with diagnostic information for server-side error handling.
 *
 * @property    [cause]     Optional; underlying error that caused the expected failure.
 * @property    [detail]    Optional; additional structured diagnostic context for server logging.
 *
 * @see         {@link AlertError} in `src/features/alerts/server/alert-error.ts`
 */
export interface AlertErrorOptions extends AlertOverrides {
    cause?: unknown;
    detail?: LogContext;
}

/**
 * Defines the normalized representation of an Error used by the server logger.
 *
 * @property    name        Name identifying the error.
 * @property    message     Error message retained for diagnostic logging.
 * @property    [stack]     Optional; stack trace captured for diagnostics.
 * @property    [cause]     Optional; nested cause associated with the error.
 * @property    [extra]     Additional enumerable error properties retained for logging.
 *
 * @see         {@link serializeError} in `src/features/alerts/server/logger.ts`
 */
export interface SerializedError {
    name: string;
    message: string;
    stack?: string;
    cause?: unknown;

    [extra: string]: unknown;
}

/**
 * Properties accepted by the ToastViewport component.
 *
 * @property    toasts      Toasts to display, ordered oldest first.
 * @property    onDismiss   Callback invoked when a toast is dismissed or times out.
 *
 * @see         {@link ToastViewport} in `src/features/alerts/components/toast-viewport.tsx`
 */
export interface ToastViewportProps {
    toasts: ToastItem[];
    onDismiss: (id: string) => void;
}

/**
 * Values provided through the alert context.
 *
 * @property    toasts      Toasts currently displayed.
 * @property    notify      Displays an alert as a toast and logs it according to its registry policy.
 * @property    dismiss     Removes one toast by identifier.
 * @property    clear       Removes every toast.
 *
 * @see         {@link useAlertContext} in `src/features/alerts/client/provider.ts`
 * @see         {@link AlertProvider} in `src/features/alerts/client/provider.ts`
 */
export interface AlertContextValue {
    toasts: ToastItem[];
    notify: (alert: PublicAlert, detail?: LogContext) => void;
    dismiss: (id: string) => void;
    clear: () => void;
}

/**
 * Properties accepted by the alert provider content component.
 *
 * @property    children    Application content rendered inside the provider.
 * @property    value       Alert context value supplied to descendants.
 *
 * @see         {@link AlertProviderContent} in `src/features/alerts/client/provider.ts`
 */
export interface AlertProviderContentProps {
    children: ReactNode;
    value: AlertContextValue;
}

/**
 * Defines the alert presentation API returned by the useAlerts hook.
 *
 * @remarks     Holds one inline alert at a time. Call `clear()` to reset it before a new attempt.
 *
 * @property    inline      Current inline alert, or null when none is shown.
 * @property    formAlert   Inline alert associated with the form as a whole.
 * @property    fieldAlert  Returns the inline alert associated with the requested field.
 * @property    present     Routes an alert according to its registered presentation and logs it.
 * @property    clear       Clears the current inline alert.
 * @property    notify      Displays an alert as a toast and logs it.
 *
 * @see         {@link useAlerts} in `src/features/alerts/hooks/use-alerts.ts`
 */
export interface AlertsApi {
    inline: PublicAlert | null;
    formAlert: PublicAlert | null;
    fieldAlert: (field: string) => PublicAlert | null;
    present: (alert: PublicAlert, detail?: LogContext) => void;
    clear: () => void;
    notify: (alert: PublicAlert, detail?: LogContext) => void;
}

/**
 * Defines the successful outcome of a server action.
 *
 * @typeParam   T       Serializable payload returned by the server action.
 *
 * @property    ok      Discriminant identifying a successful action.
 * @property    data    Payload returned to the caller.
 * @property    [alert] Optional; user-facing confirmation associated with the result.
 *
 * @see         {@link succeed} in `src/features/alerts/result.ts`
 * @see         {@link ActionResult} in `src/features/alerts/result.ts`
 */
export interface ActionSuccess<T> {
    ok: true;
    data: T;
    alert?: PublicAlert;
}

/**
 * Defines the failed outcome of a server action.
 *
 * @property    ok      Discriminant identifying a failed action.
 * @property    alert   User-safe alert describing the failure.
 *
 * @see         {@link fail} in `src/features/alerts/result.ts`
 * @see         {@link ActionResult} in `src/features/alerts/result.ts`
 */
export interface ActionFailure {
    ok: false;
    alert: PublicAlert;
}
