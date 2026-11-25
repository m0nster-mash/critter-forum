/**
 * @fileOverview    The private dashboard panel content.
 * @module          core-application
 *
 * @status          Requires full replacement
 * @TODO            Replace content with proper dashboard page at a later date
 */

import {UserSummary} from "@/features/users/types";
import {PRIVATE_ROUTES} from "@/lib/constants/routes";
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
export function DashboardPagePanel({id, name}: UserSummary): JSX.Element {

    return (
        <>
            <h3>Welcome, <Link href={resolvePath(PRIVATE_ROUTES.PROFILE, {userId: id})}>{name}</Link></h3>
            <p>
                This is the member-only dashboard.
            </p>
        </>
    );
}
