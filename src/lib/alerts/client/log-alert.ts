import {ClientLogContext} from "@/lib/alerts/client/logger";
import {getAlertDefinition} from "@/lib/alerts/create-alert";
import {PublicAlert} from "@/lib/alerts/types";
import {clientLogger} from "@/lib/types";

/**
 * Writes an alert to the client log according to its registry log policy.
 *
 * @param   {PublicAlert}       alert       The alert being raised
 * @param   {ClientLogContext}  [detail]    Optional context
 */
export function logClientAlert(
    alert: PublicAlert,
    detail: ClientLogContext = {}
): void {

    const level = getAlertDefinition(alert.code).log.client;
    if (!level) return;

    const context = {
        ...detail,
        code: alert.code,
        ref: alert.ref,
    };

    clientLogger[level](alert.code, context);
}
