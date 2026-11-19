import {clientLogger} from "@/lib/alerts/client/logger";
import {getAlertDefinition} from "@/lib/alerts/create-alert";
import type {LogContext, PublicAlert} from "@/lib/alerts/types";

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
