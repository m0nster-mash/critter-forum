import type {PublicAlert} from "@/lib/alerts/types";
import {ReactNode} from "react";

/**
 * Properties for authentication (login and registration) handling.
 *
 * @property    {void}  onSuccess   Optional; behaviour on successful login attempt
 */
export interface AuthFlowProps {
    onSuccess?: () => void;
}

/**
 * Properties for configuring the LogoutButton UI component.
 *
 * @property    {string}    [label]             Custom text label rendered on the logout button
 * @property    {string}    [redirectTo]        Navigation route path to redirect user to after logging out
 * @property    {Function}  [onBeforeLogout]    Pre-logout handler executed prior to sign-out execution
 */
export interface LogoutButtonProps {
    label?: string;
    redirectTo?: string;
    onBeforeLogout?: () => void | Promise<unknown>;
}

/**
 * Properties for configuring the Logout container wrapper component.
 *
 * @property    {ReactNode} [children]          Child components wrapped within the interactive logout container
 * @property    {string}    [redirectTo]        Target navigation path following successful sign-out
 * @property    {Function}  [onSuccess]         Callback function executed upon successful session logout
 * @property    {Function}  [onBeforeLogout]    Callback executed prior to invoking sign-out
 */
export interface LogoutProps {
    children?: ReactNode;
    redirectTo?: string;
    onSuccess?: () => void;
    onBeforeLogout?: () => void | Promise<unknown>;
}

/**
 * TODO:: document
 */
export interface AlertBannerProps {
    alert: PublicAlert;
}
