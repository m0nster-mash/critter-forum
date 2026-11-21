/**
 * @fileOverview    TODO: document
 * @module          features/alerts
 *
 * @status          Requires documentation
 */

import {ERROR_PROPERTY_KEYS} from "@/features/alerts/constants/errors";

/**
 * Reads the `digest` Next.js attaches to errors forwarded from the server.
 *
 * @remarks     The digest matches the server log entry written by `instrumentation.ts`, so it doubles as the reference
 *              ID for page-level crashes.
 *
 * @param       error                   The value received by an error boundary; not guaranteed to be an Error
 *
 * @returns     {string | undefined}    The digest, or undefined if there isn't one (ex. in development).
 */
export function getErrorDigest(error: unknown): string | undefined {

    if (typeof error === "object" && error !== null && ERROR_PROPERTY_KEYS.DIGEST in error) {
        const digest = (error as Record<typeof ERROR_PROPERTY_KEYS.DIGEST, unknown>)[ERROR_PROPERTY_KEYS.DIGEST];
        return typeof digest === "string" && digest.length > 0 ? digest : undefined;
    }

    return undefined;
}
