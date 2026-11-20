"use client";

import {useAlertContext} from "@/features/alerts/client/alert-provider";
import {logClientAlert} from "@/features/alerts/client/log-alert";
import {ALERT_PRESENTATION_TYPES} from "@/features/alerts/constants/alert-codes";
import type {LogContext, PublicAlert} from "@/features/alerts/types";
import {useCallback, useState} from "react";

/**
 * The one hook components use to raise components.
 *
 * `present(alert)` routes by the alert's registry-defined presentation, so no component decides how an alert looks:
 * - `toast`:  shown in the global toast stack
 * - `inline`: held in this hook's state for the component to render with `<AlertBanner>`
 * - `none`:   logged only
 * In every case the alert is logged per its client log policy.
 *
 * The hook holds one inline alert at a time. Call `clear()` when a new attempt starts.
 *
 * @return  {Object}    `present`, `clear`, `notify` (force a toast), `inline` (the current inline alert),
 *                      `formAlert` (inline alert without a field) and `fieldAlert(name)` (inline alert for one field).
 */
export function useAlerts(): object {
    const {notify} = useAlertContext();
    const [inline, setInline] = useState<PublicAlert | null>(null);

    const present = useCallback((alert: PublicAlert, detail?: LogContext) => {
        switch (alert.presentation) {
            case ALERT_PRESENTATION_TYPES.TOAST:
                notify(alert, detail);
                break;
            case ALERT_PRESENTATION_TYPES.INLINE:
                logClientAlert(alert, detail);
                setInline(alert);
                break;
            case ALERT_PRESENTATION_TYPES.NONE:
                logClientAlert(alert, detail);
                break;
        }
    }, [notify]);

    const clear = useCallback(() => setInline(null), []);

    const fieldAlert = useCallback(
        (field: string): PublicAlert | null => (inline?.field === field ? inline : null),
        [inline],
    );

    return {
        inline,
        formAlert: inline && !inline.field ? inline : null,
        fieldAlert,
        present,
        clear,
        notify,
    };
}
