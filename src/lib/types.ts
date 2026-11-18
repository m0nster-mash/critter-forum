import {ReactNode} from "react";

/**
 * Properties for the PageHeader object.
 *
 * @property    {ReactNode} title   The page's title
 */
export interface PageHeaderProps {
    title: ReactNode;
}

/**
 * Properties for authentication (login and registration) handling.
 *
 * @property    {void}  onSuccess   Optional; behaviour on successful login attempt
 */
export interface AuthFlowProps {
    onSuccess?: () => void;
}

export interface LogoutButtonProps {
    label?: string;
    redirectTo?: string;
    onBeforeLogout?: () => void | Promise<unknown>;
}

export interface LogoutProps {
    children?: ReactNode;
    redirectTo?: string;
    onBeforeLogout?: () => void | Promise<unknown>;
    onSuccess?: () => void;
}
