"use client";

import type {PublicAlert, Toast, ToastAction, ToastContextValue} from "@/lib/alerts/types";
import {ALERT_SEVERITY_ERROR, MAX_TOASTS, TOAST_ACTION_TYPES, TOAST_DURATIONS, TOAST_UI} from "@/lib/constants/alerts";
import {
    createContext,
    JSX,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    useState,
} from "react";

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Applies toast additions and dismissals, suppressing duplicate alerts and enforcing the viewport size limit.
 *
 * @param   {Toast[]}       state   Current toast notifications
 * @param   {ToastAction}   action  State transition to apply
 *
 * @return  {Toast[]}               Updated toast notifications
 */
function toastReducer(state: Toast[], action: ToastAction): Toast[] {
    if (action.type === TOAST_ACTION_TYPES.DISMISS) {
        return state.filter((toast) => toast.id !== action.id);
    }

    const duplicate = state.some((toast) =>
        toast.code === action.toast.code
        && toast.message === action.toast.message
        && toast.ref === action.toast.ref
    );

    if (duplicate) {
        return state;
    }

    return [...state, action.toast].slice(-MAX_TOASTS);
}

/**
 * Returns the toast notification functions from the nearest AlertProvider.
 *
 * @return  {ToastContextValue} Context methods for notifying and dismissing alerts
 *
 * @throws  {Error}             When called outside an AlertProvider
 */
export function useAlert(): ToastContextValue {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error("useAlert must be used within an AlertProvider.");
    }

    return context;
}

/**
 * Displays the toast viewport and provides notification functions to descendants.
 *
 * @param   {Object}    props
 * @param   {ReactNode} props.children  Application content
 *
 * @return  {JSX.Element}               Provider and toast viewport
 */
export function AlertProvider({children}: { children: ReactNode }): JSX.Element {
    const [toasts, dispatch] = useReducer(toastReducer, []);

    const dismiss = useCallback((id: string) => {
        dispatch({type: TOAST_ACTION_TYPES.DISMISS, id});
    }, []);

    const notify = useCallback((alert: PublicAlert) => {
        const toast: Toast = {
            ...alert,
            id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`,
        };

        dispatch({type: TOAST_ACTION_TYPES.ADD, toast});
    }, []);

    const value = useMemo(() => ({notify, dismiss}), [notify, dismiss]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className={TOAST_UI.VIEWPORT_CLASS} aria-label={TOAST_UI.VIEWPORT_LABEL}>
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onDismiss={dismiss}/>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

/**
 * Renders one toast notification and pauses its auto-dismiss countdown while hovered or focused.
 *
 * @param   {Object}                props           Toast data and its dismissal callback
 * @param   {Toast}                 props.toast     Notification to render
 * @param   {(id: string) => void}  props.onDismiss Callback invoked when the toast is dismissed
 *
 * @return  {JSX.Element}                           Rendered toast notification
 */
function ToastItem({
                       toast,
                       onDismiss,
                   }: {
    toast: Toast;
    onDismiss: (id: string) => void;
}): JSX.Element {

    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    const paused = hovered || focused;
    const remaining = useRef<number>(TOAST_DURATIONS[toast.severity]);
    const startedAt = useRef(0);
    const timer = useRef<number | undefined>(undefined);

    const dismiss = useCallback(() => {
        onDismiss(toast.id);
    }, [onDismiss, toast.id]);

    useEffect(() => {
        if (paused) {
            return;
        }

        startedAt.current = Date.now();
        timer.current = window.setTimeout(dismiss, remaining.current);

        return () => {
            if (timer.current !== undefined) {
                window.clearTimeout(timer.current);
                timer.current = undefined;
            }

            remaining.current = Math.max(
                0,
                remaining.current - (Date.now() - startedAt.current),
            );
        };
    }, [paused, dismiss]);

    const role = toast.severity === ALERT_SEVERITY_ERROR ? TOAST_UI.ALERT_ROLE : TOAST_UI.STATUS_ROLE;

    return (
        <div className={`alert-toast alert-toast-${toast.severity}`}
             role={role}
             aria-live={role === TOAST_UI.ALERT_ROLE ? TOAST_UI.ASSERTIVE_LIVE : TOAST_UI.POLITE_LIVE}
             onMouseEnter={() => setHovered(true)}
             onMouseLeave={() => setHovered(false)}
             onFocusCapture={() => setFocused(true)}
             onBlurCapture={() => setFocused(false)}>
            <div>
                <p>{toast.message}</p>
                {toast.ref && <small>{TOAST_UI.REFERENCE_LABEL}{toast.ref}</small>}
            </div>
            <button type="button"
                    aria-label={TOAST_UI.DISMISS_LABEL}
                    onClick={dismiss}>
                {/* TODO:: replace × with an icon */}
                ×
            </button>
        </div>
    );
}
