import {getAlertDefinition} from "@/lib/alerts/create-alert";
import {logger, type LogContext} from "@/lib/alerts/client/logger";
import type {PublicAlert} from "@/lib/alerts/types";

/**
 * Logs a client-originated alert according to the registry's client policy.
 *
 * Use this only for failures the browser uniquely knows about (for example, a network failure
 * or an exception in a client event handler). Do not call it for server failures that have
 * already been logged by the server.
 */
export function logAlert(alert: PublicAlert, detail: LogContext = {}): void {
    const level = getAlertDefinition(alert.code).log.client;
    if (!level) return;

    logger[level](alert.code, {
        message: alert.message,
        ref: alert.ref,
        ...detail,
    });
}
