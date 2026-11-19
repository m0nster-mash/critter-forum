import type {AlertSeverity} from "@/features/alerts/types";

/**
 * Alert codes for application-wide errors and feedback.
 */
export const APP_ALERT_CODES = {
    UNKNOWN_ERROR: "APP_UNKNOWN_ERROR",
    NETWORK_ERROR: "APP_NETWORK_ERROR",
    NOT_FOUND: "APP_NOT_FOUND",
    RATE_LIMITED: "APP_RATE_LIMITED",
    VALIDATION_FAILED: "APP_VALIDATION_FAILED",
} as const;

/**
 * Alert codes for authentication flows.
 */
export const AUTH_ALERT_CODES = {
    LOGIN_SUCCESS: "AUTH_LOGIN_SUCCESS",
    LOGIN_INVALID_CREDENTIALS: "AUTH_LOGIN_INVALID_CREDENTIALS",
    LOGIN_FAILED: "AUTH_LOGIN_FAILED",
    RATE_LIMITED: "AUTH_RATE_LIMITED",

    REGISTER_SUCCESS: "AUTH_REGISTER_SUCCESS",
    REGISTER_NAME_REQUIRED: "AUTH_REGISTER_NAME_REQUIRED",
    REGISTER_EMAIL_INVALID: "AUTH_REGISTER_EMAIL_INVALID",
    REGISTER_PASSWORD_TOO_SHORT: "AUTH_REGISTER_PASSWORD_TOO_SHORT",
    REGISTER_EMAIL_TAKEN: "AUTH_REGISTER_EMAIL_TAKEN",
    REGISTER_FAILED: "AUTH_REGISTER_FAILED",
    REGISTER_SIGN_IN_FAILED: "AUTH_REGISTER_SIGNIN_FAILED",

    LOGOUT_SUCCESS: "AUTH_LOGOUT_SUCCESS",
    LOGOUT_FAILED: "AUTH_LOGOUT_FAILED",
} as const;

/**
 * Combined alert-code lookup.
 */
export const ALERT_CODES = {
    ...APP_ALERT_CODES,
    ...AUTH_ALERT_CODES,
} as const;

export type AppAlertCode = typeof APP_ALERT_CODES[keyof typeof APP_ALERT_CODES];
export type AuthAlertCode = typeof AUTH_ALERT_CODES[keyof typeof AUTH_ALERT_CODES];
export type KnownAlertCode = typeof ALERT_CODES[keyof typeof ALERT_CODES];

/**
 * Alert severity values.
 */
export const ALERT_SEVERITY = {
    SUCCESS: "success",
    INFO: "info",
    WARN: "warn",
    ERROR: "error",
} as const;

export const ALERT_SEVERITIES = [
    ALERT_SEVERITY.SUCCESS,
    ALERT_SEVERITY.INFO,
    ALERT_SEVERITY.WARN,
    ALERT_SEVERITY.ERROR,
] as const;

/**
 * Alert presentation values.
 */
export const ALERT_PRESENTATION = {
    TOAST: "toast",
    INLINE: "inline",
    NONE: "none",
} as const;

export const ALERT_PRESENTATIONS = [
    ALERT_PRESENTATION.TOAST,
    ALERT_PRESENTATION.INLINE,
    ALERT_PRESENTATION.NONE,
] as const;

/**
 * Logger level values.
 */
export const LOG_LEVELS = {
    DEBUG: "debug",
    INFO: "info",
    WARN: "warn",
    ERROR: "error",
} as const;

/**
 * Existing severity lookup, retained for current component usage.
 */
export const SEVERITY_LEVELS = {
    INFO: "info",
    DEBUG: "debug",
    WARN: "warn",
    ERROR: "error",
} as const;

export const SEVERITY_LABELS: Record<AlertSeverity, string> = {
    success: "Success",
    info: "Information",
    warn: "Warning",
    error: "Error",
};

/**
 * Alert component variants.
 */
export const VARIANT_TYPES = {
    BANNER: "banner",
    FIELD: "field",
    TOAST: "toast",
} as const;

export const ALERT_VARIANTS = [
    VARIANT_TYPES.BANNER,
    VARIANT_TYPES.FIELD,
    VARIANT_TYPES.TOAST,
] as const;

export type AlertVariant = (typeof ALERT_VARIANTS)[number];

/**
 * Accessibility roles used by alert components.
 */
export const ALERT_ROLES = {
    ALERT: "alert",
    STATUS: "status",
} as const;

/**
 * Error class identifier used by AlertError.
 */
export const ALERT_ERROR_NAME = "AlertError";

/**
 * Token pattern used to interpolate alert message templates.
 */
export const ALERT_TEMPLATE_TOKEN_PATTERN = /\{(\w+)}/g;
