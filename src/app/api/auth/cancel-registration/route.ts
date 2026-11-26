/**
 * @fileOverview    Handles password-confirmed cancellation of an unverified registration.
 * @module          features/auth
 */

import {AUTH_API_ERRORS, AUTH_API_ERROR_MESSAGES} from "@/features/auth/constants/api";
import {cancelPendingRegistration} from "@/features/auth/server/cancel-registration";
import {auth} from "@/lib/db/auth/auth";

/**
 * Validates that the state-changing request originated from the same origin as this endpoint.
 */
function isSameOriginRequest(request: Request): boolean {
    const origin = request.headers.get("origin");
    if (!origin) return false;

    try {
        return new URL(origin).origin === new URL(request.url).origin;
    } catch {
        return false;
    }
}

/**
 * Cancels the current unverified user's registration after confirming their password.
 */
export async function POST(request: Request): Promise<Response> {
    if (!isSameOriginRequest(request)) {
        return Response.json({
            code: AUTH_API_ERRORS.CANCEL_REGISTRATION_FORBIDDEN,
            message: AUTH_API_ERROR_MESSAGES.CANCEL_REGISTRATION_FORBIDDEN,
        }, {status: 403});
    }

    const session = await auth.api.getSession({headers: request.headers});
    if (!session) {
        return Response.json({
            code: AUTH_API_ERRORS.CANCEL_REGISTRATION_AUTH_REQUIRED,
            message: AUTH_API_ERROR_MESSAGES.CANCEL_REGISTRATION_AUTH_REQUIRED,
        }, {status: 401});
    }

    if (session.user.emailVerified) {
        return Response.json({
            code: AUTH_API_ERRORS.EMAIL_ALREADY_VERIFIED,
            message: AUTH_API_ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED,
        }, {status: 409});
    }

    let password: unknown;
    try {
        const body = await request.json() as {password?: unknown};
        password = body.password;
    } catch {
        return Response.json({
            code: AUTH_API_ERRORS.CANCEL_REGISTRATION_INVALID_REQUEST,
            message: AUTH_API_ERROR_MESSAGES.CANCEL_REGISTRATION_INVALID_REQUEST,
        }, {status: 400});
    }

    if (typeof password !== "string" || password.length === 0 || password.length > 128) {
        return Response.json({
            code: AUTH_API_ERRORS.CANCEL_REGISTRATION_INVALID_REQUEST,
            message: AUTH_API_ERROR_MESSAGES.CANCEL_REGISTRATION_INVALID_REQUEST,
        }, {status: 400});
    }

    try {
        await auth.api.verifyPassword({
            body: {password},
            headers: request.headers,
        });
    } catch {
        return Response.json({
            code: AUTH_API_ERRORS.CANCEL_REGISTRATION_INVALID_PASSWORD,
            message: AUTH_API_ERROR_MESSAGES.CANCEL_REGISTRATION_INVALID_PASSWORD,
        }, {status: 401});
    }

    const deleted = await cancelPendingRegistration(session.user.id);
    if (!deleted) {
        return Response.json({
            code: AUTH_API_ERRORS.CANCEL_REGISTRATION_NOT_AVAILABLE,
            message: AUTH_API_ERROR_MESSAGES.CANCEL_REGISTRATION_NOT_AVAILABLE,
        }, {status: 409});
    }

    return Response.json({success: true});
}
