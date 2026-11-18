export const USER_ALERTS = {
    // Login stream:
    LOGIN_PROCESSING: "Logging in...",
    LOGIN_LABEL: "Login",

    // Registration steam:
    REGISTRATION_ACCOUNT_CREATED: "Your account has been created,",

    // Logout stream:
    LOGOUT_PROCESSING: "Signing out...",
    LOGOUT_LABEL: "Logout",

} as const;

export const ERROR_MESSAGES = {
    // Login stream:
    LOGIN_FAILED: "Failed to log in. Please check your credentials.",
    LOGIN_UNKNOWN_ERROR: "An unexpected error occurred.",

    // Registration stream:
    REGISTRATION_MISSING_DATA: "Username, email, and password are required.",
    REGISTRATION_FAILURE: "The account could not be created.",

    // Logout stream:
    LOGOUT_FAILURE: "Logout failed: ",
} as const;
