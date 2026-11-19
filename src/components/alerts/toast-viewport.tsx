"use client";

import {AlertBanner} from "@/components/alerts/alert-banner";
import styles from "@/components/styles/alerts.module.css";
import {TOAST_DURATIONS, type ToastItem} from "@/lib/alerts/client/toast-state";
import {VARIANT_TYPES} from "@/lib/alerts/constants/alert-codes";
import {TOAST_KEYSTROKE, TOAST_LABELS} from "@/lib/alerts/constants/ui";
import {type JSX, type KeyboardEvent, useCallback, useEffect, useRef} from "react";

/**
 * One toast: an AlertBanner plus auto-dismiss.
 *
 * The timer pauses while the pointer is over the toast or focus is inside it, resumes with at least one second
 * left, and restarts whenever an identical alert is merged into it (`version` changes). Escape dismisses it.
 *
 * @param   {} param  TODO:: document
 * @param   {ToastItem }param.item  TODO:: document
 * @param   {(id: string) => void} param.onDismiss  TODO:: document
 *
 * @return TODO:: document
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

    const dismissButton = (
        <button type="button"
                className={styles.dismiss}
                aria-label={TOAST_LABELS.DISMISS_NOTIFICATION}
                onClick={dismiss}>
            {/* TODO:: replace with icon once proper icon handling has been implemented */}
            ×
        </button>
    );

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
 * Properties for the ToastViewport component.
 *
 * @property    {ToastItem[]}               toasts      The toasts to show, oldest first
 * @property    {(id: string) => void}      onDismiss   Called when a toast is dismissed or times out
 */
export interface ToastViewportProps {
    toasts: ToastItem[];
    onDismiss: (id: string) => void;
}

/**
 * Fixed-position stack of toasts. Rendered once, by AlertProvider.
 *
 * @param   {ToastViewportProps}    props   Component properties
 *
 * @return  {JSX.Element}   The notification region.
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
