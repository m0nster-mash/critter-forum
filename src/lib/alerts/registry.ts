import {AlertDefinition} from "@/lib/alerts/types";

/**
 * Application-wide alerts that don't belong to any single feature.
 *
 * Naming convention: `FEATURE_ACTION_REASON`. Core codes use the `APP_` prefix.
 */
const CORE_ALERTS = {
    APP_UNKNOWN_ERROR: {
        severity: "error",
        message: "Something went wrong. Please try again.",
        presentation: "toast",
        log: {server: "error", client: "error"},
    },
    APP_NETWORK_ERROR: {
        severity: "error",
        message: "We couldn't reach the server. Check your connection and try again.",
        presentation: "toast",
        log: {server: false, client: "warn"},
    },
    APP_RATE_LIMITED: {
        severity: "warning",
        message: "Too many attempts. Please try again in {seconds} seconds.",
        presentation: "toast",
        log: {server: "warn", client: false},
    },
    APP_VALIDATION_FAILED: {
        severity: "warning",
        message: "Please check the highlighted fields and try again.",
        presentation: "inline",
        log: {server: false, client: false},
    },
} as const satisfies Record<string, AlertDefinition>;

/**
 * Unified alert registry. Feature registries are spread in here (e.g. `...AUTH_ALERTS`), each defined in its own
 * feature folder with `as const satisfies Record<string, AlertDefinition>`. Prefix every feature code with its
 * feature name so spreads can't collide.
 */
export const ALERT_REGISTRY = {
    ...CORE_ALERTS,
} as const satisfies Record<string, AlertDefinition>;

/**
 * Union of every valid alert code. Call sites are type-checked against this.
 */
export type AlertCode = keyof typeof ALERT_REGISTRY;

/**
 * Code used when an alert code can't be resolved at runtime.
 */
export const FALLBACK_ALERT_CODE = "APP_UNKNOWN_ERROR" satisfies AlertCode;
