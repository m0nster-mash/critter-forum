/**
 * @fileOverview    Displays the protected alert and error handling test page.
 * @module          features/alerts
 */

import {requireVerifiedAuth} from "@/features/auth/server/session";
import AlertTestPageView from "@/features/alerts/views/alert-test-page-view";

/** Displays the alert test view to verified users. */
export default async function AlertTestPage() {
    await requireVerifiedAuth();
    return <AlertTestPageView/>;
}
