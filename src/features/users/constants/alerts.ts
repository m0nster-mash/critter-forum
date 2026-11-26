/**
 * @fileOverview    Defines user-settings alert codes and messages.
 * @module          features/users
 */

import type {AlertDefinition} from "@/features/alerts/types";

export const USER_ALERT_CODES = {
    PROFILE_NAME_REQUIRED: "USER_PROFILE_NAME_REQUIRED",
    PROFILE_UPDATED: "USER_PROFILE_UPDATED",
    PROFILE_UPDATE_FAILED: "USER_PROFILE_UPDATE_FAILED",

    EMAIL_INVALID: "USER_EMAIL_INVALID",
    EMAIL_UNCHANGED: "USER_EMAIL_UNCHANGED",
    EMAIL_ALREADY_IN_USE: "USER_EMAIL_ALREADY_IN_USE",
    EMAIL_CHANGE_REQUESTED: "USER_EMAIL_CHANGE_REQUESTED",
    EMAIL_CHANGE_FAILED: "USER_EMAIL_CHANGE_FAILED",

    PASSWORD_CURRENT_REQUIRED: "USER_PASSWORD_CURRENT_REQUIRED",
    PASSWORD_TOO_SHORT: "USER_PASSWORD_TOO_SHORT",
    PASSWORD_CONFIRMATION_MISMATCH: "USER_PASSWORD_CONFIRMATION_MISMATCH",
    PASSWORD_CURRENT_INVALID: "USER_PASSWORD_CURRENT_INVALID",
    PASSWORD_CHANGED: "USER_PASSWORD_CHANGED",
    PASSWORD_CHANGE_FAILED: "USER_PASSWORD_CHANGE_FAILED",
} as const;

export const USER_ALERTS = {
    USER_PROFILE_NAME_REQUIRED: {
        severity: "warn",
        message: "Please enter a name.",
        presentation: "inline",
        field: "name",
        log: {server: false, client: false},
    },
    USER_PROFILE_UPDATED: {
        severity: "success",
        message: "Your profile has been updated.",
        presentation: "toast",
        log: {server: false, client: false},
    },
    USER_PROFILE_UPDATE_FAILED: {
        severity: "error",
        message: "We couldn't update your profile. Please try again.",
        presentation: "inline",
        log: {server: false, client: "warn"},
    },

    USER_EMAIL_INVALID: {
        severity: "warn",
        message: "Please enter a valid email address.",
        presentation: "inline",
        field: "email",
        log: {server: false, client: false},
    },
    USER_EMAIL_UNCHANGED: {
        severity: "warn",
        message: "Please enter an email address different from your current one.",
        presentation: "inline",
        field: "email",
        log: {server: false, client: false},
    },
    USER_EMAIL_ALREADY_IN_USE: {
        severity: "error",
        message: "That email address is already associated with an account.",
        presentation: "inline",
        field: "email",
        log: {server: false, client: false},
    },
    USER_EMAIL_CHANGE_REQUESTED: {
        severity: "success",
        message: "Verification instructions have been sent to your new email address.",
        presentation: "toast",
        log: {server: false, client: false},
    },
    USER_EMAIL_CHANGE_FAILED: {
        severity: "error",
        message: "We couldn't request the email change. Please try again.",
        presentation: "inline",
        log: {server: false, client: "warn"},
    },

    USER_PASSWORD_CURRENT_REQUIRED: {
        severity: "warn",
        message: "Please enter your current password.",
        presentation: "inline",
        field: "currentPassword",
        log: {server: false, client: false},
    },
    USER_PASSWORD_TOO_SHORT: {
        severity: "warn",
        message: "Your new password must be at least {min} characters long.",
        presentation: "inline",
        field: "newPassword",
        log: {server: false, client: false},
    },
    USER_PASSWORD_CONFIRMATION_MISMATCH: {
        severity: "warn",
        message: "The new passwords do not match.",
        presentation: "inline",
        field: "confirmPassword",
        log: {server: false, client: false},
    },
    USER_PASSWORD_CURRENT_INVALID: {
        severity: "error",
        message: "Your current password is incorrect.",
        presentation: "inline",
        field: "currentPassword",
        log: {server: false, client: false},
    },
    USER_PASSWORD_CHANGED: {
        severity: "success",
        message: "Your password has been changed.",
        presentation: "toast",
        log: {server: false, client: false},
    },
    USER_PASSWORD_CHANGE_FAILED: {
        severity: "error",
        message: "We couldn't change your password. Please try again.",
        presentation: "inline",
        log: {server: false, client: "warn"},
    },
} as const satisfies Record<string, AlertDefinition>;
