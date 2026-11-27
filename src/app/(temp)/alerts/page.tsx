/**
 * @fileOverview    Displays the protected alert and error handling test page.
 * @module          alerts
 */

import AlertTestPageView from "@/features/alerts/views/alert-test-page-view";
import {requireVerifiedAuth} from "@/features/auth/server/session";

/** Displays the alert test view to verified users. */
export default async function AlertTestPage() {

    await requireVerifiedAuth();

    return <AlertTestPageView/>;
}
