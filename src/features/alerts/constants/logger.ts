/**
 * TODO: document
 *
 * @module features/alerts/constants/logger
 * @status Requires documentation
 */

import type {AlertLogLevel} from "@/features/alerts/types";

/**
 * Supported logger levels and their ordering.
 */
export const LOG_LEVELS = {
    DEBUG: "debug",
    INFO: "info",
    WARN: "warn",
    ERROR: "error",
} as const;

/**
 * TODO:: document
 */
export const LOG_LEVEL_ORDER: Record<AlertLogLevel, number> = {
    [LOG_LEVELS.DEBUG]: 10,
    [LOG_LEVELS.INFO]: 20,
    [LOG_LEVELS.WARN]: 30,
    [LOG_LEVELS.ERROR]: 40,
};

/**
 * Supported output encodings.
 */
export const LOG_FORMATS = {
    PRETTY: "pretty",
    JSON: "json",
} as const;

/**
 * TODO:: document
 */
export const LOGGER_ENVIRONMENTS = {
    PRODUCTION: "production",
} as const;

/**
 * Default verbosity by runtime and environment.
 */
export const LOGGER_DEFAULT_LEVELS = {
    SERVER_DEVELOPMENT: LOG_LEVELS.DEBUG,
    SERVER_PRODUCTION: LOG_LEVELS.INFO,
    CLIENT_DEVELOPMENT: LOG_LEVELS.DEBUG,
    CLIENT_PRODUCTION: LOG_LEVELS.WARN,
} as const;

/**
 * TODO:: document
 */
export const LOGGER_DEFAULT_FORMATS = {
    DEVELOPMENT: LOG_FORMATS.PRETTY,
    PRODUCTION: LOG_FORMATS.JSON,
} as const;

/**
 * Browser-safe context allow-list and truncation limit.
 */
export const CLIENT_LOG_SAFE_KEYS = [
    "code",
    "ref",
    "severity",
    "field",
    "scope",
    "digest",
    "status",
] as const;

/**
 * TODO:: document
 */
export const MAX_CLIENT_LOG_VALUE_LENGTH = 120;

/**
 * TODO:: document
 */
export const CLIENT_LOG_ERROR_KEY = "err";

/**
 * TODO:: document
 */
export const CLIENT_LOG_ERROR_NAME_KEY = "errorName";

/** Server log normalization and redaction rules. */
export const LOGGER_REDACTION = {
    REDACTED: "[REDACTED]",
    FUNCTION: "[Function]",
    MAX_DEPTH: "[MaxDepth]",
    CIRCULAR: "[Circular]",
    MAX_NESTING_DEPTH: 6,
} as const;

/**
 * TODO:: document
 */
export const SENSITIVE_LOG_KEY_PATTERN =
    /pass(word|wd)?|secret|token|authorization|cookie|api[-_]?key|credential/i;

/**
 * TODO:: document
 */
export const QUERY_PARAMS_PATTERN = /\nparams:[\s\S]*?(?=\n\s+at |$)/;

/**
 * TODO:: document
 */
export const QUERY_PARAMS_REDACTION = "\nparams: [REDACTED]";

/** JSON envelope fields owned by the logger. */
export const LOGGER_RESERVED_JSON_KEYS = ["level", "time", "msg"] as const;

/**
 * TODO:: document
 */
export const LOGGER_JSON_KEYS = {
    LEVEL: "level",
    TIME: "time",
    MESSAGE: "msg",
    CONTEXT_PREFIX: "ctx_",
} as const;

/**
 * Human-readable labels used by pretty output.
 */
export const LOGGER_TEXT = {
    CAUSED_BY: "caused by:",
} as const;

/**
 * ANSI foreground colour codes used for pretty terminal output.
 */
export const LOGGER_ANSI_COLORS: Record<AlertLogLevel, string> = {
    [LOG_LEVELS.DEBUG]: "90",
    [LOG_LEVELS.INFO]: "36",
    [LOG_LEVELS.WARN]: "33",
    [LOG_LEVELS.ERROR]: "31",
};

/**
 * TODO:: document
 */
export const LOGGER_ANSI = {
    RESET: "\x1b[0m",
    PREFIX: "\x1b[",
    COLOR_SUFFIX: "m",
} as const;
