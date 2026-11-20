import {DashboardPageProps} from "@/lib/types";
import {JSX} from "react";

/**
 *
 * @status          Requires fill replacement
 * @TODO            Replace content with proper dashboard page at a later date
 *
 * @fileOverview    Renders the member dashboard panel view.
 *
 * @param           {DashboardPageProps}    props       The component properties containing user context
 * @param           {UserPropItems}         props.user  Authenticated user data
 *
 * @return          {JSX.Element}                       The rendered dashboard panel JSX element.

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
