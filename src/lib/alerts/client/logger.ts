/**
 * Browser-side logger.
 *
 * Keep this module free of server imports and internal error details. In production the only
 * emitted fields are an alert code, a sanitized user-safe message, and an optional reference ID.
 */
import type {AlertLogLevel} from "@/lib/alerts/types";

/** Structured context accepted by the logger interface. */
export type LogContext = Record<string, unknown>;

/** Same level-method and child-logger contract as the server logger. */
export interface Logger {
    debug(message: string, context?: LogContext): void;
    info(message: string, context?: LogContext): void;
    warn(message: string, context?: LogContext): void;
    error(message: string, context?: LogContext): void;
    child(bindings: LogContext): Logger;
}

const LEVEL_ORDER: Record<AlertLogLevel, number> = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40,
};

const VALID_LEVELS = ["debug", "info", "warn", "error", "silent"] as const;
type ConfiguredLevel = (typeof VALID_LEVELS)[number];

function getConfig(): {production: boolean; minLevel: ConfiguredLevel} {
    const production = process.env.NODE_ENV === "production";
    const configured = process.env.NEXT_PUBLIC_ALERT_LOG_LEVEL;
    const minLevel = VALID_LEVELS.includes(configured as ConfiguredLevel)
        ? configured as ConfiguredLevel
        : "debug";

    return {
        production,
        // A public env var can increase dev verbosity, but can never enable production debug/info.
        minLevel: production ? "warn" : minLevel,
    };
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Redact common personal/credential data even when a caller accidentally supplies it as a message.
 * The registry should remain the source of user-facing text; this is a defensive last line.
 */
function sanitizeMessage(value: unknown): string | undefined {
    if (typeof value !== "string") return undefined;

    return value
        .slice(0, 500)
        .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[REDACTED_EMAIL]")
        .replace(/\bBearer\s+[A-Z0-9._~+/=-]+/gi, "Bearer [REDACTED]")
        .replace(/\b(password|passwd|token|secret|api[_-]?key)\s*[:=]\s*\S+/gi, "$1=[REDACTED]");
}

function safeCode(value: string): string {
    // Log message arguments are expected to be registry codes, never exception messages.
    return /^[A-Z][A-Z0-9_]{0,99}$/.test(value) ? value : "CLIENT_LOG_EVENT";
}

function safeRef(value: unknown): string | undefined {
    return typeof value === "string" && /^[a-zA-Z0-9_-]{1,64}$/.test(value)
        ? value
        : undefined;
}

function emit(
    level: AlertLogLevel,
    code: string,
    bindings: LogContext,
    context: LogContext = {},
): void {
    const {production, minLevel} = getConfig();

    if (minLevel === "silent" || LEVEL_ORDER[level] < LEVEL_ORDER[minLevel]) return;
    // Production is deliberately limited to warn/error, regardless of the configured public value.
    if (production && level !== "warn" && level !== "error") return;

    if (production) {
        const merged = {...bindings, ...context};
        const safeEntry: {code: string; message?: string; ref?: string} = {
            code: safeCode(code),
        };
        const message = sanitizeMessage(merged.message ?? merged.userMessage);
        const ref = safeRef(merged.ref);

        if (message) safeEntry.message = message;
        if (ref) safeEntry.ref = ref;

        // Do not pass arbitrary objects, exceptions, stacks, or context through the browser console.
        console[level](safeEntry);
        return;
    }

    // Development is intentionally verbose to make client-only failures diagnosable.
    console[level](code, {...bindings, ...context});
}

/**
 * Creates a logger with fixed bindings, matching the server logger's interface.
 * Child bindings are merged first; per-call context can override them.
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

/** Shared browser logger. */
export const logger: Logger = createLogger();
