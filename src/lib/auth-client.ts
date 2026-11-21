/**
 * TODO: document
 *
 * @module lib/auth-client
 * @status Requires documentation
 */

import {createAuthClient} from "better-auth/react";

/**
 * Client-side Better Auth authentication client instance initialized with the application base URL environment
 * variable.
 *
 * @property    {Function}  signIn      Client method for executing user sign-in authentication requests
 * @property    {Function}  signOut     Client method for terminating active user sessions
 * @property    {Function}  useSession  React hook for accessing current session state
 */
export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
});

/** TODO: document */
export const {signIn, signOut, useSession} = authClient;
