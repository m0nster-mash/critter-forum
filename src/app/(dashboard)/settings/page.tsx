/**
 * @fileOverview    User -> Account Settings
 * @module          features/auth
 */

import {requireAuth} from "@/features/auth/server/session";

export default async function SettingsPage() {

    const session = await requireAuth();
    const currentUser = session.user;

    return (
        <main>
            <h1>Account Settings</h1>

            <section>
                <h2>Profile Details</h2>

                <form>
                    <div>
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            defaultValue={currentUser.name}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={currentUser.email}
                            required
                        />
                    </div>

                    <button type="submit">Update Profile</button>
                </form>
            </section>

            <section>
                <h2>Change Password</h2>

                <form>
                    <div>
                        <label htmlFor="currentPassword">Current Password</label>
                        <input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="newPassword">New Password</label>
                        <input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <button type="submit">Change Password</button>
                </form>
            </section>
        </main>
    );
}
