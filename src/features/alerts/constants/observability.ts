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
 * Known browser error messages that should be ignored.
 */
export const BROWSER_ERROR_MESSAGES = {
    SCRIPT_ERROR: "Script error.",
} as const;

/**
 * Browser error-message patterns that should be ignored.
 */
export const BROWSER_ERROR_PATTERNS = {
    RESIZE_OBSERVER_LOOP: /ResizeObserver loop/i,
} as const;

/**
 * Structured log event names.
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

/**
 * Toast reducer and dispatch action identifiers.
 */
export const DISPATCH_TYPES = {
    ADD: "add",
    DISMISS: "dismiss",
    CLEAR: "clear",
} as const;

/**
 * Property names used when inspecting framework error objects.
 */
export const ERROR_PROPERTY_KEYS = {
    DIGEST: "digest",
} as const;
