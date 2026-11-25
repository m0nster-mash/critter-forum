/**
 * @fileOverview    Admin user management panel component
 * @module          features/admin
 */

import type {UserEditPageProps} from "@/features/admin/permissions/types";
import React from "react";

/**
 * Displays the AdminEditUserPanel, used by `admin/[userId]/edit`.
 *
 * @param user  TODO:: document
 *
 * @returns     TODO:: document
 */
export default async function AdminEditUserPanel({user}: UserEditPageProps) {
    return (
        <>
            <p>User ID: {user.id}</p>

            <form>
                <div>
                    <label htmlFor="name">Name</label>
                    <input id="name"
                           name="name"
                           type="text"
                           defaultValue={user.name}
                           required/>
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input id="email"
                           name="email"
                           type="email"
                           defaultValue={user.email}
                           required/>
                </div>

                <button type="submit">Save Changes</button>
            </form>
        </>
    );
}
