/**
 * @fileOverview    Renders and manages the timed, dismissible toast notification stack.
 * @module          features/alerts
 */

"use client";

import {AlertBanner} from "@/features/alerts/components/alert-banner";
import {VARIANT_TYPES} from "@/features/alerts/constants/alert-types";
import {TOAST_DURATIONS} from "@/features/alerts/constants/toast";
import {TOAST_KEYSTROKE, TOAST_LABELS} from "@/features/alerts/constants/toast-ui";
import styles from "@/features/alerts/styles/alerts.module.css";
import type {ToastItem, ToastViewportProps} from "@/features/alerts/types";
import Icon from "@/features/icons/components/icon";
import {ICON_SIZE, UI_ICONS} from "@/features/icons/constants/groups";
import {type JSX, type KeyboardEvent, useCallback, useEffect, useRef} from "react";

/**
 * Renders a single toast: an {@link AlertBanner} with auto-dismiss.
 *
 * @remark      The timer pauses while the pointer is over the toast or focus is inside it, resumes with at least one
 *              second left, and restarts whenever an identical alert is merged into it (`version` changes).
 * @remark      Escape dismisses the alert toast.
 *
 *
 * @param       item        Toast item containing the alert and its display state.
 * @param       onDismiss   Callback invoked with the ID of the toast to dismiss.
 *
 * @returns     The value produced by this operation.
 */
function Toast({item, onDismiss}: {
    item: ToastItem;
    onDismiss: (id: string) => void
}): JSX.Element {

    const {id, alert, count, version} = item;
    const duration = TOAST_DURATIONS[alert.severity];

    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const startedAt = useRef(0);
    const remaining = useRef(duration);
    const hovering = useRef(false);
    const focusing = useRef(false);

    const dismiss = useCallback(() => onDismiss(id), [onDismiss, id]);

    const start = useCallback(() => {
        startedAt.current = Date.now();
        timer.current = setTimeout(dismiss, remaining.current);
    }, [dismiss]);

    const stop = useCallback(() => {
        if (timer.current === undefined) return;
        clearTimeout(timer.current);
        timer.current = undefined;
        remaining.current = Math.max(remaining.current - (Date.now() - startedAt.current), 1000);
    }, []);

    const sync = useCallback(() => {
        if (hovering.current || focusing.current) {
            stop();
        } else if (timer.current === undefined) {
            start();
        }
    }, [start, stop]);

    useEffect(() => {
        remaining.current = duration;
        if (!hovering.current && !focusing.current) {
            start();
        }
        return () => {
            clearTimeout(timer.current);
            timer.current = undefined;
        };
    }, [version, duration, start]);

    const dismissButton = getDismissButton(dismiss);

    return (
        <div className={styles.toastItem}
             onPointerEnter={() => {
                 hovering.current = true;
                 sync();
             }}
             onPointerLeave={() => {
                 hovering.current = false;
                 sync();
             }}
             onFocus={() => {
                 focusing.current = true;
                 sync();
             }}
             onBlur={() => {
                 focusing.current = false;
                 sync();
             }}
             onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
                 if (event.key === TOAST_KEYSTROKE.ESCAPE) dismiss();
             }}>
            <AlertBanner alert={alert}
                         variant={VARIANT_TYPES.TOAST}
                         count={count}
                         action={dismissButton}/>
        </div>
    );
}

/**
 * Fixed-position stack of toasts.
 *
 * @remarks     Rendered once, by {@link AlertProvider}.
 *
 * @param       toasts          Toast items to render, ordered from oldest to newest.
 * @param       onDismiss       Callback invoked with the ID of the toast to dismiss.
 *
 * @returns     {JSX.Element}   The notification region.
 */
export function ToastViewport({toasts, onDismiss}: ToastViewportProps): JSX.Element {
    return (
        <div className={styles.viewport} role="region" aria-label={TOAST_LABELS.NOTIFICATIONS}>
            {toasts.map((item) => (
                <Toast key={item.id} item={item} onDismiss={onDismiss}/>
            ))}
        </div>
    );
}

/**
 * Renders the dismiss button.
 *
 * @param       dismiss Callback that dismisses the current toast.
 *
 * @returns     The value produced by this operation.
 */
function getDismissButton(dismiss: () => void) {
    return <button type="button"
                   className={styles.dismiss}
                   aria-label={TOAST_LABELS.DISMISS_NOTIFICATION}
                   onClick={dismiss}>
        <Icon name={UI_ICONS.CLOSE} size={ICON_SIZE.SMALL}/>
    </button>;
}
