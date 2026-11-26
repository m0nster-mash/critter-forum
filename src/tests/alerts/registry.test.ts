/**
 * @fileOverview Verifies alert registry integrity, construction, and serialization.
 * @module features/alerts
 */
import {ALERT_PRESENTATIONS, ALERT_SEVERITIES} from "@/features/alerts/constants/alert-types";
import {createAlert, getAlertDefinition, isAlertCode} from "@/features/alerts/create-alert";
import {ALERT_REGISTRY, type AlertCode} from "@/features/alerts/registry";
import {Suite} from "@/tests/test-config";
import assert from "node:assert/strict";

const suite = new Suite("alerts/registry", 9);

suite.test("every registry definition has a valid severity, presentation, and message", () => {
    for (const [code, definition] of Object.entries(ALERT_REGISTRY)) {
        assert.ok(ALERT_SEVERITIES.includes(definition.severity), `${code}: invalid severity`);
        assert.ok(ALERT_PRESENTATIONS.includes(definition.presentation), `${code}: invalid presentation`);
        assert.ok(definition.message.length > 0, `${code}: empty message`);
    }
});

suite.test("registered defaults produce the expected public alert", () => {
    assert.deepEqual(createAlert("APP_UNKNOWN_ERROR"), {
        code: "APP_UNKNOWN_ERROR",
        severity: "error",
        message: "Something went wrong. Please try again.",
        presentation: "toast",
    });
});

suite.test("optional properties are omitted when absent", () => {
    const alert = createAlert("APP_UNKNOWN_ERROR");
    assert.ok(!("field" in alert));
    assert.ok(!("ref" in alert));
});

suite.test("explicit overrides replace registry defaults", () => {
    const alert = createAlert("APP_VALIDATION_FAILED", {
        severity: "error", presentation: "toast", field: "email", ref: "abc123",
    });
    assert.equal(alert.severity, "error");
    assert.equal(alert.presentation, "toast");
    assert.equal(alert.field, "email");
    assert.equal(alert.ref, "abc123");
});

suite.test("params interpolate known message tokens", () => {
    assert.equal(createAlert("APP_RATE_LIMITED", {params: {seconds: 30}}).message,
        "Too many attempts. Please try again in 30 seconds.");
});

suite.test("missing or unrelated params leave unresolved tokens intact", () => {
    assert.equal(createAlert("APP_RATE_LIMITED").message,
        "Too many attempts. Please try again in {seconds} seconds.");
    assert.ok(createAlert("APP_RATE_LIMITED", {params: {constructor: "x"}}).message.includes("{seconds}"));
});

suite.test("unknown runtime codes fall back to the generic alert", () => {
    const alert = createAlert("NOT_A_REAL_CODE" as AlertCode);
    assert.equal(alert.code, "APP_UNKNOWN_ERROR");
    assert.equal(getAlertDefinition("nope").severity, "error");
});

suite.test("default fields, presentation, lookup, and JSON serialization remain stable", () => {
    assert.equal(createAlert("AUTH_REGISTER_EMAIL_INVALID").field, "email");
    assert.equal(createAlert("AUTH_REGISTER_EMAIL_INVALID", {field: "other"}).field, "other");
    assert.equal(createAlert("APP_NOT_FOUND").presentation, "inline");
    assert.equal(isAlertCode("APP_NETWORK_ERROR"), true);
    assert.equal(isAlertCode("toString"), false);
    const alert = createAlert("APP_VALIDATION_FAILED", {field: "email", ref: "abc123"});
    assert.deepEqual(JSON.parse(JSON.stringify(alert)), alert);
});

suite.test("admin permission denial is registered as a safe expected warning", () => {
    assert.deepEqual(createAlert("ADMIN_PERMISSION_DENIED"), {
        code: "ADMIN_PERMISSION_DENIED",
        severity: "warn",
        message: "You don't have permission to perform this action.",
        presentation: "toast",
    });
    assert.deepEqual(ALERT_REGISTRY.ADMIN_PERMISSION_DENIED.log, {server: false, client: false});
});
