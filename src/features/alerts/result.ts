/**
 * @fileOverview    Defines the serializable success and failure results returned by server actions.
 * @module          features/alerts
 *
 * @status          Requires documentation
 */

import type {PublicAlert} from "@/features/alerts/types";

/**
 * Successful outcome of a server action.
 *
 * TODO         Migrate to `types.ts`
 *
 * @typeParam   T       Value used by this T operation.
 *
 * @property    ok          Discriminant
 * @property    data        Payload returned to the caller. Must be serializable.
 * @property    [alert]     Optional; a confirmation to show the user (ex. "Account created")
 */
export interface ActionSuccess<T> {
    ok: true;
    data: T;
    alert?: PublicAlert;
}

/**
 * Failed outcome of a server action.
 *
 * @property    ok      Discriminant
 * @property    alert   What to tell the user. Never contains internal detail.
 */
export interface ActionFailure {
    ok: false;
    alert: PublicAlert;
}

/**
 * What every server action returns to the client: a discriminated union on `ok`.
 *
 * @remarks     Expected failures (bad credentials, validation) are values, not exceptions, because Next strips the
 *              message from errors thrown out of server actions in production.
 *
 * @typeParam   T   Value used by this T operation.
 */
export type ActionResult<T = undefined> = ActionSuccess<T> | ActionFailure;

/**
 * Builds a success result.
 */
export function succeed(): ActionSuccess<undefined>;

/**
 * Builds a success result.
 *
 * @typeParam   T           Value used by this T operation.
 *
 * @param       data        Serializable payload returned by the operation.
 * @param       [alert]     Optional public alert associated with the successful result.
 *
 * @returns     The value produced by this operation.
 */
export function succeed<T>(
    data: T,
    alert?: PublicAlert
): ActionSuccess<T>;

/**
 * Builds a success result.
 *
 * @typeParam   T           Value used by this T operation.
 *
 * @param       data        Serializable payload returned by the operation.
 * @param       [alert]     Optional public alert associated with the successful result.
 *
 * @returns     The value produced by this operation.
 */
export function succeed<T>(
    data?: T,
    alert?: PublicAlert
): ActionSuccess<T | undefined> {

    return alert
        ? {ok: true, data, alert}
        : {ok: true, data};
}

/**
 * Builds a failure result.
 *
 * @param   alert           The alert to show the user, usually from `createAlert`
 *
 * @returns {ActionFailure} The failure result.
 */
export function fail(alert: PublicAlert): ActionFailure {
    return {ok: false, alert};
}
