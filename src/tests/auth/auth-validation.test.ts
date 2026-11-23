/**
 * @fileOverview Verifies registration validation and auth API error normalization/mapping.
 * @module features/auth
 */
import {createAlert, isAlertCode} from "@/features/alerts/create-alert";
import {AUTH_ALERTS} from "@/features/auth/constants/alerts";
import {PASSWORD_MIN_LENGTH} from "@/features/auth/constants/policy";
import {isAuthApiError, readAuthError, resolveAuthAlertCode} from "@/features/auth/utilities/auth-errors";
import {validateRegistration} from "@/features/auth/validation";
import {Suite} from "@/tests/test-config";
import assert from "node:assert/strict";

const suite = new Suite("auth/validation", 8);
const valid = {name: "Ada", email: "ada@example.com", password: "x".repeat(PASSWORD_MIN_LENGTH)};

suite.test("accepts a valid registration", () => {
    assert.equal(validateRegistration(valid), null);
});

suite.test("reports a missing name against the name field", () => {
    const result = validateRegistration({...valid, name: ""});
    assert.equal(result?.code, "AUTH_REGISTER_NAME_REQUIRED");
    assert.equal(result?.field, "name");
});

suite.test("rejects malformed email addresses and accepts a valid boundary address", () => {
    for (const email of ["", "nope", "a@b", "a b@c.d", "@c.d"]) {
        assert.equal(validateRegistration({...valid, email})?.code, "AUTH_REGISTER_EMAIL_INVALID", `email: "${email}"`);
    }
    assert.equal(validateRegistration({...valid, email: "a@b.co"}), null);
});

suite.test("enforces the configured password minimum", () => {
    const result = validateRegistration({...valid, password: "x".repeat(PASSWORD_MIN_LENGTH - 1)});
    assert.equal(result?.code, "AUTH_REGISTER_PASSWORD_TOO_SHORT");
    assert.equal(result?.field, "password");
    assert.equal(result?.message, `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`);
});

suite.test("returns the first validation problem", () => {
    assert.equal(validateRegistration({name: "", email: "bad", password: ""})?.code,
        "AUTH_REGISTER_NAME_REQUIRED");
});

suite.test("normalizes client and server auth error shapes while rejecting unrelated values", () => {
    assert.deepEqual(readAuthError({code: "INVALID_EMAIL_OR_PASSWORD", status: 401, message: "private"}),
        {code: "INVALID_EMAIL_OR_PASSWORD", status: 401});
    assert.deepEqual(readAuthError({
            status: "UNPROCESSABLE_ENTITY",
            statusCode: 422,
            body: {code: "USER_ALREADY_EXISTS"}
        }),
        {code: "USER_ALREADY_EXISTS", status: 422});
    for (const junk of [null, undefined, "boom", 42, new Error("connect ECONNREFUSED")]) {
        const result = readAuthError(junk);
        assert.equal(result.code, undefined);
        assert.equal(result.status, undefined);
    }
    assert.equal(isAuthApiError({body: {code: "X"}}), true);
    assert.equal(isAuthApiError(new Error("db down")), false);
});

suite.test("maps known API failures and uses the caller fallback for unknown failures", () => {
    const map = (error: unknown) => resolveAuthAlertCode(error, "AUTH_LOGIN_FAILED");
    assert.equal(map({code: "INVALID_EMAIL_OR_PASSWORD", status: 401}), "AUTH_LOGIN_INVALID_CREDENTIALS");
    assert.equal(map({body: {code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"}}), "AUTH_REGISTER_EMAIL_TAKEN");
    assert.equal(map({body: {code: "USER_ALREADY_EXISTS"}}), "AUTH_REGISTER_EMAIL_TAKEN");
    assert.equal(map({body: {code: "PASSWORD_TOO_SHORT"}}), "AUTH_REGISTER_PASSWORD_TOO_SHORT");
    assert.equal(map({body: {code: "VALIDATION_ERROR"}, statusCode: 400}), "APP_VALIDATION_FAILED");
    assert.equal(map({status: 429, code: "INVALID_EMAIL_OR_PASSWORD"}), "AUTH_RATE_LIMITED");
    assert.equal(map({code: "SOMETHING_NEW"}), "AUTH_LOGIN_FAILED");
    assert.equal(map({code: "toString"}), "AUTH_LOGIN_FAILED");
    assert.equal(map(undefined), "AUTH_LOGIN_FAILED");
});

suite.test("every auth alert is registered, namespaced, and fully interpolated", () => {
    for (const code of Object.keys(AUTH_ALERTS)) {
        assert.ok(isAlertCode(code), `${code} is in the merged registry`);
        assert.ok(code.startsWith("AUTH_"), `${code} follows the naming convention`);
        assert.ok(!/\{\w+}/.test(createAlert(code as never, {params: {min: 1}}).message), `${code}: unresolved token`);
    }
});
