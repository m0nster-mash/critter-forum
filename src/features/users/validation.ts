/**
 * @fileOverview    Defines user-settings form validation.
 * @module          features/users
 */

import {createAlert} from "@/features/alerts/create-alert";
import type {PublicAlert} from "@/features/alerts/types";
import {PASSWORD_MIN_LENGTH} from "@/features/auth/constants/policy";
import {USER_ALERT_CODES} from "@/features/users/constants/alerts";
import type {PasswordChangeInput} from "@/features/users/types";
import {EMAIL_PATTERN} from "@/lib/constants/regex";

/**
 * Validates a profile name.
 */
export function validateProfileName(name: string): PublicAlert | null {
    if (!name.trim()) {
        return createAlert(USER_ALERT_CODES.PROFILE_NAME_REQUIRED);
    }

    return null;
}

/**
 * Validates a proposed email address.
 */
export function validateEmailAddress(email: string): PublicAlert | null {
    if (!EMAIL_PATTERN.test(email)) {
        return createAlert(USER_ALERT_CODES.EMAIL_INVALID);
    }

    return null;
}

/**
 * Validates a password change.
 */
export function validatePasswordChange(
    input: PasswordChangeInput,
): PublicAlert | null {

    if (!input.currentPassword) {
        return createAlert(USER_ALERT_CODES.PASSWORD_CURRENT_REQUIRED);
    }

    if (input.newPassword.length < PASSWORD_MIN_LENGTH) {
        return createAlert(USER_ALERT_CODES.PASSWORD_TOO_SHORT, {
            params: {min: PASSWORD_MIN_LENGTH},
        });
    }

    if (input.newPassword !== input.confirmPassword) {
        return createAlert(USER_ALERT_CODES.PASSWORD_CONFIRMATION_MISMATCH);
    }

    return null;
}
