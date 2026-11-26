/**
 * @fileOverview    Defines HTML element identifiers for user settings forms.
 * @module          features/users
 *
 * @remarks         Centralizes element IDs used by labels, inputs, and accessible
 *                  descriptions to maintain consistent associations.
 */

/**
 * Stable HTML element identifiers for user settings forms.
 *
 * @remarks     These identifiers should be used for both input IDs and their
 *              corresponding label and accessibility references.
 */
export const USER_ELEMENT_IDS = {
    PROFILE_NAME: "profile-name",
    NEW_EMAIL: "new-email",

    CURRENT_PASSWORD: "current-password",
    NEW_PASSWORD: "new-password",
    CONFIRM_PASSWORD: "confirm-password",
} as const;

/**
 * Generates an accessible alert description ID for a form element.
 *
 * @param elementId - HTML ID of the associated form element.
 *
 * @returns         The corresponding alert description ID.
 */
export function getUserAlertElementId(elementId: string): string {
    return `${elementId}-alert`;
}
