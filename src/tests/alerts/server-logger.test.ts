/**
 * @fileOverview Verifies server logger formatting, redaction, serialization, and alert policy.
 * @module features/alerts
 */
import {createAlert} from "@/features/alerts/create-alert";
import {logAlert} from "@/features/alerts/server/log-alert";
import {createLogger, logger} from "@/features/alerts/server/logger";
import {Suite} from "@/tests/test-config";
import assert from "node:assert/strict";

type Captured = { method: string; line: string };
const suite = new Suite("alerts/server-logger", 10);
const methods = ["debug", "info", "warn", "error"] as const;

function runWithEnv(vars: Record<string, string | undefined>, fn: () => void): Captured[] {
    const saved = {...process.env};
    const out: Captured[] = [];
    const originals = Object.fromEntries(methods.map((method) => [method, console[method]]));
    for (const [key, value] of Object.entries(vars)) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
    }
    for (const method of methods) {
        console[method] = ((line: string) => {
            out.push({method, line});
        }) as never;
    }
    try {
        fn();
        return out;
    } finally {
        for (const method of methods) console[method] = originals[method] as never;
        for (const key of Object.keys(vars)) {
            if (saved[key] === undefined) delete process.env[key];
            else process.env[key] = saved[key]!;
        }
    }
}

const JSON_MODE = {LOG_FORMAT: "json", LOG_LEVEL: undefined, NODE_ENV: undefined};

suite.test("JSON output maps levels to console methods and includes a timestamp", () => {
    const out = runWithEnv(JSON_MODE, () => {
        logger.debug("d");
        logger.info("i");
        logger.warn("w");
        logger.error("e", {userId: 7});
    });
    assert.deepEqual(out.map((entry) => entry.method), [...methods]);
    const parsed = JSON.parse(out[3].line);
    assert.equal(parsed.level, "error");
    assert.equal(parsed.msg, "e");
    assert.equal(parsed.userId, 7);
    assert.ok(!Number.isNaN(Date.parse(parsed.time)));
});

suite.test("errors serialize stack, cause chain, and own properties", () => {
    const root = Object.assign(new Error("db down"), {code: "ECONNREFUSED"});
    const wrapped = new Error("save failed", {cause: root});
    const out = runWithEnv(JSON_MODE, () => logger.error("x", {err: wrapped}));
    const error = JSON.parse(out[0].line).err;
    assert.equal(error.message, "save failed");
    assert.match(error.stack, /save failed/);
    assert.equal(error.cause.message, "db down");
    assert.equal(error.cause.code, "ECONNREFUSED");
});

suite.test("nested secrets are redacted and circular references are safe", () => {
    const circular: Record<string, unknown> = {name: "loop"};
    circular.self = circular;
    const out = runWithEnv(JSON_MODE, () => logger.info("x", {
        password: "hunter2", nested: {accessToken: "abc", list: [{apiKey: "k"}], safe: "ok"},
        err: Object.assign(new Error("e"), {authorization: "Bearer z"}), circular,
    }));
    assert.ok(!out[0].line.includes("hunter2") && !out[0].line.includes("Bearer z") && !out[0].line.includes('"abc"'));
    const data = JSON.parse(out[0].line);
    assert.equal(data.password, "[REDACTED]");
    assert.equal(data.nested.accessToken, "[REDACTED]");
    assert.equal(data.nested.list[0].apiKey, "[REDACTED]");
    assert.equal(data.nested.safe, "ok");
    assert.equal(data.circular.self, "[Circular]");
});

suite.test("database bound parameters are removed from error messages and stacks", () => {
    const queryError = new Error('Failed query: select * from "user" where email = $1\nparams: victim@example.com,$argon2id$HASHVALUE');
    const out = runWithEnv(JSON_MODE, () => logger.error("x", {
        err: queryError,
        nested: {inner: new Error("Failed query: insert\nparams: second@example.com")},
    }));
    assert.ok(!out[0].line.includes("victim@example.com") &&
        !out[0].line.includes("HASHVALUE") &&
        !out[0].line.includes("second@example.com"));
    const error = JSON.parse(out[0].line).err;
    assert.match(error.message, /^Failed query: select \* from "user" where email = \$1\nparams: \[REDACTED\]$/);
    assert.match(error.stack, /params: \[REDACTED\]\n\s+at /);
});

