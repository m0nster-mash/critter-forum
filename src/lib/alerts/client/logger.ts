import {AlertLogLevel, ClientLogger} from "@/lib/alerts/types";
import {
    ALERT_LOG_LEVEL_ORDER,
    ALERT_LOG_LEVEL_SILENT,
    ALERT_LOG_LEVELS,
    BEARER_REDACTED,
    DEFAULT_LOG_LEVEL,
    NODE_ENV_PRODUCTION,
    PRODUCTION_LOG_LEVEL,
    REDACTED,
    SENSITIVE_LOG_KEY,
} from "@/lib/constants/alerts";

export type ClientLogContext = Record<string, unknown>;

/**
 * Returns a sanitized copy of a value, redacting sensitive property names, bearer tokens, and email addresses. Arrays
 * and nested objects are sanitized recursively; other values are returned unchanged.
 *
 * @param   {unknown}   value   Value to sanitize before it is written to a client log
 * @param   {string}    [key]   Property name used to detect sensitive values
 *
 * @return  {unknown}           Sanitized value
 */
function sanitize(value: unknown, key: string = ""): unknown {
    if (SENSITIVE_LOG_KEY.test(key)) {
        return REDACTED;
    }

    if (typeof value === "string") {
        return value
            .replace(/Bearer\s+\S+/gi, BEARER_REDACTED)
            .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, REDACTED);
    }

    if (Array.isArray(value)) {
        return value.map((item) => sanitize(item));
    }

    if (value && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value).map(([childKey, childValue]) => [
                childKey,
                sanitize(childValue, childKey),
            ])
        );
    }

    return value;
}

/**
 * Resolves the minimum client log level from the public environment setting, using safe environment defaults.
 * Production defaults to warnings; other environments default to debug.
 *
 * @return  {AlertLogLevel | typeof ALERT_LOG_LEVEL_SILENT}     Configured minimum log level
 */
function getMinimumLevel(): AlertLogLevel | typeof ALERT_LOG_LEVEL_SILENT {
    if (process.env.NODE_ENV === NODE_ENV_PRODUCTION) {
        return PRODUCTION_LOG_LEVEL;
    }

    const configured = process.env.NEXT_PUBLIC_ALERT_LOG_LEVEL;

    return configured && Object.hasOwn(ALERT_LOG_LEVEL_ORDER, configured)
        ? configured as AlertLogLevel | typeof ALERT_LOG_LEVEL_SILENT
        : DEFAULT_LOG_LEVEL;
}

/**
 * Emits a structured client log entry when the requested severity meets the configured minimum level. Production
 * output is reduced to safe fields; development output retains sanitized context.
 *
 * @param   {AlertLogLevel}     level       Severity of the log entry
 * @param   {string}            message     Human-readable log message
 * @param   {ClientLogContext}  bindings    Logger-level context inherited by each entry
 * @param   {ClientLogContext}  [context]   Per-entry context
 */
function emit(
    level: AlertLogLevel,
    message: string,
    bindings: ClientLogContext,
    context: ClientLogContext = {},
): void {
    if (ALERT_LOG_LEVEL_ORDER[level] < ALERT_LOG_LEVEL_ORDER[getMinimumLevel()]) {
        return;
    }

    const data = {...bindings, ...context};

    if (process.env.NODE_ENV === NODE_ENV_PRODUCTION) {
        const safe = sanitize({
            code: data.code,
            message,
            ref: data.ref,
        }) as ClientLogContext;

        const line = JSON.stringify({level, ...safe});

        if (level === PRODUCTION_LOG_LEVEL) {
            console.warn(line);
        } else if (level === ALERT_LOG_LEVELS.ERROR) {
            console.error(line);
        }

        return;
    }

    const safe = sanitize(data) as ClientLogContext;

    if (level === DEFAULT_LOG_LEVEL) {
        console.debug(message, safe);
    } else if (level === ALERT_LOG_LEVELS.INFO) {
        console.info(message, safe);
    } else if (level === PRODUCTION_LOG_LEVEL) {
        console.warn(message, safe);
    } else {
        console.error(message, safe);
    }
}

/**
 * Creates a client logger whose methods merge fixed bindings with optional per-call context. Child loggers inherit
 * existing bindings and add their own.
 *
 * @param   {ClientLogContext}  [bindings]  Context attached to every entry from this logger
 *
 * @return  {ClientLogger}                  Configured client logger
 */
export function createClientLogger(bindings: ClientLogContext = {}): ClientLogger {
    return {
        debug: (message, context) => emit(DEFAULT_LOG_LEVEL, message, bindings, context),
        info: (message, context) => emit(ALERT_LOG_LEVELS.INFO, message, bindings, context),
        warn: (message, context) => emit(PRODUCTION_LOG_LEVEL, message, bindings, context),
        error: (message, context) => emit(ALERT_LOG_LEVELS.ERROR, message, bindings, context),
        child: (childBindings) => createClientLogger({...bindings, ...childBindings}),
    };
}

export const clientLogger = createClientLogger();
