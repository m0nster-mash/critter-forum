/**
 * @fileOverview    Defines the authentication database schema and configuration.
 * @module          core-application
 */

import {LOG_LEVELS} from "@/features/alerts/constants/logger";
import {LOGGER_MESSAGES} from "@/features/alerts/constants/observability";
import {logger} from "@/features/alerts/server/logger";
import {AUTH_PATHS, VERIFICATION_DELIVERY_METHODS} from "@/features/auth/constants/api";
import {AUTH_LOG_MESSAGES} from "@/features/auth/constants/logging";
import {PASSWORD_MIN_LENGTH} from "@/features/auth/constants/policy";
import {VERIFICATION_TOKEN_TTL_SECONDS} from "@/features/auth/constants/resend-policy";
import {AUTH_SCOPES} from "@/features/auth/constants/scope";
import {storeActiveVerificationToken} from "@/features/auth/queries/store-active-verification-token";
import {sendVerificationEmail} from "@/features/auth/server/email";
import {db} from "@/lib/db/auth/db";
import {drizzleAdapter} from "@better-auth/drizzle-adapter";
import {betterAuth} from "better-auth";
import {after} from "next/server";

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
        // Unverified users must be able to create a restricted session and sign in to complete verification.
        requireEmailVerification: false,
    },

    user: {
        changeEmail: {
            enabled: true,
        },
    },

    emailVerification: {
        sendOnSignUp: true,
        expiresIn: VERIFICATION_TOKEN_TTL_SECONDS,
        sendVerificationEmail: async ({user, url, token}, request) => {
            // The resend endpoint awaits this callback, allowing provider failures to reach the requesting user.
            // Sign-up delivery remains post-response so a provider outage does not interrupt account creation.
            const isResendRequest = request?.url !== undefined &&
                new URL(request.url).pathname.endsWith(AUTH_PATHS.SEND_VERIFICATION_EMAIL);

            if (isResendRequest) {
                try {
                    await storeActiveVerificationToken(
                        user.id,
                        token,
                        new Date(Date.now() + VERIFICATION_TOKEN_TTL_SECONDS * 1000),
                    );
                } catch (err: unknown) {
                    authEmailLogger.error(
                        AUTH_LOG_MESSAGES.VERIFICATION_TOKEN_STATE_FAILED,
                        {err, delivery: VERIFICATION_DELIVERY_METHODS.RESEND},
                    );
                    throw err;
                }

                try {
                    await sendVerificationEmail(user.email, url);
                } catch (err: unknown) {
                    authEmailLogger.error(
                        AUTH_LOG_MESSAGES.EMAIL_VERIFICATION_FAILED,
                        {err, delivery: VERIFICATION_DELIVERY_METHODS.RESEND},
                    );
                    throw err;
                }
                return;
            }

            try {
                await storeActiveVerificationToken(
                    user.id,
                    token,
                    new Date(Date.now() + VERIFICATION_TOKEN_TTL_SECONDS * 1000),
                );
            } catch (err: unknown) {
                authEmailLogger.error(
                    AUTH_LOG_MESSAGES.VERIFICATION_TOKEN_STATE_FAILED,
                    {err, delivery: VERIFICATION_DELIVERY_METHODS.SIGN_UP},
                );
                throw err;
            }

            after(async () => {
                try {
                    await sendVerificationEmail(user.email, url);
                } catch (err: unknown) {
                    authEmailLogger.error(
                        AUTH_LOG_MESSAGES.EMAIL_VERIFICATION_FAILED,
                        {err, delivery: VERIFICATION_DELIVERY_METHODS.SIGN_UP},
                    );
                }
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
