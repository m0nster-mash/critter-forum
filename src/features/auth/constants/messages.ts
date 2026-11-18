/**
 * Immutable collection of error message strings used for authentication failure feedback.
 */
export const AUTH_ERROR_MESSAGES = {
    // Login stream:
    LOGIN_FAILED: "Failed to log in. Please check your credentials.",
    LOGIN_UNKNOWN_ERROR: "An unexpected error occurred.",

    // Registration stream:
    REGISTRATION_MISSING_DATA: "Username, email, and password are required.",
    REGISTRATION_FAILURE: "The account could not be created.",

    // Logout stream:
    LOGOUT_FAILURE: "Logout failed: ",
} as const;
