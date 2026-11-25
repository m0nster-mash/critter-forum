/**
 * @fileOverview    Defines shared alert, logging, action-result, and toast contracts.
 * @module          features/alerts
 *
 * @remarks         This is the shared type boundary for the alert feature. Keep serializable client/server payloads
 *                  separate from server-only diagnostics, and keep UI props beside the feature rather than in
 *                  `src/lib/types.ts`.
 */

import {LOG_FORMATS, LOG_LEVELS} from "@/features/alerts/constants/logger";
import type {AlertPresentation, AlertSeverity, AlertVariant} from "@/features/alerts/constants/alert-types";
import {TOAST_ACTION_TYPES} from "@/features/alerts/constants/toast";
import type {ReactNode} from "react";

export type {AlertPresentation, AlertSeverity, AlertVariant} from "@/features/alerts/constants/alert-types";

/**
 * Logging level accepted by the server and client logger implementations.
 *
 * @remarks     This derives from the logger's canonical constants; use it for logger method contracts and alert log
 *              policies rather than defining another string union.
 */
export type AlertLogLevel = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS];

/** Output format accepted by the server logger configuration. */
export type LogFormat = (typeof LOG_FORMATS)[keyof typeof LOG_FORMATS];

/**
 * Structured, serializable context attached to a log event.
 *
 * @remarks     Use for diagnostic metadata, not arbitrary request objects. The server logger sanitizes sensitive keys;
 *              client log context must remain safe for browser exposure.
 */
export type LogContext = Record<string, unknown>;

/**
 * Common logger interface implemented independently by the server and browser logger adapters.
 *
 * @remarks     This interface describes the shared call surface only. Implementations and environment-specific
 *              sanitization remain in `server/logger.ts` and `client/logger.ts`.
 *
 * @property    debug       Writes a debug-level event.
 * @property    info        Writes an informational event.
 * @property    warn        Writes a warning event.
 * @property    error       Writes an error event.
 * @property    child       Creates a logger with persistent structured bindings.
 *
 * @see         `logger` in `src/features/alerts/server/logger.ts`.
 * @see         `clientLogger` in `src/features/alerts/client/logger.ts`.
 */
export interface Logger {
    /** Writes a debug-level event with optional structured context. */
    debug(message: string, context?: LogContext): void;
    /** Writes an informational event with optional structured context. */
    info(message: string, context?: LogContext): void;
    /** Writes a warning event with optional structured context. */
    warn(message: string, context?: LogContext): void;
    /** Writes an error event with optional structured context. */
    error(message: string, context?: LogContext): void;
    /** Creates a logger that adds bindings to every subsequent entry. */
    child(bindings: LogContext): Logger;
}

/**
 * Per-environment logging policy attached to an alert definition.
 *
 * @remarks     Set a level to `false` to suppress logging in that environment. The registry, not the component, owns
 *              this decision.
 *
 * @property    server  Server log level, or `false` to suppress the server log.
 * @property    client  Browser log level, or `false` to suppress the client log.
 *
 * @see         `AlertDefinition` in this file.
 */
export interface AlertLogPolicy {
    server: AlertLogLevel | false;
    client: AlertLogLevel | false;
}

/**
 * Canonical registry definition for one user-facing alert code.
 *
 * @remarks     Feature registries define these values and `registry.ts` combines them. Call sites select a code and
 *              optional params; they must not supply free-form message text.
 *
 * @property    severity        Default severity for this alert.
 * @property    message         User-safe template; named tokens may be substituted through `params`.
 * @property    presentation    Default rendering mode.
 * @property    log             Server/client logging policy.
 * @property    [field]         Default form field associated with this alert.
 *
 * @see         `ALERT_REGISTRY` in `src/features/alerts/registry.ts`.
 */
export interface AlertDefinition {
    severity: AlertSeverity;
    message: string;
    presentation: AlertPresentation;
    log: AlertLogPolicy;
    field?: string;
}

