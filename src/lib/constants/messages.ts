export const USER_ALERTS = {
    // Login stream:
    LOGIN_PROCESSING: "Logging in...",
    LOGIN_PENDING: "Login",

    // Registration steam:
    REGISTRATION_ACCOUNT_CREATED: "Your account has been created,"

} as const;

export const ERROR_MESSAGES = {
    // Login stream:
    LOGIN_FAILED: "Failed to log in. Please check your credentials.",
    LOGIN_UNKNOWN_ERROR: "An unexpected error occurred.",

    // Registration stream:
    REGISTRATION_MISSING_DATA: "Username, email, and password are required.",
    REGISTRATION_FAILURE: "The account could not be created.",
} as const;
