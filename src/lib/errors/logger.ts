/**
 * TODO:: document
 */
export type LogSeverity = "info" | "warn" | "error";

/**
 * TODO:: document
 *
 * @property {LogSeverity} severity // TODO:: document
 * @property {string} source module action`, (ex. "shoutbox.create")
 * @property {string} message // TODO:: document
 * @property {unknown} error Optional; // TODO:: document
 * @property {Record<string, unknown>} context Optional; identifiers only. Never message bodies, tokens or personal data.
 * @property {string | null} userId Optional; // TODO:: document
 */
export interface LogEntry {
    severity: LogSeverity;
    source: string;
    message: string;
    error?: unknown;
    context?: Record<string, unknown>;
    userId?: string | null;
}

/**
 * TODO:: document
 */
export interface LogSink {
    write(entry: LogEntry): void | Promise<void>;
}

/**
 * TODO:: document
 */
interface LogInput {
    source: string;
    error?: unknown;
    context?: Record<string, unknown>;
    userId?: string | null;
}

/**
 * TODO:: document
 * @param {unknown} error // TODO:: document
 *
 * @return  // TODO:: document
 */
function serializeError(error: unknown): unknown {
    if (error instanceof Error) {
        return {
            name: error.name,
            message: error.message,
            stack: error.stack
        };
    }
    return error === undefined ? undefined : String(error);
}

function describeError(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

const consoleSink: LogSink = {
    write({severity, source, message, error, context, userId}) {
        const line = JSON.stringify({severity, source, message, userId, context, error: serializeError(error)});
        if (severity === "error") console.error(line);
        else if (severity === "warn") console.warn(line);
        else console.info(line);
    },
};

// v2: add a database sink here (staff-visible error_log table; needs explicit approval).
const sinks: LogSink[] = [consoleSink];

function emit(entry: LogEntry): void {
    for (const sink of sinks) {
        try {
            void Promise.resolve(sink.write(entry)).catch(() => undefined);
        } catch {
            // Logging must never break a request.
        }
    }
}

export function logError(input: LogInput & { message?: string }): void {
    emit({...input, severity: "error", message: input.message ?? describeError(input.error)});
}

export function logWarn(input: LogInput & { message: string }): void {
    emit({...input, severity: "warn"});
}

export function logInfo(input: LogInput & { message: string }): void {
    emit({...input, severity: "info"});
}
