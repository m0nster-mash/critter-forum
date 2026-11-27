/**
 * @fileOverview    Restricts Better Auth API requests made by authenticated users with unverified email addresses.
 * @module          authentication
 */

import {
    AUTH_API_BASE_PATH,
    AUTH_API_ERROR_MESSAGES,
    AUTH_API_ERRORS, AUTH_PATHS,
    UNVERIFIED_AUTH_API_ALLOWED_PATHS,
} from "@/features/auth/constants/api";
import {RESEND_REASON} from "@/features/auth/constants/resend";
import {isRevokedVerificationToken} from "@/features/auth/queries/is-revoked-verification-token";
import {reserveVerificationEmailResend} from "@/features/auth/queries/reserve-verification-email-resend";
import {auth} from "@/lib/db/auth/auth";

/** Request handler signature returned by Better Auth's Next.js adapter. */
export type AuthApiHandler = (request: Request) => Promise<Response>;

/**
 * Converts an application auth URL path to the path used by Better Auth's endpoint registry.
 *
 * @param       pathname    Request URL pathname
 * @returns     The Better Auth endpoint path, including its leading slash.
 */
export function getBetterAuthApiPath(pathname: string): string {

    if (pathname === AUTH_API_BASE_PATH) {
        return "/";
    }

    if (pathname.startsWith(`${AUTH_API_BASE_PATH}/`)) {
        return pathname.slice(AUTH_API_BASE_PATH.length);
    }

    return pathname.startsWith("/")
        ? pathname
        : `/${pathname}`;
}

/**
 * Determines whether an unverified session may call a Better Auth endpoint.
 *
 * @param       path    Better Auth endpoint path
 * @returns     True only for session inspection, sign-out, verification, and verification-email delivery.
 */
export function isUnverifiedAuthApiPathAllowed(path: string): boolean {

    return (UNVERIFIED_AUTH_API_ALLOWED_PATHS as readonly string[]).includes(path);
}

/**
 * Wraps a Better Auth route handler with the application's unverified-session API policy.
 *
 * @remarks     Unverified sessions may inspect their session, sign out, request a verification email, or complete
 *              email verification. The resend endpoint is restricted to the current unverified user's own email and
 *              reserves a persistent rate-limit attempt before Better Auth handles the request.
 * @remarks     Replaced verification tokens are rejected before Better Auth's stateless token validation.
 *
 * @param       handler    Original Better Auth route handler
 * @returns     A handler enforcing the unverified-session allowlist
 */
export function withUnverifiedAuthApiRestriction(handler: AuthApiHandler): AuthApiHandler {

    return async (request: Request): Promise<Response> => {
        const session = await auth.api.getSession({headers: request.headers});
        const requestUrl = new URL(request.url);
        const path = getBetterAuthApiPath(requestUrl.pathname);

        if (path === AUTH_PATHS.VERIFY_EMAIL && request.method === "GET") {
            const token = requestUrl.searchParams.get("token");
            if (token && await isRevokedVerificationToken(token)) {
                return Response.json({
                    code: AUTH_API_ERRORS.INVALID_VERIFICATION_TOKEN,
                    message: AUTH_API_ERROR_MESSAGES.INVALID_VERIFICATION_TOKEN,
                }, {status: 400});
            }
        }

        if (path === AUTH_PATHS.SEND_VERIFICATION_EMAIL) {
            if (!session) {
                return Response.json({
                    code: AUTH_API_ERRORS.AUTH_REQUIRED,
                    message: AUTH_API_ERROR_MESSAGES.AUTH_REQUIRED,
                }, {status: 401});
            }

            if (session.user.emailVerified) {
                return Response.json({
                    code: AUTH_API_ERRORS.EMAIL_ALREADY_VERIFIED,
                    message: AUTH_API_ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED,
                }, {status: 409});
            }

            let requestedEmail: unknown;
            try {
                const body = await request.clone().json() as { email?: unknown };
                requestedEmail = body.email;
            } catch {
                // Better Auth owns malformed request validation; no resend attempt is reserved.
                return handler(request);
            }

            if (typeof requestedEmail !== "string" ||
                requestedEmail.trim().toLowerCase() !== session.user.email.toLowerCase()) {
                return Response.json({
                    code: AUTH_API_ERRORS.EMAIL_NOT_VERIFIED,
                    message: AUTH_API_ERROR_MESSAGES.EMAIL_NOT_VERIFIED,
                }, {status: 403});
            }

            const reservation = await reserveVerificationEmailResend(session.user.id);
            if (!reservation.allowed) {
                const limitedByCooldown = reservation.reason === RESEND_REASON.COOLDOWN;
                const code = limitedByCooldown
                    ? AUTH_API_ERRORS.VERIFICATION_RESEND_COOLDOWN
                    : AUTH_API_ERRORS.VERIFICATION_RESEND_LIMIT;
                const message = limitedByCooldown
                    ? AUTH_API_ERROR_MESSAGES.VERIFICATION_RESEND_COOLDOWN
                    : AUTH_API_ERROR_MESSAGES.VERIFICATION_RESEND_LIMIT;

                return Response.json({
                    code,
                    message: AUTH_API_ERROR_MESSAGES.VERIFICATION_RESEND_RETRY_AFTER
                        .replace("{message}", message)
                        .replace("{seconds}", String(reservation.retryAfterSeconds)),
                    retryAfter: reservation.retryAfterSeconds,
                }, {
                    status: 429,
                    headers: {"Retry-After": String(reservation.retryAfterSeconds)},
                });
            }
        }

        if (session && !session.user.emailVerified && !isUnverifiedAuthApiPathAllowed(path)) {
            return Response.json({
                code: AUTH_API_ERRORS.EMAIL_NOT_VERIFIED,
                message: AUTH_API_ERROR_MESSAGES.EMAIL_NOT_VERIFIED,
            }, {status: 403});
        }

        return handler(request);
    };
}
