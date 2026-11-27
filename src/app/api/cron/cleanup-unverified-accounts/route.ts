/**
 * @fileOverview    Authenticated scheduled endpoint for expired pending-registration cleanup.
 * @module          authentication
 */

import {logger} from "@/features/alerts/server/logger";
import {AUTH_ERROR_CODES} from "@/features/auth/constants/errors";
import {AUTH_LOG_MESSAGES} from "@/features/auth/constants/logging";
import {ENCODING} from "@/features/auth/constants/policy";
import {AUTH_SCOPES} from "@/features/auth/constants/scope";
import {cleanupExpiredUnverifiedAccounts} from "@/features/auth/queries/cleanup-unverified-accounts";
import {HEADERS} from "@/lib/constants/global";
import {timingSafeEqual} from "node:crypto";

const maintenanceLogger = logger.child({scope: AUTH_SCOPES.AUTH_MAINTENANCE});

export const runtime = "nodejs";

/**
 * Compares the configured cron secret without leaking content-dependent timing information.
 */
function hasValidCronAuthorization(request: Request): boolean {
    const configuredSecret = process.env.CRON_SECRET;
    const authorization = request.headers.get(HEADERS.AUTHORIZATION);

    if (!configuredSecret || !authorization?.startsWith("Bearer ")) return false;

    const suppliedSecret = authorization.slice("Bearer ".length);
    const expected = Buffer.from(configuredSecret, ENCODING.UTF8);
    const supplied = Buffer.from(suppliedSecret, ENCODING.UTF8);

    return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}

/**
 * Executes one bounded cleanup batch. Schedule repeated runs until `hasMore` is false.
 */
export async function GET(request: Request): Promise<Response> {
    if (!hasValidCronAuthorization(request)) {
        return Response.json({error: AUTH_ERROR_CODES.UNAUTHORIZED}, {status: 401});
    }

    try {
        const result = await cleanupExpiredUnverifiedAccounts();
        maintenanceLogger.info(AUTH_LOG_MESSAGES.UNVERIFIED_ACCOUNT_CLEANUP_COMPLETED, {
            deletedCount: result.deletedCount,
            hasMore: result.hasMore,
            cutoff: result.cutoff.toISOString(),
        });
        return Response.json({
            success: true,
            deletedCount: result.deletedCount,
            hasMore: result.hasMore,
            cutoff: result.cutoff.toISOString(),
        });
    } catch (err: unknown) {
        maintenanceLogger.error(AUTH_LOG_MESSAGES.UNVERIFIED_ACCOUNT_CLEANUP_FAILED, {err});
        return Response.json({error: AUTH_ERROR_CODES.CLEANUP_FAILED}, {status: 500});
    }
}
