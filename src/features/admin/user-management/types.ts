/**
 * @fileOverview    Defines Next.js route props for admin user-management pages.
 * @module          features/admin/user-management
 *
 * @remarks         These types describe framework page boundaries only. Resolved identifiers and component props are
 *                  declared in `src/features/admin/permissions/types.ts`.
 */

/**
 * Props supplied to the admin edit-user route.
 *
 * @remarks     Next.js provides dynamic route params asynchronously in this project. Await `params` in the page and
 *              pass the resolved `userId` to `AdminEditUserView`; do not use this type for ordinary components.
 *
 * @property    params  Promise resolving to the dynamic user identifier.
 */
export interface AdminEditUserPageProps {
    params: Promise<{ userId: string }>;
}
