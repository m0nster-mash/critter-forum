/**
 * @fileOverview    Defines the typed exception used to represent expected, registry-backed failures.
 * @module          features/alerts
 */

import {ALERT_ERROR_NAME} from "@/features/alerts/constants/errors";
import type {AlertCode} from "@/features/alerts/registry";
import type {LogContext} from "@/features/alerts/server/logger";
import type {AlertErrorOptions, AlertOverrides} from "@/features/alerts/types";

/**
 * Throw to signal an expected failure from deep inside server code (a helper, a guard) without threading a result
 * back up manually.
 *
 * @remarks     `safeAction` catches it and converts it into a failure result carrying the registered alert.
 * @remarks     Only the alert reaches the client. `cause` and `detail` go to the server log.
 */
export class AlertError extends Error {

    /** Defines the typed exception used to represent expected, registry-backed failures. */
    readonly isAlertError = true as const;
    /** Defines the typed exception used to represent expected, registry-backed failures. */
    readonly code: AlertCode;
    /** Defines the typed exception used to represent expected, registry-backed failures. */
    readonly overrides: AlertOverrides;
    /** Defines the typed exception used to represent expected, registry-backed failures. */
    readonly detail: LogContext;

    /**
     * @param   code        Registry code of the alert to raise
     * @param   options     Optional; alert overrides plus `cause` and `detail`
     */
    constructor(
        code: AlertCode,
        options: AlertErrorOptions = {}
    ) {

        const {cause, detail, ...overrides} = options;
        super(code, {cause});
        this.name = ALERT_ERROR_NAME;
        this.code = code;
        this.overrides = overrides;
        this.detail = detail ?? {};
    }
}

/**
 * Type guard for AlertError.
 *
 * @remarks     Uses a brand property rather than `instanceof`, so it keeps working if the module is ever instantiated
 *              twice by the bundler.
 *
 * @param       value       The caught value
 *
 * @returns     {boolean}   True if the value is an AlertError.
 */
export function isAlertError(value: unknown): value is AlertError {

    return value instanceof Error && (value as Partial<AlertError>).isAlertError === true;
}
