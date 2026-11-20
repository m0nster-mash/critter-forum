import {clientLogger} from "@/features/alerts/client/logger";
import {getAlertDefinition} from "@/features/alerts/create-alert";
import type {LogContext, PublicAlert} from "@/features/alerts/types";


/**
 * @fileOverview            Writes client alerts to the browser console according to their registry log client policy.
 *                          Client counterpart of the server's logAlert; does nothing if the policy is false.
 * @module                  `features/alerts/client/log-alert`
 * @status                  Good
 *
 * @param   {PublicAlert}   alert           The alert being raised
 * @param   {LogContext}    [detail]        Optional; extra context such as {err} or {scope}
 *
 * @return  {void}
 */


/**
 * Writes an alert to the browser console according to its registry `log.client` policy. Does nothing if the policy is
 * `false`. Client counterpart of the server's `logAlert`.
 *
 * In production only the sanitized fields (code, severity, ref, field, scope) reach the console; `detail` is
 * development-only.
 *
 * @param   {PublicAlert}   alert       The alert being raised
 * @param   {LogContext}    [detail]    Optional; extra context such as `{err}` or `{scope}`
 */
export function logClientAlert(alert: PublicAlert, detail: LogContext = {}): void {

    const level = getAlertDefinition(alert.code).log.client;
    if (!level) {
        return;
    }

    clientLogger[level](alert.code, {
        severity: alert.severity,
        ref: alert.ref,
        field: alert.field,
        userMessage: alert.message,
        ...detail,
    });
}
