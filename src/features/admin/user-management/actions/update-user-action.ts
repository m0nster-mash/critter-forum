/**
 * @fileOverview    Implements the server action for updating an admin-managed user.
 * @module          features/admin/user-management
 */

"use server";

import {ADMIN_ACTION_NAMES} from "@/features/admin/user-management/constants/integrations";
import {createAlert} from "@/features/alerts/create-alert";
import {fail, succeed} from "@/features/alerts/result";
import {AlertError} from "@/features/alerts/server/alert-error";
import {safeAction} from "@/features/alerts/server/safe-action";
import {ADMIN_ALERT_CODES} from "@/features/admin/constants/alerts";
import {PERMISSIONS} from "@/features/admin/permissions/constants/permissions";
import {requireActionPermission} from "@/features/admin/permissions/server/require-action-permission";
import {getUserByEmail} from "@/features/admin/user-management/queries/get-user-by-email";
import {getUserById} from "@/features/admin/user-management/queries/get-user-by-id";
import {updateUser} from "@/features/admin/user-management/queries/update-user";
import type {UpdateUserInput} from "@/features/admin/user-management/types";
import {validateUserUpdate} from "@/features/admin/user-management/validation";

/**
 * Updates an existing user's name and email address.
 *
 * @remarks     The caller must hold the ADMIN_USERS_EDIT permission. The target user must exist and the email address
 *              must not belong to another user.
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
            email: input.email.trim().toLowerCase(),
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

        const [emailOwner] = await getUserByEmail({
            email: normalized.email,
            excludeUserId: normalized.userId,
        });

        if (emailOwner) {
            return fail(createAlert(ADMIN_ALERT_CODES.USER_EMAIL_TAKEN));
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
