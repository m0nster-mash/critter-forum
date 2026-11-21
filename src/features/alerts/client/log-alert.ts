/**
 * TODO: document
 *
 * @module features/alerts/client/log-alert
 * @status Requires documentation
 */

import {clientLogger} from "@/features/alerts/client/logger";
import {getAlertDefinition} from "@/features/alerts/create-alert";
import type {LogContext, PublicAlert} from "@/features/alerts/types";


/**
 * @module          `features/alerts`
 * @status          Good
 *
 * @fileOverview    Writes an alert to the browser console according to its registry `log.client` policy. Does nothing if the policy is `false`. Client counterpart of the server's `logAlert`. In production only the sanitized fields (code, severity, ref, field, scope) reach the console; `detail` is development-only.
 *
 * @param           {PublicAlert}   alert       The alert being raised
 * @param           {LogContext}    [detail]    Extra context such as {err} or {scope}
 *
 * @return          {void}  TODO:: document
 */
export function logClientAlert(
    alert: PublicAlert,
    detail: LogContext = {}
): void {

    const level = getAlertDefinition(alert.code).log.client;
    if (!level) return;

    clientLogger[level](alert.code, {
        severity: alert.severity,
        ref: alert.ref,
        field: alert.field,
        userMessage: alert.message,
        ...detail,
    });
}
