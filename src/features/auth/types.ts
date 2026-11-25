
/**
 * @fileOverview    Defines shared types for authentication components and registration input.
 * @module          features/auth
 */

import type {ReactNode} from "react";

/**
 * Properties accepted by authentication flow components.
 *
 * @remarks     Shared by the login and registration panels.
 *
 * @property    [onSuccess]     Optional; callback executed after a successful authentication flow.
 */
export interface AuthFlowProps {
    onSuccess?: () => void;
}

/**
 * Properties accepted by the LogoutButton component.
 *
 * @property    [label]             Optional; custom text displayed on the logout button.
 * @property    [redirectTo]        Optional; route to navigate to after successful logout.
 * @property    [onBeforeLogout]    Optional; callback executed before sign-out is requested.
 */
export interface LogoutButtonProps {
    label?: string;
    redirectTo?: string;
    onBeforeLogout?: () => void | Promise<unknown>;
}

/**
 * Properties accepted by the Logout component.
 *
 * @property    [children]          Optional; child elements rendered inside the logout wrapper.
 * @property    [redirectTo]        Optional; route to navigate to after successful logout.
 * @property    [onSuccess]         Optional; callback executed after successful sign-out.
 * @property    [onBeforeLogout]    Optional; callback executed before sign-out is requested.
 */
export interface LogoutProps {
    children?: ReactNode;
    redirectTo?: string;
    onSuccess?: () => void;
    onBeforeLogout?: () => void | Promise<unknown>;
}

/**
 * Defines the normalized values required to register a user account.
 *
 * @remarks     The name and email are trimmed and normalized before validation and account creation.
 * @remarks     The password remains plain text while being passed through the registration action; it must not be
 *              logged.
 *
 * @property    name        Display name supplied during registration.
 * @property    email       Email address supplied during registration.
 * @property    password    Plain-text password supplied for account creation.
 */
export interface RegistrationInput {
    name: string;
    email: string;
    password: string;
}
