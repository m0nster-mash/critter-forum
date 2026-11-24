/**
 * @fileOverview    User -> Profile
 * @module          features/user
 */

import {db} from "@/lib/db/auth/db";
import {user} from "@/lib/db/auth/schema";
import {eq} from "drizzle-orm";
import {notFound} from "next/navigation";

interface UserProfilePageProps {
    params: Promise<{ userId: string }>;
}

export default async function UserProfilePage({params}: UserProfilePageProps) {

    const {userId} = await params;

    const [profile] = await db
        .select({
            id: user.id,
            name: user.name,
            image: user.image,
            createdAt: user.createdAt,
        })
        .from(user)
        .where(eq(user.id, userId))
        .limit(1);

    if (!profile) notFound();

    return (
        <main>
            <h1>{profile.name}</h1>

            {profile.image && (
                <img
                    src={profile.image}
                    alt={`${profile.name}'s profile`}
                    width={120}
                    height={120}
                />
            )}

            <dl>
                <dt>User ID</dt>
                <dd>{profile.id}</dd>

                <dt>Member Since</dt>
                <dd>{profile.createdAt.toLocaleDateString()}</dd>
            </dl>
        </main>
    );
}
