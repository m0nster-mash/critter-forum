"use server";

import {createAlert} from "@/lib/alerts/create-alert";
import {fail, succeed} from "@/lib/alerts/result";
import {safeAction} from "@/lib/alerts/server/safe-action";
import {auth} from "@/lib/db/auth/auth";
import {headers} from "next/headers";

/**
 * Server action that registers a new user account using email and password credentials.
 *
 * TODO:: convert magic strings into consts
 *
 * @param   {Object}    input           The user registration payload
 * @param   {string}    input.name      The display name of the user registering
 * @param   {string}    input.email     The email address of the registering user
 * @param   {string}    input.password  The plain-text password for account creation
 *
 * @return  {Promise<ActionResult>}     Resolves to the registration result.
 */
export const registerAccountAction = safeAction("auth.register", async (input: {
    name: string;
    email: string;
    password: string;
}) => {
    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();

    if (!name || !email || !input.password) {
        return fail(createAlert("AUTH_REGISTER_INVALID"));
    }

    const registerResult = await auth.api.signUpEmail({
        body: {
            name: name,
            email: email,
            password: input.password,
        },
        headers: await headers(),
    });

    if (!registerResult.user?.id) {
        return fail(createAlert("AUTH_REGISTER_FAILED"));
    }

    return succeed(undefined, createAlert("AUTH_REGISTER_SUCCESS"));
});
