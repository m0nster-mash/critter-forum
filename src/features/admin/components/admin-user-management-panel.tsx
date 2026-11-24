/**
 * @fileOverview    Admin user management panel component
 * @module          features/admin
 */

import {UserManagementPageProps} from "@/features/admin/permissions/types";
import Link from "next/link";
import React from "react";

/**
 * Displays the {@link AdminUserManagementPanel}
 */
export default async function AdminUserManagementPanel({users}: UserManagementPageProps) {
    return (
        <>
            <table>
                <thead>
                <tr>
                    <th>User name</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {users.length > 0 ? (
                    users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <Link href={`/admin/users/${encodeURIComponent(user.id)}/profile`}>
                                    View
                                </Link>
                                {" | "}
                                <Link href={`/admin/users/${encodeURIComponent(user.id)}/edit`}>
                                    Edit
                                </Link>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={4}>No users found.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </>
    );
}
