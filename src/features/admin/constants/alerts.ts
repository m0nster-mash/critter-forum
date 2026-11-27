/**
 * @fileOverview    Defines the registered alerts used by the admin feature.
 * @module          features/admin
 */

import type {AlertDefinition} from "@/features/alerts/types";

/** Stable identifiers for administrative alerts. */
export const ADMIN_ALERT_CODES = {
    // Permissions Codes
    PERMISSION_DENIED: "ADMIN_PERMISSION_DENIED",

    // User Management Codes
    USER_UPDATED: "ADMIN_USER_UPDATED",
    USER_NAME_REQUIRED: "ADMIN_USER_NAME_REQUIRED",
    USER_NOT_FOUND: "ADMIN_USER_NOT_FOUND",
} as const;

/**
 * Administrative alert definitions.
 *
 * @remarks     Permission denials are expected authorization outcomes. They use a safe, generic message and are not
 *              logged as application errors.
 */
export const ADMIN_ALERTS = {
    ADMIN_PERMISSION_DENIED: {
        severity: "warn",
        message: "You don't have permission to perform this action.",
        presentation: "toast",
        log: {server: false, client: false},
    },

    ADMIN_USER_UPDATED: {
        severity: "success",
        message: "User details have been updated.",
        presentation: "toast",
        log: {server: "info", client: false},
    },
    ADMIN_USER_NAME_REQUIRED: {
        severity: "warn",
        message: "Please enter a name.",
        presentation: "inline",
        field: "name",
        log: {server: false, client: false},
    },
    ADMIN_USER_NOT_FOUND: {
        severity: "warn",
        message: "The selected user could not be found.",
        presentation: "inline",
        log: {server: false, client: false},
    },
} as const satisfies Record<string, AlertDefinition>;
