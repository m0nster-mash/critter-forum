/**
 * @fileOverview    Provides structured logging with environment-specific filtering and sanitization.
 * @module          features/alerts
 *
 * @status          Requires refactoring
 */

import {
    LOG_FORMATS,
    LOG_LEVEL_ORDER,
    LOG_LEVELS,
    LOGGER_ANSI,
    LOGGER_ANSI_COLORS,
    LOGGER_DEFAULT_FORMATS,
    LOGGER_DEFAULT_LEVELS,
    LOGGER_ENVIRONMENTS,
    LOGGER_JSON_KEYS,
    LOGGER_REDACTION,
    LOGGER_RESERVED_JSON_KEYS,
    LOGGER_TEXT,
    QUERY_PARAMS_PATTERN,
    QUERY_PARAMS_REDACTION,
    SENSITIVE_LOG_KEY_PATTERN,
} from "@/features/alerts/constants/logger";
import type {AlertLogLevel, LogContext, LogFormat, Logger, SerializedError} from "@/features/alerts/types";

export type {LogContext, Logger};

/**
 * Returns true when `key` is one of the logger-owned JSON envelope fields.
 *
 * @remarks     Keys are renamed with a prefix so caller-supplied context cannot collide with them.
 *
 * @param       key         The logged JSON key to search for
 *
 * @return      {boolean}   `true` if the `key` is found within the array, or else `false`.
 */
function isReservedJsonKey(key: string): key is (typeof LOGGER_RESERVED_JSON_KEYS)[number] {
    return LOGGER_RESERVED_JSON_KEYS.includes(key as (typeof LOGGER_RESERVED_JSON_KEYS)[number]);
}

/**
 * Resolves logging config from the environment on every call, so it can change without a restart of the module.
 *
 * @remarks     `LOG_LEVEL`:  `debug | info | warn | error`. Default: `debug` in development, `info` in production.
 * @remarks     `LOG_FORMAT`: `pretty | json`. Default: `json` in production, `pretty` everywhere else.
 *
 * @returns     The value produced by this operation.
 */
function getConfig(): {
    minLevel: AlertLogLevel;
    format: LogFormat
} {

    const isProduction = process.env.NODE_ENV === LOGGER_ENVIRONMENTS.PRODUCTION;
    const requestedLevel = process.env.LOG_LEVEL?.toLowerCase();
    const requestedFormat = process.env.LOG_FORMAT?.toLowerCase();

    return {
        minLevel: requestedLevel && Object.hasOwn(LOG_LEVEL_ORDER, requestedLevel)
            ? (requestedLevel as AlertLogLevel)
            : isProduction ? LOGGER_DEFAULT_LEVELS.SERVER_PRODUCTION : LOGGER_DEFAULT_LEVELS.SERVER_DEVELOPMENT,
        format: requestedFormat === LOG_FORMATS.JSON || requestedFormat === LOG_FORMATS.PRETTY
            ? requestedFormat
            : isProduction ? LOGGER_DEFAULT_FORMATS.PRODUCTION : LOGGER_DEFAULT_FORMATS.DEVELOPMENT,
    };
}

/**
 * Drizzle appends the bound query parameters to failed-query errors.
 *
 * @remarks     Those can hold emails and password hashes, and key-based redaction can't see inside a message string,
 *              so the parameter list is cut out of both the message and the stack.
 * @remarks     The SQL itself is kept.
 *
 * @param       text    Value used by this text operation.
 *
 * @returns     The value produced by this operation.
 */
function redactQueryParams(text: string): string {

    return text.replace(QUERY_PARAMS_PATTERN, QUERY_PARAMS_REDACTION);
}

/**
 * Provides structured logging with environment-specific filtering and sanitization.
 *
 * @param   error       Thrown value or error object to inspect.
 * @param   depth       Maximum or current traversal depth for nested values.
 * @param   ancestors   Values already visited while traversing nested data.
 *
 * @returns The value produced by this operation.
 */
