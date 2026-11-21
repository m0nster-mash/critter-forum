/**
 * @fileOverview    TODO: document
 * @module          features/alerts
 *
 * @status          Requires documentation
 */

import {ALERT_ERROR_NAME} from "@/features/alerts/constants/errors";
import type {AlertCode} from "@/features/alerts/registry";
import type {LogContext} from "@/features/alerts/server/logger";
import type {AlertErrorOptions, AlertOverrides} from "@/features/alerts/types";

/**
 * Throw to signal an *expected* failure from deep inside server code (a helper, a guard) without threading a result
 * back up manually. `safeAction` catches it and converts it into a failure result carrying the registered alert.
 *
 * Only the alert reaches the client. `cause` and `detail` go to the server log.
 */
export class AlertError extends Error {
    /** TODO: document */
    readonly isAlertError = true as const;
    /** TODO: document */
    readonly code: AlertCode;
    /** TODO: document */
    readonly overrides: AlertOverrides;
    /** TODO: document */
    readonly detail: LogContext;

    /**
     * @param   {AlertCode}         code        Registry code of the alert to raise
     * @param   {AlertErrorOptions} [options]   Optional; alert overrides plus `cause` and `detail`
     */
    constructor(code: AlertCode, options: AlertErrorOptions = {}) {
        const {cause, detail, ...overrides} = options;
        super(code, {cause});
        this.name = ALERT_ERROR_NAME;
        this.code = code;
        this.overrides = overrides;
        this.detail = detail ?? {};
    }
}

/**
 * Type guard for AlertError. Uses a brand property rather than `instanceof`, so it keeps working if the module is
 * ever instantiated twice by the bundler.
 *
 * @param   {unknown}   value   The caught value
 *
 * @return  {boolean}   True if the value is an AlertError.
 */
export function isAlertError(value: unknown): value is AlertError {
    return value instanceof Error && (value as Partial<AlertError>).isAlertError === true;
}
