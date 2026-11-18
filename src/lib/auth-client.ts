import {createAuthClient} from "better-auth/react";

/**
 * TODO:: document
 */
export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
});

export const {signIn, signOut, useSession} = authClient;
