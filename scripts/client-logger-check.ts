/**
 * Throwaway sanity check for the client logger.
 * Run with: npx tsx scripts/client-logger-check.ts
 */
import assert from "node:assert/strict";
import {createLogger, logger} from "@/lib/alerts/client/logger";
import {logAlert} from "@/lib/alerts/client/log-alert";
import {createAlert} from "@/lib/alerts/create-alert";

type Captured = {method: string; value: unknown};

function capture(fn: () => void): Captured[] {
    const output: Captured[] = [];
    const original = {
        debug: console.debug,
        info: console.info,
        warn: console.warn,
        error: console.error,
    };

    for (const method of ["debug", "info", "warn", "error"] as const) {
        console[method] = ((...args: unknown[]) => {
            output.push({method, value: args.length === 1 ? args[0] : args});
        }) as typeof console[typeof method];
    }

    try {
        fn();
    } finally {
        console.debug = original.debug;
        console.info = original.info;
        console.warn = original.warn;
        console.error = original.error;
    }

    return output;
}

function withEnv(vars: Record<string, string | undefined>, fn: () => Captured[]): Captured[] {
    const previous = {...process.env};
    for (const [key, value] of Object.entries(vars)) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
    }

    try {
        return fn();
    } finally {
        for (const key of Object.keys(vars)) {
            if (previous[key] === undefined) delete process.env[key];
            else process.env[key] = previous[key];
        }
    }
}

// Development: configured verbosity and child bindings are preserved.
let output = withEnv({NODE_ENV: "development", NEXT_PUBLIC_ALERT_LOG_LEVEL: "debug"}, () =>
    capture(() => {
        logger.debug("debug event", {detail: "visible in development"});
        createLogger({scope: "auth"}).child({component: "login"}).info("login.started");
    }),
);
assert.deepEqual(output.map((entry) => entry.method), ["debug", "info"]);
assert.deepEqual(output[1].value, ["login.started", {scope: "auth", component: "login"}]);

// Production: info/debug are suppressed; warn/error contain only code/message/ref.
output = withEnv({NODE_ENV: "production", NEXT_PUBLIC_ALERT_LOG_LEVEL: "debug"}, () =>
    capture(() => {
        logger.debug("APP_DEBUG", {message: "debug"});
        logger.info("APP_INFO", {message: "info"});
        logger.warn("APP_NETWORK_ERROR", {
            message: "Contact alice@example.com. Bearer abc123",
            ref: "a1b2c3d4",
            password: "must-not-leak",
            err: new Error("internal server detail"),
        });
        logger.error("APP_UNKNOWN_ERROR", {
            message: "Something went wrong.",
            ref: "deadbeef",
            stack: "private stack",
        });
    }),
);
assert.deepEqual(output.map((entry) => entry.method), ["warn", "error"]);
const warning = output[0].value as Record<string, unknown>;
assert.deepEqual(Object.keys(warning).sort(), ["code", "message", "ref"]);
assert.equal(warning.code, "APP_NETWORK_ERROR");
assert.equal(warning.ref, "a1b2c3d4");
assert.match(String(warning.message), /\[REDACTED_EMAIL\]/);
assert.match(String(warning.message), /Bearer \[REDACTED\]/);
assert.ok(!JSON.stringify(output).includes("must-not-leak"));
assert.ok(!JSON.stringify(output).includes("internal server detail"));

// Registry client policy: network errors warn; server-owned failures stay silent in the browser.
output = withEnv({NODE_ENV: "development", NEXT_PUBLIC_ALERT_LOG_LEVEL: "debug"}, () =>
    capture(() => {
        logAlert(createAlert("APP_NETWORK_ERROR"));
        logAlert(createAlert("APP_RATE_LIMITED"));
    }),
);
assert.deepEqual(output.map((entry) => entry.method), ["warn"]);

console.info("client-logger-check: all assertions passed");
