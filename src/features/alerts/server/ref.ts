/**
 * @fileOverview    TODO: document
 * @module          features/alerts
 *
 * @status          Requires documentation
 */
/**
 * TODO: document
 *
 * @module features/alerts/server/ref
 * @status Requires documentation
 */

/**
 * Generates a short reference ID used to match an on-screen alert to its server log entry.
 *
 * @returns {string}    Eight lowercase hex characters, ex. `a1b2c3d4`.
 */
/**
 * TODO: document
 *
 * @status Requires documentation
 * @returns TODO: document
 */
export function generateRef(): string {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 8);
}
