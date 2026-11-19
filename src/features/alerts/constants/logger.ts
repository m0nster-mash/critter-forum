import type {AlertLogLevel} from "@/features/alerts/types";

/**
 * Logging output formats.
 */
export const LOG_FORMATS = {
    PRETTY: "pretty",
    JSON: "json",
} as const;

export type LogFormat = typeof LOG_FORMATS[keyof typeof LOG_FORMATS];

/**
 * Runtime environment identifiers.
 */
export const RUNTIME_ENVIRONMENTS = {
    DEVELOPMENT: "development",
    PRODUCTION: "production",
} as const;

/**
 * Default logging levels by runtime environment.
 */
export const DEFAULT_LOG_LEVELS = {
    DEVELOPMENT: "debug",
    SERVER_PRODUCTION: "info",
    CLIENT_PRODUCTION: "warn",
} as const;

/**
 * Numeric ordering used to compare log levels.
 */
export const LOGGER_LEVEL_ORDER: Record<AlertLogLevel, number> = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40,
};

/**
 * ANSI terminal colors for pretty log output.
 */
export const LOGGER_LEVEL_COLORS: Record<AlertLogLevel, string> = {
    debug: "90",
    info: "36",
    warn: "33",
    error: "31",
};

/**
 * Keys reserved by the structured server log envelope.
 */
export const LOGGER_RESERVED_KEYS = [
    "level",
    "time",
    "msg",
] as const;

/**
 * Fields permitted in sanitized production browser logs.
 */
export const CLIENT_LOG_SAFE_KEYS = new Set([
    "code",
    "ref",
    "severity",
    "field",
    "scope",
    "digest",
    "status",
]);

/**
 * Logger serialization limits.
 */
export const LOGGER_LIMITS = {
    MAX_DEPTH: 6,
    MAX_CLIENT_SAFE_LENGTH: 120,
} as const;

/**
 * Sensitive-key detection.
 */
export const LOGGER_SENSITIVE_KEY_PATTERN =
    /pass(word|wd)?|secret|token|authorization|cookie|api[-_]?key|credential/i;

/**
 * Values used when serializing or redacting data.
 */
export const LOGGER_SERIALIZATION_VALUES = {
    REDACTED: "[REDACTED]",
    FUNCTION: "[Function]",
    MAX_DEPTH: "[MaxDepth]",
    CIRCULAR: "[Circular]",
} as const;

/**
 * Drizzle query-parameter matching and replacement.
 *
 * The parameters may contain private data such as emails and password hashes.
 */
export const LOGGER_QUERY_PARAMS = {
    PATTERN: /\nparams:[\s\S]*?(?=\n\s+at |$)/,
    REDACTED_REPLACEMENT: "\nparams: [REDACTED]",
} as const;

/**
 * Text used when rendering nested error causes.
 */
export const LOGGER_ERROR_TEXT = {
    CAUSED_BY: "caused by:",
} as const;

/**
 * Environment variable names used by logger configuration.
 *
 * Keep process.env references statically written in the logger modules
 * where Next.js needs to inline public environment variables.
 */
export const LOGGER_ENV_KEYS = {
    NODE_ENV: "NODE_ENV",
    LOG_LEVEL: "LOG_LEVEL",
    LOG_FORMAT: "LOG_FORMAT",
    NEXT_PUBLIC_LOG_LEVEL: "NEXT_PUBLIC_LOG_LEVEL",
    NO_COLOR: "NO_COLOR",
} as const;