function serializeError(
    error: Error,
    depth: number,
    ancestors: WeakSet<object>
): SerializedError {

    ancestors.add(error);

    const serialized: SerializedError = {
        name: error.name,
        message: redactQueryParams(error.message),
        stack: error.stack === undefined
            ? undefined
            : redactQueryParams(error.stack),
    };

    for (const key of Object.keys(error)) {
        if (key in serialized) continue;
        serialized[key] = SENSITIVE_LOG_KEY_PATTERN.test(key)
            ? LOGGER_REDACTION.REDACTED
            : normalize((error as unknown as Record<string, unknown>)[key], depth + 1, ancestors);
    }

    if (error.cause !== undefined) {
        serialized.cause = normalize(error.cause, depth + 1, ancestors);
    }

    ancestors.delete(error);
    return serialized;
}

/**
 * Provides structured logging with environment-specific filtering and sanitization.
 *
 * @param   value       Value being inspected or transformed.
 * @param   depth       Maximum or current traversal depth for nested values.
 * @param   ancestors   Values already visited while traversing nested data.
 *
 * @returns The value produced by this operation.
 */
function normalize(
    value: unknown,
    depth: number,
    ancestors: WeakSet<object>
): unknown {

    switch (typeof value) {
        case "string":
        case "number":
        case "boolean":
        case "undefined":
            return value;
        case "bigint":
            return value.toString();
        case "symbol":
            return value.toString();
        case "function":
            return LOGGER_REDACTION.FUNCTION;
    }

    if (value === null) return null;

    const object = value as object;

    if (depth >= LOGGER_REDACTION.MAX_NESTING_DEPTH) return LOGGER_REDACTION.MAX_DEPTH;
    if (ancestors.has(object)) return LOGGER_REDACTION.CIRCULAR;
    if (object instanceof Error) return serializeError(object, depth, ancestors);
    if (object instanceof Date) return object.toISOString();

    ancestors.add(object);
    let result: unknown;

    if (Array.isArray(object)) {
        result = object.map((item) => normalize(item, depth + 1, ancestors));
    } else {
        const entries: Record<string, unknown> = {};
        for (const [key, inner] of Object.entries(object)) {
            if (inner === undefined) continue;
            entries[key] = SENSITIVE_LOG_KEY_PATTERN.test(key)
                ? LOGGER_REDACTION.REDACTED
                : normalize(inner, depth + 1, ancestors);
        }
        result = entries;
    }

    ancestors.delete(object);
    return result;
}

/**
 * Provides the isSerializedError functionality.
 *
 * @param   value   Value being inspected or transformed.
 *
 * @returns The value produced by this operation.
 */
function isSerializedError(value: unknown): value is SerializedError {

    return typeof value === "object" && value !== null
        && typeof (value as SerializedError).name === "string"
        && typeof (value as SerializedError).message === "string"
        && ("stack" in value);
}

/**
 * Provides structured logging with environment-specific filtering and sanitization.
 *
 * @param   level   Severity level used to filter and emit the log entry.
 * @param   message Human-readable event message written at the selected log level.
 * @param   data    Serializable payload returned by the operation.
 *
 * @returns The value produced by this operation.
 */
function formatJson(
    level: AlertLogLevel,
    message: string,
    data: LogContext
): string {

    const record: LogContext = {
        [LOGGER_JSON_KEYS.LEVEL]: level,
        [LOGGER_JSON_KEYS.TIME]: new Date().toISOString(),
        [LOGGER_JSON_KEYS.MESSAGE]: message,
    };

    for (const [key, value] of Object.entries(data)) {
        if (isReservedJsonKey(key)) {
            record[`${LOGGER_JSON_KEYS.CONTEXT_PREFIX}${key}`] = value;
        } else {
            record[key] = value;
        }
    }

    return JSON.stringify(record);
}

/**
 * Provides the describeError functionality.
 *
 * @param   error   Thrown value or error object to inspect.
 * @param   indent  Value used by this indent operation.
 *
 * @returns The value produced by this operation.
 */
