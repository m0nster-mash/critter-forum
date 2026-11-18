"use server";

import {AUTH_ALERTS} from "@/features/auth/constants/alerts";
import {AUTH_ERROR_MESSAGES} from "@/features/auth/constants/messages";
import {auth} from "@/lib/db/auth/auth";
import {headers} from "next/headers";

/**
 * Server action that registers a new user account using email and password credentials.
 *
 * @param   {Object}    input           The user registration payload
 * @param   {string}    input.name      The display name of the user registering
 * @param   {string}    input.email     The email address of the registering user
 * @param   {string}    input.password  The plain-text password for account creation
 *
 * @return  {Promise<Object>}   Resolves to the newly created user session or user record object upon success
 *
 * @throws  {Error} Throws an error if required input parameters are missing or if registration fails
 */
export async function registerAccountAction(input: {
    name: string;
    email: string;
    password: string;
}): Promise<object> {

    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();

    if (!name || !email || !input.password) {
        throw new Error(AUTH_ERROR_MESSAGES.REGISTRATION_MISSING_DATA);
    }

    const registerResult = await auth.api.signUpEmail({
        body: {
            name: name,
            email: email,
            password: input.password
        },
        headers: await headers(),
    });

    if (!registerResult.user?.id) {
        // TODO:: replace with correct error handling
        throw new Error(AUTH_ERROR_MESSAGES.REGISTRATION_FAILURE);
    }

    return {
        message: AUTH_ALERTS.REGISTRATION_ACCOUNT_CREATED,
    }
}
