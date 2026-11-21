/**
 @fileOverview    TODO: document
 @module          features/auth

 @status Requires documentation
 */

import {ReactNode} from "react";

/**
 * Properties for authentication (login and registration) handling.
 *
 * @property    onSuccess   Optional; behaviour on successful login attempt
 */
export interface AuthFlowProps {
    onSuccess?: () => void;
}

/**
 * Properties for configuring the LogoutButton UI component.
 *
 * @property    label           Optional; custom text label rendered on the logout button
 * @property    redirectTo      Optional; navigation route path to redirect user to after logging out
 * @property    onBeforeLogout  Optional; pre-logout handler executed prior to sign-out execution
 */
export interface LogoutButtonProps {
    label?: string;
    redirectTo?: string;
    onBeforeLogout?: () => void | Promise<unknown>;
}

/**
 * Properties for configuring the Logout container wrapper component.
 *
 * @property    children        Child components wrapped within the interactive logout container
 * @property    redirectTo      Target navigation path following successful sign-out
 * @property    onSuccess       Callback function executed upon successful session logout
 * @property    onBeforeLogout  Callback executed prior to invoking sign-out
 */
export interface LogoutProps {
    children?: ReactNode;
    redirectTo?: string;
    onSuccess?: () => void;
    onBeforeLogout?: () => void | Promise<unknown>;
}
