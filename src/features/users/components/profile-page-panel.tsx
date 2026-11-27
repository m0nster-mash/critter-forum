/**
 * @fileOverview    The private user profile panel content.
 * @module          core-application
 */

import {USER_FIELDS} from "@/features/users/constants/fields";
import {UserProfileProps} from "@/features/users/types";
import type {JSX} from "react";

/**
 * Renders the signed-in user profile panel.
 *
 * @param       user            Authenticated user data
 *
 * @returns     {JSX.Element}   The rendered dashboard panel JSX element.
 */
export function ProfilePagePanel({user}: UserProfileProps): JSX.Element {

    return (
        <>
            <h3>{user.name}</h3>

            <dl>
                <dt><strong>{USER_FIELDS.ID}</strong></dt>
                <dd>{user.id}</dd>
            </dl>

            <dl>
                <dt><strong>{USER_FIELDS.NAME}</strong></dt>
                <dd>{user.name}</dd>
            </dl>

            <dl>
                <dt><strong>{USER_FIELDS.EMAIL}</strong></dt>
                <dd>{user.email}</dd>
            </dl>
        </>
    );
}
