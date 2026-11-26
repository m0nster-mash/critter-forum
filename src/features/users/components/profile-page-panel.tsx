/**
 * @fileOverview    The private user profile panel content.
 * @module          core-application
 *
 * @status          Requires full replacement
 * @TODO            Replace content with proper dashboard page at a later date
 */

import {USER_FIELDS} from "@/features/users/constants/fields";
import {UserProfileProps} from "@/features/users/types";
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
            <h2>{user.name}</h2>

            <dl>
                <dt>{USER_FIELDS.ID}</dt>
                <dd>{user.id}</dd>
            </dl>

            <dl>
                <dt>{USER_FIELDS.NAME}</dt>
                <dd>{user.name}</dd>
            </dl>

            <dl>
                <dt>{USER_FIELDS.EMAIL}</dt>
                <dd>{user.email}</dd>
            </dl>
        </main>
    );
}
