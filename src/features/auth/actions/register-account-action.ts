/**
 * @fileOverview    Implements the server action that validates and creates a user account.
 * @module          features/auth
 *
 * @status          Requires refactoring
 * @TODO            Replace magic strings with consts
 */

"use server";

import {createAlert} from "@/features/alerts/create-alert";
import {fail, succeed} from "@/features/alerts/result";
import {AlertError} from "@/features/alerts/server/alert-error";
import {safeAction} from "@/features/alerts/server/safe-action";
import {AUTH_ACTION_NAMES} from "@/features/auth/constants/integration";
import {AUTH_ALERT_PARAMS, isAuthApiError, resolveAuthAlertCode,} from "@/features/auth/utilities/auth-errors";
import {type RegistrationInput, validateRegistration} from "@/features/auth/validation";
import {auth} from "@/lib/db/auth/auth";
import {headers} from "next/headers";

/**
 * Server action that registers a new user account using email and password credentials.
 *
 * @TODO    Replace magic strings with consts
 *
 * @return  The value produced by this operation.
 */
export const registerAccountAction = safeAction(
    AUTH_ACTION_NAMES.REGISTER, async (input: RegistrationInput) => {

        const normalized: RegistrationInput = {
            name: input.name.trim(),
            email: input.email.trim().toLowerCase(),
            password: input.password,
        };

        const invalid = validateRegistration(normalized);
        if (invalid) {
            return fail(invalid);
        }

        let registerResult;
        try {
            registerResult = await auth.api.signUpEmail({
                body: normalized,
                headers: await headers(),
            });
        } catch (error) {
            if (isAuthApiError(error)) {
                throw new AlertError(resolveAuthAlertCode(error, "AUTH_REGISTER_FAILED"), {
                    cause: error,
                    params: AUTH_ALERT_PARAMS,
                });
            }
            throw error;
        }

        if (!registerResult.user?.id) {
            throw new AlertError("AUTH_REGISTER_FAILED", {detail: {reason: "signUpEmail returned no user id"}});
        }

        return succeed(undefined, createAlert("AUTH_REGISTER_SUCCESS"));
    });
