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
