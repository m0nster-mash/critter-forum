/**
 * Throwaway sanity check for auth validation and better-auth error mapping. Safe to delete once real tests exist.
 * Run with: npx tsx scripts/auth-check.ts
 */
import {AUTH_HTTP_STATUS, BETTER_AUTH_ERROR_CODES} from "@/features/auth/constants/integration";
import assert from "node:assert/strict";
import {AUTH_ALERTS} from "@/features/auth/constants/alerts";
import {isAuthApiError, readAuthError, resolveAuthAlertCode} from "@/features/auth/utilities/auth-errors";
import {validateRegistration} from "@/features/auth/validation";
import {createAlert, isAlertCode} from "@/features/alerts/create-alert";
import {PASSWORD_MIN_LENGTH} from "@/lib/constants/globals";

const valid = {name: "Ada", email: "ada@example.com", password: "x".repeat(PASSWORD_MIN_LENGTH)};

// --- validation: order, fields, interpolation, boundary
assert.equal(validateRegistration(valid), null);
assert.equal(validateRegistration({...valid, name: ""})?.code, "AUTH_REGISTER_NAME_REQUIRED");
assert.equal(validateRegistration({...valid, name: ""})?.field, "name");
for (const email of ["", "nope", "a@b", "a b@c.d", "@c.d"]) {
    assert.equal(validateRegistration({...valid, email})?.code, "AUTH_REGISTER_EMAIL_INVALID", `email: "${email}"`);
}
assert.equal(validateRegistration({...valid, email: "a@b.co"}), null);
const tooShort = validateRegistration({...valid, password: "x".repeat(PASSWORD_MIN_LENGTH - 1)});
assert.equal(tooShort?.code, "AUTH_REGISTER_PASSWORD_TOO_SHORT");
assert.equal(tooShort?.field, "password");
assert.equal(tooShort?.message, `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`);
assert.equal(validateRegistration({name: "", email: "bad", password: ""})?.code, "AUTH_REGISTER_NAME_REQUIRED", "first problem wins");

// --- readAuthError: client shape, server APIError shape, junk
assert.deepEqual(readAuthError({code: BETTER_AUTH_ERROR_CODES.INVALID_EMAIL_OR_PASSWORD, status: 401, message: "x"}), {code: "INVALID_EMAIL_OR_PASSWORD", status: 401});
assert.deepEqual(readAuthError({status: "UNPROCESSABLE_ENTITY", statusCode: 422, body: {code: BETTER_AUTH_ERROR_CODES.USER_ALREADY_EXISTS}}), {code: "USER_ALREADY_EXISTS", status: 422});
for (const junk of [null, undefined, "boom", 42, new Error("connect ECONNREFUSED")]) {
    const {code, status} = readAuthError(junk);
    assert.equal(code, undefined, `no code for ${String(junk)}`);
    assert.equal(status, undefined, `no status for ${String(junk)}`);
}
assert.equal(isAuthApiError({body: {code: "X"}}), true);
assert.equal(isAuthApiError(new Error("db down")), false, "infrastructure errors are not auth API errors");

// --- mapping
const map = (error: unknown) => resolveAuthAlertCode(error, "AUTH_LOGIN_FAILED");
assert.equal(map({code: BETTER_AUTH_ERROR_CODES.INVALID_EMAIL_OR_PASSWORD, status: 401}), "AUTH_LOGIN_INVALID_CREDENTIALS");
assert.equal(map({body: {code: BETTER_AUTH_ERROR_CODES.USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL}}), "AUTH_REGISTER_EMAIL_TAKEN");
assert.equal(map({body: {code: BETTER_AUTH_ERROR_CODES.USER_ALREADY_EXISTS}}), "AUTH_REGISTER_EMAIL_TAKEN");
assert.equal(map({body: {code: BETTER_AUTH_ERROR_CODES.PASSWORD_TOO_SHORT}}), "AUTH_REGISTER_PASSWORD_TOO_SHORT");
assert.equal(map({body: {code: BETTER_AUTH_ERROR_CODES.VALIDATION_ERROR}, statusCode: 400}), "APP_VALIDATION_FAILED");
assert.equal(map({status: AUTH_HTTP_STATUS.TOO_MANY_REQUESTS, code: BETTER_AUTH_ERROR_CODES.INVALID_EMAIL_OR_PASSWORD}), "AUTH_RATE_LIMITED", "429 wins over the code");
assert.equal(map({code: "SOMETHING_NEW"}), "AUTH_LOGIN_FAILED", "unknown code -> caller's fallback");
assert.equal(map({code: "toString"}), "AUTH_LOGIN_FAILED", "prototype keys are not codes");
assert.equal(map(undefined), "AUTH_LOGIN_FAILED");

// --- registry integrity: every mapped target and every AUTH_ alert is registered and well-formed
for (const code of Object.keys(AUTH_ALERTS)) {
    assert.ok(isAlertCode(code), `${code} is merged into the registry`);
    assert.ok(code.startsWith("AUTH_"), `${code} follows the naming convention`);
    const alert = createAlert(code as never, {params: {min: 1}});
    assert.ok(!/\{\w+}/.test(alert.message), `${code}: no unfilled tokens`);
}

console.info("auth-check: all assertions passed");
