import {ALERT_SEVERITY, APP_ALERT_CODES} from "@/features/alerts/constants/alert-codes";
import {createAlert, getAlertDefinition} from "@/features/alerts/create-alert";
import {ActionResult, fail} from "@/features/alerts/result";
import {isAlertError} from "@/features/alerts/server/alert-error";
import {logAlert} from "@/features/alerts/server/log-alert";
import type {LogContext} from "@/features/alerts/server/logger";
import {generateRef} from "@/features/alerts/server/ref";
import type {PublicAlert} from "@/features/alerts/types";
import {unstable_rethrow} from "next/navigation";

/**
 * Logs an alert per its registry policy and, when that produces a log entry for a warning or error, stamps the alert
 * with a reference ID. A ref on the client therefore always matches a line in the server log.
 *
 * @param alert
 * @param context
 */
function record(
    alert: PublicAlert,
    context: LogContext
): PublicAlert {

    if (!getAlertDefinition(alert.code).log.server) {
        return alert;
    }

    const needsRef = alert.ref === undefined
        && (alert.severity === ALERT_SEVERITY.ERROR
            || alert.severity === ALERT_SEVERITY.WARN);
    const stamped = needsRef ? {...alert, ref: generateRef()} : alert;

    logAlert(stamped, context);
    return stamped;
}

/**
 * Wraps a server action so that it always resolves to an ActionResult and never throws to the client.
 *
 * - Returned results: the alert (if any) is logged per its registry policy, then the result is passed through.
 * - Thrown `AlertError`: converted to a failure result with the registered alert. Its cause and detail are logged.
 * - Any other thrown value: logged in full (with stack) and converted to a generic `APP_UNKNOWN_ERROR` failure
 *   carrying a reference ID. The message and stack never reach the client.
 * - Next.js control-flow errors (`redirect()`, `notFound()`, etc.) are rethrown untouched so navigation still works.
 *
 * The action's arguments are never logged, since they commonly contain passwords.
 *
 * Usage, in a `"use server"` file: `export const saveThing = safeAction("things.save", async (input: Input) => {...})`
 *
 * @param   {string}                                    name    Stable identifier for logs, e.g. `auth.register`
 * @param   {(...args: Args) => Promise<ActionResult>}   action  The action body
 *
 * @return  {(...args: Args) => Promise<ActionResult>}  The wrapped action.
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
                ? {
                    ok: true,
                    data: result.data,
                    alert: record(result.alert, {action: name}
                    )
                }
                : {
                    ok: true,
                    data: result.data
                };

        } catch (error) {
            unstable_rethrow(error);

            if (isAlertError(error)) {
                return fail(record(
                    createAlert(error.code, error.overrides),
                    {
                        action: name,
                        ...error.detail, err:
                        error.cause
                    },
                ));
            }

            return fail(record(createAlert(APP_ALERT_CODES.UNKNOWN_ERROR), {
                action: name,
                err: error
            }));
        }
    };
}
