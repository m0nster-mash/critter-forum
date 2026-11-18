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
 * Property object structure passed into the DashboardPagePanel component.
 *
 * @property    {UserPropItems} user    User metadata object required for rendering dashboard user UI details.
 */
export interface DashboardPageProps {
    user: UserPropItems;
}

/**
 * Essential user profile attributes required by view panels.
 *
 * @property    {string}    name    The display name of the authenticated user.
 */
export type UserPropItems = {
    name: string;
}
