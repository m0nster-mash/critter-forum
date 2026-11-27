export const AUTH_ERROR_CODES = {
    INVALID_PASSWORD: "INVALID_PASSWORD",

    USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
    USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",

    UNAUTHORIZED: "Unauthorized",
    CLEANUP_FAILED: "Pending-account cleanup failed.",

    REGISTRATION_FAILED: "We couldn't cancel this registration. Please try again.",
} as const;
