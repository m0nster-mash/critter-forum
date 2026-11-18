import {DashboardPageProps} from "@/lib/types";

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
