import {AUTH_ALERT_CODES} from "@/features/alerts/constants/alert-codes";
import type {AlertCode} from "@/features/alerts/registry";
import {AUTH_HTTP_STATUS} from "@/features/auth/constants/integration";
import {PASSWORD_MIN_LENGTH} from "@/lib/constants/globals";

/**
 * better-auth error code -> alert code. Codes not listed here fall back to whatever the caller passes.
 */
const AUTH_ERROR_ALERT_CODES: Record<string, AlertCode> = {
    INVALID_EMAIL_OR_PASSWORD: "AUTH_LOGIN_INVALID_CREDENTIALS",
    USER_ALREADY_EXISTS: "AUTH_REGISTER_EMAIL_TAKEN",
    USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "AUTH_REGISTER_EMAIL_TAKEN",
    PASSWORD_TOO_SHORT: "AUTH_REGISTER_PASSWORD_TOO_SHORT",
    INVALID_EMAIL: "AUTH_REGISTER_EMAIL_INVALID",
    VALIDATION_ERROR: "APP_VALIDATION_FAILED",
};

/**
 * Parameters some mapped components need to fill their message.
 */
export const AUTH_ALERT_PARAMS = {min: PASSWORD_MIN_LENGTH};

/**
 * Reads the code and HTTP status out of a better-auth error, whatever its origin: the browser client returns a plain
 * object (`{code, status, message}`); server-side `auth.api.*` throws an APIError (`{body: {code}, statusCode}`).
 * Duck-typed on purpose, since better-auth's validation errors are not `instanceof` its APIError class.
 *
 * @param   {unknown}   error   The error returned or thrown by better-auth
 *
 * @return  {{code?: string, status?: number}}  The code and status, where present.
 */
export function readAuthError(error: unknown): { code?: string; status?: number } {
    if (typeof error !== "object" || error === null) {
        return {};
    }

    const candidate = error as {
        code?: unknown;
        status?: unknown;
        statusCode?: unknown;
        body?: { code?: unknown } | null;
    };

    const code = [candidate.code, candidate.body?.code].find((value) => typeof value === "string");
    const status = [candidate.statusCode, candidate.status].find((value) => typeof value === "number");

    return {code: code as string | undefined, status: status as number | undefined};
}

/**
 * Whether an error came from better-auth's API (as opposed to, say, the database being down). Only these are
 * treated as expected outcomes; anything else should be allowed to surface as an unexpected error.
 *
 * @param   {unknown}   error   The caught value
 *
 * @return  {boolean}   True if the error carries a better-auth error code.
 */
export function isAuthApiError(error: unknown): boolean {
    return readAuthError(error).code !== undefined;
}

/**
 * Maps a better-auth error to a registered alert code. HTTP 429 always maps to the rate-limit alert.
 *
 * @param   {unknown}   error       The error returned or thrown by better-auth
 * @param   {AlertCode} fallback    The alert to use when the error's code isn't recognized
 *
 * @return  {AlertCode} The alert code to raise.
 */
export function resolveAuthAlertCode(error: unknown, fallback: AlertCode): AlertCode {
    const {code, status} = readAuthError(error);

    if (status === AUTH_HTTP_STATUS.TOO_MANY_REQUESTS) {
        return AUTH_ALERT_CODES.RATE_LIMITED;
    }
    if (code !== undefined && Object.hasOwn(AUTH_ERROR_ALERT_CODES, code)) {
        return AUTH_ERROR_ALERT_CODES[code];
    }
    return fallback;
}
