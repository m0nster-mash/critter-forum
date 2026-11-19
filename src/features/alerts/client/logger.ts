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

const LEVEL_ORDER: Record<AlertLogLevel, number> = {debug: 10, info: 20, warn: 30, error: 40}; // TODO:: migrate to const file
const SAFE_KEYS = new Set(["code", "ref", "severity", "field", "scope", "digest", "status"]); // TODO:: replace magic string with consts, migrate
const MAX_SAFE_LENGTH = 120; // TODO:: migrate to const file

/**
 * Reads config from the environment on every call. `process.env.NEXT_PUBLIC_*` must be referenced statically so
 * Next can inline it into the client bundle.
 *
 * @return TODO:: document
 */
function getConfig(): { minLevel: AlertLogLevel; verbose: boolean } {
    const isProduction = process.env.NODE_ENV === "production"; // TODO:: replace magic string with consts
    const requested = process.env.NEXT_PUBLIC_LOG_LEVEL?.toLowerCase();

    return {
        minLevel: requested && Object.hasOwn(LEVEL_ORDER, requested)
            ? (requested as AlertLogLevel)
            : isProduction ? "warn" : "debug", // TODO:: replace magic string with consts
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
                safe[key] = value.slice(0, MAX_SAFE_LENGTH);
            } else if (typeof value === "number" || typeof value === "boolean") {
                safe[key] = value;
            }
        } else if (key === "err" && value instanceof Error) {
            safe.errorName = value.name;
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
    if (LEVEL_ORDER[level] < LEVEL_ORDER[minLevel]) return;

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

    // TODO:: migrate, replace with const
    return {
        debug: (message, context) => emit("debug", message, bindings, context),
        info: (message, context) => emit("info", message, bindings, context),
        warn: (message, context) => emit("warn", message, bindings, context),
        error: (message, context) => emit("error", message, bindings, context),
        child: (childBindings) => createClientLogger({...bindings, ...childBindings}),
    };
}

/**
 * The shared client logger.
 */
export const clientLogger: Logger = createClientLogger();
