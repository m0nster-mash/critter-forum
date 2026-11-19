/**
 * Immutable object containing UI button and display labels for authentication components.
 */
export const AUTH_LABELS = {
    LOGIN_LABEL: "Login",
    LOGIN_PROCESSING: "Logging in...",
    LOGOUT_LABEL: "Logout",
    LOGOUT_PROCESSING: "Signing out...",
    REGISTER_LABEL: "Register Account",
    REGISTER_PROCESSING: "Creating account...",
    USER_EMAIL: "Email Address",
    USER_NAME: "Username",
    USER_PASSWORD: "Password",
} as const;

/**
 * Authentication form field names.
 *
 * Used for validation results and alert field metadata.
 */
export const AUTH_FIELDS = {
    NAME: "name",
    EMAIL: "email",
    PASSWORD: "password",
} as const;

/**
 * HTML IDs for authentication form inputs.
 */
export const AUTH_FORM_IDS = {
    LOGIN_EMAIL: "login-email",
    LOGIN_PASSWORD: "login-password",

    REGISTER_NAME: "register-username",
    REGISTER_EMAIL: "register-email",
    REGISTER_PASSWORD: "register-password",

    REGISTER_ALERT_NAME: "register-username-alert",
    REGISTER_ALERT_EMAIL: "register-email-alert",
    REGISTER_ALERT_PASSWORD: "register-password-alert",
} as const;

/**
 * HTML IDs for registration field-level alerts.
 */
export const AUTH_ALERT_IDS = {
    REGISTER_NAME: "register-username-alert",
    REGISTER_EMAIL: "register-email-alert",
    REGISTER_PASSWORD: "register-password-alert",
} as const;
