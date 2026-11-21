/**
 * TODO: document
 *
 * @module features/auth/constants/ui
 * @status Requires documentation
 */

/** User-facing labels used by authentication components. */
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

/** Authentication form field names used by validation and alert metadata. */
export const AUTH_FIELDS = {
    NAME: "name",
    EMAIL: "email",
    PASSWORD: "password",
} as const;

/** HTML IDs used by authentication form inputs and their alert descriptions. */
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
