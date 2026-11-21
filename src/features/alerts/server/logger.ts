/**
 * TODO: document
 *
 * @module features/alerts/server/logger
 * @status Requires documentation
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

// ============================================================================
// CONFIG
// ============================================================================

/**
 * Resolves logging config from the environment on every call, so it can change without a restart of the module.
 *
 * - `LOG_LEVEL`:  `debug | info | warn | error`. Default: `debug` in development, `info` in production.
 * - `LOG_FORMAT`: `pretty | json`. Default: `json` in production, `pretty` everywhere else.
 */
function getConfig(): { minLevel: AlertLogLevel; format: LogFormat } {
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

// ============================================================================
// NORMALIZATION (safe to serialize: no circular refs, no raw Errors, secrets redacted)
// ============================================================================

/**
 * Drizzle appends the bound query parameters to failed-query errors (`Failed query: ...\nparams: a@b.c,<hash>`).
 * Those can hold emails and password hashes, and key-based redaction can't see inside a message string, so the
 * parameter list is cut out of both the message and the stack. The SQL itself is kept.
 */
function redactQueryParams(text: string): string {
    return text.replace(QUERY_PARAMS_PATTERN, QUERY_PARAMS_REDACTION);
}

/**
 * TODO: document
 *
 * @status Requires documentation
 * @param error - TODO: document
 * @param depth - TODO: document
 * @param ancestors - TODO: document
 * @returns TODO: document
 */
function serializeError(error: Error, depth: number, ancestors: WeakSet<object>): SerializedError {
    ancestors.add(error);

    const serialized: SerializedError = {
        name: error.name,
        message: redactQueryParams(error.message),
        stack: error.stack === undefined ? undefined : redactQueryParams(error.stack),
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
 * TODO: document
 *
 * @status Requires documentation
 * @param value - TODO: document
 * @param depth - TODO: document
 * @param ancestors - TODO: document
 * @returns TODO: document
 */
function normalize(value: unknown, depth: number, ancestors: WeakSet<object>): unknown {
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
            entries[key] = SENSITIVE_LOG_KEY_PATTERN.test(key) ? LOGGER_REDACTION.REDACTED : normalize(inner, depth + 1, ancestors);
        }
        result = entries;
    }

    ancestors.delete(object);
    return result;
}

// ============================================================================
// FORMATTING
// ============================================================================

/**
 * TODO: document
 *
 * @status Requires documentation
 * @param value - TODO: document
 * @returns TODO: document
 */
function isSerializedError(value: unknown): value is SerializedError {
    return typeof value === "object" && value !== null
        && typeof (value as SerializedError).name === "string"
        && typeof (value as SerializedError).message === "string"
        && ("stack" in value);
}

/**
 * TODO: document
 *
 * @status Requires documentation
 * @param level - TODO: document
 * @param message - TODO: document
 * @param data - TODO: document
 * @returns TODO: document
 */
function formatJson(level: AlertLogLevel, message: string, data: LogContext): string {
    const record: LogContext = {
        [LOGGER_JSON_KEYS.LEVEL]: level,
        [LOGGER_JSON_KEYS.TIME]: new Date().toISOString(),
        [LOGGER_JSON_KEYS.MESSAGE]: message,
    };

    for (const [key, value] of Object.entries(data)) {
        // TODO:: fix this linting error
        record[LOGGER_RESERVED_JSON_KEYS.includes(key) ? `${LOGGER_JSON_KEYS.CONTEXT_PREFIX}${key}` : key] = value;
    }

    return JSON.stringify(record);
}

/**
 * TODO: document
 *
 * @status Requires documentation
 * @param error - TODO: document
 * @param indent - TODO: document
 * @returns TODO: document
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
 * Whether to color pretty output. Reads `stdout` through `globalThis` so the Edge bundler, which also compiles
 * `instrumentation.ts`, doesn't flag a Node-only API; on Edge the property is simply absent and colors are off.
 */
function colorEnabled(): boolean {
    const runtime = (globalThis as {
        process?: { stdout?: { isTTY?: boolean }; env?: Record<string, string | undefined> }
    }).process;
    return Boolean(runtime?.stdout?.isTTY) && !runtime?.env?.NO_COLOR;
}

/**
 * TODO: document
 *
 * @status Requires documentation
 * @param level - TODO: document
 * @param message - TODO: document
 * @param data - TODO: document
 * @returns TODO: document
 */
function formatPretty(level: AlertLogLevel, message: string, data: LogContext): string {
    const now = new Date();
    const pad = (n: number, width = 2) => String(n).padStart(width, "0");
    const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}.${pad(now.getMilliseconds(), 3)}`;

    const plain: LogContext = {};
    const errorLines: string[] = [];

    for (const [key, value] of Object.entries(data)) {
        if (isSerializedError(value)) {
            errorLines.push(`  ${key} →`, ...describeError(value, "    ")); // TODO:: replace → with icon
        } else {
            plain[key] = value;
        }
    }

    const label = level.toUpperCase().padEnd(5);
    const colored = colorEnabled() ? `${LOGGER_ANSI.PREFIX}${LOGGER_ANSI_COLORS[level]}${LOGGER_ANSI.COLOR_SUFFIX}${label}${LOGGER_ANSI.RESET}` : label;
    const context = Object.keys(plain).length > 0 ? ` ${JSON.stringify(plain)}` : "";

    return [`${time} ${colored} ${message}${context}`, ...errorLines].join("\n");
}

// ============================================================================
// LOGGER
// ============================================================================

/**
 * TODO: document
 *
 * @status Requires documentation
 * @param level - TODO: document
 * @param message - TODO: document
 * @param bindings - TODO: document
 * @param context - TODO: document
 */
function emit(level: AlertLogLevel, message: string, bindings: LogContext, context?: LogContext): void {
    const {minLevel, format} = getConfig();
    if (LOG_LEVEL_ORDER[level] < LOG_LEVEL_ORDER[minLevel]) return;

    const data = normalize({...bindings, ...context}, 0, new WeakSet()) as LogContext;
    const line = format === LOG_FORMATS.JSON ? formatJson(level, message, data) : formatPretty(level, message, data);

    console[level](line);
}

/**
 * Creates a logger with optional fixed bindings added to every entry.
 *
 * @param   {LogContext}    [bindings]  Optional; key-value pairs merged into every entry
 *
 * @return  {Logger}    The logger instance.
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

/**
 * The shared server logger.
 */
export const logger: Logger = createLogger();
