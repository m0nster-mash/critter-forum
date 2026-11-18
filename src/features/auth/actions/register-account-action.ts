"use server";

import {AUTH_ALERTS} from "@/features/auth/constants/alerts";
import {AUTH_ERROR_MESSAGES} from "@/features/auth/constants/messages";
import {auth} from "@/lib/db/auth/auth";
import {headers} from "next/headers";

export async function registerAccountAction(input: {
    name: string;
    email: string;
    password: string;
}) {

    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();

    if(!name || !email || !input.password) {
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

    if(!registerResult.user?.id) {
        throw new Error(AUTH_ERROR_MESSAGES.REGISTRATION_FAILURE);
    }

    return {
        message: AUTH_ALERTS.REGISTRATION_ACCOUNT_CREATED,
    }
}
