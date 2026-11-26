/**
 * @fileOverview    Defines stable field identifiers for user settings forms.
 * @module          features/users
 *
 * @remarks         These identifiers are shared by form state, validation,
 *                  and alert field associations.
 */

/**
 * Stable identifiers for user settings form fields.
 *
 * @remarks     Use these constants when referencing form fields programmatically,
 *              particularly when associating validation errors with their fields.
 */
export const USER_FIELDS = {
    ID: "ID",
    NAME: "name",
    EMAIL: "email",

    CURRENT_PASSWORD: "currentPassword",
    NEW_PASSWORD: "newPassword",
    CONFIRM_PASSWORD: "confirmPassword",
} as const;
