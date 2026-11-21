/**
 * @fileOverview    TODO: document
 *
 * @module features/alerts/server/ref
 * @status Requires documentation
 */

/**
 * Generates a short reference ID used to match an on-screen alert to its server log entry.
 *
 * @return  {string}    Eight lowercase hex characters, e.g. `a1b2c3d4`.
 */
export function generateRef(): string {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 8);
}
