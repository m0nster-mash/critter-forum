/**
 * @fileOverview    Verifies browser logger filtering and production sanitization.
 * @module          features/alerts
 */

import {logClientAlert} from "@/features/alerts/client/log-alert";
import {clientLogger, createClientLogger} from "@/features/alerts/client/logger";
/* eslint-disable no-console -- These tests intentionally intercept console methods to verify logger output. */
import {createAlert} from "@/features/alerts/create-alert";
import {Suite} from "@/tests/test-config";
import assert from "node:assert/strict";

type Call = { method: string; args: unknown[] };
const suite = new Suite("alerts/client-logger", 7);
const methods = ["debug", "info", "warn", "error"] as const;

function runWithEnv(vars: Record<string, string | undefined>, fn: () => void): Call[] {
    const saved = {...process.env};
    const calls: Call[] = [];
    const originals = Object.fromEntries(methods.map((method) => [method, console[method]]));
    for (const [key, value] of Object.entries(vars)) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
    }
    for (const method of methods) {
        console[method] = ((...args: unknown[]) => {
            calls.push({method, args});
        }) as never;
    }
    try {
        fn();
        return calls;
    } finally {
        for (const method of methods) console[method] = originals[method] as never;
        for (const key of Object.keys(vars)) {
            if (saved[key] === undefined) delete process.env[key];
            else process.env[key] = saved[key]!;
        }
    }
}

const DEV = {NODE_ENV: "development", NEXT_PUBLIC_LOG_LEVEL: undefined};
const PROD = {NODE_ENV: "production", NEXT_PUBLIC_LOG_LEVEL: undefined};
const secretError = Object.assign(new TypeError("LEAK-MESSAGE-7f3a"), {detail: "LEAK-DETAIL-7f3a"});

suite.test("development logging retains detailed context", () => {
    const calls = runWithEnv(DEV, () => {
        clientLogger.debug("d");
        clientLogger.error("e", {err: secretError, password: "hunter2", scope: "x"});
    });
    assert.equal(calls.length, 2);
    assert.equal(calls[1].method, "error");
    const data = calls[1].args[1] as Record<string, unknown>;
    assert.equal(data.err, secretError);
    assert.equal(data.scope, "x");
});

suite.test("production defaults to warn and keeps only approved scalar fields", () => {
    const calls = runWithEnv(PROD, () => {
        clientLogger.debug("d");
        clientLogger.info("i");
        clientLogger.warn("w", {code: "APP_X", ref: "abc12345", status: 401, field: "email", note: "private"});
        clientLogger.error("e", {
            err: secretError,
            password: "hunter2",
            user: {email: "a@b.c"},
            scope: "route.render_error"
        });
    });
    assert.deepEqual(calls.map((call) => call.method), ["warn", "error"]);
    assert.deepEqual(calls[0].args[1], {code: "APP_X", ref: "abc12345", status: 401, field: "email"});
    assert.deepEqual(calls[1].args[1], {scope: "route.render_error", errorName: "TypeError"});
    const wire = JSON.stringify(calls);
    for (const secret of ["hunter2", "LEAK-MESSAGE-7f3a", "LEAK-DETAIL-7f3a", "a@b.c", "private"]) {
        assert.ok(!wire.includes(secret));
    }
});

suite.test("production drops non-scalar values and truncates long strings", () => {
    const calls = runWithEnv(PROD, () => clientLogger.error("e", {code: {nested: true}, ref: "x".repeat(500)}));
    const data = calls[0].args[1] as Record<string, unknown>;
    assert.ok(!("code" in data));
    assert.equal((data.ref as string).length, 120);
});

suite.test("production emits only the message when there is no context", () => {
    const calls = runWithEnv(PROD, () => clientLogger.error("just a message"));
    assert.deepEqual(calls[0].args, ["just a message"]);
});

suite.test("production remains sanitized when debug logging is enabled", () => {
    const calls = runWithEnv({...PROD, NEXT_PUBLIC_LOG_LEVEL: "debug"},
        () => clientLogger.debug("d", {err: secretError, ref: "r"}));
    assert.deepEqual(calls[0].args[1], {ref: "r", errorName: "TypeError"});
});

suite.test("configured levels filter output and invalid levels use the default", () => {
    const calls = runWithEnv({...DEV, NEXT_PUBLIC_LOG_LEVEL: "error"}, () => {
        clientLogger.warn("w");
        clientLogger.error("e");
    });
    assert.equal(calls.length, 1);
    const invalid = runWithEnv({...DEV, NEXT_PUBLIC_LOG_LEVEL: "garbage"}, () => clientLogger.debug("d"));
    assert.equal(invalid.length, 1);
});

suite.test("child bindings merge and alert logging follows registry policy", () => {
    let calls = runWithEnv(DEV, () => createClientLogger({scope: "a"}).child({job: "b"}).info("m", {extra: 1}));
    assert.deepEqual(calls[0].args[1], {scope: "a", job: "b", extra: 1});
    calls = runWithEnv(PROD, () => {
        logClientAlert(createAlert("AUTH_LOGIN_INVALID_CREDENTIALS"));
        logClientAlert(createAlert("APP_NETWORK_ERROR"));
        logClientAlert(createAlert("APP_UNKNOWN_ERROR", {ref: "r-1"}), {err: secretError, scope: "window.error"});
    });
    assert.equal(calls.length, 2);
    assert.equal(calls[0].method, "warn");
    assert.equal(calls[0].args[0], "APP_NETWORK_ERROR");
    assert.equal(calls[1].method, "error");
    assert.deepEqual(calls[1].args[1], {severity: "error", ref: "r-1", scope: "window.error", errorName: "TypeError"});
    assert.ok(!JSON.stringify(calls).includes("Something went wrong"));
});
