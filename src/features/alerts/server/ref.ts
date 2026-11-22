/**
 * @fileOverview    Generates short reference identifiers for correlating displayed alerts with server logs.
 * @module          features/alerts
 */

/**
 * Generates a short reference ID for correlating an on-screen alert with its server log entry.
 *
 * @returns     The value produced by this operation.
 */
export function generateRef(): string {
    return crypto
        .randomUUID()
        .replace(/-/g, "")
        .slice(0, 8);
}
