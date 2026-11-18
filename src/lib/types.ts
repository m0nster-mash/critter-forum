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

/**
 * TODO:: document
 */
export interface LogoutButtonProps {
    label?: string;
    redirectTo?: string;
    onBeforeLogout?: () => void | Promise<unknown>;
}

/**
 * TODO:: document
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
export interface DashboardPageProps {
    user: UserPropItems;
}

/**
 * TODO:: document
 */
export type UserPropItems = {
    name: string;
}
