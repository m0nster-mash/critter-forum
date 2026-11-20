import {
    CLIENT_LOG_ERROR_KEY,
    CLIENT_LOG_ERROR_NAME_KEY,
    CLIENT_LOG_SAFE_KEYS,
    LOG_LEVEL_ORDER,
    LOG_LEVELS,
    LOGGER_DEFAULT_LEVELS,
    LOGGER_ENVIRONMENTS,
    MAX_CLIENT_LOG_VALUE_LENGTH,
} from "@/features/alerts/constants/logger";
import type {AlertLogLevel, LogContext, Logger} from "@/features/alerts/types";

/**
 * Browser-side logger. Same interface as the server logger, but the browser console is public, so output is
 * sanitized in production.
 *
 * - Development: everything is passed to the console as-is, so devtools can inspect errors and objects.
 * - Production: only allow-listed keys with primitive values survive (code, ref, severity, field, scope, digest,
 *   status), strings are truncated, and an `err` is reduced to its name. Messages, stacks and anything else are
 *   dropped.
 *
 * `NEXT_PUBLIC_LOG_LEVEL` (`debug | info | warn | error`) sets the minimum level. Default: `debug` in development,
 * `warn` in production. It controls how much is logged, never how much detail: detail is development-only.
 */

const SAFE_KEYS = new Set<string>(CLIENT_LOG_SAFE_KEYS);

/**
 * Reads config from the environment on every call. `process.env.NEXT_PUBLIC_*` must be referenced statically so
 * Next can inline it into the client bundle.
 *
 * @return TODO:: document
 */
function getConfig(): { minLevel: AlertLogLevel; verbose: boolean } {
    const isProduction = process.env.NODE_ENV === LOGGER_ENVIRONMENTS.PRODUCTION;
    const requested = process.env.NEXT_PUBLIC_LOG_LEVEL?.toLowerCase();

    return {
        minLevel: requested && Object.hasOwn(LOG_LEVEL_ORDER, requested)
            ? (requested as AlertLogLevel)
            : isProduction ? LOGGER_DEFAULT_LEVELS.CLIENT_PRODUCTION : LOGGER_DEFAULT_LEVELS.CLIENT_DEVELOPMENT,
        verbose: !isProduction,
    };
}

/**
 * TODO:: document
 *
 * @param context TODO:: document
 */
function sanitize(context: LogContext): LogContext {
    const safe: LogContext = {};

    for (const [key, value] of Object.entries(context)) {
        if (SAFE_KEYS.has(key)) {
            if (typeof value === "string") {
                safe[key] = value.slice(0, MAX_CLIENT_LOG_VALUE_LENGTH);
            } else if (typeof value === "number" || typeof value === "boolean") {
                safe[key] = value;
            }
        } else if (key === CLIENT_LOG_ERROR_KEY && value instanceof Error) {
            safe[CLIENT_LOG_ERROR_NAME_KEY] = value.name;
        }
    }

    return safe;
}

/**
 * TODO:: document
 *
 * @param level TODO:: document
 * @param message TODO:: document
 * @param bindings TODO:: document
 * @param context TODO:: document
 */
function emit(level: AlertLogLevel, message: string, bindings: LogContext, context?: LogContext): void {
    const {minLevel, verbose} = getConfig();
    if (LOG_LEVEL_ORDER[level] < LOG_LEVEL_ORDER[minLevel]) return;

    const merged = {...bindings, ...context};
    const data = verbose ? merged : sanitize(merged);

    if (Object.keys(data).length > 0) {
        console[level](message, data);
    } else {
        console[level](message);
    }
}

/**
 * Creates a client logger with optional fixed bindings added to every entry.
 *
 * @param   {LogContext}    [bindings]  Optional; key-value pairs merged into every entry
 *
 * @return  {Logger}    The logger instance.
 */
export function createClientLogger(bindings: LogContext = {}): Logger {

    return {
        debug: (message, context) => emit(LOG_LEVELS.DEBUG, message, bindings, context),
        info: (message, context) => emit(LOG_LEVELS.INFO, message, bindings, context),
        warn: (message, context) => emit(LOG_LEVELS.WARN, message, bindings, context),
        error: (message, context) => emit(LOG_LEVELS.ERROR, message, bindings, context),
        child: (childBindings) => createClientLogger({...bindings, ...childBindings}),
    };
}

/**
 * The shared client logger.
 */
export const clientLogger: Logger = createClientLogger();
