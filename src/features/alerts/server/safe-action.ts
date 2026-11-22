/**
 * @fileOverview    Wraps server actions with consistent result handling, alert logging, and error conversion.
 * @module          features/alerts
 */

import {APP_ALERT_CODES} from "@/features/alerts/constants/alert-codes";
import {LOG_LEVELS} from "@/features/alerts/constants/logger";
import {createAlert, getAlertDefinition} from "@/features/alerts/create-alert";
import {ActionResult, fail} from "@/features/alerts/result";
import {isAlertError} from "@/features/alerts/server/alert-error";
import {logAlert} from "@/features/alerts/server/log-alert";
import type {LogContext} from "@/features/alerts/server/logger";
import {generateRef} from "@/features/alerts/server/ref";
import type {PublicAlert} from "@/features/alerts/types";
import {unstable_rethrow} from "next/navigation";

/**
 * Logs an alert per its registry policy.
 *
 * @remarks     When an alert produces a log entry for a warning or error, stamps the alert with a reference ID.
 * @remarks     A ref on the client therefore always matches a line in the server log.
 *
 * @param       alert       Optional public alert associated with the successful result.
 * @param       context     Optional structured data attached to this log entry.
 *
 * @returns     The value produced by this operation.
 */
function record(
    alert: PublicAlert,
    context: LogContext
): PublicAlert {

    if (!getAlertDefinition(alert.code).log.server) {
        return alert;
    }

    const needsRef = alert.ref === undefined
        && (alert.severity === LOG_LEVELS.ERROR || alert.severity === LOG_LEVELS.WARN);
    const stamped = needsRef ? {...alert, ref: generateRef()} : alert;

    logAlert(stamped, context);

    return stamped;
}

/**
 * Wraps a server action so that it always resolves to an ActionResult and never throws to the client.
 *
 * @remarks     Next.js control-flow errors (`redirect()`, `notFound()`, etc.) are rethrown untouched so navigation
 *              still works.
 * @remarks     The action's arguments are never logged, since they commonly contain passwords.

 * @typeParam   Args            Value used by this Args operation.
 * @typeParam   T               Value used by this T operation.
 *
 * @param       name            Stable identifier for logs, (ex. `auth.register`)
 * @param       action          The action body
 *
 * @returns     {ActionResult}  The wrapped action; the alert (if any) is logged per its registry policy, then the
 *                              result is passed through.
 *
 * @throws      {AlertError}    Converted to failure result with the registered alert. Its cause and detail are logged.
 * @throws                      Any other thrown value is logged in full (with stack) and converted to a generic
 *                              `APP_UNKNOWN_ERROR` failure carrying a reference ID. The message and stack never reach
 *                              the client.
 */
export function safeAction<Args extends unknown[], T>(
    name: string,
    action: (...args: Args) => Promise<ActionResult<T>>,
): (...args: Args) => Promise<ActionResult<T>> {

    return async (...args: Args): Promise<ActionResult<T>> => {
        try {
            const result = await action(...args);

            // Rebuilt field by field so nothing but ok/data/alert can leak into the response.
            if (!result.ok) {
                return fail(record(result.alert, {action: name}));
            }
            return result.alert
                ? {ok: true, data: result.data, alert: record(result.alert, {action: name})}
                : {ok: true, data: result.data};

        } catch (error) {
            unstable_rethrow(error);

            if (isAlertError(error)) {
                return fail(record(
                    createAlert(error.code, error.overrides),
                    {action: name, ...error.detail, err: error.cause},
                ));
            }

            return fail(record(createAlert(APP_ALERT_CODES.UNKNOWN_ERROR), {action: name, err: error}));
        }
    };
}
