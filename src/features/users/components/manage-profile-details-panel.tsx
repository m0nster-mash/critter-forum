/**
 * @fileOverview    The private account management panel content.
 * @module          core-application
 */

import type {AccountSettingsProps} from "@/lib/types";
import {JSX} from "react";

/**
 * Renders the user's account management panel.
 *
 * @param       user            Authenticated user data
 *
 * @returns     {JSX.Element}   The rendered account management panel JSX element.
 */
export function ManageProfileDetailsPanel({user}: AccountSettingsProps): JSX.Element {

    return (
        <section>
            <h2>Profile Details</h2>

            <form>
                <div>
                    <label htmlFor="name">Name</label>
                    <input id="name"
                           name="name"
                           type="text"
                           defaultValue={user.name}
                           required/>
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input id="email"
                           name="email"
                           type="email"
                           defaultValue={user.email}
                           required/>
                </div>

                <button type="submit">Update Profile</button>
            </form>
        </section>
    );
}
