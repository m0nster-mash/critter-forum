"use client";

import type {PublicAlert} from "@/lib/alerts/types";
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

/**
 * TODO:: relocated to correct types file
 */
interface Toast extends PublicAlert {
    id: string;
}

/**
 * TODO:: relocate to correct types file
 */
interface ToastContextValue {
    notify: (alert: PublicAlert) => void;
    dismiss: (id: string) => void;
}

/**
 * TODO:: relocate to correct types file
 */
type ToastAction =
    | { type: "add"; toast: Toast }
    | { type: "dismiss"; id: string };

const ToastContext = createContext<ToastContextValue | null>(null);

// TODO:: relocate to correct const file
const MAX_TOASTS = 5;

// TODO:: relocate to correct const file
const TOAST_DURATIONS = {
    success: 5000,
    info: 5000,
    warning: 8000,
    error: 10000,
} as const;

/**
 * TODO:: document
 *
 * TODO:: replace magic strings with const
 *
 * @param state
 * @param action
 */
function toastReducer(state: Toast[], action: ToastAction): Toast[] {
    if (action.type === "dismiss") {
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
 * Returns the toast notification functions.
 *
 * TODO:: replace magic strings with const
 *
 * TODO:: use correct error handling
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
 * TODO:: replace magic strings with const
 *
 * @param   {Object}    props
 * @param   {ReactNode} props.children   Application content
 * @return  {JSX.Element}                Provider and toast viewport
 */
export function AlertProvider({children}: { children: ReactNode }): JSX.Element {
    const [toasts, dispatch] = useReducer(toastReducer, []);

    const dismiss = useCallback((id: string) => {
        dispatch({type: "dismiss", id});
    }, []);

    const notify = useCallback((alert: PublicAlert) => {
        const toast: Toast = {
            ...alert,
            id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`,
        };

        dispatch({type: "add", toast});
    }, []);

    const value = useMemo(() => ({notify, dismiss}), [notify, dismiss]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="alert-toast-viewport"
                 aria-label="Notifications">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id}
                               toast={toast}
                               onDismiss={dismiss}/>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

/**
 * TODO:: document
 *
 * TODO:: replace magic strings with const
 *
 * @param param0
 * @param param0.toast
 * @param param0.onDismiss
 * @constructor
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

    const role = toast.severity === "error" ? "alert" : "status";

    return (
        <div className={`alert-toast alert-toast-${toast.severity}`}
             role={role}
             aria-live={role === "alert" ? "assertive" : "polite"}
             onMouseEnter={() => setHovered(true)}
             onMouseLeave={() => setHovered(false)}
             onFocusCapture={() => setFocused(true)}
             onBlurCapture={() => setFocused(false)}>
            <div>
                <p>{toast.message}</p>
                {toast.ref && <small>Reference: {toast.ref}</small>}
            </div>
            <button type="button"
                    aria-label="Dismiss notification"
                    onClick={dismiss}>
                {/* TODO:: replace × with an icon */}
                ×
            </button>
        </div>
    );
}
