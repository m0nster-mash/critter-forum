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

const SAFE_KEYS = new Set<string>(CLIENT_LOG_SAFE_KEYS);

/**
 * @module          `features/alerts`
 * @status          Requires documentation
 * @TODO            Document function
 *
 * @fileOverview    Reads config from the environment on every call. {@code process.env.NEXT_PUBLIC_*} must be
 *                  referenced statically so Next can inline it into the client bundle.
 *
 * @return          {AlertLogLevel, boolean} TODO:: document
 */
function getConfig(): {
    minLevel: AlertLogLevel;
    verbose: boolean
} {

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
 * @module          `features/alerts`
 * @status          Requires documentation
 * @TODO            Document function
 *
 * @fileOverview    TODO:: document
 *
 * @param           {LogContext}    context     TODO:: document
 *
 * @return          {LogContext}    TODO:: document
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
 * @module          `features/alerts`
 * @status          Requires documentation
 * @TODO            Document function
 *
 * @fileOverview    TODO:: document
 *
 * @param           {AlertLogLevel}     level       TODO:: document
 * @param           {string}            message     TODO:: document
 * @param           {LogContext}        bindings    TODO:: document
 * @param           {LogContext}        context     TODO:: document
 *
 * @return          {void}              TODO:: document
 */
function emit(
    level: AlertLogLevel,
    message: string,
    bindings: LogContext,
    context?: LogContext
): void {

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
 * @module          `features/alerts`
 * @status          Good
 *
 * @fileOverview    Creates a client logger with optional fixed bindings added to every entry.
 *
 * @param           {LogContext}    [bindings]  Key-value pairs merged into every entry
 *
 * @return          {Logger}        The logger instance.
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

export const clientLogger: Logger = createClientLogger();
