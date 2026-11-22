/**
 * @fileOverview    Handling writing the alert to the browser console.
 * @module          features/alerts
 */

import {clientLogger} from "@/features/alerts/client/logger";
import {getAlertDefinition} from "@/features/alerts/create-alert";
import type {LogContext, PublicAlert} from "@/features/alerts/types";

/**
 * Writes an alert to the browser console according to its registry `log.client` policy.
 *
 * @remarks     Does nothing if the policy is `false`. Client counterpart of the server's `logAlert`.
 * @remarks     In production only the sanitized fields (code, severity, ref, field, scope) reach the console; `detail`
 *              is development-only.
 *
 * @param       alert   The alert being raised
 * @param       detail  Extra context such as {err} or {scope}
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
