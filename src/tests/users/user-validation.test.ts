/**
 * @fileOverview    Verifies profile, email, and password settings form validation.
 * @module          features/users
 */

import {PASSWORD_MIN_LENGTH} from "@/features/auth/constants/policy";
import {USER_ALERT_CODES} from "@/features/users/constants/alerts";
import {validateEmailAddress, validatePasswordChange, validateProfileName} from "@/features/users/validation";
import {Suite} from "@/tests/test-config";
import assert from "node:assert/strict";

const suite = new Suite("users/settings-validation", 8);

suite.test("rejects an empty or whitespace-only profile name", () => {
    assert.equal(validateProfileName("")?.code, USER_ALERT_CODES.PROFILE_NAME_REQUIRED);
    assert.equal(validateProfileName("   ")?.code, USER_ALERT_CODES.PROFILE_NAME_REQUIRED);
});

suite.test("accepts a non-empty profile name", () => {
    assert.equal(validateProfileName("Critter Keeper"), null);
});

suite.test("rejects malformed email addresses", () => {
    for (const email of ["", "invalid", "a@b", "a b@example.com"]) {
        assert.equal(validateEmailAddress(email)?.code, USER_ALERT_CODES.EMAIL_INVALID);
    }
});

suite.test("accepts a well-formed email address", () => {
    assert.equal(validateEmailAddress("person@example.com"), null);
});

suite.test("requires the current password", () => {
    assert.equal(validatePasswordChange({
        currentPassword: "",
        newPassword: "x".repeat(PASSWORD_MIN_LENGTH),
        confirmPassword: "x".repeat(PASSWORD_MIN_LENGTH),
    })?.code, USER_ALERT_CODES.PASSWORD_CURRENT_REQUIRED);
});

suite.test("enforces the configured new-password minimum", () => {
    assert.equal(validatePasswordChange({
        currentPassword: "current",
        newPassword: "x".repeat(PASSWORD_MIN_LENGTH - 1),
        confirmPassword: "x".repeat(PASSWORD_MIN_LENGTH - 1),
    })?.code, USER_ALERT_CODES.PASSWORD_TOO_SHORT);
});

suite.test("requires matching new-password confirmation", () => {
    assert.equal(validatePasswordChange({
        currentPassword: "current",
        newPassword: "x".repeat(PASSWORD_MIN_LENGTH),
        confirmPassword: "y".repeat(PASSWORD_MIN_LENGTH),
    })?.code, USER_ALERT_CODES.PASSWORD_CONFIRMATION_MISMATCH);
});

suite.test("accepts a complete valid password change", () => {
    const password = "x".repeat(PASSWORD_MIN_LENGTH);
    assert.equal(validatePasswordChange({
        currentPassword: "current",
        newPassword: password,
        confirmPassword: password,
    }), null);
});
