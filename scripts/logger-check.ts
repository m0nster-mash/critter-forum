/**
 * Throwaway sanity check for the server logger. Safe to delete once real tests exist.
 * Run with: npx tsx scripts/logger-check.ts
 */
import {createAlert} from "@/lib/alerts/create-alert";
import {logAlert} from "@/lib/alerts/server/log-alert";
import {createLogger, logger} from "@/lib/alerts/server/logger";
import assert from "node:assert/strict";

type Captured = { method: string; line: string };

/** Runs fn with console methods captured, and returns what was written. */
function capture(fn: () => void): Captured[] {
    const out: Captured[] = [];
    const original: Record<string, unknown> = {};
    for (const method of ["debug", "info", "warn", "error"] as const) {
        original[method] = console[method];
        console[method] = (line: string) => void out.push({method, line});
    }
    try {
        fn();
    } finally {
        for (const method of ["debug", "info", "warn", "error"] as const) {
            console[method] = original[method] as never;
        }
    }
    return out;
}

function env(vars: Record<string, string | undefined>, fn: () => void): Captured[] {
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

const JSON_MODE = {LOG_FORMAT: "json", LOG_LEVEL: undefined, NODE_ENV: undefined};

// --- JSON shape, level -> console method mapping
let out = env(JSON_MODE, () => {
    logger.debug("d");
    logger.info("i");
    logger.warn("w");
    logger.error("e", {userId: 7});
});
assert.deepEqual(out.map((o) => o.method), ["debug", "info", "warn", "error"]);
const parsed = JSON.parse(out[3].line);
assert.equal(parsed.level, "error");
assert.equal(parsed.msg, "e");
assert.equal(parsed.userId, 7);
assert.ok(!Number.isNaN(Date.parse(parsed.time)));

// --- Error serialization: stack, cause chain, own props (e.g. pg `code`)
const root = Object.assign(new Error("db down"), {code: "ECONNREFUSED"});
const wrapped = new Error("save failed", {cause: root});
out = env(JSON_MODE, () => logger.error("x", {err: wrapped}));
const err = JSON.parse(out[0].line).err;
assert.equal(err.message, "save failed");
assert.match(err.stack, /save failed/);
assert.equal(err.cause.message, "db down");
assert.equal(err.cause.code, "ECONNREFUSED");

// --- Redaction (nested, arrays, error props) and circular safety
const circular: Record<string, unknown> = {name: "loop"};
circular.self = circular;
out = env(JSON_MODE, () =>
    logger.info("x", {
        password: "hunter2",
        nested: {accessToken: "abc", list: [{apiKey: "k"}], safe: "ok"},
        err: Object.assign(new Error("e"), {authorization: "Bearer z"}),
        circular,
    })
);
assert.ok(!out[0].line.includes("hunter2") && !out[0].line.includes("Bearer z") && !out[0].line.includes('"abc"'));
const redacted = JSON.parse(out[0].line);
assert.equal(redacted.password, "[REDACTED]");
assert.equal(redacted.nested.accessToken, "[REDACTED]");
assert.equal(redacted.nested.list[0].apiKey, "[REDACTED]");
assert.equal(redacted.nested.safe, "ok");
assert.equal(redacted.circular.self, "[Circular]");

// --- Odd values don't throw
assert.doesNotThrow(() => env(JSON_MODE, () => logger.info("x", {
    big: BigInt(10),
    fn: () => 1,
    sym: Symbol("s"),
    date: new Date(0)
})));
out = env(JSON_MODE, () => logger.error("thrown string", {err: "just a string"}));
assert.equal(JSON.parse(out[0].line).err, "just a string");

// --- Reserved keys can't clobber the envelope
out = env(JSON_MODE, () => logger.info("real", {msg: "fake", level: "fake"}));
const reserved = JSON.parse(out[0].line);
assert.equal(reserved.msg, "real");
assert.equal(reserved.level, "info");
assert.equal(reserved.ctx_msg, "fake");

// --- Level filtering and defaults
out = env({...JSON_MODE, LOG_LEVEL: "warn"}, () => {
    logger.debug("d");
    logger.info("i");
    logger.warn("w");
});
assert.deepEqual(out.map((o) => JSON.parse(o.line).msg), ["w"]);
out = env({LOG_FORMAT: undefined, LOG_LEVEL: undefined, NODE_ENV: "production"}, () => {
    logger.debug("d");
    logger.info("i");
});
assert.equal(out.length, 1, "production defaults to info");
assert.doesNotThrow(() => JSON.parse(out[0].line), "production defaults to JSON");
out = env({...JSON_MODE, LOG_LEVEL: "nonsense"}, () => logger.debug("d"));
assert.equal(out.length, 1, "invalid LOG_LEVEL falls back to default");

// --- Child bindings
out = env(JSON_MODE, () => createLogger({scope: "a"}).child({job: "b"}).info("m", {extra: 1}));
const child = JSON.parse(out[0].line);
assert.deepEqual([child.scope, child.job, child.extra], ["a", "b", 1]);

// --- Pretty format
out = env({LOG_FORMAT: "pretty", LOG_LEVEL: undefined, NODE_ENV: undefined, NO_COLOR: "1"}, () =>
    logger.error("boom", {path: "/login", err: wrapped})
);
const pretty = out[0].line;
assert.match(pretty, /^\d\d:\d\d:\d\d\.\d{3} ERROR boom \{"path":"\/login"\}/);
assert.match(pretty, /err →/);
assert.match(pretty, /save failed/);
assert.match(pretty, /caused by:/);
assert.match(pretty, /ECONNREFUSED/);

// --- logAlert honours registry log policy
out = env(JSON_MODE, () => {
    logAlert(createAlert("APP_NETWORK_ERROR"));          // server: false -> silent
    logAlert(createAlert("APP_RATE_LIMITED", {params: {seconds: 5}}));   // server: warn
    logAlert(createAlert("APP_UNKNOWN_ERROR", {ref: "r-1"}), {err: root}); // server: error
});
assert.equal(out.length, 2);
assert.equal(out[0].method, "warn");
assert.equal(JSON.parse(out[0].line).msg, "APP_RATE_LIMITED");
const alertLog = JSON.parse(out[1].line);
assert.equal(out[1].method, "error");
assert.equal(alertLog.ref, "r-1");
assert.equal(alertLog.userMessage, "Something went wrong. Please try again.");
assert.equal(alertLog.err.code, "ECONNREFUSED");

console.info("logger-check: all assertions passed");
