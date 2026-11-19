import type {AlertDefinition} from "@/features/alerts/types";

/**
 * Registry entries for every authentication alert. This is the single place that decides what each auth message says,
 * how it is shown, and whether it is logged. Merged into the application-wide registry in `lib/components/registry.ts`.
 *
 * Naming: `AUTH_<ACTION>_<REASON>`.
 *
 * Note on `log.server` for the login components: sign-in goes straight from the browser to better-auth rather than through
 * a server action, so failed sign-ins are written to the server log by the better-auth logger hook in
 * `lib/db/auth/auth.ts`, not by these entries.
 */
export const AUTH_ALERTS = {
    // Login stream:
    AUTH_LOGIN_SUCCESS: {
        severity: "success",
        message: "You're signed in.",
        presentation: "toast",
        log: {server: false, client: false},
    },
    AUTH_LOGIN_INVALID_CREDENTIALS: {
        severity: "error",
        message: "Invalid email or password.",
        presentation: "inline",
        log: {server: false, client: false},
    },
    AUTH_LOGIN_FAILED: {
        severity: "error",
        message: "We couldn't sign you in. Please try again.",
        presentation: "inline",
        log: {server: false, client: "warn"},
    },
    AUTH_RATE_LIMITED: {
        severity: "warning",
        message: "Too many attempts. Please wait a moment and try again.",
        presentation: "inline",
        log: {server: false, client: "warn"},
    },

    // Registration stream:
    AUTH_REGISTER_SUCCESS: {
        severity: "success",
        message: "Your account has been created.",
        presentation: "toast",
        log: {server: "info", client: false},
    },
    AUTH_REGISTER_NAME_REQUIRED: {
        severity: "warning",
        message: "Please enter a username.",
        presentation: "inline",
        field: "name",
        log: {server: false, client: false},
    },
    AUTH_REGISTER_EMAIL_INVALID: {
        severity: "warning",
        message: "Please enter a valid email address.",
        presentation: "inline",
        field: "email",
        log: {server: false, client: false},
    },
    AUTH_REGISTER_PASSWORD_TOO_SHORT: {
        severity: "warning",
        message: "Password must be at least {min} characters long.",
        presentation: "inline",
        field: "password",
        log: {server: false, client: false},
    },
    AUTH_REGISTER_EMAIL_TAKEN: {
        severity: "error",
        message: "An account with that email already exists.",
        presentation: "inline",
        field: "email",
        log: {server: false, client: false},
    },
    AUTH_REGISTER_FAILED: {
        severity: "error",
        message: "The account could not be created.",
        presentation: "inline",
        log: {server: "error", client: "warn"},
    },
    AUTH_REGISTER_SIGNIN_FAILED: {
        severity: "warning",
        message: "Your account was created, but we couldn't sign you in automatically. Please sign in.",
        presentation: "toast",
        log: {server: false, client: "warn"},
    },

    // Logout stream:
    AUTH_LOGOUT_SUCCESS: {
        severity: "success",
        message: "You've been signed out.",
        presentation: "toast",
        log: {server: false, client: false},
    },
    AUTH_LOGOUT_FAILED: {
        severity: "error",
        message: "We couldn't sign you out. Please try again.",
        presentation: "toast",
        log: {server: false, client: "error"},
    },
} as const satisfies Record<string, AlertDefinition>;
