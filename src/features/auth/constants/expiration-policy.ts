/**
 * @fileOverview    Defines the retention policy for pending email-verification registrations.
 * @module          authentication
 */

/** Default lifetime of an unverified registration, in days. */
export const DEFAULT_UNVERIFIED_ACCOUNT_TTL_DAYS = 7;

/** Upper bound prevents an accidental environment typo from retaining pending accounts indefinitely. */
export const MAX_UNVERIFIED_ACCOUNT_TTL_DAYS = 365;

/** Maximum number of pending accounts removed by one scheduled cleanup invocation. */
export const UNVERIFIED_ACCOUNT_CLEANUP_BATCH_SIZE = 500;

/** Resolves and validates the configured pending-registration lifetime. */
export function getUnverifiedAccountTtlDays(value = process.env.UNVERIFIED_ACCOUNT_TTL_DAYS): number {
    if (value === undefined || value.trim() === "") return DEFAULT_UNVERIFIED_ACCOUNT_TTL_DAYS;

    const days = Number(value);
    if (!Number.isInteger(days) || days < 1 || days > MAX_UNVERIFIED_ACCOUNT_TTL_DAYS) {
        throw new Error(`UNVERIFIED_ACCOUNT_TTL_DAYS must be an integer between 1 and ${MAX_UNVERIFIED_ACCOUNT_TTL_DAYS}.`);
    }

    return days;
}

/** Computes the exclusive cutoff: accounts created before this instant are eligible for deletion. */
export function getUnverifiedAccountExpirationCutoff(now = new Date(), ttlDays = getUnverifiedAccountTtlDays()): Date {
    if (!Number.isInteger(ttlDays) || ttlDays < 1 || ttlDays > MAX_UNVERIFIED_ACCOUNT_TTL_DAYS) {
        throw new RangeError(`ttlDays must be an integer between 1 and ${MAX_UNVERIFIED_ACCOUNT_TTL_DAYS}.`);
    }

    return new Date(now.getTime() - ttlDays * 24 * 60 * 60 * 1000);
}
