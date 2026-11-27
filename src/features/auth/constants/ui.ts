/**
 * @fileOverview    Provides the ui functionality used by the application.
 * @module          authentication
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
    VERIFY_EMAIL_TITLE: "Verify your email address",
    VERIFY_EMAIL_RESENDING: "Sending...",
    VERIFY_EMAIL_RESEND_COUNTDOWN: "Resend available in {seconds} seconds",
    VERIFY_EMAIL_RESEND: "Resend verification email",

    CANCEL_REGISTRATION_TITLE: "Cancel registration",
    CANCEL_REGISTRATION_DESCRIPTION: "If you no longer want to create an account, you can cancel your registration.",
    CANCEL_REGISTRATION_PASSWORD: "Confirm your password",
    CANCEL_REGISTRATION_PROCESSING: "Cancelling registration...",
    CANCEL_REGISTRATION_LABEL: "Cancel registration",
    CANCEL_REGISTRATION_SUCCESS: "Your registration has been cancelled.",

    VERIFY_EMAIL_ACCOUNT_CREATED: "Your account has been created. Verify your email address to access Critter Forum.",
    VERIFY_EMAIL_SENT_TO_PREFIX: "We sent a verification link to",
    VERIFY_EMAIL_SENT_TO_SUFFIX: "Check your inbox and spam folder.",
    VERIFY_EMAIL_RESEND_HELP: "If you have not received the message, you can request another one.",
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
    VERIFY_EMAIL_TITLE: "verify-email-title",
    CANCEL_REGISTRATION_PASSWORD: "cancel-registration-password",
} as const;

/** Input metadata shared by authentication components. */
export const AUTH_INPUT_ATTRIBUTES = {
    PASSWORD_TYPE: "password",
    CURRENT_PASSWORD_AUTOCOMPLETE: "current-password",
} as const;

export const POLITE_ARIA = "polite";
