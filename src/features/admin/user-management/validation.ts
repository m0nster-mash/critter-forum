import {ADMIN_ALERT_CODES} from "@/features/admin/constants/alerts";
import {FIELD_NAMES} from "@/features/admin/user-management/constants/ui";
import type {UpdateUserInput} from "@/features/admin/user-management/types";
import {createAlert} from "@/features/alerts/create-alert";
import type {PublicAlert} from "@/features/alerts/types";

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
    input: Pick<UpdateUserInput, typeof FIELD_NAMES[keyof typeof FIELD_NAMES]>
): PublicAlert | null {

    if (!input[FIELD_NAMES.NAME].trim()) {
        return createAlert(ADMIN_ALERT_CODES.USER_NAME_REQUIRED);
    }

    return null;
}