suite.test("unusual values and non-Error throwables do not crash serialization", () => {
    assert.doesNotThrow(() => runWithEnv(JSON_MODE, () =>
        logger.info("x", {big: BigInt(10), fn: () => 1, sym: Symbol("s"), date: new Date(0)})));
    const out = runWithEnv(JSON_MODE, () => logger.error("thrown string", {err: "just a string"}));
    assert.equal(JSON.parse(out[0].line).err, "just a string");
});

suite.test("reserved context keys cannot overwrite the log envelope", () => {
    const out = runWithEnv(JSON_MODE, () => logger.info("real", {msg: "fake", level: "fake"}));
    const data = JSON.parse(out[0].line);
    assert.equal(data.msg, "real");
    assert.equal(data.level, "info");
    assert.equal(data.ctx_msg, "fake");
});

suite.test("level filtering, production defaults, and invalid levels are deterministic", () => {
    let out = runWithEnv({...JSON_MODE, LOG_LEVEL: "warn"}, () => {
        logger.debug("d");
        logger.info("i");
        logger.warn("w");
    });
    assert.deepEqual(out.map((entry) => JSON.parse(entry.line).msg), ["w"]);
    out = runWithEnv({LOG_FORMAT: undefined, LOG_LEVEL: undefined, NODE_ENV: "production"}, () => {
        logger.debug("d");
        logger.info("i");
    });
    assert.equal(out.length, 1);
    assert.doesNotThrow(() => JSON.parse(out[0].line));
    out = runWithEnv({...JSON_MODE, LOG_LEVEL: "nonsense"}, () => logger.debug("d"));
    assert.equal(out.length, 1);
});

suite.test("child logger bindings merge with call context", () => {
    const out = runWithEnv(JSON_MODE, () => createLogger({scope: "a"}).child({job: "b"}).info("m", {extra: 1}));
    const data = JSON.parse(out[0].line);
    assert.deepEqual([data.scope, data.job, data.extra], ["a", "b", 1]);
});

suite.test("pretty output includes readable errors and causes", () => {
    const root = Object.assign(new Error("db down"), {code: "ECONNREFUSED"});
    const wrapped = new Error("save failed", {cause: root});
    const out = runWithEnv({LOG_FORMAT: "pretty", LOG_LEVEL: undefined, NODE_ENV: undefined, NO_COLOR: "1"},
        () => logger.error("boom", {path: "/login", err: wrapped}));
    assert.match(out[0].line, /^\d\d:\d\d:\d\d\.\d{3} ERROR boom \{"path":"\/login"\}/);
    assert.match(out[0].line, /err →/);
    assert.match(out[0].line, /save failed/);
    assert.match(out[0].line, /caused by:/);
    assert.match(out[0].line, /ECONNREFUSED/);
});

suite.test("alert logging follows registry policy and includes the matching reference", () => {
    const root = Object.assign(new Error("db down"), {code: "ECONNREFUSED"});
    const out = runWithEnv(JSON_MODE, () => {
        logAlert(createAlert("APP_NETWORK_ERROR"));
        logAlert(createAlert("APP_RATE_LIMITED", {params: {seconds: 5}}));
        logAlert(createAlert("APP_UNKNOWN_ERROR", {ref: "r-1"}), {err: root});
    });
    assert.equal(out.length, 2);
    assert.equal(out[0].method, "warn");
    assert.equal(JSON.parse(out[0].line).msg, "APP_RATE_LIMITED");
    const entry = JSON.parse(out[1].line);
    assert.equal(out[1].method, "error");
    assert.equal(entry.ref, "r-1");
    assert.equal(entry.userMessage, "Something went wrong. Please try again.");
    assert.equal(entry.err.code, "ECONNREFUSED");
});
