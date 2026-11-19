/**
 * Logger scopes used to identify the source of an event.
 */
export const LOG_SCOPES = {
    ROUTE_RENDER_ERROR: "route.render_error",
    GLOBAL_RENDER_ERROR: "global.render_error",
    WINDOW_ERROR: "window.error",
    UNHANDLED_REJECTION: "unhandledrejection",
    SEED: "seed",
} as const;

/**
 * Browser event names used by global error listeners.
 */
export const BROWSER_ERROR_EVENTS = {
    ERROR: "error",
    UNHANDLED_REJECTION: "unhandledrejection",
} as const;

/**
 * Structured log event names.
 *
 * TODO:: only seems to be used by `src/instrumentation.ts`; delete?
 */
export const LOG_EVENT_NAMES = {
    REQUEST_UNHANDLED_ERROR: "request.unhandled_error",
} as const;

/**
 * Prefixes used when logging messages from external integrations.
 */
export const LOGGER_MESSAGES = {
    BETTER_AUTH_PREFIX: "better-auth: ",
} as const;

/** Known benign browser error messages that should not produce user alerts. */
export const BROWSER_ERROR_MESSAGES = {
    SCRIPT_ERROR: "Script error.",
} as const;

/** Patterns for browser errors that are expected noise or network failures. */
export const BROWSER_ERROR_PATTERNS = {
    RESIZE_OBSERVER_LOOP: /ResizeObserver loop/i,
    FAILED_FETCH: /fetch|network|load failed/i,
} as const;

/** Message-template syntax used by createAlert interpolation. */
export const ALERT_TEMPLATE_PATTERNS = {
    PARAMETER: /\{(\w+)}/g,
} as const;
