/**
 * Immutable object containing UI button and display labels for authentication components.
 *
 * TODO:: replace these with a better pattern
 */
export const AUTH_LABELS = {
    LOGIN_LABEL: "Login",
    LOGOUT_LABEL: "Logout",
    REGISTER_LABEL: "Register",
    USERNAME_LABEL: "Username",
    EMAIL_LABEL: "Email",
    PASSWORD_LABEL: "Password",
    LOGIN_EMAIL_LABEL: "Email Address",
} as const;


/** Stable alert registry codes used by authentication flows. */
export const AUTH_ALERT_CODES = {
    LOGIN_FAILED: "AUTH_LOGIN_FAILED",
    LOGOUT_FAILED: "AUTH_LOGOUT_FAILED",
    REGISTER_INVALID: "AUTH_REGISTER_INVALID",
    REGISTER_FAILED: "AUTH_REGISTER_FAILED",
    REGISTER_SUCCESS: "AUTH_REGISTER_SUCCESS",
    REGISTER_SIGN_IN_FAILED: "AUTH_REGISTER_SIGN_IN_FAILED",
    UNKNOWN_ERROR: "APP_UNKNOWN_ERROR",
} as const;

/** Stable form identifiers and browser autocomplete values used by authentication panels. */
export const AUTH_FORM_FIELDS = {
    LOGIN_EMAIL_ID: "login-email",
    LOGIN_PASSWORD_ID: "login-password",
    REGISTER_USERNAME_ID: "register-username",
    REGISTER_EMAIL_ID: "register-email",
    REGISTER_PASSWORD_ID: "register-password",
    EMAIL_AUTOCOMPLETE: "email",
    CURRENT_PASSWORD_AUTOCOMPLETE: "current-password",
    USERNAME_AUTOCOMPLETE: "username",
    NEW_PASSWORD_AUTOCOMPLETE: "new-password",
} as const;

/** Common authentication form placeholders and loading labels. */
export const AUTH_UI_TEXT = {
    EMAIL_PLACEHOLDER: "email@address.com",
    PASSWORD_PLACEHOLDER: "••••••••",
    LOGIN_LOADING: "Logging in...",
    LOGOUT_LOADING: "Signing out...",
    REGISTER_LOADING: "Creating account...",
    REGISTER_SUBMIT: "Register Account",
} as const;


/** Stable action identifier recorded by the server-side action logger. */
export const AUTH_REGISTER_ACTION_NAME = "auth.register";

/** Registration username placeholder text. */
export const AUTH_USERNAME_PLACEHOLDER = "Username";
