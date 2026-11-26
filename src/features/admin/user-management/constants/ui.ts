/**
 * @fileOverview    Defines UI identifiers used by the admin feature.
 * @module          features/admin/user-management
 */

/** HTML IDs used by the edit-user form and its field alerts. */
export const USER_FORM_IDS = {
    NAME: "edit-user-name",
    ALERT_NAME: "edit-user-name-alert",
} as const;

export const FIELD_NAMES = {
    NAME: "name",
} as const;

export const ADMIN_LABELS = {
    ID: "User ID",
    NAME: "Username",
    EMAIL: "Email",
    ACTIONS: "Actions",
    SAVING: "Saving...",
    SAVE_CHANGES: "Save Changes",
    NO_USERS: "No users found.",
    DIVIDER: " | ",
}
