"use server";

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
        throw new Error("Username, email, and password are required.");
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
        throw new Error("The account could not be created.");
    }

    return {
        message: "Your account has been created.",
    }
}
