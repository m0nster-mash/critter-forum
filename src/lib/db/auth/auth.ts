/**
 * @fileOverview    Defines the authentication database schema and configuration.
 * @module          core-application
 */

import {LOG_LEVELS} from "@/features/alerts/constants/logger";
import {LOGGER_MESSAGES} from "@/features/alerts/constants/observability";
import {logger} from "@/features/alerts/server/logger";
import {AUTH_LOG_MESSAGES} from "@/features/auth/constants/logging";
import {PASSWORD_MIN_LENGTH} from "@/features/auth/constants/policy";
import {AUTH_SCOPES} from "@/features/auth/constants/scope";
import {sendVerificationEmail} from "@/features/auth/server/email";
import {db} from "@/lib/db/auth/db";
import {drizzleAdapter} from "@better-auth/drizzle-adapter";
import {betterAuth} from "better-auth";

const authEmailLogger = logger.child({scope: AUTH_SCOPES.AUTH_EMAIL});

/**
 * Better Auth configuration.
 */
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),

    emailAndPassword: {
        enabled: true,
        minPasswordLength: PASSWORD_MIN_LENGTH,
    },

    user: {
        changeEmail: {
            enabled: true,
        },
    },

    emailVerification: {
        sendVerificationEmail: async ({user, url}) => {
            // Do not delay the authentication response while the email provider responds.
            void sendVerificationEmail(user.email, url).catch((err: unknown) => {
                authEmailLogger.error(
                    AUTH_LOG_MESSAGES.EMAIL_VERIFICATION_FAILED,
                    {err},
                );
            });
        },
    },

    logger: {
        level: LOG_LEVELS.WARN,
        log: (level, message, ...args) => {
            logger[level](
                `${LOGGER_MESSAGES.BETTER_AUTH_PREFIX} ${message}`,
                args.length > 0
                    ? {args}
                    : undefined,
            );
        },
    },
});
