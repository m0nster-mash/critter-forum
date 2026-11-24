/**
 * @fileOverview    Defines the registered alerts used by the admin feature.
 * @module          features/admin
 */

import type {AlertDefinition} from "@/features/alerts/types";

/** Stable identifiers for administrative alerts. */
export const ADMIN_ALERT_CODES = {
    PERMISSION_DENIED: "ADMIN_PERMISSION_DENIED",
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
} as const satisfies Record<string, AlertDefinition>;
