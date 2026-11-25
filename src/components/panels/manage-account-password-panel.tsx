/**
 * @fileOverview    The private dashboard panel content.
 * @module          core-application
 */

import type {AccountSettingsProps} from "@/lib/types";
import {JSX} from "react";

/**
 * Renders the private / members-only dashboard panel view.
 *
 * @param       user            Authenticated user data
 *
 * @returns     {JSX.Element}   The rendered dashboard panel JSX element.
 */
export function ManageAccountPasswordPanel({user}: AccountSettingsProps): JSX.Element {

    return (
        <section>
            <h2>Change Password</h2>

            <form>
                <div>
                    <label htmlFor="currentPassword">Current Password</label>
                    <input id="currentPassword"
                           name="currentPassword"
                           type="password"
                           autoComplete="current-password"
                           required/>
                </div>

                <div>
                    <label htmlFor="newPassword">New Password</label>
                    <input id="newPassword"
                           name="newPassword"
                           type="password"
                           autoComplete="new-password"
                           required/>
                </div>

                <div>
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input id="confirmPassword"
                           name="confirmPassword"
                           type="password"
                           autoComplete="new-password"
                           required/>
                </div>

                <button type="submit">Change Password</button>
            </form>
        </section>
    );
}
