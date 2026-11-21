/**
 * @fileOverview    TODO: document
 * @module          core-application
 *
 * @status          Requires documentation
 */

import {ALERT_SEVERITIES} from "@/features/alerts/constants/alert-types";
import {LOG_LEVELS} from "@/features/alerts/constants/logger";
import {LOGGER_MESSAGES} from "@/features/alerts/constants/observability";
import {logger} from "@/features/alerts/server/logger";
import {PASSWORD_MIN_LENGTH} from "@/features/auth/constants/policy";
import {db} from "@/lib/db/auth/db";
import {drizzleAdapter} from "@better-auth/drizzle-adapter";
import {betterAuth} from "better-auth";

/**
 * Separates the auth configuration separate from the database connection, application modules, and route handlers.
 */
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    emailAndPassword: {
        enabled: true,
        // Keep better-auth's rule identical to the one the forms enforce (its own default is 8).
        minPasswordLength: PASSWORD_MIN_LENGTH,
    },
    // Route better-auth's own log output (failed sign-ins, etc.) through the shared server logger, so it gets the same
    // format, level control and redaction as everything else. Sign-in goes browser -> better-auth directly, so this is
    // where failed sign-ins reach the server log.
    logger: {
        level: LOG_LEVELS.WARN,
        log: (level, message, ...args) => {
            logger[level](`${LOGGER_MESSAGES.BETTER_AUTH_PREFIX} ${message}`, args.length > 0
                ? {args}
                : undefined
            );
        },
    },
});
