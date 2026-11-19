import {createAlert} from "@/lib/alerts/create-alert";
import type {PublicAlert} from "@/lib/alerts/types";

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
    const offline = typeof navigator !== "undefined" && navigator.onLine === false;
    const failedFetch = error instanceof TypeError && /fetch|network|load failed/i.test(error.message);

    return createAlert(offline || failedFetch ? "APP_NETWORK_ERROR" : "APP_UNKNOWN_ERROR");
}
