/**
 * @fileOverview    TODO: document
 * @module          features/alerts
 *
 * @status          Requires refactoring and documentation
 */

"use client";

import {AlertBanner} from "@/features/alerts/components/alert-banner";
import {VARIANT_TYPES} from "@/features/alerts/constants/alert-types";
import {TOAST_DURATIONS} from "@/features/alerts/constants/toast";
import {TOAST_KEYSTROKE, TOAST_LABELS} from "@/features/alerts/constants/toast-ui";
import styles from "@/features/alerts/styles/alerts.module.css";
import {ToastItem, ToastViewportProps} from "@/features/alerts/types";
import {type JSX, type KeyboardEvent, useCallback, useEffect, useRef} from "react";

/**
 * Renders a single toast: an {@link AlertBanner} with auto-dismiss.
 *
 * @remark      The timer pauses while the pointer is over the toast or focus is inside it, resumes with at least one
 *              second left, and restarts whenever an identical alert is merged into it (`version` changes).
 * @remark      Escape dismisses the alert toast.
 *
 * @TODO        Document function
 *
 * @param       item        TODO:: document
 * @param       onDismiss   TODO:: document
 *
 * @returns     TODO:: document
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
 * @remarks Rendered once, by {@link AlertProvider}.
 *
 * @param   toasts          TODO:: document
 * @param   onDismiss       TODO:: document
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

/**
 * Renders the dismiss button.
 *
 * @TODO    `×` text-icon with proper icons once the icon system is implemented
 * @TODO    Document function
 *
 * @param   dismiss TODO:: document
 */
function getDismissButton(dismiss: () => void) {
    return <button type="button"
                   className={styles.dismiss}
                   aria-label={TOAST_LABELS.DISMISS_NOTIFICATION}
                   onClick={dismiss}>
        {/* TODO:: replace with icon once proper icon handling has been implemented */}
        ×
    </button>;
}
