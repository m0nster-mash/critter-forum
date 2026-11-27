/**
 * @fileOverview    Defines authentication form inputs and component contracts.
 * @module          authentication
 *
 * @remarks         Keep auth-specific component props and normalized auth inputs here. Do not place session or
 *                  authorization contracts here; those are owned by `server/session.ts` and the admin permission
 *                  feature respectively.
 */

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
 * TODO:: document
 */
export interface VerificationResendPanelProps {
    email: string;
}
