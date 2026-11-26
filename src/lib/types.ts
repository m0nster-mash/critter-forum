/**
 * @fileOverview    Defines shared presentation and user-data contracts used across application features.
 * @module          core-application
 *
 * @remarks         Keep only genuinely cross-feature contracts here. Feature-specific props belong in their feature's
 *                  own `types.ts` file, even when their structure resembles a type defined elsewhere.
 */

import {UserSummary} from "@/features/users/types";

/**
 * Props for the dashboard page panel.
 *
 * @remarks     Use at the view/panel boundary after the server has selected the user summary to display. Do not pass a
 *              Better Auth session or raw database record directly.
 *
 * @property    user    User identity and contact details for the dashboard.
 */
export interface DashboardPageProps {
    user: UserSummary;
}
