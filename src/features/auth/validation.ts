/**
 * @fileOverview    Defines and applies shared authentication form validation rules.
 * @module          authentication
 */

import {createAlert} from "@/features/alerts/create-alert";
import type {PublicAlert} from "@/features/alerts/types";
import {AUTH_ALERT_CODES} from "@/features/auth/constants/alerts";
import {PASSWORD_MIN_LENGTH} from "@/features/auth/constants/policy";
import type {RegistrationInput} from "@/features/auth/types";
import {EMAIL_PATTERN} from "@/lib/constants/regex";

/**
 * Validates registration input.
 *
 * @remarks     Shared by the form (instant feedback) and the server action (authoritative check), so both always agree
 *              and neither carries its own copy of the rules.
 * @remarks     Returns the first problem only; each alert carries the field it belongs to.
 *
 * @param       input                   The normalized input to check
 *
 * @returns     {PublicAlert | null}    The first validation alert, or null if the input is valid.
 */
export function validateRegistration(input: RegistrationInput): PublicAlert | null {
    if (!input.name) {
        return createAlert(AUTH_ALERT_CODES.REGISTER_NAME_REQUIRED);
    }
    if (!EMAIL_PATTERN.test(input.email)) {
        return createAlert(AUTH_ALERT_CODES.REGISTER_EMAIL_INVALID);
    }
    if (input.password.length < PASSWORD_MIN_LENGTH) {
        return createAlert(AUTH_ALERT_CODES.REGISTER_PASSWORD_TOO_SHORT, {params: {min: PASSWORD_MIN_LENGTH}});
    }
    return null;
}
