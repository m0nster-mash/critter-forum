/**
 * @fileOverview    Defines email types, templates, and errors for Resend.
 * @module          authentication
 */

/**
 * Resend email error messages.
 *
 * @remarks     Centralizes configuration and delivery errors originating
 *              from the Resend email service.
 */
export const RESEND_ERRORS = {
    RESEND_KEY_NOT_CONFIG: "RESEND_API_KEY is not configured.",
    RESEND_EMAIL_FAILURE: "Resend email delivery failed: ",
    VERIFICATION_RESEND_FAILURE: "Verification resend state could not be loaded.",
} as const;

/**
 * Authentication email definitions.
 *
 * @remarks     This registry owns the subject and message content for
 *              authentication emails sent through Resend.
 *
 * @remarks     Email bodies are functions when they require dynamic values,
 *              allowing runtime data to be injected without introducing
 *              additional magic strings in the sending implementation.
 */
export const RESEND_EMAILS = {
    EMAIL_VERIFICATION: {
        subject: "Confirm your new email address",
        text: (url: string) => [
            "You requested to change the email address for your Critter Forum account.",
            "",
            "Confirm your new email address by opening this link:",
            url,
            "",
            "If you did not request this change, you can ignore this email.",
        ].join("\n"),
    },
} as const;

/** Reason for triggering the verification email resend. */
export const RESEND_REASON = {
    COOLDOWN: "cooldown",
    LIMIT: "limit",
};
