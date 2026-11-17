export const USER_ALERTS = {
    // Login stream:
    LOGIN_PROCESSING: "Logging in...",
    LOGIN_PENDING: "Login",

} as const;

export const ERROR_MESSAGES = {
    // Login stream:
    LOGIN_FAILED: "Failed to log in. Please check your credentials.",
    LOGIN_UNKNOWN_ERROR: "An unexpected error occurred.",
} as const;
