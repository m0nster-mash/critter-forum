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
 * TODO:: comment
 */
export interface LogoutButtonProps {
    label?: string;
    redirectTo?: string;
    onBeforeLogout?: () => void | Promise<unknown>;
}

/**
 * TODO:: comment
 */
export interface LogoutProps {
    children?: ReactNode;
    redirectTo?: string;
    onSuccess?: () => void;
    onBeforeLogout?: () => void | Promise<unknown>;
}

/**
 * TODO:: comment
 */
export interface DashboardPageProps {
    user: UserPropItems;
}

/**
 * TODO:: comment
 */
export type UserPropItems = {
    name: string;
}