function describeError(error: SerializedError, indent: string): string[] {
    const {name, message, stack, cause, ...extras} = error;
    const lines = [`${indent}${stack ?? `${name}: ${message}`}`];

    if (Object.keys(extras).length > 0) {
        lines.push(`${indent}  ${JSON.stringify(extras)}`);
    }
    if (isSerializedError(cause)) {
        lines.push(`${indent}${LOGGER_TEXT.CAUSED_BY}`, ...describeError(cause, indent));
    } else if (cause !== undefined) {
        lines.push(`${indent}${LOGGER_TEXT.CAUSED_BY} ${JSON.stringify(cause)}`);
    }

    return lines;
}

/**
 * Determines whether to colour pretty output.
 *
 * @remarks     Reads `stdout` through `globalThis` so the Edge bundler.
 * @remarks     Doesn't flag a Node-only API; on Edge the property is simply absent and colours are off.
 *
 * @returns     The value produced by this operation.
 */
function colorEnabled(): boolean {

    const runtime = (globalThis as {
        process?: { stdout?: { isTTY?: boolean }; env?: Record<string, string | undefined> }
    }).process;

    return Boolean(runtime?.stdout?.isTTY) && !runtime?.env?.NO_COLOR;
}

/**
 * Provides structured logging with environment-specific filtering and sanitization.
 *
 * @param       level       Severity level used to filter and emit the log entry.
 * @param       message     Human-readable event message written at the selected log level.
 * @param       data        Serializable payload returned by the operation.
 *
 * @returns     The value produced by this operation.
 */
function formatPretty(
    level: AlertLogLevel,
    message: string,
    data: LogContext
): string {

    const now = new Date();
    const pad = (n: number, width = 2) => String(n).padStart(width, "0");
    const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}.${pad(now.getMilliseconds(), 3)}`;

    const plain: LogContext = {};
    const errorLines: string[] = [];

    for (const [key, value] of Object.entries(data)) {
        if (isSerializedError(value)) {
            errorLines.push(`  ${key} →`, ...describeError(value, "    "));
        } else {
            plain[key] = value;
        }
    }

    const label = level.toUpperCase().padEnd(5);
    const colored = colorEnabled() ? `${LOGGER_ANSI.PREFIX}${LOGGER_ANSI_COLORS[level]}${LOGGER_ANSI.COLOR_SUFFIX}${label}${LOGGER_ANSI.RESET}` : label;
    const context = Object.keys(plain).length > 0 ? ` ${JSON.stringify(plain)}` : "";

    return [`${time} ${colored} ${message}${context}`, ...errorLines].join("\n");
}

/**
 * Provides structured logging with environment-specific filtering and sanitization.
 *
 * @param   level       Severity level used to filter and emit the log entry.
 * @param   message     Human-readable event message written at the selected log level.
 * @param   bindings    Structured key-value data included with every log entry.
 *
 * @param   context     Optional structured data attached to this log entry.
 */
function emit(
    level: AlertLogLevel,
    message: string,
    bindings: LogContext,
    context?: LogContext
): void {

    const {minLevel, format} = getConfig();
    if (LOG_LEVEL_ORDER[level] < LOG_LEVEL_ORDER[minLevel]) return;

    const data = normalize({...bindings, ...context}, 0, new WeakSet()) as LogContext;
    const line = format === LOG_FORMATS.JSON
        ? formatJson(level, message, data)
        : formatPretty(level, message, data);

    console[level](line);
}

/**
 * Creates a logger with optional fixed bindings added to every entry.
 *
 * @param       bindings    Optional; key-value pairs merged into every entry
 *
 * @returns     {Logger}    The logger instance.
 */
export function createLogger(bindings: LogContext = {}): Logger {

    return {
        debug: (message, context) => emit(LOG_LEVELS.DEBUG, message, bindings, context),
        info: (message, context) => emit(LOG_LEVELS.INFO, message, bindings, context),
        warn: (message, context) => emit(LOG_LEVELS.WARN, message, bindings, context),
        error: (message, context) => emit(LOG_LEVELS.ERROR, message, bindings, context),
        child: (childBindings) => createLogger({...bindings, ...childBindings}),
    };
}

/** The shared server logger. */
export const logger: Logger = createLogger();
