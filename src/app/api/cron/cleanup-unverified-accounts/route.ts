/**
 * @fileOverview    Authenticated scheduled endpoint for expired pending-registration cleanup.
 * @module          app-api
 *
 * @TODO            Replace magic strings with consts
 */

import {logger} from "@/features/alerts/server/logger";
import {AUTH_LOG_MESSAGES} from "@/features/auth/constants/logging";
import {AUTH_SCOPES} from "@/features/auth/constants/scope";
import {cleanupExpiredUnverifiedAccounts} from "@/features/auth/server/cleanup-unverified-accounts";
import {timingSafeEqual} from "node:crypto";

const maintenanceLogger = logger.child({scope: AUTH_SCOPES.AUTH_MAINTENANCE});

export const runtime = "nodejs";

/**
 * Compares the configured cron secret without leaking content-dependent timing information.
 */
function hasValidCronAuthorization(request: Request): boolean {
    const configuredSecret = process.env.CRON_SECRET;
    const authorization = request.headers.get("authorization");

    if (!configuredSecret || !authorization?.startsWith("Bearer ")) return false;

    const suppliedSecret = authorization.slice("Bearer ".length);
    const expected = Buffer.from(configuredSecret, "utf8");
    const supplied = Buffer.from(suppliedSecret, "utf8");

    return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}

/**
 * Executes one bounded cleanup batch. Schedule repeated runs until `hasMore` is false.
 */
export async function GET(request: Request): Promise<Response> {
    if (!hasValidCronAuthorization(request)) {
        return Response.json({error: "Unauthorized"}, {status: 401});
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
        return Response.json({error: "Pending-account cleanup failed."}, {status: 500});
    }
}
