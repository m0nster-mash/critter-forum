import type {AlertLogLevel} from "@/features/alerts/types";

/** Supported logger levels and their stable order. */
export const LOG_LEVELS = {
    DEBUG: "debug",
    INFO: "info",
    WARN: "warn",
    ERROR: "error",
} as const;

export const LOG_LEVEL_ORDER: Record<AlertLogLevel, number> = {
    [LOG_LEVELS.DEBUG]: 10,
    [LOG_LEVELS.INFO]: 20,
    [LOG_LEVELS.WARN]: 30,
    [LOG_LEVELS.ERROR]: 40,
};

/** Supported output encodings. */
export const LOG_FORMATS = {
    PRETTY: "pretty",
    JSON: "json",
} as const;

export const LOGGER_ENVIRONMENTS = {
    PRODUCTION: "production",
} as const;

/** Default verbosity by runtime and environment. */
export const LOGGER_DEFAULT_LEVELS = {
    SERVER_DEVELOPMENT: LOG_LEVELS.DEBUG,
    SERVER_PRODUCTION: LOG_LEVELS.INFO,
    CLIENT_DEVELOPMENT: LOG_LEVELS.DEBUG,
    CLIENT_PRODUCTION: LOG_LEVELS.WARN,
} as const;

export const LOGGER_DEFAULT_FORMATS = {
    DEVELOPMENT: LOG_FORMATS.PRETTY,
    PRODUCTION: LOG_FORMATS.JSON,
} as const;

/** Browser-safe context allow-list and truncation limit. */
export const CLIENT_LOG_SAFE_KEYS = ["code", "ref", "severity", "field", "scope", "digest", "status"] as const;
export const MAX_CLIENT_LOG_VALUE_LENGTH = 120;
export const CLIENT_LOG_ERROR_KEY = "err";
export const CLIENT_LOG_ERROR_NAME_KEY = "errorName";

/** Server log normalization and redaction rules. */
export const LOGGER_REDACTION = {
    REDACTED: "[REDACTED]",
    FUNCTION: "[Function]",
    MAX_DEPTH: "[MaxDepth]",
    CIRCULAR: "[Circular]",
    MAX_NESTING_DEPTH: 6,
} as const;

export const SENSITIVE_LOG_KEY_PATTERN = /pass(word|wd)?|secret|token|authorization|cookie|api[-_]?key|credential/i;
export const QUERY_PARAMS_PATTERN = /\nparams:[\s\S]*?(?=\n\s+at |$)/;
export const QUERY_PARAMS_REDACTION = "\nparams: [REDACTED]";

/** JSON fields owned by the logger; colliding context keys are namespaced. */
export const LOGGER_RESERVED_JSON_KEYS: readonly string[] = ["level", "time", "msg"];
export const LOGGER_JSON_KEYS = {
    LEVEL: "level",
    TIME: "time",
    MESSAGE: "msg",
    CONTEXT_PREFIX: "ctx_",
} as const;

/** Human-readable labels used by pretty output. */
export const LOGGER_TEXT = {
    CAUSED_BY: "caused by:",
} as const;

/** ANSI foreground color codes used for pretty terminal output. */
export const LOGGER_ANSI_COLORS: Record<AlertLogLevel, string> = {
    [LOG_LEVELS.DEBUG]: "90",
    [LOG_LEVELS.INFO]: "36",
    [LOG_LEVELS.WARN]: "33",
    [LOG_LEVELS.ERROR]: "31",
};

export const LOGGER_ANSI = {
    RESET: "\x1b[0m",
    PREFIX: "\x1b[",
    COLOR_SUFFIX: "m",
} as const;
