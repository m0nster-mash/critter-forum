import type {AlertLogLevel, LogContext, Logger} from "@/features/alerts/types";

export type {LogContext, Logger};

const LEVEL_ORDER: Record<AlertLogLevel, number> = {debug: 10, info: 20, warn: 30, error: 40};
const REDACTED = "[REDACTED]";
const SENSITIVE_KEY = /pass(word|wd)?|secret|token|authorization|cookie|api[-_]?key|credential/i;
const MAX_DEPTH = 6;
const RESERVED_KEYS = ["level", "time", "msg"];

type LogFormat = "pretty" | "json";

interface SerializedError {
    name: string;
    message: string;
    stack?: string;
    cause?: unknown;

    [extra: string]: unknown;
}

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
    const isProduction = process.env.NODE_ENV === "production";
    const requestedLevel = process.env.LOG_LEVEL?.toLowerCase();
    const requestedFormat = process.env.LOG_FORMAT?.toLowerCase();

    return {
        minLevel: requestedLevel && Object.hasOwn(LEVEL_ORDER, requestedLevel)
            ? (requestedLevel as AlertLogLevel)
            : isProduction ? "info" : "debug",
        format: requestedFormat === "json" || requestedFormat === "pretty"
            ? requestedFormat
            : isProduction ? "json" : "pretty",
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
const QUERY_PARAMS = /\nparams:[\s\S]*?(?=\n\s+at |$)/;

function redactQueryParams(text: string): string {
    return text.replace(QUERY_PARAMS, "\nparams: [REDACTED]");
}

function serializeError(error: Error, depth: number, ancestors: WeakSet<object>): SerializedError {
    ancestors.add(error);

    const serialized: SerializedError = {
        name: error.name,
        message: redactQueryParams(error.message),
        stack: error.stack === undefined ? undefined : redactQueryParams(error.stack),
    };

    for (const key of Object.keys(error)) {
        if (key in serialized) continue;
        serialized[key] = SENSITIVE_KEY.test(key)
            ? REDACTED
            : normalize((error as unknown as Record<string, unknown>)[key], depth + 1, ancestors);
    }

    if (error.cause !== undefined) {
        serialized.cause = normalize(error.cause, depth + 1, ancestors);
    }

    ancestors.delete(error);
    return serialized;
}

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
            return "[Function]";
    }

    if (value === null) return null;

    const object = value as object;
    if (depth >= MAX_DEPTH) return "[MaxDepth]";
    if (ancestors.has(object)) return "[Circular]";

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
            entries[key] = SENSITIVE_KEY.test(key) ? REDACTED : normalize(inner, depth + 1, ancestors);
        }
        result = entries;
    }

    ancestors.delete(object);
    return result;
}

// ============================================================================
// FORMATTING
// ============================================================================

function isSerializedError(value: unknown): value is SerializedError {
    return typeof value === "object" && value !== null
        && typeof (value as SerializedError).name === "string"
        && typeof (value as SerializedError).message === "string"
        && ("stack" in value);
}

function formatJson(level: AlertLogLevel, message: string, data: LogContext): string {
    const record: LogContext = {level, time: new Date().toISOString(), msg: message};

    for (const [key, value] of Object.entries(data)) {
        record[RESERVED_KEYS.includes(key) ? `ctx_${key}` : key] = value;
    }

    return JSON.stringify(record);
}

function describeError(error: SerializedError, indent: string): string[] {
    const {name, message, stack, cause, ...extras} = error;
    const lines = [`${indent}${stack ?? `${name}: ${message}`}`];

    if (Object.keys(extras).length > 0) {
        lines.push(`${indent}  ${JSON.stringify(extras)}`);
    }
    if (isSerializedError(cause)) {
        lines.push(`${indent}caused by:`, ...describeError(cause, indent));
    } else if (cause !== undefined) {
        lines.push(`${indent}caused by: ${JSON.stringify(cause)}`);
    }

    return lines;
}

const LEVEL_COLORS: Record<AlertLogLevel, string> = {debug: "90", info: "36", warn: "33", error: "31"};

/**
 * Whether to color pretty output. Reads `stdout` through `globalThis` so the Edge bundler, which also compiles
 * `instrumentation.ts`, doesn't flag a Node-only API; on Edge the property is simply absent and colors are off.
 */
function colorEnabled(): boolean {
    const runtime = (globalThis as { process?: { stdout?: { isTTY?: boolean }; env?: Record<string, string | undefined> } }).process;
    return Boolean(runtime?.stdout?.isTTY) && !runtime?.env?.NO_COLOR;
}

function formatPretty(level: AlertLogLevel, message: string, data: LogContext): string {
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
    const colored = colorEnabled() ? `\x1b[${LEVEL_COLORS[level]}m${label}\x1b[0m` : label;
    const context = Object.keys(plain).length > 0 ? ` ${JSON.stringify(plain)}` : "";

    return [`${time} ${colored} ${message}${context}`, ...errorLines].join("\n");
}

// ============================================================================
// LOGGER
// ============================================================================

function emit(level: AlertLogLevel, message: string, bindings: LogContext, context?: LogContext): void {
    const {minLevel, format} = getConfig();
    if (LEVEL_ORDER[level] < LEVEL_ORDER[minLevel]) return;

    const data = normalize({...bindings, ...context}, 0, new WeakSet()) as LogContext;
    const line = format === "json" ? formatJson(level, message, data) : formatPretty(level, message, data);

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
        debug: (message, context) => emit("debug", message, bindings, context),
        info: (message, context) => emit("info", message, bindings, context),
        warn: (message, context) => emit("warn", message, bindings, context),
        error: (message, context) => emit("error", message, bindings, context),
        child: (childBindings) => createLogger({...bindings, ...childBindings}),
    };
}

/**
 * The shared server logger.
 */
export const logger: Logger = createLogger();
