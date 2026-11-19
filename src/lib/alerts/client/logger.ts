import {AlertLogLevel, ClientLogger} from "@/lib/alerts/types";

export type ClientLogContext = Record<string, unknown>;

/**
 * TODO:: document
 *
 * TODO:: replace magic strings with const
 *
 * TODO:: relocate to proper const file/dir
 */
const LEVEL_ORDER: Record<AlertLogLevel | "silent", number> = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40,
    silent: 50,
};

// TODO:: relocated to correct const file/dir
const SENSITIVE_KEY = /pass(word|wd)?|secret|token|authorization|cookie|api[-_]?key|credential/i;

/**
 * TODO:: document
 *
 * TODO:: replace magic strings with const
 *
 * @param value
 * @param key
 */
function sanitize(value: unknown, key = ""): unknown {
    if (SENSITIVE_KEY.test(key)) {
        return "[REDACTED]";
    }

    if (typeof value === "string") {
        return value
            .replace(/Bearer\s+\S+/gi, "Bearer [REDACTED]")
            .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[REDACTED]");
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
 * TODO:: document
 *
 * TODO:: replace magic strings with const
 */
function getMinimumLevel(): AlertLogLevel | "silent" {
    if (process.env.NODE_ENV === "production") {
        return "warn";
    }

    const configured = process.env.NEXT_PUBLIC_ALERT_LOG_LEVEL;

    return configured && Object.hasOwn(LEVEL_ORDER, configured)
        ? configured as AlertLogLevel | "silent"
        : "debug";
}

/**
 * TODO:: document
 *
 * TODO:: replace magic strings with const
 *
 * @param level
 * @param message
 * @param bindings
 * @param context
 */
function emit(
    level: AlertLogLevel,
    message: string,
    bindings: ClientLogContext,
    context: ClientLogContext = {},
): void {
    if (LEVEL_ORDER[level] < LEVEL_ORDER[getMinimumLevel()]) {
        return;
    }

    const data = {...bindings, ...context};

    if (process.env.NODE_ENV === "production") {
        const safe = sanitize({
            code: data.code,
            message,
            ref: data.ref,
        }) as ClientLogContext;

        const line = JSON.stringify({level, ...safe});

        if (level === "warn") {
            console.warn(line);
        } else if (level === "error") {
            console.error(line);
        }

        return;
    }

    const safe = sanitize(data) as ClientLogContext;

    if (level === "debug") {
        console.debug(message, safe);
    } else if (level === "info") {
        console.info(message, safe);
    } else if (level === "warn") {
        console.warn(message, safe);
    } else {
        console.error(message, safe);
    }
}

/**
 * TODO:: document
 *
 * TODO:: replace magic strings with const
 *
 * @param bindings
 */
export function createClientLogger(bindings: ClientLogContext = {}): ClientLogger {
    return {
        debug: (message, context) => emit("debug", message, bindings, context),
        info: (message, context) => emit("info", message, bindings, context),
        warn: (message, context) => emit("warn", message, bindings, context),
        error: (message, context) => emit("error", message, bindings, context),
        child: (childBindings) => createClientLogger({...bindings, ...childBindings}),
    };
}

export const clientLogger = createClientLogger();
