/**
 * @fileOverview    Defines shared user-settings interface text.
 * @module          features/users
 *
 * @remarks         Centralizes headings, labels, button text, and status messages
 *                  used throughout the user-settings interface.
 */

/**
 * User-settings interface text.
 *
 * @remarks     This registry owns static user-facing text for profile,
 *              email, and password management interfaces.
 */
export const USER_UI_TEXT = {
    PROFILE: {
        TITLE: "Profile Details",
        NAME_LABEL: "Name",
        NAME_SUBMIT: "Update Name",
        NAME_SUBMITTING: "Saving...",
    },

    EMAIL: {
        TITLE: "Email Address",
        CURRENT_LABEL: "Current email:",
        NEW_LABEL: "New Email Address",
        PLACEHOLDER: "you@example.com",
        SUBMIT: "Change Email",
        SUBMITTING: "Sending...",
        PENDING_VERIFICATION: (email: string) =>
            `A verification link has been requested for ${email}.`,
        PENDING_VERIFICATION_NOTICE:
            "Your current email remains active until the new address is verified.",
    },

    PASSWORD: {
        TITLE: "Change Password",
        CURRENT_LABEL: "Current Password",
        NEW_LABEL: "New Password",
        CONFIRM_LABEL: "Confirm New Password",
        SUBMIT: "Change Password",
        SUBMITTING: "Changing...",
    },
} as const;
