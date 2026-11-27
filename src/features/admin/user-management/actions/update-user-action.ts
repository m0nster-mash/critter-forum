/**
 * @fileOverview    Implements the server action for updating an admin-managed user.
 * @module          features/admin/user-management
 */

"use server";

import {ADMIN_ALERT_CODES} from "@/features/admin/constants/alerts";
import {PERMISSIONS} from "@/features/admin/permissions/constants/permissions";
import {requireActionPermission} from "@/features/admin/permissions/server/require-action-permission";
import {ADMIN_ACTION_NAMES} from "@/features/admin/user-management/constants/integrations";
import {getUserById} from "@/features/admin/user-management/queries/get-user-by-id";
import {updateUser} from "@/features/admin/user-management/queries/update-user";
import type {UpdateUserInput} from "@/features/admin/user-management/types";
import {validateUserUpdate} from "@/features/admin/user-management/validation";
import {createAlert} from "@/features/alerts/create-alert";
import {fail, succeed} from "@/features/alerts/result";
import {AlertError} from "@/features/alerts/server/alert-error";
import {safeAction} from "@/features/alerts/server/safe-action";

/**
 * Updates an existing user's display name. Email changes use the account owner's verified Better Auth workflow.
 *
 * @remarks     The caller must hold the ADMIN_USERS_EDIT permission. The target user must exist.
 *
 * @returns     A safe action result indicating success or failure.
 */
export const updateUserAction = safeAction(
    ADMIN_ACTION_NAMES.USER_UPDATE,
    async (input: UpdateUserInput) => {

        await requireActionPermission(PERMISSIONS.ADMIN_USERS_EDIT);

        const normalized: UpdateUserInput = {
            userId: input.userId.trim(),
            name: input.name.trim(),
        };

        const invalid = validateUserUpdate(normalized);
        if (invalid) {
            return fail(invalid);
        }

        if (!normalized.userId) {
            return fail(createAlert(ADMIN_ALERT_CODES.USER_NOT_FOUND));
        }

        const [existingUser] = await getUserById({
            userId: normalized.userId,
        });

        if (!existingUser) {
            return fail(createAlert(ADMIN_ALERT_CODES.USER_NOT_FOUND));
        }

        const updatedUser = await updateUser(normalized);

        if (!updatedUser) {
            throw new AlertError(ADMIN_ALERT_CODES.USER_NOT_FOUND);
        }

        return succeed(
            undefined,
            createAlert(ADMIN_ALERT_CODES.USER_UPDATED),
        );
    },
);
