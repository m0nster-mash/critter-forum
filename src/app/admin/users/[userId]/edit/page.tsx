/**
 * @fileOverview    Admin -> Edit User
 * @module          features/admin
 */

import {PERMISSIONS} from "@/features/admin/permissions/constants/permissions";
import {requirePagePermission} from "@/features/admin/permissions/server/require-page-permission";
import {AdminEditUserPageProps} from "@/features/admin/user-management/types";
import {db} from "@/lib/db/auth/db";
import {user} from "@/lib/db/auth/schema";
import {eq} from "drizzle-orm";
import {notFound} from "next/navigation";

export default async function AdminEditUserPage({params}: AdminEditUserPageProps) {

    await requirePagePermission(PERMISSIONS.ADMIN_USERS_EDIT);

    const {userId} = await params;

    const [selectedUser] = await db
        .select({
            id: user.id,
            name: user.name,
            email: user.email,
        })
        .from(user)
        .where(eq(user.id, userId))
        .limit(1);

    if (!selectedUser) notFound();

    return (
        <main>
            <h1>Edit User</h1>

            <p>User ID: {selectedUser.id}</p>

            <form>
                <div>
                    <label htmlFor="name">Name</label>
                    <input id="name"
                           name="name"
                           type="text"
                           defaultValue={selectedUser.name}
                           required/>
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input id="email"
                           name="email"
                           type="email"
                           defaultValue={selectedUser.email}
                           required/>
                </div>

                <button type="submit">Save Changes</button>
            </form>
        </main>
    );
}