/**
 * Serializable alert payload that may cross a server/client boundary.
 *
 * @remarks     Contains only user-safe presentation data. Never attach an Error, stack, request, database row, or other
 *              internal diagnostic object. Add diagnostic detail to logger context instead.
 *
 * @property    code            Stable key into the alert registry.
 * @property    severity        Severity used for visual and accessibility treatment.
 * @property    message         Final user-safe message after template substitution.
 * @property    presentation    Where the alert should be presented.
 * @property    [field]         Optional form field identifier for field-level inline alerts.
 * @property    [ref]           Optional reference matching a server log entry.
 *
 * @see         `createAlert` in `src/features/alerts/create-alert.ts`.
 * @see         `ActionFailure` in this file.
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
 * Optional per-call overrides when creating a registry-backed alert.
 *
 * @remarks     There is intentionally no `message` property. Keep user-facing copy in the registry and pass dynamic
 *              interpolation values through `params`.
 *
 * @property    [severity]       Override the registry severity.
 * @property    [presentation]   Override the registry presentation.
 * @property    [field]          Associate the alert with a form field.
 * @property    [ref]            Reference to the corresponding server log entry.
 * @property    [params]         Primitive values substituted into named message tokens.
 *
 * @see         `createAlert` in `src/features/alerts/create-alert.ts`.
 */
export interface AlertOverrides {
    severity?: AlertSeverity;
    presentation?: AlertPresentation;
    field?: string;
    ref?: string;
    params?: Record<string, string | number>;
}

/**
 * Props for the reusable alert banner component.
 *
 * @remarks     Use for page-, form-, field-, and toast-level alert rendering. The component intentionally accepts an
 *              absent alert so callers can render it conditionally without duplicating wrapper logic.
 *
 * @property    alert       Alert to render; `null` or `undefined` renders no content.
 * @property    [id]        DOM id, commonly referenced by a form control's `aria-describedby`.
 * @property    [variant]   Layout variant; defaults to the banner presentation.
 * @property    [count]     Number of merged occurrences represented by this banner.
 * @property    [action]    Optional trailing React content, such as a dismiss control.
 *
 * @see         `AlertBanner` in `src/features/alerts/components/alert-banner.tsx`.
 */
export interface AlertBannerProps {
    alert: PublicAlert | null | undefined;
    id?: string;
    variant?: AlertVariant;
    count?: number;
    action?: ReactNode;
}

/**
 * One toast entry in the client notification stack.
 *
 * @remarks     `count` merges identical notifications. `version` changes whenever the entry is refreshed so the
 *              viewport can restart its dismissal timer.
 *
 * @property    id       Stable identifier used for dismissal.
 * @property    alert    Serializable alert shown by this toast.
 * @property    count    Number of occurrences represented.
 * @property    version  Revision counter for timer refresh behaviour.
 *
 * @see         `toast-state.ts` and `ToastViewport` in `src/features/alerts/`.
 */
export interface ToastItem {
    id: string;
    alert: PublicAlert;
    count: number;
    version: number;
}

/**
 * Discriminated actions accepted by the toast-state reducer.
 *
 * @remarks     Use only in the toast reducer/state layer. UI components should call the provider API rather than
 *              constructing reducer actions directly.
 *
 * @see         `toast-state.ts` in `src/features/alerts/client/`.
 */
export type ToastAction =
    | {type: typeof TOAST_ACTION_TYPES.ADD; id: string; alert: PublicAlert}
    | {type: typeof TOAST_ACTION_TYPES.DISMISS; id: string}
    | {type: typeof TOAST_ACTION_TYPES.CLEAR};

/**
 * Options for constructing an expected, registry-backed alert error.
 *
 * @remarks     Extends alert creation overrides with server-only diagnostic information. `cause` and `detail` must
 *              never be copied into `PublicAlert`.
 *
 * @property    [cause]     Underlying error or value that caused the expected failure.
 * @property    [detail]    Structured diagnostic context written to server logs.
 *
 * @see         `AlertError` in `src/features/alerts/server/alert-error.ts`.
 */
export interface AlertErrorOptions extends AlertOverrides {
    cause?: unknown;
    detail?: LogContext;
}

