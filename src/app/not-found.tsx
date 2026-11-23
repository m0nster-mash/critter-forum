/**
 * @fileOverview    Handles navigation attempts on routes that don't exist.
 * @module          core-application
 */

import PageNotFound from "@/features/alerts/components/page-not-found";
import type {JSX} from "react";

/**
 * Rendered when a route doesn't exist or {@code NotFound()} is called.
 *
 * @returns {JSX.Element}   The not-found UI.
 */
export default function NotFound(): JSX.Element {

    return (<PageNotFound/>);
}
