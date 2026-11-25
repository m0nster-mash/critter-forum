/**
 * @fileOverview    The private dashboard panel content.
 * @module          core-application
 *
 * @status          Requires full replacement
 * @TODO            Replace content with proper dashboard page at a later date
 */

import {UserSummary} from "@/features/users/types";
import React, {JSX} from "react";

/**
 * Renders the private / members-only dashboard panel view.
 *
 * @TODO        Replace content with proper dashboard page at a later date
 *
 * @param       user            Authenticated user data
 *
 * @returns     {JSX.Element}   The rendered dashboard panel JSX element.
 */
export function ProfilePagePanel({id, name, email}: UserSummary): JSX.Element {

    return (
        <main>
            <h1>{name}</h1>

            <dl>
                <dt>User ID</dt>
                <dd>{id}</dd>
            </dl>

            <dl>
                <dt>Email</dt>
                <dd>{email}</dd>
            </dl>
        </main>
    );
}
