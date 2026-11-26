/**
 * @fileOverview    Admin user management panel component
 * @module          features/admin/user-management
 */

import type {UserManagementPageProps} from "@/features/admin/permissions/types";
import {ADMIN_LABELS} from "@/features/admin/user-management/constants/ui";
import {ADMIN_ROUTES, PRIVATE_ROUTES} from "@/lib/constants/routes";
import {resolvePath} from "@/lib/utilities/route-utils";
import Link from "next/link";
import React from "react";

/**
 * Displays the {@link AdminUserManagementPanel}
 *
 * @param users    TODO:: document
 *
 * @returns   TODO:: document
 */
export default async function AdminUserManagementPanel({users}: UserManagementPageProps) {
    return (
        <>
            <table>
                <thead>
                <tr>
                    <th>{ADMIN_LABELS.NAME}</th>
                    <th>{ADMIN_LABELS.EMAIL}</th>
                    <th>{ADMIN_LABELS.ACTIONS}</th>
                </tr>
                </thead>

                <tbody>
                {users.length > 0 ? (
                    users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <Link href={resolvePath(PRIVATE_ROUTES.PROFILE, {userId: user.id})}>
                                    {PRIVATE_ROUTES.PROFILE.label}
                                </Link>
                                {ADMIN_LABELS.DIVIDER}
                                <Link href={resolvePath(ADMIN_ROUTES.USERS_EDIT, {userId: user.id})}>
                                    {ADMIN_ROUTES.USERS_EDIT.label}
                                </Link>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={4}>{ADMIN_LABELS.NO_USERS}</td>
                    </tr>
                )}
                </tbody>
            </table>
        </>
    );
}
