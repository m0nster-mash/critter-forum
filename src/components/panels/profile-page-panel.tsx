/**
 * @fileOverview    The private dashboard panel content.
 * @module          core-application
 *
 * @status          Requires full replacement
 * @TODO            Replace content with proper dashboard page at a later date
 */

import {PRIVATE_ROUTES} from "@/lib/constants/routes";
import {DashboardPageProps, UserProfilePageProps, UserProfileProps} from "@/lib/types";
import {resolvePath} from "@/lib/utilities/route-utils";
import Link from "next/link";
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
