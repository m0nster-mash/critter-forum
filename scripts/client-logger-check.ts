/**
 * Throwaway sanity check for the client logger. Safe to delete once real tests exist.
 * Run with: npx tsx scripts/client-logger-check.ts
 */
import assert from "node:assert/strict";
import {createAlert} from "@/lib/alerts/create-alert";
import {logClientAlert} from "@/lib/alerts/client/log-alert";
import {createClientLogger, clientLogger} from "@/lib/alerts/client/logger";

type Call = { method: string; args: unknown[] };

function capture(fn: () => void): Call[] {
    const calls: Call[] = [];
    const original: Record<string, unknown> = {};
    for (const method of ["debug", "info", "warn", "error"] as const) {
        original[method] = console[method];
        console[method] = ((...args: unknown[]) => void calls.push({method, args})) as never;
    }
    try {
        fn();
    } finally {
        for (const method of ["debug", "info", "warn", "error"] as const) console[method] = original[method] as never;
    }
    return calls;
}

function withEnv(vars: Record<string, string | undefined>, fn: () => void): Call[] {
    const saved = {...process.env};
    for (const [key, value] of Object.entries(vars)) {
        if (value === undefined) delete process.env[key];
        else Object.assign(process.env, {[key]: value});
    }
    try {
        return capture(fn);
    } finally {
        for (const key of Object.keys(vars)) {
            if (saved[key] === undefined) delete process.env[key];
            else Object.assign(process.env, {[key]: saved[key]});
        }
    }
}

const DEV = {NODE_ENV: "development", NEXT_PUBLIC_LOG_LEVEL: undefined};
const PROD = {NODE_ENV: "production", NEXT_PUBLIC_LOG_LEVEL: undefined};
const secretError = Object.assign(new TypeError("LEAK-MESSAGE-7f3a"), {detail: "LEAK-DETAIL-7f3a"});

// --- Development: verbose, full objects passed through, all levels
let calls = withEnv(DEV, () => {
    clientLogger.debug("d");
    clientLogger.error("e", {err: secretError, password: "hunter2", scope: "x"});
});
assert.equal(calls.length, 2);
assert.equal(calls[1].method, "error");
const devData = calls[1].args[1] as Record<string, unknown>;
assert.equal(devData.err, secretError, "dev passes the real Error through for devtools");
assert.equal(devData.scope, "x");

// --- Production: default level warn, sanitized
calls = withEnv(PROD, () => {
    clientLogger.debug("d");
    clientLogger.info("i");
    clientLogger.warn("w", {code: "APP_X", ref: "abc12345", status: 401, field: "email", note: "free text"});
    clientLogger.error("e", {err: secretError, password: "hunter2", user: {email: "a@b.c"}, scope: "route.render_error"});
});
assert.deepEqual(calls.map((c) => c.method), ["warn", "error"], "production defaults to warn+");
assert.deepEqual(calls[0].args[1], {code: "APP_X", ref: "abc12345", status: 401, field: "email"}, "only safe keys survive");
const prodError = calls[1].args[1] as Record<string, unknown>;
assert.deepEqual(prodError, {scope: "route.render_error", errorName: "TypeError"});
const wire = JSON.stringify(calls);
for (const secret of ["hunter2", "LEAK-MESSAGE-7f3a", "LEAK-DETAIL-7f3a", "a@b.c", "free text"]) {
    assert.ok(!wire.includes(secret), `production output must not contain: ${secret}`);
}

// --- Production: objects/arrays under safe keys are dropped, long strings truncated
calls = withEnv(PROD, () => clientLogger.error("e", {code: {nested: true}, ref: "x".repeat(500)}));
const sanitized = calls[0].args[1] as Record<string, unknown>;
assert.ok(!("code" in sanitized));
assert.equal((sanitized.ref as string).length, 120);

// --- No context -> message only
calls = withEnv(PROD, () => clientLogger.error("just a message"));
assert.deepEqual(calls[0].args, ["just a message"]);

// --- NEXT_PUBLIC_LOG_LEVEL overrides the level, never the detail
calls = withEnv({...PROD, NEXT_PUBLIC_LOG_LEVEL: "debug"}, () => clientLogger.debug("d", {err: secretError, ref: "r"}));
assert.equal(calls.length, 1);
assert.deepEqual(calls[0].args[1], {ref: "r", errorName: "TypeError"}, "prod stays sanitized even at debug level");
calls = withEnv({...DEV, NEXT_PUBLIC_LOG_LEVEL: "error"}, () => {
    clientLogger.warn("w");
    clientLogger.error("e");
});
assert.equal(calls.length, 1);
calls = withEnv({...DEV, NEXT_PUBLIC_LOG_LEVEL: "garbage"}, () => clientLogger.debug("d"));
assert.equal(calls.length, 1, "invalid level falls back to the default");

// --- Child bindings
calls = withEnv(DEV, () => createClientLogger({scope: "a"}).child({job: "b"}).info("m", {extra: 1}));
assert.deepEqual(calls[0].args[1], {scope: "a", job: "b", extra: 1});

// --- logClientAlert honours the registry client policy
calls = withEnv(PROD, () => {
    logClientAlert(createAlert("AUTH_LOGIN_INVALID_CREDENTIALS"));          // client: false -> silent
    logClientAlert(createAlert("APP_NETWORK_ERROR"));                       // client: warn
    logClientAlert(createAlert("APP_UNKNOWN_ERROR", {ref: "r-1"}), {err: secretError, scope: "window.error"}); // error
});
assert.equal(calls.length, 2);
assert.equal(calls[0].method, "warn");
assert.equal(calls[0].args[0], "APP_NETWORK_ERROR");
assert.equal(calls[1].method, "error");
assert.deepEqual(calls[1].args[1], {severity: "error", ref: "r-1", scope: "window.error", errorName: "TypeError"});
assert.ok(!JSON.stringify(calls).includes("Something went wrong"), "userMessage is development-only");

console.info("client-logger-check: all assertions passed");
