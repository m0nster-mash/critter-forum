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
 * Writes an alert to the server log according to its registry log policy.
 *
 * @remarks     Does nothing if the policy is `false`.
 * @remarks     The user-facing alert is logged alongside `detail`, the internal-only context (caught error, user ID,
 *              request info) that must never reach the browser.
 * @remarks     The alert code is the log message, so entries are easy to grep.
 *
 * @param       alert   The alert being raised
 * @param       detail  Optional; internal-only context (ex. `{err}`)
 */
export function logAlert(alert: PublicAlert, detail: LogContext = {}): void {

    const level = getAlertDefinition(alert.code).log.server;
    if (!level) return;

    logger[level](alert.code, {
        severity: alert.severity,
        userMessage: alert.message,
        ref: alert.ref,
        field: alert.field,
        ...detail,
    });
}
