import {createAlert} from "@/lib/alerts/create-alert";
import type {PublicAlert} from "@/lib/alerts/types";
import {PASSWORD_MIN_LENGTH} from "@/lib/constants/globals";

/**
 * Registration form values, already trimmed and normalized.
 *
 * @property    {string}    name        The display name
 * @property    {string}    email       The email address
 * @property    {string}    password    The plain-text password
 */
export interface RegistrationInput {
    name: string;
    email: string;
    password: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates registration input. Shared by the form (instant feedback) and the server action (authoritative check), so
 * both always agree and neither carries its own copy of the rules.
 *
 * Returns the first problem only; each alert carries the field it belongs to.
 *
 * @param   {RegistrationInput} input   The normalized input to check
 *
 * @return  {PublicAlert | null}    The first validation alert, or null if the input is valid.
 */
export function validateRegistration(input: RegistrationInput): PublicAlert | null {
    if (!input.name) {
        return createAlert("AUTH_REGISTER_NAME_REQUIRED");
    }
    if (!EMAIL_PATTERN.test(input.email)) {
        return createAlert("AUTH_REGISTER_EMAIL_INVALID");
    }
    if (input.password.length < PASSWORD_MIN_LENGTH) {
        return createAlert("AUTH_REGISTER_PASSWORD_TOO_SHORT", {params: {min: PASSWORD_MIN_LENGTH}});
    }
    return null;
}
