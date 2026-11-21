/**
 * @fileOverview    TODO: document
 * @module          features/alerts
 *
 * @status          Requires documentation
 */

import {getAlertDefinition} from "@/features/alerts/create-alert";
import {LogContext, logger} from "@/features/alerts/server/logger";
import type {PublicAlert} from "@/features/alerts/types";

/**
 * Writes an alert to the server log according to its registry log policy. Does nothing if the policy is `false`.
 *
 * The user-facing alert is logged alongside `detail`, the internal-only context (caught error, user ID, request
 * info) that must never reach the browser. The alert code is the log message, so entries are easy to grep.
 *
 * @param   {PublicAlert}   alert       The alert being raised
 * @param   {LogContext}    [detail]    Optional; internal-only context, e.g. `{err}`
 */
export function logAlert(alert: PublicAlert, detail: LogContext = {}): void {
    const level = getAlertDefinition(alert.code).log.server;
    if (!level) {
        return;
    }

    logger[level](alert.code, {
        severity: alert.severity,
        userMessage: alert.message,
        ref: alert.ref,
        field: alert.field,
        ...detail,
    });
}
