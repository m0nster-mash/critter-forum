/**
 * @fileOverview    Composes the page header and verification-resend panel.
 * @module          authentication
 */

import {VerificationResendPanel} from "@/features/auth/components/verification-resend-panel";
import type {VerificationResendPanelProps} from "@/features/auth/types";
import {PageHeader} from "@/features/navigation/components/page-header";
import {PUBLIC_ROUTES} from "@/lib/constants/routes";
import {getPageHeaderProps} from "@/lib/utilities/route-utils";
import type {JSX} from "react";

/**
 * Renders the email verification page.
 */
export function VerifyEmailView({email}: VerificationResendPanelProps): JSX.Element {
    return (
        <>
            <PageHeader {...getPageHeaderProps(PUBLIC_ROUTES.VERIFY_EMAIL)}/>
            <VerificationResendPanel email={email}/>
        </>
    );
}
