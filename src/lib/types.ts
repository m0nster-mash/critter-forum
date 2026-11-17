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
 * Properties for login handling.
 *
 * @property    {void}  onSuccess   Optional; behaviour on successful login attempt
 */
export interface LoginPanelProps {
    onSuccess?: () => void;
}
