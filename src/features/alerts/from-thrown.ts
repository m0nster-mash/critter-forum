import {APP_ALERT_CODES} from "@/features/alerts/constants/alert-codes";
import {createAlert} from "@/features/alerts/create-alert";
import type {PublicAlert} from "@/features/alerts/types";

/**
 * Converts something caught on the client (typically from a failed server action or fetch) into an alert. A failed
 * network request becomes `APP_NETWORK_ERROR`; everything else becomes the generic `APP_UNKNOWN_ERROR`. The thrown
 * value's message is never shown to the user.
 *
 * @param   {unknown}   error   The caught value
 *
 * @return  {PublicAlert}   A user-safe alert.
 */
export function alertFromThrown(error: unknown): PublicAlert {
    const offline = typeof navigator !== "undefined" && !navigator.onLine; // TODO:: clean this (magic/const, types)
    const failedFetch = error instanceof TypeError && /fetch|network|load failed/i.test(error.message); // TODO:: clean this (magic/const, types)

    return createAlert(offline || failedFetch ? APP_ALERT_CODES.NETWORK_ERROR : APP_ALERT_CODES.UNKNOWN_ERROR);
}
