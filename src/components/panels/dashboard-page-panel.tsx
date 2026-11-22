/**
 * @fileOverview    The private dashboard panel content.
 * @module          core-application
 *
 * @status          Requires full replacement
 * @TODO            Replace content with proper dashboard page at a later date
 */

import {DashboardPageProps} from "@/lib/types";
import {JSX} from "react";

/**
 * Renders the private / members-only dashboard panel view.
 *
 * @TODO        Replace content with proper dashboard page at a later date
 *
 * @param       user            Authenticated user data
 *
 * @returns     {JSX.Element}   The rendered dashboard panel JSX element.
 */
export function DashboardPagePanel({user}: DashboardPageProps): JSX.Element {

    return (
        <>
            <h3>Welcome, {user.name}</h3>
            <p>
                This is the member-only dashboard.
            </p>
        </>
    );
}
