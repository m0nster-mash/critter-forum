/**
 * @fileOverview    The private user profile panel content.
 * @module          core-application
 *
 * @status          Requires full replacement
 * @TODO            Replace content with proper dashboard page at a later date
 */

import type {UserProfileProps} from "@/lib/types";
import type {JSX} from "react";

/**
 * Renders the signed-in user profile panel.
 *
 * @TODO        Replace content with proper dashboard page at a later date
 *
 * @param       user            Authenticated user data
 *
 * @returns     {JSX.Element}   The rendered dashboard panel JSX element.
 */
export function ProfilePagePanel({user}: UserProfileProps): JSX.Element {

    return (
        <main>
            <h1>{user.name}</h1>

            <dl>
                <dt>User ID</dt>
                <dd>{user.id}</dd>
            </dl>
        </main>
    );
}
