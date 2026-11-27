/**
 * @fileOverview    Private -> User-facing Dashboard Page
 * @module          user
 */

import DashboardPageView from "@/components/views/dashboard-page-view";
import {requireVerifiedAuth} from "@/features/auth/server/session";

/**
 * Displays the DashboardPageView
 */
export default async function DashboardPage() {

    await requireVerifiedAuth();

    return <DashboardPageView/>;
}
