/**
 * Throwaway sanity check for the alert foundation. Safe to delete once real tests exist.
 * Run with: npx tsx scripts/components-check.ts
 */
import {createAlert, getAlertDefinition, isAlertCode} from "@/features/alerts/create-alert";
import {ALERT_REGISTRY, AlertCode} from "@/features/alerts/registry";
import {ALERT_PRESENTATIONS, ALERT_SEVERITIES} from "@/features/alerts/types";
import assert from "node:assert/strict";

// TODO: clean up this class; replace magic strings, migrate out consts and types, etc

// Registry integrity
for (const [code, def] of Object.entries(ALERT_REGISTRY)) {
    assert.ok(ALERT_SEVERITIES.includes(def.severity), `${code}: bad severity`);
    assert.ok(ALERT_PRESENTATIONS.includes(def.presentation), `${code}: bad presentation`);
    assert.ok(def.message.length > 0, `${code}: empty message`);
}

// Defaults come from the registry
const unknown = createAlert("APP_UNKNOWN_ERROR");
assert.deepEqual(unknown, {
    code: "APP_UNKNOWN_ERROR",
    severity: "error",
    message: "Something went wrong. Please try again.",
    presentation: "toast",
});
assert.ok(!("field" in unknown) && !("ref" in unknown), "optional keys must be omitted, not undefined");

// Overrides
const overridden = createAlert("APP_VALIDATION_FAILED", {
    severity: "error",
    presentation: "toast",
    field: "email",
    ref: "abc123",
});
assert.equal(overridden.severity, "error");
assert.equal(overridden.presentation, "toast");
assert.equal(overridden.field, "email");
assert.equal(overridden.ref, "abc123");

// Params interpolation
assert.equal(
    createAlert("APP_RATE_LIMITED", {params: {seconds: 30}}).message,
    "Too many attempts. Please try again in 30 seconds."
);
assert.equal(
    createAlert("APP_RATE_LIMITED").message,
    "Too many attempts. Please try again in {seconds} seconds.",
    "missing params leave the token intact"
);
assert.equal(
    createAlert("APP_RATE_LIMITED", {params: {constructor: "x"}}).message.includes("{seconds}"),
    true,
    "unrelated/prototype param keys are ignored"
);

// Unknown code at runtime
const stale = createAlert("NOT_A_REAL_CODE" as AlertCode);
assert.equal(stale.code, "APP_UNKNOWN_ERROR", "unknown codes fall back");

// Serializable: survives a JSON round trip unchanged
assert.deepEqual(JSON.parse(JSON.stringify(overridden)), overridden);

// Lookup helpers
assert.equal(isAlertCode("APP_NETWORK_ERROR"), true);
assert.equal(isAlertCode("toString"), false, "prototype keys must not count as codes");
assert.equal(getAlertDefinition("nope").severity, "error");

console.info("components-check: all assertions passed");
