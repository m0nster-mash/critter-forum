import {AlertSeverity} from "@/features/alerts/types";

/**
 * Alert codes for application-wide errors and feedback.
 *
 * These identifiers correspond to entries in CORE_ALERTS.
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
 *
 * These identifiers correspond to entries in AUTH_ALERTS.
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
    REGISTER_SIGNIN_FAILED: "AUTH_REGISTER_SIGNIN_FAILED",

    LOGOUT_SUCCESS: "AUTH_LOGOUT_SUCCESS",
    LOGOUT_FAILED: "AUTH_LOGOUT_FAILED",
} as const;

/**
 * Combined lookup for callers that use both application and auth components.
 */
export const ALERT_CODES = {
    ...APP_ALERT_CODES,
    ...AUTH_ALERT_CODES,
} as const;

export type AppAlertCode = typeof APP_ALERT_CODES[keyof typeof APP_ALERT_CODES];
export type AuthAlertCode = typeof AUTH_ALERT_CODES[keyof typeof AUTH_ALERT_CODES];
export type KnownAlertCode = typeof ALERT_CODES[keyof typeof ALERT_CODES];

export const SEVERITY_TYPES = {
    WARNING: "warning",
    ERROR: "error",
} as const;

export const SEVERITY_LABELS: Record<AlertSeverity, string> = {
    success: "Success",
    info: "Information",
    warning: "Warning",
    error: "Error",
};

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

export const ALERT_ROLES = {
    ALERT: "alert",
    STATUS: "status",
} as const;
