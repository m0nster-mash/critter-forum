import {DashboardPageProps} from "@/lib/types";

/**
 * TODO:: document
 *
 * @param {DashboardPageProps} param0
 * @param {UserPropItems} param0.user
 *
 * @return
 */
export function DashboardPagePanel({user}: DashboardPageProps) {

    return (
        <>
            <h3>Welcome, {user.name}</h3>
            <p>
                This is the member-only dashboard.
            </p>
        </>
    );
}
