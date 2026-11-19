import type {AlertSeverity} from "@/lib/alerts/types";
import type {JSX} from "react";

// TODO:: replace with proper icons once icon handling is complete
const PATHS: Record<AlertSeverity, string> = {
    success: "M10 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Zm4.03 6.28-4.5 5.5a.75.75 0 0 1-1.1.06l-2.5-2.5a.75.75 0 1 1 1.06-1.06l1.9 1.9 3.97-4.85a.75.75 0 1 1 1.17.95Z",
    info: "M10 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Zm.75 12.5h-1.5V9h1.5v5Zm0-6.5h-1.5V6h1.5v1.5Z",
    warning: "M9.13 2.5a1 1 0 0 1 1.74 0l7.2 12.5A1 1 0 0 1 17.2 16.5H2.8a1 1 0 0 1-.87-1.5L9.13 2.5ZM10.75 13h-1.5v1.5h1.5V13Zm0-6h-1.5v5h1.5V7Z",
    error: "M10 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Zm3.28 10.72a.75.75 0 1 1-1.06 1.06L10 11.06l-2.22 2.22a.75.75 0 0 1-1.06-1.06L8.94 10 6.72 7.78a.75.75 0 0 1 1.06-1.06L10 8.94l2.22-2.22a.75.75 0 1 1 1.06 1.06L11.06 10l2.22 2.22Z",
};

/**
 * Decorative severity icon. Hidden from assistive tech; the banner carries a screen-reader-only severity label.
 *
 * @param   {Object}            props           Component properties
 * @param   {AlertSeverity}     props.severity  Which icon to draw
 * @param   {string}            [props.className]   Optional; class applied to the SVG
 *
 * @return  {JSX.Element}   The icon.
 */
export function AlertIcon({severity, className}: {
    severity: AlertSeverity;
    className?: string
}): JSX.Element {

    return (
        <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
            <path d={PATHS[severity]}/>
        </svg>
    );
}
