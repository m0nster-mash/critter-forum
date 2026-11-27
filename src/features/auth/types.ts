/**
 * @fileOverview    Defines authentication form inputs and component contracts.
 * @module          authentication
 *
 * @remarks         Keep auth-specific component props and normalized auth inputs here. Do not place session or
 *                  authorization contracts here; those are owned by `server/session.ts` and the admin permission
 *                  feature respectively.
 */

import {RESEND_REASON} from "@/features/auth/constants/resend";
import type {ReactNode} from "react";

/**
 * Shared success callback contract for login and registration flows.
 *
 * @remarks     Use when an auth form component supports a caller-provided success notification or follow-up. The
 *              callback intentionally carries no payload because the forms own their result handling.
 *
 * @property    [onSuccess]     Optional callback invoked after the authentication flow succeeds.=
 */
export interface AuthFlowProps {
    onSuccess?: () => void;
}

/**
 * Props for the logout button component.
 *
 * @remarks     Use for the button-level sign-out control. `onBeforeLogout` may perform synchronous or asynchronous
 *              preparation; the button owns the actual sign-out operation and navigation.
 *
 * @property    [label]             Optional visible button label.
 * @property    [redirectTo]        Optional route to navigate to after successful sign-out.
 * @property    [onBeforeLogout]    Optional preparation hook invoked before sign-out.
 */
export interface LogoutButtonProps {
    label?: string;
    redirectTo?: string;
    onBeforeLogout?: () => void | Promise<unknown>;
}

/**
 * Props for the compositional logout container.
 *
 * @remarks     Use when wrapping arbitrary child content with logout behaviour. This is intentionally separate from
 *              `LogoutButtonProps`: the container supports children and an `onSuccess` callback, while the button
 *              exposes its own label.
 *
 * @property    [children]          Optional content rendered inside the logout container.
 * @property    [redirectTo]        Optional route to navigate to after successful sign-out.
 * @property    [onSuccess]         Optional callback executed after successful logout.
 * @property    [onBeforeLogout]    Optional handler executed before sign-out; may be asynchronous.
 */
export interface LogoutProps {
    children?: ReactNode;
    redirectTo?: string;
    onSuccess?: () => void;
    onBeforeLogout?: () => void | Promise<unknown>;
}

/**
 * Normalized registration values shared by client validation and the server action.
 *
 * @remarks     Values are trimmed/normalized before validation. `password` remains plain text only for the duration of
 *              the form/action request; never log it, persist it directly, or include it in alert/log context.
 *
 * @property    name        Normalized display name.
 * @property    email       Normalized email address.
 * @property    password    Submitted password, passed to Better Auth for secure handling.
 */
export interface RegistrationInput {
    name: string;
    email: string;
    password: string;
}

/**
 * Props for the verification-resend panel component.
 *
 * @remarks     Consumed by `VerificationResendPanel` and `VerifyEmailView` to render the resend UI for a given email.
 *
 * @property    email   The user's email address to resend the verification email to.
 */
export interface VerificationResendPanelProps {
    email: string;
}

/**
 * Persisted resend state used by the policy evaluator.
 *
 * @property    attempts            Number of resend attempts recorded in the current window.
 * @property    windowStartedAt     Timestamp when the current resend window began.
 * @property    lastSentAt          Timestamp of the last sent verification email, or `null` if none has been sent.
 */
export interface VerificationResendState {
    attempts: number;
    windowStartedAt: Date;
    lastSentAt: Date | null;
}

/**
 * Result of evaluating one verification-email resend request.
 *
 * @property    allowed             Whether the resend request is allowed.
 * @property    attempts            Number of attempts recorded in the current window.
 * @property    windowStartedAt     Timestamp when the current resend window began.
 * @property    retryAfterSeconds   Seconds to wait before the next retry, when the request is not allowed.
 * @property    reason              Optional denial reason: `RESEND_REASON.COOLDOWN` or `RESEND_REASON.LIMIT`.
 */
export interface VerificationResendDecision {
    allowed: boolean;
    attempts: number;
    windowStartedAt: Date;
    retryAfterSeconds: number;
    reason?: typeof RESEND_REASON.COOLDOWN | typeof RESEND_REASON.LIMIT;
}

/**
 * Result of cleaning up unverified accounts.
 *
 * @remarks     Returned by the account-cleanup job to report how many records were removed and whether more remain.
 *
 * @property    deletedCount    Number of unverified accounts deleted.
 * @property    hasMore         Whether additional unverified accounts remain beyond the cutoff date.
 * @property    cutoff          The cutoff date used to determine which accounts qualify as stale.
 */
export interface UnverifiedAccountCleanupResult {
    deletedCount: number;
    hasMore: boolean;
    cutoff: Date;
}
