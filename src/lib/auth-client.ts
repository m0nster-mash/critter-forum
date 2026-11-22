/**
 * @fileOverview    Initializes the client-side Better Auth API.
 * @module          core-application
 */

import {createAuthClient} from "better-auth/react";

/**
 * Client-side Better Auth authentication client instance initialized with the application base URL environment
 * variable.
 *
 * @property    signIn      Client method for executing user sign-in authentication requests
 * @property    signOut     Client method for terminating active user sessions
 * @property    useSession  React hook for accessing current session state
 */
export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
});

/** Initializes the client-side Better Auth API. */
export const {signIn, signOut, useSession} = authClient;
