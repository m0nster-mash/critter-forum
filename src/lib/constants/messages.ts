/**
 * Global fallback error message definitions used across utility modules.
 */
export const ERROR_MESSAGES = {
    UNKNOWN_ERROR: "An unknown error has occurred.",
} as const;

/** Cross-module user-facing messages. Module-specific text lives in the module's own messages.ts. */
export const COMMON_MESSAGES = {
    UNEXPECTED: "Something went wrong. Please try again.",
    FORBIDDEN: "You do not have permission to do that.",
} as const;
