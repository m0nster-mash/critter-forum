/**
 * @fileOverview    Defines and applies user-management validation rules.
 * @module          features/admin/user-management
 */

import {createAlert} from "@/features/alerts/create-alert";
import type {PublicAlert} from "@/features/alerts/types";
import {ADMIN_ALERT_CODES} from "@/features/admin/constants/alerts";
import type {UpdateUserInput} from "@/features/admin/user-management/types";
import {EMAIL_PATTERN} from "@/lib/constants/regex";

/**
 * Validates the editable fields of a user.
 *
 * @remarks     Shared by the edit form and server action so both use the same validation rules.
 *
 * @param input  The user details to validate.
 *
 * @returns      The first validation alert, or null when the input is valid.
 */
export function validateUserUpdate(
    input: Pick<UpdateUserInput, "name" | "email">
): PublicAlert | null {

    if (!input.name.trim()) {
        return createAlert(ADMIN_ALERT_CODES.USER_NAME_REQUIRED);
    }

    if (!EMAIL_PATTERN.test(input.email)) {
        return createAlert(ADMIN_ALERT_CODES.USER_EMAIL_INVALID);
    }

    return null;
}