/**
 * Normalized error details retained by the server logger.
 *
 * @remarks     This is a server diagnostic shape, not a transport type. Do not return it from server actions or expose
 *              it to client components.
 *
 * @property    name        Error name or diagnostic type.
 * @property    message     Diagnostic message retained for logging.
 * @property    [stack]     Optional stack trace.
 * @property    [cause]     Optional nested cause.
 * @property    [extra]     Additional enumerable diagnostic properties.
 *
 * @see         `SerializedError` handling in `src/features/alerts/server/logger.ts`.
 */
export interface SerializedError {
    name: string;
    message: string;
    stack?: string;
    cause?: unknown;
    [extra: string]: unknown;
}

/**
 * Props for the toast viewport component.
 *
 * @remarks     The viewport owns toast presentation and timeout behaviour; callers supply ordered state and a dismissal
 *              callback.
 *
 * @property    toasts      Current toast entries, oldest first.
 * @property    onDismiss   Callback receiving the identifier of the dismissed toast.
 *
 * @see         `ToastViewport` in `src/features/alerts/components/toast-viewport.tsx`.
 */
export interface ToastViewportProps {
    toasts: ToastItem[];
    onDismiss: (id: string) => void;
}

/**
 * Context value exposed by the alert provider.
 *
 * @remarks     This lower-level API manages toast notifications. Use `AlertsApi` from `useAlerts` for the combined
 *              toast and inline presentation API.
 *
 * @property    toasts      Toast entries currently on screen.
 * @property    notify      Adds a toast and logs according to the alert registry.
 * @property    dismiss     Removes one toast by identifier.
 * @property    clear       Removes all toast entries.
 *
 * @see         `AlertProvider` in `src/features/alerts/client/provider.ts`.
 */
export interface AlertContextValue {
    toasts: ToastItem[];
    notify: (alert: PublicAlert, detail?: LogContext) => void;
    dismiss: (id: string) => void;
    clear: () => void;
}

/**
 * Props for the provider's content component.
 *
 * @remarks     Internal composition contract: the provider supplies its context value and wraps application children.
 *              Feature consumers should use `AlertProvider` rather than rendering this component directly.
 *
 * @property    children  Application subtree rendered inside the provider.
 * @property    value     Context value supplied by the provider.
 *
 * @see         `AlertProviderContent` in `src/features/alerts/components/alert-provider-content.tsx`.
 */
export interface AlertProviderContentProps {
    children: ReactNode;
    value: AlertContextValue;
}

/**
 * Combined inline-alert and toast API returned by the `useAlerts` hook.
 *
 * @remarks     Holds at most one inline alert per hook instance. Clear the previous inline state before beginning a new
 *              submission flow. Toast notifications are delegated to the provider.
 *
 * @property    inline      Current inline alert, or `null`.
 * @property    formAlert   Current inline alert when it has no field association.
 * @property    fieldAlert  Returns the inline alert associated with a field, or `null`.
 * @property    present     Routes an alert by its registry presentation and logs it per client policy.
 * @property    clear       Clears the current inline alert.
 * @property    notify      Displays a toast and logs it per registry policy.
 *
 * @see         `useAlerts` in `src/features/alerts/client/use-alerts.ts`.
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
 * Successful result returned by a safe server action.
 *
 * @typeParam   T   Serializable payload returned by the action.
 *
 * @remarks     Use as one branch of `ActionResult<T>`. Keep `data` serializable because it crosses the server/client
 *              boundary.
 *
 * @property    ok      Literal success discriminant.
 * @property    data    Serializable action payload.
 * @property    [alert] Optional confirmation alert.

 */
export interface ActionSuccess<T> {
    ok: true;
    data: T;
    alert?: PublicAlert;
}

/**
 * Failed result returned by a safe server action.
 *
 * @remarks     Expected failures carry a user-safe `PublicAlert`; internal causes and stack traces remain server-side.
 *
 * @property    ok      Literal failure discriminant.
 * @property    alert   User-safe alert describing the expected failure.
 */
export interface ActionFailure {
    ok: false;
    alert: PublicAlert;
}
