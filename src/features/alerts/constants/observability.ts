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
 *
 * TODO:: if there are no uses for this, delete it
 */
export const LOGGER_MESSAGES = {
    BETTER_AUTH_PREFIX: "better-auth: ",
} as const;
