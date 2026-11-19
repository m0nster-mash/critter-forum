/**
 * Constants shared by alert UI components.
 *
 * Centralizes magic strings so alert banners render consistent roles,
 * live-region settings, IDs, class names, and labels.
 */

/**
 * ARIA `role` applied to alert banners based on severity.
 * Error severity uses `alert`; all other severities use `status`.
 */
export const ALERT_ROLES = {
    ERROR: "alert",
    STATUS: "status",
} as const;

/**
 * `aria-live` value applied to alert banners based on role.
 */
export const ALERT_ARIA_LIVE = {
    ASSERTIVE: "assertive",
    POLITE: "polite",
} as const;

/**
 * Severity that maps to the assertive alert role.
 */
export const ALERT_SEVERITY_ERROR = "error";

/**
 * Prefix for the `id` attribute of field-level alert banners.
 */
export const ALERT_FIELD_ID_PREFIX = "alert-";

/**
 * CSS class names for alert banners.
 */
export const ALERT_BANNER_CLASSES = {
    BASE: "alert-banner",
    SEVERITY_PREFIX: "alert-banner-",
} as const;

/**
 * Label text rendered before an alert reference ID.
 */
export const ALERT_REF_LABEL = "Reference: ";

/**
 * `clientLogger.error()` message key for uncaught window errors.
 */
export const WINDOW_UNHANDLED_ERROR = "window.unhandled_error";

/**
 * `clientLogger.error()` message key for unhandled promise rejections.
 */
export const WINDOW_UNHANDLED_REJECTION = "window.unhandled_rejection";

/**
 * DOM event type for uncaught window errors.
 */
export const WINDOW_ERROR_EVENT = "error";

/**
 * DOM event type for unhandled promise rejections.
 */
export const WINDOW_UNHANDLED_REJECTION_EVENT = "unhandledrejection";

/**
 * RegExp matching sensitive log keys that should be redacted from log output.
 */
export const SENSITIVE_LOG_KEY = /pass(word|wd)?|secret|token|authorization|cookie|api[-_]?key|credential/i;

/**
 * Redaction placeholder for sensitive log values.
 */
export const REDACTED = "[REDACTED]";

/**
 * Redaction placeholder for Bearer token values.
 */
export const BEARER_REDACTED = "Bearer [REDACTED]";

/**
 * `process.env.NODE_ENV` value indicating production.
 */
export const NODE_ENV_PRODUCTION = "production";

/**
 * Environment variable name used to configure the minimum client alert log level.
 */
export const NEXT_PUBLIC_ALERT_LOG_LEVEL = "NEXT_PUBLIC_ALERT_LOG_LEVEL";

/**
 * Default minimum client alert log level when none is configured.
 */
export const DEFAULT_LOG_LEVEL = "debug";

/**
 * Minimum client alert log level used in production.
 */
export const PRODUCTION_LOG_LEVEL = "warn";

/**
 * Keys included in the JSON log line emitted in production.
 */
export const LOG_JSON_KEYS = {
    LEVEL: "level",
    CODE: "code",
    MESSAGE: "message",
    REF: "ref",
} as const;


/** Numeric ordering used to compare configured client log levels. */
export const ALERT_LOG_LEVEL_ORDER = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40,
    silent: 50,
} as const;

/** Log-level value that disables client logging. */
export const ALERT_LOG_LEVEL_SILENT = "silent";

/** Maximum number of toast notifications kept in the viewport at once. */
export const MAX_TOASTS = 5;

/** Auto-dismiss durations in milliseconds, indexed by alert severity. */
export const TOAST_DURATIONS = {
    success: 5000,
    info: 5000,
    warning: 8000,
    error: 10000,
} as const;

/** Toast reducer action discriminants. */
export const TOAST_ACTION_TYPES = {
    ADD: "add",
    DISMISS: "dismiss",
} as const;

/** Shared text and accessibility values used by the toast viewport. */
export const TOAST_UI = {
    VIEWPORT_CLASS: "alert-toast-viewport",
    VIEWPORT_LABEL: "Notifications",
    ALERT_ROLE: "alert",
    STATUS_ROLE: "status",
    ASSERTIVE_LIVE: "assertive",
    POLITE_LIVE: "polite",
    DISMISS_LABEL: "Dismiss notification",
    REFERENCE_LABEL: "Reference: ",
} as const;

/** Stable name assigned to AlertError instances. */
export const ALERT_ERROR_NAME = "AlertError";

/** Generic alert code used when an unexpected error is caught. */
export const APP_UNKNOWN_ERROR_CODE = "APP_UNKNOWN_ERROR";

/** Severity values used when deciding whether a server alert needs a reference ID. */
export const ALERT_SEVERITY_WARNING = "warning";


/** Canonical client logger severity names. */
export const ALERT_LOG_LEVELS = {
    DEBUG: "debug",
    INFO: "info",
    WARN: "warn",
    ERROR: "error",
} as const;
