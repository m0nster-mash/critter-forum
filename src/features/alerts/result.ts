/**
 * @fileOverview    TODO: document
 * @module          features/alerts
 *
 * @status          Requires documentation
 */

import type {PublicAlert} from "@/features/alerts/types";

/**
 * Successful outcome of a server action.
 *
 * @property    {true}          ok      Discriminant
 * @property    {T}             data    Payload returned to the caller. Must be serializable.
 * @property    {PublicAlert}   [alert] Optional; a confirmation to show the user (e.g. "Account created")
 */
export interface ActionSuccess<T> {
    /** TODO: document */
    ok: true;
    /** TODO: document */
    data: T;
    /** TODO: document */
    alert?: PublicAlert;
}

/**
 * Failed outcome of a server action.
 *
 * @property    {false}         ok      Discriminant
 * @property    {PublicAlert}   alert   What to tell the user. Never contains internal detail.
 */
export interface ActionFailure {
    /** TODO: document */
    ok: false;
    /** TODO: document */
    alert: PublicAlert;
}

/**
 * What every server action returns to the client: a discriminated union on `ok`. Expected failures (bad credentials,
 * validation) are values, not exceptions, because Next strips the message from errors thrown out of server actions
 * in production.
 */
export type ActionResult<T = undefined> = ActionSuccess<T> | ActionFailure;

/**
 * Builds a success result.
 *
 * @param   {T}             [data]  Optional; payload for the caller. Must be serializable.
 * @param   {PublicAlert}   [alert] Optional; a confirmation to show the user
 *
 * @return  {ActionSuccess<T>}  The success result.
 */
export function succeed(): ActionSuccess<undefined>;
/**
 * TODO: document
 *
 * @status Requires documentation
 * @typeParam T - TODO: document
 * @param data - TODO: document
 * @param alert - TODO: document
 * @returns TODO: document
 */
export function succeed<T>(data: T, alert?: PublicAlert): ActionSuccess<T>;
export function succeed<T>(data?: T, alert?: PublicAlert): ActionSuccess<T | undefined> {
    return alert ? {ok: true, data, alert} : {ok: true, data};
}

/**
 * Builds a failure result.
 *
 * @param   {PublicAlert}   alert   The alert to show the user, usually from `createAlert`
 *
 * @return  {ActionFailure} The failure result.
 */
export function fail(alert: PublicAlert): ActionFailure {
    return {ok: false, alert};
}
